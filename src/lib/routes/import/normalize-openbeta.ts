// Compatibility export for the existing offline import command. OpenBeta raw
// records are normalized by a source-specific adapter before entering RouteRecord.
export { adaptOpenBetaRoute as normalizeOpenBetaRoute } from "@/lib/routes/adapters/openbeta-route-adapter";
