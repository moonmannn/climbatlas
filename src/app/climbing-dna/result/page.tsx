import type { Metadata } from "next";
import { ClimbingDnaResult, type DestinationMatchCardData } from "@/components/ClimbingDnaResult";
import { SiteHeader } from "@/components/SiteHeader";
import { destinations } from "@/data/destinations";

export const metadata: Metadata = {
  title: "Your Climbing DNA | ClimbAtlas",
  description: "A personal climbing archetype and explainable destination matches from ClimbAtlas."
};

const destinationSummaries: DestinationMatchCardData[] = destinations.map((destination) => ({
  slug: destination.slug,
  name: destination.name,
  country: destination.country,
  rockType: destination.rockType,
  climbingTypes: destination.climbingTypes,
  bestSeasons: destination.bestSeasons,
  routeCount: destination.routes?.length ?? 0,
  image: destination.images?.[0] ? { src: destination.images[0].src, alt: destination.images[0].alt } : undefined
}));

export default async function ClimbingDnaResultPage({ searchParams }: { searchParams: Promise<{ answers?: string | string[] }> }) {
  const params = await searchParams;
  const encodedAnswers = typeof params.answers === "string" ? params.answers : "";

  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <SiteHeader />
      <ClimbingDnaResult destinations={destinationSummaries} encodedAnswers={encodedAnswers} />
    </div>
  );
}
