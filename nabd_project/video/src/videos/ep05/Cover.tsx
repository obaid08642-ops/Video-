// Ep05 cover (1080x1920): title + drawing stay inside the centre 1080x1080 square (grid-safe). No real people, no brands.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Badge, Paper, SeriesTag } from "../../components/Frame";
import { Place, Clock } from "../../assets";
import { Moon } from "../../assets/more";
import { PatientM, MedTablet, DoctorF, PharmacistM } from "../../assets/characters";
import { Brain } from "../../assets/ep02";
import { Cup } from "./ScenesEp05";
import { C, FONT } from "../../theme";

export type CoverProps = { variant?: "long" | "short1" | "short2" | "short3" };
const TX = {
  long: { a: "مين سرق نومك؟", b: "الأرق والمنومات… بالعلم", pill: "الأرق • الميلاتونين • CBT-I", sa: 84 },
  short1: { a: "القهوة بتخليك فايق…", b: "بس مش بتمسح التعب!", pill: "ضغط النوم • Adenosine", sa: 84 },
  short2: { a: "مش كل نوم متلخبط…", b: "اسمه أرق! (4 حالات)", pill: "أرق • انقطاع نفس • تململ", sa: 84 },
  short3: { a: "ميلاتونين ولا منوّم؟", b: "الفرق اللي لازم تعرفه", pill: "مش علاج سحري", sa: 84 },
};
export const Ep05Cover: React.FC<CoverProps> = ({ variant = "long" }) => { const X = TX[variant]; return (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Paper />
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <circle cx={540} cy={1090} r={310} fill="#FFF3CF" opacity={0.8} />
      {variant === "long" && (<><Place x={540} y={1130} s={1.35}><PatientM /></Place><Place x={250} y={900} s={0.95}><Moon /></Place><Place x={830} y={900} s={0.85}><Clock a={40} /></Place><Place x={800} y={1290} s={0.7}><MedTablet /></Place></>)}
      {variant === "short1" && (<><Place x={420} y={1090} s={1.5}><Cup /></Place><Place x={790} y={1000} s={1.0}><Brain /></Place><Place x={820} y={1250} s={0.6}><Clock a={150} /></Place></>)}
      {variant === "short2" && (<><Place x={540} y={1030} s={1.15}><DoctorF /></Place><Place x={250} y={880} s={0.9}><Clock a={200} /></Place><Place x={830} y={900} s={0.9}><Moon /></Place></>)}
      {variant === "short3" && (<><Place x={420} y={1030} s={1.05}><PharmacistM /></Place><Place x={790} y={1060} s={1.6}><MedTablet /></Place><Place x={830} y={850} s={0.8}><Moon /></Place></>)}
    </svg>
    <div style={{ position: "absolute", left: 70, width: 940, top: 440, display: "flex", justifyContent: "center" }}>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, transform: "translate(-10px, 12px)", background: C.cardShadow, borderRadius: 44 }} />
        <div style={{ position: "relative", background: C.card, border: `6px solid ${C.ink}`, borderRadius: 44, padding: "26px 48px 34px", direction: "rtl", fontFamily: FONT, fontWeight: 700, textAlign: "center", lineHeight: 1.3, color: C.ink }}>
          <div style={{ fontSize: X.sa, whiteSpace: "nowrap", color: C.key }}>{X.a}</div>
          <div style={{ fontSize: 56, whiteSpace: "nowrap" }}>{X.b}</div>
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 1355, display: "flex", justifyContent: "center", direction: "rtl", fontFamily: FONT }}>
      <div style={{ background: C.iconBg, border: `5px solid ${C.ink}`, borderRadius: 999, padding: "6px 36px 12px", fontSize: 46, fontWeight: 700, color: C.ink }}>{X.pill}</div>
    </div>
    <Badge pulses={[]} />
    <SeriesTag text="#النوم" />
  </AbsoluteFill>
);};
