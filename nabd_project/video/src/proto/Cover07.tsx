// Ep08 covers (thumbnails): big hook title, one clear picture, «نبض» mark. Everything inside the safe zone.
import React from "react";
import { AbsoluteFill } from "remotion";
import { NabdMark } from "../components/Frame";
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
  <AbsoluteFill style={{ backgroundColor: "#FFE9B8" }}>
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs><pattern id="dots" width="46" height="46" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="5" fill="#F5C86A" /></pattern></defs>
      <rect width={1080} height={1920} fill="url(#dots)" />
      <circle cx={540} cy={1150} r={600} fill={C.brand} stroke={C.ink} strokeWidth={10} />
      <circle cx={540} cy={1150} r={500} fill="#FF8A80" opacity={0.55} />
      <path d="M60 760 l40 -70 l30 60 l60 -40 l-10 80 z" fill="#FFD43B" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      <path d="M930 1500 l-40 70 l-30 -60 l-60 40 l10 -80 z" fill="#FFD43B" stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      <g transform="translate(540 1150) scale(1.12) translate(-540 -1150)">{ART[art]}</g>
    </svg>
    <div style={{ position: "absolute", left: 50, top: 70, display: "flex", alignItems: "center", gap: 14, direction: "rtl" }}><NabdMark size={96} /><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 46, color: C.ink }}>نبض</div></div>
    <div style={{ position: "absolute", left: 40, width: 880, top: 230, textAlign: "center", direction: "rtl", fontFamily: FONT, fontWeight: 700, lineHeight: 1.12 }}>
      <div style={{ fontSize: 132, color: "#fff", WebkitTextStroke: `14px ${C.ink}`, paintOrder: "stroke fill", textShadow: `0 10px 0 ${C.ink}` }}>{title}</div>
      {sub && <div style={{ display: "inline-block", marginTop: 26, background: "#FFD43B", border: `8px solid ${C.ink}`, borderRadius: 40, padding: "6px 36px 14px", fontSize: 72, color: C.ink, boxShadow: `0 8px 0 ${C.ink}` }}>{sub}</div>}
    </div>
  </AbsoluteFill>
);
export const Cover07L: React.FC<Cover07Props> = ({ title, sub, art }) => (
  <AbsoluteFill style={{ backgroundColor: "#FFE9B8" }}>
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs><pattern id="dots2" width="46" height="46" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="5" fill="#F5C86A" /></pattern></defs>
      <rect width={1920} height={1080} fill="url(#dots2)" />
      <circle cx={1380} cy={560} r={470} fill={C.brand} stroke={C.ink} strokeWidth={10} />
      <circle cx={1380} cy={560} r={390} fill="#FF8A80" opacity={0.55} />
      <g transform="translate(1380 560) scale(1.15) translate(-540 -1150)">{ART[art]}</g>
    </svg>
    <div style={{ position: "absolute", left: 60, top: 50, display: "flex", alignItems: "center", gap: 14, direction: "rtl" }}><NabdMark size={90} /><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 44, color: C.ink }}>نبض</div></div>
    <div style={{ position: "absolute", left: 60, width: 860, top: 250, textAlign: "center", direction: "rtl", fontFamily: FONT, fontWeight: 700, lineHeight: 1.12 }}>
      <div style={{ fontSize: 130, color: "#fff", WebkitTextStroke: `14px ${C.ink}`, paintOrder: "stroke fill", textShadow: `0 10px 0 ${C.ink}` }}>{title}</div>
      {sub && <div style={{ display: "inline-block", marginTop: 26, background: "#FFD43B", border: `8px solid ${C.ink}`, borderRadius: 40, padding: "6px 36px 14px", fontSize: 70, color: C.ink, boxShadow: `0 8px 0 ${C.ink}` }}>{sub}</div>}
    </div>
  </AbsoluteFill>
);
