// Ep08 covers (thumbnails): big hook title, one clear picture, «نبض» mark. Everything inside the safe zone.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Paper, NabdMark } from "../components/Frame";
import { Place } from "../assets";
import { Warn } from "../assets/v9";
import { Thermo } from "../assets/ep04";
import { Virus } from "../assets";
import { Moon } from "../assets/more";
import * as J from "../assets/ep07";
import { CuteDoc, CutePatient } from "./CharsCute";
import * as I from "../assets/ep08";
import { C, FONT } from "../theme";

export type Cover07Props = { title: string; sub?: string; art: string };
const ART: Record<string, React.ReactNode> = {
  nocure: <><Place x={540} y={1100} s={1.5}><CutePatient mood="tired" /></Place><Place x={800} y={900} s={1.5}><J.Tissue /></Place></>,
  flu: <><Place x={300} y={1100} s={1.3}><Thermo level={0.25} /></Place><Place x={780} y={1100} s={1.3}><Thermo level={0.9} /></Place></>,
  mucus: <><Place x={540} y={1100} s={2.4}><J.Mucus /></Place></>,
  honey: <><Place x={540} y={1100} s={2.4}><I.Honey /></Place><Place x={540} y={1100} s={3.2} o={0.0}><I.NoSign /></Place></>,
  syrup: <><Place x={540} y={1080} s={2.4}><J.Syrup /></Place><Place x={820} y={800} s={1.7}><Warn /></Place></>,
  immune: <><Place x={540} y={1100} s={1.9}><CuteDoc mood="explain" up /></Place><Place x={250} y={900} s={1.4}><I.Herb /></Place></>,
  sleep: <><Place x={540} y={1100} s={2.4}><J.Bed /></Place></>,
  danger: <><Place x={540} y={1050} s={3.0}><Warn /></Place></>,
  aspirin: <><Place x={540} y={1100} s={2.2}><I.Pill c1="#F7C548" /></Place><Place x={540} y={1100} s={3.2} o={0.9}><I.NoSign /></Place></>,
  cold: <><Place x={540} y={1050} s={2.2}><Moon /></Place><Place x={540} y={1380} s={1.0}><Virus /></Place></>,
  box: <><Place x={300} y={1100} s={1.7}><I.Blister /></Place><Place x={780} y={1100} s={1.7}><I.Blister /></Place><Place x={540} y={1100}><text textAnchor="middle" y={40} fontSize={160} fontWeight={700} fill="#D9622B" fontFamily="sans-serif">=</text></Place></>,
  long: <><Place x={540} y={1100} s={1.7}><CuteDoc mood="happy" up /></Place><Place x={260} y={900} s={1.3}><J.Tissue /></Place></>,
};
export const Cover07: React.FC<Cover07Props> = ({ title, sub, art }) => (
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
