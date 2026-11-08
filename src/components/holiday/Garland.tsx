/**
 * An evergreen garland swag with red bows, berries and gold ornaments. It is
 * a repeating SVG pattern, so it drapes across any width without stretching.
 */
const TILE_WIDTH = 220;
const TILE_HEIGHT = 52;
const GREENS = ["#174a2a", "#1e5a32", "#2b7340", "#3b8a4c"];

function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The swag: a quadratic curve from one bow, down, and back up to the next.
const curve = (t: number) => ({
  x: TILE_WIDTH * t,
  y: 9 + 2 * (1 - t) * t * 34,
});

function buildGarland() {
  const random = seededRandom(1225);
  const needles: Array<{ x1: number; y1: number; x2: number; y2: number; color: string }> = [];
  for (let step = 0; step <= 72; step += 1) {
    const { x, y } = curve(step / 72);
    for (let n = 0; n < 5; n += 1) {
      const angle = random() * Math.PI * 2;
      const length = 6 + random() * 6;
      const ox = (random() - 0.5) * 6;
      const oy = (random() - 0.5) * 6;
      needles.push({ x1: x + ox, y1: y + oy, x2: x + ox + Math.cos(angle) * length, y2: y + oy + Math.sin(angle) * length, color: GREENS[Math.floor(random() * GREENS.length)] });
    }
  }
  const berries = Array.from({ length: 9 }, (_, index) => {
    const { x, y } = curve(0.12 + (index / 8) * 0.76);
    return { x: x + (random() - 0.5) * 8, y: y + (random() - 0.5) * 8 };
  });
  return { needles, berries };
}

const { needles, berries } = buildGarland();

function Bow({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 10)`}>
      <path d="M-1 1 L-7 15 L-3 13 L-1 17 Z M1 1 L7 15 L3 13 L1 17 Z" fill="#a8172a" />
      <ellipse cx="-6" cy="-1" rx="6.5" ry="4" transform="rotate(-18 -6 -1)" fill="#c8202f" />
      <ellipse cx="6" cy="-1" rx="6.5" ry="4" transform="rotate(18 6 -1)" fill="#c8202f" />
      <circle r="2.8" fill="#e23a45" />
    </g>
  );
}

export function Garland({ className = "", id = "holiday-garland" }: { className?: string; id?: string }) {
  const low = curve(0.5);
  return (
    <svg aria-hidden="true" className={`block h-11 w-full md:h-[52px] ${className}`} preserveAspectRatio="xMidYMin slice" viewBox={`0 0 ${TILE_WIDTH * 6} ${TILE_HEIGHT}`}>
      <defs>
        <pattern id={id} width={TILE_WIDTH} height={TILE_HEIGHT} patternUnits="userSpaceOnUse">
          <g strokeLinecap="round" strokeWidth="2.1">
            {needles.map((needle, index) => (
              <line key={index} x1={needle.x1.toFixed(1)} y1={needle.y1.toFixed(1)} x2={needle.x2.toFixed(1)} y2={needle.y2.toFixed(1)} stroke={needle.color} />
            ))}
          </g>
          {berries.map((berry, index) => <circle key={index} cx={berry.x.toFixed(1)} cy={berry.y.toFixed(1)} r="2.4" fill={index % 3 ? "#d4252f" : "#e8b93a"} />)}
          <line x1={low.x} y1={low.y + 2} x2={low.x} y2={low.y + 7} stroke="#8a6d2a" strokeWidth="1" />
          <circle cx={low.x} cy={low.y + 11} r="5" fill="#d9a92c" />
          <circle cx={low.x - 1.6} cy={low.y + 9.4} r="1.4" fill="#fff" opacity="0.6" />
          <Bow x={0} />
          <Bow x={TILE_WIDTH} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
