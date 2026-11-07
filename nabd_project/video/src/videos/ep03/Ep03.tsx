// Ep03 (nasal sprays), the owner's recorded voice. Same engine as Ep02: everything is driven by the timing JSON.
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Badge, Camera, Paper, SeriesTag, Tray } from "../../components/Frame";
import { Captions } from "../../components/Captions";
import { Lock } from "../../assets";
import { buildCards, type CaptionData } from "../../lib/captions";
import { FPS, T, type Timing } from "../../lib/timing";
import { schedule } from "../../lib/sfx";
import { clamp, easeIn, easeInOut, popEase, prog } from "../../lib/anim";
import captionData from "../../data/ep03_captions.json";
import { DISCLAIMER_EP03 as DISCLAIMER_EP02, SCENES_EP03 as SCENES_EP02 } from "./ScenesEp03";
import { C, FONT } from "../../theme";

export type Ep03Props = { voice: string; timing?: Timing };
export const OUTRO = 1.5;
const PROMISE = ["في الآخر:", "غلطة في غسيل المناخير… توصّل حاجة للمخ"];
// closing screen: source names + years, small, under the disclaimer (no extra time)
const SOURCES = ["Spillane 2000 (تاريخي)", "Mayo Clin Proc 1977", "CDC", "NHS", "BSACI", "StatPearls 2026", "J Allergy Clin Immunol Pract 2014",
  "FDA", "CDC: Naegleria fowleri", "النشرات الرسمية"];
const EndText: React.FC<{ color: string; sub: string }> = ({ color, sub }) => (
  <div style={{ position: "absolute", left: 92, width: 826, top: 1240, textAlign: "center", fontFamily: FONT, direction: "rtl" }}>
    <div style={{ fontSize: 30, fontWeight: 600, color, lineHeight: 1.45 }}>{DISCLAIMER_EP02}</div>
    <div style={{ marginTop: 14, fontSize: 21, fontWeight: 500, color: sub, lineHeight: 1.45 }}>
      {"المصادر: "}
      {SOURCES.map((x, i) => (
        <span key={i} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          <bdi>{x}</bdi>{i < SOURCES.length - 1 ? "\u00A0•\u00A0" : ""}
        </span>
      ))}
    </div>
  </div>
);

export const calcEp03: CalculateMetadataFunction<Ep03Props> = async ({ props }) => {
  const timing = (await (await fetch(staticFile(`voice/ep03_${props.voice}_timing.json`))).json()) as Timing;
  return { durationInFrames: Math.ceil((timing.duration + OUTRO) * FPS), props: { ...props, timing } };
};

/** the open loop: big card at the end of the hook -> small lock chip in the corner -> back to the centre
 *  and unlocked when the story starts in scene 8 */
const Promise: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame();
  const bigIn = t.f("s1l6") - 6, fly = t.f("s1l8@end") + 4, back = t.f("s6l5") - 4, gone = t.f("s6l5:غسيل") + 2;
  if (f < bigIn - 2 || f > gone + 12) return null;
  const enter = interpolate(f, [bigIn, bigIn + 10], [0, 1], { ...clamp, easing: popEase });
  const toCorner = prog(f, fly, 16, easeInOut);
  const toCentre = prog(f, back, 14, easeInOut);
  const p = toCorner * (1 - toCentre);              // 0 = centre card, 1 = corner chip
  const unlock = prog(f, t.f("s6l5:وعدتك"), 12);
  const out = prog(f, gone, 10, easeIn);
  // centre card
  const bigO = Math.min(enter, 1 - Math.min(1, p * 1.6)) * (1 - out);
  const chipO = Math.max(0, (p - 0.45) / 0.55);
  return (
    <>
      {bigO > 0.01 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: 1000 - 300 * p, display: "flex", justifyContent: "center", opacity: bigO, transform: `scale(${(0.85 + 0.15 * enter) * (1 - 0.5 * p)})`, transformOrigin: "0% 0%" }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, transform: "translate(-9px, 11px)", background: C.cardShadow, borderRadius: 36 }} />
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 26, direction: "rtl", background: "#FFF3CF", border: `5px solid ${C.ink}`, borderRadius: 36, padding: "26px 34px" }}>
              <svg viewBox="-50 -50 100 100" width={130} height={130}><g transform="scale(1.05)"><Lock open={unlock} /></g></svg>
              <div style={{ fontFamily: FONT, fontWeight: 700, color: C.ink, lineHeight: 1.35 }}>
                <div style={{ fontSize: 40, color: C.key }}>{PROMISE[0]}</div>
                <div style={{ fontSize: 46, whiteSpace: "nowrap" }}>{PROMISE[1]}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {chipO > 0.01 && (
        <div style={{ position: "absolute", left: 40, top: 168, opacity: chipO, transform: `scale(${interpolate(chipO, [0, 1], [0.7, 1], { ...clamp, easing: popEase })})`, transformOrigin: "0% 50%", display: "flex", alignItems: "center", gap: 12, direction: "rtl", background: "#FFF3CF", border: `4px solid ${C.ink}`, borderRadius: 999, padding: "4px 22px 6px 10px" }}>
          <svg viewBox="-50 -50 100 100" width={58} height={58}><Lock /></svg>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 27, color: C.ink, whiteSpace: "nowrap" }}>
            <span style={{ color: C.key }}>{PROMISE[0]} </span>{PROMISE[1]}
          </div>
        </div>
      )}
    </>
  );
};

export const Ep03: React.FC<Ep03Props> = ({ timing }) => {
  const f = useCurrentFrame();
  const t = useMemo(() => new T(timing!), [timing]);
  const cards = useMemo(() => buildCards(timing!, captionData as unknown as CaptionData), [timing]);
  const ids = Object.keys(SCENES_EP02).map(Number);
  const voiceEnd = Math.ceil(timing!.duration * FPS);
  const total = voiceEnd + Math.ceil(OUTRO * FPS);
  const cues = useMemo(() => schedule(ids.flatMap((id) => SCENES_EP02[id].cues(t)), t.keywordSpans()), [t]);
  const pulses = useMemo(() => ids.flatMap((id) => SCENES_EP02[id].pulses(t)), [t]);
  const tray = useMemo(() => ids.flatMap((id) => SCENES_EP02[id].tray?.(t) ?? []), [t]);
  const silences = useMemo(() => ids.flatMap((id) => SCENES_EP02[id].silence?.(t) ?? []), [t]);

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
  // curiosity: hook -> spray types; calm tension: rebound + the tap-water mistake; warm hope: the takeaway
  const tensionAt = t.f("s5l1") - 8, hopeAt = t.f("s6l9") - 8;
  const themes: [string, number, number][] = [["curiosity", FPS, tensionAt], ["tension", tensionAt, hopeAt], ["hope", hopeAt, voiceEnd]];

  const bounds = timing!.scenes.map((s, i, arr) => {
    const prev = arr[i - 1], next = arr[i + 1];
    return { id: s.id, a: prev ? Math.round(((prev.end + s.start) / 2) * FPS) : 0, b: next ? Math.round(((s.end + next.start) / 2) * FPS) : Math.round((s.end + 0.6) * FPS) };
  });
  const tension = interpolate(f, [t.f("s6l6") - 15, t.f("s6l6"), t.f("s6l7@end"), t.f("s6l7@end") + 15], [0, 0.07, 0.07, 0], clamp);
  const discOn = prog(f, voiceEnd - 75, 12);
  const logo = prog(f, voiceEnd, 6);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Paper darken={tension} />
      {bounds.map(({ id, a, b }) => {
        if (f < a - 8 || f > b + 8) return null;
        const S = SCENES_EP02[id].C;
        return (<Camera key={id} from={a} to={b}><S t={t} /></Camera>);
      })}
      <Captions cards={cards} />
      <Tray items={tray} />
      <Promise t={t} />
      <Badge pulses={pulses} />
      <SeriesTag text="#الأدوية" />
      <div style={{ opacity: discOn * (1 - logo) }}><EndText color={C.source} sub={C.source} /></div>
      {f >= voiceEnd && (
        <AbsoluteFill style={{ opacity: logo }}>
          <OffthreadVideo src={staticFile("brand/nabd_intro_vertical_9x16.mp4")} muted playbackRate={2.5} />
          <EndText color="#fff" sub="#FFE3DC" />
        </AbsoluteFill>
      )}

      <Audio src={staticFile(`voice/${timing!.audio}`)} />
      {themes.map(([name, a, b]) => (
        <Sequence key={name} from={a} durationInFrames={b - a + 20}>
          <Audio src={staticFile(`audio/music/${name}.mp3`)} volume={(fr) => musicVol(fr + a) * interpolate(fr, [0, 30, b - a - 10, b - a + 20], [0, 1, 1, 0], clamp)} />
        </Sequence>
      ))}
      {cues.map((c, i) => (
        <Sequence key={i} from={Math.round(c.at * FPS)} durationInFrames={2 * FPS}>
          <Audio src={staticFile(`audio/sfx/${c.sfx}.wav`)} volume={c.vol} />
        </Sequence>
      ))}
      <Sequence from={voiceEnd} durationInFrames={Math.ceil(OUTRO * FPS)}>
        <Audio src={staticFile("audio/sfx/heartbeat.wav")} volume={0.32} />
      </Sequence>
    </AbsoluteFill>
  );
};
