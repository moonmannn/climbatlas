import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { loadRouteProject } from "./routes/load-route-project.mjs";

const root = process.cwd();
const port = Number(process.env.CLIMBATLAS_SMOKE_PORT ?? 3200);
const remoteBaseUrl = readArgument("--base-url");
const baseUrl = remoteBaseUrl
  ? remoteBaseUrl.replace(/\/$/, "")
  : `http://127.0.0.1:${port}`;
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const { destinationsModule, publicRoutesModule } = loadRouteProject(root);
const publicRoutes = publicRoutesModule.getPublicRouteRecords();
const representativeRoutes = destinationsModule.destinations.map((destination) => {
  const route = publicRoutes.find(
    (item) => item.destination.slug === destination.slug
  )?.route;

  if (!route) {
    throw new Error(`No public route is available for ${destination.slug}.`);
  }

  return {
    path: `/destinations/${destination.slug}/routes/${route.id}`,
    expectedText: route.name,
    kind: "route"
  };
});
const targets = [
  { path: "/", expectedText: "ClimbAtlas", kind: "page" },
  { path: "/explore", expectedText: "ClimbAtlas", kind: "page" },
  { path: "/climbing-dna", expectedText: "Climbing DNA", kind: "page" },
  { path: "/feedback", expectedText: "ClimbAtlas", kind: "page" },
  { path: "/my-atlas", expectedText: "ClimbAtlas", kind: "page" },
  ...destinationsModule.destinations.map((destination) => ({
    path: `/destinations/${destination.slug}`,
    expectedText: destination.name,
    kind: "destination"
  })),
  ...representativeRoutes
];
const forbiddenPublicText = [
  "pick candidate",
  "needs upgrade",
  "imported index",
  "editorial draft",
  "metadata-only",
  "source-backed"
];
let serverOutput = "";

const server = remoteBaseUrl
  ? undefined
  : spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
      cwd: root,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true
    });

server?.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server?.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

try {
  if (server) await waitForServer();

  for (const target of targets) {
    const response = await fetchWithTimeout(`${baseUrl}${target.path}`);
    if (!response.ok) {
      throw new Error(`${target.path} returned HTTP ${response.status}.`);
    }

    const html = await response.text();
    if (!html.includes(target.expectedText)) {
      throw new Error(`${target.path} did not render ${target.expectedText}.`);
    }

    if (
      target.kind === "destination" &&
      !html.includes('id="route-explorer-filters"')
    ) {
      throw new Error(`${target.path} is missing Route Explorer filters.`);
    }

    const normalizedHtml = html.toLowerCase();
    const leakedText = forbiddenPublicText.find((text) =>
      normalizedHtml.includes(text)
    );
    if (leakedText) {
      throw new Error(`${target.path} exposes internal copy: ${leakedText}.`);
    }
  }

  console.log(
    `${remoteBaseUrl ? "Deployment" : "Production"} smoke passed: ${targets.length} pages checked ` +
      `(${destinationsModule.destinations.length} destinations, ` +
      `${representativeRoutes.length} representative routes) at ${baseUrl}.`
  );
} finally {
  server?.kill();
}

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Production server exited early.\n${serverOutput}`);
    }

    try {
      const response = await fetchWithTimeout(baseUrl, 1000);
      if (response.ok) return;
    } catch {
      // The server may still be starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Production server did not become ready.\n${serverOutput}`);
}

function readArgument(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  const value = process.argv[index + 1]?.trim();
  if (!value) throw new Error(`${name} requires a value.`);
  return value;
}

async function fetchWithTimeout(url, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { redirect: "follow", signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}
