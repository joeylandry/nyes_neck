/**
 * A small evergreen wreath with a red bow and holly berries, sized to sit
 * beside a heading (it scales with the heading's font size).
 */
const GREENS = ["#174a2a", "#1e5a32", "#2b7340", "#3b8a4c"];

function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildWreath() {
  const random = seededRandom(1225);
  const needles: Array<{ x1: number; y1: number; x2: number; y2: number; color: string }> = [];
  for (let step = 0; step < 56; step += 1) {
    const around = (step / 56) * Math.PI * 2;
    for (let n = 0; n < 4; n += 1) {
      const radius = 15 + (random() - 0.5) * 6;
      const x = 24 + Math.cos(around) * radius;
      const y = 24 + Math.sin(around) * radius;
      const angle = around + Math.PI / 2 + (random() - 0.5) * 2.2;
      const length = 3.5 + random() * 3;
      needles.push({ x1: x, y1: y, x2: x + Math.cos(angle) * length, y2: y + Math.sin(angle) * length, color: GREENS[Math.floor(random() * GREENS.length)] });
    }
  }
  // Berry clusters spaced around the top two-thirds, clear of the bow.
  const berries = [-150, -110, -70, -30, 10, -190].flatMap((degrees) => {
    const angle = (degrees * Math.PI) / 180;
    const x = 24 + Math.cos(angle) * 15;
    const y = 24 + Math.sin(angle) * 15;
    return [{ x, y }, { x: x + 2.1, y: y + 1.2 }];
  });
  return { needles, berries };
}

const { needles, berries } = buildWreath();

export function Wreath({ className = "", viewBox = "0 0 48 52" }: { className?: string; viewBox?: string }) {
  return (
    <svg aria-hidden="true" viewBox={viewBox} className={`inline-block w-auto shrink-0 ${className}`}>
      <g strokeLinecap="round" strokeWidth="1.6">
        {needles.map((needle, index) => (
          <line key={index} x1={needle.x1.toFixed(1)} y1={needle.y1.toFixed(1)} x2={needle.x2.toFixed(1)} y2={needle.y2.toFixed(1)} stroke={needle.color} />
        ))}
      </g>
      {berries.map((berry, index) => <circle key={index} cx={berry.x.toFixed(1)} cy={berry.y.toFixed(1)} r="1.5" fill="#d4252f" />)}
      <g transform="translate(24 40)">
        <path d="M-1 1 L-6 12 L-3 10.5 L-1.5 13.5 Z M1 1 L6 12 L3 10.5 L1.5 13.5 Z" fill="#a8172a" />
        <ellipse cx="-5" cy="-0.5" rx="5.5" ry="3.4" transform="rotate(-18 -5 -0.5)" fill="#c8202f" />
        <ellipse cx="5" cy="-0.5" rx="5.5" ry="3.4" transform="rotate(18 5 -0.5)" fill="#c8202f" />
        <circle r="2.3" fill="#e23a45" />
      </g>
    </svg>
  );
}

/**
 * Renders text with every "o" drawn as a wreath. The real text stays in the
 * page for screen readers and search; the decorated copy is hidden from them.
 * The ring sits on the baseline at the letter's height, and the bow hangs
 * just below it like a descender.
 */
export function WreathText({ text }: { text: string }) {
  const parts = text.split(/([oO])/);
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {parts.map((part, index) => {
          if (part === "O") return <Wreath key={index} viewBox="3 3 42 51" className="mx-[0.02em] h-[0.86em] align-[-0.15em]" />;
          if (part === "o") return <Wreath key={index} viewBox="3 3 42 51" className="mx-[0.02em] h-[0.64em] align-[-0.11em]" />;
          return part;
        })}
      </span>
    </>
  );
}
