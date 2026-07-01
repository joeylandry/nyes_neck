import type { Metadata } from "next";
import { HeroGallery } from "@/components/home/HeroGallery";

export const metadata: Metadata = {
  title: "NYES NECK",
};

export default function HomePage() {
  return (
    <main className="site-main h-[100svh] overflow-hidden md:h-[100dvh]">
      <HeroGallery />
    </main>
  );
}
