import rawProfiles from "@/data/destination-dna-profiles.json";
import type { DestinationDnaProfile } from "@/types/climbingDna";

export const destinationDnaProfiles =
  rawProfiles as DestinationDnaProfile[];

export const destinationDnaProfilesBySlug = Object.fromEntries(
  destinationDnaProfiles.map((profile) => [
    profile.destinationSlug,
    profile
  ])
) as Record<string, DestinationDnaProfile>;
