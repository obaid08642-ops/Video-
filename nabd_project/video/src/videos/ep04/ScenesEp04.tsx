// Ep04 (paracetamol, recorded voice). Every beat is anchored to a spoken word of the timing JSON.
// Legal (scripts/04_paracetamol_v3.md + the owner's rules): NO picture of any real person (the press conference is a podium
// with microphones, nothing else), «Tylenol» only in the Trump scene, «Panadol» never on screen, no dose numbers,
// generic boxes only, no logos. Scenes 1-9 = the long video; 11-14 = Short-only scenes (hooks / endings).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Place, CheckIcon, QuestionIcon, Sparkle, SickPerson, Clock } from "../../assets";
import { Calendar, Doc, Crowd, KeyShape, Moon, Scissors } from "../../assets/more";
import { Bubble, Globe, StopHand, Warn, Baby, IVBag } from "../../assets/v9";
import { Balance, Chip, Hospital, OkMark, Person, Pharmacy, Pregnant, Stomach, Stopwatch, XMark, Brain, Muscle } from "../../assets/ep02";
import { MysteryCard } from "../../assets/ep03";
import { Cells, CorrCause, Cox, Drop, Flash, KidCrowd, Liver, Napqi, PackBox, Num, Papers, Pharmacist, Podium, Rescuer, Siblings, Spoon, Tablet, Thermo, Timeline04, Worm, LabBottle, Chemist, WeightScale, BrainSpine } from "../../assets/ep04";
import { IconCircle, sk, type TrayItem } from "../../components/Frame";
import { bob, clamp, easeIn, easeInOut, easeOut, inOut, pop, prog } from "../../lib/anim";
import type { T } from "../../lib/timing";
import type { Cue } from "../../lib/sfx";
import { C, FONT } from "../../theme";

export type SceneDef = { C: React.FC<{ t: T }>; cues: (t: T) => Cue[]; pulses: (t: T) => number[]; tray?: (t: T) => TrayItem[]; silence?: (t: T) => [number, number][] };
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{children}</svg>
);
const icon = (n: React.ReactNode) => (<IconCircle><g transform="translate(50 50)">{n}</g></IconCircle>);
const Label: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; o?: number; dir?: "rtl" | "ltr" }> = ({ x, y, text, size = 46, color = C.ink, o = 1, dir = "rtl" }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill={color} opacity={o} direction={dir} unicodeBidi={dir === "ltr" ? "bidi-override" : undefined}>{text}</text>
);
const CX = 505; // centre of the caption card column
/** the on-screen-only info cards (no voice): paper card, rows of text, one source line. p = 0..1 pop-in */
type Row = { text: string; size?: number; color?: string; dir?: "rtl" | "ltr" };
const Info: React.FC<{ cy: number; rows: Row[]; p: number; fill?: string; w?: number; sub?: string }> = ({ cy, rows, p, fill = "#FFF3CF", w = 800, sub }) => {
  if (p <= 0.01) return null;
  const gap = (r: Row) => (r.size ?? 46) * 1.45;
  const h = rows.reduce((a, r) => a + gap(r), 0) + 56 + (sub ? 44 : 0);
  let y = cy - h / 2 + 28;
  return (
    <g opacity={Math.min(1, p * 1.4)} transform={`translate(${CX} ${cy + (1 - p) * 30}) scale(${0.94 + 0.06 * p}) translate(${-CX} ${-cy})`}>
      <rect x={CX - w / 2 + 9} y={cy - h / 2 + 11} width={w} height={h} rx={34} fill={C.cardShadow} />
      <rect x={CX - w / 2} y={cy - h / 2} width={w} height={h} rx={34} fill={fill} {...sk} />
      {rows.map((r, i) => { y += gap(r); return <Label key={i} x={CX} y={y - (r.size ?? 46) * 0.42} text={r.text} size={r.size ?? 46} color={r.color ?? C.ink} dir={r.dir ?? "rtl"} />; })}
      {sub && <Label x={CX} y={cy + h / 2 - 20} text={sub} size={26} color={C.source} dir="ltr" />}
    </g>
  );
};
const sparkle = (f: number, a: number, x: number, y: number, s = 1) => { const p = pop(f, a, 12) * (1 - prog(f, a + 14, 10, easeIn)); return p > 0.01 ? <Place x={x} y={y} s={s * p} r={f * 3}><Sparkle size={1.2} fill="#F7C548" /></Place> : null; };

// ============================================================ 1. Hook (long)
const S1: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const W = (a: string, b: string) => inOut(f, F(a) - 4, F(b + "@end") + 6, 12, 8);
  const fam = W("s1l1", "s1l1"), sym = W("s1l2", "s1l2"), safe = W("s1l3", "s1l4"), q = W("s1l5", "s1l5");
  const pod = W("s1l6", "s1l8"), liv = W("s1l9", "s1l10"), stop = W("s1l11", "s1l11"), fin = W("s1l12", "s1l12");
  const [sA, sB, sC] = [pop(f, F("s1l2:للصداع") - 3, 12), pop(f, F("s1l2:والسخونية") - 3, 12), pop(f, F("s1l2:والأوجاع") - 3, 12)];
  const nm = prog(f, F("s1l12:البرستمول") - 2, 10) * (1 - prog(f, F("s1l12@end") + 4, 10, easeIn));
  return (
    <Svg>
      {fam > 0 && (
        <g opacity={fam}>
          <Place x={540} y={1130} s={1.3 + 0.03 * bob(f, 1, 90)}><Globe /></Place>
          {[[430, 1070, 0.5], [640, 1190, 0.5], [560, 1010, 0.4]].map(([x, y, s], i) => (<Place key={i} x={x} y={y} s={s * pop(f, F("s1l1:أشهر") + i * 5, 12)}><Tablet /></Place>))}
          <Place x={540} y={1130} s={0.95 * pop(f, F("s1l1:دوا") - 4, 14)}><Tablet glow={0.5} /></Place>
        </g>
      )}
      {sym > 0 && (
        <g opacity={sym}>
          <Place x={250} y={1100} s={0.9 * sA}><Thermo level={0.85} /></Place>
          <Place x={540} y={1100} s={0.95 * sB}><Person fill="#F3C79A" /><Place x={0} y={-130} s={0.9}><Flash s={0.8} /></Place></Place>
          <Place x={830} y={1120} s={0.9 * sC}><Muscle /></Place>
        </g>
      )}
      {safe > 0 && (
        <g opacity={safe}>
          <Place x={540} y={1100} s={2.6 * pop(f, F("s1l3:سمعة") - 3, 14)}><CheckIcon /></Place>
          <Place x={540} y={1100} s={1.0 * pop(f, F("s1l3:الأمان") - 6, 14)} o={0.0}><Tablet /></Place>
          <Place x={760} y={1380} s={0.8 * pop(f, F("s1l4:صح") - 4, 12)}><Tablet glow={1} /></Place>
        </g>
      )}
      {q > 0 && (
        <g opacity={q}>
          <Place x={540} y={1150} s={1.5}><Tablet glow={0.8} /></Place>
          <Place x={330} y={870} s={pop(f, F("s1l5:إزاي") - 2, 12) * 0.8} r={-10}><QuestionIcon /></Place>
          <Place x={760} y={900} s={pop(f, F("s1l5:إزاي") + 4, 12) * 0.9} r={10}><QuestionIcon /></Place>
          <Place x={540} y={1450} s={0.9 * pop(f, F("s1l5:قرن") - 4, 12)}><Chip text="أكتر من قرن" w={360} size={46} /></Place>
        </g>
      )}
      {pod > 0 && (
        <g opacity={pod}>
          <Place x={540} y={1100} s={0.85}><Podium /></Place>
          <Place x={200} y={1000} s={0.7 * pop(f, F("s1l6:الحوامل") - 4, 12)}><Pregnant /></Place>
          <Place x={210} y={1180} s={0.8 * pop(f, F("s1l6:يحذر") - 4, 12)}><Warn /></Place>
          <Place x={790} y={1010} s={0.9 * pop(f, F("s1l7:بالتوحد") - 4, 12)}><Baby /></Place>
          <Place x={540} y={1470} s={pop(f, F("s1l8") - 2, 14) * 1.3}><QuestionIcon /></Place>
        </g>
      )}
      {liv > 0 && (
        <g opacity={liv}>
          <Place x={540} y={1080} s={0.9 * pop(f, F("s1l9") - 4, 14)}><Liver hurt={prog(f, F("s1l10:تلف"), 20)} /></Place>
          <Place x={780} y={850} s={1.3 * pop(f, F("s1l10:تلف") - 4, 12)}><Warn /></Place>
        </g>
      )}
      {stop > 0 && <g opacity={stop}><Place x={540} y={1100} s={2.3 * pop(f, F("s1l11") - 2, 12)}><StopHand /></Place></g>}
      {fin > 0 && (
        <g opacity={fin}>
          <Place x={540} y={940} s={1.0}><Tablet glow={1} /></Place>
          {sparkle(f, F("s1l12:حكاية") - 3, 330, 820, 1.3)}{sparkle(f, F("s1l12:أغرب") - 3, 760, 860, 1.1)}
          <Info cy={1280} p={nm} rows={[{ text: "باراسيتامول", size: 54, color: C.key }, { text: "=", size: 40 }, { text: "أسيتامينوفين", size: 54 }, { text: "=", size: 40 }, { text: "APAP", size: 54, color: C.key, dir: "ltr" }]} />
        </g>
      )}
    </Svg>
  );
};
const s1: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s1l1:دوا") - 0.15, sfx: "pop", vol: 0.14 },
    { at: t.s("s1l3:سمعة") - 0.15, sfx: "ding", vol: 0.12 },
    { at: t.s("s1l5:إزاي") - 0.15, sfx: "pop", vol: 0.13 },
    { at: t.s("s1l6:يحذر") - 0.2, sfx: "whoosh", vol: 0.15 },
    { at: t.s("s1l10:تلف") - 0.1, sfx: "heartbeat", vol: 0.22, prio: true },
    { at: t.s("s1l12:حكاية") - 0.1, sfx: "shimmer", vol: 0.13 },
  ],
  pulses: (t) => [t.f("s1l10@end"), t.f("s1l12:مما@end")].filter((x) => x > 0),
  // music stops just before «تلف خطير في الكبد»
  silence: (t) => [[t.s("s1l10:تلف") - 0.9, t.s("s1l10@end") + 0.25]],
};

// ============================================================ 2. The double-dose situation
const S2: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const W = (a: string, b: string) => inOut(f, F(a) - 4, F(b + "@end") + 6, 12, 8);
  const sick = W("s2l1", "s2l3"), cold = W("s2l4", "s2l6"), hold = W("s2l7", "s2l8"), many = W("s2l9", "s2l9"), same = W("s2l10", "s2l11"), name = W("s2l12", "s2l12"), act = W("s2l13", "s2l13");
  const fda = prog(f, F("s2l9:أدوية") - 2, 12) * (1 - prog(f, F("s2l9@end") + 6, 10, easeIn));
  const nm = t.has("s2l8") && !t.has("s1l12") ? prog(f, F("s2l8:برستمول") - 2, 10) * (1 - prog(f, F("s2l8@end") + 3, 10, easeIn)) : 0;
  const bands = ["#9DC9E8", "#F0A23B", "#CFE3B8", "#E6D3F0"];
  return (
    <Svg>
      {sick > 0 && (
        <g opacity={sick}>
          <Place x={380} y={1130} s={1.5}><SickPerson shiver={bob(f, 3, 12)} blink /></Place>
          <Place x={760} y={900} s={0.7 * pop(f, F("s2l2:برد") - 2, 12)}><Chip text="برد" w={190} size={44} /></Place>
          <Place x={760} y={1010} s={0.7 * pop(f, F("s2l2:وصداع") - 2, 12)}><Chip text="صداع" w={210} size={44} /></Place>
          <Place x={760} y={1120} s={0.7 * pop(f, F("s2l2:وحرارة") - 2, 12)}><Chip text="حرارة" w={210} size={44} /></Place>
          <Place x={700} y={1380} s={1.0 * pop(f, F("s2l3:قرص") - 4, 12)}><PackBox kind="pain" band="#F2D79A" /></Place>
          <Place x={520} y={1330 - 60 * prog(f, F("s2l3:قرص") + 4, 16)} s={0.7 * pop(f, F("s2l3:قرص") - 2, 12)}><Tablet /></Place>
        </g>
      )}
      {cold > 0 && (
        <g opacity={cold}>
          <Place x={330} y={1120} s={1.3}><SickPerson shiver={bob(f, 3, 12)} blink /></Place>
          <Place x={760} y={1080} s={1.1 * pop(f, F("s2l4:للبرد") - 4, 12)}><PackBox kind="cold" band="#9DC9E8" /></Place>
          <Place x={540} y={880} s={0.8 * pop(f, F("s2l4:شوية") - 4, 12)}><Clock a={(f - F("s2l4")) * 8} /></Place>
          <Place x={330} y={850} s={0.8 * pop(f, F("s2l5:الصداع") - 2, 12)}><Flash s={0.9} /></Place>
          <Place x={540} y={1400} s={0.8 * pop(f, F("s2l6:قرص") - 2, 12)} r={-8}><Tablet /></Place>
          <Place x={700} y={1410} s={0.7 * pop(f, F("s2l6:تاني") - 2, 12)} r={8}><Tablet /></Place>
        </g>
      )}
      {hold > 0 && (
        <g opacity={hold}>
          <Place x={540} y={1010} s={1.15}><PackBox kind="cold" band="#9DC9E8" /></Place>
          <Place x={540} y={880} s={2.2 * pop(f, F("s2l7") - 2, 12)}><StopHand /></Place>
          <Place x={800} y={1150 - bob(f, 8, 40)} s={1.4 * pop(f, F("s2l8:أصلا") - 6, 12)}><QuestionIcon /></Place>
          <Info cy={1440} p={nm} rows={[{ text: "باراسيتامول", size: 54, color: C.key }, { text: "أسيتامينوفين  =  APAP", size: 44 }]} />
        </g>
      )}
      {many > 0 && (
        <g opacity={many}>
          {bands.map((b, i) => {
            const x = 190 + i * 235, p = pop(f, F("s2l9:أدوية") + i * 7, 12);
            return (<g key={i}><Place x={x} y={930} s={0.75 * p}><PackBox kind="cold" band={b} /></Place><Place x={x} y={1050} s={0.42 * pop(f, F("s2l9:الفعالة") + i * 5, 12)}><Tablet glow={1} /></Place></g>);
          })}
          <Info cy={1310} p={fda} rows={[{ text: "أكتر من 600 دوا", size: 56, color: C.key }, { text: "فيهم نفس المادة", size: 50 }]} sub="FDA" />
        </g>
      )}
      {same > 0 && (
        <g opacity={same}>
          <Place x={260} y={1000} s={0.9}><PackBox kind="pain" band="#F2D79A" /></Place>
          <Place x={820} y={1000} s={0.9}><PackBox kind="cold" band="#9DC9E8" /></Place>
          <Place x={540} y={1200} s={1.2 * pop(f, F("s2l10:نفس") - 2, 12)}><Tablet glow={1} /></Place>
          <path d="M340 1030 Q430 1150 470 1180 M740 1030 Q650 1150 610 1180" fill="none" {...sk} strokeWidth={8} strokeDasharray="4 16" />
          <Place x={540} y={1440} s={pop(f, F("s2l11:مختلفين") - 4, 12)}><Chip text="نفس المادة الفعالة" w={520} size={46} fill="#FFF3CF" /></Place>
        </g>
      )}
      {name > 0 && (
        <g opacity={name}>
          <Place x={540} y={1120} s={1.4}><PackBox kind="plain" band="#F2D79A" /></Place>
          <Place x={540} y={1110} s={0.9 * pop(f, F("s2l12:التجاري") - 4, 12)}><XMark p={pop(f, F("s2l12:التجاري"), 12)} /></Place>
          <Label x={540} y={1450} text="الاسم التجاري مش كفاية" size={48} color={C.warn} o={pop(f, F("s2l12:التجاري"), 12)} />
        </g>
      )}
      {act > 0 && (
        <g opacity={act}>
          <Place x={380} y={1120} s={1.4}><PackBox kind="plain" band="#F2D79A" /></Place>
          <g opacity={pop(f, F("s2l13:المادة"), 12)}><circle cx={430} cy={1190} r={78} fill="#E4EEF3" opacity={0.7} {...sk} /><path d="M485 1245 L560 1320" {...sk} strokeWidth={16} /></g>
          <Place x={380} y={1480} s={pop(f, F("s2l13:المادة") + 2, 12)}><Chip text="المادة الفعالة" w={330} size={44} fill="#FFF3CF" /></Place>
          <Place x={800} y={1120} s={1.1 * pop(f, F("s2l13:الصيدلي") - 4, 12)}><Pharmacist /></Place>
        </g>
      )}
    </Svg>
  );
};
const s2: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s2l3:قرص") - 0.15, sfx: "pop", vol: 0.13 },
    { at: t.s("s2l6:تاني") - 0.15, sfx: "pop", vol: 0.13 },
    { at: t.s("s2l7") - 0.1, sfx: "bump", vol: 0.14 },
    { at: t.s("s2l9:أدوية") - 0.2, sfx: "whoosh", vol: 0.14 },
    { at: t.s("s2l11:مختلفين") - 0.3, sfx: "ding", vol: 0.12 },
    { at: t.s("s2l13:المادة") - 0.2, sfx: "click", vol: 0.12 },
  ],
  pulses: (t) => [t.f("s2l11@end")],
};

// ============================================================ 3. How it works (prostaglandins, COX)
const S3: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const W = (a: string, b: string) => inOut(f, F(a) - 4, F(b + "@end") + 6, 12, 8);
  const intro = W("s3l1", "s3l1"), body = W("s3l2", "s3l4"), pg = W("s3l5", "s3l6"), fn = W("s3l7", "s3l7"), amp = W("s3l8", "s3l10"), q = W("s3l11", "s3l13");
  const cox = W("s3l14", "s3l17"), simple = W("s3l18", "s3l19"), cns = W("s3l20", "s3l20"), paths = W("s3l21", "s3l22");
  const blockAt = F("s3l15:تصنيع"), chew = (f - F("s3l14")) / 4;
  const drops = Array.from({ length: 5 }).map((_, i) => ({ k: i, p: ((f - F("s3l14") - i * 14) % 70) / 70, on: f > F("s3l14") + i * 14 }));
  return (
    <Svg>
      {intro > 0 && <g opacity={intro}><Place x={540} y={1020} s={1.2}><Doc mood={0.7} glasses /></Place></g>}
      {body > 0 && (
        <g opacity={body}>
          <Place x={420} y={1160} s={1.5}><SickPerson shiver={bob(f, 3, 12)} blink /></Place>
          {[[620, 940], [700, 1080], [640, 1230], [760, 1000]].map(([x, y], i) => (<Place key={i} x={x} y={y - bob(f, 6, 50, i * 9)} s={0.7 * pop(f, F("s3l3:مواد") + i * 5, 12)}><Drop /></Place>))}
          <Place x={300} y={860} s={0.8 * pop(f, F("s3l2:بتتوجع") - 2, 12)}><Flash s={0.9} /></Place>
          <Place x={780} y={1330} s={0.55 * pop(f, F("s3l4:الحرارة") - 4, 12)}><Thermo level={0.85} /></Place>
        </g>
      )}
      {pg > 0 && (
        <g opacity={pg}>
          <Place x={540} y={1060} s={2.4 * pop(f, F("s3l5:البروستاجلاندين") - 2, 14)}><Drop /></Place>
          <Label x={540} y={1380} text="Prostaglandin" size={54} color={C.key} dir="ltr" o={prog(f, F("s3l5:البروستاجلاندين"), 10)} />
          <Place x={540} y={1050} s={0.7 * pop(f, F("s3l6:شريرة") - 2, 12)}><OkMark p={pop(f, F("s3l6:شريرة"), 12)} /></Place>
        </g>
      )}
      {fn > 0 && (
        <g opacity={fn}>
          {[[300, 1100], [540, 1200], [780, 1100]].map(([x, y], i) => (<Place key={i} x={x} y={y} s={0.9 * pop(f, F("s3l7:وظايف") + i * 6, 12)} r={f * (i % 2 ? 1 : -1) * 0.8}><IconCircle bg="#FFF3CF"><g transform="translate(50 50)"><circle r={18} fill={C.paper} {...sk} /><path d="M0 -34 V-24 M0 24 V34 M-34 0 H-24 M24 0 H34" {...sk} strokeWidth={7} /></g></IconCircle></Place>))}
        </g>
      )}
      {amp > 0 && (
        <g opacity={amp}>
          <Place x={380} y={1160} s={1.4}><SickPerson shiver={bob(f, 4, 10)} blink /></Place>
          {[0, 1, 2].map((i) => (<Place key={i} x={650 + (i % 2) * 90} y={950 + i * 120} s={0.65 * pop(f, F("s3l9:زيادة") + i * 5, 12)}><Drop /></Place>))}
          <Place x={780} y={900} s={1.1 * pop(f, F("s3l9:زيادة") + 6, 12)}><Flash s={1.1} /></Place>
          <Place x={840} y={1380} s={0.5 * pop(f, F("s3l10:للحرارة") - 4, 12)}><Thermo level={0.9} /></Place>
        </g>
      )}
      {q > 0 && (
        <g opacity={q}>
          <Place x={540} y={1130} s={1.7}><Tablet glow={0.7} /></Place>
          <Place x={760} y={850} s={pop(f, F("s3l12:بيقلل") - 4, 12) * 1.2} r={8}><QuestionIcon /></Place>
          {sparkle(f, F("s3l13") - 2, 330, 880, 1.4)}
        </g>
      )}
      {cox > 0 && (
        <g opacity={cox}>
          <Place x={540} y={1050} s={1.15}><Cox blocked={prog(f, blockAt, 12)} chew={chew} /></Place>
          {drops.map((d) => d.on && prog(f, blockAt, 12) < 0.5 && <Place key={d.k} x={300 + d.k * 120} y={1230 + 150 * d.p} s={0.55} o={1 - d.p * 0.6}><Drop /></Place>)}
          <Place x={540 - 30 * prog(f, blockAt - 20, 18)} y={1360 - 0} s={0.8 * pop(f, blockAt - 14, 12)} o={1}><Tablet /></Place>
          <Label x={540} y={1560 - 0} text="COX" size={64} color={C.key} dir="ltr" o={pop(f, F("s3l16:كوكس") - 2, 12)} />
          <Label x={540} y={1470} text="Cyclooxygenase" size={34} color={C.source} dir="ltr" o={prog(f, F("s3l17:سايكلو"), 10)} />
        </g>
      )}
      {simple > 0 && (
        <g opacity={simple}>
          <Place x={330} y={1020} s={0.75}><Cox blocked={1} /></Place>
          <Place x={330} y={1290} s={0.6 * pop(f, F("s3l19:الإيبوبروفين") - 4, 12)}><Chip text="الإيبوبروفين" w={300} size={40} /></Place>
          <Place x={330} y={1390} s={0.6 * pop(f, F("s3l19:والديكلوفيناك") - 4, 12)}><Chip text="الديكلوفيناك" w={300} size={40} /></Place>
          <Place x={760} y={1020} s={1.0 * pop(f, F("s3l18:لكن") + 2, 12)}><Tablet glow={0.5} /></Place>
          <Place x={760} y={1020} s={2.2 * pop(f, F("s3l18:البسيطة") - 2, 14)} o={0.8}><QuestionIcon /></Place>
          <Label x={760} y={1260} text="مش بنفس البساطة" size={44} color={C.key} o={prog(f, F("s3l18:بنفس"), 10)} />
        </g>
      )}
      {cns > 0 && (
        <g opacity={cns}>
          <Place x={500} y={870} s={0.95 * pop(f, F("s3l20:الجهاز") - 4, 14)}><BrainSpine lit={prog(f, F("s3l20:أعقد"), 14)} sig={prog(f, F("s3l20:خصوصا"), 30)} /></Place>
          <Place x={800} y={1000} s={0.9 * pop(f, F("s3l20:البرستمول") - 4, 12)}><Tablet /></Place>
          <Label x={540} y={1500} text="الجهاز العصبي المركزي" size={46} o={prog(f, F("s3l20:الجهاز"), 10)} />
          <Place x={800} y={1170} s={1.0 * pop(f, F("s3l20:أعقد") - 2, 12)}><QuestionIcon /></Place>
        </g>
      )}
      {paths > 0 && (
        <g opacity={paths}>
          <Place x={300} y={1100} s={1.1}><Tablet glow={0.4} /></Place>
          <Place x={780} y={1000} s={0.9}><Brain /></Place>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M380 ${1060 + i * 40} C520 ${900 + i * 160} 600 ${1100 - i * 50} 700 ${1010 + i * 30}`} fill="none" {...sk} strokeWidth={8} strokeDasharray="4 16" opacity={prog(f, F("s3l21:مسارات") + i * 8, 14)} />
          ))}
          <Place x={560} y={1330} s={0.9 * pop(f, F("s3l22:لسه") - 4, 12)}><g><circle r={56} fill="#E4EEF3" opacity={0.85} {...sk} /><path d="M40 40 L84 84" {...sk} strokeWidth={14} /></g></Place>
          <Label x={540} y={1500} text="العلماء لسه بيبحثوا" size={46} color={C.key} o={prog(f, F("s3l22:لسه"), 10)} />
        </g>
      )}
    </Svg>
  );
};
const s3: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s3l3:مواد") - 0.15, sfx: "bubbles", vol: 0.13 },
    { at: t.s("s3l5:البروستاجلاندين") - 0.2, sfx: "pop", vol: 0.14 },
    { at: t.s("s3l12:بيقلل") - 0.2, sfx: "pop", vol: 0.12 },
    { at: t.s("s3l15:تصنيع") - 0.1, sfx: "metal", vol: 0.14 },
    { at: t.s("s3l18:البسيطة") - 0.15, sfx: "bump", vol: 0.12 },
    { at: t.s("s3l22:لسه") - 0.2, sfx: "shimmer", vol: 0.12 },
  ],
  pulses: (t) => [t.f("s3l15@end")],
};

// ============================================================ 4. AM404
const S4: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const W = (a: string, b: string) => inOut(f, F(a) - 4, F(b + "@end") + 6, 12, 8);
  const sur = W("s4l1", "s4l1"), made = W("s4l2", "s4l3"), brain = W("s4l4", "s4l4"), secret = W("s4l5", "s4l6"), study = W("s4l7", "s4l8");
  const conv = prog(f, F("s4l2:بيتكون"), 24);
  return (
    <Svg>
      {sur > 0 && <g opacity={sur}><Place x={540} y={1100} s={2.2 * pop(f, F("s4l1") - 2, 14)}><Sparkle size={1.6} fill="#F7C548" /></Place><Place x={540} y={1100} s={1.0}><Tablet glow={1} /></Place></g>}
      {made > 0 && (
        <g opacity={made}>
          <Place x={260} y={1050} s={0.95 * (1 - 0.35 * conv)} o={1 - 0.5 * conv}><Tablet /></Place>
          <path d="M360 1050 H600" {...sk} strokeWidth={10} strokeDasharray="3 20" />
          <path d="M580 1020 L620 1050 L580 1080" fill="none" {...sk} strokeWidth={10} />
          <Place x={780} y={1050} s={1.0 * pop(f, F("s4l2:داخل") - 2, 14)}><g transform="translate(-95 0)"><path d="M-130 50 H130 M-90 -20 A90 90 0 0 1 90 -20" fill="none" /><circle r={90} fill="#CDE3C2" {...sk} /><circle r={22} fill="#7DBB6E" {...sk} cx={-30} cy={-20} /><circle r={16} fill="#7DBB6E" {...sk} cx={36} cy={22} /></g></Place>
          <Label x={560} y={1330} text="داخل الجسم" size={44} o={prog(f, F("s4l2:داخل"), 10)} />
          <Place x={540} y={1450} s={pop(f, F("s4l3:اسمه") - 2, 14)}><Chip text="AM404" w={380} size={70} fill="#FFF3CF" color={C.key} dir="ltr" /></Place>
        </g>
      )}
      {brain > 0 && (
        <g opacity={brain}>
          <Place x={500} y={860} s={0.95}><BrainSpine lit={prog(f, F("s4l4:التأثير"), 20)} sig={prog(f, F("s4l4:بيعتقدوا"), 40)} /></Place>
          <Place x={820} y={1000} s={0.55 * pop(f, F("s4l4:بيعتقدوا") - 2, 12)}><Chip text="AM404" w={260} size={40} fill="#FFF3CF" color={C.key} dir="ltr" /></Place>
          <Label x={300} y={1010} text="المخ" size={44} o={prog(f, F("s4l4:المخ"), 10)} />
          <Label x={290} y={1240} text="الحبل الشوكي" size={44} o={prog(f, F("s4l4:والحبل"), 10)} />
          <Place x={780} y={1250} s={0.7 * pop(f, F("s4l4:بيعتقدوا") - 2, 12)}><Doc mood={0.4} glasses /></Place>
          <Label x={780} y={1090} text="بيعتقدوا" size={40} color={C.key} o={prog(f, F("s4l4:بيعتقدوا"), 10)} />
        </g>
      )}
      {secret > 0 && (
        <g opacity={secret}>
          <Place x={330} y={1050} s={0.9 * pop(f, F("s4l5:مادة") - 4, 12)}><Cox blocked={1} /></Place>
          <Place x={330} y={1050} s={1.6 * pop(f, F("s4l5:واحدة") - 2, 12)} o={0.0}><XMark p={1} /></Place>
          <Label x={330} y={1280} text="مش مادة واحدة بس" size={38} o={prog(f, F("s4l5:واحدة"), 10)} />
          <Place x={760} y={1060} s={0.95 * pop(f, F("s4l6:آلية") - 4, 14)}><MysteryCard open={prog(f, F("s4l6:أسرار") - 2, 14)} text="؟" sub="" /></Place>
          <Label x={760} y={1330} text="لسه فيها أسرار" size={42} color={C.key} o={prog(f, F("s4l6:أسرار"), 10)} />
        </g>
      )}
      {study > 0 && (
        <g opacity={study}>
          <Place x={300} y={1080} s={1.3}><Papers mag={prog(f, F("s4l7:بحث"), 14)} /></Place>
          <Place x={780} y={1090} s={1.1}><Globe /></Place>
          <Place x={780} y={1090} s={0.5 * pop(f, F("s4l8:انتشارا") - 2, 12)} o={0.95}><Tablet /></Place>
          <Label x={300} y={1340} text="بحث علمي لحد النهارده" size={38} o={prog(f, F("s4l7:بحث"), 10)} />
        </g>
      )}
    </Svg>
  );
};
const s4: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s4l1") - 0.15, sfx: "swell", vol: 0.14 },
    { at: t.s("s4l2:بيتكون") - 0.1, sfx: "shimmer", vol: 0.13 },
    { at: t.s("s4l3:اسمه") - 0.1, sfx: "pop", vol: 0.14 },
    { at: t.s("s4l6:أسرار") - 0.2, sfx: "ding", vol: 0.12 },
  ],
  pulses: (t) => [t.f("s4l3@end")],
};

// ============================================================ 5. The story (1878 -> 1886 -> 1948)
const S5: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const W = (a: string, b: string) => inOut(f, F(a) - 4, F(b + "@end") + 6, 12, 8);
  const tl = prog(f, F("s5l1") - 4, 20) * (1 - prog(f, F("s5l25@end") - 6, 10, easeIn));
  const m = [pop(f, F("s5l2:ألف"), 14), pop(f, F("s5l6:ألف"), 14), pop(f, F("s5l20:ألف"), 14)];
  const lab = W("s5l2", "s5l4"), nap = W("s5l5", "s5l5"), mist = W("s5l6", "s5l7"), nft = W("s5l8", "s5l8"), swap = W("s5l9", "s5l10");
  const fev = W("s5l11", "s5l12"), pub = W("s5l13", "s5l14"), stop = W("s5l15", "s5l15"), not = W("s5l16", "s5l17"), path = W("s5l18", "s5l18");
  const body = W("s5l19", "s5l19"), y48 = W("s5l20", "s5l23"), spread = W("s5l24", "s5l25");
  const slide = prog(f, F("s5l9:اسمها") - 6, 16);
  const temp = 0.9 - 0.6 * prog(f, F("s5l11:خفضت"), 24);
  return (
    <Svg>
      {tl > 0.01 && <Place x={540} y={760} s={0.62} o={tl}><Timeline04 p={tl} marks={m} /></Place>}
      {W("s5l1", "s5l1") > 0 && <g opacity={W("s5l1", "s5l1")}><Place x={540} y={1130} s={1.6 * pop(f, F("s5l1") - 2, 14)}><Journal04 /></Place></g>}
      {lab > 0 && (
        <g opacity={lab}>
          <Place x={780} y={1150} s={1.3 * pop(f, F("s5l3:الكيميائي") - 4, 14)}><Chemist /></Place>
          <Place x={300} y={1100} s={1.1 * pop(f, F("s5l2:اتصنع") - 4, 14)}><Calendar year="1878" /></Place>
          <Place x={540} y={1440} s={pop(f, F("s5l4:هارمون") - 2, 14)}><Chip text="Harmon Northrop Morse" w={640} size={42} dir="ltr" /></Place>
        </g>
      )}
      {nap > 0 && (
        <g opacity={nap}>
          <Place x={540} y={1130} s={1.5}><LabBottle label="" /></Place>
          <Place x={760} y={900} s={1.2} o={0.9}><Moon /></Place>
          <Label x={700} y={1050} text="Z z z" size={64} color={C.source} dir="ltr" o={0.8} />
          <Label x={540} y={1450} text="ما اتحولش لدوا مشهور" size={46} o={prog(f, F("s5l5:ما"), 10)} />
        </g>
      )}
      {mist > 0 && (
        <g opacity={mist}>
          <Place x={400} y={930} s={0.85 * pop(f, F("s5l6:وفي") - 4, 14)}><Calendar year="1886" /></Place>
          <Place x={760} y={930} s={0.9 * pop(f, F("s5l6:غلطة") - 4, 14)}><Warn /></Place>
          <Place x={300} y={1210} s={0.6 * pop(f, F("s5l7:أرنولد") - 4, 14)}><Doc mood={0.6} glasses /></Place>
          <Place x={780} y={1210} s={0.6 * pop(f, F("s5l7:وبول") - 4, 14)}><Doc mood={0.6} hair="#6E5A48" /></Place>
          <Place x={300} y={1480} s={pop(f, F("s5l7:أرنولد") - 2, 12)}><Chip text="Arnold Cahn" w={330} size={36} dir="ltr" /></Place>
          <Place x={780} y={1480} s={pop(f, F("s5l7:وبول") - 2, 12)}><Chip text="Paul Hepp" w={300} size={36} dir="ltr" /></Place>
        </g>
      )}
      {nft > 0 && (
        <g opacity={nft}>
          <Place x={330} y={1130} s={1.3}><LabBottle tint="#E4EEF3" label="Naphthalene" w={1} /></Place>
          <Place x={780} y={1180} s={1.4 * pop(f, F("s5l8:الديدان") - 4, 14)}><Worm wig={f / 5} /></Place>
        </g>
      )}
      {swap > 0 && (
        <g opacity={swap}>
          <Place x={250} y={1100} s={1.0}><Pharmacist /></Place>
          <Place x={540 + 0 * slide} y={1080} s={1.15 * (1 - slide) * (1) + 0.001} o={1 - slide}><LabBottle label="Naphthalene" /></Place>
          <Place x={620} y={1080} s={1.15 * pop(f, F("s5l9:اسمها") - 4, 14)} o={slide}><LabBottle tint="#F2D79A" label="Acetanilide" /></Place>
          <Place x={800} y={1380} s={0.9 * prog(f, F("s5l10:ما"), 10)}><XMark p={prog(f, F("s5l10:ما"), 12)} /></Place>
          <Place x={500} y={1380} s={0.7 * prog(f, F("s5l10:ما"), 10)}><Worm wig={f / 5} /></Place>
        </g>
      )}
      {fev > 0 && (
        <g opacity={fev}>
          <Place x={330} y={1130} s={1.4}><Thermo level={temp} /></Place>
          <Place x={760} y={1150} s={1.3}><SickPerson shiver={bob(f, 2, 20)} blink /></Place>
          {sparkle(f, F("s5l12:اكتشفوا"), 560, 880, 1.6)}
          <Label x={540} y={1470} text="خفضت حرارة المريض" size={46} o={prog(f, F("s5l11:خفضت"), 10)} />
        </g>
      )}
      {pub > 0 && (
        <g opacity={pub}>
          <Place x={330} y={1100} s={1.0 * pop(f, F("s5l13:انتشرت") - 4, 14)}><Calendar year="1886" /></Place>
          <Place x={780} y={1100} s={0.7 * pop(f, F("s5l13:انتشرت") - 2, 14)}><Journal04 /></Place>
          <Place x={540} y={1430} s={pop(f, F("s5l14:صدفة") - 2, 14)}><Chip text="صدفة سعيدة" w={420} size={54} fill="#FFF3CF" color={C.key} /></Place>
          {sparkle(f, F("s5l14:صدفة"), 700, 870, 1.4)}
        </g>
      )}
      {stop > 0 && <g opacity={stop}><Place x={540} y={1100} s={2.4 * pop(f, F("s5l15") - 2, 12)}><StopHand /></Place></g>}
      {not > 0 && (
        <g opacity={not}>
          <Place x={330} y={1120} s={1.5}><LabBottle tint="#F2D79A" label="Acetanilide" /></Place>
          <Place x={780} y={1100} s={1.5}><Tablet glow={0.4} /></Place>
          <Place x={780} y={1100} s={2.0 * pop(f, F("s5l16:مش") - 2, 12)} o={0.95}><XMark p={pop(f, F("s5l16:مش"), 12)} /></Place>
          <Label x={540} y={1450} text="اكتشاف مادة تانية" size={46} color={C.key} o={prog(f, F("s5l17:مادة"), 10)} />
        </g>
      )}
      {path > 0 && (
        <g opacity={path}>
          <Place x={250} y={1110} s={1.0}><LabBottle tint="#F2D79A" label="" /></Place>
          <path d="M360 1100 C480 960 620 960 720 1090" fill="none" {...sk} strokeWidth={10} strokeDasharray="4 18" opacity={prog(f, F("s5l18:قادت"), 20)} />
          <Place x={820} y={1110} s={1.1 * pop(f, F("s5l18:مهم") - 2, 14)}><Tablet glow={0.7} /></Place>
        </g>
      )}
      {body > 0 && (
        <g opacity={body}>
          <Place x={540} y={1130} s={1.7}><Person fill="#B9C7D3" /></Place>
          <Place x={250} y={1090} s={0.75 * (1 - prog(f, F("s5l19:بيتكون") - 4, 20)) + 0.01}><LabBottle tint="#F2D79A" label="" /></Place>
          <Place x={540} y={1180} s={0.8 * pop(f, F("s5l19:بيتكون") + 8, 14)}><Tablet glow={1} /></Place>
          <Label x={540} y={1450} text="بيتكون جوه الجسم" size={46} o={prog(f, F("s5l19:بيتكون"), 10)} />
        </g>
      )}
      {y48 > 0 && (
        <g opacity={y48}>
          <Place x={250} y={1010} s={0.9 * pop(f, F("s5l20:ألف") - 4, 14)}><Calendar year="1948" /></Place>
          <Place x={250} y={1300} s={0.9}><LabBottle tint="#F2D79A" label="Acetanilide" w={0.8} /></Place>
          <path d="M360 1290 H560" {...sk} strokeWidth={10} strokeDasharray="3 20" />
          <Place x={760} y={1170} s={1.2}><Tablet glow={0.6} /></Place>
          <g transform="translate(780 1370)" opacity={prog(f, F("s5l21:جزء"), 12)}>
            <circle r={78} fill={C.paper} {...sk} />
            <path d={`M0 0 L0 -78 A78 78 0 1 1 -55 55 Z`} fill="#F0A23B" stroke={C.ink} strokeWidth={5} />
          </g>
          <Label x={560} y={1480} text="جزء كبير من التأثير" size={46} color={C.key} o={prog(f, F("s5l21:جزء"), 10)} />
        </g>
      )}
      {spread > 0 && (
        <g opacity={spread}>
          <Place x={300} y={1090} s={0.9}><Pharmacy ok={1} /></Place>
          <Place x={780} y={1070} s={0.8}><Hospital /></Place>
          {[[330, 1360], [540, 1330], [750, 1360]].map(([x, y], i) => (<Place key={i} x={x} y={y} s={0.55 * pop(f, F("s5l24:استخدامه") + i * 6, 12)}><Tablet /></Place>))}
          <Place x={540} y={1500} s={0.7 * pop(f, F("s5l25:أشهر") - 2, 12)}><Globe /></Place>
        </g>
      )}
    </Svg>
  );
};
const Journal04: React.FC = () => (
  <g>
    <rect x={-110} y={-130} width={220} height={260} rx={16} fill={C.paper} {...sk} />
    <path d="M-70 -80 h140 M-70 -40 h140 M-70 0 h140 M-70 40 h90" {...sk} strokeWidth={6} />
    <rect x={-110} y={-130} width={40} height={260} rx={14} fill="#C9B59D" {...sk} />
  </g>
);
const s5: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s5l2:اتصنع") - 0.15, sfx: "paper", vol: 0.14 },
    { at: t.s("s5l6:غلطة") - 0.2, sfx: "bump", vol: 0.14 },
    { at: t.s("s5l9:اسمها") - 0.2, sfx: "glass", vol: 0.13 },
    { at: t.s("s5l12:اكتشفوا") - 0.2, sfx: "ding", vol: 0.13 },
    { at: t.s("s5l15") - 0.1, sfx: "bump", vol: 0.14 },
    { at: t.s("s5l20:ألف") - 0.2, sfx: "paper", vol: 0.14 },
    { at: t.s("s5l25:أشهر") - 0.2, sfx: "shimmer", vol: 0.12 },
  ],
  pulses: (t) => [t.f("s5l14@end")],
};

// ============================================================ 6. The press conference + what the evidence says
const S6: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const W = (a: string, b: string) => inOut(f, F(a) - 4, F(b + "@end") + 6, 12, 8);
  const rec = t.has("s6l1") ? W("s6l1", "s6l1") : 0;
  const conf = W("s6l2", "s6l4"), pre = W("s6l5", "s6l7"), cor = W("s6l8", "s6l11"), org = W("s6l12", "s6l13"), str = W("s6l14", "s6l14");
  const stance = W("s6l15", "s6l17"), bal = W("s6l18", "s6l19");
  const card = (a: string, b: string, inD = 4) => prog(f, F(a) - inD, 12) * (1 - prog(f, F(b) + 4, 10, easeIn));
  const date = card("s6l2:اتنين", "s6l3@end");
  const nm = !t.has("s1l12") && !t.has("s2l8") ? prog(f, F("s6l5:البرستمول") - 2, 10) * (1 - prog(f, F("s6l5@end") + 3, 10, easeIn)) : 0;
  const st46 = card("s6l6", "s6l9@end", 2);
  const acog = card("s6l13", "s6l13@end", 6);
  const swe = card("s6l14", "s6l14:اللي", 2);
  const den = card("s6l14:اللي", "s6l15:الأساسية", 2);
  return (
    <Svg>
      {rec > 0 && <g opacity={rec}><Place x={540} y={1100} s={0.9}><Podium /></Place><Place x={540} y={1470} s={pop(f, F("s6l1:موضوع") - 2, 12) * 1.1}><QuestionIcon /></Place></g>}
      {conf > 0 && (
        <g opacity={conf}>
          <Place x={760} y={900} s={0.55}><Podium /></Place>
          <Place x={250} y={900} s={0.55 * pop(f, F("s6l2:اتنين") - 2, 12)}><Calendar year="2025" /></Place>
          <Place x={760} y={1130} s={0.6 * pop(f, F("s6l4:التايلينول") - 4, 12)}><Chip text="Tylenol" w={300} size={52} dir="ltr" fill="#FFF3CF" /></Place>
          <Info cy={1330} p={date} rows={[{ text: "22 سبتمبر 2025", size: 56, color: C.key }, { text: "مؤتمر بالبيت الأبيض", size: 48 }]} />
        </g>
      )}
      {pre > 0 && (
        <g opacity={pre}>
          <Place x={250} y={900} s={0.6 * pop(f, F("s6l5:الحمل") - 4, 12)}><Pregnant /></Place>
          <Place x={500} y={900} s={0.6 * pop(f, F("s6l5:البرستمول") - 4, 12)}><Tablet /></Place>
          <Place x={760} y={900} s={0.6 * pop(f, F("s6l7:التوحد") - 4, 12)}><Baby /></Place>
          <Place x={380} y={900} s={0.7 * pop(f, F("s6l6:وحذر") - 2, 12)}><Warn /></Place>
          <path d="M580 900 H690" {...sk} strokeWidth={8} strokeDasharray="3 16" opacity={prog(f, F("s6l7:وربطه"), 10)} />
          <Info cy={1300} p={nm} rows={[{ text: "باراسيتامول", size: 54, color: C.key }, { text: "أسيتامينوفين  =  APAP", size: 44 }]} />
          <Info cy={1320} p={st46} rows={[{ text: "الإدارة استندت لمراجعة", size: 40 }, { text: "46 دراسة لقت ارتباط محتمل", size: 46, color: C.key }, { text: "والباحثين قالوا إنها مش إثبات سببية", size: 38 }]} sub="Environ Health 2025" />
        </g>
      )}
      {cor > 0 && (
        <g opacity={cor}>
          {f < F("s6l9") - 6 && <Place x={540} y={1000} s={1.9 * pop(f, F("s6l8") - 2, 12)}><StopHand /></Place>}
          {f >= F("s6l9") - 6 && <Place x={540} y={940} s={0.95}><CorrCause corr={prog(f, F("s6l9:الارتباط"), 10)} cause={prog(f, F("s6l9:السببية"), 12)} /></Place>}
          <Info cy={1320} p={st46 * (1 - prog(f, F("s6l9@end"), 6))} rows={[{ text: "الإدارة استندت لمراجعة", size: 40 }, { text: "46 دراسة لقت ارتباط محتمل", size: 46, color: C.key }, { text: "والباحثين قالوا إنها مش إثبات سببية", size: 38 }]} sub="Environ Health 2025" />
          {f >= F("s6l10") - 6 && <Place x={300} y={1330} s={0.8 * pop(f, F("s6l10:دراسة") - 4, 12)}><Papers /></Place>}
          {f >= F("s6l10") - 6 && <Place x={770} y={1340} s={0.9 * pop(f, F("s6l11:سبب") - 4, 12)}><Cox blocked={0} /></Place>}
        </g>
      )}
      {org > 0 && (
        <g opacity={org}>
          <Place x={780} y={870} s={0.62 * pop(f, F("s6l12:المنظمات") - 4, 12)}><Doc mood={0.5} glasses /></Place>
          <Place x={270} y={880} s={0.55 * pop(f, F("s6l13:أكدت") - 4, 12)}><Pregnant /></Place>
          <Info cy={1310} p={acog} rows={[{ text: "ACOG", size: 60, color: C.key, dir: "ltr" }, { text: "من الخيارات القليلة لعلاج", size: 44 }, { text: "الألم والحرارة في الحمل", size: 44 }]} sub="ACOG, 22 Sept 2025" />
        </g>
      )}
      {str > 0 && (
        <g opacity={str}>
          <Place x={270} y={900} s={0.65}><Siblings /></Place>
          <Place x={760} y={900} s={0.65} o={den}><KidCrowd n={24} /></Place>
          <Info cy={1310} p={swe} rows={[{ text: "2024", size: 54, color: C.key, dir: "ltr" }, { text: "السويد: دراسة على الإخوات", size: 46 }, { text: "مفيش علاقة سببية", size: 46, color: "#3F8F4A" }]} sub="JAMA 2024" />
          <Info cy={1310} p={den} rows={[{ text: "2026", size: 54, color: C.key, dir: "ltr" }, { text: "الدنمارك: أكتر من 1.5 مليون طفل", size: 42 }, { text: "مفيش علاقة", size: 46, color: "#3F8F4A" }]} sub="JAMA Pediatrics 2026" />
        </g>
      )}
      {stance > 0 && (
        <g opacity={stance}>
          <Place x={300} y={960} s={0.8}><Pregnant /></Place>
          <Place x={640} y={960} s={0.9 * pop(f, F("s6l15:الأساسية") - 4, 12)}><Tablet glow={0.5} /></Place>
          <Place x={800} y={860} s={0.7 * pop(f, F("s6l15:أأمنهم") - 2, 12)}><CheckIcon /></Place>
          {[["عند الحاجة", "s6l16:الحاجة", 1250], ["الجرعة المناسبة", "s6l16:وبالجرعة", 1350], ["لأقصر مدة", "s6l16:ولأقصر", 1450]].map(([txt, a, y], i) => (
            <Place key={i} x={540} y={y as number} s={pop(f, F(a as string) - 2, 12)}><Chip text={txt as string} w={440} size={44} fill="#FFF3CF" /></Place>
          ))}
          <Place x={800} y={1110} s={0.5 * pop(f, F("s6l17:استشارة") - 2, 12)}><Doc mood={0.7} glasses /></Place>
        </g>
      )}
      {bal > 0 && (
        <g opacity={bal}>
          <Place x={540} y={1250} s={1.1}><Balance tilt={0.05 * bob(f, 3, 60)} left={<Tablet />} right={<Thermo level={0.8} />} /></Place>
          <Place x={540} y={850} s={1.5 * pop(f, F("s6l19:الاختيار") - 2, 12)}><QuestionIcon /></Place>
          <Label x={540} y={1520} text="ترك الألم من غير علاج" size={44} color={C.key} o={prog(f, F("s6l18:ترك"), 10)} />
        </g>
      )}
    </Svg>
  );
};
const s6: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s6l2:اتنين") - 0.15, sfx: "paper", vol: 0.14 },
    { at: t.s("s6l4:التايلينول") - 0.2, sfx: "pop", vol: 0.13 },
    { at: t.s("s6l8") - 0.1, sfx: "bump", vol: 0.15 },
    { at: t.s("s6l9:الارتباط") - 0.15, sfx: "click", vol: 0.12 },
    { at: t.s("s6l13:ومنها") - 0.2, sfx: "paper", vol: 0.13 },
    { at: t.s("s6l14") - 0.2, sfx: "paper", vol: 0.13 },
    { at: t.s("s6l15:الأساسية") - 0.2, sfx: "ding", vol: 0.12 },
  ],
  pulses: (t) => [t.f("s6l9@end")],
  silence: (t) => [[t.s("s6l8") - 0.9, t.s("s6l8@end") + 0.2]],
};

// ============================================================ 7. The liver (NAPQI, glutathione, the emergency)
const S7: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const W = (a: string, b: string) => inOut(f, F(a) - 4, F(b + "@end") + 6, 12, 8);
  const safe = W("s7l1", "s7l1"), dose = W("s7l2", "s7l3"), proc = W("s7l4", "s7l6"), prot = W("s7l7", "s7l9"), over = W("s7l10", "s7l11");
  const atk = W("s7l12", "s7l15"), look = W("s7l16", "s7l16"), silent = W("s7l17", "s7l20"), go = W("s7l21", "s7l25"), nac = W("s7l26", "s7l26");
  const hrs = W("s7l27", "s7l28"), late = W("s7l29", "s7l29"), anti = W("s7l30", "s7l31");
  const into = prog(f, F("s7l4:يدخل"), 22);
  const nq = pop(f, F("s7l6:نابكي") - 4, 14);
  const catchP = prog(f, F("s7l9:وتحوله") - 6, 20);
  const stock = 1 - 0.85 * prog(f, F("s7l11:مخزون"), 40);
  const hit = prog(f, F("s7l12:يهاجم"), 36);
  return (
    <Svg>
      {safe > 0 && (
        <g opacity={safe}>
          <Place x={540} y={1080} s={2.8 * pop(f, F("s7l1:أمان") - 4, 14)}><CheckIcon /></Place>
          <Place x={540} y={1380} s={0.9 * pop(f, F("s7l1:دوا") - 4, 14)}><Tablet glow={0.6} /></Place>
        </g>
      )}
      {dose > 0 && (
        <g opacity={dose}>
          <Place x={540} y={1070} s={1.0 * pop(f, F("s7l2:الكبد") - 6, 14)}><Liver glow={prog(f, F("s7l2:الكبد"), 12)} /></Place>
          {[[250, 1380], [370, 1430], [490, 1380], [610, 1430], [730, 1380]].map(([x, y], i) => (<Place key={i} x={x} y={y} s={0.55 * pop(f, F("s7l2:الجرعات") + i * 4, 12)}><Tablet /></Place>))}
          <Place x={850} y={850} s={1.2 * pop(f, F("s7l2:خطيرة") - 2, 12)}><Warn /></Place>
          {sparkle(f, F("s7l3") - 2, 300, 860, 1.3)}
        </g>
      )}
      {proc > 0 && (
        <g opacity={proc}>
          <Place x={640} y={1080} s={1.0}><Liver glow={0.7} /></Place>
          <Place x={170 + 260 * into} y={1080} s={0.8 * (1 - 0.6 * into)} o={1 - 0.7 * into}><Tablet /></Place>
          {f >= F("s7l5") - 4 && [0, 1, 2, 3, 4, 5, 6].map((i) => {
            const p = prog(f, F("s7l5:بيتحول") + i * 6, 40);
            return (<Place key={i} x={560 + p * 360} y={1010 + (i % 4) * 56 - p * 40} s={0.3} o={Math.min(1, p * 3) * (1 - prog(f, F("s7l6") - 6, 8))}><g><circle r={36} fill="#9CC48A" {...sk} /><path d="M-14 0 L-4 11 L16 -10" fill="none" {...sk} strokeWidth={8} /></g></Place>);
          })}
          <Label x={720} y={1300} text="مركبات آمنة" size={46} color="#3F8F4A" o={prog(f, F("s7l5:لمركبات"), 10) * (1 - prog(f, F("s7l6") - 4, 8))} />
          {f >= F("s7l6") - 4 && <Place x={620} y={1230 - 40 * nq} s={1.0 * nq}><Napqi wob={f / 6} /></Place>}
          {f >= F("s7l6") - 4 && <Place x={560} y={1450} s={pop(f, F("s7l6:نابكي") - 2, 14)}><Chip text="NAPQI" w={320} size={60} dir="ltr" fill="#FDD" color={C.warn} /></Place>}
        </g>
      )}
      {prot > 0 && (
        <g opacity={prot}>
          <Place x={540} y={1060} s={1.0}><Liver shield={pop(f, F("s7l7") - 2, 14)} /></Place>
          {f >= F("s7l8") - 6 && [0, 1, 2].map((i) => (<Place key={i} x={250 + i * 270 + 30 * Math.sin(f / 9 + i)} y={1370 - 40 * pop(f, F("s7l8:الجلوتاثايون") + i * 6, 14)} s={0.9 * pop(f, F("s7l8:الجلوتاثايون") + i * 6, 14)}><Rescuer run={f / 5 + i} /></Place>))}
          {f >= F("s7l8") - 6 && <Label x={540} y={1530} text="Glutathione" size={46} color="#3F6FA8" dir="ltr" o={prog(f, F("s7l8:الجلوتاثايون"), 10)} />}
          {f >= F("s7l9") - 6 && <Place x={760 - 160 * catchP} y={1130} s={0.8 * (1 - 0.0)}><Napqi calm={catchP} wob={f / 6} /></Place>}
        </g>
      )}
      {over > 0 && (
        <g opacity={over}>
          {[0, 1, 2, 3, 4, 5].map((i) => (<Place key={i} x={150 + (i % 3) * 200 + 40 * Math.sin(f / 8 + i)} y={900 + Math.floor(i / 3) * 150} s={0.6 * pop(f, F("s7l10:الجرعة") + i * 4, 12)}><Napqi wob={f / 5 + i} /></Place>))}
          {[0, 1, 2].map((i) => (<Place key={i} x={760} y={900 + i * 170} s={0.55} o={stock * 0.9 + 0.1}><Rescuer run={f / 5 + i} /></Place>))}
          <g transform="translate(470 1450)">
            <rect x={-230} y={-26} width={460} height={52} rx={26} fill={C.paper} {...sk} />
            <rect x={-224} y={-20} width={Math.max(8, 448 * stock)} height={40} rx={20} fill="#6FA8D6" />
          </g>
          <Label x={470} y={1540} text="مخزون الجلوتاثايون" size={38} color="#3F6FA8" o={prog(f, F("s7l11:مخزون"), 10)} />
        </g>
      )}
      {atk > 0 && (
        <g opacity={atk}>
          <g opacity={f >= F("s7l14") ? 1 - pop(f, F("s7l14:تلف") - 4, 14) : 1}><Place x={540} y={1050} s={1.15}><Cells hit={hit} /></Place></g>
          {[0, 1, 2, 3].map((i) => (<Place key={i} x={140 + i * 250} y={820 + 40 * Math.sin(f / 7 + i)} s={0.55 * pop(f, F("s7l12:يبدأ") + i * 4, 12)}><Napqi wob={f / 5 + i} /></Place>))}
          {f >= F("s7l14") - 4 && <Place x={540} y={1050} s={0.95 * pop(f, F("s7l14:تلف") - 4, 14)}><Liver hurt={prog(f, F("s7l14:تلف"), 20)} /></Place>}
          {f >= F("s7l14") - 4 && <Place x={830} y={820} s={1.2 * pop(f, F("s7l14:تلف") - 2, 12)}><Warn /></Place>}
          {f >= F("s7l15") - 4 && <Place x={540} y={1400} s={pop(f, F("s7l15:فشل") - 2, 14)}><Chip text="فشل كبدي حاد" w={460} size={52} fill="#FDD" color={C.warn} /></Place>}
        </g>
      )}
      {look > 0 && <g opacity={look}><Place x={540} y={1100} s={2.0 * pop(f, F("s7l16") - 2, 12)}><Sparkle size={1.4} fill="#F7C548" /></Place><Place x={540} y={1100} s={1.0}><Liver /></Place></g>}
      {silent > 0 && (
        <g opacity={silent}>
          <Place x={330} y={1150} s={1.5}><SickPerson shiver={0} blink /></Place>
          <Place x={330} y={1300} s={0.5} o={0.85 * pop(f, F("s7l18:حاسس") - 2, 12)}><Liver hurt={0.9} /></Place>
          <Place x={760} y={1000} s={0.9 * pop(f, F("s7l17:جرعة") - 2, 12)}><Tablet /></Place>
          <Place x={850} y={1140} s={0.7 * pop(f, F("s7l17:زيادة") - 2, 12)}><Tablet /></Place>
          {f >= F("s7l19") - 4 && <Place x={760} y={1300} s={0.7}><Flash s={1.0} /></Place>}
          {f >= F("s7l19") - 4 && <Place x={760} y={1300} s={1.8 * pop(f, F("s7l19:ألم") - 2, 12)}><XMark p={pop(f, F("s7l19:ألم"), 12)} /></Place>}
          {f >= F("s7l20") - 4 && <g transform="translate(540 1480)"><path d="M-300 0 H300" stroke={C.ink} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(f, F("s7l20:الساعات"), 30)} /><Label x={-250} y={-24} text="ساعات" size={38} /><Label x={250} y={-24} text="أيام" size={38} /></g>}
        </g>
      )}
      {go > 0 && (
        <g opacity={go}>
          <Place x={300} y={950} s={0.9 * pop(f, F("s7l22:الموصى") - 4, 12)}><PackBox kind="plain" band="#F2D79A" /></Place>
          <Place x={300} y={1180} s={pop(f, F("s7l22:الموصى") - 2, 12)}><Chip text="الجرعة القصوى المكتوبة على العلبة" w={560} size={34} fill="#FFF3CF" /></Place>
          {f >= F("s7l23") - 4 && <Place x={760} y={950} s={0.65 * pop(f, F("s7l23:تستناش") - 2, 12)}><Clock a={(f - F("s7l23")) * 10} /></Place>}
          {f >= F("s7l23") - 4 && <Place x={760} y={950} s={1.6 * pop(f, F("s7l23:تستناش") + 4, 12)} o={0.95}><XMark p={pop(f, F("s7l23:تستناش"), 12)} /></Place>}
          {f >= F("s7l24") - 4 && <Place x={230} y={1420} s={0.55 * pop(f, F("s7l24:الطوارئ") - 2, 14)}><Hospital /></Place>}
          {f >= F("s7l24") - 4 && <Place x={540} y={1420} s={0.8 * pop(f, F("s7l24:الصيدلي") - 2, 12)}><Pharmacist /></Place>}
          {f >= F("s7l24") - 4 && <Place x={830} y={1310} s={0.55 * pop(f, F("s7l24:الطبيب") - 2, 12)}><Doc mood={0.7} glasses /></Place>}
          {f >= F("s7l25") - 4 && <Place x={760} y={1130} s={0.8 * pop(f, F("s7l25:كويس") - 4, 12)}><SickPerson shiver={0} blink /></Place>}
        </g>
      )}
      {nac > 0 && (
        <g opacity={nac}>
          <Place x={300} y={1080} s={1.5 * pop(f, F("s7l26:علاج") - 4, 14)}><IVBag /></Place>
          <Place x={760} y={1060} s={0.85}><Liver shield={prog(f, F("s7l26:حماية"), 14)} glow={prog(f, F("s7l26:حماية"), 14)} /></Place>
          <Place x={540} y={1420} s={pop(f, F("s7l26:أسيتيل") - 2, 14)}><Chip text="N-acetylcysteine (NAC)" w={720} size={44} dir="ltr" fill="#E4F1FA" /></Place>
        </g>
      )}
      {hrs > 0 && (
        <g opacity={hrs}>
          <Place x={540} y={1100} s={1.15}><Stopwatch a={prog(f, F("s7l27:أول") - 2, 40) * 250} text="8" fill="#E7F2DD" /></Place>
          <Label x={540} y={1400} text="أول 8 ساعات" size={56} color={C.key} o={prog(f, F("s7l27:أول"), 10)} />
          {f >= F("s7l28") - 4 && <Place x={850} y={900} s={0.8 * pop(f, F("s7l28:الوقاية") - 2, 12)}><Liver shield={1} glow={1} /></Place>}
        </g>
      )}
      {late > 0 && (
        <g opacity={late}>
          <Place x={250} y={980} s={0.8}><Clock a={f * 5} /></Place>
          <Place x={790} y={980} s={0.75 * pop(f, F("s7l29:التقييم") - 4, 12)}><Hospital /></Place>
          <Place x={540} y={1210} s={0.55 * pop(f, F("s7l29:العلاج") - 2, 12)}><Doc mood={0.7} glasses /></Place>
          <Label x={540} y={1500} text="لسه التقييم والعلاج مهمين" size={44} color={C.key} o={prog(f, F("s7l29:لسه"), 10)} />
        </g>
      )}
      {anti > 0 && (
        <g opacity={anti}>
          <Place x={540} y={1090} s={1.7}><IVBag /></Place>
          <Place x={540} y={1400} s={pop(f, F("s7l30:الأنتيدوت") - 2, 14)}><Chip text="العلاج المضاد" w={440} size={54} fill="#E4F1FA" /></Place>
        </g>
      )}
    </Svg>
  );
};
const s7: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s7l2:الكبد") - 0.2, sfx: "pop", vol: 0.14 },
    { at: t.s("s7l6:نابكي") - 0.2, sfx: "bump", vol: 0.14 },
    { at: t.s("s7l7") - 0.1, sfx: "shimmer", vol: 0.13 },
    { at: t.s("s7l8:الجلوتاثايون") - 0.2, sfx: "pop", vol: 0.13 },
    { at: t.s("s7l12:يهاجم") - 0.2, sfx: "crack", vol: 0.14 },
    { at: t.s("s7l14:تلف") - 0.05, sfx: "heartbeat", vol: 0.24, prio: true },
    { at: t.s("s7l18:حاسس") - 0.1, sfx: "tick", vol: 0.12 },
    { at: t.s("s7l24:الطوارئ") - 0.2, sfx: "ding", vol: 0.13 },
    { at: t.s("s7l26:علاج") - 0.2, sfx: "glass", vol: 0.13 },
    { at: t.s("s7l27:أول") - 0.2, sfx: "tick", vol: 0.13 },
  ],
  pulses: (t) => [t.f("s7l15@end"), t.f("s7l18@end"), t.f("s7l23@end")],
  // music stops before «ممكن يحصل تلف شديد» and before the instruction «ما تستناش»
  silence: (t) => [[t.s("s7l13") - 0.2, t.s("s7l14@end") + 0.2], [t.s("s7l23") - 0.9, t.s("s7l23@end") + 0.2]],
};

// ============================================================ 8. Is it safe? (yes, used right)
const S8: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const W = (a: string, b: string) => inOut(f, F(a) - 4, F(b + "@end") + 6, 12, 8);
  const ask = W("s8l1", "s8l3"), no = W("s8l4", "s8l4"), world = W("s8l5", "s8l5"), use = W("s8l6", "s8l7"), stom = W("s8l8", "s8l10");
  const ppl = W("s8l11", "s8l12"), key = W("s8l13", "s8l13"), otc = W("s8l14", "s8l14"), one = W("s8l15", "s8l15"), liv = W("s8l16", "s8l16"), kid = W("s8l17", "s8l17"), spoon = W("s8l18", "s8l18");
  return (
    <Svg>
      {ask > 0 && (
        <g opacity={ask}>
          <Place x={300} y={1100} s={1.2}><Tablet glow={0.5} /></Place>
          <Place x={780} y={1100} s={0.9 * pop(f, F("s8l2:الكبد") - 4, 12)}><Liver hurt={0.5} /></Place>
          <Place x={540} y={1400} s={1.3 * pop(f, F("s8l3:نخاف") - 4, 12)}><QuestionIcon /></Place>
        </g>
      )}
      {no > 0 && <g opacity={no}><Place x={540} y={1100} s={1.0}><Tablet glow={0.7} /></Place><Place x={540} y={1100} s={2.6 * pop(f, F("s8l4") + 2, 12)} o={0.9}><CheckIcon /></Place><Label x={540} y={1450} text="لأ، مش نخاف" size={64} color="#3F8F4A" o={prog(f, F("s8l4"), 10)} /></g>}
      {world > 0 && (
        <g opacity={world}>
          <Place x={540} y={1100} s={1.5}><Globe /></Place>
          <Place x={540} y={1100} s={0.75 * pop(f, F("s8l5:أمانا") - 4, 12)}><Tablet glow={0.4} /></Place>
          <Place x={820} y={900} s={0.9 * pop(f, F("s8l5:أمانا") - 4, 12)}><Shield04 /></Place>
        </g>
      )}
      {use > 0 && (
        <g opacity={use}>
          {[["الصداع", 250, "s8l7:الصداع"], ["الأسنان", 540, "s8l7:الأسنان"], ["آلام", 830, "s8l7:وآلام"]].map(([txt, x, a], i) => (
            <g key={i}>
              <Place x={x as number} y={1000} s={0.9 * pop(f, F(a as string) - 2, 12)}>{i === 0 ? <Flash s={1.0} /> : i === 1 ? <Tooth /> : <Muscle />}</Place>
              <Label x={x as number} y={1180} text={txt as string} size={40} o={prog(f, F(a as string), 10)} />
            </g>
          ))}
          <Place x={540} y={1380} s={0.55 * pop(f, F("s8l7:وبيخفض") - 2, 12)}><Thermo level={0.35} /></Place>
        </g>
      )}
      {stom > 0 && (
        <g opacity={stom}>
          <Place x={290} y={1070} s={1.1}><Stomach /></Place>
          <Place x={290} y={1070} s={1.1} o={0.0}><Stomach /></Place>
          <Place x={290} y={1350} s={0.55 * pop(f, F("s8l8:ومميزاته") + 4, 12)}><Tablet /></Place>
          <Place x={780} y={1070} s={1.1}><Stomach /></Place>
          <g opacity={prog(f, F("s8l9:زي") - 4, 12)}><circle cx={780} cy={1070} r={110} fill="#C23B32" opacity={0.18} /></g>
          <Place x={680} y={1350} s={0.7 * pop(f, F("s8l9:الإيبوبروفين") - 2, 12)}><Chip text="الإيبوبروفين" w={250} size={34} /></Place>
          <Place x={900} y={1350} s={0.01}><Chip text="" /></Place>
          <Place x={780} y={1440} s={0.7 * pop(f, F("s8l9:والديكلوفيناك") - 2, 12)}><Chip text="الديكلوفيناك" w={250} size={34} /></Place>
          <Label x={290} y={1490} text="أقل تهييج غالبا" size={38} color="#3F8F4A" o={prog(f, F("s8l8:أقل"), 10)} />
        </g>
      )}
      {ppl > 0 && (
        <g opacity={ppl}>
          <Place x={230} y={1100} s={0.85 * pop(f, F("s8l11:الأطفال") - 2, 12)}><Baby /></Place>
          <Place x={460} y={1100} s={1.1 * pop(f, F("s8l11:والبالغين") - 2, 12)}><Person fill="#F3C79A" /></Place>
          <Place x={690} y={1100} s={1.1 * pop(f, F("s8l11:وكبار") - 2, 12)}><Person fill="#C9C9C9" /></Place>
          <Place x={880} y={1130} s={0.6 * pop(f, F("s8l12:الحمل") - 2, 12)}><Pregnant /></Place>
          <Place x={540} y={1300} s={0.5 * pop(f, F("s8l12:بالتوجيه") - 2, 12)}><Doc mood={0.8} glasses /></Place>
        </g>
      )}
      {key > 0 && (
        <g opacity={key}>
          <Place x={540} y={1050} s={2.0 * pop(f, F("s8l13:السر") - 4, 14)}><KeyShape /></Place>
          <Place x={540} y={1380} s={pop(f, F("s8l13:الاستخدام") - 2, 14)}><Chip text="الاستخدام الصحيح" w={560} size={58} fill="#FFF3CF" color={C.key} /></Place>
        </g>
      )}
      {otc > 0 && (
        <g opacity={otc}>
          <Place x={300} y={1080} s={1.2}><PackBox kind="plain" band="#9DC9E8" /></Place>
          <Place x={300} y={1300} s={0.85 * pop(f, F("s8l14:متاح") - 2, 12)}><Chip text="من غير روشتة" w={340} size={36} /></Place>
          <Place x={780} y={1090} s={1.0 * pop(f, F("s8l14:آمن") - 2, 12)}><Balance tilt={0.9} left={<Tablet />} right={<Tablet />} /></Place>
          <Place x={780} y={1090} s={2.4 * pop(f, F("s8l14:مهما") - 2, 12)} o={0.9}><XMark p={pop(f, F("s8l14:مهما"), 12)} /></Place>
          <Label x={780} y={1430} text="مهما كانت الجرعة" size={40} color={C.warn} o={prog(f, F("s8l14:مهما"), 10)} />
        </g>
      )}
      {one > 0 && (
        <g opacity={one}>
          <Place x={540} y={1110} s={0.9}><Crowd n={5} /></Place>
          <g opacity={prog(f, F("s8l15:لكل"), 12)}><circle cx={540} cy={1060} r={120} fill="none" {...sk} stroke={C.key} strokeWidth={10} /></g>
          <Place x={540} y={1400} s={1.2 * pop(f, F("s8l15:بنفس") - 2, 12)}><QuestionIcon /></Place>
        </g>
      )}
      {liv > 0 && (
        <g opacity={liv}>
          <Place x={300} y={1090} s={0.9}><Liver /></Place>
          <Place x={760} y={1030} s={0.85 * pop(f, F("s8l16:تقييم") - 4, 12)}><Doc mood={0.7} glasses /></Place>
          <Label x={540} y={1490} text="تقييم خاص" size={56} color={C.key} o={prog(f, F("s8l16:تقييم"), 10)} />
        </g>
      )}
      {kid > 0 && (
        <g opacity={kid}>
          <Place x={300} y={1020} s={1.0}><Baby /></Place>
          <Place x={760} y={1090} s={0.8}><WeightScale tilt={0.4 * Math.sin(f / 20)} /></Place>
          <Place x={300} y={1300} s={pop(f, F("s8l17:الوزن") - 4, 12)}><Chip text="حسب الوزن" w={320} size={40} /></Place>
          <Place x={540} y={1470} s={pop(f, F("s8l17:وتركيز") - 2, 12)}><Chip text="وتركيز المستحضر" w={430} size={40} /></Place>
        </g>
      )}
      {spoon > 0 && (
        <g opacity={spoon}>
          <Place x={540} y={1090} s={1.6 * pop(f, F("s8l18:بالمعلقة") - 6, 14)}><Spoon /></Place>
          <Place x={540} y={1090} s={2.6 * pop(f, F("s8l18:المطبخ") - 4, 12)} o={0.95}><XMark p={pop(f, F("s8l18:المطبخ"), 12)} /></Place>
          <Label x={540} y={1450} text="جرعة الطفل لا تُقاس بمعلقة المطبخ" size={36} color={C.warn} o={prog(f, F("s8l18:بالمعلقة"), 10)} />
        </g>
      )}
    </Svg>
  );
};
const Shield04: React.FC = () => (
  <g><path d="M0 -70 L66 -42 C66 24 44 58 0 80 C-44 58 -66 24 -66 -42 Z" fill="#9DC9E8" {...sk} /><path d="M-24 4 L-6 24 L28 -16" fill="none" {...sk} strokeWidth={12} /></g>
);
const Tooth: React.FC = () => (
  <g><path d="M-60 -40 C-60 -90 -10 -90 0 -66 C10 -90 60 -90 60 -40 C60 10 40 20 36 80 C34 110 14 110 10 70 C8 40 -8 40 -10 70 C-14 110 -34 110 -36 80 C-40 20 -60 10 -60 -40 Z" fill={C.white} {...sk} /></g>
);
const s8: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s8l4") - 0.1, sfx: "ding", vol: 0.14 },
    { at: t.s("s8l5:أمانا") - 0.2, sfx: "shimmer", vol: 0.12 },
    { at: t.s("s8l11:الأطفال") - 0.2, sfx: "pop", vol: 0.12 },
    { at: t.s("s8l13:السر") - 0.2, sfx: "click", vol: 0.14 },
    { at: t.s("s8l14:مهما") - 0.2, sfx: "bump", vol: 0.13 },
    { at: t.s("s8l18:المطبخ") - 0.2, sfx: "bump", vol: 0.14 },
  ],
  pulses: (t) => [t.f("s8l4@end"), t.f("s8l13@end")],
};

// ============================================================ 9. Closing: the three points
const S9: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const W = (a: string, b: string) => inOut(f, F(a) - 4, F(b + "@end") + 6, 12, 8);
  const intro = W("s9l1", "s9l1"), one = W("s9l2", "s9l3"), two = W("s9l4", "s9l5"), three = W("s9l6", "s9l7"), fin = W("s9l8", "s9l9"), cm = W("s9l10", "s9l11"), end = W("s9l12", "s9l13");
  return (
    <Svg>
      {intro > 0 && <g opacity={intro}>{[0, 1, 2].map((i) => (<Place key={i} x={250 + i * 290} y={1130} s={1.1 * pop(f, F("s9l1:تلات") + i * 6, 12)}><Num n={String(i + 1)} /></Place>))}</g>}
      {one > 0 && (
        <g opacity={one}>
          <Place x={540} y={880} s={0.9}><Num n="1" /></Place>
          <Place x={330} y={1180} s={1.4}><Tablet glow={0.6} /></Place>
          <Place x={750} y={1180} s={0.95 * pop(f, F("s9l3:أسرار") - 4, 14)}><MysteryCard open={prog(f, F("s9l3:أسرار"), 14)} text="؟" sub="" /></Place>
          <Place x={330} y={1010} s={0.8 * pop(f, F("s9l2:وفعال") - 2, 12)}><CheckIcon /></Place>
        </g>
      )}
      {two > 0 && (
        <g opacity={two}>
          <Place x={540} y={880} s={0.9}><Num n="2" /></Place>
          <Place x={260} y={1180} s={0.9}><PackBox kind="pain" band="#F2D79A" /></Place>
          <Place x={820} y={1180} s={0.9 * pop(f, F("s9l5:أكتر") - 2, 12)}><PackBox kind="cold" band="#9DC9E8" /></Place>
          <Place x={540} y={1250} s={1.0 * pop(f, F("s9l4:الجرعة") - 2, 12)}><Tablet glow={1} /></Place>
        </g>
      )}
      {three > 0 && (
        <g opacity={three}>
          <Place x={540} y={880} s={0.9}><Num n="3" /></Place>
          <Place x={300} y={1180} s={1.0}><Hospital /></Place>
          <Place x={780} y={1150} s={0.8}><Clock a={f * 8} /></Place>
          <Place x={780} y={1150} s={1.9 * pop(f, F("s9l7:تستناش") - 2, 12)} o={0.95}><XMark p={pop(f, F("s9l7:تستناش"), 12)} /></Place>
        </g>
      )}
      {fin > 0 && (
        <g opacity={fin}>
          <Place x={540} y={1130} s={1.5}><Tablet glow={0.5} /></Place>
          {[[250, 900], [820, 940], [300, 1400], [800, 1380]].map(([x, y], i) => (<Place key={i} x={x} y={y - bob(f, 8, 50, i * 12)} s={0.9 * pop(f, F("s9l9:كل") + i * 5 - 8, 12)}><QuestionIcon /></Place>))}
        </g>
      )}
      {cm > 0 && (
        <g opacity={cm}>
          <Place x={540} y={1060} s={1.8 * pop(f, F("s9l10:اكتب") - 4, 14)}><Bubble /></Place>
          <Place x={540} y={1380} s={pop(f, F("s9l11:إنت") - 4, 12)}><Chip text="الحلقة الجاية: إنت تختار" w={620} size={46} fill="#FFF3CF" /></Place>
        </g>
      )}
      {end > 0 && (
        <g opacity={end}>
          <Place x={540} y={1120} s={pop(f, F("s9l13:افهمها") - 4, 14)}><Chip text="افهمها… مش تحفظها" w={720} size={66} fill="#FFF3CF" color={C.key} /></Place>
          {sparkle(f, F("s9l13:افهمها"), 300, 900, 1.5)}{sparkle(f, F("s9l13:تحفظها"), 780, 930, 1.3)}
        </g>
      )}
    </Svg>
  );
};
const s9: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s9l1:تلات") - 0.2, sfx: "pop", vol: 0.13 },
    { at: t.s("s9l4:الجرعة") - 0.2, sfx: "pop", vol: 0.13 },
    { at: t.s("s9l7:تستناش") - 0.2, sfx: "bump", vol: 0.13 },
    { at: t.s("s9l10:اكتب") - 0.2, sfx: "pop", vol: 0.12 },
    { at: t.s("s9l13:افهمها") - 0.2, sfx: "shimmer", vol: 0.13 },
  ],
  pulses: (t) => [t.f("s9l7@end"), t.f("s9l13@end")],
  tray: (t) => [
    { id: "n1", arrive: t.f("s9l3@end") + 6, from: { x: 540, y: 880, s: 1.0 }, icon: icon(<text x={0} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={C.key}>1</text>) },
    { id: "n2", arrive: t.f("s9l5@end") + 6, from: { x: 540, y: 880, s: 1.0 }, icon: icon(<text x={0} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={C.key}>2</text>) },
    { id: "n3", arrive: t.f("s9l7@end") + 6, from: { x: 540, y: 880, s: 1.0 }, icon: icon(<text x={0} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={C.key}>3</text>) },
  ],
};

// ============================================================ Short-only scenes
/** 11: Short 1 hook «أخطر حاجة هنا إنك ممكن تكون أخدت جرعة زيادة… ومش حاسس بأي حاجة!» */
const S11: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const p = pop(f, F("s11l1:أخطر") - 2, 12), tab = pop(f, F("s11l1:جرعة") - 4, 12);
  const calm = pop(f, F("s11l2:حاسس") - 6, 14);
  return (
    <Svg>
      <Place x={400} y={1150} s={1.7}><SickPerson shiver={0} blink /></Place>
      <Place x={400} y={1220} s={0.6 * calm} o={0.85}><Liver hurt={0.9} /></Place>
      <Place x={800} y={900} s={1.4 * p}><Warn /></Place>
      {[0, 1, 2].map((i) => (<Place key={i} x={720 + (i % 2) * 110} y={1130 + i * 90} s={0.6 * tab} r={i * 12}><Tablet /></Place>))}
      <Label x={540} y={1500} text="ومش حاسس بأي حاجة" size={50} color={C.key} o={calm} />
    </Svg>
  );
};
const s11: Omit<SceneDef, "C"> = {
  cues: (t) => [{ at: t.s("s11l1:أخطر") - 0.1, sfx: "heartbeat", vol: 0.22, prio: true }, { at: t.s("s11l2:حاسس") - 0.2, sfx: "tick", vol: 0.12 }],
  pulses: (t) => [t.f("s11l2@end")],
};
/** 12: Short 2 hook (the press conference, neutral) */
const S12: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  return (
    <Svg>
      <Place x={540} y={1100} s={0.9}><Podium /></Place>
      <Place x={200} y={1000} s={0.7 * pop(f, F("s12l1:الحوامل") - 4, 12)}><Pregnant /></Place>
      <Place x={210} y={1190} s={0.8 * pop(f, F("s12l1:يحذر") - 4, 12)}><Warn /></Place>
      <Place x={800} y={1010} s={0.9 * pop(f, F("s12l2:بالتوحد") - 4, 12)}><Baby /></Place>
      <Place x={540} y={1470} s={pop(f, F("s12l3") - 2, 14) * 1.4}><QuestionIcon /></Place>
    </Svg>
  );
};
const s12: Omit<SceneDef, "C"> = {
  cues: (t) => [{ at: t.s("s12l1:يحذر") - 0.2, sfx: "whoosh", vol: 0.15 }, { at: t.s("s12l3") - 0.1, sfx: "bump", vol: 0.14 }],
  pulses: (t) => [t.f("s12l3@end")],
  silence: (t) => [[t.s("s12l3") - 0.6, t.s("s12l3@end") + 0.1]],
};
/** 13: Short 2 ending «مش كل دوا مشهور… معناه إننا عارفين عنه كل حاجة!» */
const S13: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  return (
    <Svg>
      <Place x={540} y={950} s={1.3}><Tablet glow={0.5} /></Place>
      {[[250, 780], [820, 820], [290, 1110], [800, 1090]].map(([x, y], i) => (<Place key={i} x={x} y={y - bob(f, 8, 50, i * 12)} s={0.9 * pop(f, F("s13l2:كل") + i * 5 - 8, 12)}><QuestionIcon /></Place>))}
    </Svg>
  );
};
const s13: Omit<SceneDef, "C"> = { cues: (t) => [{ at: t.s("s13l2:عارفين") - 0.2, sfx: "pop", vol: 0.12 }], pulses: (t) => [t.f("s13l2@end")] };
/** 14: Short 1 ending (right use, then «don't wait for symptoms») */
const S14: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const a = inOut(f, F("s14l1") - 4, F("s14l2@end") + 6, 12, 8), b = inOut(f, F("s14l3") - 4, F("s14l3@end") + 20, 12, 8);
  return (
    <Svg>
      {a > 0 && (
        <g opacity={a}>
          <Place x={300} y={1060} s={1.6 * pop(f, F("s14l1:السر") - 4, 14)}><KeyShape /></Place>
          <Place x={780} y={1090} s={0.9 * pop(f, F("s14l2:آمن") - 2, 12)}><Balance tilt={0.9} left={<Tablet />} right={<Tablet />} /></Place>
          <Place x={780} y={1090} s={2.2 * pop(f, F("s14l2:مهما") - 2, 12)} o={0.9}><XMark p={pop(f, F("s14l2:مهما"), 12)} /></Place>
          <Place x={540} y={1400} s={pop(f, F("s14l1:الاستخدام") - 2, 14)}><Chip text="الاستخدام الصحيح" w={560} size={56} fill="#FFF3CF" color={C.key} /></Place>
        </g>
      )}
      {b > 0 && (
        <g opacity={b}>
          <Place x={330} y={930} s={1.0}><Hospital /></Place>
          <Place x={780} y={910} s={0.7}><Clock a={f * 8} /></Place>
          <Place x={780} y={910} s={1.7 * pop(f, F("s14l3:تستناش") - 2, 12)} o={0.95}><XMark p={pop(f, F("s14l3:تستناش"), 12)} /></Place>
          <Label x={540} y={1170} text="روح الطوارئ على طول" size={56} color={C.warn} o={prog(f, F("s14l3:روح"), 10)} />
        </g>
      )}
    </Svg>
  );
};
const s14: Omit<SceneDef, "C"> = {
  cues: (t) => [{ at: t.s("s14l1:السر") - 0.2, sfx: "click", vol: 0.14 }, { at: t.s("s14l3:تستناش") - 0.2, sfx: "bump", vol: 0.14 }],
  pulses: (t) => [t.f("s14l3@end")],
  silence: (t) => [[t.s("s14l3") - 0.8, t.s("s14l3") - 0.05]],
};

/** 15: Short 3 ending «مش مادة واحدة… آلية تأثيره لسه فيها أسرار!» (everything above y=1200: the disclaimer sits below) */
const S15: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const a = inOut(f, F("s15l1") - 4, F("s15l1@end") + 6, 12, 8), b = inOut(f, F("s15l2") - 4, F("s15l2@end") + 30, 12, 8);
  return (
    <Svg>
      {a > 0 && (
        <g opacity={a}>
          <Place x={540} y={940} s={1.3 * pop(f, F("s15l1:مادة") - 6, 14)}><Cox blocked={1} /></Place>
          <Label x={540} y={1170} text="مش مادة واحدة بس" size={50} o={prog(f, F("s15l1:واحدة"), 10)} />
        </g>
      )}
      {b > 0 && (
        <g opacity={b}>
          <Place x={540} y={940} s={1.15 * pop(f, F("s15l2:آلية") - 4, 14)}><MysteryCard open={prog(f, F("s15l2:أسرار") - 2, 14)} text="؟" sub="" /></Place>
          <Label x={540} y={1170} text="لسه فيها أسرار" size={52} color={C.key} o={prog(f, F("s15l2:أسرار"), 10)} />
          {sparkle(f, F("s15l2:أسرار"), 760, 780, 1.3)}
        </g>
      )}
    </Svg>
  );
};
const s15: Omit<SceneDef, "C"> = {
  cues: (t) => [{ at: t.s("s15l1:مادة") - 0.15, sfx: "pop", vol: 0.13 }, { at: t.s("s15l2:أسرار") - 0.2, sfx: "ding", vol: 0.12 }],
  pulses: (t) => [t.f("s15l2@end")],
};
/** 16: Short 4 ending (1948 re-discovery -> everywhere in the world) */
const S16: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const a = inOut(f, F("s16l1") - 4, F("s16l1@end") + 6, 12, 8), b = inOut(f, F("s16l2") - 4, F("s16l3@end") + 30, 12, 8);
  return (
    <Svg>
      {a > 0 && (
        <g opacity={a}>
          <Place x={540} y={930} s={1.7 * pop(f, F("s16l1:إعادة") - 4, 14)}><Tablet glow={1} /></Place>
          {sparkle(f, F("s16l1:إعادة"), 330, 790, 1.4)}{sparkle(f, F("s16l1:اكتشاف") - 2, 760, 820, 1.2)}
          <Label x={540} y={1170} text="إعادة اكتشاف" size={52} color={C.key} o={prog(f, F("s16l1:إعادة"), 10)} />
        </g>
      )}
      {b > 0 && (
        <g opacity={b}>
          <Place x={290} y={900} s={0.85}><Pharmacy ok={1} /></Place>
          <Place x={790} y={890} s={0.8}><Hospital /></Place>
          {[[340, 1090], [540, 1060], [740, 1090]].map(([x, y], i) => (<Place key={i} x={x} y={y} s={0.5 * pop(f, F("s16l2:استخدامه") + i * 6, 12)}><Tablet /></Place>))}
          <Label x={540} y={1180} text="من أشهر المسكنات في العالم" size={46} color={C.key} o={prog(f, F("s16l3:أشهر"), 10)} />
        </g>
      )}
    </Svg>
  );
};
const s16: Omit<SceneDef, "C"> = {
  cues: (t) => [{ at: t.s("s16l1:إعادة") - 0.2, sfx: "paper", vol: 0.13 }, { at: t.s("s16l3:أشهر") - 0.2, sfx: "shimmer", vol: 0.12 }],
  pulses: (t) => [t.f("s16l3@end")],
};

export const SCENES_EP04: Record<number, SceneDef> = {
  1: { C: S1, ...s1 }, 2: { C: S2, ...s2 }, 3: { C: S3, ...s3 }, 4: { C: S4, ...s4 }, 5: { C: S5, ...s5 }, 6: { C: S6, ...s6 },
  7: { C: S7, ...s7 }, 8: { C: S8, ...s8 }, 9: { C: S9, ...s9 },
  11: { C: S11, ...s11 }, 12: { C: S12, ...s12 }, 13: { C: S13, ...s13 }, 14: { C: S14, ...s14 }, 15: { C: S15, ...s15 }, 16: { C: S16, ...s16 },
};
export const DISCLAIMER_EP04 = "شرح مبسط للتوعية، مش بديل لاستشارة الطبيب أو الصيدلي. المصادر في الوصف.";
// which music theme plays under which scene: curiosity (explaining), tension (risk / controversy), hope (the takeaway)
export const THEME_EP04: Record<number, "curiosity" | "tension" | "hope"> = { 1: "curiosity", 2: "curiosity", 3: "curiosity", 4: "curiosity", 5: "curiosity", 6: "tension", 7: "tension", 8: "hope", 9: "hope", 11: "tension", 12: "tension", 13: "hope", 14: "hope", 15: "curiosity", 16: "hope" };
export { Scissors, Sparkle, Warn, Bubble, easeInOut, easeOut, interpolate, clamp, Muscle, Brain };
