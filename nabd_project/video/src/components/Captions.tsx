import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import type { Card } from "../lib/captions";
import { FPS } from "../lib/timing";
import { clamp, easeIn, easeOut, popEase, prog } from "../lib/anim";

const CARD_LEFT = 92;
const CARD_W = 826; // right edge 918 < 950 (right 12 % stays free)
const CARD_TOP = 262;

const Underline: React.FC<{ p: number }> = ({ p }) => (
  <svg viewBox="0 0 100 12" preserveAspectRatio="none" style={{ position: "absolute", left: "-2%", right: "-2%", bottom: -6, width: "104%", height: 16, overflow: "visible" }}>
    <path
      d="M98 6 C 70 2, 40 10, 2 5"
      fill="none"
      stroke={C.key}
      strokeWidth={5}
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
  </svg>
);

const CardView: React.FC<{ card: Card; f: number }> = ({ card, f }) => {
  const a = Math.round(card.start * FPS);
  const b = Math.round(card.end * FPS);
  const enter = interpolate(f, [a, a + 10], [0, 1], { ...clamp, easing: popEase });
  const exit = prog(f, b - 7, 7, easeIn);
  const cover = card.karaoke && f <= 2; // frame 0 = thumbnail: full sentence visible
  const opacity = cover ? 1 : Math.min(prog(f, a, 8), 1 - exit);
  const y = cover ? 0 : (1 - enter) * 34 - exit * 24;
  const s = cover ? 1 : 0.95 + 0.05 * enter;
  const longest = Math.max(...card.rows.map((r) => r.reduce((n, t) => n + t.text.length + 1, 0)));
  const fs = Math.max(40, Math.min(88, 1420 / Math.max(10, longest))); // ~0.5em per char, 730px text box
  return (
    <div
      style={{
        position: "absolute",
        left: CARD_LEFT,
        width: CARD_W,
        top: CARD_TOP,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity,
        transform: `translateY(${y}px) scale(${s})`,
      }}
    >
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, transform: "translate(-9px, 11px)", background: C.cardShadow, borderRadius: 40 }} />
        <div
          style={{
            position: "relative",
            background: C.card,
            border: `5px solid ${C.ink}`,
            borderRadius: 40,
            padding: "30px 46px 36px",
            direction: "rtl",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: fs,
            lineHeight: 1.42,
            color: C.ink,
            textAlign: "center",
            maxWidth: CARD_W,
          }}
        >
          {card.rows.map((row, ri) => (
            <div key={ri} style={{ whiteSpace: "nowrap" }}>
              {row.map((tok, ti) => {
                const tf = tok.t * FPS;
                const spoken = f >= tf - 1;
                const wIn = prog(f, tf - 2, 6, easeOut);
                let o: number;
                let dy = 0;
                if (card.karaoke) {
                  o = cover ? 1 : 0.26 + 0.74 * wIn;
                } else {
                  o = wIn;
                  dy = (1 - wIn) * 14;
                }
                const kwOn = tok.kw && (cover || spoken);
                const kwPop = tok.kw ? interpolate(f, [tf - 1, tf + 4, tf + 9], [1, 1.09, 1], { ...clamp, easing: popEase }) : 1;
                return (
                  <span
                    key={ti}
                    style={{
                      position: "relative",
                      display: "inline-block",
                      margin: "0 0.13em",
                      opacity: o,
                      transform: `translateY(${dy}px) scale(${cover ? 1 : kwPop})`,
                      color: kwOn ? C.key : C.ink,
                    }}
                  >
                    {tok.text}
                    {tok.kw && <Underline p={cover ? 1 : prog(f, tf, 9)} />}
                  </span>
                );
              })}
            </div>
          ))}
          {card.note && (
            <div
              style={{
                marginTop: 14,
                display: "inline-block",
                fontSize: Math.round(fs * 0.62),
                fontWeight: 600,
                background: C.iconBg,
                border: `4px solid ${C.ink}`,
                borderRadius: 999,
                padding: "2px 26px 6px",
                opacity: prog(f, card.note.t * FPS - 2, 7),
                transform: `scale(${interpolate(f, [card.note.t * FPS - 2, card.note.t * FPS + 8], [0.6, 1], { ...clamp, easing: popEase })})`,
              }}
            >
              {card.note.text}
            </div>
          )}
        </div>
      </div>
      {card.source && (
        <div style={{ marginTop: 22, fontFamily: FONT, fontWeight: 500, fontSize: 26, color: C.source, direction: "rtl", opacity: prog(f, a + 4, 8) }}>
          {"المصدر: "}
          {card.source}
        </div>
      )}
    </div>
  );
};

export const Captions: React.FC<{ cards: Card[] }> = ({ cards }) => {
  const f = useCurrentFrame();
  const live = cards.filter((c) => f >= Math.round(c.start * FPS) - 1 && f <= Math.round(c.end * FPS) + 1);
  if (f <= 2 && cards[0]) live.splice(0, live.length, cards[0]);
  return (
    <>
      {live.map((c) => (
        <CardView key={c.id} card={c} f={f} />
      ))}
    </>
  );
};
