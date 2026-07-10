import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AuthButton } from "@/components/AuthButton";
import { LanguageToggle, LocalizedText } from "@/components/LanguageProvider";
import { RouteHighlightCard } from "@/components/RouteHighlightCard";
import { RouteMetadataCard } from "@/components/RouteMetadataCard";
import { UserRouteControls } from "@/components/UserRouteControls";
import {
  destinations,
  getDestinationBySlug,
  getRouteById
} from "@/data/destinations";
import { getRouteAliasParams, resolveRouteId } from "@/lib/routeAliases";

type RoutePageProps = {
  params: Promise<{
    slug: string;
    routeId: string;
  }>;
};

export function generateStaticParams() {
  const routeParams = destinations.flatMap((destination) =>
    (destination.routes ?? []).map((route) => ({
      slug: destination.slug,
      routeId: route.id
    }))
  );

  return [...routeParams, ...getRouteAliasParams()];
}

export async function generateMetadata({ params }: RoutePageProps) {
  const { slug, routeId } = await params;
  const destination = getDestinationBySlug(slug);
  const route = getRouteById(slug, routeId);

  return {
    title: route
      ? `${route.name} | ${destination?.name} | ClimbAtlas`
      : "Route | ClimbAtlas"
  };
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { slug, routeId } = await params;
  const destination = getDestinationBySlug(slug);
  const canonicalRouteId = resolveRouteId(slug, routeId);

  if (canonicalRouteId !== routeId) {
    redirect(`/destinations/${slug}/routes/${canonicalRouteId}`);
  }

  const route = getRouteById(slug, canonicalRouteId);

  if (!destination || !route) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-bark px-5 py-6 text-bark">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(244,184,96,0.2),transparent_26%),linear-gradient(180deg,rgba(43,33,24,0),rgba(43,33,24,0.22))]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Link
              className="inline-flex rounded-md border border-parchment/25 bg-parchment/10 px-3 py-2 text-sm font-bold text-parchment backdrop-blur transition hover:bg-parchment/20"
              href={`/destinations/${destination.slug}`}
            >
              <LocalizedText en="Back to destination" zh="返回目的地" />
            </Link>
            <Link
              className="inline-flex rounded-md border border-parchment/25 bg-parchment/10 px-3 py-2 text-sm font-bold text-parchment backdrop-blur transition hover:bg-parchment/20"
              href="/"
            >
              <LocalizedText en="Back to map" zh="返回地图" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AuthButton tone="dark" />
            <LanguageToggle />
          </div>
        </div>

        <section className="paper-texture mt-5 overflow-hidden rounded-lg border border-ridge/30 bg-parchment shadow-atlas">
          <div className="border-b border-ridge/30 bg-[linear-gradient(135deg,#1f4d36,#3b6978)] px-6 py-8 text-parchment sm:px-8">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-sunlit">
              {destination.name} / {destination.country}
            </p>
            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              {route.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-bold leading-6 text-parchment/80">
              <LocalizedText
                en="A focused route page for choosing, comparing, and learning the character of this line. Detailed beta still belongs in current external resources."
                zh="这是独立路线页，用来帮助你判断这条线的风格、练习方向，以及是否适合今天。具体 beta 仍请查看最新外部资料。"
              />
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <UserRouteControls
              destinationName={destination.name}
              destinationSlug={destination.slug}
              route={route}
            />
            {route.status === "metadata" ? (
              <RouteMetadataCard route={route} />
            ) : (
              <RouteHighlightCard route={route} />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
