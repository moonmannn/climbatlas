"use client";

import { useLanguage } from "@/components/LanguageProvider";
import type { ImageAsset } from "@/types/destination";

export function ImageAttribution({ image }: { image: ImageAsset }) {
  const { locale } = useLanguage();
  const linkClass = "underline decoration-current/30 underline-offset-2 hover:text-brandforest";

  return (
    <div className="space-y-1 text-xs leading-5 text-charcoal/60 [overflow-wrap:anywhere]">
      <p>
        <a className={linkClass} href={image.sourceUrl} rel="noreferrer" target="_blank">
          {image.title ?? (locale === "zh" ? "图片来源" : "Image source")}
        </a>
        {" · "}{image.credit}{" · "}
        {image.licenseUrl ? (
          <a className={linkClass} href={image.licenseUrl} rel="license noreferrer" target="_blank">
            {image.license}
          </a>
        ) : image.license}
      </p>
      {image.modification && (
        <p>
          {locale === "zh"
            ? "已缩放并转换为 WebP；画面内容未修改。"
            : image.modification}
        </p>
      )}
    </div>
  );
}
