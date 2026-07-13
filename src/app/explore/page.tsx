import type { Metadata } from "next";
import { ExploreClient } from "@/components/ExploreClient";

export const metadata: Metadata = {
  title: "Explore the map | ClimbAtlas",
  description: "Explore source-backed climbing destinations on the interactive ClimbAtlas map."
};

export default function ExplorePage() {
  return <ExploreClient />;
}
