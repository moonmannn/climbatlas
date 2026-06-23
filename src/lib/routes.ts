import { destinations } from "@/data/destinations";
import type { Destination, RouteHighlight } from "@/types/destination";

export type RouteWithDestination = {
  destination: Destination;
  route: RouteHighlight;
};

export function getAllRoutesWithDestinations(): RouteWithDestination[] {
  return destinations.flatMap((destination) =>
    (destination.routes ?? []).map((route) => ({
      destination,
      route
    }))
  );
}

export function findRouteWithDestination(
  destinationSlug: string,
  routeId: string
) {
  return getAllRoutesWithDestinations().find(
    (item) =>
      item.destination.slug === destinationSlug && item.route.id === routeId
  );
}
