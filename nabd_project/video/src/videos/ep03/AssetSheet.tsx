// Ep03 drawing preview (one frame): every new generic drawing on the paper background, for approval.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Paper } from "../../components/Frame";
import { Place } from "../../assets";
import { Virus } from "../../assets";
import { Pregnant } from "../../assets/ep02";
import { Ahmed, HeadProfile, Kanaka, MysteryCard, NoseSection, Pollen, Polyps, SinusFace, Septum, Spray, SterileBottle, Tap, VintageAd } from "../../assets/ep03";
import { C, FONT } from "../../theme";

const Cap: React.FC<{ x: number; y: number; t: string }> = ({ x, y, t }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.source} direction="rtl">{t}</text>
);
export const Ep03AssetSheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Paper />
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Place x={250} y={330} s={0.48}><VintageAd stamp={1} /></Place><Cap x={250} y={540} t="الإعلان القديم" />
      <Place x={560} y={330} s={0.5}><NoseSection l={0.9} r={0.15} /></Place><Cap x={560} y={540} t="القرينات (شيفتات)" />
      <Place x={860} y={330} s={0.6}><Ahmed spray stuffy={1} mood={-0.3} /></Place><Cap x={860} y={540} t="أحمد" />
      {[["#E4EEF3", "ملح"], ["#F2D79A", "كورتيزون"], ["#CFE3B8", "مضاد هيستامين"], ["#CFC6E6", "مضيّق أوعية"]].map(([c, l], i) => (
        <Place key={i} x={150 + i * 260} y={760} s={0.72}><Spray color={c} label={l} puff={i === 3 ? 0.4 : 0} /></Place>
      ))}
      <Cap x={540} y={920} t="4 بخاخات عامة (من غير أي ماركة)" />
      {[<Virus key="v" />, <Pollen key="p" />, <SinusFace key="s" />, <Septum key="d" />, <Polyps key="o" />, <Pregnant key="g" />].map((n, i) => (
        <g key={i}><rect x={60 + (i % 3) * 330} y={980 + Math.floor(i / 3) * 280} width={300} height={250} rx={26} fill={C.card} stroke={C.ink} strokeWidth={5} />
          <Place x={210 + (i % 3) * 330} y={1100 + Math.floor(i / 3) * 280} s={0.55}>{n}</Place></g>
      ))}
      <Place x={540} y={1650} s={0.6}><MysteryCard open={1} text="الاحتقان الارتدادي" sub="Rhinitis medicamentosa" /></Place>
      <Place x={180} y={1660} s={0.5}><HeadProfile good={1} bad={1} /></Place>
      <Place x={860} y={1560} s={0.45}><Tap /></Place>
      <Place x={800} y={1760} s={0.35}><SterileBottle /></Place>
      <Place x={950} y={1770} s={0.35}><Kanaka f={10} /></Place>
    </svg>
  </AbsoluteFill>
);
