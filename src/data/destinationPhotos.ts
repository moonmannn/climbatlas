import photoData from "@/data/destination-photos.json";
import type { ImageAsset } from "@/types/destination";

export const destinationPhotosBySlug: Record<string, ImageAsset[]> = Object.fromEntries(
  Object.entries(photoData).map(([slug, photos]) => [
    slug,
    photos.map((photo) => ({ ...photo, imageType: "destination-context" as const }))
  ])
);
