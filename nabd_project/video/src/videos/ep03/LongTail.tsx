// Ep03 long-form tail (YouTube regular video only): appended after the finished Short so the upload is > 3:00.
// 4 source pages (each item pops in with a soft tick) + a closing card with free space for YouTube end-screen
// elements. Rendered alone and concatenated with ffmpeg (the main video is not re-rendered).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { NabdMark, Paper } from "../../components/Frame";
import { clamp, easeIn, easeOut, popEase, prog } from "../../lib/anim";
import { C, FONT } from "../../theme";

type Src = { name: string; note: string };
const PAGES: { title: string; items: Src[] }[] = [
  { title: "التاريخ والأنف", items: [
    { name: "Spillane 2000 (Johns Hopkins University Press)", note: "مصدر تاريخي: بودرات «الكاتار» بالكوكايين" },
    { name: "Mayo Clin Proc 1977 (Hasegawa & Kern)", note: "دورة المناخير (Nasal cycle)" },
    { name: "CDC", note: "البرد" },
  ] },
  { title: "أنواع الانسداد والبخاخات", items: [
    { name: "NHS", note: "الحساسية، والجيوب الأنفية، والبخاخات المضيّقة" },
    { name: "BSACI", note: "طريقة استخدام بخاخ الأنف" },
    { name: "StatPearls 2026 (NCBI)", note: "الاحتقان الارتدادي" },
  ] },
  { title: "الأرقام والغلطة", items: [
    { name: "J Allergy Clin Immunol Pract 2014", note: "Mehuys et al.: الإفراط عند 49%" },
    { name: "FDA", note: "مية الحنفية مش آمنة لغسيل الأنف" },
    { name: "CDC: Naegleria fowleri", note: "حالات نادرة جداً" },
    { name: "الروابط كاملة في الوصف 👇", note: "" },
  ] },
];
const FADE = 8;          // coral (end of the Short) -> paper
const PAGE = 54;         // 1.8 s per page
const STEP = 9;          // item every 0.3 s
const END_AT = FADE + PAGES.length * PAGE;   // closing card
export const TAIL_FRAMES = END_AT + 99;      // + 3.3 s

const Page: React.FC<{ p: number; f: number }> = ({ p, f }) => {
  const a = FADE + p * PAGE, b = a + PAGE;
  const o = Math.min(prog(f, a, 8), 1 - prog(f, b - 6, 6, easeIn));
  if (o <= 0) return null;
  const pg = PAGES[p];
  return (
    <AbsoluteFill style={{ opacity: o, direction: "rtl", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 92, width: 826, top: 330, textAlign: "center" }}>
        <div style={{ fontSize: 44, fontWeight: 700, color: C.key }}>المصادر</div>
        <div style={{ fontSize: 62, fontWeight: 700, color: C.ink, marginTop: 6 }}>{pg.title}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 18 }}>
          {PAGES.map((_, i) => (<div key={i} style={{ width: 18, height: 18, borderRadius: 9, border: `3px solid ${C.ink}`, background: i === p ? C.key : C.card }} />))}
        </div>
      </div>
      {pg.items.map((it, i) => {
        const t0 = a + 6 + i * STEP;
        const e = interpolate(f, [t0, t0 + 9], [0, 1], { ...clamp, easing: popEase });
        if (e <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 110, width: 790, top: 600 + i * 205, opacity: Math.min(1, e * 1.4), transform: `translateX(${(1 - e) * -60}px) scale(${0.94 + 0.06 * e})` }}>
            <div style={{ position: "absolute", inset: 0, transform: "translate(-8px, 10px)", background: C.cardShadow, borderRadius: 28 }} />
            <div style={{ position: "relative", background: C.card, border: `5px solid ${C.ink}`, borderRadius: 28, padding: "16px 30px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 42, fontWeight: 700, color: C.ink }}><bdi>{it.name}</bdi></div>
              {it.note && <div style={{ fontSize: 30, fontWeight: 500, color: C.source, marginTop: 4 }}>{it.note}</div>}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Ep03LongTail: React.FC = () => {
  const f = useCurrentFrame();
  const coral = 1 - prog(f, 0, FADE, easeOut);
  const end = prog(f, END_AT, 10);
  const ticks = PAGES.flatMap((pg, p) => pg.items.map((_, i) => FADE + p * PAGE + 6 + i * STEP));
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Paper />
      {PAGES.map((_, p) => (<Page key={p} p={p} f={f} />))}
      {end > 0 && (
        <AbsoluteFill style={{ opacity: end, direction: "rtl", fontFamily: FONT, alignItems: "center" }}>
          <div style={{ position: "absolute", top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, transform: `scale(${interpolate(f, [END_AT, END_AT + 12], [0.85, 1], { ...clamp, easing: popEase })})` }}>
            <NabdMark size={200} />
            <div style={{ fontSize: 64, fontWeight: 700, color: C.ink }}>نبض</div>
            <div style={{ fontSize: 40, fontWeight: 600, color: C.ink }}>شكراً إنك كمّلت للآخر</div>
            <div style={{ fontSize: 30, fontWeight: 500, color: C.source }}>شرح مبسط للتوعية، مش بديل لاستشارة الطبيب أو الصيدلي.</div>
          </div>
          {/* lower half left free for YouTube end-screen elements (subscribe + episode 01) */}
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ backgroundColor: C.brand, opacity: coral }} />
      {/* audio: soft hope theme under everything, a quiet tick per source, paper on page turns, heartbeat on the logo */}
      <Audio src={staticFile("audio/music/hope.mp3")} startFrom={30 * 20} volume={(fr) => 0.2 * interpolate(fr, [0, 15, TAIL_FRAMES - 25, TAIL_FRAMES], [0, 1, 1, 0], clamp)} />
      {ticks.map((t, i) => (<Sequence key={i} from={t} durationInFrames={20}><Audio src={staticFile("audio/sfx/tick.wav")} volume={0.12} /></Sequence>))}
      {PAGES.map((_, p) => p > 0 && (<Sequence key={`pg${p}`} from={FADE + p * PAGE - 4} durationInFrames={20}><Audio src={staticFile("audio/sfx/paper.wav")} volume={0.12} /></Sequence>))}
      <Sequence from={END_AT} durationInFrames={30}><Audio src={staticFile("audio/sfx/heartbeat.wav")} volume={0.26} /></Sequence>
    </AbsoluteFill>
  );
};
