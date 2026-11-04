// المشهد 1: الهوك. Every beat is anchored to a spoken word from the timing JSON.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Capsule, Pen, PetriDish, Place, Prescription, QuestionIcon, SickPerson, Sparkle, Lock } from "../../assets";
import { bob, clamp, easeIn, easeInOut, easeOut, inOut, pop, prog } from "../../lib/anim";
import type { T } from "../../lib/timing";
import type { TrayItem } from "../../components/Frame";
import { IconCircle } from "../../components/Frame";
import type { Cue } from "../../lib/sfx";
import { C } from "../../theme";

export const scene1Beats = (t: T) => ({
  l2: t.f("s1l2"),
  jabbar: t.f("s1l2:جبار"),
  faytak: t.f("s1l2:فايتاك"),
  l2e: t.f("s1l2@end"),
  l3: t.f("s1l3"),
  refuse: t.f("s1l3:بيرفض"),
  tired: t.f("s1l3:وإنت"),
  l4: t.f("s1l4"),
  sudfa: t.f("s1l4:بالصدفة"),
  afan: t.f("s1l4:عفن"),
  l5: t.f("s1l5"),
  lose: t.f("s1l5:يخسر"),
  ehna: t.f("s1l5:إحنا"),
  l6: t.f("s1l6"),
  raqam: t.f("s1l6:رقم"),
  l6e: t.f("s1l6@end"),
  antibiotic: t.f("s1l1:المضاد"),
});

export const scene1Tray = (t: T): TrayItem[] => {
  const b = scene1Beats(t);
  const has = (id: string) => t.timing.lines.some((l) => l.id === id);
  const qLeave = has("s5l1") ? t.f("s5l1:بيرفض") - 16 : undefined; // loop (أ) closes in scene 5
  const lockLeave = has("s7l1") ? t.f("s7l1") - 16 : undefined; // loop (ب) closes in scene 7
  return [
    { id: "q", arrive: b.l2e + 8, from: { x: 760, y: 900, s: 2.2 }, icon: <IconCircle><g transform="translate(50 50)"><QuestionIcon /></g></IconCircle>, leave: qLeave },
    { id: "lock", arrive: b.l6e + 12, from: { x: 540, y: 1080, s: 3.4 }, icon: <IconCircle><g transform="translate(50 50)"><Lock bg={false} /></g></IconCircle>, leave: lockLeave },
  ];
};

export const scene1Cues = (t: T): Cue[] => {
  const b = scene1Beats(t);
  return [
    { at: t.s("s1l1:المضاد") - 0.05, sfx: "shimmer", vol: 0.12 },
    { at: t.s("s1l2:جبار") - 0.22, sfx: "shimmer", vol: 0.16 },
    { at: t.s("s1l2:فايتاك@end") + 0.02, sfx: "pop", vol: 0.28 },
    { at: t.s("s1l3") - 0.12, sfx: "paper", vol: 0.22 },
    { at: t.s("s1l3") + 0.9, sfx: "scribble", vol: 0.12 },
    { at: t.s("s1l4") - 0.15, sfx: "glass", vol: 0.13 },
    { at: t.s("s1l5:يخسر") - 0.16, sfx: "crack", vol: 0.16 },
    { at: t.s("s1l6:رقم@end") + 0.02, sfx: "heartbeat", vol: 0.32 },
    { at: (b.l6e + 12) / 30, sfx: "click", vol: 0.26 },
  ];
};

export const scene1Pulses = (t: T) => [t.f("s1l2:جبار@end"), t.f("s1l5:يخسر"), t.f("s1l6:رقم@end")];

export const Scene1: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame();
  const b = scene1Beats(t);

  // ---- A: sick person + floating capsule (frame 0 = cover)
  const aOut = prog(f, b.l2 - 4, 12, easeIn);
  const glowPulse = interpolate(f, [b.antibiotic - 2, b.antibiotic + 8, b.antibiotic + 30], [0.75, 1, 0.8], clamp);
  // ---- B: capsule hero
  const heroIn = prog(f, b.l2 - 4, 14);
  const heroOut = prog(f, b.l3 - 6, 10, easeIn);
  const spark = prog(f, b.jabbar - 4, 16);
  const qPop = pop(f, b.faytak + 4, 10);
  // ---- C: prescription + pen
  const rxIn = inOut(f, b.l3 - 4, b.l4 - 2, 12, 8);
  const write = interpolate(f, [b.l3 + 6, b.refuse], [0, 0.82], { ...clamp, easing: easeInOut });
  const penLift = prog(f, b.refuse + 2, 14, easeOut);
  const peek = inOut(f, b.tired - 4, b.l4 - 4, 12, 8);
  // ---- D: petri dish + mould
  const dishIn = inOut(f, b.l4 + 2, b.l5 + 2, 12, 8);
  const mold = interpolate(f, [b.sudfa, b.afan + 12], [0, 1], { ...clamp, easing: easeOut });
  // ---- E: cracked capsule
  const capIn = inOut(f, b.l5 - 4, b.l6 + 2, 12, 8);
  const crack = interpolate(f, [b.lose, b.lose + 12, b.ehna, b.ehna + 10], [0, 0.6, 0.6, 1], { ...clamp, easing: easeOut });
  const shake = f >= b.ehna && f < b.ehna + 12 ? Math.sin((f - b.ehna) * 1.9) * 8 * (1 - (f - b.ehna) / 12) : 0;
  // ---- F: lock
  const lockIn = pop(f, b.l6 - 2, 12);
  const lockPop = pop(f, b.raqam - 2, 12);
  const lockGone = f >= b.l6e + 12 - 16;

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {/* A */}
      {aOut < 1 && (
        <g opacity={1 - aOut} transform={`translate(${-aOut * 200} 0)`}>
          <Place x={540} y={1330 + bob(f, 3, 60)} s={1.35}>
            <SickPerson shiver={f > 6 ? Math.sin(f * 1.3) * 2.2 : 0} blink={f % 70 > 66} />
          </Place>
          <Place x={540} y={880 + bob(f, 10, 54)} r={-14} s={1.05}>
            <Capsule glow={glowPulse} />
          </Place>
          <Place x={390} y={760} s={0.6 + 0.15 * glowPulse}><Sparkle /></Place>
          <Place x={730} y={980} s={0.45 + 0.12 * glowPulse}><Sparkle /></Place>
        </g>
      )}
      {/* B */}
      {heroIn > 0 && heroOut < 1 && (
        <g opacity={Math.min(heroIn, 1 - heroOut)}>
          <Place x={540} y={1060 + bob(f, 8, 50)} s={1.25 + 0.25 * heroIn + 0.1 * spark - 0.15 * heroOut} r={interpolate(heroIn, [0, 1], [-14, -30]) + 8 * spark}>
            <Capsule glow={0.5 * spark} />
          </Place>
          {spark > 0 &&
            [
              [300, 860, 0.9],
              [790, 830, 0.7],
              [820, 1250, 0.8],
              [280, 1260, 0.6],
            ].map(([x, y, s], i) => (
              <Place key={i} x={x} y={y} s={s * spark * (1 - 0.3 * prog(f, b.jabbar + 20, 20))} r={spark * 45}>
                <Sparkle />
              </Place>
            ))}
          {qPop > 0 && f < b.l2e + 8 - 16 && (
            <Place x={760} y={900} s={2.2 * qPop}>
              <QuestionIcon />
            </Place>
          )}
        </g>
      )}
      {/* C */}
      {rxIn > 0 && (
        <g opacity={rxIn} transform={`translate(${f < b.l3 + 10 ? (1 - rxIn) * 300 : -(1 - rxIn) * 300} 0)`}>
          <Place x={520} y={1090} s={1.25} r={-3}>
            <Prescription write={write} />
          </Place>
          <g opacity={1 - penLift}>
            <Place x={420 + write * 330} y={1040 + Math.sin(write * 40) * 18 - penLift * 260} s={1.15} r={penLift * 25}>
              <Pen />
            </Place>
          </g>
          {peek > 0 && (
            <Place x={190} y={1640 - 230 * peek} s={0.85} r={12}>
              <SickPerson shiver={Math.sin(f * 1.3) * 2} />
            </Place>
          )}
        </g>
      )}
      {/* D */}
      {dishIn > 0 && (
        <g opacity={dishIn}>
          <Place x={540} y={1090} s={(0.8 + 0.25 * dishIn) * 1.15} r={(1 - dishIn) * -20}>
            <PetriDish mold={mold} f={f} />
          </Place>
          {mold > 0.6 && (
            <Place x={820} y={820} s={0.7 * prog(f, b.afan, 10)} r={f}>
              <Sparkle fill="#FFF3CF" />
            </Place>
          )}
        </g>
      )}
      {/* E */}
      {capIn > 0 && (
        <g opacity={capIn}>
          <Place x={540 + shake} y={1080 + bob(f, 6, 50)} s={1.7 + 0.3 * capIn} r={-24}>
            <Capsule crack={crack} />
          </Place>
          {crack > 0.5 && (
            <Place x={520} y={1270} s={1}>
              <path d="M-60 0 L-30 10 M10 4 L40 18" stroke={C.ink} strokeWidth={5} strokeLinecap="round" opacity={prog(f, b.ehna, 8)} />
            </Place>
          )}
        </g>
      )}
      {/* F */}
      {lockIn > 0 && !lockGone && (
        <Place x={540} y={1080 + bob(f, 6, 46)} s={2.1 * lockIn + 1.3 * lockPop} r={(1 - lockPop) * -8}>
          <Lock />
        </Place>
      )}
    </svg>
  );
};
