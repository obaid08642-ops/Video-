// Ep08 (H. pylori) icon set, cute flat style (same ink line as CharsCute). Each is drawn around (0,0).
import React from "react";
import { C, FONT } from "../theme";
import { sk } from "../components/Frame";

export const GREEN = "#9CC48A", GREEN_D = "#7FAE70";
/** cute spiral bacterium (2D): wavy body, two eyes, tail flagella */
export const BugC: React.FC<{ mood?: "smile" | "evil" | "sad"; s?: number; wiggle?: number }> = ({ mood = "smile", s = 1, wiggle = 0 }) => (
  <g transform={`scale(${s})`}>
    <path d={`M-150 ${20 + wiggle} C-110 -60 -60 -60 -20 ${10 - wiggle} C20 80 70 80 110 ${-10 + wiggle} C130 -40 150 -30 150 -10`} fill="none" stroke={C.ink} strokeWidth={74} strokeLinecap="round" />
    <path d={`M-150 ${20 + wiggle} C-110 -60 -60 -60 -20 ${10 - wiggle} C20 80 70 80 110 ${-10 + wiggle} C130 -40 150 -30 150 -10`} fill="none" stroke={GREEN} strokeWidth={62} strokeLinecap="round" />
    <path d="M-170 10 q-30 -20 -50 0 M-170 30 q-30 0 -52 18 M-168 50 q-26 18 -44 40" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    <circle cx={112} cy={-26} r={15} fill="#fff" {...sk} strokeWidth={4} /><circle cx={118} cy={-24} r={6} fill={C.ink} />
    <circle cx={148} cy={-30} r={15} fill="#fff" {...sk} strokeWidth={4} /><circle cx={154} cy={-28} r={6} fill={C.ink} />
    <path d={mood === "smile" ? "M118 4 Q132 18 148 4" : mood === "sad" ? "M120 14 Q134 2 148 14" : "M118 6 Q134 16 150 2"} fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
    {mood === "evil" && <path d="M98 -48 L126 -40 M170 -50 L142 -42" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />}
  </g>
);
export const StomachC: React.FC<{ state?: "ok" | "red" | "ulcer"; face?: boolean }> = ({ state = "ok", face = true }) => (
  <g>
    <path d="M-30 -190 C40 -200 60 -120 50 -60 C150 -30 210 60 170 150 C130 240 0 230 -70 170 C-120 130 -90 70 -60 40 C-80 -20 -80 -150 -30 -190 Z" fill={state === "ok" ? "#F0A89A" : "#E88873"} {...sk} />
    <path d="M-20 -190 C-50 -230 -80 -230 -92 -250" fill="none" {...sk} strokeWidth={26} />
    <path d="M50 -60 C60 -100 90 -110 120 -100" fill="none" {...sk} strokeWidth={26} />
    {state === "ulcer" && <><circle cx={60} cy={60} r={24} fill="#C23B32" {...sk} strokeWidth={4} /><circle cx={60} cy={60} r={9} fill="#7B1F1A" /></>}
    {state === "red" && [[60, 40], [20, 100], [100, 120]].map(([x, y], i) => (<circle key={i} cx={x} cy={y} r={14} fill="#C23B32" {...sk} strokeWidth={4} />))}
    {face && <g><circle cx={20} cy={50} r={8} fill={C.ink} /><circle cx={80} cy={55} r={8} fill={C.ink} /><path d={state === "ok" ? "M25 85 Q50 105 75 85" : "M25 100 Q50 80 75 100"} fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" /></g>}
  </g>
);
export const GlassBug: React.FC = () => (
  <g>
    <path d="M-80 -120 H80 L62 130 Q0 150 -62 130 Z" fill="#CFE6F5" fillOpacity={0.75} {...sk} />
    <path d="M-72 -20 H72 L62 130 Q0 150 -62 130 Z" fill={GREEN} opacity={0.9} />
    <g transform="translate(0 -60) scale(0.34)"><BugC /></g>
  </g>
);
export const Medal: React.FC<{ text?: string }> = ({ text = "نوبل" }) => (
  <g>
    <path d="M-50 -170 L-10 -60 M50 -170 L10 -60" stroke={C.brand} strokeWidth={34} strokeLinecap="round" />
    <circle r={92} fill="#F7C548" {...sk} /><circle r={66} fill="none" stroke={C.ink} strokeWidth={5} />
    <text y={18} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={54} fill={C.ink}>{text}</text>
  </g>
);
export const Pill: React.FC<{ c1?: string; c2?: string; r?: number }> = ({ c1 = "#9DC9E8", c2 = "#FFFDF8", r = 0 }) => (
  <g transform={`rotate(${r})`}><rect x={-70} y={-30} width={140} height={60} rx={30} fill={c1} {...sk} /><path d="M0 -30 H40 A30 30 0 0 1 40 30 H0 Z" fill={c2} {...sk} /></g>
);
export const BloodDrop: React.FC<{ s?: number }> = ({ s = 1 }) => (<g transform={`scale(${s})`}><path d="M0 -90 C60 -10 70 30 40 70 C10 100 -10 100 -40 70 C-70 30 -60 -10 0 -90 Z" fill="#C23B32" {...sk} /><path d="M-22 20 q4 24 24 30" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.7} /></g>);
export const Tube: React.FC<{ fill?: string }> = ({ fill = "#C23B32" }) => (<g><rect x={-34} y={-110} width={68} height={210} rx={34} fill="#EAF3FA" {...sk} /><path d="M-34 -10 H34 V66 A34 34 0 0 1 -34 66 Z" fill={fill} /><rect x={-34} y={-110} width={68} height={210} rx={34} fill="none" {...sk} /><rect x={-44} y={-126} width={88} height={28} rx={10} fill={C.brand} {...sk} /></g>);
export const Breath: React.FC = () => (<g><path d="M-70 -20 C-70 -110 70 -110 70 -20 C70 70 20 100 0 100 C-20 100 -70 70 -70 -20 Z" fill="#CFE0EE" {...sk} /><path d="M-18 100 h36 v50 h-36 Z" fill="#B8BEC6" {...sk} /><path d="M-30 -30 q30 -20 60 0" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" /></g>);
export const Jar: React.FC = () => (<g><rect x={-70} y={-60} width={140} height={150} rx={26} fill="#EAF3FA" {...sk} /><rect x={-80} y={-96} width={160} height={44} rx={14} fill={C.brand} {...sk} /><path d="M-62 40 H62 V80 Q62 88 54 88 H-54 Q-62 88 -62 80 Z" fill="#B58B5A" /></g>);
export const Scope: React.FC = () => (<g><path d="M-150 80 C-80 80 -90 -40 0 -40 C90 -40 60 80 150 80" fill="none" stroke={C.ink} strokeWidth={34} strokeLinecap="round" /><path d="M-150 80 C-80 80 -90 -40 0 -40 C90 -40 60 80 150 80" fill="none" stroke="#C9CED6" strokeWidth={22} strokeLinecap="round" /><circle cx={158} cy={80} r={22} fill="#F7C548" {...sk} strokeWidth={5} /></g>);
export const Cal: React.FC<{ text: string; size?: number }> = ({ text, size = 90 }) => (
  <g>
    <rect x={-170} y={-150} width={340} height={320} rx={30} fill={C.paper} {...sk} /><path d="M-170 -150 H170 V-60 H-170 Z" fill={C.brand} {...sk} />
    <circle cx={-90} cy={-150} r={14} fill={C.bg} {...sk} strokeWidth={5} /><circle cx={90} cy={-150} r={14} fill={C.bg} {...sk} strokeWidth={5} />
    <text x={0} y={76} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill={C.ink}>{text}</text>
  </g>
);
export const Honey: React.FC = () => (<g><rect x={-70} y={-60} width={140} height={150} rx={34} fill="#F0A23B" {...sk} /><rect x={-60} y={-100} width={120} height={40} rx={12} fill="#C9B04A" {...sk} /><path d="M-34 6 h68 M-34 40 h68" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.7} /></g>);
export const Yogurt: React.FC = () => (<g><path d="M-80 -60 H80 L60 100 H-60 Z" fill="#fff" {...sk} /><path d="M-80 -60 H80 V-30 H-76 Z" fill={C.brand} {...sk} /><ellipse cx={0} cy={-62} rx={80} ry={16} fill="#FFFDF8" {...sk} /></g>);
export const Garlic: React.FC = () => (<g><path d="M0 -110 C20 -70 90 -50 80 20 C74 90 20 100 0 100 C-20 100 -74 90 -80 20 C-90 -50 -20 -70 0 -110 Z" fill="#FFFDF8" {...sk} /><path d="M0 -100 V90 M-40 -30 C-50 30 -30 80 0 90 M40 -30 C50 30 30 80 0 90" fill="none" stroke={C.ink} strokeWidth={4} opacity={0.4} /></g>);
export const Herb: React.FC = () => (<g><path d="M0 100 V-80" stroke={C.ink} strokeWidth={16} strokeLinecap="round" /><path d="M0 100 V-80" stroke={GREEN_D} strokeWidth={8} strokeLinecap="round" />{[[-1, -50], [1, -20], [-1, 10], [1, 40]].map(([d, y], i) => (<path key={i} d={`M0 ${y} C${d * 40} ${y - 40} ${d * 80} ${y - 10} ${d * 70} ${y + 18} C${d * 40} ${y + 30} 0 ${y} 0 ${y}`} fill={GREEN} {...sk} strokeWidth={5} />))}</g>);
export const Chili: React.FC = () => (<g><path d="M-80 -60 C-20 -100 70 -40 80 40 C84 80 60 100 40 70 C20 40 -30 -10 -80 -20 Z" fill="#C23B32" {...sk} /><path d="M-80 -60 L-110 -90" stroke={GREEN_D} strokeWidth={14} strokeLinecap="round" /></g>);
export const Coffee: React.FC = () => (<g><path d="M-80 -50 H70 V40 Q70 100 0 100 H-10 Q-80 100 -80 40 Z" fill="#fff" {...sk} /><path d="M70 -30 H100 Q130 -30 130 10 Q130 50 90 50 H68" fill="none" {...sk} /><path d="M-60 -50 H60 V-20 H-60 Z" fill="#7A5230" /><path d="M-20 -80 q-14 -20 0 -40 M20 -80 q-14 -20 0 -40" fill="none" stroke={C.source} strokeWidth={8} strokeLinecap="round" /></g>);
export const Salt: React.FC = () => (<g><path d="M-50 -20 H50 L60 100 H-60 Z" fill="#fff" {...sk} /><path d="M-50 -20 C-50 -90 50 -90 50 -20 Z" fill="#B8BEC6" {...sk} />{[[-20, -50], [10, -60], [30, -40]].map(([x, y], i) => (<circle key={i} cx={x} cy={y} r={5} fill={C.ink} />))}</g>);
export const Cig: React.FC = () => (<g><rect x={-120} y={-18} width={190} height={36} rx={8} fill="#fff" {...sk} /><rect x={30} y={-18} width={40} height={36} fill="#E7B79C" {...sk} /><path d="M-130 -10 q-20 -30 0 -60 q20 -30 0 -60" fill="none" stroke={C.source} strokeWidth={8} strokeLinecap="round" /></g>);
export const NoSign: React.FC = () => (<g><circle r={120} fill="none" stroke={C.warn} strokeWidth={22} /><path d="M-84 -84 L84 84" stroke={C.warn} strokeWidth={22} strokeLinecap="round" /></g>);
export const Blister: React.FC = () => (<g><rect x={-110} y={-70} width={220} height={140} rx={24} fill="#DDE3EA" {...sk} />{[-60, 0, 60].map((x) => [-24, 28].map((y, j) => (<ellipse key={`${x}${y}`} cx={x} cy={y} rx={22} ry={16} fill="#FFFDF8" {...sk} strokeWidth={4} />)))}</g>);
export const StressCloud: React.FC = () => (<g><path d="M-120 40 C-170 40 -170 -30 -110 -30 C-110 -90 -30 -100 0 -60 C30 -100 110 -80 110 -20 C170 -20 170 40 110 40 Z" fill="#B8BEC6" {...sk} /><path d="M10 40 L-20 90 L10 80 L-10 130" fill="none" stroke="#F7C548" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /></g>);
export const Soap: React.FC = () => (<g><rect x={-80} y={-20} width={160} height={90} rx={30} fill="#CFE0EE" {...sk} /><circle cx={-50} cy={-60} r={26} fill="#fff" {...sk} strokeWidth={4} /><circle cx={20} cy={-80} r={34} fill="#fff" {...sk} strokeWidth={4} /><circle cx={80} cy={-46} r={18} fill="#fff" {...sk} strokeWidth={4} /></g>);
export const WaterBottle: React.FC = () => (<g><rect x={-50} y={-90} width={100} height={190} rx={34} fill="#CFE6F5" fillOpacity={0.85} {...sk} /><rect x={-26} y={-120} width={52} height={36} rx={10} fill={C.brand} {...sk} /><path d="M-50 10 H50" stroke="#fff" strokeWidth={8} opacity={0.7} /></g>);
export const Pie: React.FC<{ v: number; r?: number }> = ({ v, r = 140 }) => {
  const a = 2 * Math.PI * v; const x = r * Math.sin(a), y = -r * Math.cos(a);
  return (<g><circle r={r} fill="#EAF3FA" {...sk} /><path d={`M0 0 L0 ${-r} A${r} ${r} 0 ${v > 0.5 ? 1 : 0} 1 ${x} ${y} Z`} fill={C.key} {...sk} /></g>);
};
export const KidHead: React.FC = () => (<g><circle r={70} fill="#F6D0AE" {...sk} /><path d="M-66 -20 C-60 -80 60 -80 66 -20 C40 -50 -40 -50 -66 -20 Z" fill="#4B3A30" {...sk} /><circle cx={-24} cy={6} r={8} fill={C.ink} /><circle cx={24} cy={6} r={8} fill={C.ink} /><path d="M-18 34 Q0 48 18 34" fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" /><circle cx={-44} cy={26} r={10} fill="#F5A99A" opacity={0.6} /><circle cx={44} cy={26} r={10} fill="#F5A99A" opacity={0.6} /></g>);
export const Belly: React.FC = () => (<g><ellipse rx={110} ry={100} fill="#F6D0AE" {...sk} /><circle cy={10} r={9} fill={C.ink} opacity={0.5} /><path d="M-60 -50 l-20 -20 M60 -50 l20 -20 M-90 0 h-30 M90 0 h30" stroke={C.brand} strokeWidth={10} strokeLinecap="round" /></g>);
export const Bag: React.FC = () => (<g><path d="M-80 -60 H80 L90 100 H-90 Z" fill="#fff" {...sk} /><path d="M-40 -60 q0 -50 40 -50 q40 0 40 50" fill="none" {...sk} /><path d="M-50 10 H50 M-50 50 H50" stroke={C.ink} strokeWidth={5} opacity={0.3} /></g>);
