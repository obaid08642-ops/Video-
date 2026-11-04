// Reusable flat drawings (thick even ink lines, round caps, no gradients).
// Every component is drawn around (0,0); place it with <Place x y s r>.
import React from "react";
import { C } from "../theme";
import { sk } from "../components/Frame";

export const Place: React.FC<{ x: number; y: number; s?: number; r?: number; o?: number; children: React.ReactNode }> = ({
  x,
  y,
  s = 1,
  r = 0,
  o = 1,
  children,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
    {children}
  </g>
);

/** simple friendly face: two dots + a curve. mood: 1 smile, 0 flat, -1 sad */
export const Face: React.FC<{ x?: number; y?: number; size?: number; mood?: number; brows?: number; blink?: boolean }> = ({
  x = 0,
  y = 0,
  size = 1,
  mood = 1,
  brows = 0,
  blink = false,
}) => (
  <g transform={`translate(${x} ${y}) scale(${size})`}>
    {blink ? (
      <>
        <path d="M-24 -6 h12" {...sk} strokeWidth={5} />
        <path d="M12 -6 h12" {...sk} strokeWidth={5} />
      </>
    ) : (
      <>
        <circle cx={-18} cy={-6} r={6} fill={C.ink} />
        <circle cx={18} cy={-6} r={6} fill={C.ink} />
      </>
    )}
    <path d={`M-14 14 Q0 ${14 + 12 * mood} 14 14`} fill="none" {...sk} strokeWidth={5} />
    {brows !== 0 && (
      <>
        <path d={`M-30 ${-24 - 6 * brows} L-8 ${-20 + 4 * brows}`} {...sk} strokeWidth={5} />
        <path d={`M30 ${-24 - 6 * brows} L8 ${-20 + 4 * brows}`} {...sk} strokeWidth={5} />
      </>
    )}
  </g>
);

/** antibiotic capsule (white + coral). crack: 0..1 draws the hairline crack */
export const Capsule: React.FC<{ crack?: number; glow?: number; band?: string }> = ({ crack = 0, glow = 0, band = C.brand }) => (
  <g>
    {glow > 0 && (
      <g opacity={glow}>
        <circle r={260} fill="#FFF3CF" opacity={0.45} />
        <circle r={200} fill="#FFF3CF" opacity={0.55} />
        <circle r={150} fill="#FFF7E2" opacity={0.8} />
      </g>
    )}
    <rect x={-150} y={-62} width={300} height={124} rx={62} fill={C.capsule} {...sk} />
    <path d="M0 -62 H88 A62 62 0 0 1 88 62 H0 Z" fill={band} {...sk} />
    <rect x={-112} y={-38} width={56} height={18} rx={9} fill="#fff" />
    {crack > 0 && (
      <path
        d="M-40 -62 L-26 -30 L-46 -6 L-24 22 L-36 62"
        fill="none"
        {...sk}
        strokeWidth={5}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - crack}
      />
    )}
  </g>
);

/** 4-point sparkle */
export const Sparkle: React.FC<{ size?: number; fill?: string }> = ({ size = 1, fill = "#fff" }) => (
  <path
    transform={`scale(${size})`}
    d="M0 -40 C6 -10 10 -6 40 0 C10 6 6 10 0 40 C-6 10 -10 6 -40 0 C-10 -6 -6 -10 0 -40 Z"
    fill={fill}
    {...sk}
    strokeWidth={5}
  />
);

/** person wrapped in a blanket, red nose */
export const SickPerson: React.FC<{ shiver?: number; blink?: boolean }> = ({ shiver = 0, blink }) => (
  <g transform={`translate(${shiver} 0)`}>
    <path d="M-190 260 C-200 60 -150 -10 0 -10 C150 -10 200 60 190 260 Z" fill={C.iconBg} {...sk} />
    <path d="M-150 120 C-60 150 60 150 150 120" fill="none" {...sk} strokeWidth={5} stroke="#7FA6C4" />
    <path d="M-170 200 C-60 232 60 232 170 200" fill="none" {...sk} strokeWidth={5} stroke="#7FA6C4" />
    <circle cx={0} cy={-90} r={108} fill={C.skin} {...sk} />
    <path d="M-112 -96 C-100 -230 100 -230 112 -96 C60 -150 -60 -150 -112 -96 Z" fill={C.iconBg} {...sk} />
    <Face x={0} y={-82} size={1.25} mood={-0.6} blink={blink} />
    <ellipse cx={0} cy={-70} rx={20} ry={16} fill={C.brand} {...sk} strokeWidth={5} />
    <path d="M-150 30 C-90 60 90 60 150 30" fill="none" {...sk} />
  </g>
);

/** "؟" memory icon */
export const QuestionIcon: React.FC = () => (
  <g>
    <circle r={44} fill={C.iconBg} {...sk} strokeWidth={5} />
    <text x={0} y={22} textAnchor="middle" fontFamily="IBM Plex Sans Arabic" fontWeight={700} fontSize={64} fill={C.key}>
      ؟
    </text>
  </g>
);

export const CheckIcon: React.FC = () => (
  <g>
    <circle r={44} fill={C.iconBg} {...sk} strokeWidth={5} />
    <path d="M-20 2 L-4 18 L22 -16" fill="none" {...sk} stroke={C.key} strokeWidth={8} />
  </g>
);

/** lock (style frame); open 0..1 lifts the shackle */
export const Lock: React.FC<{ open?: number; bg?: boolean }> = ({ open = 0, bg = true }) => (
  <g>
    {bg && <circle r={44} fill={C.iconBg} {...sk} strokeWidth={5} />}
    <g transform="translate(-15 -19)">
      <rect x={2} y={14} width={26} height={18} rx={3} fill={C.key} stroke={C.ink} strokeWidth={2.6} />
      <path d={`M8 14 V${9 - open * 6} a7 7 0 0 1 14 0 V${14 - open * 14}`} fill="none" stroke={C.ink} strokeWidth={2.6} strokeLinecap="round" />
      <circle cx={15} cy={23} r={3} fill={C.ink} />
    </g>
  </g>
);

/** prescription sheet; write: 0..1 draws the handwriting lines */
export const Prescription: React.FC<{ write?: number }> = ({ write = 0 }) => {
  const lines = ["M-120 -40 C-90 -60 -60 -20 -30 -40 S30 -60 60 -40 S110 -30 130 -44", "M-120 30 C-80 10 -50 50 -10 30 S50 10 90 34", "M-120 100 C-90 80 -60 120 -20 98"];
  return (
    <g>
      <rect x={-200} y={-260} width={400} height={500} rx={26} fill={C.paper} {...sk} />
      <text x={-150} y={-150} fontFamily="IBM Plex Sans Arabic" fontWeight={700} fontSize={84} fill={C.ink} direction="ltr">
        Rx
      </text>
      <path d="M40 -190 H150 M40 -150 H120" {...sk} strokeWidth={5} stroke="#BDB3A3" />
      {lines.map((d, i) => {
        const p = Math.max(0, Math.min(1, write * lines.length - i));
        return <path key={i} d={d} fill="none" {...sk} strokeWidth={5} stroke="#3C5E9C" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
      })}
    </g>
  );
};

export const Pen: React.FC = () => (
  <g transform="rotate(-35)">
    <rect x={-22} y={-230} width={44} height={230} rx={20} fill={C.ink} {...sk} />
    <rect x={-22} y={-230} width={44} height={70} rx={20} fill={C.brand} {...sk} />
    <path d="M-16 -4 L0 40 L16 -4 Z" fill={C.paper} {...sk} strokeWidth={5} />
  </g>
);

/** petri dish seen from above; mold 0..1 grows the green mould; clear 0..1 shows the bacteria-free ring */
export const PetriDish: React.FC<{ mold?: number; clear?: number; dots?: number; f?: number }> = ({ mold = 0, clear = 0, dots = 1, f = 0 }) => {
  const pts: [number, number][] = [];
  for (let i = 0; i < 26; i++) {
    const a = i * 2.39996;
    const r = 70 + ((i * 53) % 150);
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return (
    <g>
      <circle r={300} fill={C.glass} {...sk} />
      <circle r={262} fill={C.agar} {...sk} strokeWidth={5} />
      {pts.map(([x, y], i) => {
        const d = Math.hypot(x - 60, y + 30);
        const gone = d < 60 + 140 * clear ? 1 : 0;
        return <circle key={i} cx={x} cy={y} r={14} fill={C.bad} {...sk} strokeWidth={4} opacity={dots * (1 - gone)} />;
      })}
      {mold > 0 && (
        <g transform={`translate(60 -30) scale(${mold})`}>
          {clear > 0 && <circle r={60 + 140 * clear} fill="none" stroke={C.key} strokeWidth={5} strokeDasharray="14 16" vectorEffect="non-scaling-stroke" opacity={0.8} />}
          <path
            d={`M-70 0 C-80 -50 -30 -82 10 -70 C60 -80 92 -30 76 10 C86 56 30 86 -10 74 C-60 82 -86 40 -70 0 Z`}
            fill={C.badDark}
            {...sk}
            transform={`rotate(${f * 0.3})`}
          />
          <circle cx={-20} cy={-14} r={14} fill="#A9CF8F" />
          <circle cx={24} cy={18} r={10} fill="#A9CF8F" />
        </g>
      )}
      <path d="M-200 -150 A250 250 0 0 1 -120 -220" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.9} />
    </g>
  );
};

/** harmful bacterium (green bean). shield + frowning brows = resistant */
export const Bacterium: React.FC<{ color?: string; shield?: boolean; mood?: number; wobble?: number }> = ({
  color = C.bad,
  shield = false,
  mood = 1,
  wobble = 0,
}) => (
  <g transform={`rotate(${wobble})`}>
    <rect x={-90} y={-58} width={180} height={116} rx={58} fill={color} {...sk} />
    <path d="M-90 -10 C-120 -20 -126 10 -150 0" fill="none" {...sk} strokeWidth={5} />
    <path d="M90 14 C120 24 126 -6 150 4" fill="none" {...sk} strokeWidth={5} />
    <Face x={0} y={2} size={0.9} mood={shield ? -0.3 : mood} brows={shield ? 1 : 0} />
    {shield && (
      <path d="M60 -70 L130 -46 C130 20 110 56 60 80 C10 56 -10 20 -10 -46 Z" transform="translate(40 10) scale(0.7)" fill={C.shield} {...sk} />
    )}
  </g>
);

/** virus: purple, spiky */
export const Virus: React.FC<{ spin?: number; empty?: boolean }> = ({ spin = 0, empty = false }) => (
  <g transform={`rotate(${spin})`}>
    {Array.from({ length: 10 }).map((_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return (
        <g key={i}>
          <line x1={Math.cos(a) * 92} y1={Math.sin(a) * 92} x2={Math.cos(a) * 128} y2={Math.sin(a) * 128} {...sk} />
          <circle cx={Math.cos(a) * 134} cy={Math.sin(a) * 134} r={11} fill={C.virus} {...sk} strokeWidth={5} />
        </g>
      );
    })}
    <circle r={96} fill={C.virus} {...sk} />
    {!empty && (
      <>
        <circle cx={-34} cy={-30} r={13} fill={C.virusDark} />
        <circle cx={38} cy={36} r={16} fill={C.virusDark} />
      </>
    )}
    <g transform={`rotate(${-spin})`}>
      <Face x={0} y={6} size={0.9} mood={0.6} />
    </g>
  </g>
);

export const Gear: React.FC<{ r?: number; spin?: number; fill?: string }> = ({ r = 60, spin = 0, fill = "#F3C9A6" }) => {
  const teeth = 8;
  let d = "";
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i / (teeth * 2)) * Math.PI * 2;
    const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
    const R = i % 2 === 0 ? r : r * 0.8;
    d += `${i === 0 ? "M" : "L"}${Math.cos(a0) * R} ${Math.sin(a0) * R} L${Math.cos(a1) * R} ${Math.sin(a1) * R} `;
  }
  return (
    <g transform={`rotate(${spin})`}>
      <path d={d + "Z"} fill={fill} {...sk} />
      <circle r={r * 0.28} fill={C.bg} {...sk} strokeWidth={5} />
    </g>
  );
};

/** simple person pictogram for stat grids */
export const PersonIcon: React.FC<{ fill?: string }> = ({ fill = C.iconBg }) => (
  <g>
    <circle cy={-58} r={30} fill={fill} {...sk} />
    <path d="M-50 60 C-50 -6 50 -6 50 60 Z" fill={fill} {...sk} />
  </g>
);

export const Clock: React.FC<{ a?: number }> = ({ a = 0 }) => (
  <g>
    <circle r={110} fill={C.paper} {...sk} />
    {Array.from({ length: 12 }).map((_, i) => {
      const t = (i / 12) * Math.PI * 2;
      return <line key={i} x1={Math.cos(t) * 86} y1={Math.sin(t) * 86} x2={Math.cos(t) * 96} y2={Math.sin(t) * 96} {...sk} strokeWidth={5} />;
    })}
    <line x1={0} y1={0} x2={Math.sin(a) * 74} y2={-Math.cos(a) * 74} {...sk} stroke={C.warn} />
    <line x1={0} y1={0} x2={0} y2={-50} {...sk} />
    <circle r={9} fill={C.ink} />
  </g>
);
