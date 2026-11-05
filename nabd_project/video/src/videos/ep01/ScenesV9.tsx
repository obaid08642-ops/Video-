// Ep01 v9 (recorded voice). Every beat is anchored to a spoken word of the timing JSON.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bacterium, Capsule, CheckIcon, Clock, Lock, PersonIcon, PetriDish, Place, QuestionIcon, SickPerson, Sparkle, Virus } from "../../assets";
import { Bottle, Calendar, CalendarIcon, Crowd, Doc, Gut, HandScratch, MiniBug, Shield, ShieldIcon, SkinSection } from "../../assets/more";
import { AWARE, AwareColumn, Baby, Bars, Bubble, Counter, CulturePlate, Dumbbell, Globe, IVBag, Journal, LastCard, Scalpel, StopHand, Swab, ThumbsUp, Warn, Woman } from "../../assets/v9";
import { IconCircle, sk, type TrayItem } from "../../components/Frame";
import { bob, clamp, easeIn, easeInOut, easeOut, inOut, pop, prog } from "../../lib/anim";
import type { T } from "../../lib/timing";
import type { Cue } from "../../lib/sfx";
import { C, FONT } from "../../theme";

export type SceneDef = {
  C: React.FC<{ t: T }>;
  cues: (t: T) => Cue[];
  pulses: (t: T) => number[];
  tray?: (t: T) => TrayItem[];
  silence?: (t: T) => [number, number][];
};
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{children}</svg>
);
const icon = (n: React.ReactNode) => (<IconCircle><g transform="translate(50 50)">{n}</g></IconCircle>);
const Label: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; o?: number; dir?: "rtl" | "ltr" }> = ({ x, y, text, size = 46, color = C.ink, o = 1, dir = "rtl" }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill={color} opacity={o} direction={dir} unicodeBidi={dir === "ltr" ? "bidi-override" : undefined}>{text}</text>
);

// ============================================================ 1. Hook
const S1: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const aOut = prog(f, F("s1l2") - 4, 12, easeIn);
  const shop = inOut(f, F("s1l2") - 4, F("s1l3") + 2, 12, 8);
  const cap = pop(f, F("s1l2:مضاد") - 3, 12);
  const big = inOut(f, F("s1l3") - 4, F("s1l4") + 2, 12, 8);
  const crack = prog(f, F("s1l3:يخسرنا"), 14);
  const dish = inOut(f, F("s1l4") - 2, F("s1l5") + 2, 12, 8);
  const mold = interpolate(f, [F("s1l4:بالصدفة") - 4, F("s1l4@end")], [0, 1], { ...clamp, easing: easeOut });
  const refuse = inOut(f, F("s1l5") - 4, F("s1l6:6") - 6, 12, 8);
  const no = prog(f, F("s1l5:بيرفض"), 10);
  const woman = inOut(f, F("s1l6:6") - 2, F("s1l6@end") + 40, 12, 8);
  const ring = prog(f, F("s1l6:كل") - 4, 30);
  const lock = pop(f, F("s1l6:صادمة") - 2, 12);
  return (
    <Svg>
      {aOut < 1 && (
        <g opacity={1 - aOut}>
          <Place x={540} y={1330 + bob(f, 3, 60)} s={1.35}><SickPerson shiver={f > 6 ? Math.sin(f * 1.3) * 2.2 : 0} blink={f % 70 > 66} /></Place>
          <Place x={540} y={880 + bob(f, 10, 54)} r={-14} s={1.05}><Capsule glow={0.8} /></Place>
          <Place x={390} y={760} s={0.7}><Sparkle /></Place>
          <Place x={730} y={980} s={0.5}><Sparkle /></Place>
        </g>
      )}
      {shop > 0 && (
        <g opacity={shop}>
          <Place x={540} y={1330}><Counter /></Place>
          <Place x={760} y={1080} s={1.0}><Doc mood={0.5} /></Place>
          <Place x={290} y={1210} s={0.75}><SickPerson /></Place>
          {cap > 0 && <Place x={520} y={1180 + bob(f, 5, 40)} s={0.55 * cap} r={-20}><Capsule glow={0.6 * cap} /></Place>}
        </g>
      )}
      {big > 0 && (
        <Place x={540 + (crack > 0 && crack < 1 ? Math.sin(f * 2) * 6 : 0)} y={1080 + bob(f, 6, 50)} s={1.9 * big} r={-24}><Capsule crack={crack} /></Place>
      )}
      {dish > 0 && (
        <g opacity={dish}>
          <Place x={540} y={1100} s={1.25}><PetriDish mold={mold} f={f} /></Place>
          {mold > 0.6 && <Place x={830} y={830} s={0.7} r={f}><Sparkle fill="#FFF3CF" /></Place>}
        </g>
      )}
      {refuse > 0 && (
        <g opacity={refuse}>
          <Place x={540} y={1330}><Counter /></Place>
          <Place x={700} y={1080}><Doc mood={0.1} shrug={no} /></Place>
          <Place x={330} y={1150} s={0.55} r={-20}><Capsule /></Place>
          <path d="M260 1080 L400 1220 M400 1080 L260 1220" {...sk} stroke={C.warn} strokeWidth={12} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - no} />
          {f < F("s1l5@end") + 6 && <Place x={540} y={880} s={2.0 * pop(f, F("s1l5:المضاد") - 4, 10)}><QuestionIcon /></Place>}
        </g>
      )}
      {woman > 0 && (
        <g opacity={woman}>
          <Place x={540} y={1150} s={1.15}><Woman mood={0.2} /></Place>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 + f / 40;
            return (<Place key={i} x={540 + Math.cos(a) * 330 * ring} y={1150 + Math.sin(a) * 300 * ring} s={0.3 * ring} r={a * 57}><Capsule band={[AWARE.access, AWARE.watch, AWARE.reserve, C.brand][i % 4]} /></Place>);
          })}
          {lock > 0 && f < F("s1l6@end") + 12 - 16 && <Place x={540} y={880} s={2.6 * lock}><Lock /></Place>}
        </g>
      )}
    </Svg>
  );
};
const s1: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s1l2:مضاد") - 0.25, sfx: "shimmer", vol: 0.12 },
    { at: t.s("s1l3:يخسرنا") - 0.12, sfx: "crack", vol: 0.15 },
    { at: t.s("s1l4") - 0.1, sfx: "glass", vol: 0.12 },
    { at: t.s("s1l5:بيرفض@end") + 0.02, sfx: "pop", vol: 0.22 },
    { at: t.s("s1l6:كل") - 0.2, sfx: "whoosh", vol: 0.14 },
    { at: t.s("s1l6:صادمة@end") + 0.05, sfx: "heartbeat", vol: 0.3 },
  ],
  pulses: (t) => [t.f("s1l3:يخسرنا"), t.f("s1l6:صادمة@end")],
  tray: (t) => [
    { id: "q", arrive: t.f("s1l5@end") + 10, from: { x: 540, y: 880, s: 2.0 }, icon: icon(<QuestionIcon />), leave: t.f("s4l1:بيرفض") - 16 },
    { id: "lock", arrive: t.f("s1l6@end") + 12, from: { x: 540, y: 880, s: 2.6 }, icon: icon(<Lock bg={false} />), leave: t.f("s6l3:الست") - 16 },
  ],
};

// ============================================================ 2. Before / after penicillin  (s2l3, s2l7 = retakes)
const S2: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const cal = inOut(f, F("s2l1") - 4, F("s2l2") + 2, 12, 8);
  const yr = interpolate(f, [F("s2l1:قبل"), F("s2l1:سنة")], [0, 1], { ...clamp, easing: easeInOut });
  const hand = inOut(f, F("s2l2") - 4, F("s2l3") + 2, 12, 8);
  const danger = prog(f, F("s2l2:يموتك"), 10);
  const skin = inOut(f, F("s2l3") - 6, F("s2l4") + 2, 12, 8);
  const enter = prog(f, F("s2l3:تدخل"), 14); const blood = prog(f, F("s2l3:للدم") - 4, 16, easeInOut); const many = prog(f, F("s2l3:يوقفها") - 4, 16);
  const lab = inOut(f, F("s2l4") - 4, F("s2l5") + 2, 12, 8);
  const y28 = prog(f, F("s2l4:ألف"), 14); const sci = prog(f, F("s2l4:ألكسندر") - 4, 14);
  const dishBig = prog(f, F("s2l4:طبق") - 4, 14); const clear = prog(f, F("s2l4:ماتت") - 6, 18);
  const pen = inOut(f, F("s2l5") - 4, F("s2l6") + 2, 12, 8);
  const team = inOut(f, F("s2l6") - 4, F("s2l7") + 2, 12, 8); const toDrug = prog(f, F("s2l6:حولوه"), 16);
  const fac = inOut(f, F("s2l7") - 6, F("s2l7@end") + 30, 12, 8); const people = prog(f, F("s2l7:ملايين") - 2, 20);
  const bugs = [0, 1, 2, 3, 4, 5].filter((i) => i < 1 + Math.floor(enter * 2 + many * 4));
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: "#B07A3E", opacity: 0.08 * Math.min(1, prog(f, F("s2l1"), 10)) * (1 - prog(f, F("s2l7"), 12)) }} />
      <Svg>
        {cal > 0 && <Place x={540} y={1080} s={1.7 * cal}><Calendar year={String(Math.round(2026 - 100 * yr))} /></Place>}
        {hand > 0 && <g opacity={hand}><Place x={600} y={1120} s={1.25} r={-8}><HandScratch glow={danger} /></Place></g>}
        {skin > 0 && (
          <g opacity={skin}>
            <Place x={540} y={1080} s={0.95}>
              <SkinSection />
              {bugs.map((i) => (
                <Place key={i} x={-120 + (i % 3) * 70 + blood * (i * 70 - 160)} y={interpolate(enter, [0, 1], [-260, -120 + Math.floor(i / 3) * 60]) + blood * (320 - Math.floor(i / 3) * 60) + bob(f, 5, 30, i * 7)} s={0.9}>
                  <MiniBug />
                </Place>
              ))}
            </Place>
          </g>
        )}
        {lab > 0 && (
          <g opacity={lab}>
            <Place x={540} y={760} s={0.75 * y28}><Calendar year="1928" /></Place>
            <rect x={80} y={1420} width={920} height={40} rx={16} fill="#D9B98C" {...sk} />
            <Place x={300 + (1 - sci) * -300} y={1080} s={1.05}><Doc glasses mood={0.3 + 0.5 * clear} hair="#6B5B4B" /></Place>
            {dishBig > 0 && <Place x={740} y={1160} s={0.75 * dishBig}><PetriDish mold={dishBig} clear={clear} f={f} /></Place>}
          </g>
        )}
        {pen > 0 && (
          <g opacity={pen}>
            <Place x={420} y={1120} s={1.1}><PetriDish mold={1} clear={1} f={f} /></Place>
            <Place x={820} y={1080} s={0.8 * pop(f, F("s2l5:البنسلين") - 4, 12)}><Bottle level={1} /></Place>
            <Label x={820} y={1330} text="Penicillin" size={44} dir="ltr" o={prog(f, F("s2l5:البنسلين"), 10)} />
          </g>
        )}
        {team > 0 && (
          <g opacity={team}>
            {[-260, 0, 260].map((x, i) => (<Place key={i} x={540 + x} y={1040 + bob(f, 5, 46, i * 10)} s={0.72 * pop(f, F("s2l6") + i * 5, 10)}><Doc glasses={i !== 1} mood={0.6} hair={["#6B5B4B", C.ink, "#A0785A"][i]} /></Place>))}
            <Label x={540} y={1380} text="Oxford" dir="ltr" size={46} o={prog(f, F("s2l6:أكسفورد"), 10)} />
            <Place x={540} y={1500} s={0.5 * toDrug} r={-20}><Capsule /></Place>
          </g>
        )}
        {fac > 0 && (
          <g opacity={fac}>
            <path d="M160 1220 V980 L320 1060 V980 L480 1060 V900 H600 V1220 Z" fill={C.iconBg} {...sk} />
            <rect x={120} y={1220} width={860} height={40} rx={20} fill={C.ink} />
            {Array.from({ length: 6 }).map((_, i) => (<Place key={i} x={620 + ((f * 4 + i * 70) % 420)} y={1185} s={0.22} r={-10}><Capsule /></Place>))}
            {Array.from({ length: 24 }).map((_, i) => {
              const p = Math.max(0, Math.min(1, people * 24 - i));
              return (<g key={i} transform={`translate(${170 + (i % 8) * 105} ${1390 + Math.floor(i / 8) * 95}) scale(${0.32 * pop(p * 10, 0, 10)})`}><circle cy={-58} r={30} fill={C.good} {...sk} /><path d="M-50 60 C-50 -6 50 -6 50 60 Z" fill={C.good} {...sk} /></g>);
            })}
          </g>
        )}
      </Svg>
    </>
  );
};
const s2: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s2l1") - 0.1, sfx: "whoosh", vol: 0.2 },
    { at: t.s("s2l3") - 0.12, sfx: "bubbles", vol: 0.18, prio: true },     // retake starts: covers the room change
    { at: t.s("s2l4") - 0.1, sfx: "glass", vol: 0.12 },
    { at: t.s("s2l4:ماتت@end") + 0.05, sfx: "ding", vol: 0.13 },
    { at: t.s("s2l5:البنسلين@end") + 0.05, sfx: "shimmer", vol: 0.13 },
    { at: t.s("s2l7") - 0.12, sfx: "pop", vol: 0.2, prio: true },          // retake starts
  ],
  pulses: (t) => [t.f("s2l5:البنسلين@end"), t.f("s2l7:ملايين@end")],
  tray: (t) => [{ id: "cal", arrive: t.f("s2l4@end") + 6, from: { x: 540, y: 760, s: 1.6 }, icon: icon(<CalendarIcon year="1928" />) }],
};

// ============================================================ 3. AWaRe
const S3: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const caps = inOut(f, F("s3l1") - 4, F("s3l2") + 2, 12, 8); const diff = prog(f, F("s3l1:مش") - 4, 14);
  const who = pop(f, F("s3l2") - 2, 12); const whoOut = prog(f, F("s3l2:قسمتها"), 10, easeIn);
  const cols = [pop(f, F("s3l2:مجموعات") - 6, 12), pop(f, F("s3l2:مجموعات") - 2, 12), pop(f, F("s3l2:مجموعات") + 2, 12)];
  const glow = [prog(f, F("s3l3:أساسية") - 2, 10) * (1 - prog(f, F("s3l3:ومضادات"), 8)), prog(f, F("s3l3:المراقبة") - 2, 10) * (1 - prog(f, F("s3l4"), 8)), prog(f, F("s3l4:احتياطي") - 2, 10)];
  const colsOut = prog(f, F("s3l4:آخر") - 8, 12, easeIn);
  const card = pop(f, F("s3l4:آخر") - 4, 14);
  const cold = pop(f, F("s3l5:دور") - 4, 12);
  const burn = interpolate(f, [F("s3l5:بنحرق"), F("s3l5:الفاضي@end") + 6], [0, 1], { ...clamp, easing: easeInOut });
  const colX = [790, 540, 290];  // RTL reading order: Access on the right
  const colC = [AWARE.access, AWARE.watch, AWARE.reserve];
  const colL = [["Access", "أساسية"], ["Watch", "تحت المراقبة"], ["Reserve", "احتياطي"]];
  return (
    <Svg>
      {caps > 0 && (
        <g opacity={caps}>
          {[0, 1, 2].map((i) => (<Place key={i} x={colX[i]} y={1080 + bob(f, 6, 40, i * 9)} s={0.6} r={-25}><Capsule band={diff > 0.5 ? colC[i] : C.brand} /></Place>))}
          {diff > 0 && [0, 1].map((i) => (<Label key={i} x={(colX[i] + colX[i + 1]) / 2} y={1100} text="≠" size={90} color={C.key} o={diff} dir="ltr" />))}
        </g>
      )}
      {who > 0 && whoOut < 1 && <Place x={540} y={1060} s={1.1 * who * (1 - 0.4 * whoOut)} o={1 - whoOut}><Globe /></Place>}
      {colsOut < 1 && cols.map((p, i) => p > 0 && (
        <Place key={i} x={colX[i]} y={1170} s={0.92 * p} o={1 - colsOut}><AwareColumn color={colC[i]} label={colL[i][0]} ar={colL[i][1]} glow={glow[i]} /></Place>
      ))}
      {card > 0 && f < F("s3l5@end") + 30 && (
        <g>
          <Place x={cold > 0 ? 640 : 540} y={1120} s={1.05 * card} r={6 * Math.sin(f / 20)}><LastCard burn={burn} f={f} /></Place>
          {cold > 0 && <Place x={270} y={1150 + bob(f, 8, 40)} s={0.9 * cold}><Virus spin={f * 0.6} /></Place>}
        </g>
      )}
    </Svg>
  );
};
const s3: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s3l1") - 0.1, sfx: "whoosh", vol: 0.18 },
    { at: t.s("s3l2:مجموعات") - 0.25, sfx: "paper", vol: 0.16 },
    { at: t.s("s3l4:آخر") - 0.25, sfx: "pop", vol: 0.18 },
    { at: t.s("s3l5:بنحرق") - 0.1, sfx: "crack", vol: 0.12 },
  ],
  pulses: (t) => [t.f("s3l4:كارت@end")],
};

// ============================================================ 4. Why the pharmacist refuses
const S4: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const q = inOut(f, F("s4l1") - 4, F("s4l1:البرد") + 2, 12, 8); const chk = prog(f, F("s4l1:بيرفض"), 10);
  const vir = inOut(f, F("s4l1:البرد") - 4, F("s4l2") + 2, 12, 8); const vir2 = pop(f, F("s4l1:فيروسات") - 4, 12);
  const bac = inOut(f, F("s4l2") - 4, F("s4l3") + 2, 12, 8); const hit = prog(f, F("s4l2:للبكتيريا") - 4, 14);
  const vb = inOut(f, F("s4l3") - 4, F("s4l4") + 2, 12, 8); const bounce = prog(f, F("s4l3:ولا") - 4, 18);
  const gut = inOut(f, F("s4l4") - 4, F("s4l4@end") + 30, 12, 8); const knock = prog(f, F("s4l4:النافعة") - 4, 14);
  return (
    <Svg>
      {q > 0 && <Place x={540} y={1080} s={3 * q}>{chk < 0.5 ? <QuestionIcon /> : <CheckIcon />}</Place>}
      {vir > 0 && (
        <g opacity={vir}>
          <Place x={330} y={1080} s={0.9}><SickPerson /></Place>
          <Place x={760} y={1060 + bob(f, 8, 44)} s={1.1 * vir2}><Virus spin={f * 0.6} /></Place>
        </g>
      )}
      {bac > 0 && (
        <g opacity={bac}>
          <Place x={640} y={1100 + bob(f, 6, 40)} s={1.6}><Bacterium mood={1 - 2 * hit} /></Place>
          <Place x={interpolate(hit, [0, 1], [180, 470])} y={1060} s={0.55} r={0}><Capsule /></Place>
        </g>
      )}
      {vb > 0 && (
        <g opacity={vb}>
          <Place x={680} y={1080 + bob(f, 8, 40)} s={1.2}><Virus spin={f * 0.6} /></Place>
          <Place x={interpolate(bounce, [0, 0.5, 1], [180, 520, 260])} y={1060 - 140 * Math.sin(bounce * Math.PI)} s={0.55} r={bounce * 200}><Capsule /></Place>
        </g>
      )}
      {gut > 0 && (
        <g opacity={gut}>
          <Place x={540} y={1180}><Gut /></Place>
          {[[-260, 1170], [-60, 1140], [160, 1200], [330, 1150]].map(([x, y], i) => (
            <Place key={i} x={540 + x + (knock > 0 ? (i % 2 ? 40 : -40) * knock : 0)} y={y + bob(f, 5, 30, i * 8) - 80 * knock * (i % 2)} s={0.8} r={knock * 50 * (i % 2 ? 1 : -1)}><MiniBug color={C.good} /></Place>
          ))}
          <Place x={interpolate(prog(f, F("s4l4:وهتدفع"), 20), [0, 1], [-100, 1180])} y={1180} s={0.5} r={-10}><Capsule /></Place>
        </g>
      )}
    </Svg>
  );
};
const s4: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s4l1:بيرفض@end") + 0.05, sfx: "ding", vol: 0.14 },
    { at: t.s("s4l1:فيروسات") - 0.25, sfx: "pop", vol: 0.16 },
    { at: t.s("s4l3:ولا") - 0.2, sfx: "bump", vol: 0.14 },
    { at: t.s("s4l4:النافعة") - 0.25, sfx: "bubbles", vol: 0.13 },
  ],
  pulses: (t) => [t.f("s4l1:بيرفض@end")],
};

// ============================================================ 5. How bacteria learn
const GRID = 12;
const S5: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const gym = inOut(f, F("s5l1") - 4, F("s5l2") + 2, 12, 8); const lift = Math.abs(Math.sin((f - F("s5l1:بيدرب")) / 6)) * prog(f, F("s5l1:بيدرب"), 6);
  const grid = inOut(f, F("s5l2") - 4, F("s5l5") + 2, 12, 8); const shine = prog(f, F("s5l2:درع") - 4, 10);
  const sweep = interpolate(f, [F("s5l3:المضاد"), F("s5l3:وتسعين@end")], [0, 1], { ...clamp, easing: easeInOut });
  const grow = prog(f, F("s5l4:تتكاثر") - 4, 40);
  const share = inOut(f, F("s5l5") - 4, F("s5l5@end") + 30, 12, 8); const give = prog(f, F("s5l5:نسخة") - 4, 20, easeInOut);
  const hero = [7, 4];
  return (
    <Svg>
      {gym > 0 && (
        <g opacity={gym}>
          {[-250, 0, 250].map((x, i) => (
            <g key={i}>
              <Place x={540 + x} y={1120 + bob(f, 5, 30, i * 9)} s={1.1}><Bacterium wobble={Math.sin(f / 9 + i) * 4} /></Place>
              <Place x={540 + x} y={980 - 40 * lift} s={0.8}><Dumbbell /></Place>
            </g>
          ))}
        </g>
      )}
      {grid > 0 && (
        <g opacity={grid}>
          {Array.from({ length: GRID * GRID }).map((_, k) => {
            const r = Math.floor(k / GRID), c = k % GRID; const isHero = r === hero[0] && c === hero[1];
            const x = 170 + c * 67, y = 760 + r * 67;
            const gone = !isHero && sweep * 1.15 > (c + 1) / GRID;
            const reborn = grow > 0 && !isHero && grow * 1.2 > Math.hypot(r - hero[0], c - hero[1]) / 9;
            if (gone && !reborn) return null;
            const shielded = isHero || reborn;
            return (
              <g key={k} transform={`translate(${x} ${y})`}>
                <rect x={-22} y={-15} width={44} height={30} rx={15} fill={C.bad} stroke={C.ink} strokeWidth={3} />
                {shielded && <path d="M10 -18 L28 -12 C28 4 22 12 10 18 C-2 12 -8 4 -8 -12 Z" fill={C.shield} stroke={C.ink} strokeWidth={3} opacity={isHero ? 0.6 + 0.4 * shine : 1} />}
                {isHero && shine > 0 && <circle r={40} fill="none" stroke={C.key} strokeWidth={5} opacity={shine} />}
              </g>
            );
          })}
          {sweep > 0 && sweep < 1 && <Place x={170 + sweep * 800} y={1130} s={0.7} r={-90}><Capsule /></Place>}
          <Label x={540} y={1640} text={sweep > 0.95 ? "999 ✕   1 ✓" : "1000"} size={54} dir="ltr" o={prog(f, F("s5l2:ألف") - 2, 8)} color={sweep > 0.95 ? C.warn : C.ink} />
        </g>
      )}
      {share > 0 && (
        <g opacity={share}>
          <Place x={330} y={1100 + bob(f, 5, 30)} s={1.5}><Bacterium shield /></Place>
          <Place x={760} y={1110 + bob(f, 5, 30, 9)} s={1.5}><Bacterium color="#C7B26A" shield={give > 0.95} /></Place>
          {give > 0 && give < 0.95 && <Place x={interpolate(give, [0, 1], [380, 780])} y={1000 - 120 * Math.sin(give * Math.PI)} s={0.8}><Shield /></Place>}
        </g>
      )}
    </Svg>
  );
};
const s5: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s5l1") - 0.1, sfx: "whoosh", vol: 0.16 },
    { at: t.s("s5l2:درع@end") + 0.05, sfx: "metal", vol: 0.14 },
    { at: t.s("s5l3") - 0.15, sfx: "whoosh", vol: 0.14 },
    { at: t.s("s5l4:تتكاثر") - 0.2, sfx: "bubbles", vol: 0.15 },
    { at: t.s("s5l5:نسخة") - 0.25, sfx: "pop", vol: 0.14 },
  ],
  pulses: (t) => [t.f("s5l3:وتسعين@end")],
  tray: (t) => [{ id: "shield", arrive: t.f("s5l4@end") + 8, from: { x: 540, y: 1100, s: 2.2 }, icon: icon(<g transform="scale(0.5)"><Shield /></g>) }],
};

// ============================================================ 6. The culture + her story  (s6l7 = retake)
const S6: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const warn = inOut(f, F("s6l1") - 4, F("s6l2") + 2, 12, 8);
  const plate = inOut(f, F("s6l2:مزرعة") - 6, F("s6l3") - 3, 12, 8);
  const swab = inOut(f, F("s6l2:عينة") - 6, F("s6l2:يزرع") + 8, 8, 8);
  const lawn = prog(f, F("s6l2:يزرع"), 18);
  const discs = prog(f, F("s6l2:ويجرب") - 4, 16);
  const kills = [0, 1, 2, 3, 4, 5].map((i) => (i % 2 === 0 ? prog(f, F("s6l2:يقتلها") - 4 + i * 2, 12) : 0));
  const story = inOut(f, F("s6l3") + 3, F("s6l6") - 3, 12, 8);
  const cal = pop(f, F("s6l4:ألفين") - 4, 12); const usa = pop(f, F("s6l4:أمريكا") - 4, 12);
  const bug = pop(f, F("s6l5:عدوى") - 4, 12);
  const plate26 = inOut(f, F("s6l6") + 3, F("s6l7") - 3, 12, 8);
  const d26 = prog(f, F("s6l6:اتجرب") - 2, 30); const fail = prog(f, F("s6l6:ولا") - 2, 24);
  const end = inOut(f, F("s6l7") + 3, F("s6l7@end") + 30, 12, 8); const grey = prog(f, F("s6l7:وماتت") + 6, 30);
  return (
    <Svg>
      {warn > 0 && <Place x={540} y={1100} s={2.4 * warn}><Warn /></Place>}
      {plate > 0 && (
        <g opacity={plate}>
          <Place x={540} y={1120} s={1.2}><CulturePlate discs={Math.round(6 * discs)} kill={kills} lawn={lawn} /></Place>
          {swab > 0 && <Place x={760} y={900} s={1.1} o={swab}><Swab /></Place>}
        </g>
      )}
      {story > 0 && (
        <g opacity={story}>
          <Place x={540} y={1180} s={1.25}><Woman mood={0.2 - bug * 0.6} /></Place>
          {cal > 0 && <Place x={830} y={820} s={0.7 * cal}><Calendar year="2016" /></Place>}
          {usa > 0 && <g transform={`translate(250 820) scale(${usa})`}><rect x={-100} y={-50} width={200} height={100} rx={20} fill={C.iconBg} {...sk} /><text x={0} y={18} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={C.ink} direction="ltr">USA</text></g>}
          {usa > 0 && <Label x={540} y={1560} text="70+" size={56} dir="ltr" o={prog(f, F("s6l4:السبعينيات") - 2, 10)} />}
          {bug > 0 && [[-200, -40], [210, -10], [-150, 160]].map(([x, y], i) => (<Place key={i} x={540 + x} y={1180 + y + bob(f, 6, 30, i * 7)} s={0.8 * bug}><MiniBug /></Place>))}
        </g>
      )}
      {plate26 > 0 && (
        <g opacity={plate26}>
          <Place x={540} y={1110} s={1.3}><CulturePlate discs={Math.round(26 * d26)} lawn={1} fails={fail} /></Place>
          <Label x={540} y={1600} text={fail > 0.6 ? "26 ❌" : String(Math.round(26 * d26))} size={64} dir="ltr" color={fail > 0.6 ? C.warn : C.ink} />
        </g>
      )}
      {end > 0 && (
        <g opacity={end}>
          <Place x={540} y={1150} s={1.3}><Woman grey={grey} mood={0} /></Place>
          {grey > 0 && <Place x={540} y={820} s={0.7} o={grey}><Sparkle fill="#F3EBDD" /></Place>}
        </g>
      )}
    </Svg>
  );
};
const s6: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s6l1") - 0.1, sfx: "heartbeat", vol: 0.22 },
    { at: t.s("s6l2:مزرعة") - 0.25, sfx: "glass", vol: 0.12 },
    { at: t.s("s6l2:ويجرب") - 0.2, sfx: "pop", vol: 0.12 },
    { at: t.s("s6l4:ألفين") - 0.25, sfx: "paper", vol: 0.14 },
    { at: t.s("s6l6:ولا") - 0.2, sfx: "click", vol: 0.13 },
    { at: t.s("s6l7") - 0.15, sfx: "heartbeat", vol: 0.26, prio: true },   // retake starts
  ],
  pulses: (t) => [t.f("s6l6:اشتغل@end")],
  // the music stops 1 s before «وماتت» and comes back with the retake (swell)
  silence: (t) => [[t.s("s6l7") - 1.0, t.s("s6l7") + 0.05]],
};

// ============================================================ 7. The real size  (s7l1 from «حسب», s7l2 = retakes)
const S7: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const crowd = inOut(f, F("s7l1") - 4, F("s7l1:حسب") + 2, 12, 8);
  const jour = inOut(f, F("s7l1:حسب") - 4, F("s7l1:مليون") + 2, 12, 8);
  const count = interpolate(f, [F("s7l1:سنة") - 2, F("s7l1:وربع@end")], [0, 1.27], { ...clamp, easing: easeOut });
  const bars = inOut(f, F("s7l1:مليون") - 4, F("s7l2") + 2, 12, 8);
  const b1 = prog(f, F("s7l1:مليون") - 2, 16), b2 = prog(f, F("s7l1:الإيدز") - 4, 16), b3 = prog(f, F("s7l1:الملاريا") - 4, 16);
  const chips = prog(f, F("s7l1:الملاريا@end") - 2, 10) * (1 - prog(f, F("s7l2:الولادة") - 6, 8, easeIn));
  const risk = inOut(f, F("s7l2") - 4, F("s7l2@end") + 30, 12, 8);
  const ic = [pop(f, F("s7l2:الولادة") - 4, 12), pop(f, F("s7l2:والعمليات") - 4, 12), pop(f, F("s7l2:والكيماوي") - 4, 12)];
  const danger = prog(f, F("s7l2:خطر") - 4, 12);
  return (
    <Svg>
      {crowd > 0 && <Place x={540} y={1200} s={1.05} o={crowd}><Crowd n={5} /></Place>}
      {jour > 0 && (
        <g opacity={jour}>
          <Place x={540} y={1060} s={1.1}><Journal label="The Lancet" /></Place>
          {count > 0 && <Label x={540} y={1440} text={`${count.toFixed(2)}M`} size={110} color={C.warn} dir="ltr" />}
        </g>
      )}
      {bars > 0 && (
        <g opacity={bars}>
          <Place x={540} y={880}>
            <Bars max={1.3} items={[{ label: "المقاومة", value: 1.27, color: C.warn, p: b1 }, { label: "الإيدز", value: 0.86, color: "#9DB4C9", p: b2 }, { label: "الملاريا", value: 0.64, color: "#C9B59D", p: b3 }]} />
          </Place>
          <g opacity={chips}>
            <rect x={110} y={1230} width={860} height={110} rx={28} fill={C.card} {...sk} />
            <Label x={540} y={1302} text="1 من كل 6 عدوى بكتيرية مقاومة (WHO, 2023)" size={38} />
            <rect x={210} y={1370} width={660} height={110} rx={28} fill="#F6D2CC" {...sk} />
            <Label x={540} y={1442} text="1 من كل 3 في منطقتنا" size={42} color={C.warn} />
          </g>
        </g>
      )}
      {risk > 0 && (
        <g opacity={risk}>
          {[<Baby key="b" />, <Scalpel key="s" />, <IVBag key="i" />].map((n, i) => (
            <g key={i}>
              <Place x={[810, 540, 270][i]} y={1100 + bob(f, 5, 40, i * 9)} s={1.0 * ic[i]}>{n}</Place>
              {danger > 0 && <Place x={[810, 540, 270][i] + 70} y={1020} s={0.8 * danger}><Warn /></Place>}
            </g>
          ))}
          <Label x={540} y={1330} text={["الولادة القيصرية", "العمليات", "الكيماوي"].filter((_, i) => ic[i] > 0.5).join(" • ")} size={40} />
        </g>
      )}
    </Svg>
  );
};
const s7: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s7l1:حسب") - 0.12, sfx: "whoosh", vol: 0.17, prio: true },  // retake starts
    { at: t.s("s7l1:وربع@end") + 0.05, sfx: "ding", vol: 0.13 },
    { at: t.s("s7l1:الملاريا@end") + 0.1, sfx: "paper", vol: 0.12 },
    { at: t.s("s7l2:خطر") - 0.25, sfx: "heartbeat", vol: 0.2 },
  ],
  pulses: (t) => [t.f("s7l1:وربع@end")],
};

// ============================================================ 8. Three things
const NumCard: React.FC<{ n: string; children: React.ReactNode }> = ({ n, children }) => (
  <g>
    <rect x={-420} y={-110} width={840} height={220} rx={36} fill={C.card} {...sk} />
    <circle cx={330} cy={0} r={72} fill={C.key} {...sk} />
    <text x={330} y={34} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={96} fill="#fff" direction="ltr">{n}</text>
    {children}
  </g>
);
const S8: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const c = [F("s8l2"), F("s8l3"), F("s8l4")];
  const thumbs = pop(f, F("s8l2:اشكره") - 4, 12);
  const stop = pop(f, F("s8l4:متوقفش") - 4, 12);
  const out = prog(f, F("s9l1") - 8, 8, easeIn);
  const three = inOut(f, F("s8l1") - 4, F("s8l2") - 2, 12, 8);
  const nodes = [
    <g key="1"><Place x={-150} y={0} s={0.45}><Capsule /></Place><path d="M-230 -60 L-70 60 M-70 -60 L-230 60" {...sk} stroke={C.warn} strokeWidth={10} />{thumbs > 0 && <Place x={60} y={0} s={0.9 * thumbs}><ThumbsUp /></Place>}</g>,
    <g key="2"><Place x={-150} y={0} s={0.55}><Virus /></Place><Place x={30} y={0} s={0.4} r={-20}><Capsule /></Place><path d="M-40 -60 L100 60 M100 -60 L-40 60" {...sk} stroke={C.warn} strokeWidth={10} /></g>,
    <g key="3"><Place x={-200} y={0} s={0.42}><Doc mood={0.8} /></Place><Place x={-20} y={0} s={0.42}><Clock a={f / 10} /></Place>{stop > 0 && <Place x={160} y={0} s={0.8 * stop}><StopHand /></Place>}{stop > 0 && <g opacity={stop}><rect x={-330} y={130} width={600} height={90} rx={30} fill={C.key} {...sk} /><text x={-30} y={192} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#fff">ارجع للدكتور</text></g>}</g>,
  ];
  return (
    <Svg>
      {three > 0 && (
        <g opacity={three}>
          <circle cx={540} cy={1040} r={170 * three} fill={C.key} {...sk} />
          <text x={540} y={1110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={230 * three} fill="#fff" direction="ltr">3</text>
          {[0, 1, 2].map((i) => (<rect key={i} x={300 + i * 180} y={1290} width={120} height={160} rx={18} fill={C.card} {...sk} opacity={pop(f, F("s8l1:حاجات") - 4 + i * 4, 10)} />))}
        </g>
      )}
      {c.map((a, i) => {
        const p = pop(f, a - 4, 12); if (p <= 0) return null;
        return (<Place key={i} x={540 + (1 - p) * 500} y={830 + i * 260} s={0.92 + 0.08 * p} r={(1 - p) * 8 + (i - 1) * 1.2} o={1 - out}><NumCard n={String(i + 1)}>{nodes[i]}</NumCard></Place>);
      })}
    </Svg>
  );
};
const s8: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s8l1") - 0.1, sfx: "paper", vol: 0.18 },
    { at: t.s("s8l2") - 0.15, sfx: "ding", vol: 0.12, prio: true },
    { at: t.s("s8l3") - 0.15, sfx: "ding", vol: 0.12, prio: true },
    { at: t.s("s8l4") - 0.15, sfx: "ding", vol: 0.12, prio: true },
    { at: t.s("s8l4:متوقفش") - 0.2, sfx: "pop", vol: 0.12 },
  ],
  pulses: () => [],
};

// ============================================================ 9. Closing
const S9: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const cap = inOut(f, F("s9l1") - 4, F("s9l2") + 2, 14, 8);
  const heal = interpolate(f, [F("s9l1:استخدامك"), F("s9l1:الصح@end") + 6], [1, 0], { ...clamp, easing: easeInOut });
  const shine = prog(f, F("s9l1:الصح"), 16);
  const chat = inOut(f, F("s9l2") - 4, F("s9l2@end") + 60, 12, 8);
  const b = [pop(f, F("s9l2:نتكلم") - 2, 12), pop(f, F("s9l2:أي") - 2, 12), pop(f, F("s9l2:الكومنتات") - 4, 12)];
  return (
    <Svg>
      {cap > 0 && (
        <g opacity={cap}>
          <Place x={540} y={1080 + bob(f, 8, 50)} s={1.8} r={-24}><Capsule crack={heal} glow={0.6 * shine} /></Place>
          {shine > 0 && [[330, 880], [760, 900], [780, 1260], [300, 1240]].map(([x, y], i) => (<Place key={i} x={x} y={y} s={0.7 * shine} r={shine * 45}><Sparkle /></Place>))}
        </g>
      )}
      {chat > 0 && (
        <g opacity={chat}>
          <Place x={360} y={940} s={1.0 * b[0]}><Bubble /></Place>
          <Place x={720} y={1110} s={0.9 * b[1]}><Bubble w={220} /></Place>
          <Place x={420} y={1290} s={1.1 * b[2]}><Bubble w={300} /></Place>
        </g>
      )}
    </Svg>
  );
};
const s9: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s9l1:الصح@end") + 0.05, sfx: "shimmer", vol: 0.15 },
    { at: t.s("s9l2:الكومنتات") - 0.25, sfx: "pop", vol: 0.14 },
  ],
  pulses: (t) => [t.f("s9l1:الصح@end")],
  silence: (t) => [[t.s("s9l1") - 1.0, t.s("s9l1") - 0.1]],     // music stops 1 s before the last sentence
};

export const SCENES_V9: Record<number, SceneDef> = {
  1: { C: S1, ...s1 }, 2: { C: S2, ...s2 }, 3: { C: S3, ...s3 }, 4: { C: S4, ...s4 }, 5: { C: S5, ...s5 },
  6: { C: S6, ...s6 }, 7: { C: S7, ...s7 }, 8: { C: S8, ...s8 }, 9: { C: S9, ...s9 },
};

/** retake sentence starts: a music swell enters with them (covers the room change, stays under the voice) */
export const retakeStarts = (t: T) => [t.s("s2l3"), t.s("s2l7"), t.s("s6l7"), t.s("s7l1:حسب")];

/** pause markers for the closing disclaimer */
export const DISCLAIMER = "شرح مبسط للتوعية، مش بديل لاستشارة الطبيب أو الصيدلي. المصادر في الوصف.";
export { Shield, ShieldIcon, PersonIcon, Gut, Journal };
