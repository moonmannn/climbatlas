import type { Metadata } from "next";
import {
  MyAtlasClient,
  type MyAtlasDestinationSummary
} from "@/components/MyAtlasClient";
import { destinations } from "@/data/destinations";
import { getDestinationRouteCount } from "@/lib/routes/public-routes";

export const metadata: Metadata = {
  title: "My Atlas | ClimbAtlas"
};

export default function MyAtlasPage() {
  const destinationSummaries: MyAtlasDestinationSummary[] = destinations.map(
    (destination) => ({
      country: destination.country,
      image: destination.images?.[0]
        ? {
            alt: destination.images[0].alt,
            src: destination.images[0].src
          }
        : undefined,
      name: destination.name,
      rockType: destination.rockType,
      routeCount: getDestinationRouteCount(destination.slug),
      slug: destination.slug
    })
  );

  return <MyAtlasClient destinationSummaries={destinationSummaries} />;
}
