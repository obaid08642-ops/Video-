// Ep06 cover (1080x1920): title + drawing stay inside the centre 1080x1080 square (grid-safe). No real people, no brands.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Badge, Paper, SeriesTag } from "../../components/Frame";
import { Place } from "../../assets";
import { MedTablet } from "../../assets/characters";
import { HairGuy, Follicle, DropperBottle, Rosemary, ScalpTop, Hexa } from "../../assets/hair";
import { C, FONT } from "../../theme";

export type CoverProps = { variant?: "long" | "short1" | "short2" | "short3" };
const TX = {
  long: { a: "ليه شعرك بيخف؟", b: "الصلع الوراثي والحقيقة كاملة", pill: "DHT • مينوكسيديل • زراعة", sa: 88 },
  short1: { a: "الصلع ما بدأش النهارده!", b: "الحكاية من البصيلة", pill: "الصلع الوراثي • DHT", sa: 76 },
  short2: { a: "مينوكسيديل ولا فيناسترايد؟", b: "الفرق والتحذيرات", pill: "بعد تقييم الطبيب", sa: 64 },
  short3: { a: "زيوت الشعر بتعالج الصلع؟", b: "الأدلة بتقول إيه", pill: "دراسات محدودة", sa: 68 },
};
export const Ep06Cover: React.FC<CoverProps> = ({ variant = "long" }) => { const X = TX[variant]; return (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Paper />
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <circle cx={540} cy={1090} r={310} fill="#FFF3CF" opacity={0.8} />
      {variant === "long" && (<><Place x={300} y={1130} s={1.0}><HairGuy kind="white" /></Place><Place x={780} y={1130} s={1.0}><HairGuy kind="bald" /></Place><Place x={540} y={1010} s={0.5}><Follicle size={0.5} len={0.5} /></Place></>)}
      {variant === "short1" && (<><Place x={540} y={1100} s={1.4}><HairGuy kind="bald" tilt={0.7} /></Place><Place x={830} y={900} s={0.5}><Follicle size={0.45} len={0.4} /></Place></>)}
      {variant === "short2" && (<><Place x={330} y={1060} s={1.2}><DropperBottle /></Place><Place x={760} y={1060} s={1.7}><MedTablet /></Place><Place x={540} y={870} s={0.7}><Hexa /></Place></>)}
      {variant === "short3" && (<><Place x={330} y={1050} s={1.2}><DropperBottle color="#C9B04A" /></Place><Place x={720} y={1060} s={1.2}><Rosemary /></Place><Place x={540} y={880} s={0.55}><ScalpTop hairs={3} recede={1} /></Place></>)}
    </svg>
    <div style={{ position: "absolute", left: 70, width: 940, top: 440, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, transform: "translate(-10px, 12px)", background: C.cardShadow, borderRadius: 44 }} />
        <div style={{ position: "relative", background: C.card, border: `6px solid ${C.ink}`, borderRadius: 44, padding: "26px 48px 34px", direction: "rtl", fontFamily: FONT, fontWeight: 700, textAlign: "center", lineHeight: 1.3, color: C.ink }}>
          <div style={{ fontSize: X.sa, whiteSpace: "nowrap", color: C.key }}>{X.a}</div>
          <div style={{ fontSize: 52, whiteSpace: "nowrap" }}>{X.b}</div>
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 1355, display: "flex", justifyContent: "center", direction: "rtl", fontFamily: FONT }}>
      <div style={{ background: C.iconBg, border: `5px solid ${C.ink}`, borderRadius: 999, padding: "6px 36px 12px", fontSize: 44, fontWeight: 700, color: C.ink }}><bdi>{X.pill}</bdi></div>
    </div>
    <Badge pulses={[]} />
    <SeriesTag text="#الشعر" />
  </AbsoluteFill>
);};
