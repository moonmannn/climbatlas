import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dimensions = [
  "exploration",
  "performance",
  "adventure",
  "social",
  "comfort",
  "flow"
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

const questions = readJson("src/data/dna-questions.json");
const archetypes = readJson("src/data/dna-archetypes.json");
const profiles = readJson("src/data/destination-dna-profiles.json");
const destinationSource = fs.readFileSync(
  path.join(root, "src/data/destinations.ts"),
  "utf8"
);
const destinationSlugs = Array.from(
  destinationSource.matchAll(/^    slug: "([^"]+)",/gm),
  (match) => match[1]
);
const issues = [];

function requireLocalized(value, pathLabel) {
  if (!value?.en?.trim() || !value?.zh?.trim()) {
    issues.push(`${pathLabel} needs non-empty en and zh text`);
  }
}

function requireVector(vector, pathLabel, minimum = 0, maximum = 100) {
  for (const dimension of dimensions) {
    const value = vector?.[dimension];

    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < minimum ||
      value > maximum
    ) {
      issues.push(
        `${pathLabel}.${dimension} must be between ${minimum} and ${maximum}`
      );
    }
  }

  for (const key of Object.keys(vector ?? {})) {
    if (!dimensions.includes(key)) {
      issues.push(`${pathLabel} contains unknown dimension ${key}`);
    }
  }
}

if (questions.length !== 10) {
  issues.push("Climbing DNA 2.0 must contain exactly 10 questions");
}

const questionIds = new Set();
const coveredDimensions = new Set();

for (const [questionIndex, question] of questions.entries()) {
  if (questionIds.has(question.id)) {
    issues.push(`Duplicate question id: ${question.id}`);
  }

  questionIds.add(question.id);
  requireLocalized(question.prompt, `questions[${questionIndex}].prompt`);
  requireLocalized(question.helper, `questions[${questionIndex}].helper`);

  if (question.order !== questionIndex + 1) {
    issues.push(`Question ${question.id} has an unexpected order`);
  }

  if (question.options.length < 2 || question.options.length > 4) {
    issues.push(`Question ${question.id} must have 2 to 4 options`);
  }

  const optionIds = new Set();

  for (const option of question.options) {
    if (optionIds.has(option.id)) {
      issues.push(`Duplicate option id in ${question.id}: ${option.id}`);
    }

    optionIds.add(option.id);
    requireLocalized(option.label, `${question.id}.${option.id}.label`);
    requireLocalized(
      option.description,
      `${question.id}.${option.id}.description`
    );

    if (!option.illustrationKey?.trim()) {
      issues.push(`${question.id}.${option.id} needs an illustrationKey`);
    }

    if (Object.keys(option.effects ?? {}).length === 0) {
      issues.push(`${question.id}.${option.id} needs scoring effects`);
    }

    for (const [dimension, value] of Object.entries(option.effects ?? {})) {
      coveredDimensions.add(dimension);

      if (!dimensions.includes(dimension)) {
        issues.push(`${question.id}.${option.id} uses unknown dimension ${dimension}`);
      }

      if (typeof value !== "number" || value < 0 || value > 4) {
        issues.push(`${question.id}.${option.id} effect values must be 0 to 4`);
      }
    }
  }
}

for (const dimension of dimensions) {
  if (!coveredDimensions.has(dimension)) {
    issues.push(`No question option contributes to ${dimension}`);
  }
}

const archetypeIds = new Set();
const expectedArchetypeIds = [
  "horizon-seeker",
  "movement-architect",
  "project-hunter",
  "alpine-voyager",
  "crag-connector",
  "balanced-roamer"
];

for (const archetype of archetypes) {
  if (archetypeIds.has(archetype.id)) {
    issues.push(`Duplicate archetype id: ${archetype.id}`);
  }

  archetypeIds.add(archetype.id);
  requireLocalized(archetype.name, `${archetype.id}.name`);
  requireLocalized(archetype.tagline, `${archetype.id}.tagline`);
  requireLocalized(archetype.description, `${archetype.id}.description`);
  requireLocalized(archetype.longDescription, `${archetype.id}.longDescription`);
  requireVector(archetype.idealVector, `${archetype.id}.idealVector`);

  for (const field of ["strengths", "routeStyles", "environments"]) {
    if (!archetype[field]?.en?.length || !archetype[field]?.zh?.length) {
      issues.push(`${archetype.id}.${field} needs bilingual content`);
    }
  }

  requireLocalized(archetype.image?.alt, `${archetype.id}.image.alt`);
  if (!archetype.image?.src?.startsWith("/images/climbing-dna/archetypes/")) {
    issues.push(`${archetype.id} needs a dedicated archetype image`);
  } else if (!fs.existsSync(path.join(root, "public", archetype.image.src))) {
    issues.push(`${archetype.id} image does not exist: ${archetype.image.src}`);
  }

  for (const dimension of archetype.dominantDimensions ?? []) {
    if (!dimensions.includes(dimension)) {
      issues.push(`${archetype.id} has unknown dominant dimension ${dimension}`);
    }
  }
}

for (const archetypeId of expectedArchetypeIds) {
  if (!archetypeIds.has(archetypeId)) {
    issues.push(`Missing confirmed archetype: ${archetypeId}`);
  }
}

const q1Artwork = {
  "seaside-limestone": "/images/climbing-dna/quiz/seaside-limestone.webp",
  "forest-granite": "/images/climbing-dna/quiz/forest-granite.webp",
  "high-alpine-wall": "/images/climbing-dna/quiz/high-alpine-wall.webp",
  "lively-local-crag": "/images/climbing-dna/quiz/lively-crag.webp"
};

for (const [optionId, imagePath] of Object.entries(q1Artwork)) {
  if (!questions[0]?.options.some((option) => option.id === optionId)) {
    issues.push(`Q1 is missing the confirmed option ${optionId}`);
  }
  if (!fs.existsSync(path.join(root, "public", imagePath))) {
    issues.push(`Q1 image does not exist: ${imagePath}`);
  }
}

const profileSlugs = new Set();

for (const profile of profiles) {
  if (profileSlugs.has(profile.destinationSlug)) {
    issues.push(`Duplicate destination DNA profile: ${profile.destinationSlug}`);
  }

  profileSlugs.add(profile.destinationSlug);
  requireVector(profile.vector, `${profile.destinationSlug}.vector`);
  requireLocalized(profile.summary, `${profile.destinationSlug}.summary`);

  if (!profile.traits?.en?.length || !profile.traits?.zh?.length) {
    issues.push(`${profile.destinationSlug} needs bilingual traits`);
  }
}

for (const slug of destinationSlugs) {
  if (!profileSlugs.has(slug)) {
    issues.push(`Missing DNA profile for destination: ${slug}`);
  }
}

for (const slug of profileSlugs) {
  if (!destinationSlugs.includes(slug)) {
    issues.push(`DNA profile points to an unknown destination: ${slug}`);
  }
}


const sampleAnswers = {
  environment: "seaside-limestone",
  motivation: "share-the-day",
  "route-preference": "classic-with-friends",
  "failure-response": "laugh-and-reset",
  approach: "pleasant-walk",
  "crag-atmosphere": "friendly-busy",
  "travel-priority": "good-people-good-base",
  "adventure-comfort": "balanced-day",
  "trip-outcome": "people-made-it",
  identity: "build-connection"
};
const sampleTotals = Object.fromEntries(
  dimensions.map((dimension) => [dimension, 0])
);
const samplePossible = Object.fromEntries(
  dimensions.map((dimension) => [dimension, 0])
);

for (const question of questions) {
  const option = question.options.find(
    (candidate) => candidate.id === sampleAnswers[question.id]
  );

  if (!option) {
    issues.push(`Sample answers are missing a valid option for ${question.id}`);
    continue;
  }

  for (const dimension of dimensions) {
    sampleTotals[dimension] += option.effects[dimension] ?? 0;
    samplePossible[dimension] += Math.max(
      ...question.options.map((candidate) => candidate.effects[dimension] ?? 0)
    );
  }
}

const sampleScores = Object.fromEntries(
  dimensions.map((dimension) => [
    dimension,
    Math.round(
      samplePossible[dimension] === 0
        ? 50
        : 20 + (sampleTotals[dimension] / samplePossible[dimension]) * 80
    )
  ])
);
const sampleMatches = profiles
  .map((profile) => {
    let weightedGap = 0;
    let totalWeight = 0;

    for (const dimension of dimensions) {
      const weight = 0.1 + Math.pow(sampleScores[dimension] / 100, 2);
      const difference = profile.vector[dimension] - sampleScores[dimension];
      const gap = difference >= 0 ? difference * 0.35 : Math.abs(difference);
      weightedGap += gap * weight;
      totalWeight += weight;
    }

    return {
      destinationSlug: profile.destinationSlug,
      score: Math.round(100 - weightedGap / totalWeight)
    };
  })
  .sort(
    (first, second) =>
      second.score - first.score ||
      first.destinationSlug.localeCompare(second.destinationSlug)
  )
  .slice(0, 3);

if (
  !sampleMatches.some((match) =>
    ["kalymnos-greece", "railay-tonsai-thailand"].includes(
      match.destinationSlug
    )
  )
) {
  issues.push("Social warm-weather sample did not produce a plausible top match");
}

if (issues.length > 0) {
  console.error("Climbing DNA validation failed:");
  console.error(issues.map((issue) => `- ${issue}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Climbing DNA data valid: ${questions.length} questions, ` +
      `${archetypes.length} archetypes, ${profiles.length} destination profiles.`
  );
  console.log(`Dimensions covered: ${dimensions.join(", ")}.`);
  console.log(`Sample top matches: ${sampleMatches.map((match) => `${match.destinationSlug} (${match.score}%)`).join(", ")}.`);
}
