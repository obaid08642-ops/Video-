// Ep08 (H. pylori) style frames: cute 2D doctor + toon 3D bacterium. Safe zones: nothing below y=1536 or right of x=950.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Paper, SeriesTag, NabdMark, sk } from "../components/Frame";
import { Place } from "../assets";
import { CuteDoc, CutePatient } from "./CharsCute";
import { Pylori3D } from "./Pylori3D";
import { C, FONT } from "../theme";

const H: React.FC<{ a: string; b?: string; hot?: boolean; top?: number; size?: number }> = ({ a, b, hot, top = 170, size = 116 }) => (
  <div style={{ position: "absolute", left: 40, width: 880, top, textAlign: "center", direction: "rtl", fontFamily: FONT, fontWeight: 700, lineHeight: 1.12 }}>
    <div style={{ fontSize: size, color: hot ? C.key : C.ink, textShadow: "0 6px 0 rgba(0,0,0,0.08)" }}>{a}</div>
    {b && <div style={{ fontSize: 66, color: C.ink, marginTop: 8 }}>{b}</div>}
  </div>
);
const Bug: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 1080, height: 1080, transform: `scale(${s})`, transformOrigin: "0 0" }}><Pylori3D /></div>
);
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (<svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{children}</svg>);
const Frame: React.FC<{ children: React.ReactNode; tag?: string }> = ({ children, tag = "#الجهاز_الهضمي" }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}><Paper />{children}<SeriesTag text={tag} /></AbsoluteFill>
);

const Glass: React.FC = () => (
  <g>
    <path d="M-70 -110 H70 L54 120 Q0 138 -54 120 Z" fill="#CFE6F5" fillOpacity={0.75} {...sk} />
    <path d="M-62 -10 H62 L54 120 Q0 138 -54 120 Z" fill="#9CC48A" opacity={0.9} />
    <circle cx={-14} cy={40} r={10} fill="#fff" opacity={0.6} /><circle cx={16} cy={70} r={7} fill="#fff" opacity={0.6} />
  </g>
);
const Pill: React.FC<{ c1: string; c2: string; r?: number }> = ({ c1, c2, r = 0 }) => (
  <g transform={`rotate(${r})`}><rect x={-70} y={-30} width={140} height={60} rx={30} fill={c1} {...sk} /><path d="M0 -30 H40 A30 30 0 0 1 40 30 H0 Z" fill={c2} {...sk} /></g>
);

/** Frame 1: hook, «دكتور شرب جرثومة!» */
export const FrameHook: React.FC = () => (
  <Frame>
    <H a="دكتور شرب جرثومة!" b="…وخد عليها نوبل" hot />
    <Svg>
      <Place x={460} y={1180} s={2.0}><CuteDoc mood="surprised" /></Place>
      <Place x={800} y={1020} s={1.5} r={-8}><Glass /></Place>
    </Svg>
    <Bug x={400} y={430} s={0.5} />
  </Frame>
);
/** Frame 2: the number, 44% with a 3D bacterium + dot grid */
export const FrameData: React.FC = () => (
  <Frame>
    <H a="44%" b="من سكان العالم عندهم الجرثومة" hot size={230} top={150} />
    <Svg>
      {Array.from({ length: 10 }).map((_, i) => (
        <Place key={i} x={150 + (i % 5) * 170} y={780 + Math.floor(i / 5) * 190} s={0.5}>
          <CutePatient mood={i < 4 ? "worried" : "happy"} />
        </Place>
      ))}
      <Place x={300} y={1400} s={0.9}><CuteDoc mood="explain" /></Place>
    </Svg>
    <Bug x={440} y={1060} s={0.5} />
  </Frame>
);
/** Frame 3: the treatment, 4 medicines for 14 days */
export const FrameTreat: React.FC = () => (
  <Frame>
    <H a="4 أدوية" b="مع بعض لمدة 14 يوم" hot size={150} />
    <Svg>
      <Place x={250} y={700} s={1.3}><Pill c1="#E7B79C" c2="#FFFDF8" r={-12} /></Place>
      <Place x={650} y={690} s={1.3}><Pill c1="#9DC9E8" c2="#FFFDF8" r={10} /></Place>
      <Place x={260} y={900} s={1.3}><Pill c1="#F7C548" c2="#FFFDF8" r={8} /></Place>
      <Place x={660} y={890} s={1.3}><Pill c1="#9CC48A" c2="#FFFDF8" r={-10} /></Place>
      <Place x={540} y={1370} s={1.5}><CuteDoc mood="explain" up /></Place>
      <rect x={110} y={1030} width={700} height={78} rx={35} fill="#fff" {...sk} />
      <text x={460} y={1084} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.ink} direction="rtl">الدكتور هو اللي يحدد الخطة</text>
    </Svg>
  </Frame>
);
