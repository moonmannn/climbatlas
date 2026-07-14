import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthButton } from "@/components/AuthButton";
import { LanguageToggle, LocalizedText } from "@/components/LanguageProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { LocalizedDestinationDescription } from "@/components/LocalizedDestinationDescription";
import { DestinationHeroImage } from "@/components/DestinationHeroImage";
import { DestinationDnaMatch } from "@/components/DestinationDnaMatch";
import { RouteIndex } from "@/components/RouteIndex";
import { destinations, getDestinationBySlug } from "@/data/destinations";
import { getAllRouteRecordsWithDestinations } from "@/lib/routes";
import { toRouteExplorerItem } from "@/lib/routes/route-explorer";

type DestinationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return destinations.map((destination) => ({
    slug: destination.slug
  }));
}

export async function generateMetadata({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  return {
    title: destination
      ? `${destination.name} | ClimbAtlas`
      : "Destination | ClimbAtlas"
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const heroImage = destination.images?.[0];
  const galleryImages = destination.images?.slice(0, 4) ?? [];
  const guideContent = destination.guideContent;
  const explorerRoutes = getAllRouteRecordsWithDestinations()
    .filter((item) => item.destination.slug === destination.slug)
    .map((item) => toRouteExplorerItem(item.route));
  return (
    <main className="phase6-content min-h-screen bg-cream text-charcoal">
      <SiteHeader />
      <div className="mx-auto max-w-[1240px] px-5 py-[72px] sm:px-8 lg:px-12 lg:py-20">
      <div>
        <div className="hidden">
          <Link
            className="inline-flex rounded-md border border-parchment/25 bg-parchment/10 px-3 py-2 text-sm font-bold text-parchment backdrop-blur transition hover:bg-parchment/20"
            href="/explore"
          >
            <LocalizedText en="Back to map" zh="返回地图" />
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <AuthButton tone="dark" />
            <LanguageToggle />
          </div>
        </div>

        <section className="grid gap-10 border-y border-brandforest/15 py-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <Link className="text-link" href="/explore"><LocalizedText en="Back to map" zh="返回地图" /> →</Link>
            <p className="editorial-kicker mt-10 text-terracotta">{destination.country}</p>
            <h1 className="display-serif mt-4 text-5xl font-medium leading-[1.02] text-brandforest sm:text-7xl">{destination.name}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-charcoal/68"><LocalizedDestinationDescription destination={destination} /></p>
          </div>
          <DestinationHeroImage image={heroImage} slug={destination.slug} />

        </section>

        <section className="mt-12 overflow-hidden border-y border-brandforest/15 bg-cream">
          <div className="hidden">
            {heroImage ? (
              <img
                alt={heroImage.alt}
                className="absolute inset-0 h-full w-full object-cover"
                src={heroImage.src}
              />
            ) : (
              <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(30deg,rgba(255,255,255,.28)_1px,transparent_1px),linear-gradient(120deg,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:42px_42px]" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(31,77,54,0.95),rgba(43,33,24,0.58)),linear-gradient(180deg,rgba(43,33,24,0.1),rgba(43,33,24,0.62))]" />
            <div className="relative max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-sunlit">
                {destination.country}
              </p>
              <h1 className="mt-3 text-5xl font-black leading-none sm:text-6xl">
                {destination.name}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-parchment/85">
                <LocalizedDestinationDescription destination={destination} />
              </p>
              {heroImage && (
                <p className="mt-5 max-w-xl text-xs font-bold leading-5 text-parchment/70">
                  Hero image: {heroImage.caption} Credit: {heroImage.credit} -{" "}
                  {heroImage.license}.
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_18rem]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-forest">
                <LocalizedText en="Field notes" zh="野外笔记" />
              </p>
              <h2 className="mt-2 text-3xl font-black text-bark">
                <LocalizedText en="Climbing profile" zh="攀岩画像" />
              </h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {destination.climbingTypes.map((type) => (
                  <span
                    className="rounded-full bg-forest px-3 py-1 text-sm font-bold text-parchment"
                    key={type}
                  >
                    {type}
                  </span>
                ))}
                {destination.bestSeasons.map((season) => (
                  <span
                    className="rounded-full border border-ridge/35 bg-white/50 px-3 py-1 text-sm font-bold text-bark"
                    key={season}
                  >
                    {season}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-ridge/30 bg-white/50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-ridge">
                <LocalizedText en="Approach" zh="适合程度" />
              </p>
              <p className="mt-3 text-2xl font-black text-forest">
                {destination.beginnerFriendly ? (
                  <LocalizedText en="Welcoming" zh="比较友好" />
                ) : (
                  <LocalizedText en="Experienced" zh="更适合有经验者" />
                )}
              </p>
              <p className="mt-2 text-sm leading-6 text-bark/70">
                {destination.beginnerFriendly ? (
                  <LocalizedText
                    en="A good candidate for newer outdoor climbers with careful planning."
                    zh="适合有计划的新户外攀岩者，但仍然需要认真判断。"
                  />
                ) : (
                  <LocalizedText
                    en="Better suited to confident climbers with solid outdoor systems."
                    zh="更适合系统扎实、户外经验更稳定的攀岩者。"
                  />
                )}
              </p>
            </div>
          </div>

          <dl className="grid gap-4 border-t border-ridge/30 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
            <div className="rounded-md border border-ridge/25 bg-white/45 p-4">
              <dt className="text-xs font-black uppercase tracking-wide text-bark/55">
                <LocalizedText en="Rock" zh="岩石" />
              </dt>
              <dd className="mt-2 text-xl font-black">{destination.rockType}</dd>
            </div>

            <div className="rounded-md border border-ridge/25 bg-white/45 p-4">
              <dt className="text-xs font-black uppercase tracking-wide text-bark/55">
                <LocalizedText en="Season" zh="季节" />
              </dt>
              <dd className="mt-2 text-xl font-black">
                {destination.bestSeasons.join(", ")}
              </dd>
            </div>

            <div className="rounded-md border border-ridge/25 bg-white/45 p-4">
              <dt className="text-xs font-black uppercase tracking-wide text-bark/55">
                <LocalizedText en="Difficulty" zh="难度" />
              </dt>
              <dd className="mt-2 text-xl font-black">
                {destination.difficultyRange}
              </dd>
            </div>

            <div className="rounded-md border border-ridge/25 bg-white/45 p-4">
              <dt className="text-xs font-black uppercase tracking-wide text-bark/55">
                <LocalizedText en="Coordinates" zh="坐标" />
              </dt>
              <dd className="mt-2 text-lg font-black">
                {destination.latitude}, {destination.longitude}
              </dd>
            </div>
          </dl>

          {galleryImages.length > 0 && (
            <section className="border-t border-ridge/30 p-6 sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-forest">
                    <LocalizedText en="Destination gallery" zh="目的地图库" />
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-bark">
                    <LocalizedText en="Visual context" zh="视觉参考" />
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-bark/70">
                  <LocalizedText
                    en="These images are licensed context photos for the destination. They are not route topos or guidebook substitutes."
                    zh="这些图片是目的地的授权/开放许可视觉参考，不是 topo，也不是路书替代品。"
                  />
                </p>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {galleryImages.map((image) => (
                  <figure
                    className="overflow-hidden rounded-md border border-ridge/25 bg-white/45"
                    key={image.src}
                  >
                    <img
                      alt={image.alt}
                      className="h-64 w-full object-cover"
                      src={image.src}
                    />
                    <figcaption className="space-y-1 p-3 text-xs leading-5 text-bark/70">
                      <p className="font-bold text-bark">{image.caption}</p>
                      <p>
                        <LocalizedText
                          en="Destination context photo."
                          zh="目的地环境照片。"
                        />
                      </p>
                      <p>
                        {image.credit} - {image.license}
                      </p>
                      <a
                        className="font-bold text-forest underline decoration-forest/40 underline-offset-4"
                        href={image.sourceUrl}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <LocalizedText en="Image source" zh="图片来源" />
                      </a>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {guideContent && (
            <section className="border-t border-ridge/30 p-6 sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-forest">
                    <LocalizedText en="Field guide" zh="攀岩旅行手记" />
                  </p>
                  <h2 className="mt-2 text-3xl font-black text-bark">
                    <LocalizedText en="History, mood, and first picks" zh="历史、氛围和第一次怎么选" />
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-bark/70">
                  <LocalizedText
                    en="Original ClimbAtlas notes for deciding what to climb next. For detailed beta, use the external links and current local resources."
                    zh="ClimbAtlas 原创导读，帮助你决定下一条想爬什么。具体 beta 请查看外部链接和最新当地资料。"
                  />
                </p>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <article className="handdrawn-card bg-white/45 p-5">
                  <h3 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
                    <LocalizedText en="Local history" zh="当地历史" />
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-bark/75">
                    <LocalizedText
                      en={guideContent.history.en ?? ""}
                      zh={guideContent.history.zh ?? guideContent.history.en ?? ""}
                    />
                  </p>
                </article>

                <article className="handdrawn-card bg-parchment/70 p-5">
                  <h3 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
                    <LocalizedText en="Area atmosphere" zh="区域氛围" />
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-bark/75">
                    <LocalizedText
                      en={guideContent.atmosphere.en ?? ""}
                      zh={guideContent.atmosphere.zh ?? guideContent.atmosphere.en ?? ""}
                    />
                  </p>
                </article>

              </div>

              <div className="mt-4 rounded-md border border-forest/20 bg-forest/10 p-5">
                <h3 className="text-xs font-black uppercase tracking-[0.18em] text-forest">
                  <LocalizedText en="First-visit route picking" zh="第一次来怎么选" />
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(guideContent.firstVisitTips.en ?? []).map((item, index) => (
                    <span
                      className="rounded-md border border-forest/20 bg-white/55 px-3 py-2 text-xs font-black text-bark/70"
                      key={item}
                    >
                      <LocalizedText
                        en={item}
                        zh={guideContent.firstVisitTips.zh?.[index] ?? item}
                      />
                    </span>
                  ))}
                </div>
              </div>

              {destination.externalResources &&
                destination.externalResources.length > 0 && (
                  <div className="mt-5 rounded-md border border-ridge/25 bg-white/45 p-5">
                    <h3 className="text-xs font-black uppercase tracking-[0.18em] text-ridge">
                      <LocalizedText en="Further reading" zh="继续阅读" />
                    </h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {destination.externalResources.map((resource) => (
                        <a
                          className="rounded-md border border-ridge/25 bg-parchment/60 p-3 transition hover:border-forest/35 hover:bg-parchment"
                          href={resource.url}
                          key={`${resource.url}-${resource.title}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <span className="text-[11px] font-black uppercase text-ridge">
                            {resource.type}
                          </span>
                          <span className="mt-1 block text-sm font-black text-forest underline decoration-forest/35 underline-offset-4">
                            {resource.title}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-bark/65">
                            <LocalizedText
                              en={resource.description.en ?? ""}
                              zh={
                                resource.description.zh ??
                                resource.description.en ??
                                ""
                              }
                            />
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </section>
          )}

          <DestinationDnaMatch
            destinationName={destination.name}
            destinationSlug={destination.slug}
          />

          <section className="border-t border-ridge/30 px-6 py-8 sm:px-8">
            {explorerRoutes.length > 0 ? (
              <RouteIndex
                destinationName={destination.name}
                destinationSlug={destination.slug}
                routes={explorerRoutes}
              />
            ) : (
              <div className="border-y border-dashed border-ridge/45 py-10">
                <p className="text-sm font-bold leading-6 text-bark/70">
                  <LocalizedText
                    en="No source-backed routes have been added for this destination yet."
                    zh="这个目的地还没有加入有来源支持的路线。"
                  />
                </p>
              </div>
            )}
          </section>
        </section>
      </div>
      </div>
    </main>
  );
}
