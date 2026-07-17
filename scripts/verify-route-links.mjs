import process from "node:process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadRouteProject } from "./routes/load-route-project.mjs";

const timeoutMs = Number(process.env.CLIMBATLAS_LINK_TIMEOUT_MS ?? 12000);
const concurrency = Number(process.env.CLIMBATLAS_LINK_CONCURRENCY ?? 8);
const allowInconclusive = process.argv.includes("--allow-inconclusive");
const summaryOnly = process.argv.includes("--summary-only");

function readArgValue(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const outputPath = readArgValue("--output");

function isHttpUrl(url) {
  try {
    return ["http:", "https:"].includes(new URL(url).protocol);
  } catch {
    return false;
  }
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "ClimbAtlas-Link-Audit/2.0",
        Range: "bytes=0-0"
      },
      redirect: "follow",
      signal: controller.signal
    });

    await response.body?.cancel();

    if (response.status >= 200 && response.status < 400) {
      return { category: "ok", status: response.status, url };
    }

    if ([401, 402, 403, 429].includes(response.status)) {
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

function addUsage(urlUsage, invalidUrls, url, usage) {
  if (!isHttpUrl(url)) {
    invalidUrls.push({ url, usage });
    return;
  }

  if (!urlUsage.has(url)) {
    urlUsage.set(url, []);
  }

  urlUsage.get(url).push(usage);
}

const { publicRoutesModule } = loadRouteProject();
const publicRoutes = publicRoutesModule.getPublicRouteRecords();
const urlUsage = new Map();
const invalidUrls = [];

for (const { destination, route } of publicRoutes) {
  const key = `${destination.slug}:${route.id}`;
  const facts = publicRoutesModule.toPublicRouteFacts(route);

  for (const source of facts.sourceRecords) {
    addUsage(
      urlUsage,
      invalidUrls,
      source.sourceUrl,
      `${key} (source: ${source.label})`
    );
  }

  for (const resource of facts.externalResources) {
    addUsage(
      urlUsage,
      invalidUrls,
      resource.url,
      `${key} (external resource: ${resource.title})`
    );
  }
}

const urls = Array.from(urlUsage.keys());
console.log(
  `Checking ${urls.length} unique URLs used by ${publicRoutes.length} public routes...`
);

if (invalidUrls.length > 0) {
  console.log(`\nINVALID (${invalidUrls.length})`);
  for (const entry of invalidUrls) {
    console.log(`- ${entry.url || "[empty URL]"}`);
    console.log(`  - ${entry.usage}`);
  }
}

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

  if (summaryOnly) {
    continue;
  }

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

const counts = {
  ok: (grouped.ok ?? []).length,
  blocked: (grouped.blocked ?? []).length,
  unknown: (grouped.unknown ?? []).length,
  broken: (grouped.broken ?? []).length,
  invalid: invalidUrls.length
};

const hostSummary = results.reduce((summary, result) => {
  const hostname = new URL(result.url).hostname;
  const hostCounts = summary[hostname] ?? {
    ok: 0,
    blocked: 0,
    unknown: 0,
    broken: 0
  };
  hostCounts[result.category] += 1;
  summary[hostname] = hostCounts;
  return summary;
}, {});

console.log("\nBy host:");
for (const [hostname, hostCounts] of Object.entries(hostSummary).sort(
  ([left], [right]) => left.localeCompare(right)
)) {
  console.log(
    `- ${hostname}: ${hostCounts.ok} ok, ${hostCounts.blocked} blocked, ` +
      `${hostCounts.unknown} unknown, ${hostCounts.broken} broken`
  );
}

console.log(
  `\nSummary: ${counts.ok} ok, ${counts.blocked} blocked, ` +
    `${counts.unknown} unknown, ${counts.broken} broken, ${counts.invalid} invalid.`
);

if (outputPath) {
  const resolvedOutputPath = path.resolve(outputPath);
  mkdirSync(path.dirname(resolvedOutputPath), { recursive: true });
  writeFileSync(
    resolvedOutputPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        publicRouteCount: publicRoutes.length,
        uniqueUrlCount: urls.length,
        counts,
        hostSummary,
        invalidUrls,
        results: results.map((result) => ({
          ...result,
          usages: urlUsage.get(result.url) ?? []
        }))
      },
      null,
      2
    )}\n`
  );
  console.log(`Report written to ${resolvedOutputPath}`);
}

if (counts.broken > 0 || counts.invalid > 0) {
  process.exitCode = 1;
} else if (
  counts.ok + counts.blocked === 0 &&
  counts.unknown > 0 &&
  !allowInconclusive
) {
  console.error(
    "Link audit was inconclusive: no URL could be reached. Check network access or rerun with --allow-inconclusive."
  );
  process.exitCode = 2;
}
