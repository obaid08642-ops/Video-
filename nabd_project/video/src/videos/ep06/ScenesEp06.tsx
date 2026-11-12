// Ep06 (hair loss / androgenetic alopecia, recorded voice). Same BEATS machinery as Ep05: a beat appears at the first spoken word that matches its
// anchor (searched in order after the previous beat) and stays until the next beat. No real people, no brands, no logos.
import React from "react";
import { useCurrentFrame } from "remotion";
import { Place, Clock, QuestionIcon, CheckIcon } from "../../assets";
import { Calendar, Moon } from "../../assets/more";
import { Warn, StopHand } from "../../assets/v9";
import { Chip, Gauge, Hospital, OkMark, XMark } from "../../assets/ep02";
import { Tablet, Drop, Flash, Thermo } from "../../assets/ep04";
import { DoctorM, PatientM, PatientF, MedTablet } from "../../assets/characters";
import { HairGuy, ScalpTop, Follicle, Strand, Hexa, DropperBottle, Rosemary, Seeds, OliveDrop, Roller, Magnifier, TestTube, Thyroid, IronDrop, Patch, Ponytail, Mirror, Arrow, Bubble, HairHero, Grafts, Gene, Gift } from "../../assets/hair";
import { bob, clamp, easeIn, easeOut, inOut, pop, prog } from "../../lib/anim";
import { FPS, norm, type T } from "../../lib/timing";
import type { Cue } from "../../lib/sfx";
import { C } from "../../theme";

export type SceneDef = { C: React.FC<{ t: T }>; cues: (t: T) => Cue[]; pulses: (t: T) => number[] };
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>{children}</svg>
);
const ChipAt: React.FC<{ x?: number; y?: number; text: string; w?: number; size?: number; p?: number; dir?: "rtl" | "ltr"; hot?: boolean }> = ({ x = 540, y = 1400, text, w = 600, size = 50, p = 1, dir = "rtl", hot }) => (
  <Place x={x} y={y} s={p}><Chip text={text} w={w} size={size} dir={dir} fill={hot ? "#FFF3CF" : C.card} color={hot ? C.key : C.ink} /></Place>
);
// ---- beats machinery (same as Ep05)
type Beat = { a: string; sfx?: string; r: (p: number, f: number, a: number, b: number) => React.ReactNode };
const wordsOf = new WeakMap<object, { n: string; s: number }[]>();
const allWords = (t: T) => {
  let w = wordsOf.get(t.timing);
  if (!w) { w = t.timing.lines.flatMap((l) => l.words.map((x) => ({ n: norm(x.w), s: x.start }))); wordsOf.set(t.timing, w); }
  return w;
};
const anchors = (t: T, scene: number, beats: Beat[]) => {
  const sc = t.timing.scenes.find((s) => s.id === scene); const out: number[] = []; let from = sc ? Math.max(0, sc.start) : 0;
  const w = allWords(t); const strict0 = !!(t.timing as unknown as { strict?: boolean }).strict; const start0 = from;
  beats.forEach((b, i) => {
    const k = norm(b.a);
    if (strict0) from = start0;
    const hit = k === "" ? undefined : w.find((x) => x.s >= from - 0.02 && x.n.includes(k));
    const s = k === "" ? from : hit ? hit.s : strict0 ? 1e6 : from + (i ? 1.2 : 0);
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
  cues: (t) => { const an = anchors(t, scene, beats); return beats.flatMap((b, i) => (b.sfx && an[i] < 1e5 ? [{ at: an[i] - 0.12, sfx: b.sfx, vol: 0.13 }] : [])); },
  pulses: (t) => { const sc = t.timing.scenes.find((s) => s.id === scene); return sc ? [Math.round(sc.end * FPS) - 2] : []; },
});
const L = (f: number, a: number, d = 20) => prog(f, a, d, easeOut);

// ============================================================ 1. Hook: friend vs you -> follicle -> why does hair fall
const S1 = mk(1, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={290} y={1060} s={1.0 * p}><HairGuy kind="white" /></Place><Place x={790} y={1060} s={1.0 * p}><HairGuy kind="bald" /></Place></>) },
  { a: "صاحبك", sfx: "bump", r: (p, f, a) => { const z = L(f, a, 14); return (<><Place x={810} y={1010} s={0.62 - 0.1 * z}><HairGuy kind="bald" /></Place><Place x={400 + 140 * z} y={1060} s={1.0 + 0.42 * z}><HairGuy kind="white" /></Place></>); } },
  { a: "انت", sfx: "bump", r: (p, f, a) => { const z = L(f, a, 14); return (<><Place x={270} y={1010} s={0.62 - 0.1 * z}><HairGuy kind="white" /></Place><Place x={680 - 140 * z} y={1060} s={1.0 + 0.42 * z}><HairGuy kind="bald" /></Place></>); } },
  { a: "ابيض", r: (p) => (<><Place x={290} y={1060} s={1.0}><HairGuy kind="white" /></Place><Place x={790} y={1000} s={0.9}><HairGuy kind="bald" /></Place><ChipAt x={290} y={1470} text="أبيض وكثيف" w={420} p={p} /></>) },
  { a: "اسود", r: (p) => (<><Place x={290} y={1000} s={0.9}><HairGuy kind="white" /></Place><Place x={790} y={1060} s={1.0}><HairGuy kind="bald" /></Place><ChipAt x={790} y={1470} text="أسود… بس بيخف" w={460} p={p} /></>) },
  { a: "علاقه", sfx: "pop", r: (p) => (<><Place x={290} y={1040} s={0.8}><HairGuy kind="white" /></Place><Place x={790} y={1040} s={0.8}><HairGuy kind="bald" /></Place><Place x={540} y={760} s={1.5 * p}><QuestionIcon /></Place><ChipAt text="لون الشعر = كثافته؟" p={p} /></>) },
  { a: "المشكله", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.15}><HairGuy kind="bald" tilt={0.5} /></Place><Place x={540} y={1000} s={2.2 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="مش لون الشعر" p={p} /></>) },
  { a: "البصيله", sfx: "shimmer", r: (p, f, a) => (<><Place x={540} y={1010} s={1.0 + 0.25 * L(f, a, 24)}><Follicle size={0.55} len={0.6} /></Place><ChipAt text="المشكلة في البصيلة" hot p={p} /></>) },
  { a: "سيب", sfx: "whoosh", r: (p, f, a) => { const z = L(f, a, 16); return (<><Place x={270 - 560 * z} y={1010} s={0.52}><HairGuy kind="white" /></Place><Place x={540} y={1060} s={1.35}><HairGuy kind="bald" /></Place><Place x={430} y={880} s={0.9 * (1 - z * 0.3)} r={180}><Arrow len={170} /></Place></>); } },
  { a: "والموضوع", sfx: "swell", r: (p, f, a) => (<><Place x={540} y={1000} s={1.35}><HairGuy kind="bald" tilt={L(f, a, 30)} /></Place><ChipAt text="الموضوع ده غالبًا ما بدأش النهارده" w={860} size={46} p={p} /></>) },
  { a: "السلع", sfx: "tick", r: (p, f, a) => { const z = L(f, a, 18); return (<><Place x={540} y={990} s={1.3}><ScalpTop hairs={3} recede={1} /></Place>{[0, 1, 2, 3].map((i) => (<Place key={i} x={540} y={990} s={1.3} r={((f - a) * 14 + i * 90) % 360}><path d="M0 0 L0 -200" stroke={C.ink} strokeWidth={5} opacity={0.5 * (1 - z)} /></Place>))}<ChipAt text="الصلع الوراثي" hot p={p} /></>); } },
  { a: "البصيله", sfx: "pop", r: (p, f, a, b) => (<><Place x={540} y={1010} s={1.25}><Follicle size={1 - 0.65 * prog(f, a, Math.max(30, b - a))} len={0.9 - 0.5 * prog(f, a, Math.max(30, b - a))} /></Place><ChipAt text="البصيلة بتضعف تدريجيًا" p={p} /></>) },
  { a: "شهور", sfx: "tick", r: (p, f, a) => (<><Place x={300} y={1000} s={0.9 * p}><Calendar year="شهور" /></Place><Place x={790} y={1010} s={0.8}><Follicle size={0.45} len={0.4} /></Place></>) },
  { a: "واحيانا", r: (p, f, a) => (<><Place x={300} y={1000} s={0.85}><Calendar year="سنين" /></Place><Place x={790} y={1010} s={0.8}><Follicle size={0.35} len={0.3} /></Place></>) },
  { a: "دوره", sfx: "pop", r: (p, f, a) => (<>{[0, 1, 2].map((i) => (<Place key={i} x={290 + i * 250} y={1230}><Place x={0} y={0} s={pop(f, a + i * 14, 10)}><Strand len={0.9 - 0.18 * i} thick={1 - 0.28 * i} /></Place></Place>))}<ChipAt text="كل دورة: شعرة أرفع وأقصر" p={p} /></>) },
  { a: "ارفع", sfx: "shimmer", r: (p, f) => (<><Place x={420} y={1230} s={1.3}><HairHero wave={f / 5} len={0.85} /></Place><Place x={700} y={880} s={p}><Bubble text="أنا مش قادرة!" w={420} /></Place><Place x={540} y={1000} s={p} o={0.7}><Arrow len={120} dashed /></Place></>) },
  { a: "ليه", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><HairGuy kind="bald" mood={-0.3} /></Place><Place x={820} y={800} s={1.5 * p}><QuestionIcon /></Place><ChipAt text="ليه الشعر بيقع؟" hot p={p} /></>) },
  { a: "ويمتى", r: (p, f) => (<><Place x={540} y={980} s={1.4}><Clock a={f / 14} /></Place><ChipAt text="وإمتى يبقى طبيعي؟" p={p} /></>) },
  { a: "نحافظ", sfx: "ding", r: (p) => (<><Place x={540} y={980} s={1.1}><ScalpTop hairs={14} recede={0} /></Place><Place x={820} y={820} s={0.9 * p}><CheckIcon /></Place><ChipAt text="نحافظ على شعرنا" hot p={p} /></>) },
]);
// ============================================================ 2. Not every hair loss is baldness
const S2 = mk(2, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2 * p}><Follicle size={0.9} len={0.8} /></Place><ChipAt text="معلومة 1" w={300} hot p={p} /></>) },
  { a: "دايما", r: (p) => (<><Place x={540} y={1000} s={1.15}><HairGuy kind="bald" /></Place><Place x={540} y={1000} s={2.2 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="سقوط الشعر ≠ صلع دايمًا" p={p} /></>) },
  { a: "دوره", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.25}><Follicle size={0.9} len={0.8} /></Place><ChipAt text="الشعرة ليها دورة حياة" hot p={p} /></>) },
  { a: "بتنمو", sfx: "bubbles", r: (p, f, a) => (<><Place x={540} y={1010} s={1.25}><Follicle size={0.95} len={0.35 + 0.65 * prog(f, a, 40)} /></Place><ChipAt text="1) نمو" p={p} /></>) },
  { a: "الراحه", r: (p) => (<><Place x={540} y={1010} s={1.25}><Follicle size={0.6} len={0.45} /></Place><ChipAt text="2) راحة" p={p} /></>) },
  { a: "النهايه", sfx: "drip", r: (p, f, a) => { const z = L(f, a, 28); return (<><Place x={540} y={1010} s={1.25}><Follicle size={0.55} hair={false} /></Place><Place x={540 + 40 * z} y={760 + 330 * z} s={1.1} r={25 * z}><Strand len={0.5} thick={0.8} tip={false} /></Place><ChipAt text="3) بتسقط" p={p} /></>); } },
  { a: "وتبدا", sfx: "pop", r: (p, f, a) => (<><Place x={540} y={1010} s={1.25}><Follicle size={0.9} len={0.1 + 0.5 * prog(f, a, 36)} /></Place><ChipAt text="وتبدأ شعرة جديدة مكانها" p={p} /></>) },
  { a: "50", sfx: "pop", r: (p, f, a) => (<>{[0, 1, 2, 3, 4, 5].map((i) => { const z = prog(f, a + i * 6, 40); return (<Place key={i} x={230 + i * 125} y={780 + 330 * z} s={0.55} r={20 * z - 10}><Strand len={0.6} thick={0.7} tip={false} /></Place>); })}<ChipAt text="50–100 شعرة يوميًا" hot p={p} /></>) },
  { a: "طبيعي", sfx: "ding", r: (p) => (<><Place x={540} y={980} s={1.1}><ScalpTop hairs={14} recede={0} /></Place><Place x={820} y={780} s={1.1 * p}><OkMark p={p} /></Place><ChipAt text="ممكن يكون طبيعي" p={p} /></>) },
  { a: "زاد", sfx: "bump", r: (p, f, a) => (<>{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const z = prog(f, a + i * 4, 30); return (<Place key={i} x={170 + i * 105} y={760 + 380 * z} s={0.5} r={15 * z}><Strand len={0.6} thick={0.7} tip={false} /></Place>); })}<Place x={540} y={1180} s={1.0 * p}><Warn /></Place><ChipAt text="لو زاد بشكل ملحوظ" p={p} /></>) },
  { a: "يخف", r: (p) => (<><Place x={540} y={980} s={1.15}><ScalpTop hairs={3} recede={1} /></Place><ChipAt text="أو الشعر بدأ يخف فعلًا" p={p} /></>) },
  { a: "نعرف", sfx: "ding", r: (p) => (<><Place x={540} y={980} s={1.2}><Magnifier /></Place><Place x={540} y={1000} s={0.7}><ScalpTop hairs={3} recede={1} /></Place><ChipAt text="لازم نعرف السبب" hot p={p} /></>) },
]);
// ============================================================ 3. Androgenetic alopecia: the problem is in the follicle
const S3 = mk(3, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><HairGuy kind="bald" /></Place><ChipAt text="الصلع الوراثي" hot p={p} /></>) },
  { a: "جسمك", sfx: "pop", r: (p) => (<><Place x={290} y={1000} s={0.95}><HairGuy kind="bald" /></Place><Place x={790} y={1000} s={1.2 * p}><Hexa s={1.1} fill="#CFE0EE" /></Place><ChipAt x={790} y={1180} text="تستوستيرون" w={340} size={38} p={p} /></>) },
  { a: "dht", sfx: "pop", r: (p, f, a) => (<><Place x={290} y={1000} s={1.3 * p}><Hexa s={1.2} fill="#CFE0EE" /></Place><Place x={540} y={1000} s={0.8}><Arrow len={160} /></Place><Place x={790} y={1000} s={1.5 * pop(f, a + 10, 12)}><Hexa s={1.3} /></Place><ChipAt x={790} y={1220} text="DHT" w={260} dir="ltr" hot p={p} /></>) },
  { a: "مشكله", r: (p) => (<><Place x={540} y={1000} s={1.5}><Hexa s={1.3} /></Place><Place x={540} y={1000} s={2.4 * p} o={0.9}><OkMark p={p} /></Place><ChipAt text="مش مشكلة عند كل الناس" p={p} /></>) },
  { a: "حساسه", sfx: "bump", r: (p, f, a) => (<><Place x={540} y={1050} s={1.05}><Follicle size={0.75} len={0.5} /></Place>{[0, 1, 2].map((i) => (<Place key={i} x={150 + i * 40 + 100 * prog(f, a + i * 8, 26)} y={820 + i * 150} s={0.6}><Hexa /></Place>))}<ChipAt text="بصيلات حساسة وراثيًا" p={p} /></>) },
  { a: "تصغر", sfx: "tick", r: (p, f, a, b) => (<><Place x={540} y={1030} s={1.2}><Follicle size={1 - 0.65 * prog(f, a, Math.max(40, b - a))} len={0.9 - 0.45 * prog(f, a, Math.max(40, b - a))} /></Place><ChipAt text="البصيلة بتصغر تدريجيًا" p={p} /></>) },
  { a: "سميكه", r: (p) => (<><Place x={300} y={1100} s={1.5}><Strand len={0.9} thick={1.3} /></Place><Place x={540} y={1000} s={0.8}><Arrow len={150} /></Place></>) },
  { a: "ارفع", sfx: "shimmer", r: (p) => (<><Place x={300} y={1100} s={1.3}><Strand len={0.9} thick={1.3} /></Place><Place x={800} y={1100} s={1.3 * p}><Strand len={0.55} thick={0.45} /></Place><Place x={540} y={1000} s={0.8}><Arrow len={150} /></Place><ChipAt text="أرفع وأقصر" p={p} /></>) },
  { a: "ضعيف", r: (p) => (<><Place x={540} y={1050} s={1.15}><Follicle size={0.3} len={0.25} /></Place><ChipAt text="شعر ضعيف جدًا أو يقل الظاهر" size={44} w={820} p={p} /></>) },
  { a: "منتر", sfx: "ding", r: (p, f, a) => (<>{[0.95, 0.65, 0.35].map((s, i) => (<Place key={i} x={230 + i * 310} y={1050} s={0.5 * pop(f, a + i * 10, 12)}><Follicle size={s} len={s} /></Place>))}<ChipAt y={1300} text="Miniaturization" dir="ltr" w={560} hot p={p} /><ChipAt y={1420} text="تصغير البصيلات" p={p} /></>) },
  { a: "الرجاله", sfx: "pop", r: (p) => (<><Place x={540} y={980} s={1.2}><ScalpTop hairs={6} recede={1} /></Place><ChipAt text="الرجالة: تراجع خط الشعر" p={p} /></>) },
  { a: "التاج", r: (p) => (<><Place x={540} y={980} s={1.2}><ScalpTop hairs={2} recede={1} /></Place><Place x={540} y={1000} s={0.9 * p} o={0.9}><circle r={80} fill="none" stroke={C.warn} strokeWidth={8} strokeDasharray="3 16" /></Place><ChipAt text="أو خفة في منطقة التاج" p={p} /></>) },
  { a: "الستات", sfx: "pop", r: (p) => (<><Place x={540} y={980} s={1.2}><ScalpTop hairs={14} recede={0} part /></Place><ChipAt text="الستات: فرق الشعر بيتوسع" p={p} /></>) },
  { a: "عالي", r: (p) => (<><Place x={540} y={980} s={1.3}><Gauge v={0.45} label="" /></Place><ChipAt text="مش لازم التستوستيرون يكون عالي" size={44} w={860} p={p} /></>) },
  { a: "جينات", sfx: "shimmer", r: (p, f) => (<><Place x={540} y={980} s={1.4}><Gene /></Place><ChipAt text="الجينات" hot p={p} /></>) },
  { a: "الام", r: (p) => (<><Place x={300} y={1010} s={0.95}><PatientM /></Place><Place x={790} y={1010} s={0.95}><PatientF /></Place><ChipAt text="من ناحية الأب أو الأم… أو الاتنين" size={44} w={840} p={p} /></>) },
]);
// ============================================================ 4. Not every hair loss is DHT
const S4 = mk(4, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.3}><Hexa s={1.3} /></Place><Place x={540} y={1000} s={2.4 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="مش كل تساقط سببه DHT" p={p} /></>) },
  { a: "مرض", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.4 * p}><Thermo level={0.85} /></Place><ChipAt text="مرض شديد أو حرارة" p={p} /></>) },
  { a: "عمليات", r: (p) => (<><Place x={540} y={990} s={1.3 * p}><Hospital /></Place><ChipAt text="عملية جراحية" p={p} /></>) },
  { a: "ضغط", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.2}><PatientM /></Place><Place x={830} y={800} s={1.3 * p}><Flash s={1.4} color="#C23B32" /></Place><ChipAt text="ضغط نفسي كبير" p={p} /></>) },
  { a: "وزن", r: (p) => (<><Place x={540} y={990} s={1.2}><Gauge v={0.2} label="" /></Place><ChipAt text="نزول وزن سريع" p={p} /></>) },
  { a: "الراحه", sfx: "swell", r: (p, f, a) => (<>{[0, 1, 2, 3, 4].map((i) => (<Place key={i} x={190 + i * 175} y={1010} s={0.38 * pop(f, a + i * 5, 10)}><Follicle size={0.5} len={0.4} /></Place>))}<ChipAt text="بصيلات أكتر بتدخل مرحلة الراحة" size={44} w={860} p={p} /></>) },
  { a: "شهرين", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.2 * p}><Calendar year="2-3 شهور" /></Place><ChipAt text="بعد شهرين أو تلاتة" p={p} /></>) },
  { a: "منتشر", r: (p) => (<><Place x={540} y={980} s={1.25}><ScalpTop hairs={6} recede={0} /></Place><ChipAt text="تساقط منتشر" p={p} /></>) },
  { a: "تلوجين", sfx: "ding", r: (p) => (<><Place x={540} y={980} s={1.1}><ScalpTop hairs={6} recede={0} /></Place><ChipAt text="Telogen Effluvium" dir="ltr" w={640} hot p={p} /></>) },
  { a: "يتعالج", sfx: "shimmer", r: (p) => (<><Place x={540} y={980} s={1.1}><ScalpTop hairs={14} recede={0} /></Place><Place x={820} y={780} s={1.1 * p}><OkMark p={p} /></Place><ChipAt text="بيتحسن لما السبب يتعالج" p={p} /></>) },
  { a: "الحديد", sfx: "pop", r: (p) => (<><Place x={540} y={980} s={1.5 * p}><IronDrop /></Place><ChipAt text="نقص الحديد أو البروتين" p={p} /></>) },
  { a: "الدراقيه", r: (p) => (<><Place x={540} y={990} s={1.4 * p}><Thyroid /></Place><ChipAt text="اضطرابات الغدة الدرقية" p={p} /></>) },
  { a: "تكايس", r: (p) => (<><Place x={540} y={1010} s={1.2}><PatientF /></Place><ChipAt text="تكيس المبايض عند الستات" p={p} /></>) },
  { a: "السعلبه", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.25 * p}><Patch /></Place><ChipAt text="الثعلبة البقعية (مناعة)" p={p} /></>) },
  { a: "فطريات", r: (p) => (<><Place x={540} y={990} s={1.15}><Patch /></Place><Place x={820} y={800} s={0.9 * p}><Warn /></Place><ChipAt text="فطريات فروة الرأس (علاج بالفم)" size={44} w={880} p={p} /></>) },
  { a: "شد", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.35 * p}><Ponytail /></Place><ChipAt text="شد الشعر المستمر" p={p} /></>) },
  { a: "الادويه", r: (p) => (<><Place x={380} y={1000} s={1.1 * p}><MedTablet /></Place><Place x={720} y={1000} s={1.0 * p}><Drop color="#9DC9E8" /></Place><ChipAt text="بعض الأدوية والعلاج الكيماوي" size={44} w={860} p={p} /></>) },
  { a: "ببساطه", sfx: "bump", r: (p, f) => (<><Place x={540} y={980} s={1.3}><Clock a={f / 8} /></Place><Place x={540} y={980} s={2 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="علاج من غير سبب = تضييع وقت وفلوس" size={42} w={900} p={p} /></>) },
]);
// ============================================================ 5. How do we find the cause?
const S5 = mk(5, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1010} s={1.3 * p}><DoctorM /></Place><Place x={820} y={780} s={1.2 * p}><QuestionIcon /></Place></>) },
  { a: "بيبدا", r: (p) => (<><Place x={380} y={1000} s={0.95}><DoctorM /></Place><Place x={790} y={980} s={0.8 * p}><Calendar year="التاريخ" /></Place><ChipAt text="تاريخ التساقط" p={p} /></>) },
  { a: "فروه", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.1}><ScalpTop hairs={4} recede={1} /></Place><Place x={700} y={900} s={0.9 * p}><Magnifier /></Place><ChipAt text="فحص فروة الرأس" p={p} /></>) },
  { a: "تريكوسكوب", sfx: "ding", r: (p) => (<><Place x={540} y={1010} s={1.1}><Follicle size={0.5} len={0.5} /></Place><Place x={640} y={880} s={1.2 * p}><Magnifier /></Place><ChipAt text="Trichoscope" dir="ltr" w={520} hot p={p} /></>) },
  { a: "بيكبر", r: (p) => (<><Place x={380} y={1030} s={0.55}><Follicle size={0.95} len={0.9} /></Place><Place x={760} y={1030} s={0.55}><Follicle size={0.35} len={0.35} /></Place><ChipAt text="يكشف اختلاف سُمك الشعر" p={p} /></>) },
  { a: "تحليل", sfx: "pop", r: (p, f, a) => (<>{[0, 1, 2].map((i) => (<Place key={i} x={270 + i * 270} y={1000} s={1.1 * pop(f, a + i * 8, 12)}><TestTube fill={0.8 - 0.15 * i} /></Place>))}<ChipAt text="صورة دم • حديد • غدة درقية" size={44} w={860} p={p} /></>) },
  { a: "20", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.2}><TestTube /></Place><Place x={540} y={1000} s={2.2 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="مش كل واحد محتاج 20 تحليل" p={p} /></>) },
  { a: "فجاه", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.2}><Patch /></Place><Place x={820} y={800} s={1.0 * p}><Warn /></Place><ChipAt text="تساقط فجأة في بقع" p={p} /></>) },
  { a: "الم", r: (p) => (<><Place x={540} y={990} s={1.1}><ScalpTop hairs={3} recede={1} /></Place><Place x={820} y={800} s={1.3 * p}><Flash s={1.4} color="#C23B32" /></Place><ChipAt text="ألم أو التهاب شديد" p={p} /></>) },
  { a: "لمعه", r: (p) => (<><Place x={540} y={1000} s={1.1}><Mirror /></Place><ChipAt text="مناطق لامعة كأن البصيلات اختفت" size={44} w={880} p={p} /></>) },
  { a: "تاخرش", sfx: "ding", r: (p) => (<><Place x={420} y={1000} s={1.1}><DoctorM /></Place><Place x={800} y={960} s={1.2 * p}><Hospital /></Place><ChipAt text="متأخرش زيارة الطبيب" hot p={p} /></>) },
  { a: "دائم", sfx: "heartbeat", r: (p) => (<><Place x={540} y={990} s={1.6 * p}><Warn /></Place><ChipAt text="بعض الأنواع بتسبب فقدان دائم" size={46} w={800} p={p} /></>) },
]);
// ============================================================ 6. Minoxidil
const S6 = mk(6, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2 * p}><ScalpTop hairs={5} recede={1} /></Place></>) },
  { a: "موضعي", sfx: "pop", r: (p, f, a) => (<><Place x={540} y={1010} s={1.0}><ScalpTop hairs={5} recede={1} /></Place><Place x={760} y={790} s={1.2 * p} r={30}><DropperBottle /></Place><Place x={600} y={1060 + 40 * L(f, a, 20)} s={0.7 * L(f, a + 8, 12)}><Drop color="#CFE0EE" /></Place></>) },
  { a: "المينوكسديل", sfx: "ding", r: (p) => (<><Place x={540} y={990} s={1.4 * p}><DropperBottle /></Place><ChipAt text="المينوكسيديل" hot p={p} /></>) },
  { a: "المثبته", r: (p) => (<><Place x={380} y={1000} s={1.0}><HairGuy kind="bald" /></Place><Place x={760} y={1000} s={1.0}><PatientF /></Place><Place x={540} y={780} s={1.0 * p}><OkMark p={p} /></Place><ChipAt text="مثبت للصلع الوراثي: رجال وستات" size={46} w={860} p={p} /></>) },
  { a: "بيساعد", sfx: "bubbles", r: (p, f, a) => (<><Place x={540} y={1030} s={1.2}><Follicle size={0.4 + 0.4 * prog(f, a, 50)} len={0.3 + 0.4 * prog(f, a, 50)} /></Place><ChipAt text="بيحسّن نمو بعض البصيلات" p={p} /></>) },
  { a: "ويطالت", r: (p, f, a) => (<><Place x={540} y={1030} s={1.2}><Follicle size={0.8} len={0.5 + 0.5 * prog(f, a, 40)} /></Place><ChipAt text="يطوّل مرحلة النمو" p={p} /></>) },
  { a: "سمك", r: (p) => (<><Place x={540} y={1030} s={1.2}><Follicle size={0.9} len={0.9} /></Place><ChipAt text="ويزود سُمك الشعر… عند بعض الناس" size={44} w={860} p={p} /></>) },
  { a: "الدم", sfx: "drip", r: (p, f, a) => (<><Place x={540} y={1030} s={1.15}><Follicle size={0.8} len={0.7} /></Place>{[0, 1, 2].map((i) => (<Place key={i} x={150 + 70 * ((f / 2 + i * 30) % 60) / 60 * 4 + i * 20} y={1250 + i * 30} s={0.4}><Drop color="#D9524B" /></Place>))}<ChipAt text="بيزود تدفق الدم لفروة الرأس" p={p} /></>) },
  { a: "العدم", sfx: "bump", r: (p) => (<><Place x={540} y={980} s={1.2}><ScalpTop hairs={2} recede={1} /></Place><Place x={540} y={980} s={2.2 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="مش بيطلع شعر من العدم" p={p} /></>) },
  { a: "شهور", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.2 * p}><Calendar year="6 شهور" /></Place><ChipAt text="التقييم بعد 6 شهور أو أكتر" p={p} /></>) },
  { a: "مؤقته", r: (p, f, a) => (<>{[0, 1, 2, 3, 4].map((i) => { const z = prog(f, a + i * 5, 36); return (<Place key={i} x={240 + i * 150} y={820 + 300 * z} s={0.5}><Strand len={0.6} thick={0.7} tip={false} /></Place>); })}<ChipAt text="زيادة مؤقتة في التساقط في البداية" size={44} w={880} p={p} /></>) },
  { a: "فشل", r: (p) => (<><Place x={540} y={980} s={1.4}><CheckIcon /></Place><ChipAt text="مش معناها إن العلاج فشل" p={p} /></>) },
  { a: "اقفت", sfx: "swell", r: (p, f, a) => (<><Place x={540} y={1030} s={1.2}><Follicle size={0.85 - 0.5 * prog(f, a, 60)} len={0.9 - 0.5 * prog(f, a, 60)} /></Place><ChipAt text="لو وقفته: بتفقد الشعر اللي حافظ عليه" size={44} w={880} p={p} /></>) },
  { a: "الكافيين", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.0}><DropperBottle color="#C9B59D" label /></Place><ChipAt y={1330} text="منتجات الكافيين" p={p} /><ChipAt y={1450} text="الأدلة لسه محدودة" w={560} hot p={p} /></>) },
  { a: "مستمر", sfx: "ding", r: (p, f) => (<><Place x={540} y={990} s={1.4}><Clock a={f / 9} /></Place><ChipAt text="علاج مستمر طول ما عايز النتيجة" size={46} w={860} hot p={p} /></>) },
]);
// ============================================================ 7. Finasteride
const S7 = mk(7, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><HairGuy kind="bald" /></Place><ChipAt text="علاج تاني بيشتغل على السبب الهرموني" size={44} w={900} p={p} /></>) },
  { a: "فيناسترايد", sfx: "ding", r: (p) => (<><Place x={540} y={990} s={1.7 * p}><MedTablet /></Place><ChipAt text="فيناسترايد (للرجال)" hot p={p} /></>) },
  { a: "ريداكتيز", r: (p) => (<><Place x={540} y={980} s={1.3}><Hexa s={1.0} fill="#CFE0EE" /></Place><ChipAt text="إنزيم 5-alpha reductase" dir="ltr" w={760} size={42} p={p} /></>) },
  { a: "تكون", sfx: "bump", r: (p) => (<><Place x={540} y={980} s={1.5}><Hexa s={1.3} /></Place><Place x={540} y={980} s={2.4 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="بيقلل تكوين DHT" hot p={p} /></>) },
  { a: "التساقط", r: (p) => (<><Place x={540} y={1030} s={1.2}><Follicle size={0.85} len={0.85} /></Place><ChipAt text="يقلل التساقط ويحافظ على الشعر" p={p} /></>) },
  { a: "مناسب", sfx: "bump", r: (p) => (<><Place x={540} y={990} s={1.4}><MedTablet /></Place><Place x={540} y={990} s={2.2 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="مش مناسب لكل شخص" p={p} /></>) },
  { a: "حبه", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.1}><MedTablet /></Place><Place x={540} y={990} s={2.2 * p} o={0.9}><StopHand /></Place><ChipAt text="مش مجرد حبة تاخدها من نفسك" p={p} /></>) },
  { a: "اثار", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.6 * p}><Warn /></Place><ChipAt text="ممكن يسبب آثار جانبية" p={p} /></>) },
  { a: "المزاجيه", r: (p) => (<><Place x={540} y={1000} s={1.15}><PatientM /></Place><ChipAt text="تحذيرات: تغيرات مزاجية" p={p} /></>) },
  { a: "الحمل", r: (p) => (<><Place x={540} y={1010} s={1.15}><PatientF /></Place><Place x={820} y={800} s={1.0 * p}><Warn /></Place><ChipAt text="احتياطات خاصة جدًا في الحمل" p={p} /></>) },
  { a: "تقييم", sfx: "ding", r: (p) => (<><Place x={420} y={1000} s={1.15}><DoctorM /></Place><Place x={820} y={960} s={1.2 * p}><Hospital /></Place><ChipAt text="بعد تقييم طبي ومناقشة المخاطر" size={46} w={860} hot p={p} /></>) },
]);
// ============================================================ 8. Oils and mixtures + microneedling
const S8 = mk(8, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={380} y={1010} s={1.0 * p}><DropperBottle color="#C9B04A" /></Place><Place x={720} y={1000} s={1.1 * p}><Rosemary /></Place></>) },
  { a: "الزيوت", r: (p) => (<><Place x={330} y={1010} s={0.9}><DropperBottle color="#C9B04A" /></Place><Place x={540} y={1050} s={1.0 * p}><Rosemary /></Place><Place x={760} y={1090} s={1.0 * p}><Seeds /></Place><ChipAt text="زيت الروزماري • حبة البركة • الزيتون • اللوز" size={40} w={960} p={p} /></>) },
  { a: "ترطيب", sfx: "drip", r: (p) => (<><Place x={540} y={1000} s={1.5}><Drop color="#9DC9E8" /></Place><ChipAt text="ترطيب وتقليل الجفاف والتكسر" p={p} /></>) },
  { a: "الخلطات", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.1}><ScalpTop hairs={3} recede={1} /></Place><Place x={820} y={800} s={1.5 * p}><QuestionIcon /></Place><ChipAt text="هل بتعالج الصلع الوراثي؟" hot p={p} /></>) },
  { a: "دليل", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.1}><DropperBottle color="#C9B04A" /></Place><Place x={540} y={1000} s={2.3 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="مفيش دليل قوي إنها بتمنع التصغير" size={44} w={880} p={p} /></>) },
  { a: "الدراسات", r: (p) => (<><Place x={420} y={1010} s={1.0}><Rosemary /></Place><Place x={720} y={1030} s={1.0}><Seeds /></Place><ChipAt text="دراسات محدودة… مش كفاية نسميها علاج" size={44} w={900} p={p} /></>) },
  { a: "هديه", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.6 * p}><Gift /></Place><ChipAt text="هدية مني ليك" hot p={p} /></>) },
  { a: "بعض", r: (p) => (<><Place x={420} y={1010} s={1.0}><Rosemary /></Place><Place x={720} y={1030} s={1.0}><Seeds /></Place><ChipAt text="بعض الدراسات: ممكن تحسّن" p={p} /></>) },
  { a: "واسق", sfx: "ding", r: (p) => (<><Place x={540} y={1000} s={1.2}><DropperBottle /></Place><Place x={820} y={780} s={1.0 * p}><CheckIcon /></Place><ChipAt text="اتأكد من مصدر التركيبة" p={p} /></>) },
  { a: "اكليل", r: (p, f, a) => (<>{[<Rosemary key="a" />, <OliveDrop key="b" />, <Seeds key="c" />, <Drop key="d" color="#F0A23B" />].map((n, i) => (<Place key={i} x={200 + i * 230} y={1020} s={0.8 * pop(f, a + i * 25, 12)}>{n}</Place>))}<ChipAt text="إكليل الجبل • اللوز • حبة البركة • الجزر" size={42} w={940} p={p} /></>) },
  { a: "الموضعي", sfx: "pop", r: (p) => (<><Place x={320} y={1000} s={1.1}><DropperBottle /></Place><Place x={760} y={1020} s={1.0}><DropperBottle color="#C9B04A" /></Place><ChipAt text="زيوت أو مينوكسيديل موضعي" p={p} /></>) },
  { a: "مايكرو", sfx: "bump", r: (p) => (<><Place x={300} y={1020} s={1.15 * p}><Roller warn /></Place><Place x={790} y={1000} s={1.0}><ScalpTop hairs={3} recede={1} /></Place><Place x={540} y={1440} s={p}><Chip text="بحذر وبعد استشارة الطبيب: الاستخدام العشوائي ممكن يسبب عدوى أو ندبات" w={960} size={34} fill="#FFF3CF" color={C.warn} /></Place></>) },
]);
// ============================================================ 10. Hair transplant
const S10 = mk(10, [
  { a: "", sfx: "pop", r: (p, f, a) => (<><Place x={540} y={1000} s={1.25}><ScalpTop hairs={2} recede={1} /></Place><Place x={540} y={1180} s={0.8 * p}><Grafts n={6} /></Place></>) },
  { a: "ممتاز", sfx: "ding", r: (p) => (<><Place x={540} y={1000} s={1.25}><ScalpTop hairs={8} recede={0.4} /></Place><Place x={830} y={780} s={1.1 * p}><OkMark p={p} /></Place><ChipAt text="خيار ممتاز لبعض الحالات" p={p} /></>) },
  { a: "اهم", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.5 * p}><Warn /></Place><ChipAt text="أهم نقطة" hot p={p} /></>) },
  { a: "بتنقل", sfx: "whoosh", r: (p, f, a) => (<><Place x={540} y={1000} s={1.2}><ScalpTop hairs={2} recede={1} /></Place><Place x={540 - 20 * L(f, a, 24)} y={1240 - 300 * L(f, a, 28)} s={0.8}><Grafts n={6} /></Place><Place x={540} y={870} s={0.8 * p} r={-90}><Arrow len={160} dashed /></Place><ChipAt text="بتنقل بصيلات من منطقة لأخرى" p={p} /></>) },
  { a: "توقف", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.2}><ScalpTop hairs={3} recede={1} /></Place><Place x={540} y={1000} s={2.2 * p} o={0.9}><XMark p={p} /></Place><ChipAt text="مش بتوقف الصلع في الشعر الأصلي" size={46} w={860} p={p} /></>) },
  { a: "تقييم", r: (p, f, a) => (<><Place x={540} y={880} s={1.0}><DoctorM /></Place>{["تقييم الحالة", "اختيار التوقيت", "خطة الحفاظ على الشعر الموجود"].map((tx, i) => (<Place key={i} x={540} y={1180 + i * 120} s={pop(f, a + i * 40, 12)}><Chip text={tx} w={760} size={42} /></Place>))}</>) },
]);
// ============================================================ 11. The 3 things + closing
const S11 = mk(11, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><HairGuy kind="bald" /></Place><ChipAt text="الخلاصة بقى" hot p={p} /></>) },
  { a: "اولا", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.1}><HairGuy kind="bald" mood={-0.3} /></Place><Place x={820} y={780} s={1.3 * p}><QuestionIcon /></Place><ChipAt text="1) متفترضش إن السبب صلع وراثي" size={44} w={900} p={p} /></>) },
  { a: "ثانيا", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.4 * p}><Magnifier /></Place><ChipAt text="2) اعرف السبب الحقيقي" p={p} /></>) },
  { a: "تستناش", sfx: "bump", r: (p, f, a) => (<><Place x={540} y={1030} s={1.2}><Follicle size={0.9 - 0.55 * prog(f, a, 60)} len={0.9 - 0.55 * prog(f, a, 60)} /></Place><ChipAt text="3) متستناش لحد ما البصيلات تضعف" size={44} w={900} p={p} /></>) },
  { a: "الكومنتات", sfx: "ding", r: (p) => (<><Place x={540} y={980} s={1.8 * p}><QuestionIcon /></Place><ChipAt text="اكتب في التعليقات: الحلقة الجاية؟" hot p={p} /></>) },
]);

export const SCENES_EP06: Record<number, SceneDef> = { 1: S1, 2: S2, 3: S3, 4: S4, 5: S5, 6: S6, 7: S7, 8: S8, 10: S10, 11: S11 };
export const THEME_EP06: Record<number, "curiosity" | "tension" | "hope"> = { 1: "curiosity", 2: "curiosity", 3: "tension", 4: "tension", 5: "hope", 6: "curiosity", 7: "tension", 8: "curiosity", 10: "hope", 11: "hope" };
export const DISCLAIMER_EP06 = "شرح مبسط للتوعية، مش بديل لاستشارة الطبيب أو الصيدلي. المصادر في الوصف.";
export { easeIn, clamp, Hospital, Tablet, Moon, bob };
