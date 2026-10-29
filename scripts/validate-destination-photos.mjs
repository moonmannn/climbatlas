import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { loadRouteProject } from "./routes/load-route-project.mjs";

const root = process.cwd();
const galleries = JSON.parse(await fs.readFile(path.join(root, "src/data/destination-photos.json"), "utf8"));
const provenance = JSON.parse(await fs.readFile(path.join(root, "docs/media/destination-photo-provenance.json"), "utf8"));
const { destinationsModule: { destinations } } = loadRouteProject(root);
const seen = new Set();
const issues = [];
let totalBytes = 0;
for (const destination of destinations) {
  const photos = galleries[destination.slug];
  if (!photos) { issues.push(`${destination.slug}: no reviewed selection recorded`); continue; }
  if (photos.length !== destination.images?.length) issues.push(`${destination.slug}: published gallery differs from reviewed selection`);
  if (photos.length !== provenance[destination.slug]?.length) issues.push(`${destination.slug}: incomplete provenance`);
  for (const [index, photo] of photos.entries()) {
    const evidence = provenance[destination.slug]?.[index];
    const label = `${destination.slug} image ${index + 1}`;
    if (!photo.src.startsWith(`/images/destinations/${destination.slug}/`)) issues.push(`${label}: unexpected image path`);
    for (const field of ["title", "alt", "altZh", "caption", "captionZh", "credit", "sourceUrl", "license", "licenseUrl"]) {
      if (!photo[field]?.trim()) issues.push(`${label}: missing ${field}`);
      if (photo[field]?.includes("\ufffd")) issues.push(`${label}: invalid text encoding`);
    }
    if (!evidence?.locationEvidence || !evidence?.verifiedAt) issues.push(`${label}: missing location/licensing review`);
    if (!evidence?.sourceMetadata) issues.push(`${label}: original source metadata was not archived`);
    if (/\bNC\b|\bND\b|GFDL/i.test(photo.license)) issues.push(`${label}: restricted or unsupported license`);
    if (seen.has(photo.sourceUrl)) issues.push(`${label}: duplicate source photograph`);
    seen.add(photo.sourceUrl);
    const bytes = await fs.readFile(path.join(root, "public", photo.src));
    const metadata = await sharp(bytes).metadata();
    if (metadata.format !== "webp" || metadata.width !== photo.width || metadata.height !== photo.height) issues.push(`${label}: invalid image or dimensions`);
    if (createHash("sha256").update(bytes).digest("hex") !== evidence?.sha256) issues.push(`${label}: file checksum differs from provenance`);
    if (photo.license !== evidence?.license || photo.licenseUrl !== evidence?.licenseUrl || photo.sourceUrl !== evidence?.sourceUrl) issues.push(`${label}: public credits differ from provenance`);
    totalBytes += bytes.byteLength;
  }
}
if (issues.length) {
  console.error(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Destination photos valid: ${destinations.length} destinations, ${seen.size} unique local WebP photographs, ${(totalBytes / 1024 / 1024).toFixed(1)} MiB; bilingual captions, provenance, licenses, dimensions and checksums verified.`);
  console.log(`Fewer than 6 photographs: ${Object.entries(galleries).filter(([, photos]) => photos.length < 6).map(([slug, photos]) => `${slug} (${photos.length})`).join(", ") || "none"}`);
}
