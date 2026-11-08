/**
 * A string of old-fashioned C7-style bulbs hanging from the bottom edge of the
 * fixed header, so it stays in place while the page scrolls underneath.
 * Purely decorative: hidden from assistive tech and click-through.
 */
const BULB_COLORS = ["#e3262f", "#f29a16", "#1f9d4c", "#2d68d8", "#f4cf2d"];
const SPACING = 64;
const BULB_COUNT = 64; // 64 × 64px covers screens up to ~3500px wide.

// One sag of wire per bulb, drawn as a repeating background tile.
const wire = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='${SPACING}' height='20'><path d='M0 1.5 Q${SPACING / 2} 19 ${SPACING} 1.5' fill='none' stroke='#1f3a26' stroke-width='1.8'/></svg>`,
)}")`;

export function ChristmasLights() {
  return (
    <div aria-hidden="true" className="holiday-lights pointer-events-none absolute inset-x-0 top-full h-10 overflow-hidden" style={{ backgroundImage: wire }}>
      <div className="flex">
        {Array.from({ length: BULB_COUNT }, (_, index) => {
          const color = BULB_COLORS[index % BULB_COLORS.length];
          return (
            <span key={index} className="flex shrink-0 justify-center" style={{ width: SPACING }}>
              <svg
                viewBox="0 0 12 22"
                width="15"
                height="27"
                className="holiday-bulb mt-[7px]"
                style={{
                  color,
                  rotate: `${index % 2 ? 7 : -7}deg`,
                  animationDelay: `${(index * 0.37) % 2.4}s`,
                  animationDuration: `${1.8 + (index % 4) * 0.35}s`,
                }}
              >
                <rect x="3.5" y="0" width="5" height="6" rx="1" fill="#24452c" />
                <path d="M6 5.2C1.6 8.4 1.2 15.6 6 21.5 10.8 15.6 10.4 8.4 6 5.2Z" fill="currentColor" />
                <ellipse cx="4.4" cy="11.5" rx="1.1" ry="3" fill="#fff" opacity="0.45" />
              </svg>
            </span>
          );
        })}
      </div>
    </div>
  );
}
