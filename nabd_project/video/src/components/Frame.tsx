import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { clamp, easeInOut, popEase, prog } from "../lib/anim";

export const sk = {
  stroke: C.ink,
  strokeWidth: 6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

/** warm paper: flat colour + one fixed grain tile (never moves, never flickers) */
export const Paper: React.FC<{ darken?: number }> = ({ darken = 0 }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Img src={staticFile("paper_grain.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.55 }} />
    {darken > 0 && <AbsoluteFill style={{ backgroundColor: "#000", opacity: darken }} />}
  </AbsoluteFill>
);

export const NabdMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill={C.brand} />
    <circle cx="50" cy="32" r="8" fill="#fff" />
    <path d="M27 52 A23 23 0 0 0 73 52" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

/** small «ن» badge, top-left; pulses (one soft beat) only at the given important frames */
export const Badge: React.FC<{ pulses: number[] }> = ({ pulses }) => {
  const f = useCurrentFrame();
  let s = 1;
  let ring = 0;
  let ringO = 0;
  for (const p of pulses) {
    if (f >= p && f < p + 22) {
      const a = interpolate(f, [p, p + 5, p + 12], [0, 1, 0], { ...clamp, easing: easeInOut });
      s = 1 + 0.16 * a;
      ring = prog(f, p, 20);
      ringO = 1 - ring;
    }
  }
  return (
    <div style={{ position: "absolute", left: 46, top: 58, display: "flex", alignItems: "center", gap: 14, direction: "rtl" }}>
      <div style={{ position: "relative", width: 84, height: 84, transform: `scale(${s})` }}>
        <div style={{ position: "absolute", inset: -ring * 26, borderRadius: "50%", border: `5px solid ${C.brand}`, opacity: ringO * 0.8 }} />
        <NabdMark size={84} />
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.ink, order: -1 }}>نبض</div>
    </div>
  );
};

export const SeriesTag: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", right: 52, top: 74, fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.key, direction: "rtl" }}>
    {text}
  </div>
);

/** gentle continuous camera: 1.00 -> 1.03 over the scene, plus zoom transitions in/out */
export const Camera: React.FC<{ from: number; to: number; zoomIn?: number; zoomOut?: number; children: React.ReactNode; origin?: string }> = ({
  from,
  to,
  children,
  origin = "50% 58%",
}) => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [from, to], [1, 1.03], { ...clamp, easing: easeInOut });
  const enter = prog(f, from - 6, 13);
  const exit = prog(f, to - 7, 13, easeInOut);
  const scale = drift * (0.9 + 0.1 * enter) * (1 + 0.22 * exit);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: origin, opacity: Math.min(enter, 1 - exit) }}>
      {children}
    </AbsoluteFill>
  );
};

export type TrayItem = { id: string; arrive: number; from: { x: number; y: number; s: number }; icon: React.ReactNode; leave?: number };

/** "memory" icons: shown big in the scene, then fly to the top bar and stay */
export const Tray: React.FC<{ items: TrayItem[] }> = ({ items }) => {
  const f = useCurrentFrame();
  const placed = items.filter((it) => f >= it.arrive - 16 && (it.leave === undefined || f < it.leave + 16));
  return (
    <>
      {placed.map((it) => {
        const slot = items.filter((x) => x.arrive <= it.arrive && (x.leave === undefined || x.leave > it.arrive)).indexOf(it);
        const tx = 300 + slot * 104;
        const ty = 100;
        const p = prog(f, it.arrive - 16, 16, easeInOut);
        const back = it.leave !== undefined ? prog(f, it.leave, 16, easeInOut) : 0;
        const x = interpolate(p, [0, 1], [it.from.x, tx]) * (1 - back) + it.from.x * back;
        const y = interpolate(p, [0, 1], [it.from.y, ty]) * (1 - back) + it.from.y * back;
        const s = interpolate(p, [0, 1], [it.from.s, 1]) * (1 - back) + it.from.s * back;
        const settle = interpolate(f, [it.arrive, it.arrive + 8], [1.12, 1], { ...clamp, easing: popEase });
        return (
          <div key={it.id} style={{ position: "absolute", left: x - 44, top: y - 44, width: 88, height: 88, transform: `scale(${s * (p >= 1 ? settle : 1)})` }}>
            {it.icon}
          </div>
        );
      })}
    </>
  );
};

export const IconCircle: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = C.iconBg }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: "visible" }}>
    <circle cx="50" cy="50" r="44" fill={bg} {...sk} strokeWidth={5} />
    {children}
  </svg>
);
