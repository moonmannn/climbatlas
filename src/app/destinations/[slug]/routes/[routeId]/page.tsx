import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { LocalizedRouteDetailView } from "@/components/RouteDetailView";
import { RouteDnaMatchPanel } from "@/components/RouteDnaMatchPanel";
import { UserRouteControls } from "@/components/UserRouteControls";
import { getDestinationBySlug } from "@/data/destinations";
import {
  getRetiredRouteHref,
  getRetiredRouteParams,
  getRouteAliasParams,
  resolveRouteId
} from "@/lib/routeAliases";
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
    findPublicRouteWithDestination(slug, resolveRouteId(slug, routeId)) ||
    getRetiredRouteHref(slug, resolveRouteId(slug, routeId))
  );

  const paramsByKey = new Map(
    [...routeParams, ...aliasParams, ...getRetiredRouteParams()].map((item) => [
      `${item.slug}:${item.routeId}`,
      item
    ])
  );

  return Array.from(paramsByKey.values());
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
  const retiredHref =
    getRetiredRouteHref(slug, canonicalRouteId) ??
    getRetiredRouteHref(slug, routeId);

  if (retiredHref) {
    redirect(retiredHref);
  }

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
        <LocalizedRouteDetailView
          dnaPanel={
            <RouteDnaMatchPanel
              routeName={entry.name}
              snapshot={routeDnaSnapshot}
            />
          }
          savePanel={
            <UserRouteControls
              destinationName={destination.name}
              destinationSlug={destination.slug}
              route={{ id: entry.id, name: entry.name }}
              variant="compact"
            />
          }
          viewModels={routeViewModels}
        />
      </div>
    </main>
  );
}
