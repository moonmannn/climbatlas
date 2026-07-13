"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { ImageAsset } from "@/types/destination";

const fallbackImages = [
  "/images/editorial/forest-granite-plate.png",
  "/images/editorial/seaside-limestone-plate.png",
  "/images/editorial/climbatlas-discovery-hero.png"
];

function getFallback(slug: string) {
  const hash = slug.split("").reduce((total, character) => total + character.charCodeAt(0), 0);
  return fallbackImages[hash % fallbackImages.length];
}

export function DestinationHeroImage({ image, slug }: { image?: ImageAsset; slug: string }) {
  const { locale } = useLanguage();
  const [failed, setFailed] = useState(false);
  const useFallback = !image || failed;

  return (
    <figure>
      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-sand/30">
        <img
          alt={useFallback ? (locale === "zh" ? "ClimbAtlas 原创户外艺术图版" : "Original ClimbAtlas outdoor art plate") : image.alt}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
          src={useFallback ? getFallback(slug) : image.src}
        />
      </div>
      <figcaption className="mt-3 text-xs leading-5 text-charcoal/48">
        {useFallback
          ? locale === "zh" ? "ClimbAtlas 原创编辑插画，不是这个目的地的精确照片。" : "Original ClimbAtlas editorial artwork, not an exact photo of this destination."
          : `${image.caption} · ${image.credit} · ${image.license}`}
      </figcaption>
    </figure>
  );
}
