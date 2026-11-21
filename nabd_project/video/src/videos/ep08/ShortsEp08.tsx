// Ep08 Shorts (10): one scene each, beats anchored to the owner's words. Same visual kit as the long video.
import React from "react";
import { Place } from "../../assets";
import { Warn, StopHand } from "../../assets/v9";
import { Magnifier, Arrow } from "../../assets/hair";
import { CutePatient } from "../../proto/CharsCute";
import * as I from "../../assets/ep08";
import { C, FONT } from "../../theme";
import { mk, ChipAt, D, Pt, Big, Cross, Tick, Q, L, type SceneDef } from "./engine08";

const S: Record<string, SceneDef> = {};
S.short01_story = mk(1, [
  { a: "", sfx: "pop", r: (p) => (<>{Big(p, <I.Cal text="1984" />, 540, 1000, 1.25)}</>) },
  { a: "دكتور", sfx: "pop", r: (p) => (<>{D("surprised", 540, 1010, 0.85)}<ChipAt text="دكتور عمل حاجة مجنونة" w={720} hot p={p} /></>) },
  { a: "شرب", sfx: "glass", r: (p, f) => (<>{D("surprised", 330, 1010, 0.8)}<Place x={780} y={1030} s={1.35} r={-6 + Math.sin(f / 8) * 3}><I.GlassBug /></Place><ChipAt text="شرب جرثومة المعدة!" hot p={p} /></>) },
  { a: "نوبل", sfx: "ding", r: (p) => (<>{D("happy", 320, 1010, 0.8)}{Big(p, <I.Medal />, 770, 1000, 1.1)}<ChipAt text="وخد عليها نوبل في الطب" hot p={p} /></>) },
  { a: "قرحه", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.0}><I.StomachC state="ulcer" /></Place><ChipAt text="ليه؟ قرحة المعدة" p={p} /></>) },
  { a: "جرثومه", sfx: "swell", r: (p, f, a) => (<><Place x={400} y={1010} s={0.8}><I.StomachC state="ulcer" /></Place><Place x={760 - 40 * (1 - L(f, a, 14))} y={1000} s={p}><I.BugC mood="evil" s={0.8} wiggle={Math.sin(f / 5) * 8} /></Place><ChipAt text="سببها الأساسي: جرثومة" w={720} hot p={p} /></>) },
  { a: "التوتر", r: (p) => (<><Place x={310} y={1000} s={1.1}><I.StressCloud /></Place><Place x={770} y={1010} s={1.1}><I.Chili /></Place>{Cross(p, 540, 1000, 2.4)}<ChipAt text="مش بس التوتر والأكل الحار" w={780} size={46} p={p} /></>) },
  { a: "صدقوهوش", sfx: "bump", r: (p) => (<>{D("worried", 540, 1010, 0.8)}{Cross(p, 540, 1000, 2.4)}<ChipAt text="الأطباء ما صدّقوهوش" p={p} /></>) },
  { a: "منظار", sfx: "pop", r: (p) => (<><Place x={540} y={940} s={1.1}><I.Scope /></Place><Place x={540} y={1190} s={0.6}><I.StomachC state="ok" /></Place><ChipAt text="منظار: معدته سليمة" p={p} /></>) },
  { a: "شرب", sfx: "glass", r: (p, f) => (<>{D("surprised", 330, 1010, 0.8)}<Place x={780} y={1030} s={1.35} r={-6 + Math.sin(f / 8) * 3}><I.GlassBug /></Place></>) },
  { a: "التهاب", r: (p) => (<><Place x={540} y={1000} s={1.0}><I.StomachC state="red" /></Place><ChipAt text="أعراض والتهاب" p={p} /></>) },
  { a: "نوبل", sfx: "ding", r: (p) => (<>{Big(p, <I.Medal />, 540, 1000, 1.3)}<ChipAt text="هو وزميله: نوبل في الطب" w={720} hot p={p} /></>) },
  { a: "ابعتها", sfx: "swell", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="ابعتها لحد لسه فاكر إنها من التوتر" w={880} size={42} hot p={p} /></>) },
]);
S.short02_data = mk(1, [
  { a: "", sfx: "swell", r: (p, f, a) => (<><Place x={540} y={990} s={1.05}><I.Pie v={0.5 * L(f, a, 30)} /></Place><ChipAt text="نص سكان العالم" hot p={p} /></>) },
  { a: "مش", sfx: "pop", r: (p) => (<>{[0, 1, 2, 3, 4].map((i) => (<Place key={i} x={140 + i * 200} y={1010} s={0.45}><CutePatient mood="happy" /></Place>))}{Q(p, 540, 800)}<ChipAt text="وأغلبهم مش عارف" p={p} /></>) },
  { a: "44", sfx: "ding", r: (p, f, a) => (<><Place x={540} y={990} s={1.05}><I.Pie v={0.44 * L(f, a, 40)} /></Place><Place x={540} y={990}><text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={110} fill={C.ink} stroke={C.bg} strokeWidth={10} paintOrder="stroke" direction="ltr">44%</text></Place><ChipAt text="من سكان العالم" hot p={p} /></>) },
  { a: "النامية", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.0}><I.Pie v={0.51} /></Place><ChipAt text="الدول النامية: نسبة أعلى" w={720} p={p} /></>) },
  { a: "افريقيا", sfx: "ding", r: (p, f, a) => (<><Place x={540} y={990} s={1.05}><I.Pie v={0.7 * L(f, a, 40)} /></Place><ChipAt text="أفريقيا: تقديرات لحد 70%" hot w={760} size={46} p={p} /></>) },
  { a: "51", sfx: "pop", r: (p) => (<>{[0, 1].map((i) => (<Place key={i} x={320 + i * 440} y={1010} s={0.5}><I.Pie v={i ? 0.35 : 0.51} /></Place>))}<ChipAt y={1230} x={320} w={380} size={36} text="النامية 51%" p={p} /><ChipAt y={1230} x={760} w={380} size={36} text="المتقدمة 35%" p={p} /></>) },
  { a: "المفاجاه", sfx: "swell", r: (p) => (<>{Pt("happy", 330, 1010, 0.8)}{Big(p, <I.BugC s={0.7} />, 790, 1030)}<ChipAt text="أغلبهم مش حاسين بحاجة" w={700} p={p} /></>) },
  { a: "التهابات", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.0}><I.StomachC state="ulcer" /></Place><ChipAt text="عند بعضهم: التهاب وقرحة" w={780} p={p} /></>) },
  { a: "السؤال", sfx: "pop", r: (p) => (<>{D("worried", 540, 1010, 0.8)}{Q(p, 800, 820)}<ChipAt text="عندي جرثومة ولا لأ؟" p={p} /></>) },
  { a: "مشكله", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="هل عندي مشكلة منها؟" hot p={p} /></>) },
]);
S.short03_blood_test = mk(1, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><I.Tube /></Place><ChipAt text="تحليل الجرثومة طلع موجب؟" hot p={p} /></>) },
  { a: "استني", sfx: "bump", r: (p) => (<><Place x={540} y={990} s={1.5 * p}><StopHand /></Place><ChipAt text="استنى!" hot p={p} /></>) },
  { a: "اجسام", sfx: "pop", r: (p) => (<><Place x={540} y={1010} s={1.3}><I.Tube /></Place><ChipAt text="بيكشف أجسام مضادة" p={p} /></>) },
  { a: "قابل", r: (p) => (<>{D("explain", 320, 1010, 0.8)}<Place x={780} y={1020} s={0.8}><I.BugC /></Place><ChipAt text="جسمك قابل الجرثومة قبل كده" w={800} size={44} p={p} /></>) },
  { a: "موجب", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.Tube /></Place><Place x={770} y={900} s={1.1 * p}><Warn /></Place><ChipAt text="ممكن يفضل «موجب» لسنين" w={760} p={p} /></>) },
  { a: "تتعالج", r: (p) => (<><Place x={300} y={1000} s={1.3}><I.Pill r={-15} /></Place><Place x={770} y={1000} s={1.2}><I.Tube /></Place><ChipAt text="حتى بعد العلاج" p={p} /></>) },
  { a: "مصاب", sfx: "swell", r: (p) => (<>{Pt("tired", 540, 1010, 0.85)}{Q(p, 820, 820)}<ChipAt text="مش بيقولك إنك مصاب دلوقتي" w={800} size={44} hot p={p} /></>) },
  { a: "الادق", r: (p) => (<><Place x={540} y={990} s={1.4}><Magnifier /></Place><ChipAt text="التحليل الأدق للعدوى الحالية" w={820} size={44} p={p} /></>) },
  { a: "النفس", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><I.Breath /></Place><ChipAt text="اختبار النَّفَس" p={p} /></>) },
  { a: "البراز", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><I.Jar /></Place><ChipAt text="وتحليل البراز" p={p} /></>) },
  { a: "95", sfx: "ding", r: (p, f, a) => (<><Place x={540} y={990} s={1.0}><I.Pie v={0.95 * L(f, a, 30)} /></Place><ChipAt text="دقتهم عالية في أغلب المصادر" w={800} size={44} p={p} /></>) },
  { a: "وقف", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.Cal text="أسبوعين" size={60} /></Place><ChipAt text="وقف أدوية الحموضة قبلها (بإذن الدكتور)" w={900} size={38} p={p} /></>) },
  { a: "توقف", sfx: "bump", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<Place x={800} y={800} s={1.1 * p}><StopHand /></Place><ChipAt text="ما توقفش حاجة من نفسك" hot p={p} /></>) },
  { a: "ابعتها", r: (p) => (<>{D("happy", 540, 1010, 0.85, true)}<ChipAt text="ابعتها لحد تحليله موجب" hot p={p} /></>) },
]);
S.short04_alarm_signs = mk(1, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.6 * p}><Warn /></Place><ChipAt text="5 علامات ممنوع تتجاهلها" hot p={p} /></>) },
  { a: "قيء", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.4 * p}><I.BloodDrop /></Place><ChipAt text="1) قيء فيه دم" p={p} /></>) },
  { a: "براز", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.3}><circle r={70} fill="#3A2F2A" stroke={C.ink} strokeWidth={6} /></Place><ChipAt text="2) براز أسود" p={p} /></>) },
  { a: "نزول", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.3}><Arrow len={170} /></Place><ChipAt text="3) نزول وزن من غير سبب" p={p} /></>) },
  { a: "البلع", sfx: "pop", r: (p) => (<>{Pt("worried", 540, 1010, 0.85)}<ChipAt text="4) صعوبة في البلع" p={p} /></>) },
  { a: "مستمر", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.StomachC state="red" /></Place><ChipAt text="5) قيء مستمر" p={p} /></>) },
  { a: "نزيف", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.3}><I.BloodDrop /></Place><ChipAt text="ممكن يدل على نزيف" hot p={p} /></>) },
  { a: "فورا", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="روح للدكتور فورًا" hot p={p} /></>) },
  { a: "جرثومه", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.BugC /></Place>{Q(p, 830, 780)}<ChipAt text="ومش لازم تكون جرثومة" p={p} /></>) },
  { a: "تتفحص", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.4}><Magnifier /></Place><ChipAt text="بس لازم تتفحص" hot p={p} /></>) },
  { a: "تشخص", sfx: "bump", r: (p) => (<>{D("worried", 540, 1010, 0.8)}{Cross(p, 540, 1000, 2.4)}<ChipAt text="متشخّصش نفسك بالأعراض" w={720} p={p} /></>) },
]);
S.short05_four_drugs = mk(1, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.0}>{[-1, 1].map((x) => [-1, 1].map((y) => (<Place key={`${x}${y}`} x={x * 120} y={y * 80} s={0.9}><I.Pill c1={x * y > 0 ? "#9DC9E8" : "#F7C548"} r={x * 12} /></Place>)))}</Place><ChipAt text="ليه 4 أدوية مش واحد؟" hot p={p} /></>) },
  { a: "تقاوم", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.BugC mood="evil" /></Place><ChipAt text="الجرثومة بقت بتقاوم" hot p={p} /></>) },
  { a: "ارشادات", sfx: "pop", r: (p) => (<>{D("explain", 540, 1010, 0.85)}<ChipAt text="الكلية الأمريكية لأمراض الجهاز الهضمي" w={900} size={40} p={p} /></>) },
  { a: "acg", sfx: "ding", r: (p) => (<>{Big(p, <Chip2 />, 540, 1000, 1.3)}</>) },
  { a: "14", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Cal text="14 يوم" size={80} /></Place><ChipAt text="4 مكونات لمدة 14 يوم" hot p={p} /></>) },
  { a: "يقلل", sfx: "pop", r: (p) => (<><Place x={540} y={940} s={1.1}><I.StomachC face={false} /></Place><Place x={540} y={1160} s={1.2}><I.Pill c1="#CFE0EE" /></Place><ChipAt text="دوا بيقلل الحمض" p={p} /></>) },
  { a: "تحمي", r: (p) => (<><Place x={540} y={1010} s={1.0}><I.StomachC face={false} /></Place><Place x={540} y={1010} s={2.2 * p} o={0.35}><circle r={110} fill="#9DC9E8" /></Place><ChipAt text="ومادة بتحمي المعدة" p={p} /></>) },
  { a: "حيوين", sfx: "pop", r: (p) => (<><Place x={320} y={1000} s={1.2}><I.Pill c1="#E7B79C" r={-15} /></Place><Place x={760} y={1000} s={1.2}><I.Pill c1="#F7C548" r={15} /></Place><ChipAt text="ومضادين حيويين" p={p} /></>) },
  { a: "بلدك", sfx: "pop", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="الخطة حسب بلدك وحالتك" hot p={p} /></>) },
  { a: "كمل", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.4 * p}><Warn /></Place><ChipAt text="كمّل الكورس للآخر!" hot p={p} /></>) },
  { a: "نص", sfx: "bump", r: (p, f, a) => (<><Place x={540} y={1000} s={1.15}><I.BugC mood="evil" s={0.7 + 0.3 * L(f, a, 40)} /></Place><ChipAt text="نص كورس = جرثومة أقوى" w={720} hot p={p} /></>) },
]);
S.short06_food = mk(1, [
  { a: "", sfx: "pop", r: (p) => (<>{[<I.Honey key="a" />, <I.Yogurt key="b" />, <I.Garlic key="c" />].map((n, i) => (<Place key={i} x={230 + i * 310} y={1010} s={0.8}>{n}</Place>))}<ChipAt text="عسل وزبادي وثوم بيقتلوا الجرثومة؟" w={900} size={42} hot p={p} /></>) },
  { a: "مفيش", sfx: "bump", r: (p) => (<>{[<I.Honey key="a" />, <I.Yogurt key="b" />, <I.Garlic key="c" />, <I.Herb key="d" />].map((n, i) => (<Place key={i} x={190 + i * 233} y={1010} s={0.62}>{n}</Place>))}{Cross(p, 540, 1010, 3)}<ChipAt text="مفيش أكل ولا عشب أثبت إنه بيعالجها" w={920} size={42} p={p} /></>) },
  { a: "الحار", sfx: "pop", r: (p) => (<><Place x={310} y={1010} s={1.1}><I.Chili /></Place><Place x={770} y={1010} s={1.0}><I.Coffee /></Place><ChipAt text="الأكل الحار والقهوة" p={p} /></>) },
  { a: "سبب", sfx: "bump", r: (p) => (<><Place x={310} y={1010} s={1.1}><I.Chili /></Place><Place x={770} y={1010} s={1.0}><I.Coffee /></Place>{Cross(p, 540, 1000, 2.4)}<ChipAt text="مش هم سبب القرحة" hot p={p} /></>) },
  { a: "يزودوا", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Belly /></Place><ChipAt text="بس ممكن يزودوا الأعراض" w={720} p={p} /></>) },
  { a: "عوامل", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.4 * p}><Warn /></Place><ChipAt text="عوامل بتزوّد المشكلة" hot p={p} /></>) },
  { a: "التدخين", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Cig /></Place><Place x={540} y={1000} s={1.2 * p} o={0.9}><I.NoSign /></Place><ChipAt text="التدخين" p={p} /></>) },
  { a: "المسكنات", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Blister /></Place><ChipAt text="المسكنات الكتير" p={p} /></>) },
  { a: "الملح", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.4}><I.Salt /></Place><ChipAt text="والملح الزيادة" p={p} /></>) },
  { a: "يخفف", r: (p) => (<>{Pt("happy", 540, 1010, 0.85)}<ChipAt text="الأكل بيخفّف الأعراض بس" w={720} p={p} /></>) },
  { a: "بالتحليل", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="العلاج بالتحليل والدكتور" hot p={p} /></>) },
]);
S.short07_old_myth = mk(1, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.2}><I.StomachC state="ulcer" /></Place><Place x={800} y={760} s={1.1}><I.StressCloud /></Place><ChipAt text="القرحة سببها التوتر؟" hot p={p} /></>) },
  { a: "بالزبط", sfx: "bump", r: (p) => (<><Place x={540} y={990} s={1.2}><I.StressCloud /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="مش بالظبط كده" p={p} /></>) },
  { a: "القديم", sfx: "pop", r: (p) => (<><Place x={310} y={1000} s={1.0}><I.StressCloud /></Place><Place x={770} y={1010} s={1.0}><I.Chili /></Place><ChipAt text="الاعتقاد القديم: توتر وأكل حار" w={780} p={p} /></>) },
  { a: "اتضح", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><I.BugC mood="evil" /></Place><ChipAt text="السبب الأساسي: جرثومة المعدة" w={820} hot p={p} /></>) },
  { a: "المسكنات", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Blister /></Place><ChipAt text="ومعاها المسكنات (لو كتير)" w={720} p={p} /></>) },
  { a: "التوتر", r: (p) => (<><Place x={540} y={990} s={1.3}><I.StressCloud /></Place><ChipAt text="التوتر: عامل مساعد مش أساسي" w={780} size={44} p={p} /></>) },
  { a: "العلاج", sfx: "ding", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Pill r={-20} /></Place><ChipAt text="واتغيّر العلاج" hot p={p} /></>) },
  { a: "بنعالج", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.BugC /></Place>{Cross(p, 540, 1000, 1.8)}<ChipAt text="بنعالج الجرثومة مش بس الحموضة" w={820} size={44} p={p} /></>) },
  { a: "نوبل", sfx: "ding", r: (p) => (<>{D("happy", 320, 1010, 0.8)}{Big(p, <I.Medal />, 770, 1000, 1.1)}<ChipAt text="واللي اكتشف ده خد نوبل" hot p={p} /></>) },
]);
S.short07b_stress = mk(1, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.3}><I.StressCloud /></Place><Place x={540} y={1230} s={0.6}><I.StomachC state="red" face={false} /></Place><ChipAt text="التوتر ممكن يضر معدتك" hot p={p} /></>) },
  { a: "لوحده", sfx: "bump", r: (p) => (<><Place x={540} y={990} s={1.2}><I.StressCloud /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="بس مش لوحده" p={p} /></>) },
  { a: "الاساسي", r: (p) => (<><Place x={320} y={1000} s={1.0}><I.BugC /></Place><Place x={770} y={1000} s={0.8}><I.Blister /></Place><ChipAt text="الأساس: الجرثومة والمسكنات" w={780} p={p} /></>) },
  { a: "دراسه", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Cal text="سنين" /></Place><ChipAt text="دراسة سكانية في الدنمارك" w={720} p={p} /></>) },
  { a: "ضعف", sfx: "ding", r: (p, f, a) => (<><Place x={540} y={1000} s={1.0}><I.Pie v={0.5 * L(f, a, 30)} /></Place><ChipAt text="أعلى توتر ≈ ضعف خطر القرحة تقريبًا" w={900} size={40} hot p={p} /></>) },
  { a: "مساعد", r: (p) => (<><Place x={540} y={990} s={1.3}><I.StressCloud /></Place><ChipAt text="عامل مساعد مش المتسبب لوحده" w={780} p={p} /></>) },
  { a: "حموضه", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.StomachC state="red" /></Place><ChipAt text="بيأثر: زيادة حموضة" p={p} /></>) },
  { a: "سلوكيات", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Cig /></Place><Place x={540} y={1000} s={1.2} o={0.9}><I.NoSign /></Place><ChipAt text="وسلوكيات: تدخين وقلة نوم" w={780} p={p} /></>) },
  { a: "تتعالجش", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Chili /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="متعالجش التوتر بالأكل" p={p} /></>) },
  { a: "بالتحليل", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="العلاج بالتحليل والدكتور" hot p={p} /></>) },
]);
S.short07c_why_some_get_sick = mk(1, [
  { a: "", sfx: "swell", r: (p) => (<>{[0, 1, 2, 3, 4].map((i) => (<Place key={i} x={140 + i * 200} y={1010} s={0.45}><CutePatient mood={i === 1 || i === 3 ? "tired" : "happy"} /></Place>))}<ChipAt text="ساكنة عند ناس.. وبتضرب عند ناس" w={880} size={44} hot p={p} /></>) },
  { a: "اغلب", sfx: "pop", r: (p) => (<>{Pt("happy", 330, 1010, 0.8)}<Place x={780} y={1030} s={0.8}><I.BugC /></Place><ChipAt text="أغلبهم بيمرضوش" p={p} /></>) },
  { a: "نوع", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.BugC mood="evil" /></Place><ChipAt text="نوع الجرثومة بيفرق" p={p} /></>) },
  { a: "سلالات", sfx: "pop", r: (p) => (<><Place x={310} y={1000} s={0.8}><I.BugC /></Place><Place x={770} y={1000} s={0.8}><I.BugC mood="evil" /></Place><ChipAt text="فيه سلالات أخطر من غيرها" w={780} p={p} /></>) },
  { a: "جسمك", r: (p) => (<>{Pt("happy", 540, 1010, 0.85)}<ChipAt text="وجسمك والعوامل التانية" p={p} /></>) },
  { a: "التدخين", sfx: "pop", r: (p) => (<><Place x={310} y={1000} s={0.9}><I.Cig /></Place><Place x={540} y={1000} s={0.9}><I.Blister /></Place><Place x={780} y={1000} s={0.9}><I.Salt /></Place><ChipAt text="تدخين • مسكنات • ملح زيادة" w={820} size={44} p={p} /></>) },
  { a: "كاج", sfx: "ding", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.BugC mood="evil" /></Place><ChipAt text="سلالات بتحمل عامل CagA" dir="rtl" w={780} size={44} hot p={p} /></>) },
  { a: "اشد", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.StomachC state="ulcer" /></Place><ChipAt text="مرتبطة بأمراض أشد" p={p} /></>) },
  { a: "يحدد", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="الدكتور يحدد إمتى يعالج" hot p={p} /></>) },
]);
S.short08_children = mk(1, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.BugC /></Place><ChipAt text="جرثومة المعدة معدية؟" hot p={p} /></>) },
  { a: "طفلك", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place><Place x={540} y={1190} s={0.45}><I.Belly /></Place><ChipAt text="وجع بطن طفلك = جرثومة؟" w={760} p={p} /></>) },
  { a: "محسومه", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.BugC /></Place>{Q(p, 830, 780)}<ChipAt text="طريقة العدوى مش محسومة" w={760} p={p} /></>) },
  { a: "بالفم", sfx: "pop", r: (p) => (<>{Pt("happy", 320, 1010, 0.7)}{Pt("happy", 780, 1010, 0.7)}<Place x={540} y={1010} s={0.8}><Arrow len={150} /></Place><ChipAt text="غالبًا بالفم" p={p} /></>) },
  { a: "ملوثين", sfx: "drip", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.WaterBottle /></Place><ChipAt text="أكل ومية ملوثين" p={p} /></>) },
  { a: "الايدين", sfx: "bubbles", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Soap /></Place><ChipAt text="غسل الإيدين" p={p} /></>) },
  { a: "نظيفه", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.WaterBottle /></Place>{Tick(p, 780, 800)}<ChipAt text="أكل ومية نضيفين" p={p} /></>) },
  { a: "الاطفال", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place><ChipAt text="عند الأطفال" p={p} /></>) },
  { a: "جرثومه", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place>{Cross(p, 540, 1000, 1.6)}<ChipAt text="وجع البطن مش دايمًا جرثومة" w={780} hot p={p} /></>) },
  { a: "الفحص", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="القرار عند طبيب الأطفال" hot p={p} /></>) },
  { a: "عشوائي", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Tube /></Place>{Cross(p, 540, 1000, 2)}<ChipAt text="بلاش تحليل عشوائي" p={p} /></>) },
]);
const Chip2: React.FC = () => (<g><rect x={-260} y={-60} width={520} height={120} rx={44} fill="#FFF3CF" stroke={C.ink} strokeWidth={6} /><text y={26} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={80} fill={C.key} direction="ltr">ACG 2024</text></g>);
export const SHORTS = S;
export const SHORT_HERO: Record<string, [string, number, number, number][]> = {};
