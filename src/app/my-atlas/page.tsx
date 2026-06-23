import type { Metadata } from "next";
import { MyAtlasClient } from "@/components/MyAtlasClient";

export const metadata: Metadata = {
  title: "My Atlas | ClimbAtlas"
};

export default function MyAtlasPage() {
  return <MyAtlasClient />;
}
