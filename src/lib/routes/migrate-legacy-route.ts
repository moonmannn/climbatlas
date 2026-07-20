// Compatibility export for the existing catalog. Public rendering remains
// unchanged until RC-4; new normalization logic lives in the adapter layer.
export {
  adaptLegacyRoute as migrateLegacyRoute,
  createRouteGrade
} from "@/lib/routes/adapters/legacy-route-adapter";
