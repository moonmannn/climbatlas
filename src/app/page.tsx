import { HomeClient, type HomeDestinationSummary } from "@/components/HomeClient";
import { destinations } from "@/data/destinations";
import { getDestinationDescription } from "@/data/localizedContent";
import type { Destination } from "@/types/destination";

const featuredSlugs = ["yosemite-usa", "squamish-canada", "fontainebleau-france"];

function toMapDestination(destination: Destination): Destination {
  return {
    slug: destination.slug,
    name: destination.name,
    country: destination.country,
    latitude: destination.latitude,
    longitude: destination.longitude,
    climbingTypes: destination.climbingTypes,
    rockType: destination.rockType,
    bestSeasons: destination.bestSeasons,
    difficultyRange: destination.difficultyRange,
    beginnerFriendly: destination.beginnerFriendly,
    description: destination.description,
    localizedContent: destination.localizedContent
  };
}

export default function HomePage() {
  const featuredDestinations = featuredSlugs
    .map((slug) => destinations.find((destination) => destination.slug === slug))
    .filter((destination): destination is Destination => Boolean(destination))
    .map<HomeDestinationSummary>((destination) => ({
      slug: destination.slug,
      name: destination.name,
      country: destination.country,
      rockType: destination.rockType,
      routeCount: destination.routes?.length ?? 0,
      descriptions: {
        en: getDestinationDescription(destination, "en"),
        zh: getDestinationDescription(destination, "zh")
      },
      image: destination.images?.[0]
        ? { src: destination.images[0].src, alt: destination.images[0].alt }
        : undefined
    }));

  return (
    <HomeClient
      featuredDestinations={featuredDestinations}
      mapDestinations={destinations.map(toMapDestination)}
    />
  );
}
