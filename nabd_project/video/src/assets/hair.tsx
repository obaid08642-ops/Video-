// Ep06 (hair loss) drawings: flat 2D, same line style as the rest of the channel. No real people, no brands.
import React from "react";
import { C, FONT } from "../theme";
import { sk } from "../components/Frame";

const HAIR = "#5A4636", WHITE_HAIR = "#F6F3EC", SKIN = C.skin, SHIRT_A = "#9DC9E8", SHIRT_B = "#F2D79A", BLUSH = "#EFA58E";
const th = { ...sk, strokeWidth: 5 };

/** One guy, front view, bust. kind="bald": bald crown with hair only on both sides. kind="white": thick, full, WHITE hair.
 *  tilt 0..1: head bows forward and the crown (skin, with a couple of thin hairs) shows. */
export const HairGuy: React.FC<{ kind: "bald" | "white"; tilt?: number; mood?: number; shirt?: string }> = ({ kind, tilt = 0, mood = 1, shirt }) => {
  const sh = shirt ?? (kind === "bald" ? SHIRT_A : SHIRT_B);
  const hy = 18 * tilt;
  return (
    <g>
      <path d="M-150 330 C-150 150 -110 105 0 105 C110 105 150 150 150 330 Z" fill={sh} {...sk} />
      <rect x={-24} y={70} width={48} height={50} fill={SKIN} {...th} />
      <path d="M-34 105 Q0 150 34 105" fill="none" {...th} />
      <g transform={`translate(0 ${hy})`}>
        <circle cx={-97} cy={6} r={20} fill={SKIN} {...th} /><circle cx={97} cy={6} r={20} fill={SKIN} {...th} />
        <circle cx={0} cy={0} r={98} fill={SKIN} {...sk} />
        {kind === "bald" && (
          <g>
            <path d="M-70 -62 C-30 -96 30 -96 70 -62" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.65} />
            <path d="M-98 6 C-112 -34 -104 -66 -88 -76 C-92 -50 -92 -26 -90 -4 Z" fill={HAIR} {...th} />
            <path d="M98 6 C112 -34 104 -66 88 -76 C92 -50 92 -26 90 -4 Z" fill={HAIR} {...th} />
            {tilt > 0.05 && (<g opacity={tilt}><ellipse cx={0} cy={-80} rx={72} ry={22} fill="#F0C6AC" stroke={C.ink} strokeWidth={4} /><path d="M-6 -90 q-2 -16 4 -22 M10 -86 q2 -14 8 -18" fill="none" {...th} strokeWidth={3} /></g>)}
          </g>
        )}
        {kind === "white" && (
          <path d="M-106 -6 C-130 -70 -108 -118 -64 -122 C-56 -150 -6 -150 6 -126 C40 -150 96 -132 84 -108 C122 -100 124 -46 104 -6 C100 -48 62 -86 0 -84 C-62 -86 -98 -48 -106 -6 Z" fill={WHITE_HAIR} {...sk} />
        )}
        <circle cx={-58} cy={26} r={15} fill={BLUSH} opacity={0.6} /><circle cx={58} cy={26} r={15} fill={BLUSH} opacity={0.6} />
        <circle cx={-34} cy={-6} r={8} fill={C.ink} /><circle cx={34} cy={-6} r={8} fill={C.ink} />
        <circle cx={-31} cy={-9} r={2.6} fill="#fff" /><circle cx={37} cy={-9} r={2.6} fill="#fff" />
        <path d="M-52 -30 Q-34 -38 -18 -30 M52 -30 Q34 -38 18 -30" fill="none" {...th} />
        <path d="M-5 8 Q8 22 -6 28" fill="none" {...th} strokeWidth={4.5} />
        <path d={`M-22 48 Q0 ${48 + 22 * mood} 22 48`} fill="none" {...th} />
      </g>
    </g>
  );
};

/** Head from above (front of the head = top of the picture). hairs: how many hairs remain on the crown (0..14). */
export const ScalpTop: React.FC<{ hairs?: number; recede?: number; part?: boolean }> = ({ hairs = 3, recede = 1, part = false }) => {
  const pts = Array.from({ length: 14 }).map((_, i) => ({ x: -60 + ((i * 53) % 120), y: -40 + ((i * 37) % 110) }));
  return (
    <g>
      <ellipse cx={-168} cy={10} rx={22} ry={40} fill={SKIN} {...th} /><ellipse cx={168} cy={10} rx={22} ry={40} fill={SKIN} {...th} />
      <path d="M-26 -170 Q0 -214 26 -170" fill={SKIN} {...sk} />
      <ellipse cx={0} cy={0} rx={160} ry={176} fill={SKIN} {...sk} />
      <path d="M-160 20 C-176 -120 -90 -170 0 -166 C90 -170 176 -120 160 20 C150 -60 100 -104 0 -100 C-100 -104 -150 -60 -160 20 Z" fill={HAIR} {...sk} opacity={recede > 0.5 ? 0 : 1} />
      <path d="M-160 20 C-170 90 -120 140 -60 160 C-130 130 -156 80 -160 20 Z M160 20 C170 90 120 140 60 160 C130 130 156 80 160 20 Z" fill={HAIR} {...th} />
      <ellipse cx={-40} cy={-30} rx={46} ry={20} fill="#fff" opacity={0.4} transform="rotate(-20)" />
      {part && <path d="M0 -130 L0 130" fill="none" stroke={C.ink} strokeWidth={4} strokeDasharray="2 12" />}
      {pts.slice(0, Math.round(hairs)).map((p, i) => (<path key={i} d={`M${p.x} ${p.y} q6 -14 14 -18`} fill="none" {...th} strokeWidth={3.5} />))}
    </g>
  );
};

/** Skin cross-section with ONE follicle. size 0..1 = how big the follicle is and how thick the hair is. */
export const Follicle: React.FC<{ size?: number; hair?: boolean; len?: number; sweat?: boolean }> = ({ size = 1, hair = true, len = 1, sweat = false }) => {
  const w = 22 + 30 * size, bulb = 26 + 44 * size, top = -60 - 130 * len;
  return (
    <g>
      <rect x={-250} y={-60} width={500} height={50} fill="#F1D3BF" {...sk} />
      <rect x={-250} y={-10} width={500} height={270} fill={SKIN} {...sk} />
      <path d={`M${-w} -10 L${-w - 6} ${150 - 20 * size} Q${-bulb - 12} ${190} 0 ${200 + 20 * size} Q${bulb + 12} ${190} ${w + 6} ${150 - 20 * size} L${w} -10 Z`} fill="#F6E4D6" {...sk} />
      <ellipse cx={0} cy={180 + 20 * size} rx={bulb * 0.72} ry={bulb * 0.55} fill="#E9A07C" {...th} />
      {hair && <path d={`M${-w * 0.46} 170 L${-w * 0.46} ${top} L${w * 0.46} ${top} L${w * 0.46} 170 Z`} fill={HAIR} {...th} />}
      <ellipse cx={-130} cy={90} rx={36} ry={24} fill="#F6E4D6" {...th} /><ellipse cx={140} cy={120} rx={30} ry={20} fill="#F6E4D6" {...th} />
      {sweat && <path d="M200 -90 q-14 24 0 34 q14 -10 0 -34" fill="#BFE3F7" {...th} />}
    </g>
  );
};

/** hair strand life states: grow / rest / fall. */
export const Strand: React.FC<{ len?: number; thick?: number; color?: string; tip?: boolean }> = ({ len = 1, thick = 1, color = HAIR, tip = true }) => (
  <g>
    <path d={`M0 0 C-18 ${-90 * len} 18 ${-170 * len} 0 ${-260 * len}`} fill="none" stroke={C.ink} strokeWidth={10 * thick + 6} strokeLinecap="round" />
    <path d={`M0 0 C-18 ${-90 * len} 18 ${-170 * len} 0 ${-260 * len}`} fill="none" stroke={color} strokeWidth={10 * thick} strokeLinecap="round" />
    {tip && <circle cx={0} cy={0} r={14 * Math.max(0.6, thick)} fill="#F7F1E8" {...th} />}
  </g>
);

/** DHT molecule: two rings + label (label is drawn by the scene). */
export const Hexa: React.FC<{ s?: number; fill?: string }> = ({ s = 1, fill = "#F7C548" }) => (
  <g transform={`scale(${s})`}>
    {[[-38, 0], [38, 0]].map(([x, y], i) => (<polygon key={i} points="0,-46 40,-23 40,23 0,46 -40,23 -40,-23" transform={`translate(${x} ${y})`} fill={fill} {...th} />))}
    <circle cx={76} cy={-34} r={14} fill={C.warn} {...th} />
  </g>
);

export const DropperBottle: React.FC<{ color?: string; label?: boolean }> = ({ color = "#F2D79A", label = true }) => (
  <g>
    <rect x={-52} y={-30} width={104} height={150} rx={22} fill={color} {...sk} />
    <rect x={-34} y={-62} width={68} height={34} rx={8} fill="#8A8F98" {...th} />
    <path d="M-16 -62 V-120 Q0 -140 16 -120 V-62 Z" fill="#C9B59D" {...th} />
    {label && <rect x={-38} y={20} width={76} height={56} rx={6} fill="#fff" {...th} strokeWidth={4} />}
  </g>
);
export const Rosemary: React.FC = () => (
  <g>
    <path d="M0 140 C-6 40 6 -60 0 -150" fill="none" {...sk} stroke="#6E8F5A" strokeWidth={9} />
    {Array.from({ length: 9 }).map((_, i) => (<g key={i}><path d={`M${i % 2 ? 4 : -4} ${110 - i * 30} l${i % 2 ? 44 : -44} -20`} fill="none" stroke="#6E8F5A" strokeWidth={9} strokeLinecap="round" /></g>))}
  </g>
);
export const Seeds: React.FC = () => (
  <g>{[[-50, 10], [0, -20], [52, 14], [-14, 40], [30, 54]].map(([x, y], i) => (<ellipse key={i} cx={x} cy={y} rx={22} ry={12} fill="#2B2A28" transform={`rotate(${i * 40} ${x} ${y})`} />))}</g>
);
export const OliveDrop: React.FC<{ color?: string }> = ({ color = "#C9B04A" }) => (
  <path d="M0 -70 C40 -10 50 20 0 60 C-50 20 -40 -10 0 -70 Z" fill={color} {...sk} />
);
/** microneedling roller: handle + drum with short needles (drawn calm, not a how-to) */
export const Roller: React.FC<{ warn?: boolean }> = ({ warn }) => (
  <g>
    <rect x={-14} y={-10} width={28} height={190} rx={10} fill="#C9B59D" {...sk} />
    <rect x={-80} y={-60} width={160} height={56} rx={14} fill="#E4EEF3" {...sk} />
    {Array.from({ length: 12 }).map((_, i) => (<path key={i} d={`M${-70 + i * 13} -60 v-18`} {...th} strokeWidth={4} />))}
    {warn && <g transform="translate(110 -90)"><path d="M0 -34 L34 26 H-34 Z" fill="#F7C548" {...sk} /><path d="M0 -12 V8 M0 16 v2" {...sk} strokeWidth={6} /></g>}
  </g>
);
export const Magnifier: React.FC = () => (
  <g>
    <circle r={90} fill="#E4EEF3" fillOpacity={0.55} {...sk} />
    <path d="M64 64 L140 140" {...sk} strokeWidth={22} />
    <path d="M-50 -30 a60 60 0 0 1 70 -34" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.8} />
  </g>
);
export const TestTube: React.FC<{ fill?: number }> = ({ fill = 0.7 }) => (
  <g>
    <rect x={-26} y={-100} width={52} height={200} rx={26} fill="#E4EEF3" {...sk} />
    <path d={`M-26 ${100 - 190 * fill} H26 V74 a26 26 0 0 1 -52 0 Z`} fill="#D9524B" opacity={0.85} />
    <rect x={-32} y={-110} width={64} height={18} rx={6} fill="#8A8F98" {...th} />
  </g>
);
export const Thyroid: React.FC = () => (
  <g>
    <path d="M0 -10 C-30 -80 -110 -70 -120 -10 C-124 50 -60 70 -20 40 C-6 30 -2 10 0 -10 Z M0 -10 C30 -80 110 -70 120 -10 C124 50 60 70 20 40 C6 30 2 10 0 -10 Z" fill="#E9A07C" {...sk} />
    <rect x={-12} y={-20} width={24} height={110} rx={10} fill="#E4EEF3" {...th} />
  </g>
);
export const IronDrop: React.FC = () => (
  <g>
    <path d="M0 -80 C60 -10 70 40 0 80 C-70 40 -60 -10 0 -80 Z" fill="#D9524B" {...sk} />
    <text y={22} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill="#fff" direction="ltr">Fe</text>
  </g>
);
export const Patch: React.FC = () => (
  <g>
    <ellipse rx={150} ry={100} fill={SKIN} {...sk} />
    <circle cx={-30} cy={0} r={46} fill="#F0C6AC" stroke={C.ink} strokeWidth={5} strokeDasharray="2 12" />
    <circle cx={60} cy={-20} r={26} fill="#F0C6AC" stroke={C.ink} strokeWidth={5} strokeDasharray="2 12" />
  </g>
);
export const Ponytail: React.FC = () => (
  <g>
    <ellipse rx={90} ry={100} fill={SKIN} {...sk} />
    <path d="M-86 -20 C-70 -100 70 -100 86 -20 C60 -62 -60 -62 -86 -20 Z" fill={HAIR} {...th} />
    <path d="M70 -50 C150 -70 170 20 140 90 C120 20 110 -10 70 -50 Z" fill={HAIR} {...th} />
    <rect x={64} y={-52} width={26} height={22} rx={8} fill={C.warn} {...th} />
    <path d="M-30 -20 C-34 -4 -34 -2 -30 8 M30 -20 C34 -4 34 -2 30 8" fill="none" {...th} strokeWidth={3} />
  </g>
);
export const Mirror: React.FC = () => (
  <g>
    <ellipse rx={100} ry={120} fill="#E4EEF3" {...sk} />
    <rect x={-12} y={118} width={24} height={90} rx={10} fill="#C9B59D" {...sk} />
    <path d="M-50 -50 a70 80 0 0 1 40 -40" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={0.8} />
  </g>
);
export const Arrow: React.FC<{ len?: number; dashed?: boolean; color?: string }> = ({ len = 160, dashed = false, color = C.ink }) => (
  <g>
    <path d={`M0 0 H${len}`} stroke={color} strokeWidth={9} strokeLinecap="round" strokeDasharray={dashed ? "3 20" : undefined} fill="none" />
    <path d={`M${len - 26} -22 L${len} 0 L${len - 26} 22`} stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </g>
);
/** speech bubble with Arabic text (used for the hair that "puts its hand up") */
export const Bubble: React.FC<{ text: string; w?: number; size?: number }> = ({ text, w = 420, size = 46 }) => (
  <g>
    <rect x={-w / 2} y={-46} width={w} height={92} rx={34} fill="#FFF3CF" {...sk} />
    <path d="M-24 46 l-14 32 l44 -32" fill="#FFF3CF" {...sk} />
    <path d="M-30 44 H12" stroke="#FFF3CF" strokeWidth={8} />
    <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill={C.ink} direction="rtl">{text}</text>
  </g>
);
/** a thin hair with a little arm raised (the acting hair): body = Strand; the arm is drawn separately */
export const HairHero: React.FC<{ wave?: number; len?: number }> = ({ wave = 0, len = 0.6 }) => (
  <g>
    <Strand len={len} thick={0.5} />
    <g transform={`translate(0 ${-110 * len}) rotate(${-30 + 12 * Math.sin(wave)})`}>
      <path d="M0 0 C-30 -10 -50 -40 -52 -80" fill="none" stroke={C.ink} strokeWidth={9} strokeLinecap="round" />
      <circle cx={-52} cy={-86} r={12} fill={SKIN} {...th} strokeWidth={4} />
    </g>
    <circle cx={-6} cy={-250 * len} r={3} fill="none" />
    <circle cx={-10} cy={-232 * len} r={3.5} fill={C.ink} /><circle cx={10} cy={-232 * len} r={3.5} fill={C.ink} />
    <path d={`M-8 ${-218 * len} q8 -8 16 0`} fill="none" {...th} strokeWidth={3} />
  </g>
);
export const Grafts: React.FC<{ n?: number }> = ({ n = 6 }) => (
  <g>{Array.from({ length: n }).map((_, i) => (<g key={i} transform={`translate(${-40 + (i % 3) * 40} ${-18 + Math.floor(i / 3) * 36})`}><circle r={11} fill={HAIR} {...th} strokeWidth={4} /></g>))}</g>
);
export const Needle: React.FC = () => (
  <g><path d="M0 -80 V70" stroke={C.ink} strokeWidth={8} strokeLinecap="round" /><path d="M-10 70 L0 100 L10 70 Z" fill="#E4EEF3" {...th} strokeWidth={4} /></g>
);
export const Gene: React.FC = () => (
  <g>{Array.from({ length: 9 }).map((_, i) => { const y = -110 + i * 28, x = 44 * Math.sin(i * 0.9); return (<g key={i}><path d={`M${-x} ${y} L${x} ${y}`} stroke={C.ink} strokeWidth={5} /><circle cx={-x} cy={y} r={9} fill="#9DC9E8" {...th} strokeWidth={4} /><circle cx={x} cy={y} r={9} fill="#F2D79A" {...th} strokeWidth={4} /></g>); })}</g>
);
export const Gift: React.FC = () => (
  <g>
    <rect x={-70} y={-30} width={140} height={100} rx={10} fill="#F2D79A" {...sk} />
    <rect x={-78} y={-60} width={156} height={34} rx={8} fill="#F7C548" {...sk} />
    <path d="M0 -60 V70" {...sk} stroke={C.brand} strokeWidth={14} />
    <path d="M0 -62 C-40 -110 -70 -70 -30 -62 M0 -62 C40 -110 70 -70 30 -62" fill="none" {...sk} />
  </g>
);
