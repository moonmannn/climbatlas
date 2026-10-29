import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

// Input files contain individually reviewed Commons selections, not search results.
// Keep their source/licensing evidence alongside the locally optimized photographs.
const root = process.cwd();
const inputPaths = process.argv.slice(2);
if (!inputPaths.length) throw new Error("Pass one or more reviewed photo-selection JSON files.");
const sourceCode = await fs.readFile(path.join(root, "src/data/destinations.ts"), "utf8");
const knownSlugs = new Set([...sourceCode.matchAll(/^    slug: "([^"]+)"/gm)].map((match) => match[1]));
const galleries = {};
const provenance = {};
const usedSources = new Set();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function download(url, attempts = 3) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "ClimbAtlas/0.1 (licensed destination photo import)" },
        signal: AbortSignal.timeout(30000)
      });
      if (response.ok && response.headers.get("content-type")?.startsWith("image/")) {
        return Buffer.from(await response.arrayBuffer());
      }
      throw new Error(`Image download returned ${response.status}: ${url}`);
    } catch (error) {
      if (attempt === attempts - 1) throw error;
      console.log(`Retrying download in ${(attempt + 1) * 10}s: ${url}`);
      await wait(10000 * (attempt + 1));
    }
  }
}

function commonsThumbnail(originalUrl, width) {
  const original = new URL(originalUrl);
  const parts = original.pathname.split("/");
  const filename = parts.at(-1);
  return `https://thumb.wikimedia.org${parts.slice(0, 3).join("/")}/thumb/${parts.slice(3).join("/")}/${width}px-${filename}`;
}

for (const inputPath of inputPaths) {
  const selection = JSON.parse(await fs.readFile(path.resolve(root, inputPath), "utf8"));
  const rawPath = path.resolve(root, inputPath.replace(/\.json$/, "-raw.json"));
  let rawSelection = {};
  try { rawSelection = JSON.parse(await fs.readFile(rawPath, "utf8")); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  for (const [slug, photos] of Object.entries(selection)) {
    if (!knownSlugs.has(slug)) throw new Error(`Unknown destination: ${slug}`);
    if (galleries[slug]) throw new Error(`Destination selected twice: ${slug}`);
    galleries[slug] = [];
    provenance[slug] = [];
    for (const photo of photos) {
      const rawPhoto = rawSelection[slug]?.find((item) => (item.title ?? item.commonsTitle) === photo.commonsTitle);
      const imageInfo = Array.isArray(rawPhoto?.imageinfo) ? rawPhoto.imageinfo[0] : rawPhoto?.imageinfo;
      photo.sourceMetadata ??= imageInfo ? {
        method: "Commons imageinfo API",
        pageId: rawPhoto.pageid,
        originalTitle: imageInfo.extmetadata?.ObjectName?.value,
        extmetadata: imageInfo.extmetadata
      } : rawPhoto?.sourceMetadata;
      if (!photo.sourceMetadata) throw new Error(`${slug}: missing archived source metadata for ${photo.commonsTitle}`);
      for (const field of ["commonsTitle", "sourceUrl", "originalUrl", "license", "licenseUrl", "credit", "alt", "altZh", "caption", "captionZh", "locationEvidence"]) {
        if (!photo[field]?.trim()) throw new Error(`${slug}: missing ${field}`);
      }
      if (!/^(CC BY(?:-SA)? [\d.]+(?: [a-z-]+)?|CC0(?: [\d.]+)?|Public domain)$/i.test(photo.license)) {
        throw new Error(`${slug}: unsupported photo license ${photo.license}`);
      }
      if (!photo.sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:")) throw new Error("Expected a Commons file source.");
      photo.licenseUrl = photo.licenseUrl.replace(/^http:\/\/creativecommons.org\//, "https://creativecommons.org/");
      if (!/^https:\/\/creativecommons.org\//.test(photo.licenseUrl) && !(photo.license === "Public domain" && photo.licenseUrl === photo.sourceUrl)) {
        throw new Error("Expected a license link, or the file's public-domain declaration.");
      }
      if (usedSources.has(photo.commonsTitle)) throw new Error(`Duplicate photo: ${photo.commonsTitle}`);
      usedSources.add(photo.commonsTitle);
      const hash = createHash("sha256").update(photo.commonsTitle).digest("hex").slice(0, 12);
      const relativePath = `images/destinations/${slug}/${hash}.webp`;
      const outputPath = path.join(root, "public", relativePath);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      let output;
      try {
        output = await fs.readFile(outputPath);
      } catch {
        let bytes;
        const aspectRatio = Math.max(photo.originalWidth / photo.originalHeight, photo.originalHeight / photo.originalWidth);
        const candidates = [...new Set([
          commonsThumbnail(photo.originalUrl, aspectRatio > 3 ? 3840 : 1920),
          ...(aspectRatio > 3 ? [] : [commonsThumbnail(photo.originalUrl, 1280)]),
          photo.src,
          photo.originalUrl
        ])];
        let failure;
        for (const url of candidates) {
          try { bytes = await download(url, 1); break; }
          catch (error) { failure = error; await wait(1000); }
        }
        if (!bytes) throw failure;
        const maximumDimension = Math.min(4096, Math.max(1600, Math.ceil(600 * aspectRatio)));
        output = await sharp(bytes)
          .rotate()
          .resize({ width: maximumDimension, height: maximumDimension, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 84, effort: 5 })
          .toBuffer();
        await fs.writeFile(outputPath, output);
        await wait(500);
      }
      const dimensions = await sharp(output).metadata();
      if (Math.min(dimensions.width, dimensions.height) < 450) throw new Error(`${slug}: photograph is too small`);
      const image = {
        src: `/${relativePath}`,
        alt: photo.alt,
        altZh: photo.altZh,
        caption: photo.caption,
        captionZh: photo.captionZh,
        title: photo.title || photo.commonsTitle.replace(/^File:/, "").replace(/\.[^.]+$/, ""),
        credit: photo.credit,
        license: photo.license,
        licenseUrl: photo.licenseUrl,
        sourceUrl: photo.sourceUrl,
        width: dimensions.width,
        height: dimensions.height,
        modification: "Resized and converted to WebP; scene content unchanged.",
        imageType: "destination-context"
      };
      galleries[slug].push(image);
      provenance[slug].push({
        ...photo,
        localPath: image.src,
        title: image.title,
        modification: image.modification,
        outputWidth: dimensions.width,
        outputHeight: dimensions.height,
        bytes: output.byteLength,
        sha256: createHash("sha256").update(output).digest("hex")
      });
      console.log(`${slug}: ${galleries[slug].length}/${photos.length} ${image.title}`);
    }
  }
}
await fs.mkdir(path.join(root, "docs/media"), { recursive: true });
await fs.writeFile(path.join(root, "src/data/destination-photos.json"), `${JSON.stringify(galleries, null, 2)}\n`);
await fs.writeFile(path.join(root, "docs/media/destination-photo-provenance.json"), `${JSON.stringify(provenance, null, 2)}\n`);
console.log(JSON.stringify({ destinations: Object.keys(galleries).length, photos: Object.values(galleries).reduce((sum, items) => sum + items.length, 0), counts: Object.fromEntries(Object.entries(galleries).map(([slug, photos]) => [slug, photos.length])) }, null, 2));
