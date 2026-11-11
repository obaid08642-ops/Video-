// Ep05 («مين سرق نومك؟», sleep / insomnia / sleeping pills), the owner's recorded voice. One long 9:16 video.
// Everything (captions, drawings, sounds) is driven by public/voice/ep05_recording_timing.json.
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Badge, Camera, NabdMark, Paper, SeriesTag } from "../../components/Frame";
import { Captions } from "../../components/Captions";
import { buildCards, type CaptionData } from "../../lib/captions";
import { FPS, T, type Timing } from "../../lib/timing";
import { schedule } from "../../lib/sfx";
import { clamp, easeOut, popEase, prog } from "../../lib/anim";
import captionData from "../../data/ep05_captions.json";
import { DISCLAIMER_EP05, SCENES_EP05, THEME_EP05 } from "./ScenesEp05";
import { C, FONT } from "../../theme";

export type Ep05Props = { timing?: Timing };
const LOGO = 1.5, ENDCARD = 7.0;
const SOURCES = ["AASM", "VA/DoD 2025", "NCCIH", "FDA", "AAP", "Endotext"];
export const calcEp05: CalculateMetadataFunction<Ep05Props> = async () => {
  const timing = (await (await fetch(staticFile("voice/ep05_recording_timing.json"))).json()) as Timing;
  return { durationInFrames: Math.ceil((timing.duration + LOGO + ENDCARD) * FPS), props: { timing } };
};

const SourceLine: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ position: "absolute", left: 92, width: 826, top: 1240, textAlign: "center", fontFamily: FONT, direction: "rtl" }}>
    <div style={{ fontSize: 30, fontWeight: 600, color, lineHeight: 1.45 }}>{DISCLAIMER_EP05}</div>
    <div style={{ marginTop: 14, fontSize: 21, fontWeight: 500, color, lineHeight: 1.45 }}>
      {"المصادر: "}{SOURCES.map((x, i) => (<span key={i} style={{ display: "inline-block", whiteSpace: "nowrap" }}><bdi>{x}</bdi>{i < SOURCES.length - 1 ? " • " : ""}</span>))}
    </div>
  </div>
);

export const Ep05: React.FC<Ep05Props> = ({ timing }) => {
  const f = useCurrentFrame();
  const t = useMemo(() => new T(timing!), [timing]);
  const cards = useMemo(() => buildCards(timing!, captionData as unknown as CaptionData), [timing]);
  const ids = timing!.scenes.map((s) => s.id);
  const voiceEnd = Math.ceil(timing!.duration * FPS);
  const logoEnd = voiceEnd + Math.ceil(LOGO * FPS);
  const total = logoEnd + Math.ceil(ENDCARD * FPS);
  const cues = useMemo(() => schedule(ids.flatMap((id) => SCENES_EP05[id].cues(t)).filter((c) => c.at > 0 && c.at < timing!.duration), t.keywordSpans()), [t]);
  const pulses = useMemo(() => ids.flatMap((id) => SCENES_EP05[id].pulses(t)).filter((p) => p < voiceEnd), [t]);
  const mask = useMemo(() => {
    const m = t.speechMask(total); const out = new Float32Array(total); let v = 0;
    for (let i = 0; i < total; i++) { const g = m[i] ? 1 : 0; v += (g - v) * (g > v ? 0.45 : 0.08); out[i] = v; }
    return out;
  }, [t, total]);
  const musicVol = (frame: number) => 0.40 - 0.24 * (mask[Math.min(frame, total - 1)] ?? 0);
  const bounds = timing!.scenes.map((s, i, arr) => {
    const prev = arr[i - 1], next = arr[i + 1];
    return { id: s.id, a: prev ? Math.round(((prev.end + s.start) / 2) * FPS) : 0, b: next ? Math.round(((s.end + next.start) / 2) * FPS) : voiceEnd + 10 };
  });
  const themes = useMemo(() => {
    const out: [string, number, number][] = [];
    for (const b of bounds) {
      const th = THEME_EP05[b.id]; const last = out[out.length - 1];
      if (last && last[0] === th) last[2] = b.b; else out.push([th, out.length ? b.a : FPS, b.b]);
    }
    out[out.length - 1][2] = voiceEnd;
    return out;
  }, [timing]);
  const discOn = prog(f, voiceEnd - 75, 12), logo = prog(f, voiceEnd, 6);
  const inEnd = f >= logoEnd - 6;
  const endIn = prog(f, logoEnd, 10, easeOut);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Paper />
      {!inEnd && bounds.map(({ id, a, b }) => {
        if (f < a - 8 || f > b + 8) return null;
        const S = SCENES_EP05[id].C;
        return (<Camera key={id} from={a} to={b}><S t={t} /></Camera>);
      })}
      {!inEnd && <Captions cards={cards} />}
      {!inEnd && <Badge pulses={pulses} />}
      {!inEnd && <SeriesTag text="#النوم" />}
      {!inEnd && f < voiceEnd && (<div style={{ opacity: discOn * (1 - logo) }}><SourceLine color={C.source} /></div>)}
      {f >= voiceEnd && f < logoEnd && (
        <AbsoluteFill style={{ opacity: logo }}>
          <OffthreadVideo src={staticFile("brand/nabd_intro_vertical_9x16.mp4")} muted playbackRate={2.5} />
          <SourceLine color="#fff" />
        </AbsoluteFill>
      )}
      {inEnd && (
        <AbsoluteFill style={{ direction: "rtl", fontFamily: FONT, alignItems: "center" }}>
          <Paper />
          <div style={{ position: "absolute", top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: endIn, transform: `scale(${interpolate(f, [logoEnd, logoEnd + 14], [0.9, 1], { ...clamp, easing: popEase })})` }}>
            <NabdMark size={200} />
            <div style={{ fontSize: 64, fontWeight: 700, color: C.ink }}>نبض</div>
            <div style={{ fontSize: 42, fontWeight: 600, color: C.ink }}>شكراً إنك كمّلت للآخر</div>
            <div style={{ fontSize: 34, fontWeight: 600, color: C.key, marginTop: 10 }}>اكتب في التعليقات: تحب نفهم إيه في الحلقة الجاية؟</div>
            <div style={{ fontSize: 30, fontWeight: 500, color: C.source, width: 780, textAlign: "center", lineHeight: 1.5 }}>{DISCLAIMER_EP05}</div>
            <div style={{ fontSize: 24, fontWeight: 500, color: C.source }}>{"المصادر: "}{SOURCES.map((x, i) => (<span key={i}><bdi>{x}</bdi>{i < SOURCES.length - 1 ? " • " : ""}</span>))}</div>
          </div>
        </AbsoluteFill>
      )}
      <Audio src={staticFile("voice/ep05_recording.flac")} />
      {themes.map(([name, a, b], i) => (
        <Sequence key={i} from={a} durationInFrames={b - a + 20}>
          <Audio src={staticFile(`audio/music/${name}.mp3`)} loop loopVolumeCurveBehavior="extend" volume={(fr) => musicVol(fr + a) * interpolate(fr, [0, 30, b - a - 10, b - a + 20], [0, 1, 1, 0], clamp)} />
        </Sequence>
      ))}
      {cues.map((c, i) => (<Sequence key={i} from={Math.round(c.at * FPS)} durationInFrames={2 * FPS}><Audio src={staticFile(`audio/sfx/${c.sfx}.wav`)} volume={c.vol} /></Sequence>))}
      <Sequence from={voiceEnd} durationInFrames={Math.ceil(1.5 * FPS)}><Audio src={staticFile("audio/sfx/heartbeat.wav")} volume={0.32} /></Sequence>
      <Sequence from={logoEnd} durationInFrames={Math.ceil(ENDCARD * FPS)}>
        <Audio src={staticFile("audio/music/hope.mp3")} startFrom={30 * 20} volume={(fr) => 0.2 * interpolate(fr, [0, 15, ENDCARD * FPS - 25, ENDCARD * FPS], [0, 1, 1, 0], clamp)} />
      </Sequence>
    </AbsoluteFill>
  );
};
