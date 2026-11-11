// Ep05 cover (1080x1920): title + drawing stay inside the centre 1080x1080 square (grid-safe). No real people, no brands.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Badge, Paper, SeriesTag } from "../../components/Frame";
import { Place, Clock } from "../../assets";
import { Moon } from "../../assets/more";
import { PatientM, MedTablet } from "../../assets/characters";
import { C, FONT } from "../../theme";

export const Ep05Cover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Paper />
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <circle cx={540} cy={1090} r={310} fill="#FFF3CF" opacity={0.8} />
      <Place x={540} y={1130} s={1.35}><PatientM /></Place>
      <Place x={250} y={900} s={0.95}><Moon /></Place>
      <Place x={830} y={900} s={0.85}><Clock a={40} /></Place>
      <Place x={800} y={1290} s={0.7}><MedTablet /></Place>
    </svg>
    <div style={{ position: "absolute", left: 70, width: 940, top: 440, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, transform: "translate(-10px, 12px)", background: C.cardShadow, borderRadius: 44 }} />
        <div style={{ position: "relative", background: C.card, border: `6px solid ${C.ink}`, borderRadius: 44, padding: "26px 48px 34px", direction: "rtl", fontFamily: FONT, fontWeight: 700, textAlign: "center", lineHeight: 1.3, color: C.ink }}>
          <div style={{ fontSize: 84, whiteSpace: "nowrap", color: C.key }}>مين سرق نومك؟</div>
          <div style={{ fontSize: 56, whiteSpace: "nowrap" }}>الأرق والمنومات… بالعلم</div>
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 1355, display: "flex", justifyContent: "center", direction: "rtl", fontFamily: FONT }}>
      <div style={{ background: C.iconBg, border: `5px solid ${C.ink}`, borderRadius: 999, padding: "6px 36px 12px", fontSize: 46, fontWeight: 700, color: C.ink }}>الأرق • الميلاتونين • CBT-I</div>
    </div>
    <Badge pulses={[]} />
    <SeriesTag text="#النوم" />
  </AbsoluteFill>
);
