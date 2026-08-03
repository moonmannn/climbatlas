import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const schema = read("supabase/schema.sql");
const migration = read("supabase/migrations/20260803_private_my_atlas.sql");
const logMigration = read("supabase/migrations/20260803_private_my_atlas_11_logs.sql");
const provider = read("src/components/UserAtlasProvider.tsx");
const logProvider = read("src/components/UserClimbingLogsProvider.tsx");
const logForm = read("src/components/ClimbingLogForm.tsx");
const myAtlas = read("src/components/MyAtlasClient.tsx");
const destinationControl = read("src/components/UserDestinationControl.tsx");

const errors = [];

function requireMatch(source, pattern, message) {
  if (!pattern.test(source)) errors.push(message);
}

for (const sql of [schema, migration]) {
  requireMatch(sql, /create table if not exists public\.saved_destinations/i, "saved_destinations table is missing.");
  requireMatch(sql, /create table if not exists public\.climbing_dna_profiles/i, "climbing_dna_profiles table is missing.");
  requireMatch(sql, /alter table public\.saved_destinations enable row level security/i, "saved_destinations RLS is missing.");
  requireMatch(sql, /alter table public\.climbing_dna_profiles enable row level security/i, "climbing_dna_profiles RLS is missing.");
  requireMatch(sql, /using \(auth\.uid\(\) = user_id\)[\s\S]*with check \(auth\.uid\(\) = user_id\)/i, "Private user_id policy is missing.");
  requireMatch(sql, /create or replace function public\.clear_my_atlas_data\(\)/i, "clear_my_atlas_data is missing.");
  requireMatch(sql, /if auth\.uid\(\) is null/i, "clear_my_atlas_data lacks an authentication guard.");
  requireMatch(sql, /delete from public\.saved_destinations where user_id = auth\.uid\(\)/i, "Destination clearing is not scoped to auth.uid().");
  requireMatch(sql, /delete from public\.climbing_dna_profiles where user_id = auth\.uid\(\)/i, "DNA clearing is not scoped to auth.uid().");
  requireMatch(sql, /revoke all on function public\.clear_my_atlas_data\(\) from public/i, "Public clear function permission was not revoked.");
}

for (const sql of [schema, logMigration]) {
  requireMatch(sql, /create table if not exists public\.climbing_logs/i, "climbing_logs table is missing.");
  requireMatch(sql, /alter table public\.climbing_logs enable row level security/i, "climbing_logs RLS is missing.");
  requireMatch(sql, /create policy "climbing logs are private"[\s\S]*using \(auth\.uid\(\) = user_id\)[\s\S]*with check \(auth\.uid\(\) = user_id\)/i, "Climbing log owner policy is missing.");
  requireMatch(sql, /delete from public\.climbing_logs where user_id = auth\.uid\(\)/i, "Climbing log clearing is not scoped to auth.uid().");
  requireMatch(sql, /create or replace function public\.save_climbing_log\(/i, "Atomic climbing log save function is missing.");
  requireMatch(sql, /if p_session_date > current_date/i, "Future climbing log dates are not rejected.");
  requireMatch(sql, /on conflict \(user_id, destination_slug, route_id\)[\s\S]*status = 'climbed'/i, "Completed logs do not atomically mark routes climbed.");
  requireMatch(sql, /revoke all on function public\.save_climbing_log[\s\S]*from public/i, "Public climbing log function permission was not revoked.");
}

requireMatch(provider, /\.from\("saved_destinations"\)/, "UserAtlasProvider does not load saved destinations.");
requireMatch(provider, /\.from\("climbing_dna_profiles"\)/, "UserAtlasProvider does not sync Climbing DNA.");
requireMatch(provider, /getDnaStorageOwner/, "DNA owner isolation is missing.");
requireMatch(provider, /rpc\("clear_my_atlas_data"\)/, "Private data clear RPC is not wired.");
requireMatch(logProvider, /\.from\("climbing_logs"\)/, "Climbing log provider does not load private logs.");
requireMatch(logProvider, /rpc\("save_climbing_log"/, "Climbing log provider does not use the atomic save function.");
requireMatch(logProvider, /resolveRouteId/, "Climbing logs do not normalize legacy route aliases.");
requireMatch(logForm, /max=\{todayInputValue\(\)\}/, "Climbing log form does not block future dates.");
requireMatch(logForm, /maxLength=\{2000\}/, "Climbing log note length is not bounded in the UI.");

for (const tab of ["overview", "routes", "journal", "places", "dna", "account"]) {
  requireMatch(myAtlas, new RegExp(`tab=\\"${tab}\\"`), `My Atlas ${tab} panel is missing.`);
}

requireMatch(myAtlas, /role="tablist"/, "My Atlas semantic tab list is missing.");
requireMatch(myAtlas, /role="tabpanel"/, "My Atlas semantic tab panels are missing.");
requireMatch(myAtlas, /new Blob\(\[JSON\.stringify/, "Private JSON export is missing.");
requireMatch(myAtlas, /Confirm permanent clear/, "Private data clear confirmation is missing.");
requireMatch(myAtlas, /climbingLogs: logs/, "Private JSON export omits climbing logs.");
requireMatch(myAtlas, /Climbed · date not recorded/, "Legacy climbed records are not preserved transparently.");
requireMatch(destinationControl, /aria-pressed=\{isSaved\}/, "Destination save control lacks pressed state semantics.");

const forbiddenSocialTables = [
  "public.follows",
  "public.friendships",
  "public.activity_feed",
  "public.route_comments",
  "public.route_ratings"
];

for (const table of forbiddenSocialTables) {
  if (schema.includes(table)) {
    errors.push(`Public social table is out of scope: ${table}`);
  }
}

if (errors.length) {
  console.error("Private My Atlas validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Private My Atlas validation passed.");
console.log("- private destination saves and DNA sync tables are protected by RLS");
console.log("- account-scoped clear and export controls are present");
console.log("- six private My Atlas views are present, including the climbing journal");
console.log("- climbing logs are private, date-checked, and atomically update completed status");
console.log("- public social tables remain out of scope");
