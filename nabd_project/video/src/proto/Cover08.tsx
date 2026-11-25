// Ep08 covers (thumbnails): big hook title, one clear picture, «نبض» mark. Everything inside the safe zone.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Paper, NabdMark } from "../components/Frame";
import { Place } from "../assets";
import { Warn } from "../assets/v9";
import { CuteDoc, CutePatient } from "./CharsCute";
import * as I from "../assets/ep08";
import { C, FONT } from "../theme";

export type Cover08Props = { title: string; sub?: string; art: string };
const ART: Record<string, React.ReactNode> = {
  glass: <><Place x={400} y={1150} s={1.6}><CuteDoc mood="surprised" /></Place><Place x={800} y={1000} s={1.7} r={-6}><I.GlassBug /></Place></>,
  pie: <><Place x={540} y={1060} s={1.7}><I.Pie v={0.44} /></Place><Place x={540} y={1060}><text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={160} fill={C.ink} stroke={C.bg} strokeWidth={14} paintOrder="stroke" direction="ltr">44%</text></Place></>,
  tube: <><Place x={330} y={1080} s={2.2}><I.Tube /></Place><Place x={760} y={1080} s={1.4}><CuteDoc mood="worried" /></Place></>,
  warn: <><Place x={540} y={1000} s={2.8}><Warn /></Place><Place x={270} y={1330} s={1.3}><I.BloodDrop /></Place><Place x={810} y={1330} s={1.1}><circle r={70} fill="#3A2F2A" stroke={C.ink} strokeWidth={6} /></Place></>,
  pills: <><Place x={540} y={1000} s={1.8}>{[-1, 1].map((x) => [-1, 1].map((y) => (<Place key={`${x}${y}`} x={x * 130} y={y * 90} s={1}><I.Pill c1={x * y > 0 ? "#9DC9E8" : "#F7C548"} r={x * 12} /></Place>)))}</Place><Place x={540} y={1350} s={1.0}><I.BugC mood="evil" /></Place></>,
  food: <>{[<I.Honey key="a" />, <I.Yogurt key="b" />, <I.Garlic key="c" />].map((n, i) => (<Place key={i} x={230 + i * 310} y={1050} s={1.3}>{n}</Place>))}<Place x={540} y={1050} s={4} o={0.9}><I.NoSign /></Place></>,
  myth: <><Place x={330} y={1060} s={1.6}><I.StressCloud /></Place><Place x={780} y={1060} s={1.5}><I.StomachC state="ulcer" /></Place><Place x={540} y={1060} s={2.6} o={0.9}><I.NoSign /></Place></>,
  stress: <><Place x={540} y={1000} s={2.2}><I.StressCloud /></Place><Place x={540} y={1330} s={1.1}><I.StomachC state="red" /></Place></>,
  crowd: <>{[0, 1, 2, 3, 4].map((i) => (<Place key={i} x={140 + i * 200} y={1100} s={0.8}><CutePatient mood={i === 1 || i === 3 ? "tired" : "happy"} /></Place>))}<Place x={540} y={1380} s={1.0}><I.BugC /></Place></>,
  kid: <><Place x={540} y={1050} s={2.4}><I.KidHead /></Place><Place x={540} y={1320} s={0.9}><I.Belly /></Place></>,
  long: <><Place x={400} y={1180} s={1.7}><CuteDoc mood="surprised" /></Place><Place x={800} y={1020} s={1.7} r={-6}><I.GlassBug /></Place></>,
};
export const Cover08: React.FC<Cover08Props> = ({ title, sub, art }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Paper />
    <div style={{ position: "absolute", left: 50, top: 70, display: "flex", alignItems: "center", gap: 14, direction: "rtl" }}><NabdMark size={96} /><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 46, color: C.ink }}>نبض</div></div>
    <div style={{ position: "absolute", left: 60, width: 840, top: 250, textAlign: "center", direction: "rtl", fontFamily: FONT, fontWeight: 700, lineHeight: 1.18 }}>
      <div style={{ fontSize: 118, color: C.key, textShadow: "0 6px 0 rgba(0,0,0,0.08)" }}>{title}</div>
      {sub && <div style={{ fontSize: 66, color: C.ink, marginTop: 14 }}>{sub}</div>}
    </div>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{ART[art]}</svg>
  </AbsoluteFill>
);
