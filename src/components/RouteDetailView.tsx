"use client";

import type { ReactNode } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { formatSourceCount } from "@/lib/formatters";
import type {
  ExternalResourceViewModel,
  PublicEvidenceViewModel,
  PublicMediaViewModel,
  PublicSourceViewModel,
  RouteDetailViewModel
} from "@/lib/routes/presentation/route-detail-view-model";
import type { Locale } from "@/types/destination";

type LocalizedRouteDetailViewProps = {
  viewModels: Record<Locale, RouteDetailViewModel>;
  dnaPanel?: ReactNode;
  savePanel?: ReactNode;
};

export function LocalizedRouteDetailView({
  viewModels,
  dnaPanel,
  savePanel
}: LocalizedRouteDetailViewProps) {
  const { locale } = useLanguage();
  return (
    <RouteDetailView
      dnaPanel={dnaPanel}
      savePanel={savePanel}
      viewModel={viewModels[locale]}
    />
  );
}

// Public route UI receives presentation data only. It never reads raw adapters.
export function RouteDetailView({
  dnaPanel,
  savePanel,
  viewModel
}: {
  dnaPanel?: ReactNode;
  savePanel?: ReactNode;
  viewModel: RouteDetailViewModel;
}) {
  const { locale } = useLanguage();
  const isZh = locale === "zh";
  const { experience, facts, identity, publishedEditorial } = viewModel;
  const exactImages = viewModel.media?.routeImages ?? [];
  const contextImages = viewModel.media?.contextImages ?? [];
  const heroImage = exactImages[0];
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
    <article className="route-experience-page">
      <header className="border-b border-brandforest/15 pb-9">
        <div className={heroImage ? "grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-end" : "max-w-4xl"}>
          <div>
            <p className="editorial-kicker text-terracotta">
              {identity.destinationName}
            </p>
            <h1 className="display-serif mt-3 text-5xl font-medium leading-[0.98] text-brandforest sm:text-6xl">
              {identity.name}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="route-result-badge bg-brandforest text-cream">
                {facts.climbingTypeLabel}
              </span>
              {viewModel.badges.isPublishedPick && (
                <span className="route-result-badge border border-terracotta/35 text-terracotta">
                  {isZh ? "ClimbAtlas 精选" : "ClimbAtlas Pick"}
                </span>
              )}
              {viewModel.routeSources.length > 0 && (
                <span className="route-result-badge border border-brandforest/15 text-brandforest">
                  {formatSourceCount(viewModel.routeSources.length, locale)}
                </span>
              )}
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-charcoal/62">
              {isZh
                ? "查看已记录的事实与可追溯来源；具体 beta、通行信息和当地安排请以最新外部资料为准。"
                : "Review recorded facts and traceable sources. Use current external resources for beta, access, and local guidance."}
            </p>
          </div>

          {heroImage && (
            <figure className="overflow-hidden border border-brandforest/15 bg-white/45">
              <img
                alt={heroImage.alt}
                className="aspect-[4/3] w-full object-cover"
                fetchPriority="high"
                src={heroImage.src}
              />
              <MediaCaption image={heroImage} isZh={isZh} />
            </figure>
          )}
        </div>

        <dl className="mt-8 grid border-y border-brandforest/15 sm:grid-cols-2 lg:grid-cols-4">
          {facts.originalGrade && (
            <Fact label={isZh ? "原始难度" : "Original grade"} value={facts.originalGrade} />
          )}
          {facts.gradeSystemLabel && (
            <Fact label={isZh ? "难度体系" : "Grade system"} value={facts.gradeSystemLabel} />
          )}
          <Fact label={isZh ? "攀岩类型" : "Climbing type"} value={facts.climbingTypeLabel} />
          {facts.lengthLabel && <Fact label={isZh ? "长度" : "Length"} value={facts.lengthLabel} />}
          {facts.pitchesLabel && <Fact label={isZh ? "段数" : "Pitches"} value={facts.pitchesLabel} />}
          {facts.routeFormatLabel && <Fact label={isZh ? "线路形式" : "Route format"} value={facts.routeFormatLabel} />}
          {identity.sectorName ? (
            <Fact label={isZh ? "分区" : "Sector"} value={identity.sectorName} />
          ) : identity.areaName ? (
            <Fact label={isZh ? "区域" : "Area"} value={identity.areaName} />
          ) : null}
        </dl>

        {facts.equivalentGradeLabels?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {facts.equivalentGradeLabels.map((label) => (
              <span className="route-result-badge border border-brandforest/15 text-brandforest" key={label}>
                {label}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      {savePanel && <div className="mt-7">{savePanel}</div>}

      {publishedEditorial && experience && (
        <>
          <section className="route-experience-section" id="what-to-expect">
            <SectionHeading
              eyebrow={isZh ? "线路体验" : "Route experience"}
              title={isZh ? "你可以期待什么" : "What to expect"}
            />
            <div className="mt-7 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h3 className="route-filter-label">{isZh ? "为什么值得考虑" : "Why consider it"}</h3>
                <p className="mt-3 text-base leading-7 text-charcoal/68">
                  {publishedEditorial.whyItStandsOut ?? publishedEditorial.summary}
                </p>
                {publishedEditorial.bestFor && (
                  <div className="mt-6 border-l-2 border-terracotta/55 pl-4">
                    <h3 className="route-filter-label">{isZh ? "更适合" : "Best for"}</h3>
                    <p className="mt-2 text-sm leading-6 text-charcoal/65">{publishedEditorial.bestFor}</p>
                  </div>
                )}
              </div>
              <EvidenceGrid
                entries={[
                  [isZh ? "岩壁角度" : "Wall angle", experience.whatToExpect.wallAngle],
                  [isZh ? "主要地形" : "Terrain", experience.whatToExpect.terrain],
                  [isZh ? "动作倾向" : "Movement tendency", experience.whatToExpect.movementTendency],
                  [isZh ? "难度形态" : "Difficulty shape", experience.whatToExpect.difficultyShape]
                ]}
                isZh={isZh}
              />
            </div>
          </section>

          <section className="route-experience-section" id="challenge-profile">
            <SectionHeading
              eyebrow={isZh ? "选择参考" : "Decision support"}
              title={isZh ? "挑战画像" : "Challenge profile"}
            />
            <EvidenceGrid
              entries={[
                [isZh ? "主要需求" : "Primary demand", experience.challenge.primaryDemand],
                [isZh ? "次要需求" : "Secondary demand", experience.challenge.secondaryDemand],
                [isZh ? "难点模式" : "Crux pattern", experience.challenge.cruxPattern],
                [isZh ? "持续性" : "Sustainedness", experience.challenge.sustainedness],
                [isZh ? "暴露感" : "Exposure", experience.challenge.exposure],
                [isZh ? "投入度" : "Commitment", experience.challenge.commitment]
              ]}
              isZh={isZh}
            />
            {publishedEditorial.thingsToConsider?.length ? (
              <div className="mt-8 border-y border-brandforest/12 py-6">
                <h3 className="route-filter-label">{isZh ? "选择前可以想一想" : "Things to consider"}</h3>
                <ul className="mt-4 grid gap-3 md:grid-cols-2">
                  {publishedEditorial.thingsToConsider.map((item) => (
                    <li className="border-l-2 border-sky/70 pl-3 text-sm leading-6 text-charcoal/65" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          {dnaPanel}

          {experience.logistics && (
            <section className="route-experience-section" id="logistics">
              <SectionHeading
                eyebrow={isZh ? "低风险事实" : "Low-risk facts"}
                title={isZh ? "行程信息" : "Logistics"}
              />
              <EvidenceGrid
                entries={[
                  [isZh ? "接近时间" : "Approach time", experience.logistics.approach],
                  [isZh ? "朝向" : "Aspect", experience.logistics.aspect],
                  [isZh ? "日照" : "Sun", experience.logistics.sun]
                ]}
                isZh={isZh}
              />
              <p className="mt-5 max-w-3xl text-xs leading-5 text-charcoal/50">
                {isZh
                  ? "这里不提供绳长、装备、保护或下降建议。出发前请核对最新官方或当地资料。"
                  : "This section does not provide rope, equipment, protection, or descent advice. Check current official or local resources before setting out."}
              </p>
            </section>
          )}
        </>
      )}

      {(exactImages.length > 1 || contextImages.length > 0) && (
        <MediaSection
          contextImages={contextImages}
          isZh={isZh}
          routeImages={exactImages.slice(1)}
        />
      )}

      <section className="route-experience-section" id="sources">
        <SectionHeading
          eyebrow={isZh ? "可追溯资料" : "Traceable references"}
          title={isZh ? "来源与外部资料" : "Sources and external resources"}
        />
        <SourceSection
          emptyText={isZh ? "目前没有可用的单条线路来源。" : "No route-specific source is available yet."}
          entries={viewModel.routeSources}
          heading={isZh ? "线路来源" : "Route sources"}
        />
        {viewModel.accessSources.length > 0 && (
          <SourceSection entries={viewModel.accessSources} heading={isZh ? "通行与当地信息" : "Access and local information"} />
        )}
        <ResourceSection heading={isZh ? "线路外部资料" : "Route resources"} resources={routeResources} />
        <ResourceSection heading={isZh ? "通行与区域资料" : "Access and area resources"} resources={accessResources} />
        <ResourceSection heading={isZh ? "继续阅读" : "Further reading"} resources={supplementalResources} />
        {viewModel.contextSources.length > 0 && (
          <details className="mt-8 border-y border-brandforest/15 py-4">
            <summary className="cursor-pointer text-sm font-semibold text-brandforest">
              {isZh ? "背景参考" : "Context references"}
            </summary>
            <SourceSection entries={viewModel.contextSources} heading={isZh ? "目的地与历史背景" : "Destination and historical context"} />
          </details>
        )}
        <details className="mt-8 border-y border-brandforest/15 py-4">
          <summary className="cursor-pointer text-sm font-semibold text-brandforest">
            {isZh ? "来源说明" : "Source policy"}
          </summary>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-charcoal/62">
            {isZh
              ? "来源事实、ClimbAtlas 编辑判断和基于结构化数据的推断会分开标示。我们不复制外部 beta、topo、保护说明、进出场信息、评论或评分。"
              : "Facts from cited references, ClimbAtlas editorial judgment, and attributes derived from recorded data are labeled separately. We do not reproduce external beta, topos, protection details, approaches, descents, comments, or ratings."}
          </p>
        </details>
      </section>
    </article>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="editorial-kicker text-terracotta">{eyebrow}</p>
      <h2 className="display-serif mt-2 text-3xl font-medium text-brandforest sm:text-4xl">{title}</h2>
    </div>
  );
}

function EvidenceGrid({
  entries,
  isZh
}: {
  entries: Array<[string, PublicEvidenceViewModel | undefined]>;
  isZh: boolean;
}) {
  const visible = entries.filter(
    (entry): entry is [string, PublicEvidenceViewModel] => Boolean(entry[1])
  );
  if (!visible.length) return null;
  return (
    <dl className="mt-7 grid border-y border-brandforest/15 sm:grid-cols-2">
      {visible.map(([label, evidence]) => (
        <div className="border-b border-brandforest/10 py-5 sm:px-5 sm:odd:border-r" key={label}>
          <dt className="route-filter-label">{label}</dt>
          <dd className="mt-2 text-base font-semibold text-brandforest">{evidence.value}</dd>
          <EvidenceMeta evidence={evidence} isZh={isZh} />
        </div>
      ))}
    </dl>
  );
}

function EvidenceMeta({ evidence, isZh }: { evidence: PublicEvidenceViewModel; isZh: boolean }) {
  return (
    <div className="mt-3 text-xs leading-5 text-charcoal/50">
      <span className="font-semibold text-terracotta">{evidence.originLabel}</span>
      {evidence.checkedAtLabel ? ` · ${evidence.checkedAtLabel}` : ""}
      {evidence.inferenceLabel && <span className="block">{evidence.inferenceLabel}</span>}
      {evidence.sources.length > 0 && (
        <span className="mt-1 block">
          {isZh ? "依据：" : "Evidence: "}
          {evidence.sources.map((source, index) => (
            <span key={source.id}>
              {index > 0 ? ", " : ""}
              <a className="text-link" href={source.url} rel="noreferrer" target="_blank">{source.label}</a>
            </span>
          ))}
        </span>
      )}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-brandforest/10 py-4 sm:px-5 sm:odd:border-r lg:border-b-0 lg:border-r">
      <dt className="text-xs font-semibold text-charcoal/48">{label}</dt>
      <dd className="mt-1 font-semibold text-brandforest">{value}</dd>
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

function ResourceSection({ heading, resources }: { heading: string; resources: ExternalResourceViewModel[] }) {
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
  return (
    <section className="route-experience-section" id="photos">
      <SectionHeading eyebrow={isZh ? "授权媒体" : "Licensed media"} title={isZh ? "图片" : "Photos"} />
      {routeImages.length > 0 && <MediaGrid heading={isZh ? "具体线路照片" : "Exact route photos"} images={routeImages} isZh={isZh} />}
      {contextImages.length > 0 && <MediaGrid heading={isZh ? "区域背景（不是这条具体线路）" : "Area context — not this route"} images={contextImages} isZh={isZh} />}
    </section>
  );
}

function MediaGrid({ heading, images, isZh }: { heading: string; images: PublicMediaViewModel[]; isZh: boolean }) {
  return (
    <div className="mt-7">
      <h3 className="route-filter-label">{heading}</h3>
      <div className="mt-3 grid gap-5 sm:grid-cols-2">
        {images.map((image) => (
          <figure className="overflow-hidden border border-brandforest/15 bg-white/45" key={`${image.kind}-${image.src}`}>
            <img alt={image.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" src={image.src} />
            <MediaCaption image={image} isZh={isZh} />
          </figure>
        ))}
      </div>
    </div>
  );
}

function MediaCaption({ image, isZh }: { image: PublicMediaViewModel; isZh: boolean }) {
  return (
    <figcaption className="p-4 text-xs leading-5 text-charcoal/58">
      {image.caption && <span className="block text-sm text-charcoal/68">{image.caption}</span>}
      <span className="mt-2 block">{image.attribution} · {image.license}</span>
      <a className="text-link mt-2 inline-flex" href={image.sourceUrl} rel="noreferrer" target="_blank">
        {isZh ? "图片来源" : "Image source"}
      </a>
    </figcaption>
  );
}
