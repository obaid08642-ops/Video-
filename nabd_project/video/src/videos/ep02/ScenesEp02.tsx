// Ep02 (GLP-1, recorded voice). Every beat is anchored to a spoken word of the timing JSON.
// Legal drawing rules (scripts/02_glp1_v4.md): generic pens only (names as plain text), no logos or brand
// colours, no before/after bodies, no prices or sale places, comparison numbers only in the description.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Capsule, CheckIcon, Place, QuestionIcon, Sparkle } from "../../assets";
import { Calendar, CalendarIcon, Crowd, Doc } from "../../assets/more";
import { Bubble, Dumbbell, Warn } from "../../assets/v9";
import {
  Balance, BodyMap, Brain, Chip, ColorPlate, DoorOpen, Factory, Family, FatDrop, Gallbladder, Gauge, Heart, Hospital, InjPen,
  Lizard, MapPin, Molecule, Muscle, Pancreas, Person, Pharmacy, Phone, Plate, Pregnant, PriceTag, Protein, Queasy, RegainChart,
  SmallPlate, Spread, Stamp, Stomach, Stopwatch, SugarDrop, Thyroid, WaterGlass, WeekStrip, XMark, OkMark,
} from "../../assets/ep02";
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
export const SEMA = "سيماجلوتيد (Semaglutide)";
export const TIRZ = "تيرزيباتيد (Tirzepatide)";

// ============================================================ 1. Hook
const S1: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const plate = inOut(f, -10, F("s1l2:سحلية") - 2, 10, 8);
  const hungry = interpolate(f, [F("s1l1:كلت"), F("s1l1:لسه") - 2, F("s1l1:جعان")], [0, 0.75, 0.12], { ...clamp, easing: easeInOut });
  const liz = inOut(f, F("s1l2:سحلية") - 6, F("s1l2:وسرها") + 2, 12, 8);
  const walk = interpolate(f, [F("s1l2:سحلية") - 6, F("s1l2:بتاكل")], [-500, 0], { ...clamp, easing: easeOut });
  const meals = [0, 1, 2, 3].map((i) => pop(f, F("s1l2:تلات") - 4 + i * 4, 10));
  const year = prog(f, F("s1l2:السنة") - 6, 12);
  const door = inOut(f, F("s1l2:وسرها") - 4, F("s1l3") + 2, 12, 8);
  const open = prog(f, F("s1l2:فتح"), 16, easeInOut);
  const pen = pop(f, F("s1l2:حقن") - 4, 12);
  const crowd = inOut(f, F("s1l3") - 4, F("s1l4") + 2, 12, 8);
  const one = prog(f, F("s1l3:تمانية") - 4, 12);
  const bal = inOut(f, F("s1l4") - 4, F("s1l6") + 2, 12, 8);
  const will = pop(f, F("s1l4:إرادة") - 4, 12);
  const tip = interpolate(f, [F("s1l4:إرادة"), F("s1l4:وبس")], [0, 1], { ...clamp, easing: easeOut }) * (1 - prog(f, F("s1l5:بس") - 2, 14, easeInOut));
  const q = pop(f, F("s1l5:معلومة") - 4, 12);
  return (
    <Svg>
      {plate > 0 && (
        <g opacity={plate}>
          <Place x={540} y={1260}><Plate /></Place>
          <Place x={540} y={940} s={1.15}><Gauge v={hungry + (f > F("s1l1:جعان") ? Math.sin(f * 0.9) * 0.03 : 0)} /></Place>
        </g>
      )}
      {liz > 0 && (
        <g opacity={liz}>
          <Place x={600 + walk} y={1300} s={1.0}><Lizard walk={walk < -2 ? f / 3 : 0} tongue={prog(f, F("s1l2:بتاكل"), 6) * (1 - prog(f, F("s1l2:بتاكل") + 10, 6))} /></Place>
          {year > 0 && (
            <g opacity={year}>
              <circle cx={540} cy={880} r={250} fill="none" {...sk} strokeDasharray="4 22" />
              <Label x={540} y={900} text="سنة كاملة" size={50} />
            </g>
          )}
          {meals.map((m, i) => m > 0 && (
            <Place key={i} x={540 + Math.cos(-Math.PI / 2 + (i * Math.PI) / 2) * 250} y={880 + Math.sin(-Math.PI / 2 + (i * Math.PI) / 2) * 250} s={0.36 * m}><Plate food={1} /></Place>
          ))}
        </g>
      )}
      {door > 0 && (
        <g opacity={door}>
          <Place x={540} y={1130} s={1.1}><DoorOpen open={open} /></Place>
          <Place x={330} y={1380} s={0.45}><Lizard mood={1} /></Place>
          {pen > 0 && <Place x={640} y={1460 + bob(f, 6, 40)} s={0.62 * pen} r={-8}><InjPen /></Place>}
          {pen > 0 && [[800, 900], [300, 960]].map(([x, y], i) => (<Place key={i} x={x} y={y} s={0.5 * pen} r={f * 2}><Sparkle fill="#FFF3CF" /></Place>))}
        </g>
      )}
      {crowd > 0 && (
        <g opacity={crowd}>
          {Array.from({ length: 8 }).map((_, i) => {
            const x = 180 + (i % 4) * 240, y = 920 + Math.floor(i / 4) * 270; const hi = i === 5;
            return (
              <g key={i}>
                {hi && one > 0 && <circle cx={x} cy={y - 10} r={120 * one} fill={C.key} opacity={0.22} />}
                <Place x={x} y={y + bob(f, 3, 50, i * 6)} s={1.25 * pop(f, F("s1l3") - 4 + i * 2, 10)}><Person fill={hi && one > 0.5 ? "#F0B27A" : "#C9D3DB"} /></Place>
              </g>
            );
          })}
          <Label x={540} y={1470} text="1 من كل 8" size={64} color={C.key} o={one} />
        </g>
      )}
      {bal > 0 && (
        <g opacity={bal}>
          <Place x={540} y={1180} s={1.25}>
            <Balance tilt={tip * -1 + (q > 0 ? 0 : 0)} left={will > 0 ? <g transform={`scale(${will})`}><Chip text="إرادة" w={180} size={38} /></g> : null}
              right={q > 0 ? <g transform={`scale(${0.9 * q}) translate(0 -20)`}><QuestionIcon /></g> : null} />
          </Place>
        </g>
      )}
    </Svg>
  );
};
const s1: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s1l1:جعان") - 0.2, sfx: "tick", vol: 0.14 },
    { at: t.s("s1l2:سحلية") - 0.3, sfx: "paper", vol: 0.15 },
    { at: t.s("s1l2:تلات") - 0.2, sfx: "pop", vol: 0.14 },
    { at: t.s("s1l2:فتح") - 0.1, sfx: "door", vol: 0.13 },
    { at: t.s("s1l2:حقن") - 0.25, sfx: "shimmer", vol: 0.12 },
    { at: t.s("s1l3:تمانية@end") + 0.05, sfx: "ding", vol: 0.12 },
    { at: t.s("s1l4:إرادة") - 0.25, sfx: "bump", vol: 0.13 },
    { at: t.s("s1l5:معلومة") - 0.25, sfx: "pop", vol: 0.14 },
  ],
  pulses: (t) => [t.f("s1l3:تمانية@end"), t.f("s1l5:فايتاك@end")],
};

// ============================================================ 2. GLP-1
const S2: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const body = inOut(f, F("s2l1") - 4, F("s2l3") + 2, 12, 8);
  const horm = prog(f, F("s2l1:هرمونات") - 4, 14);
  const glp = pop(f, F("s2l1:الجي") - 4, 12);
  const meal = pop(f, F("s2l2:الأكل") - 6, 12);
  const lit = [pop(f, F("s2l2:تلات") - 2, 10), pop(f, F("s2l2:تلات") + 4, 10), pop(f, F("s2l2:أماكن"), 10)];
  const brain = inOut(f, F("s2l3") - 4, F("s2l4") + 2, 12, 8);
  const hung = interpolate(f, [F("s2l3:بيقلل"), F("s2l3:الجوع@end")], [0.1, 0.8], { ...clamp, easing: easeInOut });
  const stom = inOut(f, F("s2l4") - 4, F("s2l5") + 2, 12, 8);
  const slow = prog(f, F("s2l4:بيبطأ") - 2, 30, easeInOut);
  const full = interpolate(f, [F("s2l4:فتفضل"), F("s2l4:أطول@end")], [0.3, 0.95], { ...clamp, easing: easeInOut });
  const panc = inOut(f, F("s2l5") - 4, F("s2l6") + 2, 12, 8);
  const sugar = interpolate(f, [F("s2l5:السكر") - 4, F("s2l5:يعلى@end")], [0.2, 0.9], { ...clamp, easing: easeInOut });
  const ins = prog(f, F("s2l5:يعلى") - 2, 14);
  const gone = inOut(f, F("s2l6") - 4, F("s2l6@end") + 30, 12, 8);
  const fade = prog(f, F("s2l6:بيختفي"), 40, easeInOut);
  return (
    <Svg>
      {body > 0 && (
        <g opacity={body}>
          <Place x={360} y={1180} s={0.95}><BodyMap lit={lit} /></Place>
          {horm > 0 && [0, 1, 2, 3].map((i) => (<circle key={i} cx={360 + Math.cos(f / 20 + i * 1.6) * 180} cy={1080 + Math.sin(f / 26 + i) * 180} r={14 * horm} fill="#F0A23B" {...sk} strokeWidth={4} />))}
          {glp > 0 && <Place x={780} y={900} s={0.7 * glp}><Molecule label="GLP-1" /></Place>}
          {meal > 0 && <Place x={790} y={1330} s={0.55 * meal}><Plate food={1} /></Place>}
          {meal > 0.5 && glp > 0 && <path d="M790 1250 C790 1150 780 1080 780 1010" fill="none" {...sk} stroke={C.key} strokeDasharray="14 14" strokeDashoffset={-f * 2} opacity={meal} />}
        </g>
      )}
      {brain > 0 && (
        <g opacity={brain}>
          <Place x={540} y={960} s={1.4}><Brain /></Place>
          <Place x={540} y={1440} s={0.95}><Gauge v={hung} /></Place>
        </g>
      )}
      {stom > 0 && (
        <g opacity={stom}>
          <Place x={420} y={1040} s={1.5}><Stomach /></Place>
          <Place x={790} y={980} s={0.75}><Stopwatch a={slow * 90} text="ببطء" /></Place>
          <Place x={540} y={1440} s={0.95}><Gauge v={full} /></Place>
        </g>
      )}
      {panc > 0 && (
        <g opacity={panc}>
          <Place x={540} y={980} s={1.5}><Pancreas /></Place>
          <g transform="translate(220 1260)">
            <rect x={-40} y={-200} width={80} height={240} rx={30} fill={C.paper} {...sk} />
            <rect x={-28} y={28 - 220 * sugar} width={56} height={220 * sugar} rx={20} fill="#E86A5E" />
            <Label x={0} y={110} text="السكر" size={38} />
          </g>
          {ins > 0 && [0, 1, 2].map((i) => (<Place key={i} x={600 + i * 110} y={1200 + 120 * ins + i * 20} s={0.9 * ins}><path d="M0 -40 C20 -10 30 6 30 20 C30 40 14 50 0 50 C-14 50 -30 40 -30 20 C-30 6 -20 -10 0 -40 Z" fill="#9DC9E8" {...sk} strokeWidth={4} /></Place>))}
          {ins > 0 && <Label x={710} y={1460} text="إنسولين" size={44} o={ins} />}
        </g>
      )}
      {gone > 0 && (
        <g opacity={gone}>
          <Place x={540} y={940} s={1.1}><Molecule label="GLP-1" fade={fade * 0.85} /></Place>
          <Place x={540} y={1360} s={0.95}><Stopwatch a={(f - F("s2l6")) * 14} text="دقايق" /></Place>
        </g>
      )}
    </Svg>
  );
};
const s2: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s2l1") - 0.1, sfx: "whoosh", vol: 0.18 },
    { at: t.s("s2l1:الجي") - 0.25, sfx: "pop", vol: 0.14 },
    { at: t.s("s2l2:تلات") - 0.2, sfx: "ding", vol: 0.12 },
    { at: t.s("s2l4:بيبطأ") - 0.2, sfx: "tick", vol: 0.12 },
    { at: t.s("s2l5:يعلى") - 0.1, sfx: "drip", vol: 0.13 },
    { at: t.s("s2l6:دقايق") - 0.25, sfx: "tick", vol: 0.14 },
  ],
  pulses: (t) => [t.f("s2l1:ون@end"), t.f("s2l6:دقايق@end")],
  tray: (t) => [{ id: "glp", arrive: t.f("s2l2@end") + 6, from: { x: 780, y: 900, s: 1.6 }, icon: icon(<text x={0} y={9} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill={C.ink} direction="ltr">GLP-1</text>) }],
};

// ============================================================ 3. The lizard
const S3: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const liz = inOut(f, F("s3l1") - 6, F("s3l2:عالم") + 2, 12, 8);
  const cal = pop(f, F("s3l2:ألف") - 4, 12);
  const lab = inOut(f, F("s3l2:عالم") - 4, F("s3l3") + 2, 12, 8);
  const venom = prog(f, F("s3l2:سم") - 4, 16);
  const name = pop(f, F("s3l2:هيلا") - 4, 12);
  const cmp = inOut(f, F("s3l3") - 4, F("s3l4") + 2, 12, 8);
  const ex = pop(f, F("s3l3:مادة") + 6, 12);
  const hours = prog(f, F("s3l3:ساعات") - 4, 12);
  const drug = inOut(f, F("s3l4") - 4, F("s3l5") + 2, 12, 8);
  const y05 = pop(f, F("s3l4:أول") - 4, 12);
  const not = inOut(f, F("s3l5") - 4, F("s3l5:هي") + 2, 12, 8);
  const xx = prog(f, F("s3l5:مش") - 2, 12);
  const door = inOut(f, F("s3l5:هي") - 4, F("s3l5@end") + 30, 12, 8);
  const open = prog(f, F("s3l5:فتحت"), 16, easeInOut);
  const sci = pop(f, F("s3l5:والعلماء") - 4, 12);
  return (
    <Svg>
      {liz > 0 && (
        <g opacity={liz}>
          <circle cx={540} cy={1180} r={380 * liz} fill="#FFF3CF" opacity={0.7} />
          <Place x={590} y={1200 + bob(f, 4, 50)} s={1.35}><Lizard walk={0} tongue={prog(f, F("s3l1:السحلية"), 6) * (1 - prog(f, F("s3l1:السحلية") + 10, 6))} /></Place>
          {cal > 0 && <Place x={540} y={830} s={0.75 * cal}><Calendar year="1992" /></Place>}
        </g>
      )}
      {lab > 0 && (
        <g opacity={lab}>
          <Place x={300} y={1080} s={0.95}><Doc glasses mood={0.6} hair="#4B4038" /></Place>
          <Label x={300} y={1500} text="John Eng" size={46} dir="ltr" />
          <Place x={780} y={1300} s={0.62}><Lizard /></Place>
          {venom > 0 && <Place x={620} y={1240 - 200 * venom} s={0.8 * Math.min(1, venom * 2)}><path d="M0 -40 C20 -10 30 6 30 20 C30 40 14 50 0 50 C-14 50 -30 40 -30 20 C-30 6 -20 -10 0 -40 Z" fill="#B9D27F" {...sk} strokeWidth={4} /></Place>}
          <Place x={780} y={850} s={0.5 * cal}><Calendar year="1992" /></Place>
          {name > 0 && <Place x={780} y={1480} s={name}><Chip text="Gila monster" w={330} size={44} dir="ltr" /></Place>}
        </g>
      )}
      {cmp > 0 && (
        <g opacity={cmp}>
          <Place x={540} y={880} s={0.85}><Molecule label="GLP-1" /></Place>
          {ex > 0 && <Place x={540} y={1200} s={0.85 * ex}><Molecule label="Exendin-4" color="#B9D27F" /></Place>}
          <Place x={250} y={1420} s={0.6}><Stopwatch a={(f - F("s3l3")) * 14} text="دقايق" /></Place>
          {hours > 0 && <Place x={830} y={1420} s={0.6 * hours}><Stopwatch a={(f - F("s3l3")) * 1.5} text="ساعات" fill="#E7F2DD" /></Place>}
        </g>
      )}
      {drug > 0 && (
        <g opacity={drug}>
          <Place x={540} y={1120} s={1.0 * y05} r={-12}><InjPen /></Place>
          {y05 > 0 && <Place x={540} y={820} s={0.7 * y05}><Calendar year="2005" /></Place>}
          <Label x={540} y={1380} text="Exenatide" size={48} dir="ltr" o={y05} />
        </g>
      )}
      {not > 0 && (
        <g opacity={not}>
          <Place x={300} y={1150} s={0.6}><Lizard /></Place>
          <Label x={540} y={1170} text="≠" size={140} color={C.key} dir="ltr" o={xx} />
          <Place x={790} y={1150} s={0.55} r={-20}><InjPen label="أوزمبيك" /></Place>
          {xx > 0 && <Place x={540} y={1430} s={0.8 * xx}><XMark p={xx} /></Place>}
        </g>
      )}
      {door > 0 && (
        <g opacity={door}>
          <Place x={540} y={1110} s={1.05}><DoorOpen open={open} /></Place>
          <Place x={300} y={1400} s={0.45}><Lizard mood={1} /></Place>
          {sci > 0 && [0, 1].map((i) => (<Place key={i} x={700 + i * 170} y={1220 + bob(f, 4, 40, i * 9)} s={0.42 * sci}><Doc glasses={i === 0} mood={0.7} hair={i ? "#A0785A" : C.ink} /></Place>))}
        </g>
      )}
    </Svg>
  );
};
const s3: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s3l1") - 0.15, sfx: "whoosh", vol: 0.17 },
    { at: t.s("s3l2:ألف") - 0.25, sfx: "paper", vol: 0.14 },
    { at: t.s("s3l2:سم") - 0.15, sfx: "drip", vol: 0.13 },
    { at: t.s("s3l3:ساعات") - 0.25, sfx: "pop", vol: 0.13 },
    { at: t.s("s3l4:أول") - 0.25, sfx: "ding", vol: 0.12 },
    { at: t.s("s3l5:مش") - 0.2, sfx: "scribble", vol: 0.13 },
    { at: t.s("s3l5:فتحت") - 0.1, sfx: "door", vol: 0.12 },
  ],
  pulses: (t) => [t.f("s3l2:مونستر@end"), t.f("s3l5:السحلية@end")],
  tray: (t) => [{ id: "liz", arrive: t.f("s3l2@end") + 4, from: { x: 780, y: 1300, s: 1.4 }, icon: icon(<g transform="scale(0.14)"><Lizard /></g>) }],
};

// ============================================================ 4. Ozempic / Wegovy / Mounjaro
const S4: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const oz = inOut(f, F("s4l1") - 4, F("s4l1:بتفضل") + 2, 12, 8);
  const sema = pop(f, F("s4l1:سيماجلوتايد") - 4, 12);
  const copy = prog(f, F("s4l1:نسخة") - 2, 14);
  const wk = inOut(f, F("s4l1:بتفضل") - 4, F("s4l1:ومتسجل") + 2, 12, 8);
  const wkP = prog(f, F("s4l1:أسبوع") - 6, 16);
  const dia = inOut(f, F("s4l1:ومتسجل") - 4, F("s4l2") + 2, 12, 8);
  const two = inOut(f, F("s4l2") - 4, F("s4l3") + 2, 12, 8);
  const eq = pop(f, F("s4l2:نفس") - 2, 12);
  const dose = prog(f, F("s4l2:جرعة") - 4, 14);
  const ob = pop(f, F("s4l2:للسمنة") - 4, 12);
  const mj = inOut(f, F("s4l3") - 4, F("s4l3@end") + 30, 12, 8);
  const tz = pop(f, F("s4l3:مونجارو") + 4, 12);
  const dual = [pop(f, F("s4l3:هرمونين") - 4, 12), pop(f, F("s4l3:هرمونين") + 2, 12)];
  return (
    <Svg>
      {oz > 0 && (
        <g opacity={oz}>
          <Place x={540} y={900} s={1.0} r={-8}><InjPen label="أوزمبيك" /></Place>
          {sema > 0 && <Place x={540} y={1170} s={sema}><Chip text={SEMA} w={620} size={44} /></Place>}
          {copy > 0 && <Place x={540} y={1420} s={0.75 * copy}><Molecule color="#F0A23B" /></Place>}
          {copy > 0 && <Place x={760} y={1350} s={0.5 * copy} r={f * 2}><Sparkle fill="#FFF3CF" /></Place>}
        </g>
      )}
      {wk > 0 && (
        <g opacity={wk}>
          <Place x={540} y={1060} s={1.2}><WeekStrip p={wkP} mark={prog(f, F("s4l1:كامل"), 10)} /></Place>
          <Label x={540} y={1300} text="مرة في الأسبوع" size={56} o={prog(f, F("s4l1:كامل"), 10)} />
        </g>
      )}
      {dia > 0 && (
        <g opacity={dia}>
          <Place x={360} y={1100} s={0.9}><path d="M0 -150 C60 -60 120 0 120 60 C120 130 60 160 0 160 C-60 160 -120 130 -120 60 C-120 0 -60 -60 0 -150 Z" fill="#E86A5E" {...sk} /></Place>
          <Place x={720} y={1100} s={pop(f, F("s4l1:السكر") - 4, 12)}><Chip text="السكر من النوع 2" w={430} size={44} /></Place>
        </g>
      )}
      {two > 0 && (
        <g opacity={two}>
          <Place x={560} y={930} s={0.72}><InjPen label="أوزمبيك" /></Place>
          <Place x={560} y={1110} s={0.72}><InjPen label="ويجوفي" /></Place>
          <Label x={150} y={1060} text="=" size={150} color={C.key} dir="ltr" o={eq} />
          {eq > 0 && <Place x={540} y={780} s={0.8 * eq}><Chip text={SEMA} w={620} size={40} /></Place>}
          {/* dose bars: higher for the obesity product (no numbers, no doses) */}
          <g transform="translate(300 1400)"><rect x={-50} y={-140 * dose} width={100} height={140 * dose} rx={12} fill="#9DB4C9" {...sk} /><Label x={0} y={60} text="جرعة" size={34} o={dose} /></g>
          <g transform="translate(780 1400)"><rect x={-50} y={-240 * dose} width={100} height={240 * dose} rx={12} fill={C.key} {...sk} /><Label x={0} y={60} text="جرعة أعلى" size={34} o={dose} /></g>
          {ob > 0 && <Place x={540} y={1300} s={ob}><Chip text="للسمنة" w={220} size={40} fill={C.iconBg} /></Place>}
        </g>
      )}
      {mj > 0 && (
        <g opacity={mj}>
          <Place x={540} y={880} s={0.95} r={-8}><InjPen label="مونجارو" /></Place>
          {tz > 0 && <Place x={540} y={1130} s={tz}><Chip text={TIRZ} w={600} size={44} /></Place>}
          {dual[0] > 0 && <Place x={330} y={1420} s={0.6 * dual[0]}><Molecule label="GLP-1" /></Place>}
          {dual[1] > 0 && <Place x={760} y={1420} s={0.6 * dual[1]}><Molecule label="GIP" color="#9DC9E8" /></Place>}
          <Label x={540} y={1440} text="+" size={90} color={C.key} dir="ltr" o={dual[1]} />
        </g>
      )}
    </Svg>
  );
};
const s4: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s4l1") - 0.1, sfx: "whoosh", vol: 0.17 },
    { at: t.s("s4l1:سيماجلوتايد") - 0.25, sfx: "pop", vol: 0.13 },
    { at: t.s("s4l1:أسبوع") - 0.25, sfx: "tick", vol: 0.12 },
    { at: t.s("s4l2:نفس") - 0.2, sfx: "ding", vol: 0.12 },
    { at: t.s("s4l3:هرمونين") - 0.25, sfx: "pop", vol: 0.13 },
  ],
  pulses: (t) => [t.f("s4l2:بالظبط@end"), t.f("s4l3:هرمونين@end")],
};

// ============================================================ 5. Benefit beyond weight
const S5: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const hrt = inOut(f, F("s5l1") - 4, F("s5l2") + 2, 12, 8);
  const ppl = prog(f, F("s5l1:دراسة") - 4, 30);
  const count = Math.round(interpolate(f, [F("s5l1:سبعتاشر") - 8, F("s5l1:ألف@end")], [0, 17604], { ...clamp, easing: easeOut }));
  const fifth = inOut(f, F("s5l2") - 4, F("s5l3") + 2, 12, 8);
  const cut = prog(f, F("s5l2:الخمس") - 4, 14);
  const fund = inOut(f, F("s5l3") - 4, F("s5l3:والأرقام") + 2, 12, 8);
  const coin = pop(f, F("s5l3:ممولة") - 2, 12);
  const avg = inOut(f, F("s5l3:والأرقام") - 4, F("s5l3@end") + 30, 12, 8);
  return (
    <Svg>
      {hrt > 0 && (
        <g opacity={hrt}>
          <Place x={540} y={880} s={0.95}><Heart beat={Math.abs(Math.sin(f / 9))} /></Place>
          {Array.from({ length: 30 }).map((_, i) => {
            const p = Math.max(0, Math.min(1, ppl * 30 - i));
            return (<g key={i} transform={`translate(${170 + (i % 10) * 82} ${1170 + Math.floor(i / 10) * 92}) scale(${0.34 * pop(p * 10, 0, 10)})`}><Person /></g>);
          })}
          {count > 0 && <Label x={540} y={1490} text={count.toLocaleString("en-US")} size={70} color={C.key} dir="ltr" />}
        </g>
      )}
      {fifth > 0 && (
        <g opacity={fifth}>
          {[0, 1, 2, 3, 4].map((i) => {
            const x = 900 - i * 180; const gone = i === 4 ? cut : 0;
            return (
              <g key={i}>
                <Place x={x} y={1080} s={0.42 * pop(f, F("s5l2") - 4 + i * 3, 10)} o={1 - 0.75 * gone}><Heart mood={0} /></Place>
                {gone > 0 && <path d={`M${x - 70} 1010 L${x + 70} 1150`} stroke={C.key} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - gone} />}
              </g>
            );
          })}
          <Label x={540} y={1340} text="جلطات ووفيات القلب" size={46} o={prog(f, F("s5l2:الجلطات"), 10)} />
          <Label x={540} y={1460} text="−20%" size={72} color={C.key} o={cut} dir="ltr" />
          <Label x={540} y={1520} text="تقريباً" size={40} color={C.key} o={cut} />
        </g>
      )}
      {fund > 0 && (
        <g opacity={fund}>
          <Place x={540} y={1160} s={1.1}><Factory coin={coin} /></Place>
          <Label x={540} y={1460} text="ممولة من الشركة المنتجة" size={46} color={C.warn} o={coin} />
        </g>
      )}
      {avg > 0 && (
        <g opacity={avg}>
          <Place x={540} y={1100} s={1.15}><Spread p={prog(f, F("s5l3:والأرقام") - 2, 24)} /></Place>
          <Label x={540} y={1360} text="متوسط" size={50} color={C.key} />
          {pop(f, F("s5l3:وعد") - 4, 12) > 0 && <Place x={540} y={1490} s={pop(f, F("s5l3:وعد") - 4, 12)}><Chip text="مش وعد" w={280} size={48} fill="#F6D2CC" color={C.warn} /></Place>}
        </g>
      )}
    </Svg>
  );
};
const s5: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s5l1") - 0.1, sfx: "heartbeat", vol: 0.2 },
    { at: t.s("s5l1:سبعتاشر") - 0.3, sfx: "tick", vol: 0.12 },
    { at: t.s("s5l2:الخمس@end") + 0.05, sfx: "ding", vol: 0.13 },
    { at: t.s("s5l3:ممولة") - 0.25, sfx: "metal", vol: 0.12 },
    { at: t.s("s5l3:وعد") - 0.25, sfx: "pop", vol: 0.12 },
  ],
  pulses: (t) => [t.f("s5l2:الخمس@end"), t.f("s5l3:وعد@end")],
};

// ============================================================ 6. The price
const S6: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const tag = inOut(f, F("s6l1") - 4, F("s6l1:لما") + 4, 12, 8);
  const chart = inOut(f, F("s6l1:لما") - 2, F("s6l2") + 2, 12, 8);
  const draw = interpolate(f, [F("s6l1:لما"), F("s6l1:بيرجع@end")], [0, 1], { ...clamp, easing: easeInOut });
  const mark = prog(f, F("s6l1:تلتين") - 4, 12);
  const mus = inOut(f, F("s6l2") - 4, F("s6l3") + 2, 12, 8);
  const mDown = prog(f, F("s6l2:عضل") - 4, 14);
  const sym = inOut(f, F("s6l3") - 4, F("s6l4") + 2, 12, 8);
  const sy = [pop(f, F("s6l3:غثيان") - 4, 12), pop(f, F("s6l3:وإسهال") - 4, 12), pop(f, F("s6l3:البنكرياس") - 4, 12), pop(f, F("s6l3:المرارة") - 4, 12)];
  const no = inOut(f, F("s6l4") - 4, F("s6l4@end") + 30, 12, 8);
  const n = [pop(f, F("s6l4:للحوامل") - 4, 12), pop(f, F("s6l4:تاريخ") - 4, 12), pop(f, F("s6l4:سرطان") - 4, 12)];
  return (
    <Svg>
      {tag > 0 && <Place x={540} y={1100} s={2.2 * tag} r={-8}><PriceTag text="التمن" /></Place>}
      {chart > 0 && (
        <g opacity={chart}>
          <Place x={540} y={1130} s={1.15}><RegainChart p={draw + 0 * (f - F("s6l1"))} mark={mark} /></Place>
          <Label x={540} y={1490} text="الوزن" size={42} color={C.source} />
        </g>
      )}
      {mus > 0 && (
        <g opacity={mus}>
          <Place x={330} y={1060} s={0.95}><FatDrop /></Place>
          <Label x={330} y={1300} text="دهون" size={50} />
          <Place x={760} y={1060} s={0.85}><Muscle /></Place>
          <Label x={760} y={1300} text="عضل" size={50} color={C.key} o={mDown} />
          {[330, 760].map((x, i) => (<path key={i} d={`M${x} 1360 V1480 M${x - 30} 1450 L${x} 1480 L${x + 30} 1450`} fill="none" {...sk} strokeWidth={10} stroke={i ? C.key : C.ink} opacity={i ? mDown : 1} />))}
        </g>
      )}
      {sym > 0 && (
        <g opacity={sym}>
          <Place x={780} y={940} s={0.95 * sy[0]}><Queasy /></Place>
          <Label x={780} y={1110} text="غثيان وترجيع" size={38} o={sy[0]} />
          <Place x={300} y={940} s={0.9 * sy[1]}><Stomach /></Place>
          <Label x={300} y={1110} text="إسهال أو إمساك" size={38} o={sy[1]} />
          <Place x={780} y={1350} s={0.75 * sy[2]}><Pancreas /></Place>
          {sy[2] > 0 && <Place x={890} y={1270} s={0.5 * sy[2]}><Warn /></Place>}
          <Label x={780} y={1490} text="البنكرياس" size={38} o={sy[2]} />
          <Place x={300} y={1340} s={0.8 * sy[3]}><Gallbladder /></Place>
          {sy[3] > 0 && <Place x={400} y={1260} s={0.5 * sy[3]}><Warn /></Place>}
          <Label x={300} y={1490} text="المرارة" size={38} o={sy[3]} />
        </g>
      )}
      {no > 0 && (
        <g opacity={no}>
          <Place x={800} y={1000} s={0.9 * n[0]}><Pregnant /></Place>
          {n[0] > 0 && <Place x={890} y={1130} s={0.6 * n[0]}><XMark /></Place>}
          <Place x={280} y={1010} s={0.85 * n[1]}><Family /></Place>
          <Place x={540} y={1330} s={0.9 * n[2]}><Thyroid /></Place>
          {n[2] > 0 && <Place x={680} y={1240} s={0.55 * n[2]}><Warn /></Place>}
          <Label x={540} y={1500} text="الغدة الدرقية" size={42} o={n[2]} />
        </g>
      )}
    </Svg>
  );
};
const s6: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s6l1") - 0.1, sfx: "bump", vol: 0.15 },
    { at: t.s("s6l1:تلتين") - 0.25, sfx: "scribble", vol: 0.12 },
    { at: t.s("s6l2:عضل") - 0.25, sfx: "pop", vol: 0.12 },
    { at: t.s("s6l3:غثيان") - 0.25, sfx: "pop", vol: 0.12 },
    { at: t.s("s6l3:البنكرياس") - 0.25, sfx: "click", vol: 0.12 },
    { at: t.s("s6l4:للحوامل") - 0.25, sfx: "pop", vol: 0.12 },
    { at: t.s("s6l4:سرطان") - 0.25, sfx: "heartbeat", vol: 0.18 },
  ],
  pulses: (t) => [t.f("s6l1:تلتين@end"), t.f("s6l4:الدرقية@end")],
};

// ============================================================ 7. If the doctor prescribed it
const S7: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const doc = inOut(f, F("s7l1") - 4, F("s7l1:بروتين") + 2, 12, 8);
  const grid = inOut(f, F("s7l1:بروتين") - 4, F("s7l1@end") + 30, 12, 8);
  const it = [F("s7l1:بروتين"), F("s7l1:مقاومة"), F("s7l1:مغذي"), F("s7l1:كفاية"), F("s7l1:صغيرة")].map((a) => pop(f, a - 4, 12));
  const xs = [[860, 880], [540, 880], [220, 880], [700, 1250], [380, 1250]];
  const nodes = [<Protein key="p" />, <Dumbbell key="d" />, <ColorPlate key="c" />, <WaterGlass key="w" />, <SmallPlate key="s" />];
  const labels = ["بروتين", "تمرين مقاومة", "أكل مغذي", "مية كفاية", "وجبات صغيرة"];
  return (
    <Svg>
      {doc > 0 && (
        <g opacity={doc}>
          <Place x={380} y={1080} s={0.95}><Doc mood={0.8} /></Place>
          <g transform="translate(760 1100) scale(0.65)">
            <rect x={-200} y={-260} width={400} height={500} rx={26} fill={C.paper} {...sk} />
            <text x={-150} y={-150} fontFamily={FONT} fontWeight={700} fontSize={84} fill={C.ink} direction="ltr">Rx</text>
            <path d="M-120 -40 C-90 -60 -60 -20 -30 -40 S30 -60 60 -40 M-120 30 C-80 10 -50 50 -10 30" fill="none" {...sk} strokeWidth={5} stroke="#3C5E9C" />
          </g>
        </g>
      )}
      {grid > 0 && (
        <g opacity={grid}>
          {it.map((p, i) => p > 0 && (
            <g key={i}>
              <circle cx={xs[i][0]} cy={xs[i][1]} r={118 * p} fill={C.iconBg} {...sk} />
              <Place x={xs[i][0]} y={xs[i][1] - 6} s={0.5 * p}>{nodes[i]}</Place>
              <Label x={xs[i][0]} y={xs[i][1] + 168} text={labels[i]} size={38} o={p} />
            </g>
          ))}
        </g>
      )}
    </Svg>
  );
};
const s7: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s7l1") - 0.1, sfx: "paper", vol: 0.15 },
    { at: t.s("s7l1:بروتين") - 0.2, sfx: "pop", vol: 0.12 },
    { at: t.s("s7l1:مقاومة") - 0.2, sfx: "pop", vol: 0.12 },
    { at: t.s("s7l1:مغذي") - 0.2, sfx: "pop", vol: 0.12 },
    { at: t.s("s7l1:كفاية") - 0.2, sfx: "drip", vol: 0.12 },
    { at: t.s("s7l1:صغيرة") - 0.2, sfx: "pop", vol: 0.12 },
  ],
  pulses: () => [],
};

// ============================================================ 8. The Austria story + takeaway
const S8: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const where = inOut(f, F("s8l1:سنة") - 4, F("s8l2") + 2, 12, 8);
  const pens = inOut(f, F("s8l2") - 4, F("s8l2:السكر") + 2, 12, 8);
  const drop = inOut(f, F("s8l2:السكر") - 4, F("s8l2:ومستشفى") + 2, 12, 8);
  const dP = prog(f, F("s8l2:وقع") - 4, 18, easeIn);
  const shake = f > F("s8l2:وتشنجات") - 2 && f < F("s8l2:وتشنجات") + 24 ? Math.sin(f * 2.2) * 8 : 0;
  const hosp = inOut(f, F("s8l2:ومستشفى") - 4, F("s8l3") + 2, 12, 8);
  const fake = inOut(f, F("s8l3") - 4, F("s8l3@end") + 18, 12, 8);
  const stamp = prog(f, F("s8l3:مغشوشة") - 2, 10);
  const xray = prog(f, F("s8l3:جواها") - 2, 14);
  const rule = inOut(f, F("s8l4") - 4, F("s8l5") + 2, 12, 8);
  const r = [pop(f, F("s8l4:فروشتة") - 4, 12), pop(f, F("s8l4:وصيدلية") - 4, 12), pop(f, F("s8l4:وأي") - 4, 12)];
  const ok = [prog(f, F("s8l4:الدكتور"), 10), prog(f, F("s8l4:مرخصة"), 10)];
  const bad = prog(f, F("s8l4:متستخدموش") - 4, 12);
  const share = inOut(f, F("s8l5") - 4, F("s8l6") + 2, 12, 8);
  const send = prog(f, F("s8l5:ابعتله") - 2, 24, easeInOut);
  const chat = inOut(f, F("s8l6") - 4, F("s8l6@end") + 60, 12, 8);
  const b = [pop(f, F("s8l6:نتكلم") - 2, 12), pop(f, F("s8l6:حاجة") - 2, 12), pop(f, F("s8l6:الكومنتات") - 4, 12)];
  return (
    <Svg>
      {where > 0 && (
        <g opacity={where}>
          <Place x={330} y={1060} s={0.85 * pop(f, F("s8l1:ألفين") - 4, 12)}><Calendar year="2023" /></Place>
          <Place x={770} y={1080} s={0.95 * pop(f, F("s8l1:النمسا") - 4, 12)}><MapPin name="النمسا" /></Place>
        </g>
      )}
      {pens > 0 && (
        <g opacity={pens}>
          {[0, 1, 2].map((i) => (<Place key={i} x={540} y={900 + i * 230} s={0.85 * pop(f, F("s8l2") - 2 + i * 4, 10)} r={-6 + i * 4}><InjPen label="أوزمبيك" capOff={prog(f, F("s8l2:حقنوا"), 12)} /></Place>))}
        </g>
      )}
      {drop > 0 && (
        <g opacity={drop}>
          <Place x={540 + shake} y={1100} s={1.15}><SugarDrop p={dP} /></Place>
        </g>
      )}
      {hosp > 0 && <Place x={540} y={1150} s={1.3 * hosp}><Hospital /></Place>}
      {fake > 0 && (
        <g opacity={fake}>
          <Place x={540} y={1100} s={1.15} r={-6}><InjPen label="أوزمبيك" xray={xray} xrayText="إنسولين" /></Place>
          {stamp > 0 && <Place x={600} y={1380}><Stamp text="مغشوش" p={stamp} /></Place>}
        </g>
      )}
      {rule > 0 && (
        <g opacity={rule}>
          {r[0] > 0 && (
            <g transform={`translate(780 900) scale(${0.42 * r[0]})`}>
              <rect x={-200} y={-260} width={400} height={500} rx={26} fill={C.paper} {...sk} />
              <text x={-150} y={-150} fontFamily={FONT} fontWeight={700} fontSize={84} fill={C.ink} direction="ltr">Rx</text>
              <path d="M-120 -40 C-90 -60 -60 -20 -30 -40 S30 -60 60 -40 M-120 30 C-80 10 -50 50 -10 30" fill="none" {...sk} strokeWidth={5} stroke="#3C5E9C" />
              <g transform="translate(170 200) scale(1.6)"><OkMark p={ok[0]} /></g>
            </g>
          )}
          {r[1] > 0 && <Place x={320} y={950} s={0.62 * r[1]}><Pharmacy ok={ok[1]} /></Place>}
          {r[2] > 0 && (
            <g>
              <Place x={500} y={1360} s={0.7 * r[2]} r={-10}><InjPen tint="#C9BFAF" /></Place>
              <Place x={830} y={1250} s={0.8 * r[2]} r={10}><PriceTag text="؟" /></Place>
              {bad > 0 && <Place x={540} y={1360} s={1.2 * bad}><XMark p={bad} /></Place>}
            </g>
          )}
        </g>
      )}
      {share > 0 && (
        <g opacity={share}>
          <Place x={420} y={1120} s={1.05}><Phone send={send} /></Place>
          <Place x={800} y={1000} s={0.9 * prog(f, F("s8l5:ابعتله"), 12)}><Person fill="#F3C79A" /></Place>
        </g>
      )}
      {chat > 0 && (
        <g opacity={chat}>
          <Place x={360} y={860} s={0.9 * b[0]}><Bubble /></Place>
          <Place x={720} y={1000} s={0.8 * b[1]}><Bubble w={220} /></Place>
          <Place x={430} y={1150} s={0.95 * b[2]}><Bubble w={300} /></Place>
        </g>
      )}
    </Svg>
  );
};
const s8: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s8l1:ألفين") - 0.25, sfx: "paper", vol: 0.14 },
    { at: t.s("s8l2:حقنوا") - 0.2, sfx: "click", vol: 0.12 },
    { at: t.s("s8l2:وقع") - 0.15, sfx: "whoosh", vol: 0.14 },
    { at: t.s("s8l2:ومستشفى") - 0.2, sfx: "heartbeat", vol: 0.2 },
    { at: t.s("s8l3:مغشوشة") - 0.2, sfx: "bump", vol: 0.14 },
    { at: t.s("s8l3:إنسولين@end") + 0.05, sfx: "heartbeat", vol: 0.26, prio: true },
    { at: t.s("s8l4:الدكتور") - 0.1, sfx: "ding", vol: 0.11 },
    { at: t.s("s8l4:متستخدموش") - 0.25, sfx: "scribble", vol: 0.12 },
    { at: t.s("s8l5:ابعتله") - 0.2, sfx: "whoosh", vol: 0.13 },
    { at: t.s("s8l6:الكومنتات") - 0.25, sfx: "pop", vol: 0.13 },
  ],
  pulses: (t) => [t.f("s8l3:إنسولين@end"), t.f("s8l5:ده@end")],
  // music stops 1 s before «إنسولين» (owner's decision) and 1 s before the closing request
  silence: (t) => [[t.s("s8l3:إنسولين") - 1.0, t.s("s8l3:إنسولين@end") + 0.6], [t.s("s8l5") - 1.0, t.s("s8l5") - 0.1]],
};

export const SCENES_EP02: Record<number, SceneDef> = {
  1: { C: S1, ...s1 }, 2: { C: S2, ...s2 }, 3: { C: S3, ...s3 }, 4: { C: S4, ...s4 },
  5: { C: S5, ...s5 }, 6: { C: S6, ...s6 }, 7: { C: S7, ...s7 }, 8: { C: S8, ...s8 },
};

export const DISCLAIMER_EP02 = "شرح مبسط للتوعية، مش بديل لاستشارة الطبيب أو الصيدلي. الأدوية دي بوصفة طبية فقط. المصادر في الوصف.";
export { CheckIcon, CalendarIcon, Crowd, Capsule };
