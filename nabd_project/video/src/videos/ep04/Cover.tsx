// Ep04 covers (1080x1920): title + drawing stay inside the centre 1080x1080 square (grid-safe). No real people, no brands.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Badge, Paper, SeriesTag } from "../../components/Frame";
import { Place, QuestionIcon, Sparkle } from "../../assets";
import { Baby, Warn } from "../../assets/v9";
import { Liver, PackBox, Podium, Tablet, LabBottle } from "../../assets/ep04";
import { C, FONT } from "../../theme";

export type CoverProps = { variant: "long" | "short1" | "short2" | "short3" | "short4" };
const TITLES: Record<CoverProps["variant"], { a: string; b: string; key: string; pill: string }> = {
  long: { a: "الباراسيتامول…", b: "الدواء اللي فاكرين إننا عارفينه!", key: "الباراسيتامول", pill: "حكاية وآلية وكبد" },
  short1: { a: "الجرعة المضاعفة…", b: "ممكن تاخدها من غير ما تعرف", key: "الجرعة المضاعفة", pill: "روح الطوارئ حتى لو كويس" },
  short2: { a: "ترامب والتوحد…", b: "إيه الحقيقة؟", key: "إيه الحقيقة؟", pill: "الارتباط مش سببية" },
  short3: { a: "دوا عمره أكتر من قرن…", b: "ولسه مش عارفين بيشتغل إزاي!", key: "لغز", pill: "الباراسيتامول واللغز" },
  short4: { a: "غلطة صيدلية…", b: "غيّرت تاريخ المسكنات!", key: "غلطة صيدلية", pill: "حكاية سنة 1886" },
};
export const Ep04Cover: React.FC<CoverProps> = ({ variant }) => {
  const T = TITLES[variant];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Paper />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <circle cx={540} cy={1090} r={310} fill="#FFF3CF" opacity={0.8} />
        {variant === "long" && (<><Place x={540} y={1090} s={2.0}><Tablet glow={1} /></Place><Place x={820} y={1230} s={0.55}><Liver hurt={0.3} /></Place><Place x={250} y={960} s={0.8}><Sparkle fill="#FFF3CF" /></Place></>)}
        {variant === "short1" && (<><Place x={380} y={1120} s={1.0}><PackBox kind="pain" band="#F2D79A" /></Place><Place x={700} y={1120} s={1.0}><PackBox kind="cold" band="#9DC9E8" /></Place><Place x={540} y={1250} s={0.95}><Tablet glow={1} /></Place><Place x={850} y={950} s={1.3}><Warn /></Place></>)}
        {variant === "short3" && (<><Place x={540} y={1090} s={1.7}><Tablet glow={1} /></Place><Place x={830} y={900} s={1.4}><QuestionIcon /></Place><Place x={260} y={960} s={0.8}><Sparkle fill="#FFF3CF" /></Place></>)}
        {variant === "short4" && (<><Place x={380} y={1130} s={1.2}><LabBottle label="" /></Place><Place x={720} y={1130} s={1.2}><LabBottle tint="#F2D79A" label="" /></Place><Place x={850} y={930} s={1.2}><Warn /></Place></>)}
        {variant === "short2" && (<><Place x={540} y={1120} s={0.9}><Podium /></Place><Place x={820} y={900} s={1.4}><QuestionIcon /></Place><Place x={270} y={980} s={0.55}><Baby /></Place></>)}
      </svg>
      <div style={{ position: "absolute", left: 70, width: 940, top: 440, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, transform: "translate(-10px, 12px)", background: C.cardShadow, borderRadius: 44 }} />
          <div style={{ position: "relative", background: C.card, border: `6px solid ${C.ink}`, borderRadius: 44, padding: "26px 48px 34px", direction: "rtl", fontFamily: FONT, fontWeight: 700, textAlign: "center", lineHeight: 1.3, color: C.ink }}>
            <div style={{ fontSize: 72, whiteSpace: "nowrap", color: C.key }}>{T.a}</div>
            <div style={{ fontSize: variant === "long" ? 56 : 64, whiteSpace: "nowrap" }}>{T.b}</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1355, display: "flex", justifyContent: "center", direction: "rtl", fontFamily: FONT }}>
        <div style={{ background: C.iconBg, border: `5px solid ${C.ink}`, borderRadius: 999, padding: "6px 36px 12px", fontSize: 46, fontWeight: 700, color: C.ink }}>{T.pill}</div>
      </div>
      <Badge pulses={[]} />
      <SeriesTag text="#الأدوية" />
    </AbsoluteFill>
  );
};
