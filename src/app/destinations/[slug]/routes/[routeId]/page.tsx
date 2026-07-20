import { notFound, redirect } from "next/navigation";
import { LocalizedText } from "@/components/LanguageProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { LocalizedRouteDetailView } from "@/components/RouteDetailView";
import { RouteDnaMatchPanel } from "@/components/RouteDnaMatchPanel";
import { UserRouteControls } from "@/components/UserRouteControls";
import { getDestinationBySlug } from "@/data/destinations";
import { getRouteAliasParams, resolveRouteId } from "@/lib/routeAliases";
import {
  findPublicRouteWithDestination,
  getPublicRouteRecords
} from "@/lib/routes/public-routes";
import { buildRouteDetailViewModel } from "@/lib/routes/presentation/route-detail-view-model";
import { buildRouteDnaSnapshot } from "@/lib/routes/route-dna";
import { getRouteDifficulty } from "@/lib/routes/route-explorer";

type RoutePageProps = {
  params: Promise<{
    slug: string;
    routeId: string;
  }>;
};

export function generateStaticParams() {
  const routeParams = getPublicRouteRecords().map(({ destination, route }) => ({
    slug: destination.slug,
    routeId: route.id
  }));
  const aliasParams = getRouteAliasParams().filter(({ slug, routeId }) =>
    findPublicRouteWithDestination(slug, resolveRouteId(slug, routeId))
  );

  return [...routeParams, ...aliasParams];
}

export async function generateMetadata({ params }: RoutePageProps) {
  const { slug, routeId } = await params;
  const destination = getDestinationBySlug(slug);
  const canonicalRouteId = resolveRouteId(slug, routeId);
  const item = findPublicRouteWithDestination(slug, canonicalRouteId);

  return {
    title: item
      ? `${item.route.name} | ${destination?.name} | ClimbAtlas`
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

  const item = findPublicRouteWithDestination(slug, canonicalRouteId);

  if (!destination || !item) {
    notFound();
  }

  const entry = item.route;
  const routeViewModels = {
    en: buildRouteDetailViewModel(entry, { locale: "en", destination }),
    zh: buildRouteDetailViewModel(entry, { locale: "zh", destination })
  };
  const routeDnaSnapshot = buildRouteDnaSnapshot(
    entry,
    getRouteDifficulty(entry)?.band ?? "unknown"
  );

  return (
    <main className="phase6-content min-h-screen bg-cream text-charcoal">
      <SiteHeader />
      <div className="mx-auto max-w-[1100px] px-5 py-[72px] sm:px-8 lg:px-12 lg:py-20">

      <div>
        <section className="mt-5 overflow-hidden border-y border-brandforest/15 bg-cream">
          <div className="border-b border-brandforest/15 px-0 py-10 text-charcoal">
            <p className="editorial-kicker text-terracotta">
              {destination.name} / {destination.country}
            </p>
            <h1 className="display-serif mt-3 text-5xl font-medium leading-tight text-brandforest sm:text-6xl">
              {entry.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-charcoal/65">
              <LocalizedText
                en="Compare the recorded route facts, source trail, and available external resources. Consult current external resources for beta and local guidance when available."
                zh="在这里比较已记录的路线信息、来源和外部资料。如有可用资料，最新 beta 与当地指引仍请以外部来源为准。"
              />
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <UserRouteControls
              destinationName={destination.name}
              destinationSlug={destination.slug}
              route={{ id: entry.id, name: entry.name }}
            />
            <RouteDnaMatchPanel
              routeName={entry.name}
              snapshot={routeDnaSnapshot}
            />
            <LocalizedRouteDetailView viewModels={routeViewModels} />
          </div>
        </section>
      </div>
      </div>
    </main>
  );
}
