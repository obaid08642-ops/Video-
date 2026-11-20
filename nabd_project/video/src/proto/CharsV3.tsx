// Characters v3 (prototype): more human proportions, two-tone cel shading (no gradients), full face (almond eyes with iris + highlight,
// thick expressive brows, nose, lips/teeth, ears), neck shadow, collar, hands. Expressions: happy | surprised | worried | explain | shock.
import React from "react";
import { C, FONT } from "../theme";
import { sk } from "../components/Frame";

const th = { ...sk, strokeWidth: 5 };
const SKIN = "#E3AE90", SKIN_D = "#C98F72", HAIR = "#3E2F26", HAIR_L = "#5D4A3C", COAT = "#FFFDF8", COAT_D = "#E6DFD0", BLUE = "#9DC9E8", BLUE_D = "#7FB0D4";
export type Mood = "happy" | "surprised" | "worried" | "explain" | "shock";

const Eye: React.FC<{ x: number; open: number; look?: number; lite?: boolean }> = ({ x, open, look = 0, lite }) => (
  <g transform={`translate(${x} -8)`}>
    <path d={`M-24 0 Q0 ${-22 * open} 24 0 Q0 ${20 * open} -24 0 Z`} fill="#fff" {...th} strokeWidth={4} />
    <circle cx={look * 6} cy={0} r={(lite ? 9 : 11) * Math.min(1, open + 0.3)} fill={lite ? "#6B4A38" : "#5B3A29"} />
    <circle cx={look * 6} cy={0} r={5.5} fill={C.ink} />
    <circle cx={look * 6 + 4} cy={-4} r={3.2} fill="#fff" />
    <path d={`M-26 -1 Q0 ${-26 * open} 26 -1`} fill="none" stroke={C.ink} strokeWidth={lite ? 3.5 : 6} strokeLinecap="round" />
  </g>
);
const Brow: React.FC<{ x: number; tilt: number; lift: number; flip?: boolean; lite?: boolean; me?: boolean }> = ({ x, tilt, lift, flip, lite, me }) => (
  <path d={`M${x - 28} ${-44 - lift + (flip ? -tilt : tilt)} Q${x} ${-56 - lift} ${x + 28} ${-44 - lift + (flip ? tilt : -tilt)}`} fill="none" stroke={me ? "#2B2623" : lite ? "#6B4F3A" : HAIR} strokeWidth={me ? 11 : lite ? 7 : 10} strokeLinecap="round" />
);
const MOODS: Record<Mood, { open: number; tilt: number; lift: number; mouth: string; teeth: boolean; look: number }> = {
  happy: { open: 0.85, tilt: -3, lift: 0, mouth: "M-30 58 Q0 90 30 58", teeth: true, look: 0 },
  surprised: { open: 1.25, tilt: -6, lift: 12, mouth: "M-20 58 Q0 106 20 58 Q0 48 -20 58", teeth: false, look: 0 },
  worried: { open: 0.9, tilt: 12, lift: 4, mouth: "M-26 72 Q0 54 26 72", teeth: false, look: -1 },
  explain: { open: 0.95, tilt: -2, lift: 3, mouth: "M-24 58 Q0 78 24 58 Q0 66 -24 58", teeth: false, look: 1 },
  shock: { open: 1.35, tilt: 8, lift: 16, mouth: "M-28 56 Q0 124 28 56 Q0 44 -28 56", teeth: false, look: 0 },
};
const Head: React.FC<{ mood: Mood; hair?: "short" | "bald" | "hijab"; beard?: boolean; glasses?: boolean; skin?: string; lite?: boolean; me?: boolean }> = ({ mood, hair = "short", beard, glasses, skin = SKIN, lite, me }) => {
  const m = MOODS[mood];
  const th = lite ? { ...sk, strokeWidth: 4 } : { ...sk, strokeWidth: 5 }; const HAIRC = me ? "#2B2623" : lite ? "#7A5A44" : HAIR; const SK = me ? "#DDAA86" : lite ? "#EDC3A5" : skin;
  return (
    <g>
      <ellipse cx={-92} cy={4} rx={16} ry={24} fill={skin} {...th} /><ellipse cx={92} cy={4} rx={16} ry={24} fill={skin} {...th} />
      <path d="M-86 0 C-86 -70 -52 -102 0 -102 C52 -102 86 -70 86 0 C86 62 52 100 0 106 C-52 100 -86 62 -86 0 Z" fill={SK} {...th} />
      <path d="M26 -96 C70 -80 90 -30 86 14 C84 66 56 98 8 106 C48 82 66 34 60 -14 C56 -48 44 -78 26 -96 Z" fill={SKIN_D} opacity={lite ? 0.22 : 0.55} />
      <ellipse cx={-48} cy={30} rx={18} ry={12} fill="#EFA58E" opacity={0.55} />
      {hair === "short" && me && (<><path d="M-90 -6 C-104 -86 -62 -128 -8 -126 C34 -150 102 -126 92 -6 C86 -40 70 -64 48 -76 C20 -90 -34 -84 -62 -62 C-78 -48 -86 -28 -90 -6 Z" fill={HAIRC} {...th} /><path d="M-30 -112 C-8 -128 30 -128 56 -108" fill="none" stroke="#4A403A" strokeWidth={8} strokeLinecap="round" /><path d="M-88 -10 C-92 6 -90 22 -84 30 L-78 4 Z M88 -10 C92 6 90 22 84 30 L78 4 Z" fill={HAIRC} /></>)}
      {hair === "short" && !me && (<><path d="M-90 -14 C-100 -94 -52 -126 4 -122 C60 -122 100 -88 90 -12 C80 -50 44 -78 4 -76 C-40 -78 -78 -56 -90 -14 Z" fill={HAIRC} {...th} /><path d="M-44 -100 C-18 -112 24 -112 52 -96" fill="none" stroke={HAIR_L} strokeWidth={9} strokeLinecap="round" /></>)}
      {hair === "hijab" && (<path d="M-100 20 C-122 -120 122 -120 100 20 C104 90 66 136 0 140 C-66 136 -104 90 -100 20 Z M-70 8 C-60 -50 60 -50 70 8 C74 56 40 92 0 96 C-40 92 -74 56 -70 8 Z" fill="#7FB7B0" {...sk} fillRule="evenodd" />)}
      <Brow x={-34} tilt={m.tilt} lift={m.lift} lite={lite} me={me} /><Brow x={34} tilt={m.tilt} lift={m.lift} flip lite={lite} me={me} />
      <Eye x={-34} open={m.open} look={m.look} lite={lite} /><Eye x={34} open={m.open} look={m.look} lite={lite} />
      <path d="M-4 -4 Q-14 30 -10 38 Q0 46 12 38" fill="none" {...th} strokeWidth={4.5} />
      <path d="M-14 42 Q0 50 14 42" fill="none" stroke={SKIN_D} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      {me && (<g><path d="M-80 22 C-76 76 -44 104 0 106 C44 104 76 76 80 22 C72 48 50 58 0 58 C-50 58 -72 48 -80 22 Z" fill="#3A302B" opacity={0.78} /><path d="M-36 44 Q0 30 36 44 Q24 58 0 54 Q-24 58 -36 44 Z" fill="#2B2623" /><path d="M-9 70 Q0 86 9 70 Z" fill="#2B2623" /></g>)}
      {beard && !lite && !me && <path d="M-80 20 C-76 90 -44 114 0 114 C44 114 76 90 80 20 C66 60 44 74 0 74 C-44 74 -66 60 -80 20 Z" fill={HAIR} opacity={0.82} />}
      <path d={m.mouth} fill={m.teeth || mood === "surprised" || mood === "shock" ? "#7A2E2E" : "none"} {...th} />
      {m.teeth && <path d="M-24 62 Q0 78 24 62 Q0 66 -24 62 Z" fill="#fff" />}
      {glasses && !lite && (<g fill="none" {...th}><rect x={-64} y={-30} width={52} height={40} rx={14} /><rect x={12} y={-30} width={52} height={40} rx={14} /><path d="M-12 -14 H12" /></g>)}
    </g>
  );
};
const Torso: React.FC<{ coat?: boolean; shirt?: string }> = ({ coat = true, shirt = BLUE }) => (
  <g>
    <rect x={-26} y={78} width={52} height={50} fill={SKIN_D} {...th} />
    <path d="M-160 330 C-160 170 -120 118 0 112 C120 118 160 170 160 330 Z" fill={coat ? COAT : shirt} {...sk} />
    <path d="M-160 330 C-160 200 -150 150 -132 140 L-132 330 Z" fill={coat ? COAT_D : BLUE_D} opacity={0.6} />
    {coat && (<><path d="M-30 112 L0 196 L30 112 Z" fill={shirt} {...th} /><path d="M-30 112 L-70 190 L0 330 M30 112 L70 190 L0 330" fill="none" {...th} /><path d="M-56 126 L-30 112 L-18 150 Z M56 126 L30 112 L18 150 Z" fill={COAT} {...th} /></>)}
    {!coat && <path d="M-34 112 Q0 150 34 112" fill="none" {...th} />}
  </g>
);
const Steth: React.FC = () => (
  <g><path d="M-52 120 C-82 250 -10 306 26 272" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" /><circle cx={34} cy={270} r={19} fill="#B8BEC6" {...th} /></g>
);
const Hand: React.FC<{ x: number; y: number; point?: boolean }> = ({ x, y, point }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse rx={24} ry={21} fill={SKIN} {...th} />
    {point && <path d="M10 -6 L44 -22" stroke={C.ink} strokeWidth={22} strokeLinecap="round" />}
    {point && <path d="M10 -6 L44 -22" stroke={SKIN} strokeWidth={14} strokeLinecap="round" />}
  </g>
);
/** Host: young doctor/pharmacist with stubble + glasses + stethoscope. */
export const HostV3: React.FC<{ mood?: Mood; point?: boolean; lite?: boolean; me?: boolean; shirt?: string }> = ({ mood = "happy", point, lite, me, shirt }) => (
  <g>
    <Torso shirt={shirt} /><Steth />
    <path d="M-140 160 C-182 220 -176 280 -150 316" fill="none" stroke={C.ink} strokeWidth={44} strokeLinecap="round" /><path d="M-140 160 C-182 220 -176 280 -150 316" fill="none" stroke={COAT} strokeWidth={32} strokeLinecap="round" />
    <path d="M140 160 C184 168 200 214 176 244" fill="none" stroke={C.ink} strokeWidth={44} strokeLinecap="round" /><path d="M140 160 C184 168 200 214 176 244" fill="none" stroke={COAT} strokeWidth={32} strokeLinecap="round" />
    <Hand x={-150} y={322} /><Hand x={176} y={250} point={point} />
    <Head mood={mood} beard glasses lite={lite} me={me} />
  </g>
);
/** Patient: tired adult in a blue hoodie. */
export const PatientV3: React.FC<{ mood?: Mood; lite?: boolean }> = ({ mood = "worried", lite }) => (
  <g>
    <ellipse cx={0} cy={36} rx={140} ry={140} fill={BLUE} {...sk} />
    <Torso coat={false} shirt={BLUE} />
    <path d="M-24 130 V196 M24 130 V196" {...th} />
    <path d="M-140 160 C-182 220 -176 280 -150 316" fill="none" stroke={C.ink} strokeWidth={44} strokeLinecap="round" /><path d="M-140 160 C-182 220 -176 280 -150 316" fill="none" stroke={BLUE} strokeWidth={32} strokeLinecap="round" />
    <path d="M140 160 C170 200 150 250 110 262" fill="none" stroke={C.ink} strokeWidth={44} strokeLinecap="round" /><path d="M140 160 C170 200 150 250 110 262" fill="none" stroke={BLUE} strokeWidth={32} strokeLinecap="round" />
    <Hand x={-150} y={322} /><Hand x={104} y={262} />
    <Head mood={mood} hair="short" lite={lite} />
    <path d="M96 -46 C86 -22 86 -10 96 -2 C106 -10 106 -22 96 -46 Z" fill="#CFE6F5" {...th} strokeWidth={4} />
  </g>
);
export const CharSheetV3: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
    <rect width={1080} height={1920} fill="#EFE6D6" />
    {(["happy", "surprised", "worried", "explain"] as Mood[]).map((m, i) => (
      <g key={m} transform={`translate(${270 + (i % 2) * 540} ${300 + Math.floor(i / 2) * 560}) scale(1.05)`}><HostV3 mood={m} point={m === "explain"} /><text y={380} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.source}>{m}</text></g>
    ))}
    <g transform="translate(270 1480) scale(1.05)"><PatientV3 mood="worried" /></g>
    <g transform="translate(810 1480) scale(1.05)"><HostV3 mood="shock" /></g>
  </svg>
);

export const CharSheetLite: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
    <rect width={1080} height={1920} fill="#EFE6D6" />
    <text x={270} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.ink}>v3 (الأول: مزدحم)</text>
    <text x={810} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.ink}>خفيف (مقترح)</text>
    {(["happy", "explain", "worried"] as Mood[]).map((m, i) => (
      <g key={m}>
        <g transform={`translate(270 ${340 + i * 560}) scale(1.0)`}><HostV3 mood={m} point={m === "explain"} /></g>
        <g transform={`translate(810 ${340 + i * 560}) scale(1.0)`}><HostV3 mood={m} point={m === "explain"} lite /></g>
      </g>
    ))}
  </svg>
);

export const CharSheetMe: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
    <rect width={1080} height={1920} fill="#EFE6D6" />
    {(["happy", "explain", "surprised", "worried"] as Mood[]).map((m, i) => (
      <g key={m} transform={`translate(${270 + (i % 2) * 540} ${330 + Math.floor(i / 2) * 640}) scale(1.05)`}><HostV3 mood={m} point={m === "explain"} lite me shirt="#8B2E3A" /><text y={400} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.source}>{m}</text></g>
    ))}
  </svg>
);
