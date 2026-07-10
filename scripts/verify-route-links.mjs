import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const csvPath = path.join(projectRoot, "src", "data", "route-metadata.csv");
const timeoutMs = 12000;
const concurrency = 8;

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (character === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += character;
    }
  }

  values.push(current);
  return values;
}

function parseCsv(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    const row = { __line: index + 2 };

    headers.forEach((header, headerIndex) => {
      row[header] = values[headerIndex]?.trim() ?? "";
    });

    return row;
  });
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ClimbAtlas-Link-Audit/1.0",
        Range: "bytes=0-0"
      },
      redirect: "follow",
      signal: controller.signal
    });

    await response.body?.cancel();

    if (response.status >= 200 && response.status < 400) {
      return { category: "ok", status: response.status, url };
    }

    if ([401, 403, 429].includes(response.status)) {
      return { category: "blocked", status: response.status, url };
    }

    if ([404, 410].includes(response.status)) {
      return { category: "broken", status: response.status, url };
    }

    return { category: "unknown", status: response.status, url };
  } catch (error) {
    return {
      category: "unknown",
      error: error instanceof Error ? error.message : String(error),
      url
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function mapWithConcurrency(values, worker) {
  const results = new Array(values.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(values[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, runWorker)
  );

  return results;
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8")).filter(
  (row) => row.publicationStatus === "published"
);
const urlUsage = new Map();

for (const row of rows) {
  for (const field of ["sourceUrl", "externalUrl"]) {
    const url = row[field];

    if (!urlUsage.has(url)) {
      urlUsage.set(url, []);
    }

    urlUsage.get(url).push(
      `${row.destinationSlug}:${row.routeId} (${field}, line ${row.__line})`
    );
  }
}

const urls = Array.from(urlUsage.keys());
console.log(
  `Checking ${urls.length} unique URLs used by ${rows.length} published metadata records...`
);
const results = await mapWithConcurrency(urls, checkUrl);
const grouped = results.reduce((groups, result) => {
  groups[result.category] = [...(groups[result.category] ?? []), result];
  return groups;
}, {});

for (const category of ["broken", "blocked", "unknown"]) {
  const entries = grouped[category] ?? [];

  if (entries.length === 0) {
    continue;
  }

  console.log(`\n${category.toUpperCase()} (${entries.length})`);

  for (const entry of entries) {
    const detail = entry.status ?? entry.error ?? "no status";
    console.log(`- [${detail}] ${entry.url}`);
    console.log(
      urlUsage
        .get(entry.url)
        .map((usage) => `  - ${usage}`)
        .join("\n")
    );
  }
}

console.log(
  `\nSummary: ${(grouped.ok ?? []).length} ok, ` +
    `${(grouped.blocked ?? []).length} blocked, ` +
    `${(grouped.unknown ?? []).length} unknown, ` +
    `${(grouped.broken ?? []).length} broken.`
);

if ((grouped.broken ?? []).length > 0) {
  process.exitCode = 1;
}
