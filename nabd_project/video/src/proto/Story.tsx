// Storyboard prototype for Short #1 of Ep08 («دكتور شرب جرثومة عمدًا»): big headline, big art, host with expressions, 3D toon bacterium.
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Badge, Paper, SeriesTag, sk } from "../components/Frame";
import { Place } from "../assets";
import { HostV3 } from "./CharsV3";
import { Pylori3D } from "./Pylori3D";
import { C, FONT } from "../theme";
import { popEase, clamp } from "../lib/anim";

const Head: React.FC<{ a: string; b?: string; hot?: boolean; top?: number }> = ({ a, b, hot, top = 250 }) => {
  const f = useCurrentFrame(); const s = interpolate(f, [0, 8], [0.7, 1], { ...clamp, easing: popEase });
  return (
    <div style={{ position: "absolute", left: 40, width: 1000, top, textAlign: "center", direction: "rtl", fontFamily: FONT, fontWeight: 700, transform: `scale(${s})`, lineHeight: 1.12 }}>
      <div style={{ fontSize: 112, color: hot ? C.key : C.ink, WebkitTextStroke: "0px", textShadow: "0 6px 0 rgba(0,0,0,0.08)" }}>{a}</div>
      {b && <div style={{ fontSize: 76, color: C.ink, marginTop: 6 }}>{b}</div>}
    </div>
  );
};
const Stomach: React.FC<{ red?: number }> = ({ red = 0 }) => (
  <g>
    <path d="M-30 -190 C40 -200 60 -120 50 -60 C150 -30 210 60 170 150 C130 240 0 230 -70 170 C-120 130 -90 70 -60 40 C-80 -20 -80 -150 -30 -190 Z" fill={red ? "#E88873" : "#F0A89A"} {...sk} />
    <path d="M-20 -190 C-50 -230 -80 -230 -92 -250" fill="none" {...sk} strokeWidth={26} />
    <path d="M50 -60 C60 -100 90 -110 120 -100" fill="none" {...sk} strokeWidth={26} />
    {red > 0 && [[60, 40], [20, 100], [100, 120]].map(([x, y], i) => (<circle key={i} cx={x} cy={y} r={16} fill="#C23B32" {...sk} strokeWidth={4} />))}
  </g>
);
const Glass: React.FC = () => (
  <g>
    <path d="M-80 -120 H80 L62 130 Q0 150 -62 130 Z" fill="#CFE6F5" fillOpacity={0.7} {...sk} />
    <path d="M-72 -20 H72 L62 130 Q0 150 -62 130 Z" fill="#9CC48A" opacity={0.85} />
  </g>
);
const Medal: React.FC = () => (
  <g>
    <path d="M-50 -170 L-10 -60 M50 -170 L10 -60" stroke={C.brand} strokeWidth={34} strokeLinecap="round" />
    <circle r={92} fill="#F7C548" {...sk} /><circle r={66} fill="none" stroke={C.ink} strokeWidth={5} />
    <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill={C.ink} direction="ltr">2005</text>
  </g>
);
const Bug3D: React.FC<{ y: number; s: number; x?: number }> = ({ y, s, x = 0 }) => (<div style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, transformOrigin: "50% 50%" }}><Pylori3D /></div>);
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (<svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{children}</svg>);

export const Story: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Paper />
    <Sequence from={0} durationInFrames={30}>
      <Head a="دكتور شرب جرثومة!" b="…عمدًا" hot />
      <Svg><Place x={430} y={1010} s={1.6}><HostV3 mood="shock" /></Place></Svg>
      <Bug3D y={760} s={0.62} x={330} />
    </Sequence>
    <Sequence from={30} durationInFrames={30}>
      <Head a="أستراليا… 1984" b="كلهم قالوا: مجنون" />
      <Svg><Place x={540} y={1050} s={1.7}><HostV3 mood="worried" /></Place></Svg>
    </Sequence>
    <Sequence from={60} durationInFrames={30}>
      <Head a="الأول: منظار" b="يتأكد إن معدته سليمة" />
      <Svg><Place x={540} y={1060} s={1.45}><Stomach /></Place><Place x={860} y={800} s={1.5}><HostV3 mood="explain" point /></Place></Svg>
    </Sequence>
    <Sequence from={90} durationInFrames={30}>
      <Head a="وبعدها… شرب!" hot />
      <Svg><Place x={540} y={1080} s={1.75}><Glass /></Place></Svg>
      <Bug3D y={820} s={0.52} x={270} />
    </Sequence>
    <Sequence from={120} durationInFrames={30}>
      <Head a="خلال أيام…" b="التهاب في المعدة!" />
      <Svg><Place x={540} y={1090} s={1.55}><Stomach red={1} /></Place></Svg>
      <Bug3D y={1000} s={0.42} x={-60} />
    </Sequence>
    <Sequence from={150} durationInFrames={30}>
      <Head a="وخد نوبل!" b="الطب 2005" hot />
      <Svg><Place x={540} y={1080} s={1.9}><Medal /></Place></Svg>
    </Sequence>
    <Badge pulses={[]} /><SeriesTag text="#الهضم" />
  </AbsoluteFill>
);
