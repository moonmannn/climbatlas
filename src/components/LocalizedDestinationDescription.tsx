"use client";

import { getDestinationDescription } from "@/data/localizedContent";
import { useLanguage } from "@/components/LanguageProvider";
import type { Destination } from "@/types/destination";

export function LocalizedDestinationDescription({
  destination
}: {
  destination: Destination;
}) {
  const { locale } = useLanguage();

  return <>{getDestinationDescription(destination, locale)}</>;
}
