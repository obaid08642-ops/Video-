// Drawings for episode 03 (nasal sprays). Same rules: thick even ink lines, flat fills, drawn around (0,0).
// Legal: every spray / box is generic (no real logo, shape or brand colours); the historical ad has no product name.
import React from "react";
import { C, FONT } from "../theme";
import { sk } from "../components/Frame";
import { Face } from "./index";

const T: React.FC<{ x?: number; y?: number; size?: number; fill?: string; dir?: "rtl" | "ltr"; w?: number; children: React.ReactNode; family?: string }> = ({ x = 0, y = 0, size = 40, fill = C.ink, dir = "rtl", w = 700, children, family = FONT }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={family} fontWeight={w} fontSize={size} fill={fill} direction={dir} unicodeBidi={dir === "ltr" ? "bidi-override" : undefined}>{children}</text>
);

/** old newspaper-style ad (yellowed paper), generic powder box, "1890s". stamp 0..1 shows the red "Cocaine" */
export const VintageAd: React.FC<{ stamp?: number; stampText?: string }> = ({ stamp = 0, stampText = "Cocaine" }) => (
  <g>
    <rect x={-300} y={-380} width={600} height={760} rx={10} fill="#F1DFAE" {...sk} />
    <rect x={-270} y={-350} width={540} height={700} rx={4} fill="none" stroke="#8A6E3B" strokeWidth={4} strokeDasharray="2 10" />
    <T y={-270} size={52} fill="#5A4426" dir="ltr" family="Georgia, serif">CATARRH</T>
    <T y={-215} size={34} fill="#5A4426" dir="ltr" family="Georgia, serif">POWDER · 1890s</T>
    <path d="M-200 -185 H200" stroke="#8A6E3B" strokeWidth={4} />
    {/* generic round powder box */}
    <g transform="translate(0 20)">
      <ellipse cy={-90} rx={150} ry={40} fill="#E9D7A6" {...sk} />
      <path d="M-150 -90 V60 C-150 110 150 110 150 60 V-90" fill="#D9BE84" {...sk} />
      <ellipse cy={-90} rx={150} ry={40} fill="#F6EBCB" {...sk} />
      <rect x={-110} y={-30} width={220} height={70} rx={8} fill="#F6EBCB" {...sk} strokeWidth={4} />
      <T y={14} size={30} fill="#5A4426" dir="ltr" family="Georgia, serif">Remedy</T>
    </g>
    <T y={230} size={30} fill="#5A4426" dir="ltr" family="Georgia, serif">2 – 10 times a day</T>
    {stamp > 0 && (
      <g transform={`rotate(-14) scale(${1.4 - 0.4 * stamp})`} opacity={stamp}>
        <rect x={-220} y={-75} width={440} height={150} rx={20} fill="none" stroke={C.warn} strokeWidth={12} />
        <T y={28} size={86} fill={C.warn} dir="ltr">{stampText}</T>
      </g>
    )}
  </g>
);

/** generic nasal spray bottle; color = body, label = Arabic type name */
export const Spray: React.FC<{ color?: string; label?: string; puff?: number }> = ({ color = "#9DC9E8", label, puff = 0 }) => (
  <g>
    {puff > 0 && (
      <g opacity={1 - puff} transform={`translate(0 ${-250 - 60 * puff})`}>
        {[-30, 0, 30, -15, 15].map((x, i) => (<circle key={i} cx={x * (1 + puff)} cy={-i * 8 * puff} r={10 + 8 * puff} fill="#E4EEF3" stroke={C.ink} strokeWidth={3} />))}
      </g>
    )}
    <path d="M-16 -250 C-16 -270 16 -270 16 -250 L22 -170 H-22 Z" fill={C.paper} {...sk} />
    <rect x={-60} y={-170} width={120} height={34} rx={10} fill={C.paper} {...sk} />
    <rect x={-80} y={-136} width={160} height={290} rx={40} fill={color} {...sk} />
    {label && (
      <g>
        <rect x={-74} y={-40} width={148} height={84} rx={14} fill={C.paper} {...sk} strokeWidth={4} />
        {label.length > 10 && label.includes(" ")
          ? label.split(" ").map((part, i, arr) => (<T key={i} y={-6 + i * 30 - (arr.length - 2) * 15} size={26}>{part}</T>))
          : <T y={label.length > 6 ? 10 : 14} size={label.length > 8 ? 22 : label.length > 5 ? 28 : 34}>{label}</T>}
      </g>
    )}
  </g>
);

/** nose cross-section seen from the front: two airways, turbinates swell (0..1) left / right */
export const NoseSection: React.FC<{ l?: number; r?: number }> = ({ l = 0.3, r = 0.3 }) => {
  const turb = (x: number, s: number, side: 1 | -1) => (
    <g key={`${x}${side}`}>
      {[-120, 0, 120].map((y, i) => (
        <ellipse key={i} cx={x + side * (10 + 30 * s)} cy={y} rx={30 + 45 * s} ry={34 + 6 * s} fill={s > 0.6 ? "#E9958A" : "#F2B8AC"} {...sk} strokeWidth={5} />
      ))}
    </g>
  );
  return (
    <g>
      <path d="M-300 -260 C-300 -330 300 -330 300 -260 V230 C300 290 -300 290 -300 230 Z" fill="#F7DCCB" {...sk} />
      <path d="M-260 -230 V210 H-30 V-230 Z M30 -230 V210 H260 V-230 Z" fill="#FBEFE6" {...sk} />
      <rect x={-30} y={-250} width={60} height={480} rx={20} fill="#F2C3B2" {...sk} />
      {turb(-260, l, 1)}
      {turb(260, r, -1)}
    </g>
  );
};

/** pollen grain */
export const Pollen: React.FC = () => (
  <g>
    <circle r={80} fill="#F2C94C" {...sk} />
    {Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2; return <circle key={i} cx={Math.cos(a) * 80} cy={Math.sin(a) * 80} r={14} fill="#F2C94C" {...sk} strokeWidth={4} />; })}
    <Face y={6} size={0.9} mood={0.4} />
  </g>
);

/** face with sinus pressure marks */
export const SinusFace: React.FC = () => (
  <g>
    <circle r={120} fill={C.skin} {...sk} />
    <Face y={10} size={1.1} mood={-0.6} brows={1} />
    {[-55, 55].map((x, i) => (<ellipse key={i} cx={x} cy={44} rx={26} ry={18} fill="#E9958A" opacity={0.8} />))}
    <path d="M-150 -20 l-30 -10 M-150 20 l-34 0 M150 -20 l30 -10 M150 20 l34 0" {...sk} strokeWidth={6} stroke={C.warn} />
  </g>
);

/** deviated septum (front view, one airway narrowed) */
export const Septum: React.FC = () => (
  <g>
    <path d="M-150 -150 C-150 -200 150 -200 150 -150 V140 C150 180 -150 180 -150 140 Z" fill="#F7DCCB" {...sk} />
    <path d="M0 -170 C60 -100 -10 -20 50 60 C80 100 20 140 0 170" fill="none" {...sk} strokeWidth={22} stroke="#F2C3B2" />
    <path d="M0 -170 C60 -100 -10 -20 50 60 C80 100 20 140 0 170" fill="none" {...sk} />
  </g>
);

/** nasal polyps: little drops inside an airway */
export const Polyps: React.FC = () => (
  <g>
    <path d="M-150 -150 C-150 -200 150 -200 150 -150 V140 C150 180 -150 180 -150 140 Z" fill="#FBEFE6" {...sk} />
    {[[-60, -60], [30, 0], [-30, 70], [60, -90]].map(([x, y], i) => (<path key={i} d={`M${x} ${y - 50} C${x + 40} ${y - 30} ${x + 45} ${y + 30} ${x} ${y + 40} C${x - 45} ${y + 30} ${x - 40} ${y - 30} ${x} ${y - 50} Z`} fill="#E8D08A" {...sk} strokeWidth={5} />))}
  </g>
);

/** Ahmed: friendly young man, optional spray in hand */
export const Ahmed: React.FC<{ mood?: number; spray?: boolean; stuffy?: number }> = ({ mood = 0.5, spray = false, stuffy = 0 }) => (
  <g>
    <path d="M-150 330 C-150 150 -110 90 0 90 C110 90 150 150 150 330 Z" fill="#9DB4C9" {...sk} />
    <circle cx={0} cy={-10} r={100} fill={C.skin} {...sk} />
    <path d="M-100 -30 C-110 -120 110 -130 100 -30 C60 -70 -40 -90 -100 -30 Z" fill="#3B2E28" {...sk} strokeWidth={5} />
    <Face x={0} y={2} size={1.1} mood={mood} brows={stuffy > 0.5 ? 1 : 0} />
    {stuffy > 0 && <ellipse cx={0} cy={22} rx={16} ry={12} fill="#E9958A" opacity={stuffy} />}
    {spray && <g transform="translate(150 60) scale(0.45) rotate(-20)"><Spray color="#CFC6E6" /></g>}
  </g>
);

/** tap with a drop */
export const Tap: React.FC = () => (
  <g>
    <rect x={-160} y={-120} width={200} height={60} rx={20} fill="#B9C3CC" {...sk} />
    <path d="M20 -90 H90 C130 -90 140 -60 140 -20 V20 H100 V-20 C100 -40 90 -50 70 -50 H20 Z" fill="#B9C3CC" {...sk} />
    <rect x={-80} y={-170} width={40} height={50} rx={8} fill="#8A8F98" {...sk} />
    <path d="M120 60 C135 85 140 95 140 105 C140 120 130 128 120 128 C110 128 100 120 100 105 C100 95 105 85 120 60 Z" fill="#9DC9E8" {...sk} strokeWidth={4} />
  </g>
);

/** sterile water bottle */
export const SterileBottle: React.FC = () => (
  <g>
    <rect x={-30} y={-210} width={60} height={40} rx={8} fill="#5FAF68" {...sk} />
    <path d="M-30 -170 H30 V-140 C80 -120 90 -90 90 -50 V170 C90 190 75 200 55 200 H-55 C-75 200 -90 190 -90 170 V-50 C-90 -90 -80 -120 -30 -140 Z" fill="#E4EEF3" {...sk} />
    <rect x={-80} y={0} width={160} height={90} rx={14} fill={C.paper} {...sk} strokeWidth={4} />
    <T y={56} size={34}>معقمة</T>
  </g>
);

/** Egyptian kanaka (coffee pot) boiling */
export const Kanaka: React.FC<{ f?: number }> = ({ f = 0 }) => (
  <g>
    {[0, 1, 2].map((i) => (<path key={i} d={`M${-40 + i * 40} -120 c-10 -20 10 -30 0 -50 c-10 -20 10 -30 0 -50`} fill="none" stroke="#C9C4BC" strokeWidth={6} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(f / 8 + i)} />))}
    <path d="M-90 -100 H90 L120 100 C120 130 -120 130 -120 100 Z" fill="#C9A27A" {...sk} />
    <path d="M-90 -100 L-130 -120" {...sk} strokeWidth={10} />
    <path d="M100 -40 H230" {...sk} strokeWidth={22} stroke="#5A4034" /><path d="M100 -40 H230" fill="none" {...sk} />
    {[-50, 0, 50].map((x, i) => (<circle key={i} cx={x} cy={-96 - 6 * Math.abs(Math.sin(f / 5 + i))} r={9} fill="#E4EEF3" stroke={C.ink} strokeWidth={3} />))}
  </g>
);

/** head in profile with the spray direction (toward the ear ✓ / toward the middle ✗) */
export const HeadProfile: React.FC<{ good?: number; bad?: number }> = ({ good = 0, bad = 0 }) => (
  <g>
    <path d="M-160 -200 C-60 -280 140 -240 160 -80 C170 0 150 40 190 80 C200 100 170 110 160 110 C170 150 140 170 120 170 C120 220 80 240 0 240 V330 H-170 V160 C-230 100 -250 -100 -160 -200 Z" fill={C.skin} {...sk} />
    <ellipse cx={-40} cy={-20} rx={34} ry={46} fill="#E9A28E" {...sk} strokeWidth={5} />
    <circle cx={90} cy={-70} r={10} fill={C.ink} />
    {good > 0 && <g opacity={good}><path d="M260 60 C150 40 60 10 -20 -20" fill="none" stroke="#3FA34D" strokeWidth={10} strokeDasharray="22 14" strokeLinecap="round" /><circle cx={-20} cy={-20} r={16} fill="#3FA34D" /></g>}
    {bad > 0 && <g opacity={bad}><path d="M260 90 C200 90 170 110 150 140" fill="none" stroke={C.warn} strokeWidth={10} strokeDasharray="22 14" strokeLinecap="round" /></g>}
  </g>
);

/** closed / open "7th" card */
export const MysteryCard: React.FC<{ open?: number; text?: string; sub?: string }> = ({ open = 0, text = "", sub = "" }) => (
  <g>
    <rect x={-200} y={-150} width={400} height={300} rx={30} fill={open > 0.5 ? "#FFF3CF" : C.iconBg} {...sk} />
    {open <= 0.5 ? <T y={40} size={140} fill={C.key}>؟</T> : (
      <g opacity={(open - 0.5) * 2}>
        <T y={-10} size={44}>{text}</T>
        <T y={50} size={28} fill={C.source} dir="ltr">{sub}</T>
      </g>
    )}
  </g>
);
