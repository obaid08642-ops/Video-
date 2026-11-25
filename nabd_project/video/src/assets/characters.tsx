// Nabd characters v2 (PROPOSAL): same flat style, but with real features (hair, brows, nose, cheeks, clothes, accessories).
// Each character is drawn around (0,0) = head centre, bust down to y=330, like the older Doc. No real people, no logos.
import React from "react";
import { C, FONT } from "../theme";
import { sk } from "../components/Frame";
import { Place } from "./index";

const HAIR = "#5A4636", GREY = "#BDB7AE", BLUE = "#9DC9E8", TEAL = "#7FB7B0", MUSTARD = "#F2D79A", BLUSH = "#EFA58E", SHIRT = "#CFE0EE", GREEN = "#6FAE6B";
const th = { ...sk, strokeWidth: 5 };

type HeadProps = { skin?: string; mood?: number; brows?: number; tired?: boolean; ears?: boolean; nose?: string };
const Head: React.FC<HeadProps> = ({ skin = C.skin, mood = 1, brows = 0, tired = false, ears = true, nose }) => (
  <g>
    {ears && (<><circle cx={-97} cy={4} r={20} fill={skin} {...th} /><circle cx={97} cy={4} r={20} fill={skin} {...th} /></>)}
    <circle cx={0} cy={0} r={98} fill={skin} {...sk} />
    <circle cx={-58} cy={26} r={15} fill={BLUSH} opacity={0.6} />
    <circle cx={58} cy={26} r={15} fill={BLUSH} opacity={0.6} />
    {tired ? (
      <>
        <path d="M-48 -4 Q-34 8 -20 -4" fill="none" {...th} /><path d="M20 -4 Q34 8 48 -4" fill="none" {...th} />
      </>
    ) : (
      <>
        <circle cx={-34} cy={-6} r={8} fill={C.ink} /><circle cx={34} cy={-6} r={8} fill={C.ink} />
        <circle cx={-31} cy={-9} r={2.6} fill="#fff" /><circle cx={37} cy={-9} r={2.6} fill="#fff" />
      </>
    )}
    <path d={`M-52 ${-30 - 8 * brows} Q-34 ${-38 - 4 * brows} -18 ${-30 + 6 * brows}`} fill="none" {...th} />
    <path d={`M52 ${-30 - 8 * brows} Q34 ${-38 - 4 * brows} 18 ${-30 + 6 * brows}`} fill="none" {...th} />
    <path d="M-5 8 Q8 22 -6 28" fill="none" {...th} strokeWidth={4.5} />
    {nose && <circle cx={0} cy={22} r={15} fill={nose} opacity={0.85} />}
    <path d={`M-22 48 Q0 ${48 + 22 * mood} 22 48`} fill="none" {...th} />
  </g>
);
const Torso: React.FC<{ fill: string }> = ({ fill }) => (
  <g>
    <rect x={-24} y={70} width={48} height={60} fill={C.skin} {...th} />
    <path d="M-150 330 C-150 150 -110 105 0 105 C110 105 150 150 150 330 Z" fill={fill} {...sk} />
  </g>
);
const Arm: React.FC<{ d: string; fill: string; hand: [number, number] }> = ({ d, fill, hand }) => (
  <g>
    <path d={d} fill="none" stroke={C.ink} strokeWidth={42} strokeLinecap="round" />
    <path d={d} fill="none" stroke={fill} strokeWidth={30} strokeLinecap="round" />
    <circle cx={hand[0]} cy={hand[1]} r={23} fill={C.skin} {...th} />
  </g>
);
const Arms: React.FC<{ fill: string }> = ({ fill }) => (
  <g>
    <Arm d="M-128 170 C-176 220 -182 275 -170 316" fill={fill} hand={[-170, 322]} />
    <Arm d="M128 170 C176 220 182 275 170 316" fill={fill} hand={[170, 322]} />
  </g>
);
const Glasses: React.FC<{ round?: boolean }> = ({ round }) => (
  <g fill="none" {...th}>
    {round ? (<><circle cx={-34} cy={-4} r={27} /><circle cx={34} cy={-4} r={27} /></>) : (<><rect x={-62} y={-24} width={50} height={36} rx={10} /><rect x={12} y={-24} width={50} height={36} rx={10} /></>)}
    <path d="M-10 -8 H10" />
  </g>
);
const Steth: React.FC = () => (
  <g>
    <path d="M-46 112 C-72 230 -10 290 22 262" fill="none" stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
    <circle cx={30} cy={262} r={18} fill={C.shield} {...th} />
  </g>
);
const Coat: React.FC = () => (
  <g>
    <path d="M-34 105 L0 190 L34 105 Z" fill={SHIRT} {...th} />
    <path d="M-34 105 L-64 195 L0 330 M34 105 L64 195 L0 330" fill="none" {...th} />
  </g>
);

/** Dr. (male): neat hair, glasses, white coat, stethoscope, Nabd badge */
export const DoctorM: React.FC<{ mood?: number }> = ({ mood = 1 }) => (
  <g>
    <Torso fill={C.white} /><Coat /><Steth />
    <circle cx={-78} cy={240} r={22} fill={C.brand} {...th} /><circle cx={-78} cy={232} r={4} fill="#fff" /><path d="M-90 248 Q-78 258 -66 248" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
    <Arms fill={C.white} />
    <Head mood={mood} />
    <path d="M-100 -10 C-122 -138 122 -138 100 -10 C90 -62 50 -78 8 -74 C-34 -72 -82 -62 -100 -10 Z" fill={HAIR} {...th} />
    <Glasses />
  </g>
);
/** Dr. (female): teal hijab, white coat, stethoscope */
export const DoctorF: React.FC<{ mood?: number }> = ({ mood = 1 }) => (
  <g>
    <Torso fill={C.white} /><Coat />
    <path d="M-128 50 C-140 -160 140 -160 128 50 C134 150 92 214 0 220 C-92 214 -134 150 -128 50 Z" fill={TEAL} {...sk} />
    <Steth /><Arms fill={C.white} />
    <Head mood={mood} ears={false} />
    <path d="M-98 -26 C-102 -124 102 -124 98 -26 C72 -72 -72 -72 -98 -26 Z" fill={TEAL} {...th} />
    <path d="M-60 -64 C-30 -80 30 -80 60 -64" fill="none" stroke="#fff" strokeWidth={4} opacity={0.5} strokeLinecap="round" />
  </g>
);
/** Pharmacist: short beard, rectangular glasses, white coat with a green cross, holding a plain generic box */
export const PharmacistM: React.FC<{ mood?: number }> = ({ mood = 1 }) => (
  <g>
    <Torso fill={C.white} />
    <path d="M-34 105 L0 190 L34 105 Z" fill="#BFE0C4" {...th} />
    <path d="M-34 105 L-64 195 L0 330 M34 105 L64 195 L0 330" fill="none" {...th} />
    <g transform="translate(-80 236)"><circle r={24} fill="#fff" {...th} /><path d="M0 -13 V13 M-13 0 H13" stroke={GREEN} strokeWidth={9} strokeLinecap="round" /></g>
    <Arm d="M-128 170 C-176 220 -182 275 -170 316" fill={C.white} hand={[-170, 322]} />
    <Arm d="M128 170 C190 190 200 250 178 285" fill={C.white} hand={[176, 292]} />
    <g transform="translate(176 262) rotate(-8)"><rect x={-52} y={-40} width={104} height={80} rx={10} fill="#fff" {...sk} /><rect x={-52} y={-8} width={104} height={20} fill={BLUE} {...th} /></g>
    <circle cx={176} cy={292} r={23} fill={C.skin} {...th} />
    <Head mood={mood} brows={0.4} />
    <path d="M-98 6 C-100 104 100 104 98 6 C86 52 60 82 0 82 C-60 82 -86 52 -98 6 Z" fill={HAIR} {...th} />
    <path d="M-100 -12 C-112 -122 112 -122 100 -12 C86 -52 -86 -52 -100 -12 Z" fill={HAIR} {...th} />
    <Glasses />
  </g>
);
/** Patient (man): blue hoodie, messy hair, red nose, tired eyes, tissue in hand, a sweat drop */
export const PatientM: React.FC = () => (
  <g>
    <ellipse cx={0} cy={26} rx={128} ry={132} fill={BLUE} {...sk} />
    <Torso fill={BLUE} />
    <path d="M-86 266 H86 L100 330 H-100 Z" fill="none" {...th} />
    <path d="M-22 112 V176 M22 112 V176" {...th} />
    <Arm d="M-128 170 C-176 220 -182 275 -170 316" fill={BLUE} hand={[-170, 322]} />
    <Arm d="M128 170 C176 200 150 250 118 250" fill={BLUE} hand={[112, 250]} />
    <g transform="translate(96 226) rotate(24)"><rect x={-30} y={-26} width={60} height={52} rx={10} fill="#fff" {...th} /></g>
    <circle cx={112} cy={250} r={23} fill={C.skin} {...th} />
    <Head mood={-0.6} brows={-1} tired nose={C.warn} />
    <path d="M-70 -86 C-62 -132 -14 -128 0 -100 C12 -134 58 -128 70 -86 C44 -78 -44 -78 -70 -86 Z" fill={HAIR} {...th} />
    <path d="M122 -70 C112 -46 112 -34 122 -26 C132 -34 132 -46 122 -70 Z" fill={C.glass} {...th} />
  </g>
);
/** Patient (older woman): grey bun, round glasses, mustard cardigan with buttons, worried smile */
export const PatientF: React.FC = () => (
  <g>
    <circle cx={0} cy={-122} r={36} fill={GREY} {...sk} />
    <Torso fill={MUSTARD} />
    <path d="M-34 105 L0 170 L34 105 Z" fill="#fff" {...th} />
    <path d="M0 170 V330" {...th} />
    {[210, 255, 300].map((y) => (<circle key={y} cx={-18} cy={y} r={7} fill={C.ink} />))}
    <Arms fill={MUSTARD} />
    <Head mood={0.3} brows={-0.4} />
    <path d="M-100 -4 C-120 -132 120 -132 100 -4 C84 -58 40 -78 0 -70 C-40 -78 -84 -58 -100 -4 Z" fill={GREY} {...th} />
    <Glasses round />
    <path d="M-70 40 q-6 8 0 16 M70 40 q6 8 0 16" fill="none" {...th} strokeWidth={3.5} />
  </g>
);

/** medicine shapes (generic: no brand, no label text) */
export const MedTablet: React.FC = () => (<g><circle r={52} fill={C.white} {...sk} /><path d="M-52 0 H52" {...th} /></g>);
export const MedCapsule: React.FC = () => (
  <g transform="rotate(-35)">
    <path d="M0 -36 H-40 A36 36 0 0 0 -40 36 H0 Z" fill={C.brand} {...sk} />
    <path d="M0 -36 H40 A36 36 0 0 1 40 36 H0 Z" fill={C.white} {...sk} />
  </g>
);
export const MedSyrup: React.FC = () => (
  <g>
    <rect x={-22} y={-86} width={44} height={26} rx={6} fill={C.brand} {...th} />
    <path d="M-22 -60 H22 V-44 C60 -34 62 -10 62 10 V66 C62 82 50 92 36 92 H-36 C-50 92 -62 82 -62 66 V10 C-62 -10 -60 -34 -22 -44 Z" fill={C.glass} {...sk} />
    <path d="M-60 24 H60 V66 C60 82 50 90 36 90 H-36 C-50 90 -60 82 -60 66 Z" fill="#F2A65A" opacity={0.85} />
    <rect x={-34} y={-4} width={68} height={40} rx={8} fill="#fff" {...th} />
  </g>
);
export const MedBlister: React.FC = () => (
  <g>
    <rect x={-70} y={-48} width={140} height={96} rx={16} fill="#E8EAEC" {...sk} />
    {[[-40, -18], [0, -18], [40, -18], [-40, 20], [0, 20], [40, 20]].map(([x, y], i) => (<circle key={i} cx={x} cy={y} r={14} fill={i < 4 ? C.white : "#E8EAEC"} {...th} strokeWidth={4} />))}
  </g>
);

const Cap: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.ink} direction="rtl">{text}</text>
);
/** the preview sheet (1920x1080) */
export const CharSheet: React.FC = () => {
  const xs = [192, 576, 960, 1344, 1728];
  const who = [<DoctorM key={0} />, <DoctorF key={1} />, <PharmacistM key={2} />, <PatientM key={3} />, <PatientF key={4} />];
  const names = ["الدكتور", "الدكتورة", "الصيدلي", "المريض", "مريضة"];
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ background: C.bg }}>
      <text x={960} y={72} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={54} fill={C.key} direction="rtl">شخصيات نبض: اقتراح (نفس الستايل، بملامح)</text>
      {who.map((w, i) => (<g key={i}><Place x={xs[i]} y={420} s={0.86}>{w}</Place><Cap x={xs[i]} y={770} text={names[i]} /></g>))}
      <rect x={160} y={830} width={1600} height={200} rx={30} fill={C.card} {...sk} />
      {[<MedTablet key={0} />, <MedCapsule key={1} />, <MedSyrup key={2} />, <MedBlister key={3} />].map((m, i) => (<Place key={i} x={380 + i * 387} y={925} s={0.8}>{m}</Place>))}
    </svg>
  );
};
