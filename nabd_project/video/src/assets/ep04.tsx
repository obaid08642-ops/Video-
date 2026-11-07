// Ep04 (paracetamol) drawings. Same rules as the other episodes: thick even ink lines, flat colours, no gradients,
// generic objects only (no logos, no real packs, no real people). Everything is drawn around (0,0).
import React from "react";
import { C, FONT } from "../theme";
import { sk } from "../components/Frame";
import { Face } from "./index";

const Tx: React.FC<{ y?: number; size?: number; fill?: string; children: React.ReactNode; dir?: "rtl" | "ltr"; x?: number }> = ({ x = 0, y = 0, size = 40, fill = C.ink, children, dir = "rtl" }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill={fill} direction={dir} unicodeBidi={dir === "ltr" ? "bidi-override" : undefined}>{children}</text>
);

/** plain round tablet with a score line (no imprint, no brand). split 0..1 = the two halves move apart */
export const Tablet: React.FC<{ glow?: number; split?: number; color?: string }> = ({ glow = 0, split = 0, color = "#FFFDF8" }) => (
  <g>
    {glow > 0 && <circle r={150} fill="#FFF3CF" opacity={0.6 * glow} />}
    <g transform={`translate(${-split * 16} 0)`}><path d="M0 -70 A70 70 0 0 0 0 70 Z" fill={color} {...sk} /></g>
    <g transform={`translate(${split * 16} 0)`}><path d="M0 -70 A70 70 0 0 1 0 70 Z" fill={color} {...sk} /></g>
    <path d="M-40 -34 C-52 -10 -52 10 -40 34" fill="none" stroke="#E2D6BC" strokeWidth={8} strokeLinecap="round" />
  </g>
);

/** generic medicine box: coloured band + symbol. kind: cold | pain */
export const PackBox: React.FC<{ band?: string; kind?: "cold" | "pain" | "plain"; ink?: number }> = ({ band = "#9DC9E8", kind = "plain" }) => (
  <g>
    <rect x={-90} y={-120} width={180} height={240} rx={16} fill={C.white} {...sk} />
    <rect x={-90} y={-30} width={180} height={70} fill={band} stroke={C.ink} strokeWidth={5} />
    {kind === "cold" && (
      <g stroke={C.ink} strokeWidth={6} strokeLinecap="round">
        <path d="M0 -92 V-52 M-20 -82 L20 -62 M20 -82 L-20 -62" />
      </g>
    )}
    {kind === "pain" && <path d="M-14 -90 L10 -78 L-10 -62 L14 -50" fill="none" {...sk} stroke={C.warn} />}
    <rect x={-52} y={62} width={104} height={14} rx={7} fill="#E6DCC6" />
    <rect x={-36} y={86} width={72} height={10} rx={5} fill="#E6DCC6" />
  </g>
);

/** the liver: simple lobed organ. hurt 0..1 = red patches grow, glow = soft yellow aura, shield 0..1 = blue ring */
export const Liver: React.FC<{ hurt?: number; glow?: number; shield?: number; pale?: number }> = ({ hurt = 0, glow = 0, shield = 0, pale = 0 }) => (
  <g>
    {glow > 0 && <ellipse rx={250} ry={190} fill="#FFF3CF" opacity={0.55 * glow} />}
    {shield > 0 && <ellipse rx={235} ry={165} fill="none" stroke="#6FA8D6" strokeWidth={14} opacity={shield} strokeDasharray="30 18" />}
    <path d="M-190 -30 C-200 -110 -120 -140 -20 -130 C70 -125 150 -100 190 -40 C210 0 170 70 100 100 C30 125 -60 120 -120 90 C-170 65 -185 20 -190 -30 Z" fill={pale ? "#D9A9A0" : "#C8776B"} {...sk} />
    <path d="M-20 -128 C-10 -80 10 -40 40 -10" fill="none" {...sk} strokeWidth={5} />
    <path d="M60 100 C60 140 90 160 120 150" fill="none" {...sk} strokeWidth={5} />
    {hurt > 0 && (
      <g opacity={hurt}>
        {[[-110, 10, 38], [-30, 40, 30], [60, -40, 40], [110, 30, 26], [-60, -60, 24]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r * (0.6 + 0.4 * hurt)} fill="#8E2A2A" opacity={0.75} />
        ))}
      </g>
    )}
  </g>
);

/** NAPQI: a spiky, angry red blob (the reactive by-product). calm 0..1 turns it green and friendly (neutralised) */
export const Napqi: React.FC<{ calm?: number; wob?: number }> = ({ calm = 0, wob = 0 }) => {
  const N = 12; const pts: string[] = [];
  for (let i = 0; i < N * 2; i++) {
    const a = (i / (N * 2)) * Math.PI * 2; const r = (i % 2 ? 44 : 66 - 22 * calm) + (calm ? 0 : Math.sin(wob + i) * 3);
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`);
  }
  return (
    <g>
      <polygon points={pts.join(" ")} fill={calm > 0.5 ? "#9CC48A" : "#D9483B"} {...sk} strokeWidth={5} />
      <Face x={0} y={4} size={0.7} mood={calm > 0.5 ? 0.9 : -1} brows={calm > 0.5 ? 0 : -1} />
    </g>
  );
};

/** glutathione "rescue team" member: small blue blob with a helmet and a life ring */
export const Rescuer: React.FC<{ run?: number }> = ({ run = 0 }) => (
  <g transform={`translate(0 ${Math.sin(run) * 4})`}>
    <ellipse rx={46} ry={50} fill="#9DC9E8" {...sk} strokeWidth={5} />
    <path d="M-40 -14 C-40 -62 40 -62 40 -14 Z" fill="#F0A23B" {...sk} strokeWidth={5} />
    <Face x={0} y={8} size={0.6} mood={0.8} />
    <circle cx={0} cy={44} r={24} fill="none" stroke="#fff" strokeWidth={12} />
    <circle cx={0} cy={44} r={24} fill="none" stroke={C.warn} strokeWidth={12} strokeDasharray="19 19" />
    <circle cx={0} cy={44} r={30} fill="none" {...sk} strokeWidth={3} />
  </g>
);

/** liver cells: a grid of round cells; hit 0..1 turns the first cells dark red (attacked) */
export const Cells: React.FC<{ hit?: number; n?: number }> = ({ hit = 0, n = 15 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = ((i % 5) - 2) * 92 + (Math.floor(i / 5) % 2 ? 24 : -24), y = (Math.floor(i / 5) - 1) * 88;
      const bad = hit * n > (i * 7) % n + 0.5;
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r={38} fill={bad ? "#A33A3A" : "#E9A9A0"} {...sk} strokeWidth={4} />
          <circle r={11} fill={bad ? "#5E1E1E" : "#C8776B"} />
          {bad && <path d="M-16 -16 L16 16 M16 -16 L-16 16" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.85} />}
        </g>
      );
    })}
  </g>
);

/** pain "level" gauge made of a body part with a flash; used for the pain/fever signals */
export const Flash: React.FC<{ s?: number; color?: string }> = ({ s = 1, color = "#F7C548" }) => (
  <g transform={`scale(${s})`}><path d="M10 -80 L-40 8 H-4 L-18 80 L44 -14 H6 Z" fill={color} {...sk} /></g>
);

export const Thermo: React.FC<{ level?: number }> = ({ level = 0.8 }) => (
  <g>
    <rect x={-22} y={-150} width={44} height={230} rx={22} fill={C.white} {...sk} />
    <circle cy={110} r={44} fill={C.white} {...sk} />
    <circle cy={110} r={30} fill={C.warn} />
    <rect x={-9} y={80 - level * 200} width={18} height={level * 200 + 30} rx={9} fill={C.warn} />
    {[0, 1, 2, 3].map((i) => (<path key={i} d={`M22 ${-100 + i * 44} h16`} {...sk} strokeWidth={4} />))}
  </g>
);

/** prostaglandin: small orange drop */
export const Drop: React.FC<{ color?: string }> = ({ color = "#F0A23B" }) => (
  <path d="M0 -34 C16 -10 26 6 26 16 C26 32 14 40 0 40 C-14 40 -26 32 -26 16 C-26 6 -16 -10 0 -34 Z" fill={color} {...sk} strokeWidth={5} />
);

/** COX enzyme: a round "factory" mouth that makes prostaglandin drops. blocked 0..1 puts a stop bar on it */
export const Cox: React.FC<{ blocked?: number; chew?: number }> = ({ blocked = 0, chew = 0 }) => (
  <g>
    <path d={`M-120 0 C-120 -90 120 -90 120 0 C120 70 60 110 0 110 C-60 110 -120 70 -120 0 Z`} fill="#CFC6E6" {...sk} />
    <path d={`M-70 20 Q0 ${50 + 22 * Math.sin(chew)} 70 20`} fill="none" {...sk} strokeWidth={8} />
    <Face x={0} y={-24} size={0.9} mood={blocked > 0.5 ? -0.4 : 0.6} />
    {blocked > 0 && (
      <g opacity={blocked} transform="translate(0 122)">
        <rect x={-110} y={-14} width={220} height={28} rx={14} fill={C.warn} {...sk} strokeWidth={5} />
        <path d="M-60 -6 L-40 6 M-20 -6 L0 6 M20 -6 L40 6" stroke="#fff" strokeWidth={6} strokeLinecap="round" />
      </g>
    )}
  </g>
);

/** brain + spinal cord with signal dots; lit 0..1 = pain signal turns down (calm blue) */
export const BrainSpine: React.FC<{ lit?: number; sig?: number }> = ({ lit = 0, sig = 0 }) => (
  <g>
    <path d="M10 70 C-30 150 40 200 0 270 C-30 330 20 380 0 420" fill="none" stroke={C.ink} strokeWidth={34} strokeLinecap="round" />
    <path d="M10 70 C-30 150 40 200 0 270 C-30 330 20 380 0 420" fill="none" stroke="#F3D3A6" strokeWidth={22} strokeLinecap="round" />
    {[0, 1, 2, 3].map((i) => { const y = 120 + i * 80; return (<path key={i} d={`M${i % 2 ? 6 : -4} ${y} h${i % 2 ? 70 : -70}`} {...sk} strokeWidth={5} />); })}
    <g transform="translate(0 0)">
      <path d="M-120 20 C-160 -40 -120 -120 -50 -120 C-20 -160 60 -150 80 -110 C150 -110 170 -20 120 20 C120 80 40 100 0 70 C-40 100 -120 80 -120 20 Z" fill={lit > 0.5 ? "#BFD9EE" : "#F2B8C6"} {...sk} />
      <path d="M0 -130 C-20 -80 20 -40 0 70 M-80 -60 C-50 -40 -60 0 -30 10 M70 -70 C40 -40 60 0 30 20" fill="none" {...sk} strokeWidth={5} />
    </g>
    {sig > 0 && [0, 1, 2].map((i) => (
      <circle key={i} cx={Math.sin((sig * 4 + i) * 1.3) * 8} cy={400 - ((sig * 380 + i * 120) % 380)} r={13} fill={lit > 0.5 ? "#6FA8D6" : C.warn} opacity={0.9} />
    ))}
  </g>
);

/** simple chemist in a white coat holding a flask (a generic cartoon, not a portrait) */
export const Chemist: React.FC<{ flask?: string; mood?: number }> = ({ flask = "#CFE3B8", mood = 0.7 }) => (
  <g>
    <path d="M-70 120 C-70 20 70 20 70 120 Z" fill={C.white} {...sk} />
    <circle cy={-30} r={50} fill={C.skin} {...sk} />
    <Face x={0} y={-28} size={0.8} mood={mood} />
    <path d="M-52 -50 C-40 -92 40 -92 52 -50 C30 -64 -30 -64 -52 -50 Z" fill="#6E5A48" {...sk} strokeWidth={5} />
    <g transform="translate(86 52) rotate(14)">
      <path d="M-14 -50 V-12 L-42 40 C-48 52 -40 60 -28 60 H28 C40 60 48 52 42 40 L14 -12 V-50 Z" fill="#E4EEF3" {...sk} strokeWidth={5} />
      <path d="M-30 26 H30 L38 42 C42 52 36 56 28 56 H-28 C-36 56 -42 52 -38 42 Z" fill={flask} />
    </g>
  </g>
);

/** pharmacist: person with a green cross badge and a white coat */
export const Pharmacist: React.FC = () => (
  <g>
    <path d="M-70 120 C-70 20 70 20 70 120 Z" fill={C.white} {...sk} />
    <circle cy={-30} r={50} fill={C.skin} {...sk} />
    <Face x={0} y={-28} size={0.8} mood={0.4} />
    <rect x={20} y={46} width={34} height={34} rx={6} fill="#7DBB6E" {...sk} strokeWidth={4} />
    <path d="M37 52 V74 M26 63 H48" stroke="#fff" strokeWidth={6} strokeLinecap="round" />
  </g>
);

export const Worm: React.FC<{ wig?: number }> = ({ wig = 0 }) => (
  <g>
    <path d={`M-90 20 C-60 ${-30 + Math.sin(wig) * 14} -30 ${40 - Math.sin(wig) * 14} 0 0 C30 ${-30 + Math.sin(wig) * 14} 60 ${40 - Math.sin(wig) * 14} 90 -10`} fill="none" stroke={C.ink} strokeWidth={30} strokeLinecap="round" />
    <path d={`M-90 20 C-60 ${-30 + Math.sin(wig) * 14} -30 ${40 - Math.sin(wig) * 14} 0 0 C30 ${-30 + Math.sin(wig) * 14} 60 ${40 - Math.sin(wig) * 14} 90 -10`} fill="none" stroke="#E8A7A0" strokeWidth={20} strokeLinecap="round" />
    <circle cx={88} cy={-12} r={4} fill={C.ink} />
  </g>
);

/** lab bottle with a plain label (name written by the caller) */
export const LabBottle: React.FC<{ tint?: string; w?: number; label?: string; dir?: "rtl" | "ltr" }> = ({ tint = "#E4EEF3", w = 1, label, dir = "ltr" }) => (
  <g transform={`scale(${w})`}>
    <rect x={-26} y={-120} width={52} height={36} rx={8} fill="#C9B59D" {...sk} strokeWidth={5} />
    <path d="M-26 -84 H26 C26 -60 70 -50 70 -10 V90 C70 108 60 116 44 116 H-44 C-60 116 -70 108 -70 90 V-10 C-70 -50 -26 -60 -26 -84 Z" fill={tint} {...sk} />
    <rect x={-64} y={-10} width={128} height={64} rx={8} fill={C.paper} {...sk} strokeWidth={4} />
    {label && <Tx y={32} size={19} dir={dir}>{label}</Tx>}
  </g>
);

/** timeline of the story: ticks with years; p 0..1 draws the line, marks 0..n light up */
export const Timeline04: React.FC<{ p?: number; marks?: number[]; years?: string[] }> = ({ p = 1, marks = [1, 1, 1], years = ["1878", "1886", "1948"] }) => (
  <g>
    <path d="M-330 0 H330" stroke={C.ink} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    {years.map((y, i) => {
      const x = -300 + (i * 600) / (years.length - 1), m = marks[i] ?? 0;
      return (
        <g key={y} transform={`translate(${x} 0) scale(${0.4 + 0.6 * m})`} opacity={m}>
          <circle r={26} fill={C.key} {...sk} />
          <Tx y={-52} size={46} dir="ltr">{y}</Tx>
        </g>
      );
    })}
  </g>
);

/** podium with two microphones and a plain banner behind it: «a press conference». No person, no flag, no seal. */
export const Podium: React.FC = () => (
  <g>
    <rect x={-250} y={-150} width={500} height={250} rx={18} fill="#CFE0EE" {...sk} />
    {[-150, -75, 0, 75, 150].map((x) => (<rect key={x} x={x - 14} y={-130} width={28} height={210} rx={6} fill={C.paper} {...sk} strokeWidth={4} />))}
    <path d="M-60 100 L-80 230 H80 L60 100 Z" fill="#C9B59D" {...sk} />
    <rect x={-100} y={60} width={200} height={60} rx={10} fill="#B89B7C" {...sk} />
    {[-40, 40].map((x) => (
      <g key={x}><path d={`M${x} 60 V10`} {...sk} strokeWidth={5} /><circle cx={x} cy={0} r={13} fill={C.ink} /></g>
    ))}
  </g>
);

/** a plain study / paper stack with a magnifier; n = optional big number on the front sheet */
export const Papers: React.FC<{ n?: string; mag?: number }> = ({ n, mag = 0 }) => (
  <g>
    {[0, 1, 2].map((i) => (<rect key={i} x={-90 + i * 14} y={-120 + i * -10} width={170} height={220} rx={12} fill={C.paper} {...sk} strokeWidth={5} />))}
    <path d="M-60 -70 h110 M-60 -40 h110 M-60 -10 h80" {...sk} strokeWidth={5} />
    {n && <Tx x={-5} y={70} size={64} fill={C.key} dir="ltr">{n}</Tx>}
    {mag > 0 && (
      <g opacity={mag} transform="translate(80 70)"><circle r={42} fill="#E4EEF3" opacity={0.85} {...sk} /><path d="M30 30 L70 70" {...sk} strokeWidth={14} /></g>
    )}
  </g>
);

/** two linked people: «siblings» comparison (same family, one took it, one did not) */
export const Siblings: React.FC<{ link?: number }> = ({ link = 1 }) => (
  <g>
    <g transform="translate(-110 0) scale(1.3)"><circle cy={-58} r={30} fill="#F3C79A" {...sk} strokeWidth={5} /><path d="M-50 60 C-50 -6 50 -6 50 60 Z" fill="#F3C79A" {...sk} strokeWidth={5} /></g>
    <g transform="translate(110 0) scale(1.3)"><circle cy={-58} r={30} fill="#B9C7D3" {...sk} strokeWidth={5} /><path d="M-50 60 C-50 -6 50 -6 50 60 Z" fill="#B9C7D3" {...sk} strokeWidth={5} /></g>
    <path d="M-50 20 H50" stroke={C.ink} strokeWidth={8} strokeLinecap="round" strokeDasharray="4 18" opacity={link} />
  </g>
);

/** a crowd of tiny kids: «more than a million and a half children» */
export const KidCrowd: React.FC<{ n?: number }> = ({ n = 24 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = ((i % 8) - 3.5) * 54, y = (Math.floor(i / 8) - 1) * 70, f = ["#F3C79A", "#B9C7D3", "#D6B4D9", "#CFE3B8"][i % 4];
      return (<g key={i} transform={`translate(${x} ${y}) scale(0.5)`}><circle cy={-48} r={26} fill={f} {...sk} strokeWidth={6} /><path d="M-38 40 C-38 -4 38 -4 38 40 Z" fill={f} {...sk} strokeWidth={6} /></g>);
    })}
  </g>
);

/** correlation vs causation: two linked dots, then the arrow that is NOT proven */
export const CorrCause: React.FC<{ corr?: number; cause?: number }> = ({ corr = 1, cause = 0 }) => (
  <g>
    <g opacity={corr}>
      <circle cx={-200} cy={0} r={56} fill="#9DC9E8" {...sk} /><circle cx={200} cy={0} r={56} fill="#F0A23B" {...sk} />
      <path d="M-130 0 H130" stroke={C.ink} strokeWidth={9} strokeLinecap="round" strokeDasharray="2 22" />
    </g>
    {cause > 0 && (
      <g opacity={cause} transform="translate(0 170)">
        <path d="M-200 0 H170" stroke={C.ink} strokeWidth={10} strokeLinecap="round" /><path d="M140 -28 L176 0 L140 28" fill="none" {...sk} strokeWidth={10} />
        <path d="M-40 -46 L40 46 M40 -46 L-40 46" stroke={C.warn} strokeWidth={16} strokeLinecap="round" />
      </g>
    )}
  </g>
);

/** kitchen spoon (the thing you do NOT dose a child with) */
export const Spoon: React.FC = () => (
  <g transform="rotate(-30)">
    <ellipse cx={0} cy={-70} rx={52} ry={66} fill="#D9DDE0" {...sk} />
    <path d="M0 -4 V150" stroke={C.ink} strokeWidth={22} strokeLinecap="round" />
    <path d="M0 -4 V150" stroke="#D9DDE0" strokeWidth={10} strokeLinecap="round" />
  </g>
);

/** simple scale (weight): kid on one side, a bottle on the other, tilt -1..1 */
export const WeightScale: React.FC<{ tilt?: number }> = ({ tilt = 0 }) => (
  <g>
    <path d="M0 -160 V150 M-90 150 H90" {...sk} strokeWidth={10} />
    <g transform={`rotate(${tilt * 8} 0 -150)`}>
      <path d="M-220 -150 H220" {...sk} strokeWidth={10} />
      <path d="M-220 -150 L-260 -40 H-180 Z M220 -150 L180 -40 H260 Z" fill="#E6DCC6" {...sk} strokeWidth={5} />
    </g>
  </g>
);

/** check list line item used by the closing summary */
export const Num: React.FC<{ n: string; fill?: string }> = ({ n, fill = C.key }) => (
  <g><circle r={44} fill={fill} {...sk} /><Tx y={16} size={52} fill="#fff" dir="ltr">{n}</Tx></g>
);
