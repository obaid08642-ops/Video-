// المشهد 7: الرقم — 1 of 6, 1 of 3 in our region, +39 million, 3 every minute
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Clock, Lock, PersonIcon, Place } from "../../assets";
import { sk } from "../../components/Frame";
import { bob, clamp, easeInOut, easeOut, inOut, pop, prog } from "../../lib/anim";
import type { T } from "../../lib/timing";
import type { Cue } from "../../lib/sfx";
import { C, FONT } from "../../theme";

const beats = (t: T) => ({
  l1: t.f("s7l1"),
  number: t.f("s7l1:الرقم"),
  l2: t.f("s7l2"),
  six: t.f("s7l2:ست"),
  l3: t.f("s7l3"),
  region: t.f("s7l3:منطقتنا"),
  one: t.f("s7l3:واحدة"),
  three: t.f("s7l3:تلاتة"),
  l4: t.f("s7l4"),
  nine: t.f("s7l4:تسعة"),
  million: t.f("s7l4:مليون@end"),
  l5: t.f("s7l5"),
  minute: t.f("s7l5:دقيقة"),
  end: t.f("s7l5@end"),
});

export const scene7Cues = (t: T): Cue[] => [
  { at: t.s("s7l1:الرقم@end") + 0.05, sfx: "click", vol: 0.24 },
  { at: t.s("s7l2:ست@end") + 0.02, sfx: "ding", vol: 0.16 },
  { at: t.s("s7l3:تلاتة@end") + 0.05, sfx: "heartbeat", vol: 0.3 },
  { at: t.s("s7l4:مليون@end") + 0.02, sfx: "ding", vol: 0.14 },
  { at: t.s("s7l5:دقيقة") - 0.9, sfx: "tick", vol: 0.2 },
];
export const scene7Pulses = (t: T) => [t.f("s7l3:تلاتة@end"), t.f("s7l4:مليون@end")];
/** music stops 1 s before "واحدة… من كل تلاتة" and comes back after it */
export const scene7Silence = (t: T): [number, number] => [t.s("s7l3:واحدة") - 1.0, t.s("s7l3:تلاتة@end") + 0.3];

const Region: React.FC = () => (
  <path
    d="M-260 -60 C-230 -150 -120 -170 -40 -140 C40 -190 160 -170 230 -100 C290 -40 260 60 190 90 C130 150 20 130 -40 160 C-120 190 -230 120 -250 40 C-280 10 -275 -30 -260 -60 Z"
    fill="#E9D9B9"
    {...sk}
  />
);

export const Scene7: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame();
  const b = beats(t);
  const lockIn = inOut(f, b.l1, b.l2 + 4, 12, 8);
  const lockOpen = prog(f, b.number + 4, 12, easeOut);
  const grid6 = inOut(f, b.l2 + 2, b.l3 + 4, 12, 8);
  const red6 = prog(f, b.six, 8);
  const map = inOut(f, b.region - 6, b.l4 + 2, 14, 8);
  const grid3 = pop(f, b.one - 4, 12);
  const red3 = prog(f, b.three, 8);
  const counterIn = inOut(f, b.nine - 6, b.l5 + 4, 10, 8);
  const count = interpolate(f, [b.nine - 4, b.million + 6], [0, 39_000_000], { ...clamp, easing: easeInOut });
  const clockIn = pop(f, b.l5 + 2, 12);
  const angle = interpolate(f, [b.l5, b.end + 30], [0, Math.PI * 4], { ...clamp, easing: easeOut });
  const row = (n: number, redIdx: number, redP: number, y: number, s: number, o: number) =>
    Array.from({ length: n }).map((_, i) => {
      const x = 540 + (i - (n - 1) / 2) * (n > 3 ? 150 : 210);
      const ap = pop(f, (n > 3 ? b.l2 + 4 : b.one - 4) + i * 3, 10);
      return (
        <Place key={i} x={x} y={y + bob(f, 4, 50, i * 9)} s={s * ap} o={o}>
          <PersonIcon fill={i === redIdx && redP > 0.5 ? C.warn : C.iconBg} />
        </Place>
      );
    });
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {lockIn > 0 && (
        <Place x={540} y={1080 + bob(f, 6, 46)} s={3.4 * lockIn}>
          <Lock open={lockOpen} />
        </Place>
      )}
      {grid6 > 0 && <g>{row(6, 3, red6, 1120, 1.15, grid6)}</g>}
      {map > 0 && (
        <g opacity={map}>
          <Place x={540} y={1130} s={1.25 + 0.05 * map}>
            <Region />
          </Place>
          {grid3 > 0 && row(3, 1, red3, 1130, 1.25, 1)}
        </g>
      )}
      {counterIn > 0 && (
        <g opacity={counterIn}>
          <text x={540} y={1150} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={150} fill={C.warn} direction="ltr" unicodeBidi="bidi-override" style={{ fontVariantNumeric: "tabular-nums" }}>
            {"+" + Math.round(count).toLocaleString("en-US")}
          </text>
          <text x={540} y={1260} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill={C.ink}>
            وفاة متوقعة
          </text>
        </g>
      )}
      {clockIn > 0 && (
        <Place x={540} y={1120} s={1.6 * clockIn}>
          <Clock a={angle} />
        </Place>
      )}
    </svg>
  );
};
