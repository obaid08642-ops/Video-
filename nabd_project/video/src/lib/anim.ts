import { Easing, interpolate } from "remotion";

// No linear motion anywhere: entries ease-out, pops overshoot ~8 %.
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const popEase = Easing.bezier(0.34, 1.45, 0.64, 1); // ~8 % overshoot

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 -> 1 over `dur` frames starting at `from`, eased */
export const prog = (f: number, from: number, dur: number, ease = easeOut) =>
  interpolate(f, [from, from + dur], [0, 1], { ...clamp, easing: ease });

/** entry (0..1) then exit (1..0) */
export const inOut = (f: number, a: number, b: number, inDur = 10, outDur = 7) =>
  Math.min(prog(f, a, inDur), 1 - prog(f, b - outDur, outDur, easeIn));

export const pop = (f: number, from: number, dur = 10) =>
  interpolate(f, [from, from + dur], [0, 1], { ...clamp, easing: popEase });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** tiny idle bob, never linear */
export const bob = (f: number, amp = 6, period = 48, phase = 0) =>
  Math.sin(((f + phase) / period) * Math.PI * 2) * amp;
