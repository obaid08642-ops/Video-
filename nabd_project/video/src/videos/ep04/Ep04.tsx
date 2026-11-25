// Ep04 (paracetamol), the owner's recorded voice. One engine, three videos: the long one (9:16, sources pages at the end)
// and two Shorts built from the SAME recording. Everything is driven by the timing JSON of the chosen voice.
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Badge, Camera, NabdMark, Paper, SeriesTag, Tray } from "../../components/Frame";
import { Captions } from "../../components/Captions";
import { buildCards, type CaptionData } from "../../lib/captions";
import { FPS, T, type Timing } from "../../lib/timing";
import { schedule } from "../../lib/sfx";
import { clamp, easeIn, easeOut, popEase, prog } from "../../lib/anim";
import captionData from "../../data/ep04_captions.json";
import { DISCLAIMER_EP04, SCENES_EP04, THEME_EP04 } from "./ScenesEp04";
import { C, FONT } from "../../theme";

export type Ep04Props = { voice: "long" | "short1" | "short2" | "short3" | "short4"; timing?: Timing };
const SHORT_OUTRO = 3.0;      // logo + «الحلقة الكاملة على القناة»
const LONG_OUTRO = 1.5;       // logo; the sources pages follow (SRC_FRAMES)
const PAGE = 66, STEP = 10, FADE = 8;
type Src = { name: string; note: string };
const PAGES: { title: string; items: Src[] }[] = [
  { title: "الجرعة المضاعفة", items: [
    { name: "FDA: Don't Double Up on Acetaminophen", note: "أكتر من 600 دوا فيها الأسيتامينوفين" },
    { name: "Merck Manual • UCSF", note: "علاج التسمم بـ NAC (أول 8 ساعات، وبعدها كمان)" },
  ] },
  { title: "القصة والآلية", items: [
    { name: "Eur J Pain 2015 (Brune et al.)", note: "قصة 1886 والأسيتانيلايد" },
    { name: "J Pharmacol Exp Ther 1948", note: "Brodie & Axelrod: «The fate of acetanilide in man»" },
    { name: "J Biol Chem 2005 (Högestätt et al.)", note: "AM404" },
  ] },
  { title: "الحمل والتوحد", items: [
    { name: "ACOG (22 Sept 2025)", note: "بيان المنظمة عن الأسيتامينوفين في الحمل" },
    { name: "Environ Health 2025 (Prada et al.)", note: "مراجعة الـ 46 دراسة: ارتباط محتمل، مش إثبات سببية" },
    { name: "JAMA 2024 (Ahlqvist et al.)", note: "السويد: تحليل الإخوات" },
    { name: "JAMA Pediatrics 2026 (Prahm et al.)", note: "الدنمارك" },
  ] },
];
export const SRC_FRAMES = FADE + PAGES.length * PAGE + 66;
const SOURCES_LONG = ["FDA", "ACOG 2025", "Environ Health 2025", "JAMA 2024", "JAMA Pediatrics 2026", "Eur J Pain 2015", "J Pharmacol Exp Ther 1948", "J Biol Chem 2005", "Merck Manual"];
const SOURCES_S1 = ["FDA", "Merck Manual", "UCSF"];
const SOURCES_S2 = ["ACOG 2025", "Environ Health 2025", "JAMA 2024", "JAMA Pediatrics 2026"];
const SOURCES_S3 = ["J Biol Chem 2005"];
const SOURCES_S4 = ["Eur J Pain 2015", "J Pharmacol Exp Ther 1948"];
// Shorts 3/4 keep only SOME lines of scenes 1/3/4/5 (long ids), so an anchor on a line that is not in the Short must not throw:
// it resolves to "never" (1e5 s) and that beat simply does not appear. (Shorts 1/2 keep the strict T on purpose.)
const lenient = (t: T): T => new Proxy(t, {
  get(tg, p, r) {
    if (p === "s") return (a: string) => { try { return tg.s(a); } catch { return 1e5; } };
    if (p === "f") return (a: string) => Math.round((r as T).s(a) * FPS);
    return Reflect.get(tg, p, tg);
  },
});

const EndText: React.FC<{ color: string; sub: string; sources: string[] }> = ({ color, sub, sources }) => (
  <div style={{ position: "absolute", left: 92, width: 826, top: 1240, textAlign: "center", fontFamily: FONT, direction: "rtl" }}>
    <div style={{ fontSize: 30, fontWeight: 600, color, lineHeight: 1.45 }}>{DISCLAIMER_EP04}</div>
    <div style={{ marginTop: 14, fontSize: 21, fontWeight: 500, color: sub, lineHeight: 1.45 }}>
      {"المصادر: "}
      {sources.map((x, i) => (
        <span key={i} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          <bdi>{x}</bdi>{i < sources.length - 1 ? " • " : ""}
        </span>
      ))}
    </div>
  </div>
);

const outroOf = (v: string) => (v === "long" ? LONG_OUTRO : SHORT_OUTRO);
export const calcEp04: CalculateMetadataFunction<Ep04Props> = async ({ props }) => {
  const timing = (await (await fetch(staticFile(`voice/ep04_${props.voice}_timing.json`))).json()) as Timing;
  return { durationInFrames: Math.ceil((timing.duration + outroOf(props.voice)) * FPS) + (props.voice === "long" ? SRC_FRAMES : 0), props: { ...props, timing } };
};

const SrcPage: React.FC<{ p: number; f: number; a0: number }> = ({ p, f, a0 }) => {
  const a = a0 + FADE + p * PAGE, b = a + PAGE;
  const o = Math.min(prog(f, a, 8), 1 - prog(f, b - 6, 6, easeIn));
  if (o <= 0) return null;
  const pg = PAGES[p];
  return (
    <AbsoluteFill style={{ opacity: o, direction: "rtl", fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 92, width: 826, top: 300, textAlign: "center" }}>
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
          <div key={i} style={{ position: "absolute", left: 110, width: 790, top: 540 + i * 215, opacity: Math.min(1, e * 1.4), transform: `translateX(${(1 - e) * -60}px) scale(${0.94 + 0.06 * e})` }}>
            <div style={{ position: "absolute", inset: 0, transform: "translate(-8px, 10px)", background: C.cardShadow, borderRadius: 28 }} />
            <div style={{ position: "relative", background: C.card, border: `5px solid ${C.ink}`, borderRadius: 28, padding: "14px 30px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 40, fontWeight: 700, color: C.ink }}><bdi>{it.name}</bdi></div>
              <div style={{ fontSize: 29, fontWeight: 500, color: C.source, marginTop: 4 }}><bdi>{it.note}</bdi></div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Ep04: React.FC<Ep04Props> = ({ voice, timing }) => {
  const f = useCurrentFrame();
  const t0 = useMemo(() => new T(timing!), [timing]);
  const t = useMemo(() => (voice === "short3" || voice === "short4" ? lenient(t0) : t0), [t0, voice]);
  const cards = useMemo(() => buildCards(timing!, captionData as unknown as CaptionData), [timing]);
  const ids = timing!.scenes.map((s) => s.id);
  const voiceEnd = Math.ceil(timing!.duration * FPS);
  const outro = Math.ceil(outroOf(voice) * FPS);
  const total = voiceEnd + outro;
  const cues = useMemo(() => schedule(ids.flatMap((id) => SCENES_EP04[id].cues(t)).filter((c) => c.at < timing!.duration + 1), t.keywordSpans()), [t]);
  const pulses = useMemo(() => ids.flatMap((id) => SCENES_EP04[id].pulses(t)).filter((p) => p < total), [t, total]);
  const tray = useMemo(() => ids.flatMap((id) => SCENES_EP04[id].tray?.(t) ?? []), [t]);
  const silences = useMemo(() => ids.flatMap((id) => SCENES_EP04[id].silence?.(t) ?? []), [t]);

  const mask = useMemo(() => {
    const m = t.speechMask(total); const out = new Float32Array(total); let v = 0;
    for (let i = 0; i < total; i++) { const g = m[i] ? 1 : 0; v += (g - v) * (g > v ? 0.45 : 0.08); out[i] = v; }
    return out;
  }, [t, total]);
  const musicVol = (frame: number) => {
    let v = 0.45 - 0.27 * (mask[Math.min(frame, total - 1)] ?? 0);
    const s = frame / FPS;
    for (const [a, b] of silences) v *= interpolate(s, [a - 0.25, a, b, b + 0.5], [1, 0, 0, 1], clamp);
    return v;
  };
  // music themes follow the scenes (curiosity -> tension -> hope), merged when neighbours share a theme
  const bounds = timing!.scenes.map((s, i, arr) => {
    const prev = arr[i - 1], next = arr[i + 1];
    return { id: s.id, a: prev ? Math.round(((prev.end + s.start) / 2) * FPS) : 0, b: next ? Math.round(((s.end + next.start) / 2) * FPS) : Math.round((s.end + 0.6) * FPS) };
  });
  const themes = useMemo(() => {
    const out: [string, number, number][] = [];
    for (const b of bounds) {
      const th = THEME_EP04[b.id];
      const last = out[out.length - 1];
      if (last && last[0] === th) last[2] = b.b; else out.push([th, out.length ? b.a : FPS, b.b]);
    }
    out[out.length - 1][2] = voiceEnd;
    return out;
  }, [timing]);

  // a soft darkening while the liver is attacked (long) / always-on feel for the liver Short is not needed
  const tension = t.has("s7l12") && t.has("s7l15") ? interpolate(f, [t.f("s7l12") - 15, t.f("s7l12"), t.f("s7l15@end"), t.f("s7l15@end") + 15], [0, 0.07, 0.07, 0], clamp) : 0;
  const discOn = prog(f, voiceEnd - 75, 12);
  const logo = prog(f, voiceEnd, 6);
  const sources = { long: SOURCES_LONG, short1: SOURCES_S1, short2: SOURCES_S2, short3: SOURCES_S3, short4: SOURCES_S4 }[voice];
  const srcStart = voiceEnd + outro;
  const inSrc = voice === "long" && f >= srcStart - 6;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Paper darken={tension} />
      {!inSrc && bounds.map(({ id, a, b }) => {
        if (f < a - 8 || f > b + 8) return null;
        const S = SCENES_EP04[id].C;
        return (<Camera key={id} from={a} to={b}><S t={t} /></Camera>);
      })}
      {!inSrc && <Captions cards={cards} />}
      {!inSrc && <Tray items={tray} />}
      {!inSrc && <Badge pulses={pulses} />}
      {!inSrc && <SeriesTag text="#الأدوية" />}
      {!inSrc && (<div style={{ opacity: discOn * (1 - logo) }}><EndText color={C.source} sub={C.source} sources={sources} /></div>)}
      {f >= voiceEnd && f < srcStart && (
        <AbsoluteFill style={{ opacity: logo }}>
          <OffthreadVideo src={staticFile("brand/nabd_intro_vertical_9x16.mp4")} muted playbackRate={2.5} />
          {voice === "long" ? (
            <EndText color="#fff" sub="#FFE3DC" sources={sources} />
          ) : (
            <div style={{ position: "absolute", left: 60, width: 960, top: 1290, textAlign: "center", fontFamily: FONT, direction: "rtl" }}>
              <div style={{ display: "inline-block", background: "#FFF3CF", border: `6px solid ${C.ink}`, borderRadius: 44, padding: "18px 44px 26px", transform: `scale(${interpolate(f, [voiceEnd + 6, voiceEnd + 18], [0.85, 1], { ...clamp, easing: popEase })})` }}>
                <div style={{ fontSize: 66, fontWeight: 700, color: C.ink, whiteSpace: "nowrap" }}>الحلقة الكاملة على القناة</div>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}
      {voice === "long" && f >= srcStart - 6 && (
        <AbsoluteFill>
          <Paper />
          {PAGES.map((_, p) => (<SrcPage key={p} p={p} f={f} a0={srcStart} />))}
          {f >= srcStart + FADE + PAGES.length * PAGE && (
            <AbsoluteFill style={{ opacity: prog(f, srcStart + FADE + PAGES.length * PAGE, 10), direction: "rtl", fontFamily: FONT, alignItems: "center" }}>
              <div style={{ position: "absolute", top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                <NabdMark size={200} />
                <div style={{ fontSize: 64, fontWeight: 700, color: C.ink }}>نبض</div>
                <div style={{ fontSize: 40, fontWeight: 600, color: C.ink }}>شكراً إنك كمّلت للآخر</div>
                <div style={{ fontSize: 30, fontWeight: 500, color: C.source }}>{DISCLAIMER_EP04}</div>
              </div>
            </AbsoluteFill>
          )}
          <AbsoluteFill style={{ backgroundColor: C.brand, opacity: 1 - prog(f, srcStart - 6, 8, easeOut) }} />
        </AbsoluteFill>
      )}

      <Audio src={staticFile(`voice/${timing!.audio}`)} />
      {!inSrc && themes.map(([name, a, b], i) => (
        <Sequence key={i} from={a} durationInFrames={b - a + 20}>
          <Audio src={staticFile(`audio/music/${name}.mp3`)} loop loopVolumeCurveBehavior="extend" volume={(fr) => musicVol(fr + a) * interpolate(fr, [0, 30, b - a - 10, b - a + 20], [0, 1, 1, 0], clamp)} />
        </Sequence>
      ))}
      {cues.map((c, i) => (
        <Sequence key={i} from={Math.round(c.at * FPS)} durationInFrames={2 * FPS}>
          <Audio src={staticFile(`audio/sfx/${c.sfx}.wav`)} volume={c.vol} />
        </Sequence>
      ))}
      <Sequence from={voiceEnd} durationInFrames={Math.ceil(1.5 * FPS)}>
        <Audio src={staticFile("audio/sfx/heartbeat.wav")} volume={0.32} />
      </Sequence>
      {voice === "long" && (
        <>
          <Sequence from={srcStart} durationInFrames={SRC_FRAMES}>
            <Audio src={staticFile("audio/music/hope.mp3")} startFrom={30 * 20} volume={(fr) => 0.2 * interpolate(fr, [0, 15, SRC_FRAMES - 25, SRC_FRAMES], [0, 1, 1, 0], clamp)} />
          </Sequence>
          {PAGES.flatMap((pg, p) => pg.items.map((_, i) => srcStart + FADE + p * PAGE + 6 + i * STEP)).map((a, i) => (<Sequence key={`tk${i}`} from={a} durationInFrames={20}><Audio src={staticFile("audio/sfx/tick.wav")} volume={0.12} /></Sequence>))}
          {PAGES.map((_, p) => p > 0 && (<Sequence key={`pg${p}`} from={srcStart + FADE + p * PAGE - 4} durationInFrames={20}><Audio src={staticFile("audio/sfx/paper.wav")} volume={0.12} /></Sequence>))}
        </>
      )}
    </AbsoluteFill>
  );
};
