// Ep05 (sleep, recorded voice). Each scene = a list of BEATS; a beat appears at the first spoken word that matches its anchor
// (searched in order, after the previous beat) and stays until the next beat. No picture of a real person, no brands, no logos.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Place, Clock, Sparkle, QuestionIcon, CheckIcon, SickPerson } from "../../assets";
import { Calendar, Moon } from "../../assets/more";
import { Baby, Warn, StopHand, Globe, Bars } from "../../assets/v9";
import { Brain, Chip, Gauge, Hospital, OkMark, XMark, Person, Pharmacy } from "../../assets/ep02";
import { Tablet, Cox, BrainSpine, Drop, Flash, Thermo } from "../../assets/ep04";
import { DoctorM, DoctorF, PharmacistM, PatientM, PatientF, MedTablet, MedCapsule, MedSyrup, MedBlister } from "../../assets/characters";
import { sk } from "../../components/Frame";
import { bob, clamp, easeIn, inOut, pop, prog } from "../../lib/anim";
import { FPS, norm, type T } from "../../lib/timing";
import type { Cue } from "../../lib/sfx";
import { C, FONT } from "../../theme";

export { Cup, Phone, Bed };
export type SceneDef = { C: React.FC<{ t: T }>; cues: (t: T) => Cue[]; pulses: (t: T) => number[] };
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{children}</svg>
);
const Label: React.FC<{ x: number; y: number; text: string; size?: number; color?: string; o?: number; dir?: "rtl" | "ltr" }> = ({ x, y, text, size = 46, color = C.ink, o = 1, dir = "rtl" }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill={color} opacity={o} direction={dir} unicodeBidi={dir === "ltr" ? "bidi-override" : undefined}>{text}</text>
);
const ChipAt: React.FC<{ x?: number; y?: number; text: string; w?: number; size?: number; p?: number; dir?: "rtl" | "ltr"; hot?: boolean }> = ({ x = 540, y = 1400, text, w = 560, size = 52, p = 1, dir = "rtl", hot }) => (
  <Place x={x} y={y} s={p}><Chip text={text} w={w} size={size} dir={dir} fill={hot ? "#FFF3CF" : C.card} color={hot ? C.key : C.ink} /></Place>
);
// ---- small local icons (generic: no brand)
const Cup: React.FC<{ steam?: number }> = ({ steam = 1 }) => (
  <g>
    <path d="M-80 -60 H80 V40 C80 110 40 140 0 140 C-40 140 -80 110 -80 40 Z" fill="#F4E4C8" {...sk} />
    <path d="M80 -30 C140 -30 140 70 78 70" fill="none" {...sk} />
    <path d="M-80 -20 H80 V10 H-80 Z" fill="#B98B5E" opacity={0.55} />
    {[-35, 0, 35].map((x, i) => (<path key={i} d={`M${x} -90 q-14 -30 0 -60 q14 -30 0 -60`} fill="none" {...sk} strokeWidth={5} opacity={0.5 * steam} transform={`translate(0 ${-6 * Math.sin(i)})`} />))}
  </g>
);
const Phone: React.FC<{ glow?: number }> = ({ glow = 1 }) => (
  <g>
    {glow > 0 && [90, 140, 190].map((r, i) => (<circle key={i} r={r + 120} fill="#BFE3F7" opacity={0.18 * glow} />))}
    <rect x={-85} y={-150} width={170} height={300} rx={28} fill={C.white} {...sk} />
    <rect x={-66} y={-120} width={132} height={220} rx={10} fill="#BFE3F7" stroke={C.ink} strokeWidth={4} />
    <circle cx={0} cy={125} r={9} fill="none" {...sk} strokeWidth={4} />
  </g>
);
const Bed: React.FC<{ eyes?: boolean }> = () => (
  <g>
    <rect x={-300} y={20} width={600} height={90} rx={18} fill="#CFE0EE" {...sk} />
    <rect x={-300} y={-60} width={90} height={190} rx={14} fill="#C9B59D" {...sk} />
    <rect x={-250} y={-40} width={140} height={60} rx={28} fill={C.white} {...sk} />
    <rect x={-300} y={110} width={30} height={50} fill="#C9B59D" {...sk} /><rect x={270} y={110} width={30} height={50} fill="#C9B59D" {...sk} />
  </g>
);
const Legs: React.FC<{ f: number }> = ({ f }) => (
  <g>
    {[-60, 60].map((x, i) => (<g key={i} transform={`translate(${x} 0) rotate(${8 * Math.sin(f / 4 + i * 2)} 0 -140)`}><rect x={-34} y={-140} width={68} height={260} rx={34} fill={C.skin} {...sk} /><rect x={-42} y={105} width={84} height={44} rx={20} fill={C.white} {...sk} /></g>))}
    {[-150, 150].map((x, i) => (<path key={i} d={`M${x} -40 q${i ? 30 : -30} 30 0 60 q${i ? -30 : 30} 30 0 60`} fill="none" {...sk} strokeWidth={6} opacity={0.6} />))}
  </g>
);
const Sun: React.FC<{ r?: number }> = ({ r = 0 }) => (
  <g>{Array.from({ length: 12 }).map((_, i) => (<path key={i} d="M0 -110 V-150" {...sk} strokeWidth={8} transform={`rotate(${i * 30 + r})`} />))}<circle r={80} fill="#F7C548" {...sk} /></g>
);
const Toggle: React.FC<{ on: number }> = ({ on }) => (
  <g><rect x={-90} y={-45} width={180} height={90} rx={45} fill={on > 0.5 ? "#9CC48A" : "#C9C3B8"} {...sk} /><circle cx={on > 0.5 ? 45 : -45} cy={0} r={34} fill={C.white} {...sk} /></g>
);

// ---- beats machinery
type Beat = { a: string; sfx?: string; r: (p: number, f: number, a: number, b: number) => React.ReactNode };
const wordsOf = new WeakMap<object, { n: string; s: number }[]>();
const allWords = (t: T) => {
  let w = wordsOf.get(t.timing);
  if (!w) { w = t.timing.lines.flatMap((l) => l.words.map((x) => ({ n: norm(x.w), s: x.start }))); wordsOf.set(t.timing, w); }
  return w;
};
/** anchors in seconds for a scene's beats: first word containing the anchor, searched in order starting at the scene start */
const anchors = (t: T, scene: number, beats: Beat[]) => {
  const sc = t.timing.scenes.find((s) => s.id === scene); const out: number[] = []; let from = sc ? Math.max(0, sc.start) : 0;
  const w = allWords(t);
  const strict0 = !!(t.timing as unknown as { strict?: boolean }).strict; const start0 = from;
  beats.forEach((b, i) => {
    const k = norm(b.a);
    if (strict0) from = start0;
    const hit = k === "" ? undefined : w.find((x) => x.s >= from - 0.02 && x.n.includes(k));
    const strict = !!(t.timing as unknown as { strict?: boolean }).strict;
    const s = k === "" ? from : hit ? hit.s : strict ? 1e6 : from + (i ? 1.2 : 0);
    out.push(s); if (s < 1e5 && !strict0) from = s + 0.05;
  });
  return out;
};
const mk = (scene: number, beats: Beat[]): SceneDef => ({
  C: ({ t }) => {
    const f = useCurrentFrame(); const an = anchors(t, scene, beats); const sc = t.timing.scenes.find((s) => s.id === scene)!;
    const end = Math.round(sc.end * FPS);
    return (
      <Svg>
        {beats.map((b, i) => {
          if (an[i] > 1e5) return null;
          const a = Math.round(an[i] * FPS); const later = an.filter((x) => x > an[i] + 0.04 && x < 1e5); const e = later.length ? Math.round(Math.min(...later) * FPS) : end;
          const o = inOut(f, a - 4, e + 4, 10, 8);
          return o > 0.01 ? (<g key={i} opacity={o}>{b.r(pop(f, a, 12), f, a, e)}</g>) : null;
        })}
      </Svg>
    );
  },
  cues: (t) => { const an = anchors(t, scene, beats); return beats.flatMap((b, i) => (b.sfx ? [{ at: an[i] - 0.12, sfx: b.sfx, vol: 0.13 }] : [])); },
  pulses: (t) => { const sc = t.timing.scenes.find((s) => s.id === scene); return sc ? [Math.round(sc.end * FPS) - 2] : []; },
});

// ============================================================ 1. Hook
const S1 = mk(1, [
  { a: "", sfx: "tick", r: (p, f) => (<><Place x={540} y={1180} s={1.35}><PatientM /></Place><Place x={830} y={900} s={0.9 * p}><Clock a={f * 14} /></Place></>) },
  { a: "تقفل", r: (p, f) => (<><Place x={540} y={1170} s={1.35}><PatientM /></Place><Place x={820} y={900} s={0.9}><Clock a={f * 18} /></Place><Place x={280} y={900} s={p}><Moon /></Place></>) },
  { a: "مين", sfx: "pop", r: (p, f) => (<><Place x={540} y={1180} s={1.3}><PatientM /></Place><Place x={820} y={880} s={1.6 * p} r={8}><QuestionIcon /></Place><Label x={540} y={1450} text="مين سرق نومك؟" size={64} color={C.key} o={p} /></>) },
  { a: "كوباية", sfx: "pop", r: (p, f) => (<><Place x={300} y={1000} s={0.9 * p}><Cup /></Place><Place x={780} y={1000} s={0.9 * pop(f, f - 6 + 0, 12)}><Cup steam={0.6} /></Place></>) },
  { a: "الموبايل", sfx: "pop", r: (p) => (<Place x={540} y={1050} s={1.2 * p}><Phone /></Place>) },
  { a: "دماغك", sfx: "swell", r: (p, f) => (<><Place x={540} y={1050} s={1.7 * p}><Brain /></Place>{[0, 1, 2].map((i) => (<Place key={i} x={300 + i * 240} y={780 + (i % 2) * 60 - bob(f, 6, 50, i * 9)} s={0.7 * p}><Sparkle size={1.2} fill="#F7C548" /></Place>))}</>) },
  { a: "المشكلة", r: (p) => (<><Place x={540} y={1060} s={1.3}><DoctorM /></Place><Place x={820} y={820} s={p}><Tablet /></Place><Place x={820} y={820} s={1.8 * p} o={0.9}><XMark p={p} /></Place></>) },
  { a: "تعال", sfx: "shimmer", r: (p) => (<><Place x={540} y={1060} s={1.2}><DoctorM /></Place><Place x={280} y={820} s={p}><Clock a={30} /></Place><Place x={800} y={820} s={p}><Brain /></Place></>) },
]);
// ============================================================ 2. Two clocks
const S2 = mk(2, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1010} s={1.5 * p}><Brain /></Place><Place x={240} y={1290} s={0.7}><Clock a={0} /></Place><Place x={840} y={1290} s={0.7}><Gauge v={0.5} label="" /></Place></>) },
  { a: "sleep", sfx: "pop", r: (p, f, a, b) => (<><Place x={540} y={980} s={1.3}><Gauge v={0.1 + 0.8 * prog(f, a, Math.max(30, b - a))} label="" /></Place><ChipAt text="Sleep Pressure" dir="ltr" hot p={p} /></>) },
  { a: "adenosine", sfx: "bubbles", r: (p, f, a) => (<><Place x={540} y={1000} s={1.2}><Brain /></Place>{Array.from({ length: 7 }).map((_, i) => (<Place key={i} x={220 + i * 105} y={1320 - 60 * Math.sin(i * 2) - bob(f, 8, 40, i * 7)} s={0.55 * pop(f, a + i * 5, 12)}><Drop color="#9DC9E8" /></Place>))}<ChipAt text="Adenosine" dir="ltr" hot p={p} /></>) },
  { a: "التاني", sfx: "tick", r: (p, f) => (<><Place x={540} y={990} s={1.6 * p}><Clock a={f * 5} /></Place><ChipAt text="الساعة البيولوجية" p={p} /></>) },
  { a: "الظلام", sfx: "shimmer", r: (p) => (<><Place x={380} y={980} s={1.5 * p}><Moon /></Place><Place x={740} y={1040} s={1.1 * p}><MedTablet /></Place><ChipAt text="Melatonin" dir="ltr" hot p={p} /></>) },
  { a: "زرار", sfx: "bump", r: (p, f) => (<><Place x={540} y={1000} s={1.2}><Toggle on={0.9} /></Place><Place x={540} y={1000} s={2.4 * p} o={0.95}><XMark p={p} /></Place><ChipAt text="مش زرار إطفاء" p={p} /></>) },
  { a: "القهوة", sfx: "pop", r: (p, f) => (<><Place x={310} y={1000} s={0.95 * p} r={-8}><Cup /></Place>{Array.from({ length: 4 }).map((_, i) => (<Place key={i} x={620 + 40 * i} y={860 + i * 110} s={0.5}><Drop color="#9DC9E8" /></Place>))}<Place x={800} y={1000} s={1.3}><Cox blocked={prog(f, f, 1)} /></Place></>) },
  { a: "الكافين", sfx: "metal", r: (p, f, a) => (<><Place x={300} y={1000} s={0.95}><Cup /></Place><path d="M420 1000 H600" {...sk} strokeWidth={10} strokeDasharray="3 20" /><Place x={780} y={1000} s={1.2}><Cox blocked={prog(f, a, 12)} /></Place><ChipAt text="بيقفل مستقبلات Adenosine" size={40} w={760} p={p} /></>) },
  { a: "مش", sfx: "ding", r: (p, f) => (<><Place x={540} y={980} s={1.3}><Gauge v={0.9} label="" /></Place><Place x={820} y={820} s={0.7}><Cup /></Place><ChipAt text="الضغط لسه موجود" p={p} /></>) },
]);
// ============================================================ 3. Three things
const S3 = mk(3, [
  { a: "", sfx: "pop", r: (p, f) => (<><Place x={540} y={1000} s={1.3 * p}><Cup /></Place><Place x={820} y={820} s={0.8} o={0.9}><Clock a={f * 2} /></Place><ChipAt text="1) الكافيين" p={p} /></>) },
  { a: "تاني", sfx: "pop", r: (p, f) => (<><Place x={540} y={1010} s={1.3 * p}><Phone /></Place>{[0, 1, 2, 3].map((i) => (<path key={i} d={`M${240 + i * 200} 780 l40 80`} {...sk} strokeWidth={7} stroke="#F7C548" opacity={0.8} />))}<ChipAt text="2) الضوء والموبايل" p={p} /></>) },
  { a: "المحتوى", r: (p) => (<><Place x={540} y={1010} s={1.2}><Phone /></Place><Place x={540} y={1010} s={0.9 * p}><Flash s={1.5} /></Place><ChipAt text="2) الضوء والموبايل" p={1} /></>) },
  { a: "ثالث", sfx: "whoosh", r: (p, f) => (<><Place x={540} y={1010} s={1.6 * p}><Brain /></Place><Place x={400} y={820} s={p}><Flash s={1.2} /></Place><Place x={690} y={860} s={0.9 * p}><Flash s={1} /></Place><ChipAt text="3) التوتر" p={p} /></>) },
  { a: "جسمك", r: (p) => (<><Place x={540} y={1170} s={1.1}><Bed /></Place><Place x={430} y={1010} s={0.9}><SickPerson shiver={0} blink={false} /></Place><Place x={800} y={880} s={1.2 * p}><Sparkle fill="#F7C548" /></Place></>) },
  { a: "والمفارقة", sfx: "bump", r: (p, f) => (<><Place x={540} y={980} s={1.5 * p}><Clock a={f * 22} /></Place><ChipAt text="كل ما تجبر نفسك… النوم أصعب" size={42} w={820} p={p} /></>) },
]);
// ============================================================ 4. Not every bad night is insomnia
const S4 = mk(4, [
  { a: "", r: (p) => (<><Place x={540} y={1010} s={1.1 * p}><DoctorF /></Place><Place x={800} y={800} s={1.6 * p}><QuestionIcon /></Place></>) },
  { a: "أولًا", sfx: "pop", r: (p, f) => (<><Place x={300} y={1000} s={1.3 * p}><Clock a={f * 3} /></Place><Place x={770} y={970} s={1.3}><Moon /></Place><ChipAt text="الساعة البيولوجية متأخرة" p={p} /></>) },
  { a: "المشكلة", r: (p) => (<><Place x={300} y={1000} s={1.1}><Clock a={200} /></Place><Place x={770} y={1000} s={0.8}><Calendar year="9-5" /></Place><ChipAt text="مش متوافق مع يومك" p={p} /></>) },
  { a: "ثانيًا", sfx: "pop", r: (p, f) => (<><Place x={540} y={1090} s={0.9}><Bed /></Place><Place x={540} y={960} s={1.2 * p}><PatientM /></Place><ChipAt text="الأرق المزمن" p={p} hot /></>) },
  { a: "ولما", r: (p, f, a) => (<><Place x={300} y={1000} s={1.1 * pop(f, a, 12)}><Calendar year="3×" /></Place><Place x={780} y={1000} s={1.1 * pop(f, a + 12, 12)}><Calendar year="3m" /></Place><ChipAt text="3 مرات أسبوعيًا • 3 شهور أو أكتر" size={40} w={860} p={p} /></>) },
  { a: "ثالثًا", sfx: "bump", r: (p, f) => (<><Place x={540} y={1090} s={0.9}><Bed /></Place><Place x={540} y={960} s={1.2}><PatientF /></Place><Label x={760} y={850 - bob(f, 8, 50)} text="Z z z" size={70} color={C.source} dir="ltr" /><Place x={800} y={1000} s={0.9 * p}><Warn /></Place><ChipAt text="انقطاع النفس أثناء النوم" p={p} /></>) },
  { a: "رابعًا", sfx: "pop", r: (p, f) => (<><Place x={540} y={880} s={1.1 * p}><Legs f={f} /></Place><ChipAt text="تململ الساقين" p={p} /></>) },
  { a: "قبل", r: (p) => (<><Place x={540} y={1020} s={1.2}><PatientM /></Place><Place x={800} y={800} s={1.5 * p}><QuestionIcon /></Place><ChipAt text="إيه اللي بيمنعك تنام؟" p={p} /></>) },
  { a: "كمان", sfx: "bump", r: (p, f) => (<><Place x={500} y={1020} s={1.2}><PatientF /></Place><Place x={820} y={900} s={1 * p}><Flash s={1.3} color="#C23B32" /></Place><ChipAt text="ألم أو مشكلة محتاجة علاج" size={46} p={p} /></>) },
]);
// ============================================================ 5. What to do + CBT-I
const S5 = mk(5, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1010} s={1.25 * p}><DoctorM /></Place></>) },
  { a: "ثبّت", sfx: "pop", r: (p, f) => (<><Place x={540} y={980} s={1.5 * p}><Clock a={0} /></Place><Place x={820} y={800} s={0.9}><CheckIcon /></Place><ChipAt text="ميعاد صحيان ثابت" p={p} /></>) },
  { a: "اتعرض", sfx: "shimmer", r: (p, f) => (<><Place x={540} y={930} s={1.3 * p}><Sun r={f} /></Place><ChipAt text="ضوء النهار" p={p} /></>) },
  { a: "راجع", r: (p) => (<><Place x={380} y={1000} s={0.95 * p}><Cup /></Place><Place x={760} y={1000} s={1.0}><Clock a={150} /></Place><ChipAt text="راجع توقيت القهوة والشاي" p={p} /></>) },
  { a: "وما", sfx: "bump", r: (p) => (<><Place x={540} y={1100} s={0.9}><Bed /></Place><Place x={540} y={1000} s={2.2 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="متدخلش السرير بدري" p={p} /></>) },
  { a: "قوم", sfx: "pop", r: (p, f) => (<><Place x={540} y={1000} s={1.2 * p}><PatientM /></Place><Place x={820} y={860} s={0.8}><Moon /></Place><ChipAt text="حاجة هادية في إضاءة خافتة" size={44} w={780} p={p} /></>) },
  { a: "لكن", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><DoctorF /></Place><Place x={820} y={780} s={1.2 * p}><QuestionIcon /></Place></>) },
  { a: "السلوكي", sfx: "ding", r: (p) => (<><Place x={310} y={1000} s={1.15}><DoctorF /></Place><Place x={790} y={950} s={1.3 * p}><Brain /></Place><ChipAt text="CBT-I" w={420} size={70} dir="ltr" hot p={p} /></>) },
  { a: "وده", r: (p) => (<><Place x={540} y={990} s={1.4}><Brain /></Place><Place x={540} y={990} s={2 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="مش مجرد فضفضة" p={p} /></>) },
  { a: "وبيشمل", sfx: "pop", r: (p, f, a) => (<>{["تنظيم وقت السرير", "التحكم في المثيرات", "تعديل الأفكار والسلوكيات"].map((tx, i) => (<Place key={i} x={540} y={900 + i * 150} s={pop(f, a + i * 30, 12)}><Chip text={tx} w={720} size={46} /></Place>))}</>) },
  { a: "والأهم", sfx: "shimmer", r: (p) => (<><Place x={540} y={990} s={1.3}><DoctorF /></Place><Place x={820} y={800} s={1.1 * p}><OkMark p={p} /></Place><ChipAt text="من أقوى العلاجات للأرق المزمن" size={44} w={820} hot p={p} /></>) },
  { a: "ونظافة", r: (p) => (<><Place x={540} y={1000} s={1.2}><Bed /></Place><Place x={540} y={1000} s={2 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="نظافة النوم لوحدها مش كفاية" size={46} w={800} p={p} /></>) },
]);
// ============================================================ 6. Melatonin and sleeping pills
const S6 = mk(6, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={1010} s={1.2 * p}><PharmacistM /></Place><Place x={820} y={780} s={1.5 * p}><QuestionIcon /></Place></>) },
  { a: "ميلاتونين", sfx: "pop", r: (p) => (<><Place x={400} y={1000} s={1.5 * p}><MedTablet /></Place><Place x={760} y={940} s={1.2}><Moon /></Place><ChipAt text="Melatonin" dir="ltr" hot p={p} /></>) },
  { a: "بيساعد", r: (p, f) => (<><Place x={540} y={980} s={1.5 * p}><Clock a={f * 2} /></Place><ChipAt text="بيضبط توقيت النوم" p={p} /></>) },
  { a: "لكن", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><MedTablet /></Place><Place x={540} y={1000} s={2.2 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="مش علاج سحري لكل أنواع الأرق" size={44} w={840} p={p} /></>) },
  { a: "النوع", sfx: "pop", r: (p) => (<><Place x={330} y={980} s={1.5 * p}><MedCapsule /></Place><Place x={760} y={980} s={1.5 * p}><MedBlister /></Place><ChipAt x={330} y={1330} text="Z-drugs" w={380} dir="ltr" p={p} /><ChipAt x={760} y={1330} text="Benzodiazepines" w={440} size={36} dir="ltr" p={p} /></>) },
  { a: "GABA", sfx: "shimmer", r: (p, f) => (<><Place x={540} y={980} s={1.5}><Brain /></Place>{[0, 1, 2].map((i) => (<path key={i} d={`M${300 + i * 20} ${1190 + i * 30} q60 -50 120 0 t120 0 t120 0`} fill="none" {...sk} strokeWidth={6} opacity={0.6 * p} />))}<ChipAt text="GABA" dir="ltr" hot p={p} w={360} /></>) },
  { a: "مخاطر", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.8 * p}><Warn /></Place><ChipAt text="مش بلا مخاطر" p={p} /></>) },
  { a: "ممكن", r: (p, f, a) => (<>{["نعاس تاني يوم", "ضعف التركيز", "مشاكل ذاكرة وتوازن", "اعتماد وانسحاب"].map((tx, i) => (<Place key={i} x={540} y={830 + i * 130} s={pop(f, a + i * 24, 12)}><Chip text={tx} w={680} size={44} /></Place>))}</>) },
  { a: "تحذير", sfx: "heartbeat", r: (p) => (<><Place x={540} y={980} s={1.7 * p}><Warn /></Place><ChipAt text="تحذير مهم" hot p={p} /></>) },
  { a: "بعض", r: (p, f) => (<><Place x={420} y={1010} s={1.1}><PatientM /></Place><path d={`M620 1000 h${120 * Math.min(1, prog(f, f, 1)) + 60}`} {...sk} strokeWidth={10} strokeDasharray="3 18" /><Place x={800} y={900} s={0.9 * p}><Warn /></Place><ChipAt text="سلوكيات أثناء النوم بدون وعي" size={44} w={820} p={p} /></>) },
  { a: "أوركسين", sfx: "pop", r: (p, f, a) => (<><Place x={540} y={980} s={1.4}><Brain /></Place><Place x={540} y={1250} s={0.9}><Toggle on={prog(f, a + 20, 12) > 0.5 ? 0 : 1} /></Place><ChipAt y={1290} text="Orexin" dir="ltr" w={360} hot p={p} /><ChipAt y={1410} text="بيقلل إشارات اليقظة" size={46} p={p} /></>) },
  { a: "مضادات", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.5}><MedSyrup /></Place><Place x={540} y={1000} s={2 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="مضادات الحساسية: مش للأرق المزمن" size={42} w={860} p={p} /></>) },
  { a: "والخلاصة", sfx: "ding", r: (p) => (<><Place x={330} y={1000} s={1.1}><PharmacistM /></Place><Place x={780} y={980} s={1.0}><MedTablet /></Place><ChipAt text="الدواء حسب مشكلتك مش الأقوى" size={44} w={840} hot p={p} /></>) },
  { a: "فأنصحك", r: (p) => (<><Place x={540} y={1010} s={1.25}><DoctorM /></Place><Place x={820} y={800} s={1 * p}><Hospital /></Place><ChipAt text="استشر الطبيب" p={p} /></>) },
]);
// ============================================================ 7. Summary
const S7 = mk(7, [
  { a: "", sfx: "pop", r: (p, f) => (<><Place x={540} y={1060} s={1.2 * p}><PatientM /></Place><Place x={830} y={820} s={0.9}><Moon /></Place><Place x={250} y={820} s={0.9}><Clock a={f} /></Place></>) },
  { a: "لكن", r: (p) => (<><Place x={540} y={1000} s={1.3}><Brain /></Place><Place x={820} y={820} s={1 * p}><Warn /></Place><ChipAt text="لو مستمرة… متستهونش بيها" size={46} w={820} p={p} /></>) },
  { a: "بتشخر", sfx: "bump", r: (p, f) => (<><Place x={540} y={1170} s={0.9}><Bed /></Place><Place x={540} y={1030} s={1.2}><PatientM /></Place><Label x={780} y={860 - bob(f, 8, 50)} text="Z z z" size={70} color={C.source} dir="ltr" /><ChipAt text="شخير شديد • نفس بيتقطع • نعاس خطر" size={40} w={900} p={p} /></>) },
  { a: "لازم", sfx: "ding", r: (p) => (<><Place x={420} y={1010} s={1.2}><DoctorF /></Place><Place x={800} y={960} s={1.3 * p}><Hospital /></Place><ChipAt text="لازم تقييم طبي" hot p={p} /></>) },
  { a: "وما", sfx: "bump", r: (p) => (<><Place x={540} y={1010} s={1.2}><MedCapsule /></Place><Place x={540} y={1000} s={2.2 * p} o={0.9}><StopHand /></Place><ChipAt text="متبدأش منوّم من نفسك" p={p} /></>) },
  { a: "وافتكر", sfx: "shimmer", r: (p) => (<><Place x={330} y={1000} s={1.3 * p}><Brain /></Place><Place x={760} y={1000} s={1.2 * p}><MedTablet /></Place><ChipAt text="مش كل أرق محتاج دواء" hot p={p} /></>) },
]);
// ============================================================ 8. Children's sleep (before the closing lines)
const S8 = mk(8, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={1170} s={1.0}><Bed /></Place><Place x={500} y={1030} s={1.1 * p}><Baby /></Place><Place x={820} y={820} s={0.9}><Moon /></Place></>) },
  { a: "النوم", r: (p) => (<><Place x={540} y={1000} s={1.5 * p}><Brain /></Place><Place x={820} y={800} s={1}><Sparkle fill="#F7C548" /></Place><ChipAt text="جزء أساسي من النمو" p={p} /></>) },
  { a: "أثناء", sfx: "pop", r: (p, f) => (<><Place x={540} y={980} s={1.5}><Brain /></Place><Place x={540} y={780} s={1.2 * p}><Sparkle fill="#F7C548" size={1.6} /></Place><ChipAt text="Growth Hormone" dir="ltr" hot w={600} p={p} /></>) },
  { a: "ساعة", sfx: "bump", r: (p, f) => (<><Place x={540} y={980} s={1.4}><Clock a={30} /></Place><Place x={540} y={980} s={2 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="مفيش ساعة سحرية" p={p} /></>) },
  { a: "الأهم", sfx: "ding", r: (p) => (<><Place x={540} y={1000} s={1.3}><Baby /></Place><Place x={820} y={820} s={1 * p}><CheckIcon /></Place><ChipAt text="نوم كافي ومنتظم يناسب العمر" size={44} w={820} hot p={p} /></>) },
  { a: "مثلًا", sfx: "pop", r: (p, f, a) => (<><Place x={540} y={1000} s={1}><Bars items={[{ label: "6–12 سنة", value: 12, color: "#9DC9E8", p: prog(f, a, 24) }, { label: "مراهق", value: 10, color: "#F2D79A", p: prog(f, a + 20, 24) }]} max={12} /></Place><ChipAt text="9–12 ساعة • 8–10 ساعات" w={720} p={p} /></>) },
  { a: "ويفضل", r: (p, f) => (<><Place x={420} y={980} s={1.3}><Clock a={f * 0.5 + 300} /></Place><Place x={760} y={940} s={1.2 * p}><Moon /></Place><ChipAt text="على حسب بعض الدراسات: ينام بدري" size={42} w={860} p={p} /></>) },
]);
// ============================================================ 9. Closing (the logo outro follows)
const S9 = mk(9, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><Tablet glow={0.8} /></Place><Place x={540} y={1000} s={0.6}><Sparkle fill="#F7C548" /></Place></>) },
  { a: "لو", sfx: "shimmer", r: (p, f) => (<><Place x={540} y={1050} s={1.2}><PatientM /></Place><Place x={300} y={820} s={0.9 * p}><Moon /></Place><Place x={800} y={820} s={0.9 * p}><Clock a={f * 3} /></Place></>) },
  { a: "اكتب", sfx: "ding", r: (p) => (<><Place x={540} y={980} s={1.8 * p}><QuestionIcon /></Place><ChipAt text="اكتب لنا في التعليقات" hot p={p} /></>) },
]);

export const SCENES_EP05: Record<number, SceneDef> = { 1: S1, 2: S2, 3: S3, 4: S4, 5: S5, 6: S6, 7: S7, 8: S8, 9: S9 };
export const THEME_EP05: Record<number, "curiosity" | "tension" | "hope"> = { 1: "curiosity", 2: "curiosity", 3: "tension", 4: "curiosity", 5: "hope", 6: "tension", 7: "hope", 8: "curiosity", 9: "hope" };
export const DISCLAIMER_EP05 = "شرح مبسط للتوعية، مش بديل لاستشارة الطبيب أو الصيدلي. المصادر في الوصف.";
export { Globe, Person, Pharmacy, Thermo, Cox, BrainSpine, PatientF, clamp, easeIn };
