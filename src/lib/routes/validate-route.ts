import {
  gradeSystems,
  routeClimbingTypes,
  type RouteCatalogEntry,
  type RouteSourceRecord
} from "@/types/route";

export type RouteValidationSeverity = "error" | "warning" | "info";

export type RouteValidationIssue = {
  severity: RouteValidationSeverity;
  code: string;
  routeKey: string;
  field?: string;
  message: string;
};

export type RouteValidationResult = {
  issues: RouteValidationIssue[];
  counts: Record<RouteValidationSeverity, number>;
};

function routeKey(entry: RouteCatalogEntry) {
  return `${entry.destinationId}:${entry.id}`;
}

function isWebUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isIsoDate(value: string | undefined) {
  return !value || /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function addIssue(
  issues: RouteValidationIssue[],
  entry: RouteCatalogEntry,
  issue: Omit<RouteValidationIssue, "routeKey">
) {
  issues.push({ ...issue, routeKey: routeKey(entry) });
}

function validateSource(
  entry: RouteCatalogEntry,
  source: RouteSourceRecord,
  sourceIndex: number,
  issues: RouteValidationIssue[]
) {
  const field = `sourceRecords[${sourceIndex}]`;

  if (!source.label.trim()) {
    addIssue(issues, entry, {
      severity: "error",
      code: "source-label-missing",
      field,
      message: "Source label is required."
    });
  }

  if (!isWebUrl(source.sourceUrl)) {
    addIssue(issues, entry, {
      severity: "error",
      code: "source-url-invalid",
      field,
      message: "Source URL must use http or https."
    });
  }

  if (!isIsoDate(source.checkedAt)) {
    addIssue(issues, entry, {
      severity: "warning",
      code: "source-checked-date-invalid",
      field,
      message: "checkedAt should use YYYY-MM-DD."
    });
  }

  if (source.verifiedFields.length === 0) {
    addIssue(issues, entry, {
      severity: "warning",
      code: "source-fields-unspecified",
      field,
      message: "Source does not say which fields it supports."
    });
  }
}

function validateExternalLinks(
  entry: RouteCatalogEntry,
  issues: RouteValidationIssue[]
) {
  entry.externalResources.forEach((resource, resourceIndex) => {
    const field = `externalResources[${resourceIndex}]`;

    if (!isWebUrl(resource.url)) {
      addIssue(issues, entry, {
        severity: "error",
        code: "external-url-invalid",
        field,
        message: "External resource URL must use http or https."
      });
      return;
    }

    const url = new URL(resource.url);
    const isMountainProject = url.hostname.includes("mountainproject.com");

    if (
      resource.linkStatus === "route-specific" &&
      isMountainProject &&
      !url.pathname.startsWith("/route/")
    ) {
      addIssue(issues, entry, {
        severity: "error",
        code: "route-link-points-to-area",
        field,
        message: "Mountain Project route-specific links must use /route/."
      });
    }

    if (
      resource.linkStatus === "area-only" &&
      isMountainProject &&
      url.pathname.startsWith("/route/")
    ) {
      addIssue(issues, entry, {
        severity: "warning",
        code: "exact-link-marked-as-area",
        field,
        message: "A Mountain Project /route/ URL is marked area-only."
      });
    }
  });
}

function validateEntry(
  entry: RouteCatalogEntry,
  destinationIds: ReadonlySet<string>,
  issues: RouteValidationIssue[]
) {
  if (!entry.id.trim()) {
    addIssue(issues, entry, {
      severity: "error",
      code: "id-missing",
      field: "id",
      message: "Route ID is required."
    });
  }

  if (!entry.slug.trim()) {
    addIssue(issues, entry, {
      severity: "error",
      code: "slug-missing",
      field: "slug",
      message: "Slug is required."
    });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) {
    addIssue(issues, entry, {
      severity: "warning",
      code: "slug-format",
      field: "slug",
      message: "Slug should contain lowercase letters, numbers, and hyphens only."
    });
  }

  if (!entry.name.trim()) {
    addIssue(issues, entry, {
      severity: "error",
      code: "name-missing",
      field: "name",
      message: "Route or area name is required."
    });
  }

  if (!destinationIds.has(entry.destinationId)) {
    addIssue(issues, entry, {
      severity: "error",
      code: "destination-missing",
      field: "destinationId",
      message: "Referenced destination does not exist."
    });
  }

  if (entry.sourceRecords.length === 0) {
    addIssue(issues, entry, {
      severity: "error",
      code: "sources-missing",
      field: "sourceRecords",
      message: "At least one source record is required."
    });
  }

  entry.sourceRecords.forEach((source, index) =>
    validateSource(entry, source, index, issues)
  );
  validateExternalLinks(entry, issues);

  if (entry.verification.status === "verified") {
    const hasHighTrustSource = entry.sourceRecords.some(
      (source) => source.trustLevel === "high"
    );

    if (!hasHighTrustSource) {
      addIssue(issues, entry, {
        severity: "warning",
        code: "verified-without-high-trust-source",
        field: "verification",
        message: "Verified records should have a high-trust supporting source."
      });
    }
  }

  if (entry.kind === "area-index") {
    if (!entry.areaName?.trim()) {
      addIssue(issues, entry, {
        severity: "error",
        code: "area-name-missing",
        field: "areaName",
        message: "Area index requires an area name."
      });
    }

    if (
      entry.externalResources.some(
        (resource) => resource.linkStatus === "route-specific"
      )
    ) {
      addIssue(issues, entry, {
        severity: "warning",
        code: "area-index-has-route-link",
        field: "externalResources",
        message: "Area indexes should normally link to an area resource."
      });
    }

    return;
  }

  if (!routeClimbingTypes.includes(entry.climbingType)) {
    addIssue(issues, entry, {
      severity: "error",
      code: "climbing-type-invalid",
      field: "climbingType",
      message: `Unsupported climbing type: ${entry.climbingType}`
    });
  }

  if (!entry.grade.original.trim()) {
    addIssue(issues, entry, {
      severity: "error",
      code: "grade-original-missing",
      field: "grade.original",
      message: "Original grade must be preserved."
    });
  }

  if (!gradeSystems.includes(entry.grade.system)) {
    addIssue(issues, entry, {
      severity: "error",
      code: "grade-system-invalid",
      field: "grade.system",
      message: `Unsupported grade system: ${entry.grade.system}`
    });
  }

  if (entry.grade.system === "unknown") {
    addIssue(issues, entry, {
      severity: "warning",
      code: "grade-system-unknown",
      field: "grade.system",
      message: "Grade system could not be identified safely."
    });
  }

  if (entry.grade.system === "mixed" && entry.grade.detectedSystems.length < 2) {
    addIssue(issues, entry, {
      severity: "error",
      code: "mixed-grade-without-systems",
      field: "grade.detectedSystems",
      message: "Mixed grades require at least two detected grade systems."
    });
  }

  if (!entry.lengthOriginal?.trim()) {
    addIssue(issues, entry, {
      severity: "warning",
      code: "length-original-missing",
      field: "lengthOriginal",
      message: "Original length wording is missing."
    });
  }

  if (entry.editorial.tier === "pick" && entry.editorial.status === "needs-review") {
    addIssue(issues, entry, {
      severity: "warning",
      code: "pick-needs-review",
      field: "editorial.status",
      message: "Legacy highlight has not yet been confirmed as a ClimbAtlas Pick."
    });
  }

  if (/\bmetadata\b/i.test(entry.grade.original)) {
    addIssue(issues, entry, {
      severity: "warning",
      code: "grade-contains-placeholder",
      field: "grade.original",
      message: "Grade contains the migration marker 'metadata'."
    });
  }
}

function validateUniqueKeys(
  entries: RouteCatalogEntry[],
  issues: RouteValidationIssue[]
) {
  const keys = new Map<string, RouteCatalogEntry>();
  const externalIds = new Map<string, RouteCatalogEntry>();

  for (const entry of entries) {
    const key = routeKey(entry);
    const previous = keys.get(key);

    if (previous) {
      addIssue(issues, entry, {
        severity: "error",
        code: "route-key-duplicate",
        field: "id",
        message: `Duplicate destination + route ID: ${key}`
      });
    } else {
      keys.set(key, entry);
    }

    for (const source of entry.sourceRecords) {
      if (!source.externalId) continue;
      const externalKey = `${source.provider}:${source.externalId}`;
      const previousExternal = externalIds.get(externalKey);

      if (
        previousExternal &&
        routeKey(previousExternal) !== key &&
        previousExternal.kind === "route" &&
        entry.kind === "route"
      ) {
        addIssue(issues, entry, {
          severity: "error",
          code: "external-id-conflict",
          field: "sourceRecords.externalId",
          message: `External ID is already used by ${routeKey(previousExternal)}.`
        });
      } else {
        externalIds.set(externalKey, entry);
      }
    }
  }
}

export function validateRouteCatalog(
  entries: RouteCatalogEntry[],
  destinationIds: ReadonlySet<string>
): RouteValidationResult {
  const issues: RouteValidationIssue[] = [];

  validateUniqueKeys(entries, issues);
  for (const entry of entries) validateEntry(entry, destinationIds, issues);

  return {
    issues,
    counts: {
      error: issues.filter((issue) => issue.severity === "error").length,
      warning: issues.filter((issue) => issue.severity === "warning").length,
      info: issues.filter((issue) => issue.severity === "info").length
    }
  };
}
