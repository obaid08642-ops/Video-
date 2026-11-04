import React, { useMemo } from "react";
import { AbsoluteFill, Audio, CalculateMetadataFunction, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Badge, Camera, Paper, SeriesTag, Tray, type TrayItem } from "../../components/Frame";
import { Captions } from "../../components/Captions";
import { buildCards, type CaptionData } from "../../lib/captions";
import { FPS, T, type Timing } from "../../lib/timing";
import { schedule, type Cue } from "../../lib/sfx";
import { clamp } from "../../lib/anim";
import captionData from "../../data/ep01_captions.json";
import { Scene1, scene1Cues, scene1Pulses, scene1Tray } from "./Scene1";
import { Scene4, scene4Cues, scene4Pulses } from "./Scene4";
import { Scene7, scene7Cues, scene7Pulses, scene7Silence } from "./Scene7";
import { Outro, Scene2, Scene3, Scene5, Scene6, Scene8, Scene9, scene2, scene3, scene5, scene6, scene8, scene9 } from "./ScenesRest";

export type Ep01Props = { voice: string; mode: "full" | "hook"; timing?: Timing };

export const OUTRO = 1.5; // seconds of the full Nabd logo animation at the end

export const calcEp01: CalculateMetadataFunction<Ep01Props> = async ({ props }) => {
  const res = await fetch(staticFile(`voice/ep01_${props.voice}_timing.json`));
  const timing = (await res.json()) as Timing;
  const t = new T(timing);
  const dur = props.mode === "hook" ? t.s("s1l6@end") + 1.0 : timing.duration + OUTRO;
  return { durationInFrames: Math.ceil(dur * FPS), props: { ...props, timing } };
};

type SceneDef = {
  C: React.FC<{ t: T }>;
  cues: (t: T) => Cue[];
  pulses: (t: T) => number[];
  tray?: (t: T) => TrayItem[];
  silence?: (t: T) => [number, number];
};
const SCENES: Record<number, SceneDef> = {
  1: { C: Scene1, cues: scene1Cues, pulses: scene1Pulses, tray: scene1Tray },
  2: { C: Scene2, ...scene2 },
  3: { C: Scene3, ...scene3 },
  4: { C: Scene4, cues: scene4Cues, pulses: scene4Pulses },
  5: { C: Scene5, ...scene5 },
  6: { C: Scene6, ...scene6 },
  7: { C: Scene7, cues: scene7Cues, pulses: scene7Pulses, silence: scene7Silence },
  8: { C: Scene8, ...scene8 },
  9: { C: Scene9, ...scene9 },
};

export const Ep01: React.FC<Ep01Props> = ({ timing, mode }) => {
  const f = useCurrentFrame();
  const t = useMemo(() => new T(timing!), [timing]);
  const has = (id: string) => timing!.lines.some((l) => l.id === id);
  const active = useMemo(
    () => Object.keys(SCENES).map(Number).filter((id) => (mode === "hook" ? id === 1 : has(`s${id}l1`))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timing, mode],
  );
  const cards = useMemo(() => buildCards(timing!, captionData as unknown as CaptionData).filter((c) => active.includes(c.scene)), [timing, active]);
  const voiceEnd = Math.ceil(timing!.duration * FPS);
  const total = voiceEnd + Math.ceil(OUTRO * FPS);
  const logoAt = voiceEnd;

  const cues = useMemo(() => schedule(active.flatMap((id) => SCENES[id].cues(t)), t.keywordSpans()), [t, active]);
  const pulses = useMemo(() => active.flatMap((id) => SCENES[id].pulses(t)), [t, active]);
  const tray = useMemo(() => active.flatMap((id) => SCENES[id].tray?.(t) ?? []), [t, active]);
  const silences = useMemo(() => active.flatMap((id) => (SCENES[id].silence ? [SCENES[id].silence!(t)] : [])), [t, active]);

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
  const musicVol = (frame: number) => {
    let v = 0.45 - 0.27 * (mask[Math.min(frame, total - 1)] ?? 0);
    const s = frame / FPS;
    for (const [a, b] of silences) v *= interpolate(s, [a - 0.25, a, b, b + 0.6], [1, 0, 0, 1], clamp);
    return v;
  };
  // three themes: curiosity (hook -> explanation), calm tension (resistance + numbers), warm hope (ending)
  const tensionAt = has("s6l1") && mode === "full" ? t.f("s6l1") - 8 : total;
  const hopeAt = has("s8l1") && mode === "full" ? t.f("s8l1") - 8 : total;
  const themes: [string, number, number][] = [
    ["curiosity", FPS, tensionAt],
    ["tension", tensionAt, hopeAt],
    ["hope", hopeAt, logoAt],
  ];

  // scene windows (zoom transitions at the midpoint between scenes)
  const scenes = timing!.scenes.filter((s) => active.includes(s.id));
  const bounds = scenes.map((s) => {
    const i = timing!.scenes.indexOf(s);
    const prev = timing!.scenes[i - 1];
    const next = timing!.scenes[i + 1];
    const a = prev ? Math.round(((prev.end + s.start) / 2) * FPS) : 0;
    const b = next && mode === "full" ? Math.round(((s.end + next.start) / 2) * FPS) : Math.round((s.end + (mode === "full" ? 0.6 : 1.2)) * FPS);
    return { id: s.id, a, b };
  });
  const tension = mode === "full" && has("s6l1") ? interpolate(f, [t.f("s6l1") - 15, t.f("s6l1"), t.f("s7l5@end"), t.f("s7l5@end") + 15], [0, 0.1, 0.1, 0], clamp) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#EFE6D6" }}>
      <Paper darken={tension * 0.7} />
      {bounds.map(({ id, a, b }) => {
        if (f < a - 8 || f > b + 8) return null;
        const S = SCENES[id].C;
        return (
          <Camera key={id} from={a} to={b}>
            <S t={t} />
          </Camera>
        );
      })}
      <Captions cards={cards} />
      <Tray items={tray} />
      <Badge pulses={pulses} />
      <SeriesTag text="#الأدوية" />
      {mode === "full" && active.includes(9) && <Outro t={t} logoAt={logoAt} />}

      {/* audio: voice, music themes, sfx */}
      <Audio src={staticFile(`voice/${timing!.audio}`)} />
      {themes.map(([name, a, b]) =>
        b - a > 30 ? (
          <Sequence key={name} from={a} durationInFrames={b - a + 20}>
            <Audio
              src={staticFile(`audio/music/${name}.mp3`)}
              volume={(fr) => musicVol(fr + a) * interpolate(fr, [0, 30, b - a - 10, b - a + 20], [0, 1, 1, 0], clamp)}
            />
          </Sequence>
        ) : null,
      )}
      {cues.map((c, i) => (
        <Sequence key={i} from={Math.round(c.at * FPS)} durationInFrames={2 * FPS}>
          <Audio src={staticFile(`audio/sfx/${c.sfx}.wav`)} volume={c.vol} />
        </Sequence>
      ))}
      {mode === "full" && (
        <Sequence from={logoAt} durationInFrames={Math.ceil(OUTRO * FPS)}>
          <Audio src={staticFile("audio/sfx/heartbeat.wav")} volume={0.35} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
