// Cute characters (prototype v4): big round head, big sparkly eyes, tiny nose, rosy cheeks, mitten hands. Flat colours, 6px ink line, no beard, no likeness.
import React from "react";
import { C, FONT } from "../theme";
import { sk } from "../components/Frame";

const SKIN = "#F6D0AE", CHEEK = "#F5A99A", HAIR = "#4B3A30", HAIR_L = "#6A5446", COAT = "#FFFDF8", COAT_D = "#EDE6D8", BLUE = "#9DC9E8", HOOD = "#8FC2E6";
export type CMood = "happy" | "surprised" | "worried" | "explain" | "tired";
const MOOD: Record<CMood, { eh: number; brow: number; lift: number; mouth: string; open?: boolean; sweat?: boolean; half?: boolean }> = {
  happy: { eh: 1, brow: -4, lift: 0, mouth: "M-22 54 Q0 82 22 54 Q0 62 -22 54 Z", open: true },
  surprised: { eh: 1.25, brow: -6, lift: 12, mouth: "M-12 56 Q0 84 12 56 Q0 46 -12 56 Z", open: true },
  worried: { eh: 0.95, brow: 14, lift: 4, mouth: "M-20 66 Q-10 54 0 62 Q10 54 20 66", sweat: true },
  explain: { eh: 1, brow: -3, lift: 2, mouth: "M-18 56 Q0 70 18 56" },
  tired: { eh: 0.55, brow: 10, lift: 0, mouth: "M-16 64 Q0 56 16 64", half: true },
};
const Eye: React.FC<{ x: number; m: (typeof MOOD)[CMood] }> = ({ x, m }) => (
  <g transform={`translate(${x} 4)`}>
    {m.half ? (
      <><path d="M-18 4 Q0 -10 18 4" fill="none" {...sk} strokeWidth={6} /><path d="M-18 4 Q0 16 18 4 Q0 0 -18 4 Z" fill={C.ink} opacity={0.15} /></>
    ) : (
      <><ellipse rx={14} ry={19 * m.eh} fill={C.ink} /><circle cx={4} cy={-7 * m.eh} r={6} fill="#fff" /><circle cx={-4} cy={7 * m.eh} r={2.8} fill="#fff" /></>
    )}
  </g>
);
const Brow: React.FC<{ x: number; m: (typeof MOOD)[CMood]; flip?: boolean }> = ({ x, m, flip }) => (
  <path d={`M${x - 18} ${-30 - m.lift + (flip ? -m.brow : m.brow) * 0.5} Q${x} ${-40 - m.lift} ${x + 18} ${-30 - m.lift + (flip ? m.brow : -m.brow) * 0.5}`} fill="none" stroke={HAIR} strokeWidth={10} strokeLinecap="round" />
);
const Head: React.FC<{ mood: CMood }> = ({ mood }) => {
  const m = MOOD[mood];
  return (
    <g>
      <ellipse cx={-104} cy={14} rx={14} ry={20} fill={SKIN} {...sk} /><ellipse cx={104} cy={14} rx={14} ry={20} fill={SKIN} {...sk} />
      <path d="M-108 6 C-108 -70 -64 -104 0 -104 C64 -104 108 -70 108 6 C108 52 86 98 42 103 Q0 110 -42 103 C-86 98 -108 52 -108 6 Z" fill={SKIN} {...sk} />
      <path d="M-104 -6 C-114 -92 -58 -124 2 -122 C66 -124 116 -92 102 -6 C94 -44 70 -64 40 -68 C20 -50 -48 -56 -104 -6 Z" fill={HAIR} {...sk} />
      <path d="M-40 -112 L-30 -138 L-12 -116 M4 -118 L18 -146 L32 -118 M38 -114 L56 -136 L62 -108" fill={HAIR} {...sk} strokeWidth={5} />
      <path d="M-50 -96 C-20 -108 20 -108 52 -94" fill="none" stroke={HAIR_L} strokeWidth={7} strokeLinecap="round" />
      <circle cx={-68} cy={36} r={14} fill={CHEEK} opacity={0.5} /><circle cx={68} cy={36} r={14} fill={CHEEK} opacity={0.5} />
      <Brow x={-40} m={m} /><Brow x={40} m={m} flip />
      <Eye x={-40} m={m} /><Eye x={40} m={m} />
      <path d="M-4 30 Q0 36 5 30" fill="none" {...sk} strokeWidth={5} />
      <path d={m.mouth} fill={m.open ? "#C65A5A" : "none"} {...sk} strokeWidth={5.5} />
      {m.open && mood === "happy" && <path d="M-16 55 Q0 66 16 55 Q0 59 -16 55 Z" fill="#fff" />}
      {m.sweat && <path d="M92 -34 q-14 26 0 36 q14 -10 0 -36 Z" fill="#CFE6F5" {...sk} strokeWidth={4} />}
    </g>
  );
};
const Mitt: React.FC<{ x: number; y: number; up?: boolean }> = ({ x, y, up }) => (
  <g transform={`translate(${x} ${y})`}><circle r={22} fill={SKIN} {...sk} />{up && <path d="M-4 -18 V-56" stroke={C.ink} strokeWidth={24} strokeLinecap="round" />}{up && <path d="M-4 -18 V-56" stroke={SKIN} strokeWidth={14} strokeLinecap="round" />}</g>
);
const Arm: React.FC<{ d: string; fill: string }> = ({ d, fill }) => (<g><path d={d} fill="none" stroke={C.ink} strokeWidth={42} strokeLinecap="round" /><path d={d} fill="none" stroke={fill} strokeWidth={30} strokeLinecap="round" /></g>);
/** Cute doctor: round head, big eyes, white coat, coral Nabd badge, stethoscope. */
export const CuteDoc: React.FC<{ mood?: CMood; up?: boolean; wave?: number }> = ({ mood = "happy", up, wave = 0 }) => (
  <g>
    <path d="M-132 330 C-132 190 -96 140 0 138 C96 140 132 190 132 330 Z" fill={COAT} {...sk} />
    <path d="M-132 330 C-132 220 -124 176 -106 156 L-106 330 Z" fill={COAT_D} opacity={0.7} />
    <path d="M-26 134 L0 214 L26 134 Z" fill={BLUE} {...sk} strokeWidth={5} />
    <path d="M-48 150 L-24 130 L-12 170 Z M48 150 L24 130 L12 170 Z" fill={COAT} {...sk} strokeWidth={5} />
    <path d="M-40 150 C-60 260 -6 296 24 270" fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" /><circle cx={30} cy={268} r={16} fill="#B8BEC6" {...sk} strokeWidth={5} />
    <circle cx={-70} cy={236} r={20} fill={C.brand} {...sk} strokeWidth={5} /><circle cx={-70} cy={230} r={4} fill="#fff" /><path d="M-80 242 Q-70 252 -60 242" fill="none" stroke="#fff" strokeWidth={4.5} strokeLinecap="round" />
    <Arm d="M-118 176 C-160 226 -156 280 -132 312" fill={COAT} />
    <Arm d={up ? "M118 176 C160 150 170 110 160 70" : "M118 176 C160 226 156 280 132 312"} fill={COAT} />
    <Mitt x={-132} y={316} /><Mitt x={up ? 160 : 132} y={up ? 64 : 316} up={up} />
    <rect x={-24} y={84} width={48} height={64} fill={SKIN} {...sk} /><path d="M-24 128 Q0 144 24 128" fill="none" stroke={C.ink} strokeWidth={5} opacity={0.35} />
    <g transform={`translate(0 ${-4 + wave})`}><Head mood={mood} /></g>
  </g>
);
export const CutePatient: React.FC<{ mood?: CMood }> = ({ mood = "tired" }) => (
  <g>
    <ellipse cx={0} cy={44} rx={132} ry={128} fill={HOOD} {...sk} />
    <path d="M-120 330 C-120 190 -88 146 0 144 C88 146 120 190 120 330 Z" fill={HOOD} {...sk} />
    <path d="M-22 150 V210 M22 150 V210" {...sk} strokeWidth={5} />
    <path d="M-80 270 H80 L92 330 H-92 Z" fill="none" {...sk} strokeWidth={5} />
    <Arm d="M-108 182 C-150 230 -146 282 -122 312" fill={HOOD} /><Arm d="M108 182 C140 206 128 252 96 258" fill={HOOD} />
    <Mitt x={-122} y={316} /><Mitt x={90} y={258} />
    <g transform="translate(96 232) rotate(24)"><rect x={-28} y={-24} width={56} height={48} rx={10} fill="#fff" {...sk} strokeWidth={5} /></g>
    <rect x={-24} y={84} width={48} height={64} fill={SKIN} {...sk} />
    <Head mood={mood} />
    <circle cx={0} cy={30} r={11} fill="#E9776B" {...sk} strokeWidth={4} />
  </g>
);
export const CharSheetCute: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
    <rect width={1080} height={1920} fill="#EFE6D6" />
    {(["happy", "explain", "surprised", "worried"] as CMood[]).map((m, i) => (
      <g key={m} transform={`translate(${270 + (i % 2) * 540} ${300 + Math.floor(i / 2) * 560}) scale(1.0)`}><CuteDoc mood={m} up={m === "explain"} /><text y={400} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.source}>{m}</text></g>
    ))}
    <g transform="translate(270 1440)"><CutePatient mood="tired" /></g>
    <g transform="translate(810 1440)"><CutePatient mood="worried" /></g>
  </svg>
);
