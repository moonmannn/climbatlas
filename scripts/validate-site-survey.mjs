import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let cases = 0;

function loadTypeScript(relativePath, globals = {}, dependencies = {}) {
  const filename = path.join(root, relativePath);
  const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  const exports = {};
  const sandbox = {
    exports,
    module: { exports },
    URL,
    Request,
    Response,
    Buffer,
    AbortSignal,
    ...globals,
    require(name) {
      assert.ok(Object.hasOwn(dependencies, name), `Unexpected dependency: ${name}`);
      return dependencies[name];
    }
  };
  vm.runInNewContext(output, sandbox, { filename });
  return sandbox.module.exports;
}

const survey = loadTypeScript("src/lib/siteSurvey.ts");
const plain = (value) => JSON.parse(JSON.stringify(value));
const fixture = () => ({
  version: "site-value-v1",
  submissionId: "10101010-2020-4030-8040-505050505050",
  locale: "zh",
  answers: {
    experience: "indoor",
    features: ["home", "map", "destination"],
    clarity: 4,
    fun: 3,
    discovery: "yes",
    returnReasons: ["inspiration", "compare-routes"],
    improvement: "  Synthetic validation response.  "
  },
  context: {
    source: "deployment-check",
    medium: "test",
    campaign: "qa",
    entryPath: "/destinations/yosemite-usa"
  }
});

async function check(name, run) {
  await run();
  cases += 1;
}

await check("A complete submission preserves stable analytical codes and trims free text", () => {
  const result = plain(survey.parseSiteSurveySubmission(fixture()));
  assert.equal(result.version, survey.surveyVersion);
  assert.equal(result.answers.improvement, "Synthetic validation response.");
  assert.deepEqual(result.answers.features, ["home", "map", "destination"]);
  assert.equal(result.submissionId, fixture().submissionId);
});

await check("Non-climbers can submit no-need and unable-to-rate answers without a low score", () => {
  const input = fixture();
  Object.assign(input.answers, { experience: "never", features: ["home"], fun: null, discovery: "no-need", returnReasons: ["unsure"], improvement: "" });
  const result = survey.parseSiteSurveySubmission(input);
  assert.ok(result);
  assert.equal(result.answers.fun, null);
  assert.equal(result.answers.discovery, "no-need");
});

for (const field of ["experience", "features", "clarity", "fun", "discovery", "returnReasons"]) {
  await check(`Missing required answer is rejected: ${field}`, () => {
    const input = fixture();
    delete input.answers[field];
    assert.equal(survey.parseSiteSurveySubmission(input), null);
  });
}

const invalidMutations = [
  ["wrong version", (input) => { input.version = "unknown-version"; }],
  ["malformed submission ID", (input) => { input.submissionId = "not-a-uuid"; }],
  ["unsupported locale", (input) => { input.locale = "fr"; }],
  ["unknown experience", (input) => { input.answers.experience = "expert"; }],
  ["empty feature list", (input) => { input.answers.features = []; }],
  ["unknown feature", (input) => { input.answers.features = ["billing"]; }],
  ["duplicate feature", (input) => { input.answers.features = ["map", "map"]; }],
  ["string rating", (input) => { input.answers.clarity = "4"; }],
  ["low rating", (input) => { input.answers.clarity = 0; }],
  ["high rating", (input) => { input.answers.fun = 6; }],
  ["fractional rating", (input) => { input.answers.fun = 2.5; }],
  ["unknown discovery answer", (input) => { input.answers.discovery = "maybe"; }],
  ["empty return reason list", (input) => { input.answers.returnReasons = []; }],
  ["unknown return reason", (input) => { input.answers.returnReasons = ["checkout"]; }],
  ["duplicate return reason", (input) => { input.answers.returnReasons = ["journal", "journal"]; }],
  ["no-return combined with a reason", (input) => { input.answers.returnReasons = ["no-return", "journal"]; }],
  ["unsure combined with a reason", (input) => { input.answers.returnReasons = ["unsure", "inspiration"]; }],
  ["two exclusive answers combined", (input) => { input.answers.returnReasons = ["no-return", "unsure"]; }],
  ["overlong optional text", (input) => { input.answers.improvement = "测".repeat(1001); }],
  ["non-text optional answer", (input) => { input.answers.improvement = {}; }]
];

for (const [name, mutate] of invalidMutations) {
  await check(`Malformed data is rejected: ${name}`, () => {
    const input = fixture();
    mutate(input);
    assert.equal(survey.parseSiteSurveySubmission(input), null);
  });
}

await check("Both rating endpoints and the text length boundary are accepted", () => {
  const input = fixture();
  Object.assign(input.answers, { clarity: 1, fun: 5, improvement: "a".repeat(1000), returnReasons: ["no-return"] });
  assert.ok(survey.parseSiteSurveySubmission(input));
});

await check("Unknown fields are excluded from the saved payload", () => {
  const input = fixture();
  input.email = "synthetic@example.invalid";
  input.answers.accountId = "synthetic-account";
  input.context.referrer = "https://example.invalid/private?token=synthetic";
  const result = survey.parseSiteSurveySubmission(input);
  assert.ok(result);
  assert.ok(!JSON.stringify(result).includes("synthetic-account"));
  assert.ok(!JSON.stringify(result).includes("example.invalid"));
});

await check("Context rejects URL-like labels and private or query-bearing paths", () => {
  const result = plain(survey.normalizeSiteSurveyContext({ source: "synthetic@example.invalid", medium: "https://example.invalid", campaign: "x".repeat(65), entryPath: "/climbing-dna/result?answers=synthetic" }));
  assert.deepEqual(result, { source: "unattributed", medium: null, campaign: null, entryPath: "/feedback" });
  for (const entryPath of ["/admin", "/api/survey", "https://example.invalid/", "/feedback#private"]) {
    assert.equal(survey.normalizeSiteSurveyContext({ entryPath }).entryPath, "/feedback");
  }
});

await check("Known public paths and simple channel labels remain usable", () => {
  for (const entryPath of ["/", "/explore", "/feedback", "/my-atlas", "/climbing-dna", "/climbing-dna/result", "/destinations/yosemite-usa/routes/the-nose-el-capitan"]) {
    const result = survey.normalizeSiteSurveyContext({ source: "climbing-club", medium: "social", campaign: "site-test-2026-10", entryPath });
    assert.equal(result.entryPath, entryPath);
    assert.equal(result.source, "climbing-club");
  }
});

await check("Server rendering has a safe un-attributed fallback", () => {
  assert.deepEqual(plain(survey.getSiteSurveyContext()), { source: "unattributed", medium: null, campaign: null, entryPath: "/feedback" });
});

await check("Attribution survives internal navigation and a new explicit channel replaces it", () => {
  const data = new Map();
  const browserWindow = {
    location: { href: "https://climbatlas.example/?utm_source=climbing-club&utm_medium=social&utm_campaign=round1&token=synthetic" },
    sessionStorage: { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
  };
  const clientSurvey = loadTypeScript("src/lib/siteSurvey.ts", { window: browserWindow });
  const first = plain(clientSurvey.getSiteSurveyContext());
  assert.equal(first.source, "climbing-club");
  assert.equal(first.entryPath, "/");
  browserWindow.location.href = "https://climbatlas.example/feedback";
  assert.deepEqual(plain(clientSurvey.getSiteSurveyContext()), first);
  assert.ok(![...data.values()].join("").includes("token"));
  browserWindow.location.href = "https://climbatlas.example/explore?utm_source=students&utm_campaign=round2";
  assert.equal(clientSurvey.getSiteSurveyContext().source, "students");
  assert.equal(clientSurvey.getSiteSurveyContext().entryPath, "/explore");
});

await check("Blocked or corrupt browser storage does not prevent submitting", () => {
  for (const sessionStorage of [
    { getItem: () => "{broken", setItem() {} },
    { getItem() { throw new Error("Storage blocked"); }, setItem() { throw new Error("Storage blocked"); } }
  ]) {
    const clientSurvey = loadTypeScript("src/lib/siteSurvey.ts", { window: { location: { href: "https://climbatlas.example/feedback?utm_source=students" }, sessionStorage } });
    assert.equal(clientSurvey.getSiteSurveyContext().source, "students");
  }
});

let rpcError = null;
let throwOnRpc = false;
const rpcCalls = [];
const logged = [];
const apiProcess = { env: { NEXT_PUBLIC_SUPABASE_URL: "https://synthetic.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "synthetic-test-key" } };
const api = loadTypeScript("src/app/api/survey/route.ts", { process: apiProcess, console: { error: (...args) => logged.push(args) } }, {
  "@/lib/siteSurvey": survey,
  "@supabase/supabase-js": {
    createClient(_url, _key, options) {
      assert.equal(options.auth.persistSession, false);
      return {
        async rpc(name, params) {
          rpcCalls.push({ name, params });
          if (throwOnRpc) throw new Error("Synthetic transport failure");
          return { error: rpcError };
        }
      };
    }
  }
});
const request = (body = fixture(), headers = {}) => new Request("https://climbatlas.example/api/survey", {
  method: "POST",
  headers: { "content-type": "application/json", ...headers },
  body: typeof body === "string" ? body : JSON.stringify(body)
});

for (const [name, body, headers, status] of [
  ["malformed JSON", "{broken", {}, 400],
  ["invalid answers", {}, {}, 400],
  ["cross-site submission", fixture(), { origin: "https://different.example" }, 403],
  ["wrong content type", fixture(), { "content-type": "text/plain" }, 415],
  ["declared oversized request", fixture(), { "content-length": "12001" }, 413],
  ["streamed oversized request", " ".repeat(12001), {}, 413]
]) {
  await check(`API rejects ${name} before storage`, async () => {
    const previousCalls = rpcCalls.length;
    const result = await api.POST(request(body, headers));
    assert.equal(result.status, status);
    assert.equal((await result.json()).saved, false);
    assert.equal(rpcCalls.length, previousCalls);
  });
}

await check("API success follows the write-only RPC and keeps the submission ID on retries", async () => {
  for (let index = 0; index < 2; index += 1) {
    const result = await api.POST(request(fixture(), { origin: "https://climbatlas.example" }));
    assert.equal(result.status, 201);
    assert.equal((await result.json()).saved, true);
    assert.equal(result.headers.get("cache-control"), "no-store");
    assert.equal(rpcCalls.at(-1).name, "submit_site_survey");
    assert.equal(rpcCalls.at(-1).params.p_submission_id, fixture().submissionId);
    assert.equal(rpcCalls.at(-1).params.p_answers.improvement, "Synthetic validation response.");
  }
});

await check("Storage errors cannot produce a false success or leak answer text", async () => {
  rpcError = { code: "SYNTHETIC", message: "Synthetic validation response." };
  const result = await api.POST(request());
  assert.equal(result.status, 503);
  const text = await result.text();
  assert.ok(!text.includes("Synthetic validation response."));
  assert.equal(JSON.parse(text).saved, false);
  assert.ok(!JSON.stringify(logged).includes("Synthetic validation response."));
  rpcError = null;
  throwOnRpc = true;
  const failedTransport = await api.POST(request());
  assert.equal(failedTransport.status, 503);
  assert.equal((await failedTransport.json()).saved, false);
  throwOnRpc = false;
});

await check("Missing server configuration reports unavailable without a storage attempt", async () => {
  delete apiProcess.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const previousCalls = rpcCalls.length;
  const result = await api.POST(request());
  assert.equal(result.status, 503);
  assert.equal((await result.json()).saved, false);
  assert.equal(rpcCalls.length, previousCalls);
});

console.log(`Site survey validation passed: ${cases} cases (answer integrity, attribution privacy, storage failures, and HTTP validation). No external data was written.`);
