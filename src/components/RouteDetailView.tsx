"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { formatSourceCount } from "@/lib/formatters";
import type {
  ExternalResourceViewModel,
  PublicMediaViewModel,
  PublicSourceViewModel,
  RouteDetailViewModel
} from "@/lib/routes/presentation/route-detail-view-model";
import type { Locale } from "@/types/destination";

type LocalizedRouteDetailViewProps = {
  viewModels: Record<Locale, RouteDetailViewModel>;
};

export function LocalizedRouteDetailView({
  viewModels
}: LocalizedRouteDetailViewProps) {
  const { locale } = useLanguage();
  return <RouteDetailView viewModel={viewModels[locale]} />;
}

// This public component deliberately accepts only the normalized presentation model.
export function RouteDetailView({
  viewModel
}: {
  viewModel: RouteDetailViewModel;
}) {
  const { locale } = useLanguage();
  const isZh = locale === "zh";
  const { facts, identity, publishedEditorial } = viewModel;
  const routeResources = viewModel.externalResources.filter(
    (resource) => resource.purpose === "route"
  );
  const accessResources = viewModel.externalResources.filter(
    (resource) => resource.purpose === "access"
  );
  const supplementalResources = viewModel.externalResources.filter(
    (resource) => resource.purpose === "supplemental"
  );

  return (
    <article className="border-y border-brandforest/15 py-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="route-result-badge bg-brandforest text-cream">
          {facts.climbingTypeLabel}
        </span>
        {viewModel.routeSources.length > 0 && (
          <span className="route-result-badge border border-brandforest/15 text-brandforest">
            {formatSourceCount(viewModel.routeSources.length, locale)}
          </span>
        )}
        {viewModel.badges.verificationLabel && (
          <span className="route-result-badge border border-terracotta/30 text-terracotta">
            {viewModel.badges.verificationLabel}
          </span>
        )}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <section aria-labelledby="route-facts-heading">
          <p className="editorial-kicker text-terracotta" id="route-facts-heading">
            {isZh ? "线路事实" : "Route facts"}
          </p>
          <dl className="mt-4 divide-y divide-brandforest/12 border-y border-brandforest/15">
            {facts.originalGrade && (
              <Fact label={isZh ? "原始难度" : "Original grade"} value={facts.originalGrade} />
            )}
            {facts.gradeSystemLabel && (
              <Fact label={isZh ? "难度体系" : "Grade system"} value={facts.gradeSystemLabel} />
            )}
            <Fact label={isZh ? "攀岩类型" : "Climbing type"} value={facts.climbingTypeLabel} />
            {facts.lengthLabel && (
              <Fact label={isZh ? "长度" : "Length"} value={facts.lengthLabel} />
            )}
            {facts.pitchesLabel && (
              <Fact label={isZh ? "段数" : "Pitches"} value={facts.pitchesLabel} />
            )}
            {facts.routeFormatLabel && (
              <Fact label={isZh ? "线路形式" : "Route format"} value={facts.routeFormatLabel} />
            )}
            {identity.sectorName ? (
              <Fact label={isZh ? "分区" : "Sector"} value={identity.sectorName} />
            ) : identity.areaName ? (
              <Fact label={isZh ? "区域" : "Area"} value={identity.areaName} />
            ) : null}
          </dl>

          {facts.equivalentGradeLabels && facts.equivalentGradeLabels.length > 0 && (
            <div className="mt-6">
              <h3 className="route-filter-label">
                {isZh ? "来源中的其他难度" : "Other source grades"}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {facts.equivalentGradeLabels.map((label) => (
                  <span
                    className="route-result-badge border border-brandforest/15 text-brandforest"
                    key={label}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="route-sources-heading">
          <p className="editorial-kicker text-terracotta" id="route-sources-heading">
            {isZh ? "来源与外部资料" : "Sources and external resources"}
          </p>
          <h2 className="display-serif mt-3 text-3xl font-medium text-brandforest">
            {isZh ? "核对线路资料" : "Check the route sources"}
          </h2>
          <SourceSection
            emptyText={isZh ? "目前没有可用的单条线路来源。" : "No route-specific source is available yet."}
            entries={viewModel.routeSources}
            heading={isZh ? "线路来源" : "Route sources"}
          />
          {viewModel.accessSources.length > 0 && (
            <SourceSection
              entries={viewModel.accessSources}
              heading={isZh ? "访问与当地信息" : "Access information"}
            />
          )}
          {viewModel.contextSources.length > 0 && (
            <details className="mt-8 border-y border-brandforest/15 py-4">
              <summary className="cursor-pointer text-sm font-semibold text-brandforest">
                {isZh ? "背景参考" : "Context references"}
              </summary>
              <SourceSection
                entries={viewModel.contextSources}
                heading={isZh ? "目的地与历史背景" : "Destination and historical context"}
              />
            </details>
          )}
          <ResourceSection
            heading={isZh ? "线路外部资料" : "Route resources"}
            resources={routeResources}
          />
          <ResourceSection
            heading={isZh ? "访问与区域资料" : "Access and area resources"}
            resources={accessResources}
          />
          <ResourceSection
            heading={isZh ? "补充阅读" : "Further reading"}
            resources={supplementalResources}
          />
          <details className="mt-8 border-y border-brandforest/15 py-4">
            <summary className="cursor-pointer text-sm font-semibold text-brandforest">
              {isZh ? "来源说明" : "Source policy"}
            </summary>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/62">
              {isZh
                ? "线路事实、通行资料和背景参考按用途分开显示。ClimbAtlas 不复制外部 beta、topo、保护说明、进出场信息、评论或评分；出行前请查看最新原始资料。"
                : "Route references, access information, and context are grouped by purpose. ClimbAtlas does not reproduce external beta, topos, protection details, approaches, descents, comments, or ratings; check current original resources before a trip."}
            </p>
          </details>
        </section>
      </div>

      {publishedEditorial && (
        <EditorialSection editorial={publishedEditorial} isZh={isZh} />
      )}

      {viewModel.media && (
        <MediaSection
          contextImages={viewModel.media.contextImages}
          isZh={isZh}
          routeImages={viewModel.media.routeImages}
        />
      )}
    </article>
  );
}

function EditorialSection({
  editorial,
  isZh
}: {
  editorial: NonNullable<RouteDetailViewModel["publishedEditorial"]>;
  isZh: boolean;
}) {
  const hasDecisionNotes = Boolean(
    editorial.bestFor || editorial.decisionHint || editorial.thingsToConsider?.length
  );

  return (
    <section className="mt-10 border-t border-brandforest/15 pt-8">
      <p className="editorial-kicker text-terracotta">
        {isZh ? "ClimbAtlas 编辑精选" : "ClimbAtlas editorial pick"}
      </p>
      {(editorial.summary || editorial.whyItStandsOut) && (
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          {editorial.summary && (
            <EditorialBlock
              heading={isZh ? "概览" : "Overview"}
              text={editorial.summary}
            />
          )}
          {editorial.whyItStandsOut && (
            <EditorialBlock
              heading={isZh ? "为什么值得留意" : "Why it stands out"}
              text={editorial.whyItStandsOut}
            />
          )}
        </div>
      )}

      {hasDecisionNotes && (
        <div className="mt-7 grid gap-6 border-y border-brandforest/12 py-6 md:grid-cols-2">
          {(editorial.bestFor || editorial.decisionHint) && (
            <div>
              <h3 className="route-filter-label">{isZh ? "选择参考" : "Choosing this route"}</h3>
              {editorial.bestFor && <p className="mt-3 text-sm leading-6 text-charcoal/65">{editorial.bestFor}</p>}
              {editorial.decisionHint && <p className="mt-3 text-sm font-semibold leading-6 text-brandforest">{editorial.decisionHint}</p>}
            </div>
          )}
          {editorial.thingsToConsider && editorial.thingsToConsider.length > 0 && (
            <div>
              <h3 className="route-filter-label">{isZh ? "值得考虑" : "Things to consider"}</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-charcoal/65">
                {editorial.thingsToConsider.map((item) => (
                  <li className="border-l-2 border-terracotta/45 pl-3" key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {(editorial.practiceFocus?.length || editorial.personalityTags?.length) && (
        <div className="mt-6 flex flex-wrap gap-2">
          {[...(editorial.practiceFocus ?? []), ...(editorial.personalityTags ?? [])].map((tag) => (
            <span className="route-result-badge border border-brandforest/15 text-brandforest" key={tag}>{tag}</span>
          ))}
        </div>
      )}

      {(editorial.historicalNote || editorial.notableAscents?.length) && (
        <div className="mt-8 border-t border-brandforest/12 pt-6">
          <h3 className="route-filter-label">{isZh ? "历史与攀登记录" : "History and notable ascents"}</h3>
          {editorial.historicalNote && <p className="mt-3 text-sm leading-7 text-charcoal/65">{editorial.historicalNote}</p>}
          {editorial.notableAscents && (
            <ul className="mt-4 space-y-3 text-sm leading-6 text-charcoal/65">
              {editorial.notableAscents.map((ascent) => (
                <li key={`${ascent.climber}-${ascent.sourceUrl}`}>
                  <strong className="text-brandforest">{ascent.climber}</strong>
                  {ascent.note ? ` · ${ascent.note}` : ""}
                  {" · "}
                  <a className="text-link" href={ascent.sourceUrl} rel="noreferrer" target="_blank">{ascent.sourceLabel}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function EditorialBlock({ heading, text }: { heading: string; text: string }) {
  return (
    <div>
      <h3 className="route-filter-label">{heading}</h3>
      <p className="mt-3 text-base leading-7 text-charcoal/65">{text}</p>
    </div>
  );
}

function SourceSection({
  emptyText,
  entries,
  heading
}: {
  emptyText?: string;
  entries: PublicSourceViewModel[];
  heading: string;
}) {
  if (entries.length === 0 && !emptyText) return null;
  return (
    <section className="mt-8">
      <h3 className="route-filter-label">{heading}</h3>
      {entries.length > 0 ? (
        <div className="mt-3 divide-y divide-brandforest/12 border-y border-brandforest/15">
          {entries.map((entry) => (
            <div className="py-5" key={`${entry.purpose}-${entry.url}`}>
              <a className="text-link" href={entry.url} rel="noreferrer" target="_blank">{entry.label}</a>
              {(entry.attribution || entry.checkedAtLabel || entry.license) && (
                <p className="mt-2 text-sm leading-6 text-charcoal/58">
                  {[entry.attribution, entry.license, entry.checkedAtLabel].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 border-y border-brandforest/15 py-4 text-sm leading-6 text-charcoal/58">{emptyText}</p>
      )}
    </section>
  );
}

function ResourceSection({
  heading,
  resources
}: {
  heading: string;
  resources: ExternalResourceViewModel[];
}) {
  if (resources.length === 0) return null;
  return (
    <section className="mt-8">
      <h3 className="route-filter-label">{heading}</h3>
      <div className="mt-3 divide-y divide-brandforest/12 border-y border-brandforest/15">
        {resources.map((resource) => (
          <div className="py-5" key={`${resource.purpose}-${resource.url}`}>
            <div className="flex flex-wrap items-center gap-3">
              <a className="text-link" href={resource.url} rel="noreferrer" target="_blank">{resource.title}</a>
              <span className="text-xs font-semibold text-charcoal/48">{resource.linkStatusLabel ?? resource.typeLabel}</span>
            </div>
            {resource.description && <p className="mt-2 text-sm leading-6 text-charcoal/58">{resource.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function MediaSection({
  contextImages,
  isZh,
  routeImages
}: {
  contextImages: PublicMediaViewModel[];
  isZh: boolean;
  routeImages: PublicMediaViewModel[];
}) {
  if (routeImages.length === 0 && contextImages.length === 0) return null;
  return (
    <section className="mt-10 border-t border-brandforest/15 pt-8">
      <p className="editorial-kicker text-terracotta">{isZh ? "图片与授权" : "Photos and licenses"}</p>
      {routeImages.length > 0 && (
        <MediaGrid
          heading={isZh ? "具体线路照片" : "Exact route photos"}
          images={routeImages}
          sourceLabel={isZh ? "图片来源" : "Image source"}
        />
      )}
      {contextImages.length > 0 && (
        <MediaGrid
          heading={isZh ? "区域背景照片（不是具体线路）" : "Area context photos (not the exact route)"}
          images={contextImages}
          sourceLabel={isZh ? "图片来源" : "Image source"}
        />
      )}
    </section>
  );
}

function MediaGrid({
  heading,
  images,
  sourceLabel
}: {
  heading: string;
  images: PublicMediaViewModel[];
  sourceLabel: string;
}) {
  return (
    <div className="mt-6">
      <h3 className="route-filter-label">{heading}</h3>
      <div className="mt-3 grid gap-5 sm:grid-cols-2">
        {images.map((image) => (
          <figure className="overflow-hidden border border-brandforest/15 bg-white/45" key={`${image.kind}-${image.src}`}>
            {/* External open-license images keep their original source metadata below. */}
            <img alt={image.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" src={image.src} />
            <figcaption className="p-4 text-xs leading-5 text-charcoal/58">
              {image.caption && <span className="block text-sm text-charcoal/68">{image.caption}</span>}
              <span className="mt-2 block">{image.attribution} · {image.license}</span>
              <a className="text-link mt-2 inline-flex" href={image.sourceUrl} rel="noreferrer" target="_blank">{sourceLabel}</a>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-4 py-3 text-sm">
      <dt className="font-semibold text-charcoal/48">{label}</dt>
      <dd className="font-semibold text-brandforest">{value}</dd>
    </div>
  );
}
