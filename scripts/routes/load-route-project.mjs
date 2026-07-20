import fs from "node:fs";
import Module, { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

let configured = false;

export function loadRouteProject(root = process.cwd()) {
  if (!configured) {
    const originalResolveFilename = Module._resolveFilename;

    Module._resolveFilename = function resolveFilename(
      request,
      parent,
      isMain,
      options
    ) {
      const resolvedRequest = request.startsWith("@/")
        ? path.join(root, "src", request.slice(2))
        : request;

      return originalResolveFilename.call(
        this,
        resolvedRequest,
        parent,
        isMain,
        options
      );
    };

    Module._extensions[".ts"] = function loadTypeScript(module, filename) {
      const source = fs.readFileSync(filename, "utf8");
      const output = ts.transpileModule(source, {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
          esModuleInterop: true,
          resolveJsonModule: true
        }
      }).outputText;

      module._compile(output, filename);
    };

    configured = true;
  }

  const require = createRequire(import.meta.url);

  return {
    destinationsModule: require(path.join(root, "src", "data", "destinations.ts")),
    routesModule: require(path.join(root, "src", "lib", "routes.ts")),
    publicRoutesModule: require(
      path.join(root, "src", "lib", "routes", "public-routes.ts")
    ),
    routeExplorerModule: require(
      path.join(root, "src", "lib", "routes", "route-explorer.ts")
    ),
    gradeParserModule: require(
      path.join(root, "src", "lib", "routes", "parse-route-grade.ts")
    ),
    gradeFilterOptionsModule: require(
      path.join(root, "src", "lib", "routes", "grade-filter-options.ts")
    ),
    formattersModule: require(
      path.join(root, "src", "lib", "formatters.ts")
    ),
    auditModule: require(
      path.join(root, "src", "lib", "routes", "audit-routes.ts")
    ),
    validationModule: require(
      path.join(root, "src", "lib", "routes", "validate-route.ts")
    ),
    deduplicationModule: require(
      path.join(root, "src", "lib", "routes", "deduplicate-routes.ts")
    ),
    openBetaNormalizationModule: require(
      path.join(root, "src", "lib", "routes", "import", "normalize-openbeta.ts")
    ),
    importMergeModule: require(
      path.join(root, "src", "lib", "routes", "import", "merge-route-import.ts")
    ),
    routeDetailViewModelModule: require(
      path.join(
        root,
        "src",
        "lib",
        "routes",
        "presentation",
        "route-detail-view-model.ts"
      )
    ),
    routeFactResolutionModule: require(
      path.join(
        root,
        "src",
        "lib",
        "routes",
        "adapters",
        "route-fact-resolution.ts"
      )
    ),
    routeFactNormalizationModule: require(
      path.join(
        root,
        "src",
        "lib",
        "routes",
        "adapters",
        "normalize-route-facts.ts"
      )
    )
  };
}
