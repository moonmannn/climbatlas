import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const issues = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function requireText(source, expected, label) {
  if (!source.includes(expected)) issues.push(`${label} is missing: ${expected}`);
}

function forbidText(source, forbidden, label) {
  if (source.includes(forbidden)) issues.push(`${label} still contains: ${forbidden}`);
}

const home = read("src/components/HomeClient.tsx");
const destination = read("src/components/DestinationDnaMatch.tsx");
const routePanel = read("src/components/RouteDnaMatchPanel.tsx");
const routeIndex = read("src/components/RouteIndex.tsx");
const result = read("src/components/ClimbingDnaResult.tsx");

forbidText(home, "const matchScores", "Homepage");
requireText(home, "loadDnaProfile", "Homepage profile gate");
requireText(home, "DNA preference match", "Homepage score label");
requireText(destination, "Your DNA preference match", "Destination score label");
requireText(routePanel, "DNA preference match", "Route detail score label");
requireText(routeIndex, "DNA preference match", "Route explorer score label");
requireText(result, "Preference profile score (0–100)", "DNA profile scale");
requireText(result, "DNA preference matches", "DNA result match label");
forbidText(routePanel, "confidenceLabel", "Route detail public confidence");
forbidText(routePanel, "置信度", "Route detail public confidence");

if (issues.length > 0) {
  console.error("Public score validation failed:");
  console.error(issues.map((issue) => `- ${issue}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Public scores are profile-gated and labeled as preference signals.");
}
