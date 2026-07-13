import type { Metadata } from "next";
import { ClimbingDnaPrototype } from "@/components/ClimbingDnaPrototype";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Climbing DNA | ClimbAtlas",
  description: "Discover the climbing places and experiences that fit how you climb."
};

export default function ClimbingDnaPage() {
  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <SiteHeader />
      <ClimbingDnaPrototype />
    </div>
  );
}
