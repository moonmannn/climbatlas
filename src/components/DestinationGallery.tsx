"use client";

import { useEffect, useRef, useState } from "react";
import { ImageAttribution } from "@/components/ImageAttribution";
import { useLanguage } from "@/components/LanguageProvider";
import { formatImageCaption } from "@/lib/formatters";
import type { ImageAsset } from "@/types/destination";

export function DestinationGallery({ images }: { images: ImageAsset[] }) {
  const { locale } = useLanguage();
  const isZh = locale === "zh";
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activeImage = activeIndex === null ? undefined : images[activeIndex];
  const caption = (image: ImageAsset) =>
    isZh && image.captionZh ? image.captionZh : formatImageCaption(image.caption, locale);
  const alt = (image: ImageAsset) => isZh && image.altZh ? image.altZh : image.alt;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activeIndex !== null && !dialog.open) dialog.showModal();
    if (activeIndex === null && dialog.open) dialog.close();
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [activeIndex]);

  function navigate(direction: number) {
    setActiveIndex((current) => current === null ? null : (current + direction + images.length) % images.length);
  }

  return (
    <>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-destination-gallery>
        {images.map((image, index) => (
          <figure className="min-w-0" key={image.src}>
            <button
              aria-label={isZh ? `放大照片：${alt(image)}` : `Enlarge photo: ${alt(image)}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-md bg-sand/30 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brandforest"
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <img
                alt={alt(image)}
                className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
                decoding="async"
                height={image.height}
                loading="lazy"
                src={image.src}
                width={image.width}
              />
              <span aria-hidden="true" className="absolute bottom-3 right-3 rounded bg-cream/95 px-2 py-1 text-xs font-semibold text-brandforest">
                {isZh ? "放大" : "Enlarge"} ↗
              </span>
            </button>
            <figcaption className="space-y-2 py-3">
              <p className="text-sm font-semibold leading-6 text-charcoal">{caption(image)}</p>
              <ImageAttribution image={image} />
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        aria-label={isZh ? "目的地照片" : "Destination photos"}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto rounded-lg bg-cream p-4 text-charcoal shadow-xl backdrop:bg-charcoal/80 sm:p-6"
        onCancel={() => setActiveIndex(null)}
        onClick={(event) => { if (event.target === event.currentTarget) setActiveIndex(null); }}
        onClose={() => setActiveIndex(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") { event.preventDefault(); navigate(-1); }
          if (event.key === "ArrowRight") { event.preventDefault(); navigate(1); }
        }}
        ref={dialogRef}
      >
        {activeImage && (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <p aria-live="polite" className="text-sm font-semibold">{(activeIndex ?? 0) + 1} / {images.length}</p>
              <button autoFocus className="rounded border border-brandforest/25 px-4 py-2 text-sm font-semibold hover:bg-brandforest/5" onClick={() => setActiveIndex(null)} type="button">
                {isZh ? "关闭" : "Close"} ×
              </button>
            </div>
            <figure>
              <img alt={alt(activeImage)} className="max-h-[65dvh] w-full object-contain" height={activeImage.height} src={activeImage.src} width={activeImage.width} />
              <figcaption className="mt-4 space-y-2">
                <p className="font-semibold leading-6">{caption(activeImage)}</p>
                <ImageAttribution image={activeImage} />
              </figcaption>
            </figure>
            {images.length > 1 && (
              <div className="mt-5 flex justify-between gap-3">
                <button className="rounded border border-brandforest/25 px-4 py-2 text-sm font-semibold hover:bg-brandforest/5" onClick={() => navigate(-1)} type="button">← {isZh ? "上一张" : "Previous"}</button>
                <button className="rounded border border-brandforest/25 px-4 py-2 text-sm font-semibold hover:bg-brandforest/5" onClick={() => navigate(1)} type="button">{isZh ? "下一张" : "Next"} →</button>
              </div>
            )}
          </>
        )}
      </dialog>
    </>
  );
}
