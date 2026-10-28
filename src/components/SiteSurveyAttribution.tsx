"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSiteSurveyContext } from "@/lib/siteSurvey";

export function SiteSurveyAttribution() {
  const pathname = usePathname();
  useEffect(() => { getSiteSurveyContext(); }, [pathname]);
  return null;
}
