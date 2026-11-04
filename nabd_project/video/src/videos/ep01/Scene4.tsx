// المشهد 4: بيشتغل إزاي؟ — bacterium = factory (wall, machines, catalogue)
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Bacterium, Capsule, Gear, Place, Virus } from "../../assets";
import { sk } from "../../components/Frame";
import { bob, clamp, easeOut, inOut, pop, prog } from "../../lib/anim";
import type { T } from "../../lib/timing";
import type { Cue } from "../../lib/sfx";
import { C } from "../../theme";

const beats = (t: T) => ({
  l1: t.f("s4l1"),
  l2: t.f("s4l2"),
  factory: t.f("s4l2:مصنع"),
  wall: t.f("s4l2:سور"),
  machines: t.f("s4l2:وماكينات"),
  catalog: t.f("s4l2:وكتالوج"),
  l3: t.f("s4l3"),
  hitWall: t.f("s4l3:السور"),
  hitMach: t.f("s4l3:الماكينات"),
  hitCat: t.f("s4l3:الكتالوج"),
  l4: t.f("s4l4"),
  noFactory: t.f("s4l4:معندوش"),
  end: t.f("s4l4@end"),
});

export const scene4Cues = (t: T): Cue[] => [
  { at: t.s("s4l1") - 0.1, sfx: "whoosh", vol: 0.2 },
  { at: t.s("s4l2:مصنع") - 0.2, sfx: "pop", vol: 0.22 },
  { at: t.s("s4l3:السور@end") + 0.02, sfx: "crack", vol: 0.16 },
  { at: t.s("s4l3:الماكينات@end") + 0.02, sfx: "click", vol: 0.18 },
  { at: t.s("s4l3:الكتالوج@end") + 0.02, sfx: "paper", vol: 0.2 },
  { at: t.s("s4l4") - 0.1, sfx: "bubbles", vol: 0.14 },
];

export const scene4Pulses = (t: T) => [t.f("s4l4:المصنع@end")];

const Catalog: React.FC<{ tear: number }> = ({ tear }) => (
  <g>
    <g transform={`translate(${-tear * 26} ${tear * 10}) rotate(${-tear * 12})`}>
      <path d="M-70 -90 H0 L-8 -40 L6 0 L-6 40 L0 90 H-70 Z" fill={C.paper} {...sk} />
      <path d="M-50 -60 C-20 -40 -50 -20 -20 0 C-50 20 -20 40 -50 60" fill="none" {...sk} strokeWidth={5} stroke={C.key} />
    </g>
    <g transform={`translate(${tear * 26} ${tear * 14}) rotate(${tear * 14})`}>
      <path d="M0 -90 H70 V90 H0 L-6 40 L6 0 L-8 -40 Z" fill={C.paper} {...sk} />
      <path d="M20 -60 C50 -40 20 -20 50 0 C20 20 50 40 20 60" fill="none" {...sk} strokeWidth={5} stroke={C.key} />
    </g>
  </g>
);

export const Scene4: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame();
  const b = beats(t);
  const bug = pop(f, b.l1 + 2, 12);
  const morph = prog(f, b.factory - 2, 14);
  const wallIn = pop(f, b.wall - 2, 10);
  const machIn = pop(f, b.machines - 2, 10);
  const catIn = pop(f, b.catalog - 2, 10);
  const wallHit = prog(f, b.hitWall, 10);
  const machHit = prog(f, b.hitMach, 10);
  const catHit = prog(f, b.hitCat, 12);
  const spin = f < b.hitMach ? f * 3 : b.hitMach * 3 + 6 * Math.sin((f - b.hitMach) * 0.8) * Math.exp(-(f - b.hitMach) / 8);
  const shift = prog(f, b.l4 - 4, 14); // factory slides left, virus enters
  const virusIn = pop(f, b.l4 + 2, 12);
  const empty = prog(f, b.noFactory, 10);
  const capsule = (start: number, end: number, band: string, tx: number, ty: number) => {
    const p = interpolate(f, [start - 14, start], [0, 1], { ...clamp, easing: easeOut });
    const out = prog(f, end, 8);
    if (p <= 0 || out >= 1) return null;
    return (
      <Place x={interpolate(p, [0, 1], [1180, tx])} y={interpolate(p, [0, 1], [ty - 200, ty])} s={0.55} r={-30 + 30 * p} o={1 - out}>
        <Capsule band={band} />
      </Place>
    );
  };
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${-230 * shift} 0) scale(${1 - 0.25 * shift})`} style={{ transformOrigin: "540px 1100px" }}>
        {morph < 1 && (
          <Place x={540} y={1100 + bob(f, 8, 50)} s={2.2 * bug * (1 - morph)} o={1 - morph}>
            <Bacterium wobble={Math.sin(f / 9) * 4} />
          </Place>
        )}
        {morph > 0 && (
          <g opacity={morph} transform={`translate(540 1100) scale(${0.6 + 0.4 * morph})`}>
            {/* bacterium body = the factory */}
            <rect x={-330} y={-230} width={660} height={460} rx={200} fill={C.bad} {...sk} />
            {/* wall */}
            <g opacity={wallIn} transform={`scale(${0.9 + 0.1 * wallIn})`}>
              <rect x={-360} y={-260} width={720} height={520} rx={225} fill="none" {...sk} strokeWidth={14} strokeDasharray="38 22" vectorEffect="none" />
              {wallHit > 0 && (
                <path d="M-370 -40 L-330 -10 L-360 30 L-322 60" fill="none" {...sk} stroke={C.warn} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - wallHit} />
              )}
            </g>
            {/* machines */}
            <g opacity={machIn} transform={`scale(${machIn})`}>
              <g transform="translate(-140 -40)"><Gear r={86} spin={spin} /></g>
              <g transform="translate(-20 70)"><Gear r={58} spin={-spin * 1.4} fill="#F7E1A8" /></g>
              {machHit > 0 && (
                <g transform="translate(-90 10)" opacity={machHit}>
                  <path d="M-40 -40 L40 40 M40 -40 L-40 40" {...sk} stroke={C.warn} strokeWidth={10} />
                </g>
              )}
            </g>
            {/* catalogue (DNA) */}
            <g opacity={catIn} transform={`translate(190 -10) scale(${catIn})`}>
              <Catalog tear={catHit} />
            </g>
            <g transform="translate(70 150)">
              <circle cx={-18} cy={-6} r={7} fill={C.ink} />
              <circle cx={18} cy={-6} r={7} fill={C.ink} />
              <path d={`M-14 14 Q0 ${14 + 12 * (1 - 1.6 * Math.max(wallHit, machHit, catHit))} 14 14`} fill="none" {...sk} strokeWidth={5} />
            </g>
          </g>
        )}
        {capsule(b.hitWall, b.hitMach - 4, C.brand, 160, 860)}
        {capsule(b.hitMach, b.hitCat - 4, "#7FB2D9", 330, 820)}
        {capsule(b.hitCat, b.l4, "#A48BD0", 760, 800)}
      </g>
      {virusIn > 0 && (
        <g>
          <Place x={800} y={1120 + bob(f, 8, 44)} s={1.35 * virusIn}>
            <Virus spin={f * 0.6} empty={empty > 0.5} />
          </Place>
          {empty > 0 && (
            <g opacity={empty}>
              <circle cx={800} cy={1120} r={60} fill="none" stroke={C.ink} strokeWidth={5} strokeDasharray="10 14" />
              <path d="M700 1330 h200" {...sk} stroke={C.key} />
            </g>
          )}
        </g>
      )}
    </svg>
  );
};

export const scene4Span = (t: T) => [t.f("s4l1"), t.f("s4l4@end")];
export { inOut };
