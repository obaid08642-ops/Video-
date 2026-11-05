// Ep01, recorded voice (v9). Same engine as before: everything is driven by the timing JSON.
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Badge, Camera, Paper, SeriesTag, Tray } from "../../components/Frame";
import { Captions } from "../../components/Captions";
import { buildCards, type CaptionData } from "../../lib/captions";
import { FPS, T, type Timing } from "../../lib/timing";
import { schedule } from "../../lib/sfx";
import { clamp, prog } from "../../lib/anim";
import captionData from "../../data/ep01_captions_v9.json";
import { DISCLAIMER, SCENES_V9, retakeStarts } from "./ScenesV9";
import { C, FONT } from "../../theme";

export type EpV9Props = { voice: string; timing?: Timing };
export const OUTRO = 1.5;

export const calcEpV9: CalculateMetadataFunction<EpV9Props> = async ({ props }) => {
  const timing = (await (await fetch(staticFile(`voice/ep01_${props.voice}_timing.json`))).json()) as Timing;
  return { durationInFrames: Math.ceil((timing.duration + OUTRO) * FPS), props: { ...props, timing } };
};

export const EpV9: React.FC<EpV9Props> = ({ timing }) => {
  const f = useCurrentFrame();
  const t = useMemo(() => new T(timing!), [timing]);
  const cards = useMemo(() => buildCards(timing!, captionData as unknown as CaptionData), [timing]);
  const ids = Object.keys(SCENES_V9).map(Number);
  const voiceEnd = Math.ceil(timing!.duration * FPS);
  const total = voiceEnd + Math.ceil(OUTRO * FPS);
  const cues = useMemo(() => schedule(ids.flatMap((id) => SCENES_V9[id].cues(t)), t.keywordSpans()), [t]);
  const pulses = useMemo(() => ids.flatMap((id) => SCENES_V9[id].pulses(t)), [t]);
  const tray = useMemo(() => ids.flatMap((id) => SCENES_V9[id].tray?.(t) ?? []), [t]);
  const silences = useMemo(() => ids.flatMap((id) => SCENES_V9[id].silence?.(t) ?? []), [t]);
  const swells = useMemo(() => retakeStarts(t), [t]);

  // ducking from the word timings; a small lift around each retake start (still under the voice)
  const mask = useMemo(() => {
    const m = t.speechMask(total); const out = new Float32Array(total); let v = 0;
    for (let i = 0; i < total; i++) { const g = m[i] ? 1 : 0; v += (g - v) * (g > v ? 0.45 : 0.08); out[i] = v; }
    return out;
  }, [t, total]);
  const musicVol = (frame: number) => {
    let v = 0.45 - 0.27 * (mask[Math.min(frame, total - 1)] ?? 0);
    const s = frame / FPS;
    for (const a of swells) v *= 1 + 0.35 * interpolate(s, [a - 0.6, a - 0.1, a + 1.2, a + 2.0], [0, 1, 1, 0], clamp);
    for (const [a, b] of silences) v *= interpolate(s, [a - 0.25, a, b, b + 0.5], [1, 0, 0, 1], clamp);
    return v;
  };
  const tensionAt = t.f("s5l1") - 8, hopeAt = t.f("s8l1") - 8;
  const themes: [string, number, number][] = [["curiosity", FPS, tensionAt], ["tension", tensionAt, hopeAt], ["hope", hopeAt, voiceEnd]];

  const bounds = timing!.scenes.map((s, i, arr) => {
    const prev = arr[i - 1], next = arr[i + 1];
    return { id: s.id, a: prev ? Math.round(((prev.end + s.start) / 2) * FPS) : 0, b: next ? Math.round(((s.end + next.start) / 2) * FPS) : Math.round((s.end + 0.6) * FPS) };
  });
  const tension = interpolate(f, [t.f("s6l1") - 15, t.f("s6l1"), t.f("s7l2@end"), t.f("s7l2@end") + 15], [0, 0.07, 0.07, 0], clamp);
  const discOn = prog(f, voiceEnd - 75, 12);
  const logo = prog(f, voiceEnd, 6);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Paper darken={tension} />
      {bounds.map(({ id, a, b }) => {
        if (f < a - 8 || f > b + 8) return null;
        const S = SCENES_V9[id].C;
        return (<Camera key={id} from={a} to={b}><S t={t} /></Camera>);
      })}
      <Captions cards={cards} />
      <Tray items={tray} />
      <Badge pulses={pulses} />
      <SeriesTag text="#الأدوية" />
      {/* closing screen: disclaimer (last ~2.5 s of voice + logo) */}
      <div style={{ position: "absolute", left: 92, width: 826, top: 1370, textAlign: "center", fontFamily: FONT, direction: "rtl", opacity: discOn * (1 - logo), fontSize: 30, fontWeight: 600, color: C.source, lineHeight: 1.45 }}>
        {DISCLAIMER}
      </div>
      {f >= voiceEnd && (
        <AbsoluteFill style={{ opacity: logo }}>
          <OffthreadVideo src={staticFile("brand/nabd_intro_vertical_9x16.mp4")} muted playbackRate={2.5} />
          <div style={{ position: "absolute", left: 92, width: 826, top: 1380, textAlign: "center", fontFamily: FONT, fontSize: 30, fontWeight: 600, color: "#fff", direction: "rtl", lineHeight: 1.45 }}>{DISCLAIMER}</div>
        </AbsoluteFill>
      )}

      <Audio src={staticFile(`voice/${timing!.audio}`)} />
      {themes.map(([name, a, b]) => (
        <Sequence key={name} from={a} durationInFrames={b - a + 20}>
          <Audio src={staticFile(`audio/music/${name}.mp3`)} volume={(fr) => musicVol(fr + a) * interpolate(fr, [0, 30, b - a - 10, b - a + 20], [0, 1, 1, 0], clamp)} />
        </Sequence>
      ))}
      {swells.map((s, i) => (
        <Sequence key={`sw${i}`} from={Math.max(0, Math.round((s - 0.55) * FPS))} durationInFrames={Math.round(2.3 * FPS)}>
          <Audio src={staticFile("audio/sfx/swell.wav")} volume={0.16} />
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
