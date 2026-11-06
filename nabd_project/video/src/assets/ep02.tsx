// Drawings for episode 02 (GLP-1). Same rules: thick even ink lines, flat fills, drawn around (0,0).
// Legal: the injection pen is a generic drawing (no real logo, shape or brand colours); people are neutral,
// never "before/after" bodies.
import React from "react";
import { C, FONT } from "../theme";
import { sk } from "../components/Frame";
import { Face } from "./index";

const T: React.FC<{ x?: number; y?: number; size?: number; fill?: string; dir?: "rtl" | "ltr"; w?: number; children: React.ReactNode }> = ({ x = 0, y = 0, size = 40, fill = C.ink, dir = "rtl", w = 700, children }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={w} fontSize={size} fill={fill} direction={dir} unicodeBidi={dir === "ltr" ? "bidi-override" : undefined}>{children}</text>
);

/** Gila-like lizard (stylised, friendly): beaded orange/brown bands. tongue 0..1, walk = leg phase */
export const Lizard: React.FC<{ tongue?: number; walk?: number; mood?: number }> = ({ tongue = 0, walk = 0, mood = 0.6 }) => {
  const lg = (i: number) => Math.sin(walk + i * Math.PI) * 14;
  const band = "#5A4034", body = "#EDA46A";
  return (
    <g>
      {/* tail */}
      <path d="M150 20 C230 30 290 10 330 -30 C300 40 240 70 150 64 Z" fill={body} {...sk} />
      {/* legs */}
      {[[-110, 1], [-60, 0], [80, 1], [130, 0]].map(([x, p], i) => (
        <path key={i} d={`M${x} 40 l${-10 + lg(p)} 58 h-26`} fill="none" {...sk} strokeWidth={14} stroke={band} />
      ))}
      {/* body */}
      <path d="M-170 -10 C-150 -70 140 -80 170 -10 C180 40 120 72 0 72 C-120 72 -180 40 -170 -10 Z" fill={body} {...sk} />
      {[-110, -40, 30, 100].map((x, i) => (
        <path key={i} d={`M${x} -52 C${x + 20} -20 ${x - 14} 30 ${x + 8} 66`} fill="none" stroke={band} strokeWidth={22} strokeLinecap="round" opacity={0.9} />
      ))}
      {[[-140, 10], [-70, -30], [0, 20], [60, -34], [130, 6], [-20, -50]].map(([x, y], i) => (<circle key={i} cx={x} cy={y} r={7} fill="#F6CFA2" />))}
      {/* head */}
      <path d="M-160 -30 C-230 -60 -300 -30 -300 4 C-300 36 -240 48 -170 34 Z" fill={body} {...sk} />
      <circle cx={-246} cy={-14} r={7} fill={C.ink} />
      <path d={`M-290 18 Q-262 ${18 + 10 * mood} -236 22`} fill="none" {...sk} strokeWidth={4} />
      {tongue > 0 && <path d={`M-298 10 h${-46 * tongue} m0 0 l-12 -8 m12 8 l-12 8`} fill="none" stroke="#D9483B" strokeWidth={6} strokeLinecap="round" />}
    </g>
  );
};

/** empty plate (top view) with fork */
export const Plate: React.FC<{ food?: number }> = ({ food = 0 }) => (
  <g>
    <ellipse rx={190} ry={120} fill={C.paper} {...sk} />
    <ellipse rx={130} ry={78} fill="none" {...sk} strokeWidth={4} stroke="#CDBFA8" />
    {food > 0 && (
      <g opacity={food}>
        <circle cx={-50} cy={-6} r={42} fill="#E7A45A" {...sk} />
        <circle cx={40} cy={10} r={34} fill="#9CC48A" {...sk} />
        <ellipse cx={0} cy={44} rx={52} ry={22} fill="#F1E3BC" {...sk} />
      </g>
    )}
    <path d="M230 -90 V100 M214 -90 V-30 M246 -90 V-30 M214 -30 C214 -10 246 -10 246 -30" fill="none" {...sk} strokeWidth={8} />
  </g>
);

/** fullness gauge: v 0 (hungry) .. 1 (full) */
export const Gauge: React.FC<{ v: number; label?: string }> = ({ v, label = "شبع" }) => {
  const a = Math.PI * (1 - Math.max(0, Math.min(1, v)));
  return (
    <g>
      <path d="M-150 0 A150 150 0 0 1 150 0 Z" fill={C.paper} {...sk} />
      <path d="M-120 0 A120 120 0 0 1 -60 -104" fill="none" stroke="#E8B0A4" strokeWidth={22} />
      <path d="M-60 -104 A120 120 0 0 1 60 -104" fill="none" stroke="#F3D79A" strokeWidth={22} />
      <path d="M60 -104 A120 120 0 0 1 120 0" fill="none" stroke="#B9D8A8" strokeWidth={22} />
      <path d={`M0 0 L${Math.cos(a) * 110} ${-Math.sin(a) * 110}`} {...sk} strokeWidth={10} stroke={C.ink} />
      <circle r={16} fill={C.ink} />
      <T y={60} size={40}>{label}</T>
    </g>
  );
};

/** balance scale; tilt -1..1 (positive = right pan down) */
export const Balance: React.FC<{ tilt?: number; left?: React.ReactNode; right?: React.ReactNode }> = ({ tilt = 0, left, right }) => {
  const a = tilt * 12, rad = (a * Math.PI) / 180, dx = Math.cos(rad) * 230, dy = Math.sin(rad) * 230;
  return (
    <g>
      <path d="M0 -150 V200 M-110 200 H110" {...sk} strokeWidth={14} />
      <circle cy={-150} r={18} fill={C.key} {...sk} />
      <path d={`M${-dx} ${-150 - dy} L${dx} ${-150 + dy}`} {...sk} strokeWidth={12} />
      {[[-dx, -150 - dy, left], [dx, -150 + dy, right]].map(([x, y, n], i) => (
        <g key={i} transform={`translate(${x as number} ${y as number})`}>
          <path d="M0 0 L-80 110 M0 0 L80 110" {...sk} strokeWidth={5} />
          <path d="M-110 110 H110 C100 150 -100 150 -110 110 Z" fill="#E8D4B4" {...sk} />
          <g transform="translate(0 70)">{n as React.ReactNode}</g>
        </g>
      ))}
    </g>
  );
};

/** word chip on a rounded card */
export const Chip: React.FC<{ text: string; w?: number; fill?: string; color?: string; size?: number; dir?: "rtl" | "ltr" }> = ({ text, w = 220, fill = C.card, color = C.ink, size = 44, dir = "rtl" }) => (
  <g>
    <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.7} rx={size * 0.5} fill={fill} {...sk} />
    <T y={size * 0.32} size={size} fill={color} dir={dir}>{text}</T>
  </g>
);

/** neutral body outline with brain / stomach / pancreas points. lit = [brain, stomach, pancreas] 0..1 */
export const BodyMap: React.FC<{ lit?: number[] }> = ({ lit = [0, 0, 0] }) => (
  <g>
    <circle cy={-300} r={110} fill="#F3E3D2" {...sk} />
    <path d="M-170 380 C-190 80 -150 -150 0 -170 C150 -150 190 80 170 380 Z" fill="#F3E3D2" {...sk} />
    {[[0, -320, "#F2B8C6"], [-40, 40, "#F3C79A"], [40, 130, "#E8D08A"]].map(([x, y, col], i) => (
      <g key={i}>
        {lit[i] > 0 && <circle cx={x as number} cy={y as number} r={40 + 50 * (lit[i] as number)} fill={C.key} opacity={0.18 * (lit[i] as number)} />}
        <circle cx={x as number} cy={y as number} r={30} fill={lit[i] > 0.3 ? (col as string) : C.paper} {...sk} strokeWidth={5} />
      </g>
    ))}
  </g>
);

export const Brain: React.FC = () => (
  <g>
    <path d="M-120 20 C-160 -40 -120 -120 -50 -120 C-20 -160 60 -150 80 -110 C150 -110 170 -20 120 20 C120 80 40 100 0 70 C-40 100 -120 80 -120 20 Z" fill="#F2B8C6" {...sk} />
    <path d="M0 -130 C-20 -80 20 -40 0 70 M-80 -60 C-50 -40 -60 0 -30 10 M70 -70 C40 -40 60 0 30 20" fill="none" {...sk} strokeWidth={5} />
  </g>
);
export const Stomach: React.FC = () => (
  <g>
    <path d="M40 -150 C40 -100 60 -60 100 -30 C150 10 140 110 60 130 C-20 150 -120 110 -130 40 C-140 -20 -90 -40 -50 -20 C-10 0 0 -60 -10 -150 Z" fill="#F3C79A" {...sk} />
    <path d="M-60 60 C-20 90 40 80 70 40" fill="none" {...sk} strokeWidth={5} opacity={0.6} />
  </g>
);
export const Pancreas: React.FC = () => (
  <g>
    <path d="M-170 10 C-170 -40 -100 -50 -40 -30 C20 -10 80 -60 140 -50 C190 -40 190 20 150 30 C80 50 20 40 -40 50 C-100 60 -170 60 -170 10 Z" fill="#E8D08A" {...sk} />
    {[[-110, 10], [-40, 10], [40, -4], [110, -10]].map(([x, y], i) => (<circle key={i} cx={x} cy={y} r={8} fill="#C9A955" />))}
  </g>
);
export const Gallbladder: React.FC = () => (
  <g>
    <path d="M-20 -110 C40 -110 70 -40 60 30 C50 100 -60 110 -70 40 C-80 -30 -60 -110 -20 -110 Z" fill="#B9D27F" {...sk} />
    <path d="M-20 -110 C-30 -150 -10 -170 20 -180" fill="none" {...sk} strokeWidth={10} />
  </g>
);
/** thyroid (butterfly shape, front of the neck) */
export const Thyroid: React.FC = () => (
  <g>
    <path d="M-10 0 C-40 -110 -150 -100 -150 0 C-150 100 -40 110 -10 40 Z" fill="#E9A3A0" {...sk} />
    <path d="M10 0 C40 -110 150 -100 150 0 C150 100 40 110 10 40 Z" fill="#E9A3A0" {...sk} />
    <rect x={-30} y={-10} width={60} height={50} rx={20} fill="#E9A3A0" {...sk} />
  </g>
);

/** hormone molecule: bead chain; label below. color for the "copy" */
export const Molecule: React.FC<{ label?: string; color?: string; n?: number; fade?: number; dir?: "rtl" | "ltr" }> = ({ label, color = "#F0A23B", n = 7, fade = 0, dir = "ltr" }) => (
  <g opacity={1 - fade}>
    <path d={Array.from({ length: n }).map((_, i) => `${i ? "L" : "M"}${-150 + i * 50} ${i % 2 ? -26 : 26}`).join(" ")} fill="none" {...sk} strokeWidth={8} />
    {Array.from({ length: n }).map((_, i) => (<circle key={i} cx={-150 + i * 50} cy={i % 2 ? -26 : 26} r={24} fill={i % 3 === 1 ? C.paper : color} {...sk} strokeWidth={5} />))}
    {label && <T y={110} size={50} dir={dir}>{label}</T>}
  </g>
);

/** stopwatch with a caption inside; a = hand angle (deg) */
export const Stopwatch: React.FC<{ a?: number; text?: string; fill?: string }> = ({ a = 0, text, fill = C.paper }) => (
  <g>
    <rect x={-24} y={-170} width={48} height={34} rx={8} fill={C.ink} />
    <circle r={140} fill={fill} {...sk} />
    <g transform={`rotate(${a})`}><path d="M0 0 V-100" {...sk} strokeWidth={10} stroke={C.key} /></g>
    <circle r={12} fill={C.ink} />
    {text && <T y={80} size={40}>{text}</T>}
  </g>
);

/** generic injection pen (no brand): grey body, cream cap, window, dose knob; label = plain text on a sticker */
export const InjPen: React.FC<{ label?: string; capOff?: number; xray?: number; xrayText?: string; tint?: string }> = ({ label, capOff = 0, xray = 0, xrayText = "إنسولين", tint = "#D8D2C6" }) => (
  <g>
    <rect x={-300} y={-46} width={520} height={92} rx={40} fill={tint} {...sk} />
    <rect x={220} y={-28} width={70} height={56} rx={16} fill="#8A8F98" {...sk} />
    <rect x={-80} y={-26} width={170} height={52} rx={14} fill={C.paper} {...sk} strokeWidth={5} />
    <g transform={`translate(${-60 * capOff} 0)`} opacity={1 - capOff * 0.7}>
      <rect x={-420} y={-50} width={150} height={100} rx={40} fill="#F1E8D8" {...sk} />
    </g>
    {label && <T x={5} y={14} size={34}>{label}</T>}
    {xray > 0 && (
      <g opacity={xray}>
        <rect x={-290} y={-36} width={500} height={72} rx={30} fill="#2F3A4A" opacity={0.92} />
        <rect x={-200} y={-22} width={300} height={44} rx={16} fill="#BFE3F4" stroke="#fff" strokeWidth={4} />
        <T x={-50} y={12} size={32} fill={C.ink}>{xrayText}</T>
      </g>
    )}
  </g>
);

/** heart (organ, friendly) */
export const Heart: React.FC<{ beat?: number; mood?: number }> = ({ beat = 0, mood = 0.6 }) => (
  <g transform={`scale(${1 + 0.06 * beat})`}>
    <path d="M0 140 C-120 60 -190 -10 -170 -90 C-150 -170 -50 -170 0 -100 C50 -170 150 -170 170 -90 C190 -10 120 60 0 140 Z" fill="#E86A5E" {...sk} />
    <Face x={0} y={-30} size={1.1} mood={mood} />
  </g>
);

/** tiny person icon (neutral) */
export const Person: React.FC<{ fill?: string }> = ({ fill = "#B9C7D3" }) => (
  <g>
    <circle cy={-58} r={30} fill={fill} {...sk} strokeWidth={5} />
    <path d="M-50 60 C-50 -6 50 -6 50 60 Z" fill={fill} {...sk} strokeWidth={5} />
  </g>
);

/** factory with a coin: "funded by the companies" */
export const Factory: React.FC<{ coin?: number }> = ({ coin = 0 }) => (
  <g>
    <path d="M-220 120 V-80 L-80 0 V-80 L60 0 V-160 H180 V120 Z" fill={C.iconBg} {...sk} />
    <rect x={-240} y={120} width={440} height={30} rx={12} fill={C.ink} />
    {coin > 0 && (
      <g transform={`translate(160 ${-230 - 30 * coin}) scale(${coin})`}>
        <circle r={60} fill="#F2C94C" {...sk} />
        <T y={20} size={60} dir="ltr">$</T>
      </g>
    )}
  </g>
);

/** dot cloud with an average line ("متوسط مش وعد") */
export const Spread: React.FC<{ p?: number }> = ({ p = 1 }) => {
  const ys = [-70, 40, -20, 80, -100, 10, 60, -50, 30, -80, 90, -10];
  return (
    <g>
      <rect x={-300} y={-160} width={600} height={320} rx={24} fill={C.paper} {...sk} />
      {ys.map((y, i) => (<circle key={i} cx={-250 + i * 45} cy={y} r={14 * Math.min(1, Math.max(0, p * 12 - i))} fill="#9DB4C9" {...sk} strokeWidth={4} />))}
      <path d="M-270 0 H270" {...sk} stroke={C.key} strokeWidth={8} strokeDasharray="20 16" opacity={p} />
    </g>
  );
};

/** weight curve: drop then regain (2/3). p 0..1 draws it */
export const RegainChart: React.FC<{ p: number; mark?: number }> = ({ p, mark = 0 }) => (
  <g>
    <rect x={-360} y={-230} width={720} height={460} rx={28} fill={C.paper} {...sk} />
    <path d="M-300 -170 V170 H310" fill="none" {...sk} strokeWidth={5} />
    <path d="M-290 -120 C-180 -110 -120 120 -20 130 C60 136 120 -10 290 -30" fill="none" stroke={C.key} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    <path d="M-20 130 V-120" {...sk} strokeWidth={4} strokeDasharray="12 12" opacity={0.6 * Math.min(1, p * 2)} />
    <T x={-160} y={210} size={32} fill={C.source}>حقن</T>
    <T x={150} y={210} size={32} fill={C.source}>بعد الوقف</T>
    {mark > 0 && (
      <g opacity={mark}>
        <path d="M290 -30 V-120 M290 -30 V130" fill="none" stroke={C.warn} strokeWidth={6} strokeDasharray="10 10" />
        <rect x={150} y={-120} width={130} height={80} rx={20} fill={C.warn} {...sk} />
        <T x={215} y={-66} size={44} fill="#fff" dir="ltr">⅔</T>
      </g>
    )}
  </g>
);

/** flexed arm (muscle) */
export const Muscle: React.FC = () => (
  <g>
    <path d="M-150 80 C-160 0 -120 -40 -60 -40 L-20 -150 C0 -190 60 -180 60 -130 L30 -40 C120 -60 170 0 150 70 C130 130 -100 140 -150 80 Z" fill="#E7B79C" {...sk} />
    <path d="M-40 10 C0 -30 60 -20 90 20" fill="none" {...sk} strokeWidth={5} />
  </g>
);
/** fat drop */
export const FatDrop: React.FC = () => (
  <g>
    <path d="M0 -150 C60 -60 120 0 120 60 C120 130 60 160 0 160 C-60 160 -120 130 -120 60 C-120 0 -60 -60 0 -150 Z" fill="#F3D79A" {...sk} />
    <circle cx={-40} cy={60} r={18} fill="#fff" opacity={0.7} />
  </g>
);

/** queasy face (nausea), respectful */
export const Queasy: React.FC = () => (
  <g>
    <circle r={110} fill="#CFE3B8" {...sk} />
    <circle cx={-36} cy={-20} r={9} fill={C.ink} /><circle cx={36} cy={-20} r={9} fill={C.ink} />
    <path d="M-40 40 C-20 25 0 55 20 38 C30 30 40 40 44 44" fill="none" {...sk} strokeWidth={6} />
    <path d="M70 -70 c10 20 10 40 0 50" fill="none" {...sk} strokeWidth={5} stroke="#7FB0D9" />
  </g>
);

/** pregnancy icon (neutral silhouette) */
export const Pregnant: React.FC = () => (
  <g>
    <circle cy={-130} r={50} fill="#D6B4D9" {...sk} />
    <path d="M-60 170 C-70 40 -60 -60 0 -70 C50 -70 60 -20 60 10 C120 20 130 120 60 130 L60 170 Z" fill="#D6B4D9" {...sk} />
  </g>
);

/** family tree: three linked person icons */
export const Family: React.FC = () => (
  <g>
    <path d="M-150 -60 H150 M0 -60 V40" {...sk} strokeWidth={5} />
    <g transform="translate(-150 -100) scale(0.7)"><Person fill="#B9C7D3" /></g>
    <g transform="translate(150 -100) scale(0.7)"><Person fill="#D6B4D9" /></g>
    <g transform="translate(0 90) scale(0.7)"><Person fill="#F3C79A" /></g>
  </g>
);

/** red round X / green check badges */
export const XMark: React.FC<{ p?: number }> = ({ p = 1 }) => (
  <g>
    <circle r={60} fill={C.warn} {...sk} />
    <path d="M-26 -26 L26 26 M26 -26 L-26 26" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
  </g>
);
export const OkMark: React.FC<{ p?: number }> = ({ p = 1 }) => (
  <g>
    <circle r={60} fill="#5FAF68" {...sk} />
    <path d="M-28 2 L-8 24 L30 -22" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
  </g>
);

/** nutrition icons */
export const Protein: React.FC = () => (
  <g>
    <ellipse cx={-50} cy={10} rx={70} ry={92} fill={C.paper} {...sk} />
    <path d="M30 60 C10 0 40 -80 110 -80 C170 -80 180 0 130 40 C100 64 60 80 30 60 Z" fill="#D99A5B" {...sk} />
    <path d="M30 60 L0 100" {...sk} strokeWidth={18} stroke={C.paper} /><path d="M30 60 L0 100" fill="none" {...sk} />
  </g>
);
export const ColorPlate: React.FC = () => (
  <g>
    <circle r={140} fill={C.paper} {...sk} />
    <path d="M0 0 L0 -110 A110 110 0 0 1 95 55 Z" fill="#9CC48A" {...sk} strokeWidth={5} />
    <path d="M0 0 L95 55 A110 110 0 0 1 -95 55 Z" fill="#E7A45A" {...sk} strokeWidth={5} />
    <path d="M0 0 L-95 55 A110 110 0 0 1 0 -110 Z" fill="#E86A5E" {...sk} strokeWidth={5} />
  </g>
);
export const WaterGlass: React.FC<{ level?: number }> = ({ level = 0.75 }) => (
  <g>
    <clipPath id="glassClip"><path d="M-80 -130 L-60 130 H60 L80 -130 Z" /></clipPath>
    <rect x={-90} y={130 - 260 * level} width={180} height={260} fill="#9DC9E8" clipPath="url(#glassClip)" />
    <path d="M-80 -130 L-60 130 H60 L80 -130" fill="none" {...sk} />
  </g>
);
export const SmallPlate: React.FC = () => (
  <g>
    <ellipse rx={110} ry={70} fill={C.paper} {...sk} />
    <circle cx={-20} cy={-4} r={24} fill="#9CC48A" {...sk} strokeWidth={4} />
    <circle cx={26} cy={6} r={20} fill="#E7A45A" {...sk} strokeWidth={4} />
  </g>
);

/** map pin with a place name */
export const MapPin: React.FC<{ name: string }> = ({ name }) => (
  <g>
    <ellipse cy={150} rx={120} ry={30} fill="#D9CBB2" />
    <path d="M0 150 C-40 80 -110 20 -110 -50 C-110 -120 -55 -160 0 -160 C55 -160 110 -120 110 -50 C110 20 40 80 0 150 Z" fill={C.warn} {...sk} />
    <circle cy={-50} r={40} fill={C.paper} {...sk} />
    <g transform="translate(0 250)"><Chip text={name} w={260} size={50} /></g>
  </g>
);

/** blood-sugar curve falling suddenly; p draws */
export const SugarDrop: React.FC<{ p: number }> = ({ p }) => (
  <g>
    <rect x={-330} y={-200} width={660} height={400} rx={28} fill={C.paper} {...sk} />
    <path d="M-280 -60 H-120 C-60 -60 -40 150 60 150 H280" fill="none" stroke={C.warn} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    <path d="M-280 40 H280" {...sk} strokeWidth={4} strokeDasharray="14 12" opacity={0.5} />
    <path d="M-200 -170 C-180 -140 -160 -120 -160 -100 C-160 -80 -180 -70 -200 -70 C-220 -70 -240 -80 -240 -100 C-240 -120 -220 -140 -200 -170 Z" fill="#E86A5E" {...sk} strokeWidth={5} />
    <T x={-80} y={-110} size={36}>السكر</T>
  </g>
);

export const Hospital: React.FC = () => (
  <g>
    <rect x={-220} y={-180} width={440} height={330} rx={16} fill={C.paper} {...sk} />
    <rect x={-60} y={-260} width={120} height={120} rx={20} fill={C.paper} {...sk} />
    <path d="M0 -236 V-164 M-36 -200 H36" {...sk} stroke={C.warn} strokeWidth={18} />
    {[-150, -50, 50, 150].map((x, i) => (<rect key={i} x={x - 30} y={-110} width={60} height={60} rx={8} fill={C.iconBg} {...sk} strokeWidth={4} />))}
    <rect x={-50} y={40} width={100} height={110} rx={10} fill="#C9B59D" {...sk} strokeWidth={4} />
  </g>
);

/** licensed pharmacy: shopfront with a green cross + check badge */
export const Pharmacy: React.FC<{ ok?: number }> = ({ ok = 0 }) => (
  <g>
    <rect x={-210} y={-120} width={420} height={260} rx={16} fill={C.paper} {...sk} />
    <path d="M-230 -120 L-200 -190 H200 L230 -120 Z" fill="#9CC48A" {...sk} />
    <g transform="translate(0 -20)"><rect x={-50} y={-50} width={100} height={100} rx={18} fill={C.paper} {...sk} /><path d="M0 -30 V30 M-30 0 H30" {...sk} stroke="#3FA34D" strokeWidth={16} /></g>
    <rect x={-150} y={60} width={300} height={80} rx={10} fill={C.iconBg} {...sk} strokeWidth={4} />
    {ok > 0 && <g transform={`translate(190 -170) scale(${0.8 * ok})`}><OkMark /></g>}
  </g>
);

/** price tag */
export const PriceTag: React.FC<{ text?: string }> = ({ text = "؟" }) => (
  <g>
    <path d="M-110 -50 H60 L120 0 L60 50 H-110 Z" fill="#F2C94C" {...sk} />
    <circle cx={60} cy={0} r={10} fill={C.paper} {...sk} strokeWidth={4} />
    <T x={-30} y={16} size={50}>{text}</T>
  </g>
);

/** stamp «مغشوش» */
export const Stamp: React.FC<{ text: string; p?: number }> = ({ text, p = 1 }) => (
  <g transform={`rotate(-12) scale(${1.4 - 0.4 * p})`} opacity={p}>
    <rect x={-170} y={-60} width={340} height={120} rx={18} fill="none" stroke={C.warn} strokeWidth={10} />
    <T y={22} size={64} fill={C.warn}>{text}</T>
  </g>
);

/** phone with a share arrow */
export const Phone: React.FC<{ send?: number }> = ({ send = 0 }) => (
  <g>
    <rect x={-110} y={-200} width={220} height={400} rx={36} fill={C.ink} />
    <rect x={-92} y={-170} width={184} height={330} rx={16} fill={C.iconBg} />
    <path d="M-50 -20 L20 -70 V-40 C60 -40 70 0 70 40 C50 10 40 0 20 0 V30 Z" fill={C.key} {...sk} strokeWidth={5} />
    {send > 0 && <g transform={`translate(${160 + 160 * send} ${-140 - 60 * send}) rotate(-20)`} opacity={1 - Math.max(0, send - 0.8) * 5}><path d="M-40 -20 L40 0 L-40 20 L-24 0 Z" fill={C.key} {...sk} strokeWidth={4} /></g>}
  </g>
);

/** small door (the lizard "opened the door") */
export const DoorOpen: React.FC<{ open?: number }> = ({ open = 0 }) => (
  <g>
    <rect x={-130} y={-230} width={260} height={460} rx={10} fill="#FFF3CF" {...sk} />
    <path d={`M-130 -230 L${-130 + 260 * (1 - open * 0.75)} ${-230 + 40 * open} V${230 - 40 * open} L-130 230 Z`} fill="#C9A27A" {...sk} />
    <circle cx={-130 + 260 * (1 - open * 0.75) - 30} cy={0} r={12} fill={C.ink} />
  </g>
);

/** week strip: 7 days, one marked */
export const WeekStrip: React.FC<{ p?: number; mark?: number }> = ({ p = 1, mark = 0 }) => (
  <g>
    {Array.from({ length: 7 }).map((_, i) => {
      const x = 270 - i * 90; const on = Math.max(0, Math.min(1, p * 7 - i));
      return (
        <g key={i} transform={`translate(${x} 0) scale(${on})`}>
          <rect x={-38} y={-50} width={76} height={100} rx={14} fill={i === 0 && mark > 0 ? C.key : C.paper} {...sk} strokeWidth={5} />
          {i === 0 && mark > 0 && <path d="M-14 0 L14 0 M0 -14 V14" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={mark} />}
        </g>
      );
    })}
  </g>
);
