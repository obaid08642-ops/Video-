// More reusable flat drawings (scenes 2, 3, 5, 6, 8, 9). Drawn around (0,0).
import React from "react";
import { C, FONT } from "../theme";
import { sk } from "../components/Frame";
import { Face } from "./index";

export const Calendar: React.FC<{ year: string; flip?: number }> = ({ year, flip = 0 }) => (
  <g>
    <rect x={-170} y={-150} width={340} height={320} rx={30} fill={C.paper} {...sk} />
    <path d="M-170 -150 H170 V-60 H-170 Z" fill={C.brand} {...sk} />
    <circle cx={-90} cy={-150} r={14} fill={C.bg} {...sk} strokeWidth={5} />
    <circle cx={90} cy={-150} r={14} fill={C.bg} {...sk} strokeWidth={5} />
    <g transform={`translate(0 ${-flip * 30})`} opacity={1 - Math.abs(flip) * 0.8}>
      <text x={0} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={118} fill={C.ink} direction="ltr" unicodeBidi="bidi-override">
        {year}
      </text>
    </g>
  </g>
);

export const CalendarIcon: React.FC<{ year: string }> = ({ year }) => (
  <g>
    <circle r={44} fill={C.iconBg} {...sk} strokeWidth={5} />
    <rect x={-26} y={-24} width={52} height={48} rx={7} fill={C.paper} stroke={C.ink} strokeWidth={3} />
    <rect x={-26} y={-24} width={52} height={14} rx={5} fill={C.brand} stroke={C.ink} strokeWidth={3} />
    <text x={0} y={18} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={19} fill={C.ink} direction="ltr">
      {year}
    </text>
  </g>
);

/** forearm + hand with a small scratch (no blood) */
export const HandScratch: React.FC<{ glow?: number }> = ({ glow = 0 }) => (
  <g>
    <path d="M-420 60 C-200 30 -40 20 60 10 L60 120 C-40 130 -200 140 -420 150 Z" fill={C.skin} {...sk} />
    <path d="M60 10 C120 -30 200 -30 240 0 C300 -10 330 20 300 50 C340 60 340 100 300 110 C320 140 290 170 250 150 C200 170 120 160 60 120 Z" fill={C.skin} {...sk} />
    {glow > 0 && <ellipse cx={-130} cy={70} rx={110 + 30 * glow} ry={40 + 12 * glow} fill={C.warn} opacity={0.15 * glow} />}
    <path d="M-200 62 L-60 76" {...sk} stroke={C.warn} strokeWidth={7} />
    <path d="M-180 80 L-90 88" {...sk} stroke={C.warn} strokeWidth={5} opacity={0.7} />
  </g>
);

/** skin cross-section (style-frame layers) with a blood vessel */
export const SkinSection: React.FC = () => (
  <g>
    <rect x={-470} y={-260} width={940} height={560} rx={40} fill="#F3D7C4" {...sk} />
    <path d="M-470 -170 C-300 -195 -150 -150 0 -170 C150 -190 300 -150 470 -170 V-260 H-470 Z" fill={C.skin} {...sk} />
    <path d="M-150 -175 L-120 -120" {...sk} stroke={C.warn} strokeWidth={7} />
    <path d="M-470 150 C-200 120 200 190 470 150 V250 C200 290 -200 220 -470 250 Z" fill="#EBA9A1" {...sk} />
    <circle cx={-220} cy={200} r={14} fill="#D97C73" />
    <circle cx={60} cy={210} r={16} fill="#D97C73" />
    <circle cx={300} cy={196} r={12} fill="#D97C73" />
  </g>
);

export const MiniBug: React.FC<{ color?: string; s?: number }> = ({ color = C.bad, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-34} y={-22} width={68} height={44} rx={22} fill={color} {...sk} strokeWidth={5} />
    <circle cx={-9} cy={-3} r={4} fill={C.ink} />
    <circle cx={9} cy={-3} r={4} fill={C.ink} />
  </g>
);

/** doctor / scientist: head, glasses option, white coat */
export const Doc: React.FC<{ mood?: number; glasses?: boolean; shrug?: number; hair?: string }> = ({ mood = 0.5, glasses = false, shrug = 0, hair = C.ink }) => (
  <g>
    <path d="M-150 330 C-150 150 -110 90 0 90 C110 90 150 150 150 330 Z" fill={C.white} {...sk} />
    <path d="M0 90 L-30 170 L0 330 M0 90 L30 170 L0 330" fill="none" {...sk} strokeWidth={5} />
    <path d={`M-140 200 C${-200 - 40 * shrug} ${150 - 90 * shrug} ${-210 - 40 * shrug} ${110 - 120 * shrug} ${-180 - 30 * shrug} ${80 - 130 * shrug}`} fill="none" {...sk} strokeWidth={30} stroke={C.white} />
    <path d={`M140 200 C${200 + 40 * shrug} ${150 - 90 * shrug} ${210 + 40 * shrug} ${110 - 120 * shrug} ${180 + 30 * shrug} ${80 - 130 * shrug}`} fill="none" {...sk} strokeWidth={30} stroke={C.white} />
    <circle cx={-180 - 30 * shrug} cy={80 - 130 * shrug} r={26} fill={C.skin} {...sk} strokeWidth={5} />
    <circle cx={180 + 30 * shrug} cy={80 - 130 * shrug} r={26} fill={C.skin} {...sk} strokeWidth={5} />
    <circle cx={0} cy={-10} r={100} fill={C.skin} {...sk} />
    <path d="M-100 -20 C-110 -120 110 -130 100 -20 C70 -80 -60 -90 -100 -20 Z" fill={hair} {...sk} strokeWidth={5} />
    {glasses && (
      <g>
        <circle cx={-34} cy={-4} r={26} fill="none" {...sk} strokeWidth={5} />
        <circle cx={34} cy={-4} r={26} fill="none" {...sk} strokeWidth={5} />
        <path d="M-8 -6 H8" {...sk} strokeWidth={5} />
      </g>
    )}
    <Face x={0} y={2} size={1.1} mood={mood} />
  </g>
);

export const Bottle: React.FC<{ level?: number; label?: boolean }> = ({ level = 1, label = true }) => (
  <g>
    <path d="M-40 -170 H40 V-120 C110 -100 120 -60 120 0 V150 C120 175 100 190 75 190 H-75 C-100 190 -120 175 -120 150 V0 C-120 -60 -110 -100 -40 -120 Z" fill={C.glass} {...sk} />
    <clipPath id="bottleClip">
      <path d="M-114 0 C-114 -55 -100 -90 -40 -110 H40 C100 -90 114 -55 114 0 V150 C114 170 100 184 75 184 H-75 C-100 184 -114 170 -114 150 Z" />
    </clipPath>
    <rect x={-120} y={184 - 300 * level} width={240} height={300} fill="#F4D58A" clipPath="url(#bottleClip)" />
    <rect x={-48} y={-200} width={96} height={40} rx={10} fill={C.brand} {...sk} />
    {label && (
      <g>
        <rect x={-80} y={20} width={160} height={90} rx={14} fill={C.paper} {...sk} strokeWidth={5} />
        <path d="M-40 66 C-20 30 20 30 40 66 C20 90 -20 90 -40 66 Z" fill={C.badDark} stroke={C.ink} strokeWidth={4} />
      </g>
    )}
  </g>
);

export const Bed: React.FC<{ mood?: number }> = ({ mood = -0.6 }) => (
  <g>
    <rect x={-300} y={20} width={600} height={90} rx={20} fill={C.iconBg} {...sk} />
    <path d="M-300 110 V180 M300 110 V180" {...sk} />
    <rect x={-320} y={-80} width={40} height={190} rx={14} fill={C.paper} {...sk} />
    <rect x={-270} y={-10} width={150} height={60} rx={28} fill={C.white} {...sk} />
    <circle cx={-190} cy={-30} r={62} fill={C.skin} {...sk} />
    <Face x={-190} y={-26} size={0.8} mood={mood} />
    <path d="M-120 20 C-40 -30 200 -30 290 20" fill="#B9D3E8" {...sk} />
  </g>
);

/** cartoon tank (capsule colours) and a little bird */
export const Tank: React.FC<{ wheel?: number }> = ({ wheel = 0 }) => (
  <g>
    <rect x={-210} y={-20} width={420} height={110} rx={40} fill={C.capsule} {...sk} />
    <rect x={-130} y={-110} width={230} height={100} rx={44} fill={C.brand} {...sk} />
    <rect x={90} y={-82} width={200} height={34} rx={17} fill={C.capsule} {...sk} />
    <rect x={-220} y={70} width={440} height={80} rx={40} fill={C.ink} />
    {[-150, -75, 0, 75, 150].map((x) => (
      <g key={x} transform={`translate(${x} 110) rotate(${wheel})`}>
        <circle r={26} fill={C.shield} stroke={C.bg} strokeWidth={5} />
        <path d="M-14 0 H14" stroke={C.bg} strokeWidth={5} strokeLinecap="round" />
      </g>
    ))}
    <Face x={-20} y={-60} size={0.7} mood={0.4} brows={0.5} />
  </g>
);

export const Bird: React.FC<{ flap?: number }> = ({ flap = 0 }) => (
  <g>
    <ellipse rx={56} ry={42} fill="#F6C566" {...sk} />
    <circle cx={40} cy={-34} r={32} fill="#F6C566" {...sk} />
    <path d="M70 -36 L98 -28 L70 -20 Z" fill={C.key} {...sk} strokeWidth={4} />
    <circle cx={48} cy={-40} r={5} fill={C.ink} />
    <path d={`M-10 -10 C-40 ${-60 - 30 * flap} -90 ${-50 - 30 * flap} -70 ${-4 + 10 * flap} Z`} fill="#F2B04A" {...sk} strokeWidth={5} />
  </g>
);

export const Gut: React.FC = () => (
  <path
    d="M-300 -160 C-100 -230 120 -200 280 -150 C360 -120 350 -40 270 -30 C120 -10 -60 -60 -180 -10 C-300 40 -280 120 -150 130 C0 140 150 90 280 130 C360 160 330 240 240 250 C80 270 -120 230 -300 250"
    fill="none"
    stroke="#E9B9A6"
    strokeWidth={90}
    strokeLinecap="round"
  />
);

export const Shield: React.FC = () => (
  <path d="M0 -60 L60 -36 C60 20 40 50 0 70 C-40 50 -60 20 -60 -36 Z" fill={C.shield} {...sk} />
);

export const ShieldIcon: React.FC = () => (
  <g>
    <circle r={44} fill={C.iconBg} {...sk} strokeWidth={5} />
    <g transform="scale(0.5)">
      <Shield />
    </g>
  </g>
);

export const TankIcon: React.FC = () => (
  <g>
    <circle r={44} fill={C.iconBg} {...sk} strokeWidth={5} />
    <g transform="scale(0.14) translate(-20 -10)">
      <Tank />
    </g>
  </g>
);

export const DishIcon: React.FC = () => (
  <g>
    <circle r={44} fill={C.iconBg} {...sk} strokeWidth={5} />
    <circle r={26} fill={C.agar} stroke={C.ink} strokeWidth={3} />
    <circle cx={6} cy={-4} r={10} fill={C.badDark} stroke={C.ink} strokeWidth={3} />
  </g>
);

export const Scissors: React.FC<{ open?: number }> = ({ open = 0 }) => (
  <g>
    <g transform={`rotate(${-12 - 18 * open})`}>
      <path d="M0 0 L190 -14 L190 4 Z" fill={C.shield} {...sk} strokeWidth={5} />
      <circle cx={-60} cy={-26} r={30} fill="none" {...sk} stroke={C.key} strokeWidth={12} />
    </g>
    <g transform={`rotate(${12 + 18 * open})`}>
      <path d="M0 0 L190 14 L190 -4 Z" fill={C.shield} {...sk} strokeWidth={5} />
      <circle cx={-60} cy={26} r={30} fill="none" {...sk} stroke={C.key} strokeWidth={12} />
    </g>
    <circle r={9} fill={C.ink} />
  </g>
);

export const Door: React.FC<{ close?: number }> = ({ close = 0 }) => (
  <g>
    <rect x={-120} y={-200} width={240} height={400} rx={18} fill={C.bad} {...sk} />
    <rect x={-100} y={-180} width={200} height={380} fill={C.ink} opacity={0.85} />
    <g transform={`translate(-100 0) scale(${0.15 + 0.85 * close} 1) translate(100 0)`}>
      <rect x={-100} y={-180} width={200} height={380} rx={8} fill="#E9C995" {...sk} />
      <circle cx={70} cy={20} r={12} fill={C.ink} />
    </g>
  </g>
);

export const KeyShape: React.FC = () => (
  <g>
    <circle cx={-90} cy={0} r={40} fill="none" {...sk} stroke={C.brand} strokeWidth={16} />
    <path d="M-50 0 H90 M60 0 V30 M85 0 V22" fill="none" {...sk} stroke={C.brand} strokeWidth={16} />
  </g>
);

export const HandWash: React.FC = () => (
  <g>
    <circle r={110} fill={C.iconBg} {...sk} />
    <path d="M-60 40 C-70 -20 -30 -40 0 -30 C30 -40 70 -20 60 40 C40 70 -40 70 -60 40 Z" fill={C.skin} {...sk} />
    {[[-50, -70], [40, -80], [70, -40]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={16} fill={C.white} {...sk} strokeWidth={4} />
    ))}
  </g>
);

export const Syringe: React.FC = () => (
  <g>
    <circle r={110} fill={C.iconBg} {...sk} />
    <g transform="rotate(-40)">
      <rect x={-70} y={-22} width={120} height={44} rx={8} fill={C.white} {...sk} />
      <rect x={-70} y={-22} width={60} height={44} fill="#9DC9E8" stroke={C.ink} strokeWidth={5} />
      <path d="M50 0 H100 M-70 -30 V30 M-70 0 H-100 M-100 -18 V18" {...sk} />
    </g>
  </g>
);

export const Moon: React.FC = () => (
  <g>
    <circle r={110} fill={C.iconBg} {...sk} />
    <path d="M20 -60 C-40 -50 -60 20 -20 55 C10 80 60 70 75 40 C20 50 -10 0 20 -60 Z" fill="#F6C566" {...sk} />
  </g>
);

/** people around (for "تنتقل لأي حد حواليك") */
export const Crowd: React.FC<{ n?: number }> = ({ n = 5 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => (
      <g key={i} transform={`translate(${(i - (n - 1) / 2) * 170} ${i % 2 ? 30 : 0})`}>
        <circle cy={-70} r={46} fill={C.skin} {...sk} />
        <path d="M-70 90 C-70 -10 70 -10 70 90 Z" fill={[C.iconBg, "#F3C9A6", "#CDE3C2", "#E6D3F0", "#F7E1A8"][i % 5]} {...sk} />
        <Face y={-66} size={0.55} mood={0.6} />
      </g>
    ))}
  </g>
);
