// Ep03 (nasal sprays, recorded voice). Every beat is anchored to a spoken word of the timing JSON.
// Legal (scripts/03_nasal_v3.md): generic sprays/boxes only, the historical ad has no product name,
// «أوتريفين» is never written on screen, no scary brain / amoeba drawing.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CheckIcon, Place, QuestionIcon, Sparkle, Virus } from "../../assets";
import { Calendar, Doc } from "../../assets/more";
import { Bubble, Warn } from "../../assets/v9";
import { Chip, OkMark, Person, Pharmacy, Phone, Stopwatch, WeekStrip, XMark } from "../../assets/ep02";
import { Ahmed, CycleLoop, Kanaka, MysteryCard, NoseSection, NostrilAim, Pollen, Polyps, Septum, SinusFace, Spray, SterileBottle, Tap, Timeline, VintageAd } from "../../assets/ep03";
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
const SPRAYS: [string, string][] = [["#E4EEF3", "ملح"], ["#F2D79A", "كورتيزون"], ["#CFE3B8", "مضاد هيستامين"], ["#CFC6E6", "مضيّق أوعية"]];

// ============================================================ 1. Hook
const S1: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const ad = inOut(f, -10, F("s1l3") + 2, 10, 8);
  const adIn = interpolate(f, [0, 14], [0.9, 1], { ...clamp, easing: easeOut });
  const stamp = prog(f, F("s1l2:كوكايين") - 2, 10);
  const morning = inOut(f, F("s1l3") - 4, F("s1l4") + 2, 12, 8);
  const phoneX = prog(f, F("s1l3:الموبايل"), 10);
  const spr = pop(f, F("s1l3:بخاخ") - 4, 12);
  const one = inOut(f, F("s1l4") - 4, F("s1l5") + 2, 12, 8);
  const q = pop(f, F("s1l4:بخة") - 4, 12);
  const info = inOut(f, F("s1l5") - 4, F("s1l6") + 2, 12, 8);
  const qi = pop(f, F("s1l5:معلومة") - 4, 12);
  return (
    <Svg>
      {ad > 0 && <Place x={540} y={1150} s={1.1 * adIn} r={-3} o={ad}><VintageAd stamp={stamp} /></Place>}
      {morning > 0 && (
        <g opacity={morning}>
          <circle cx={840} cy={780} r={80} fill="#F7D774" {...sk} />
          <Place x={540} y={1150} s={1.15}><Ahmed mood={-0.1} stuffy={1} /></Place>
          <g transform="translate(260 900)"><rect x={-60} y={-110} width={120} height={220} rx={22} fill={C.ink} /><rect x={-48} y={-92} width={96} height={170} rx={10} fill={C.iconBg} /></g>
          {phoneX > 0 && <Place x={260} y={900} s={0.9 * phoneX}><XMark p={phoneX} /></Place>}
          {spr > 0 && <Place x={810} y={1080 + bob(f, 5, 40)} s={0.8 * spr} r={10}><Spray color="#CFC6E6" puff={prog(f, F("s1l3:الأنف"), 14)} /></Place>}
        </g>
      )}
      {one > 0 && (
        <g opacity={one}>
          <Place x={540} y={1100} s={1.4}><Spray color="#CFC6E6" /></Place>
          <Label x={540} y={1480} text="نوع واحد؟" size={60} />
          {q > 0 && <Place x={760} y={850} s={1.5 * q}><QuestionIcon /></Place>}
        </g>
      )}
      {info > 0 && qi > 0 && <Place x={540} y={1100} s={3 * qi} o={info}><QuestionIcon /></Place>}
    </Svg>
  );
};
const s1: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s1l1:مية") - 0.25, sfx: "paper", vol: 0.15 },
    { at: t.s("s1l2:صافي@end") + 0.05, sfx: "crack", vol: 0.13 },
    { at: t.s("s1l3:بخاخ") - 0.2, sfx: "spray", vol: 0.2 },
    { at: t.s("s1l5:معلومة") - 0.25, sfx: "pop", vol: 0.14 },
  ],
  pulses: (t) => [t.f("s1l2:صافي@end"), t.f("s1l7:المخ@end")],
  // music stops 1 s before «كوكايين» (the punch)
  silence: (t) => [[t.s("s1l2:كوكايين") - 1.0, t.s("s1l2:صافي@end") + 0.3]],
};

// ============================================================ 2. Inside the nose
const S2: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const nose = inOut(f, F("s2l1") - 4, F("s2l4@end") + 30, 12, 8);
  const swell = prog(f, F("s2l1:القرينات") - 4, 18);
  const red = prog(f, F("s2l2:أوعية") - 4, 14);
  const cyc = prog(f, F("s2l3:شيفتات") - 6, 10);
  const ph = (f - F("s2l3:شيفتات")) / 30;
  const l = cyc > 0 ? 0.5 + 0.45 * Math.sin(ph * 1.6) : 0.35 + 0.4 * swell, r = cyc > 0 ? 0.5 - 0.45 * Math.sin(ph * 1.6) : 0.35 + 0.4 * swell;
  const clock = pop(f, F("s2l4:ساعة") - 6, 12);
  return (
    <Svg>
      {nose > 0 && (
        <g opacity={nose}>
          <Place x={540} y={1120} s={1.15}><NoseSection l={l} r={r} /></Place>
          {red > 0 && <Label x={540} y={1500} text="أوعية دموية" size={50} color={C.warn} o={red * (1 - cyc)} />}
          {cyc > 0 && <Label x={540} y={1500} text="Nasal cycle" size={50} dir="ltr" color={C.key} o={cyc} />}
          {cyc > 0 && [[-1, l], [1, r]].map(([s, v], i) => (<Label key={i} x={540 + (s as number) * 200} y={760} text={(v as number) > 0.5 ? "شغالة" : "بترتاح"} size={40} color={(v as number) > 0.5 ? C.warn : "#3F8F4A"} o={cyc} />))}
          {clock > 0 && <Place x={890} y={760} s={0.5 * clock}><Stopwatch a={(f - F("s2l4:ساعة")) * 3} text="ساعات" /></Place>}
        </g>
      )}
    </Svg>
  );
};
const s2: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s2l1") - 0.1, sfx: "whoosh", vol: 0.18 },
    { at: t.s("s2l3:شيفتات") - 0.2, sfx: "pop", vol: 0.14 },
    { at: t.s("s2l4:ساعة") - 0.25, sfx: "tick", vol: 0.13 },
  ],
  pulses: (t) => [t.f("s2l3:شيفتات@end")],
};

// ============================================================ 3. Types of blockage (+ the 7th, closed)
const TYPES = [
  { key: "s3l2:البرد", n: <Virus key="v" />, label: "البرد" },
  { key: "s3l3:الحساسية", n: <Pollen key="p" />, label: "الحساسية" },
  { key: "s3l4:الجيوب", n: <SinusFace key="s" />, label: "الجيوب الأنفية" },
  { key: "s3l5:انحراف", n: <Septum key="d" />, label: "انحراف الحاجز" },
  { key: "s3l6:زوائد", n: <Polyps key="o" />, label: "زوائد لحمية" },
];
const S3: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const all = inOut(f, F("s3l1") - 4, F("s3l7@end") + 24, 12, 8);
  const intro = pop(f, F("s3l1:مش") - 4, 12) * (1 - prog(f, F("s3l2") - 6, 8, easeIn));
  const seventh = pop(f, F("s3l7:النوع") - 4, 14);
  const shake = f > F("s3l7:هيصدمك") - 2 && f < F("s3l7:هيصدمك") + 16 ? Math.sin(f * 2.4) * 6 : 0;
  const pos = (i: number) => [800 - (i % 2) * 520 + (i === 4 ? 260 : 0), 800 + Math.floor(i / 2) * 330];
  return (
    <Svg>
      {all > 0 && (
        <g opacity={all}>
          {intro > 0 && <Label x={540} y={1100} text="مش نوع واحد" size={84 * intro} color={C.key} />}
          {TYPES.map((ty, i) => {
            const p = pop(f, F(ty.key) - 4, 12); if (p <= 0) return null;
            const [x, y] = i < 4 ? pos(i) : [540, 1460];
            const hi = prog(f, F(ty.key) - 4, 8) * (1 - prog(f, F(TYPES[i + 1]?.key ?? "s3l7") - 4, 8));
            return (
              <g key={i} transform={`translate(${i === 4 ? 280 : x} ${i === 4 ? 1460 : y}) scale(${p * (1 + 0.06 * hi)})`}>
                <rect x={-200} y={-140} width={400} height={280} rx={30} fill={hi > 0.5 ? "#FFF3CF" : C.card} {...sk} />
                <Place x={0} y={-25} s={0.55}>{ty.n}</Place>
                <Label x={0} y={110} text={ty.label} size={38} />
              </g>
            );
          })}
          {seventh > 0 && <Place x={800 + shake} y={1460} s={0.95 * seventh}><MysteryCard /></Place>}
          {seventh > 0 && <Label x={800} y={1660} text="7" size={60} color={C.key} dir="ltr" o={seventh} />}
        </g>
      )}
    </Svg>
  );
};
const s3: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s3l2:البرد") - 0.2, sfx: "pop", vol: 0.13 },
    { at: t.s("s3l4:الجيوب") - 0.2, sfx: "pop", vol: 0.12 },
    { at: t.s("s3l6:زوائد") - 0.2, sfx: "pop", vol: 0.12 },
    { at: t.s("s3l7:النوع") - 0.25, sfx: "heartbeat", vol: 0.2 },
  ],
  pulses: (t) => [t.f("s3l7:هيصدمك@end")],
  tray: (t) => [{ id: "q7", arrive: t.f("s3l7@end") + 8, from: { x: 800, y: 1460, s: 1.6 }, icon: icon(<text x={0} y={14} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.key}>7؟</text>), leave: t.f("s5l1") - 16 }],
};

// ============================================================ 4. Spray types + how to aim
const S4: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const row = inOut(f, F("s4l1") - 4, F("s4l12") + 2, 12, 8);
  const appear = [pop(f, F("s4l1:أنواع") - 4, 12), pop(f, F("s4l1:أنواع"), 12), pop(f, F("s4l1:أنواع") + 4, 12), pop(f, F("s4l1:أنواع") + 8, 12)];
  const focus = f < F("s4l3") ? 0 : f < F("s4l6") ? 1 : f < F("s4l8") ? 2 : 3;
  const fOn = prog(f, F("s4l2") - 4, 10);
  const week = prog(f, F("s4l3:بانتظام") - 4, 18) * (1 - prog(f, F("s4l5"), 8, easeIn));
  const consult = pop(f, F("s4l7:باستشارة") - 4, 12) * (1 - prog(f, F("s4l8") - 4, 8, easeIn));
  const fast = pop(f, F("s4l11:دقايق") - 6, 12);
  const aim = inOut(f, F("s4l12") - 4, F("s4l14@end") + 30, 12, 8);
  const good = prog(f, F("s4l13:ودنك") - 4, 12), bad = prog(f, F("s4l13:نص") - 4, 12);
  const sniff = prog(f, F("s4l14:تشفطش") - 4, 12);
  return (
    <Svg>
      {row > 0 && (
        <g opacity={row}>
          {SPRAYS.map(([c, l], i) => {
            const isF = fOn > 0 && focus === i;
            const x = 870 - i * 220;
            return (
              <g key={i} opacity={fOn > 0 && !isF ? 0.4 : 1}>
                <Place x={x} y={1000 - (isF ? 40 : 0)} s={0.8 * appear[i] * (isF ? 1.12 : 1)}><Spray color={c} label={l} puff={isF && i === 3 ? prog(f, F("s4l11:دقايق"), 14) : 0} /></Place>
              </g>
            );
          })}
          {focus === 0 && fOn > 0 && <Label x={540} y={1370} text="بيغسل وبيرطب ✓" size={52} color="#3F8F4A" o={fOn} />}
          {week > 0 && <g opacity={week}><Place x={540} y={1360} s={1.0}><WeekStrip p={week} /></Place><Label x={540} y={1490} text="بانتظام" size={48} /></g>}
          {consult > 0 && <g opacity={consult}><Place x={540} y={1380} s={0.38}><Doc mood={0.7} /></Place><Label x={540} y={1300} text="باستشارة" size={48} color={C.key} /></g>}
          {fast > 0 && focus === 3 && <g opacity={fast}><Place x={330} y={1500} s={0.55}><Stopwatch a={(f - F("s4l11")) * 10} text="دقايق" /></Place><Place x={750} y={1500} s={0.55}><Stopwatch a={(f - F("s4l11")) * 1.5} text="ساعات" fill="#E7F2DD" /></Place></g>}
        </g>
      )}
      {aim > 0 && (
        <g opacity={aim}>
          <Place x={600} y={1000} s={1.1}><NostrilAim good={good} bad={bad} /></Place>
          {good > 0 && <Place x={220} y={860} s={0.8 * good}><OkMark p={good} /></Place>}
          {bad > 0 && <Place x={700} y={880} s={0.7 * bad}><XMark p={bad} /></Place>}
          {sniff > 0 && <Label x={820} y={1380} text="شمّة خفيفة" size={50} color={C.key} o={sniff} />}
        </g>
      )}
    </Svg>
  );
};
const s4: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s4l1:أنواع") - 0.25, sfx: "pop", vol: 0.14 },
    { at: t.s("s4l2") - 0.1, sfx: "spray", vol: 0.16 },
    { at: t.s("s4l8") - 0.1, sfx: "spray", vol: 0.16 },
    { at: t.s("s4l11:دقايق") - 0.25, sfx: "tick", vol: 0.12 },
    { at: t.s("s4l13:ودنك") - 0.2, sfx: "ding", vol: 0.12 },
    { at: t.s("s4l13:نص") - 0.2, sfx: "scribble", vol: 0.12 },
  ],
  pulses: (t) => [t.f("s4l7:باستشارة@end")],
};

// ============================================================ 5. The 7th: rebound congestion (Ahmed)
const S5: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const card = inOut(f, F("s5l1") - 6, F("s5l2") + 2, 12, 8);
  const open = prog(f, F("s5l1:السابع") - 4, 16);
  const story = inOut(f, F("s5l2") - 4, F("s5l5") + 2, 12, 8);
  const well = prog(f, F("s5l3:خف") - 2, 12);
  const still = pop(f, F("s5l4:لسه") - 4, 12);
  const loop = inOut(f, F("s5l5") - 4, F("s5l8") + 2, 12, 8);
  const lit = f < F("s5l6") ? 2 : f < F("s5l7") ? 3 : 4;
  const turn = Math.max(0, (f - F("s5l7")) / 50);
  const name = inOut(f, F("s5l8") - 4, F("s5l10") + 2, 12, 8);
  const days = prog(f, F("s5l9:خمس") - 4, 16);
  const notAdd = inOut(f, F("s5l10") - 4, F("s5l10@end") + 30, 12, 8);
  const xAdd = prog(f, F("s5l10:إدمان"), 10);
  return (
    <Svg>
      {card > 0 && <Place x={540} y={1100} s={1.4} o={card}><MysteryCard open={open} text="الاحتقان الارتدادي" sub="Rhinitis medicamentosa" /></Place>}
      {story > 0 && (
        <g opacity={story}>
          <Place x={420} y={1150} s={1.1}><Ahmed spray mood={0.4 - 0.6 * still} stuffy={1 - well + still} /></Place>
          <Place x={840} y={820} s={0.6}><Calendar year={well > 0.5 ? "+7" : "1"} /></Place>
          <Label x={840} y={960} text={well > 0.5 ? "أسبوع" : "برد"} size={40} />
          {well > 0 && <Place x={840} y={1050} s={0.5 * well}><CheckIcon /></Place>}
          {still > 0 && <Place x={760} y={1250 + bob(f, 4, 30)} s={0.55 * still} r={15}><Spray color="#CFC6E6" puff={(f % 30) / 30} /></Place>}
        </g>
      )}
      {loop > 0 && <Place x={540} y={1150} s={1.15} o={loop}><CycleLoop p={turn} lit={lit} /></Place>}
      {name > 0 && (
        <g opacity={name}>
          <Place x={540} y={980} s={1.25}><MysteryCard open={1} text="الاحتقان الارتدادي" sub="Rhinitis medicamentosa" /></Place>
          {days > 0 && <g opacity={days}><Place x={540} y={1400} s={1.05}><WeekStrip p={1} /></Place><Label x={540} y={1520} text="من 5 لـ 7 أيام" size={56} color={C.warn} /></g>}
        </g>
      )}
      {notAdd > 0 && (
        <g opacity={notAdd}>
          <Place x={540} y={1050} s={1.0}><Chip text="إدمان" w={300} size={70} fill="#F6D2CC" color={C.warn} /></Place>
          {xAdd > 0 && <Place x={540} y={1050} s={1.2 * xAdd}><XMark p={xAdd} /></Place>}
          <Label x={540} y={1330} text="المناخير بس بتتعود" size={56} color={C.key} o={prog(f, F("s5l10:المناخير") - 2, 10)} />
        </g>
      )}
    </Svg>
  );
};
const s5: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s5l1:السابع") - 0.2, sfx: "paper", vol: 0.15 },
    { at: t.s("s5l4:لسه") - 0.2, sfx: "spray", vol: 0.18 },
    { at: t.s("s5l7:دايرة") - 0.25, sfx: "whoosh", vol: 0.13 },
    { at: t.s("s5l9:خمس") - 0.25, sfx: "tick", vol: 0.12 },
    { at: t.s("s5l10:إدمان") - 0.2, sfx: "scribble", vol: 0.12 },
  ],
  pulses: (t) => [t.f("s5l8:الارتدادي@end"), t.f("s5l9:أيام@end")],
};

// ============================================================ 6. The fix, the promised mistake, the takeaway
const S6: React.FC<{ t: T }> = ({ t }) => {
  const f = useCurrentFrame(); const F = (a: string) => t.f(a);
  const fix = inOut(f, F("s6l1") - 4, F("s6l5") - 2, 12, 8);
  const tl = interpolate(f, [F("s6l2"), F("s6l3")], [0.15, 1], { ...clamp, easing: easeInOut });
  const okFail = pop(f, F("s6l3:ومش") - 2, 12);
  const doc = pop(f, F("s6l4:والدكتور") - 4, 12);
  const tap = inOut(f, F("s6l5:غسيل") - 4, F("s6l8") + 2, 12, 8);
  const tapX = prog(f, F("s6l5:الحنفية") - 2, 12);
  const fda = pop(f, F("s6l6:الإف") - 4, 12);
  const rare = pop(f, F("s6l7:نادرة") - 4, 12);
  const safe = inOut(f, F("s6l8") - 4, F("s6l9") + 2, 12, 8);
  const sOk = prog(f, F("s6l8:معقمة") - 2, 12), kOk = prog(f, F("s6l8:مغلية") - 2, 12);
  const rule = inOut(f, F("s6l9") - 4, F("s6l10") + 2, 12, 8);
  const few = prog(f, F("s6l9:كام") - 4, 14);
  const warn = inOut(f, F("s6l10") - 4, F("s6l12") + 2, 12, 8);
  const w = [pop(f, F("s6l10:أسبوعين") - 4, 12), pop(f, F("s6l10:نزيف") - 4, 12), pop(f, F("s6l10:ألم") - 4, 12)];
  const docB = pop(f, F("s6l11:الطبيب") - 4, 12);
  const kids = inOut(f, F("s6l12") - 4, F("s6l13") + 2, 12, 8);
  const share = inOut(f, F("s6l13") - 4, F("s6l13@end") + 60, 12, 8);
  const send = prog(f, F("s6l13:ابعتله") - 2, 24, easeInOut);
  return (
    <Svg>
      {fix > 0 && (
        <g opacity={fix}>
          <Place x={540} y={980} s={1.0}><Timeline p={tl} /></Place>
          {okFail > 0 && <Place x={540} y={1200} s={okFail}><Chip text="مش فشل ✓" w={340} size={52} fill="#E7F2DD" color="#3F8F4A" /></Place>}
          {doc > 0 && <g><Place x={400} y={1450} s={0.42 * doc}><Doc mood={0.8} /></Place><Place x={680} y={1460} s={0.55 * doc} r={8}><Spray color="#F2D79A" label="كورتيزون" /></Place></g>}
        </g>
      )}
      {tap > 0 && (
        <g opacity={tap}>
          <Place x={540} y={920} s={1.3}><Tap /></Place>
          {tapX > 0 && <Place x={760} y={820} s={0.9 * tapX}><XMark p={tapX} /></Place>}
          {fda > 0 && <Place x={540} y={1240} s={fda}><Chip text="FDA" w={200} size={56} dir="ltr" /></Place>}
          {rare > 0 && <Place x={540} y={1420} s={rare}><Chip text="نادر جداً" w={300} size={52} fill="#FFF3CF" /></Place>}
        </g>
      )}
      {safe > 0 && (
        <g opacity={safe}>
          <Place x={330} y={1080} s={1.0}><SterileBottle /></Place>
          {sOk > 0 && <Place x={420} y={880} s={0.6 * sOk}><OkMark p={sOk} /></Place>}
          <Place x={760} y={1110} s={kOk > 0 ? 1.0 : 0.001}><Kanaka f={f} /></Place>
          {kOk > 0 && <Place x={860} y={900} s={0.6 * kOk}><OkMark p={kOk} /></Place>}
          <Label x={760} y={1330} text="مغلية ومبردة" size={42} o={kOk} />
        </g>
      )}
      {rule > 0 && (
        <g opacity={rule}>
          <Place x={330} y={1100} s={0.9}><Spray color="#CFC6E6" label="مضيّق أوعية" /></Place>
          <Place x={760} y={1060} s={0.9}><WeekStrip p={few} mark={0} /></Place>
          <Label x={760} y={1230} text="كام يوم بس" size={54} color={C.key} o={few} />
        </g>
      )}
      {warn > 0 && (
        <g opacity={warn}>
          <Place x={270} y={920} s={0.6 * w[0]}><Calendar year="+14" /></Place>
          <Label x={270} y={1100} text="أكتر من أسبوعين" size={36} o={w[0]} />
          <Place x={540} y={920} s={w[1]}><path d="M0 -70 C30 -25 50 5 50 30 C50 60 25 75 0 75 C-25 75 -50 60 -50 30 C-50 5 -30 -25 0 -70 Z" fill={C.warn} {...sk} /></Place>
          <Label x={540} y={1100} text="نزيف" size={36} o={w[1]} />
          <Place x={810} y={920} s={0.55 * w[2]}><SinusFace /></Place>
          <Label x={810} y={1100} text="ألم في الوش" size={36} o={w[2]} />
          {docB > 0 && <Place x={540} y={1330} s={0.45 * docB}><Doc mood={0.7} /></Place>}
        </g>
      )}
      {kids > 0 && (
        <g opacity={kids}>
          <Place x={360} y={1150} s={0.9}><Person fill="#F3C79A" /></Place>
          <Place x={720} y={1080} s={0.62}><Pharmacy ok={prog(f, F("s6l12:الصيدلي"), 10)} /></Place>
        </g>
      )}
      {share > 0 && (
        <g opacity={share}>
          <Place x={420} y={940} s={0.9}><Phone send={send} /></Place>
          <Place x={800} y={860} s={0.6 * prog(f, F("s6l13:ابعتله"), 12)}><Ahmed mood={0.6} /></Place>
        </g>
      )}
    </Svg>
  );
};
const s6: Omit<SceneDef, "C"> = {
  cues: (t) => [
    { at: t.s("s6l3:ومش") - 0.2, sfx: "ding", vol: 0.12 },
    { at: t.s("s6l5:الحنفية") - 0.2, sfx: "drip", vol: 0.14 },
    { at: t.s("s6l7:للمخ@end") + 0.05, sfx: "heartbeat", vol: 0.24, prio: true },
    { at: t.s("s6l8:معقمة") - 0.2, sfx: "pop", vol: 0.12 },
    { at: t.s("s6l10:أسبوعين") - 0.2, sfx: "pop", vol: 0.12 },
    { at: t.s("s6l13:ابعتله") - 0.2, sfx: "whoosh", vol: 0.13 },
  ],
  pulses: (t) => [t.f("s6l7:للمخ@end"), t.f("s6l13:ده@end")],
  // music stops 1 s before «للمخ» and 1 s before the closing request
  silence: (t) => [[t.s("s6l7:للمخ") - 1.0, t.s("s6l7:للمخ@end") + 0.6], [t.s("s6l13") - 1.0, t.s("s6l13") - 0.1]],
};

export const SCENES_EP03: Record<number, SceneDef> = {
  1: { C: S1, ...s1 }, 2: { C: S2, ...s2 }, 3: { C: S3, ...s3 }, 4: { C: S4, ...s4 }, 5: { C: S5, ...s5 }, 6: { C: S6, ...s6 },
};
export const DISCLAIMER_EP03 = "شرح مبسط للتوعية، مش بديل لاستشارة الطبيب أو الصيدلي. المصادر في الوصف.";
export { Sparkle, Warn, Bubble };
