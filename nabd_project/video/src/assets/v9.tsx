// Drawings added for the v9 script (AWaRe, culture plate, the patient's story, burden bars, etc.)
import React from "react";
import { C, FONT } from "../theme";
import { sk } from "../components/Frame";
import { Face } from "./index";

export const AWARE = { access: "#7DBB6E", watch: "#F0A23B", reserve: "#D9483B" };

/** woman (simple, respectful): head scarf, friendly face; grey = after "وماتت" */
export const Woman: React.FC<{ grey?: number; mood?: number }> = ({ grey = 0, mood = 0.3 }) => {
  const g = (c: string) => (grey > 0.5 ? "#C9C4BC" : c);
  return (
    <g opacity={1 - 0.35 * grey}>
      <path d="M-120 250 C-120 90 -80 50 0 50 C80 50 120 90 120 250 Z" fill={g("#C8A2C8")} {...sk} />
      <path d="M-92 -20 C-100 -150 100 -150 92 -20 C96 40 60 70 0 74 C-60 70 -96 40 -92 -20 Z" fill={g("#9D86B5")} {...sk} />
      <circle cx={0} cy={-22} r={66} fill={g(C.skin)} {...sk} />
      <Face x={0} y={-16} size={0.85} mood={mood} />
      <path d="M-44 -64 C-30 -74 -14 -70 -8 -60 M44 -64 C30 -74 14 -70 8 -60" fill="none" {...sk} strokeWidth={4} stroke="#8C8C8C" opacity={0.7} />
    </g>
  );
};

/** pharmacy counter with a "+" sign */
export const Counter: React.FC = () => (
  <g>
    <rect x={-470} y={0} width={940} height={150} rx={18} fill="#E8D4B4" {...sk} />
    <rect x={-470} y={-16} width={940} height={30} rx={12} fill="#D3B88E" {...sk} />
    <g transform="translate(360 -330)">
      <rect x={-60} y={-60} width={120} height={120} rx={20} fill={C.paper} {...sk} />
      <path d="M0 -36 V36 M-36 0 H36" {...sk} stroke="#3FA34D" strokeWidth={18} />
    </g>
  </g>
);

/** one AWaRe group column: coloured capsule stack + label */
export const AwareColumn: React.FC<{ color: string; label: string; ar: string; glow?: number }> = ({ color, label, ar, glow = 0 }) => (
  <g>
    {glow > 0 && <rect x={-135} y={-280} width={270} height={560} rx={40} fill={color} opacity={0.18 * glow} />}
    <rect x={-120} y={-260} width={240} height={520} rx={34} fill={C.card} {...sk} />
    <rect x={-120} y={-260} width={240} height={90} rx={34} fill={color} {...sk} />
    <text x={0} y={-200} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#fff" direction="ltr">
      {label}
    </text>
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(0 ${-80 + i * 110}) rotate(-20)`}>
        <rect x={-70} y={-30} width={140} height={60} rx={30} fill={C.capsule} {...sk} strokeWidth={5} />
        <path d="M0 -30 H40 A30 30 0 0 1 40 30 H0 Z" fill={color} {...sk} strokeWidth={5} />
      </g>
    ))}
    <text x={0} y={235} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.ink}>
      {ar}
    </text>
  </g>
);

/** "last card" (playing card, Reserve red); burn 0..1 eats it from the bottom with a flame */
export const LastCard: React.FC<{ burn?: number; f?: number }> = ({ burn = 0, f = 0 }) => {
  const top = 200 - 400 * burn;
  return (
    <g>
      <clipPath id="cardClip">
        <rect x={-150} y={-200} width={300} height={Math.max(0, top + 200)} />
      </clipPath>
      <g clipPath="url(#cardClip)">
        <rect x={-150} y={-200} width={300} height={400} rx={30} fill={C.paper} {...sk} />
        <rect x={-120} y={-170} width={240} height={340} rx={22} fill={AWARE.reserve} {...sk} />
        <text x={0} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={150} fill="#fff" direction="ltr">
          R
        </text>
      </g>
      {burn > 0 && burn < 1 && (
        <g transform={`translate(0 ${top})`}>
          {[-100, -30, 40, 110].map((x, i) => {
            const h = 70 + 30 * Math.sin(f / 3 + i * 1.7);
            return (
              <path key={i} d={`M${x - 34} 0 C${x - 30} ${-h * 0.6} ${x - 6} ${-h * 0.7} ${x} ${-h} C${x + 8} ${-h * 0.6} ${x + 32} ${-h * 0.5} ${x + 34} 0 Z`}
                fill={i % 2 ? "#F7B538" : "#EF7A2B"} {...sk} strokeWidth={5} />
            );
          })}
        </g>
      )}
    </g>
  );
};

/** culture plate (Kirby-Bauer style): bacterial lawn + antibiotic discs; kill 0..1 = clear zone per disc */
export const CulturePlate: React.FC<{ discs: number; kill?: number[]; lawn?: number; fails?: number }> = ({ discs, kill = [], lawn = 1, fails = 0 }) => {
  const pos: [number, number][] = [];
  if (discs <= 8) for (let i = 0; i < discs; i++) pos.push([Math.cos((i / discs) * Math.PI * 2) * 160, Math.sin((i / discs) * Math.PI * 2) * 160]);
  else {
    const rings = [[0, 1], [95, 8], [180, 17]] as const; let n = 0;
    for (const [r, k] of rings) for (let i = 0; i < k && n < discs; i++, n++) pos.push([Math.cos((i / k) * Math.PI * 2 + r) * r, Math.sin((i / k) * Math.PI * 2 + r) * r]);
  }
  return (
    <g>
      <circle r={290} fill={C.glass} {...sk} />
      <circle r={255} fill="#EFE0B0" {...sk} strokeWidth={5} />
      <circle r={250} fill="#CFE3A8" opacity={0.85 * lawn} />
      {pos.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {(kill[i] ?? 0) > 0 && <circle r={18 + 52 * kill[i]} fill="#EFE0B0" />}
          <circle r={discs > 8 ? 17 : 26} fill="#fff" {...sk} strokeWidth={4} />
          {fails > 0 && (
            <path d="M-12 -12 L12 12 M12 -12 L-12 12" {...sk} stroke={C.warn} strokeWidth={5} opacity={Math.min(1, Math.max(0, fails * pos.length - i))} />
          )}
        </g>
      ))}
    </g>
  );
};

export const Swab: React.FC = () => (
  <g transform="rotate(-35)">
    <rect x={-8} y={-240} width={16} height={240} rx={8} fill={C.paper} {...sk} strokeWidth={5} />
    <ellipse cx={0} cy={0} rx={22} ry={34} fill="#F4EBD7" {...sk} strokeWidth={5} />
  </g>
);

export const Dumbbell: React.FC = () => (
  <g>
    <rect x={-70} y={-8} width={140} height={16} rx={8} fill={C.shield} {...sk} strokeWidth={5} />
    <rect x={-92} y={-30} width={26} height={60} rx={8} fill={C.ink} />
    <rect x={66} y={-30} width={26} height={60} rx={8} fill={C.ink} />
  </g>
);

export const Globe: React.FC = () => (
  <g>
    <circle r={110} fill={C.iconBg} {...sk} />
    <ellipse rx={50} ry={110} fill="none" {...sk} strokeWidth={5} />
    <path d="M-110 0 H110 M-95 -55 H95 M-95 55 H95" fill="none" {...sk} strokeWidth={5} />
  </g>
);

export const Journal: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <rect x={-120} y={-160} width={240} height={320} rx={18} fill={C.paper} {...sk} />
    <rect x={-120} y={-160} width={240} height={80} rx={18} fill="#B94A3E" {...sk} />
    <text x={0} y={-105} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={40} fill="#fff" direction="ltr">
      {label}
    </text>
    {[-30, 10, 50, 90].map((y) => <path key={y} d={`M-80 ${y} H80`} {...sk} strokeWidth={5} stroke="#BDB3A3" />)}
  </g>
);

/** horizontal bars, right-to-left: Arabic label on the right, bar grows to the left; value in millions */
export const Bars: React.FC<{ items: { label: string; value: number; color: string; p: number }[]; max: number }> = ({ items, max }) => (
  <g>
    {items.map((it, i) => {
      const w = (520 * it.value * it.p) / max;
      return (
        <g key={i} transform={`translate(0 ${i * 120})`} opacity={it.p > 0 ? 1 : 0}>
          <text x={400} y={14} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.ink}>
            {it.label}
          </text>
          <rect x={170 - w} y={-30} width={Math.max(1, w)} height={60} rx={14} fill={it.color} {...sk} strokeWidth={5} />
          <text x={150 - w} y={14} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.ink} direction="ltr" unicodeBidi="bidi-override" opacity={it.p > 0.9 ? 1 : 0}>
            {it.value.toFixed(2)}M
          </text>
        </g>
      );
    })}
  </g>
);

export const Baby: React.FC = () => (
  <g>
    <circle r={110} fill={C.iconBg} {...sk} />
    <path d="M-60 30 C-60 -10 60 -10 60 30 C60 70 -60 70 -60 30 Z" fill="#F7E1A8" {...sk} />
    <circle cx={0} cy={-38} r={36} fill={C.skin} {...sk} />
    <Face x={0} y={-36} size={0.45} mood={0.8} />
  </g>
);
export const Scalpel: React.FC = () => (
  <g>
    <circle r={110} fill={C.iconBg} {...sk} />
    <g transform="rotate(-40)">
      <rect x={-70} y={-12} width={90} height={24} rx={8} fill={C.shield} {...sk} />
      <path d="M20 -12 C70 -14 80 4 76 12 L20 12 Z" fill="#E6EEF2" {...sk} />
    </g>
  </g>
);
export const IVBag: React.FC = () => (
  <g>
    <circle r={110} fill={C.iconBg} {...sk} />
    <rect x={-40} y={-70} width={80} height={100} rx={16} fill="#E6EEF2" {...sk} />
    <rect x={-40} y={-20} width={80} height={50} rx={10} fill="#F6C566" opacity={0.9} />
    <path d="M0 30 V80" {...sk} />
  </g>
);
export const Warn: React.FC = () => (
  <g>
    <path d="M0 -50 L48 36 H-48 Z" fill="#F7C548" {...sk} />
    <path d="M0 -18 V10" {...sk} strokeWidth={7} />
    <circle cy={24} r={5} fill={C.ink} />
  </g>
);
export const StopHand: React.FC = () => (
  <g>
    <circle r={110} fill="#F6D2CC" {...sk} />
    <path d="M-40 60 V-20 C-40 -36 -20 -36 -20 -20 V-50 C-20 -66 0 -66 0 -50 V-56 C0 -72 20 -72 20 -56 V-40 C20 -56 40 -56 40 -40 V30 C40 70 10 80 -10 80 C-30 80 -40 74 -40 60 Z" fill={C.skin} {...sk} />
  </g>
);
export const Bubble: React.FC<{ w?: number }> = ({ w = 260 }) => (
  <g>
    <rect x={-w / 2} y={-80} width={w} height={130} rx={50} fill={C.card} {...sk} />
    <path d={`M${-w / 4} 48 L${-w / 4 - 30} 100 L${-w / 4 + 30} 48`} fill={C.card} {...sk} />
    {[-50, 0, 50].map((x) => <circle key={x} cx={x} cy={-15} r={12} fill={C.key} />)}
  </g>
);
export const ThumbsUp: React.FC = () => (
  <g>
    <circle r={90} fill="#D7EBCF" {...sk} />
    <path d="M-40 60 V0 H-10 L10 -50 C20 -66 40 -60 34 -40 L26 -10 H50 C64 -10 70 4 64 16 L48 56 C44 64 38 66 30 66 H-10 Z" fill={C.skin} {...sk} />
  </g>
);
