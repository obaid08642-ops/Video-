import React, { useMemo } from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Badge, Camera, Paper, SeriesTag, Tray } from "../../components/Frame";
import { Captions } from "../../components/Captions";
import { buildCards, type CaptionData } from "../../lib/captions";
import { FPS, T, type Timing } from "../../lib/timing";
import { schedule, type Cue } from "../../lib/sfx";
import { clamp } from "../../lib/anim";
import captionData from "../../data/ep01_captions.json";
import { Scene1, scene1Cues, scene1Pulses, scene1Tray } from "./Scene1";
import { Scene4, scene4Cues, scene4Pulses } from "./Scene4";
import { Scene7, scene7Cues, scene7Pulses, scene7Silence } from "./Scene7";

export type Ep01Props = { voice: string; mode: "full" | "hook"; timing?: Timing };

export const OUTRO = 1.5; // seconds of the full Nabd logo animation at the end

export const calcEp01: CalculateMetadataFunction<Ep01Props> = async ({ props }) => {
  const res = await fetch(staticFile(`voice/ep01_${props.voice}_timing.json`));
  const timing = (await res.json()) as Timing;
  const t = new T(timing);
  const dur = props.mode === "hook" ? t.s("s1l6@end") + 1.0 : timing.duration + OUTRO;
  return { durationInFrames: Math.ceil(dur * FPS), props: { ...props, timing } };
};

const SCENES: Record<number, React.FC<{ t: T }>> = { 1: Scene1, 4: Scene4, 7: Scene7 };
const has = (t: T, id: string) => t.timing.lines.some((l) => l.id === id);

export const Ep01: React.FC<Ep01Props> = ({ timing, mode }) => {
  const f = useCurrentFrame();
  const t = useMemo(() => new T(timing!), [timing]);
  const cards = useMemo(() => {
    const all = buildCards(timing!, captionData as unknown as CaptionData);
    return mode === "hook" ? all.filter((c) => c.scene === 1) : all;
  }, [timing, mode]);
  const total = Math.ceil((timing!.duration + OUTRO) * FPS);

  const built = (id: number) => SCENES[id] && has(t, `s${id}l1`);
  const cues = useMemo(() => {
    const list: Cue[] = [...scene1Cues(t)];
    if (mode === "full") {
      if (built(4)) list.push(...scene4Cues(t));
      if (built(7)) list.push(...scene7Cues(t));
    }
    return schedule(list, t.keywordSpans());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, mode]);
  const pulses = useMemo(() => {
    const p = [...scene1Pulses(t)];
    if (mode === "full") {
      if (built(4)) p.push(...scene4Pulses(t));
      if (built(7)) p.push(...scene7Pulses(t));
    }
    return p;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, mode]);

  // music ducking from the word timings: barely audible under speech, a little up in pauses
  const mask = useMemo(() => {
    const m = t.speechMask(total);
    const out = new Float32Array(total);
    let v = 0;
    for (let i = 0; i < total; i++) {
      const target = m[i] ? 1 : 0;
      v += (target - v) * (target > v ? 0.45 : 0.08); // fast duck, slow release
      out[i] = v;
    }
    return out;
  }, [t, total]);
  const silence = mode === "full" && built(7) ? scene7Silence(t) : null;
  const musicVol = (frame: number, base = 1) => {
    const duck = 0.45 - 0.27 * (mask[Math.min(frame, total - 1)] ?? 0);
    let v = duck * base;
    if (silence) {
      const s = frame / FPS;
      v *= interpolate(s, [silence[0] - 0.25, silence[0], silence[1], silence[1] + 0.6], [1, 0, 0, 1], clamp);
    }
    return v;
  };

  // scene windows (zoom transitions at the midpoint between scenes)
  const scenes = timing!.scenes.filter((s) => mode === "full" || s.id === 1);
  const bounds = scenes.map((s, i) => {
    const prev = timing!.scenes[timing!.scenes.indexOf(s) - 1];
    const next = timing!.scenes[timing!.scenes.indexOf(s) + 1];
    const a = prev ? Math.round(((prev.end + s.start) / 2) * FPS) : 0;
    const b = next && mode === "full" ? Math.round(((s.end + next.start) / 2) * FPS) : Math.round((s.end + 1.2) * FPS);
    return { id: s.id, a, b, i };
  });

  const tray = scene1Tray(t);
  const curiosityEnd = has(t, "s6l1") ? t.f("s6l1") - 10 : total;

  return (
    <AbsoluteFill style={{ backgroundColor: "#EFE6D6" }}>
      <Paper darken={mode === "full" && has(t, "s6l1") ? interpolate(f, [t.f("s6l1") - 15, t.f("s6l1"), t.f("s7l5@end"), t.f("s7l5@end") + 15], [0, 0.07, 0.07, 0], clamp) : 0} />
      {bounds.map(({ id, a, b }) => {
        const S = SCENES[id];
        if (f < a - 8 || f > b + 8) return null;
        return (
          <Camera key={id} from={a} to={b}>
            {S ? <S t={t} /> : null}
          </Camera>
        );
      })}
      <Captions cards={cards} />
      <Tray items={tray} />
      <Badge pulses={pulses} />
      <SeriesTag text="#الأدوية" />

      {/* audio: voice, music (curiosity from 1 s), sfx */}
      <Audio src={staticFile(`voice/${timing!.audio}`)} />
      <Sequence from={FPS} durationInFrames={curiosityEnd - FPS}>
        <Audio
          src={staticFile("audio/music/curiosity.mp3")}
          volume={(fr) => musicVol(fr + FPS) * interpolate(fr, [0, 30, curiosityEnd - FPS - 30, curiosityEnd - FPS], [0, 1, 1, 0], clamp)}
        />
      </Sequence>
      {cues.map((c, i) => (
        <Sequence key={i} from={Math.round(c.at * FPS)} durationInFrames={2 * FPS}>
          <Audio src={staticFile(`audio/sfx/${c.sfx}.wav`)} volume={c.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
