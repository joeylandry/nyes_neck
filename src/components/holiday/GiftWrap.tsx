/**
 * Wraps a tile like a present: one ribbon down, one across, and a bow where
 * they cross. Decorative only, so it is hidden from assistive tech and lets
 * clicks through to the tile's link.
 */
export function GiftWrap({ ribbon, shade }: { ribbon: string; shade: string }) {
  const band = `linear-gradient(90deg, ${shade} 0 12%, ${ribbon} 12% 88%, ${shade} 88% 100%)`;
  const bandAcross = `linear-gradient(180deg, ${shade} 0 12%, ${ribbon} 12% 88%, ${shade} 88% 100%)`;
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <span className="absolute inset-y-0 left-[62%] w-3.5 md:left-[72%] -translate-x-1/2 shadow-[0_0_6px_rgba(0,0,0,0.15)] md:w-[18px]" style={{ backgroundImage: band }} />
      <span className="absolute inset-x-0 top-[38%] h-3.5 md:top-[36%] -translate-y-1/2 shadow-[0_0_6px_rgba(0,0,0,0.15)] md:h-[18px]" style={{ backgroundImage: bandAcross }} />
      <svg viewBox="0 0 80 60" className="absolute left-[62%] top-[38%] w-14 md:left-[72%] md:top-[36%] -translate-x-1/2 -translate-y-[55%] drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)] md:w-20">
        {/* tails */}
        <path d="M37 32 L26 56 L31 54 L34 59 L40 35 Z" fill={shade} />
        <path d="M43 32 L54 56 L49 54 L46 59 L40 35 Z" fill={ribbon} />
        {/* loops */}
        <path d="M40 30 C30 10 8 6 6 18 C4 30 24 34 40 30 Z" fill={ribbon} />
        <path d="M40 30 C50 10 72 6 74 18 C76 30 56 34 40 30 Z" fill={ribbon} />
        <path d="M40 30 C31 16 15 13 13 19 C12 25 26 29 40 30 Z" fill={shade} opacity="0.55" />
        <path d="M40 30 C49 16 65 13 67 19 C68 25 54 29 40 30 Z" fill={shade} opacity="0.55" />
        {/* knot */}
        <rect x="33.5" y="23" width="13" height="14" rx="4" fill={ribbon} />
        <rect x="33.5" y="23" width="13" height="14" rx="4" fill="none" stroke={shade} strokeWidth="1.5" />
      </svg>
    </span>
  );
}
