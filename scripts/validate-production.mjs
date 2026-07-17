import { spawnSync } from "node:child_process";
import process from "node:process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npmExecPath = process.env.npm_execpath;
const includeLinks = process.argv.includes("--with-links");
const steps = [
  { label: "Route schema", args: ["run", "routes:validate-schema"] },
  { label: "Route catalog", args: ["run", "routes:validate"] },
  { label: "Public route parity", args: ["run", "routes:validate-public"] },
  {
    label: "Route audit (read-only)",
    args: ["run", "routes:audit", "--", "--no-write"]
  },
  { label: "Grade parser", args: ["run", "grades:validate"] },
  { label: "Public copy", args: ["run", "copy:validate"] },
  { label: "Climbing DNA", args: ["run", "dna:validate"] },
  { label: "Route DNA", args: ["run", "routes:dna-validate"] },
  { label: "Public score labels", args: ["run", "scores:validate-public"] },
  ...(includeLinks
    ? [{ label: "Public route links", args: ["run", "routes:verify-links"] }]
    : []),
  {
    label: "TypeScript",
    args: ["run", "typecheck", "--", "--incremental", "false"]
  },
  { label: "Production build", args: ["run", "build"] },
  { label: "Production HTTP smoke", args: ["run", "smoke:production"] }
];

console.log(
  `ClimbAtlas production validation${includeLinks ? " with live links" : ""}`
);

for (const [index, step] of steps.entries()) {
  console.log(`\n[${index + 1}/${steps.length}] ${step.label}`);
  const command = npmExecPath ? process.execPath : npmCommand;
  const args = npmExecPath ? [npmExecPath, ...step.args] : step.args;
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.error) {
    console.error(`${step.label} could not start: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`${step.label} failed with exit code ${result.status}.`);
    process.exit(result.status ?? 1);
  }
}

console.log(`\nProduction validation passed: ${steps.length} checks completed.`);
