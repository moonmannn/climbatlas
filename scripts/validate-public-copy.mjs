import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const issues = [];

const archivedPublicComponents = new Set([
  "src/components/ExplorerBoard.tsx",
  "src/components/RouteFinder.tsx",
  "src/components/RouteMetadataCard.tsx"
]);

const publicUiFiles = [
  ...walk(path.join(root, "src", "app")),
  ...walk(path.join(root, "src", "components"))
]
  .filter((file) => /\.(ts|tsx)$/.test(file))
  .filter((file) => !archivedPublicComponents.has(relative(file)));

const textFiles = [
  ...walk(path.join(root, "src")),
  ...walk(path.join(root, "docs", "content")),
  path.join(root, "README.md")
].filter((file) => /\.(ts|tsx|md|json|csv)$/.test(file));

const mojibakePatterns = [
  { label: "Unicode replacement character", pattern: /\uFFFD/u },
  { label: "common UTF-8 mojibake marker", pattern: /(?:鈥|Ã|Â|â€)/u },
  { label: "known corrupted source label", pattern: /鏉ユ簮璺嚎绱㈠紩/u }
];

const internalPublicPatterns = [
  /pick candidate/i,
  /needs upgrade/i,
  /imported index/i,
  /no outbound link/i,
  /editorial draft/i,
  /metadata-only/i,
  /source-backed route index/i,
  /route directory and quiz/i,
  /路线目录和小测试/u,
  /路线小测试/u,
  /\bV\d+(?:\.\d+)?\s+(?:starts|begins)\b/i,
  /V\d+(?:\.\d+)?\s*先做/u
];

for (const file of textFiles) {
  const contents = fs.readFileSync(file, "utf8");
  for (const { label, pattern } of mojibakePatterns) {
    const match = pattern.exec(contents);
    if (match) {
      issues.push(`${relative(file)}:${lineAt(contents, match.index)} contains ${label}`);
    }
  }
}

for (const file of publicUiFiles) {
  const contents = fs.readFileSync(file, "utf8");
  for (const pattern of internalPublicPatterns) {
    const match = pattern.exec(contents);
    if (match) {
      issues.push(
        `${relative(file)}:${lineAt(contents, match.index)} exposes retired or internal copy: ${match[0]}`
      );
    }
  }
}

const localizedContentPath = path.join(root, "src", "data", "localizedContent.ts");
const localizedContent = fs.readFileSync(localizedContentPath, "utf8");
const destinationCopy = localizedContent.split(
  "export const routeLocalizedContent"
)[0];
const destinationDescriptionCount = (
  destinationCopy.match(/description:\s*\{/g) ?? []
).length;
const destinationPatterns = [
  /\b(?:Pick|Choose) it when\b/i,
  /\bthis card\b/i,
  /\bdaydream\b/i,
  /\bplayground\b/i,
  /\bworld-class\b/i,
  /路线小测试/u,
  /\bsession\b/i,
  /\bego\b/i
];

for (const pattern of destinationPatterns) {
  const match = pattern.exec(destinationCopy);
  if (match) {
    issues.push(
      `src/data/localizedContent.ts:${lineAt(destinationCopy, match.index)} has a destination-copy review trigger: ${match[0]}`
    );
  }
}

if (destinationDescriptionCount !== 20) {
  issues.push(
    `Expected 20 localized destination introductions, found ${destinationDescriptionCount}.`
  );
}

if (issues.length > 0) {
  console.error("Public copy validation failed:");
  console.error(issues.map((issue) => `- ${issue}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Public copy valid: ${publicUiFiles.length} active UI files, ` +
      `${textFiles.length} UTF-8 text files, and ${destinationDescriptionCount} destination introductions checked.`
  );
}

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function relative(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function lineAt(contents, index) {
  return contents.slice(0, index).split("\n").length;
}
