"use client";

import { getLocalizedText } from "@/data/localizedContent";
import { useLanguage } from "@/components/LanguageProvider";
import type { LocalizedText } from "@/types/destination";

export function LocalizedDestinationDescription({
  description,
  localizedDescription
}: {
  description: string;
  localizedDescription?: LocalizedText;
}) {
  const { locale } = useLanguage();

  return <>{getLocalizedText(localizedDescription, locale, description)}</>;
}
