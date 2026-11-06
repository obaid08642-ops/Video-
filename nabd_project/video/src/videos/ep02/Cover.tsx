// Ep02 cover / thumbnail (1080x1920). Title and drawing stay inside the centre 1080x1080 square, so the
// Instagram grid (1:1 / 4:5 crops) and Shorts/TikTok covers all keep them. Generic pen, no logos.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Badge, Paper, SeriesTag } from "../../components/Frame";
import { Place, Sparkle } from "../../assets";
import { InjPen, Lizard } from "../../assets/ep02";
import { C, FONT } from "../../theme";

export const Ep02Cover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Paper />
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <circle cx={540} cy={1090} r={310} fill="#FFF3CF" opacity={0.8} />
      <Place x={600} y={960} s={0.85} r={-14}><InjPen /></Place>
      <Place x={560} y={1190} s={1.4}><Lizard mood={1} /></Place>
      <Place x={250} y={960} s={0.8}><Sparkle fill="#FFF3CF" /></Place>
      <Place x={870} y={1230} s={0.6}><Sparkle fill="#FFF3CF" /></Place>
    </svg>
    <div style={{ position: "absolute", left: 70, width: 940, top: 440, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, transform: "translate(-10px, 12px)", background: C.cardShadow, borderRadius: 44 }} />
        <div style={{ position: "relative", background: C.card, border: `6px solid ${C.ink}`, borderRadius: 44, padding: "26px 48px 34px", direction: "rtl", fontFamily: FONT, fontWeight: 700, textAlign: "center", lineHeight: 1.3, color: C.ink }}>
          <div style={{ fontSize: 86 }}>سحلية فتحت الباب</div>
          <div style={{ fontSize: 86 }}>لأشهر <span style={{ color: C.key }}>حقن</span> في العالم؟</div>
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 1355, display: "flex", justifyContent: "center", direction: "rtl", fontFamily: FONT }}>
      <div style={{ background: C.iconBg, border: `5px solid ${C.ink}`, borderRadius: 999, padding: "6px 36px 12px", fontSize: 50, fontWeight: 700, color: C.ink }}>
        <bdi>GLP-1</bdi> بالبلدي
      </div>
    </div>
    <Badge pulses={[]} />
    <SeriesTag text="#الأدوية" />
  </AbsoluteFill>
);
