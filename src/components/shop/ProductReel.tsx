"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

export function ProductReel({
  products,
  returnTo = "shop",
  prioritizeFirst = true,
}: {
  products: Product[];
  returnTo?: string;
  prioritizeFirst?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState({ start: false, end: false });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setOverflow({
      start: track.scrollLeft > 4,
      // A 4px slack absorbs sub-pixel rounding at the end of the track.
      end: track.scrollLeft < maxScroll - 4,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // ResizeObserver fires on observe, which also gives the first measurement.
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    track.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const scrollByPage = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="-mr-3 flex snap-x snap-mandatory scroll-pl-0 gap-3 overflow-x-auto pr-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mr-6 md:gap-5 md:pr-6 md:pb-3"
      >
        {products.map((product, index) => (
          <div key={product.id} className="w-[72vw] min-w-[250px] max-w-[350px] shrink-0 snap-start md:w-[28vw] md:max-w-[260px] lg:w-[240px]">
            <ProductCard product={product} returnTo={returnTo} priority={prioritizeFirst && index === 0} compact touchSwipeFallback />
          </div>
        ))}
      </div>

      {/* Touch devices scroll the track directly; these give pointer users the
          same affordance, since the scrollbar is hidden. */}
      <ReelButton side="left" visible={overflow.start} onClick={() => scrollByPage(-1)} />
      <ReelButton side="right" visible={overflow.end} onClick={() => scrollByPage(1)} />
    </div>
  );
}

function ReelButton({ side, visible, onClick }: { side: "left" | "right"; visible: boolean; onClick: () => void }) {
  const isLeft = side === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={visible ? undefined : -1}
      aria-hidden={!visible}
      aria-label={isLeft ? "Scroll products left" : "Scroll products right"}
      className={`absolute top-[38%] hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-black/10 bg-white/95 text-xl shadow-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black md:grid ${
        isLeft ? "-left-3" : "-right-3"
      } ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <span aria-hidden="true">{isLeft ? "‹" : "›"}</span>
    </button>
  );
}
