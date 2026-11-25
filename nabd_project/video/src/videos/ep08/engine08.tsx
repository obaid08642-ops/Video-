// Beats engine + helpers for Ep08 (same engine as Ep05/06): a beat appears at the first spoken word that matches its anchor and stays until the next.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Place, QuestionIcon } from "../../assets";
import { Chip, OkMark, XMark } from "../../assets/ep02";
import { CuteDoc, CutePatient, type CMood } from "../../proto/CharsCute";
import { easeOut, inOut, pop, prog } from "../../lib/anim";
import { FPS, norm, type T } from "../../lib/timing";
import type { Cue } from "../../lib/sfx";
import { C } from "../../theme";

export type SceneDef = { C: React.FC<{ t: T }>; cues: (t: T) => Cue[]; pulses: (t: T) => number[] };
export const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{children}</svg>
);
export const ZOOM = 1.2;   // art is drawn bigger than the old episodes; chips are counter-scaled so text stays inside the safe zone
export const ChipAt: React.FC<{ x?: number; y?: number; text: string; w?: number; size?: number; p?: number; dir?: "rtl" | "ltr"; hot?: boolean }> = ({ x = 540, y = 1400, text, w = 600, size = 50, p = 1, dir = "rtl", hot }) => (
  <Place x={540 + (x - 540) / ZOOM} y={1000 + (y - 1000) / ZOOM} s={p / ZOOM}><Chip text={text} w={Math.min(940, Math.max(w, Math.ceil(text.length * size * 0.47 + 90)))} size={size} dir={dir} fill={hot ? "#FFF3CF" : C.card} color={hot ? C.key : C.ink} /></Place>
);
// ---- beats machinery (same as Ep05)
export type Beat = { a: string; sfx?: string; r: (p: number, f: number, a: number, b: number) => React.ReactNode };
const wordsOf = new WeakMap<object, { n: string; s: number }[]>();
const allWords = (t: T) => {
  let w = wordsOf.get(t.timing);
  if (!w) { w = t.timing.lines.flatMap((l) => l.words.map((x) => ({ n: norm(x.w), s: x.start }))); wordsOf.set(t.timing, w); }
  return w;
};
const anchors = (t: T, scene: number, beats: Beat[]) => {
  const sc = t.timing.scenes.find((s) => s.id === scene); const out: number[] = []; let from = sc ? Math.max(0, sc.start) : 0;
  const w = allWords(t); const strict0 = !!(t.timing as unknown as { strict?: boolean }).strict; const start0 = from;
  beats.forEach((b, i) => {
    const k = norm(b.a);
    if (strict0) from = start0;
    const hit = k === "" ? undefined : w.find((x) => x.s >= from - 0.02 && x.n.includes(k));
    const s = k === "" ? from : hit ? hit.s : strict0 ? 1e6 : from + (i ? 1.2 : 0);
    out.push(s); if (s < 1e5 && !strict0) from = s + 0.05;
  });
  return out;
};
export const mk = (scene: number, beats: Beat[]): SceneDef => ({
  C: ({ t }) => {
    const f = useCurrentFrame(); const an = anchors(t, scene, beats); const sc = t.timing.scenes.find((s) => s.id === scene)!;
    const end = Math.round(sc.end * FPS);
    return (
      <Svg><g transform={`translate(540 1000) scale(${ZOOM}) translate(-540 -1000)`}>
        {beats.map((b, i) => {
          if (an[i] > 1e5) return null;
          const a = Math.round(an[i] * FPS); const later = an.filter((x) => x > an[i] + 0.04 && x < 1e5); const e = later.length ? Math.round(Math.min(...later) * FPS) : end;
          const o = inOut(f, a - 4, e + 4, 10, 8);
          return o > 0.01 ? (<g key={i} opacity={o}>{b.r(pop(f, a, 12), f, a, e)}</g>) : null;
        })}
      </g></Svg>
    );
  },
  cues: (t) => { const an = anchors(t, scene, beats); return beats.flatMap((b, i) => (b.sfx && an[i] < 1e5 ? [{ at: an[i] - 0.12, sfx: b.sfx, vol: 0.13 }] : [])); },
  pulses: (t) => { const sc = t.timing.scenes.find((s) => s.id === scene); return sc ? [Math.round(sc.end * FPS) - 2] : []; },
});
export const L = (f: number, a: number, d = 20) => prog(f, a, d, easeOut);
export const D = (mood: CMood, x = 540, y = 1010, s = 0.85, up = false) => (<Place x={x} y={y} s={s}><CuteDoc mood={mood} up={up} /></Place>);
export const Pt = (mood: CMood, x = 540, y = 1010, s = 0.85) => (<Place x={x} y={y} s={s}><CutePatient mood={mood} /></Place>);
export const Big = (p: number, n: React.ReactNode, x = 800, y = 900, s = 1) => (<Place x={x} y={y} s={s * p}>{n}</Place>);
export const Cross = (p: number, x = 540, y = 1000, s = 2.2) => (<Place x={x} y={y} s={s * p} o={0.9}><XMark p={p} /></Place>);
export const Tick = (p: number, x = 820, y = 800, s = 1.1) => (<Place x={x} y={y} s={s * p}><OkMark p={p} /></Place>);
export const Q = (p: number, x = 820, y = 800) => (<Place x={x} y={y} s={1.4 * p}><QuestionIcon /></Place>);

