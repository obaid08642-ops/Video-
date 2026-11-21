import { Place, QuestionIcon } from "../../assets";
import { Chip } from "../../assets/ep02";
import { Warn, StopHand } from "../../assets/v9";
import { Magnifier, Arrow } from "../../assets/hair";
import { CutePatient } from "../../proto/CharsCute";
import * as I from "../../assets/ep08";
import { clamp, easeIn, bob } from "../../lib/anim";
import { C, FONT } from "../../theme";
import { mk, ChipAt, D, Pt, Big, Cross, Tick, Q, L, type SceneDef } from "./engine08";
export type { SceneDef };
import { Clock, CheckIcon } from "../../assets";
import { Drop } from "../../assets/ep04";
// ============================================================ 1. The story (hook)
const S1 = mk(1, [
  { a: "", sfx: "pop", r: (p) => (<>{Big(p, <I.Cal text="1984" />, 540, 1000, 1.25)}<ChipAt text="أستراليا" w={380} p={p} /></>) },
  { a: "دكتور", sfx: "pop", r: (p) => (<>{D("happy", 540, 1010, 0.85 * (0.8 + 0.2 * p))}<ChipAt text="دكتور شاب" w={440} p={p} /></>) },
  { a: "فكره", r: (p) => (<>{D("explain", 330, 1010, 0.78)}{Big(p, <I.BugC s={0.8} />, 770, 1020, 1)}<ChipAt text="عنده فكرة" w={420} p={p} /></>) },
  { a: "مصدقهاش", sfx: "bump", r: (p) => (<>{D("worried", 540, 1010, 0.8)}{Cross(p, 540, 1000, 2.4)}<ChipAt text="الأطباء مصدقوش" w={560} p={p} /></>) },
  { a: "قرحه", sfx: "pop", r: (p) => (<>{Big(1, <I.StomachC state="ulcer" />, 540, 1000, 1.0)}<ChipAt text="قرحة المعدة" hot p={p} /></>) },
  { a: "جرثومه", sfx: "swell", r: (p, f, a) => (<>{Big(1, <I.StomachC state="ulcer" />, 400, 1010, 0.8)}<Place x={760 - 40 * (1 - L(f, a, 14))} y={1000} s={1.0 * p}><I.BugC mood="evil" s={0.8} wiggle={Math.sin(f / 5) * 8} /></Place><ChipAt text="السبب: جرثومة" hot p={p} /></>) },
  { a: "التوتر", r: (p) => (<><Place x={310} y={1000} s={1.1}><I.StressCloud /></Place><Place x={770} y={1010} s={1.1}><I.Chili /></Place>{Cross(p, 540, 1000, 2.4)}<ChipAt text="مش بس التوتر والأكل الحار" w={780} size={46} p={p} /></>) },
  { a: "محدش", sfx: "bump", r: (p) => (<>{D("worried", 540, 1010, 0.8)}{Cross(p, 540, 1000, 2.4)}<ChipAt text="محدش صدّقه" p={p} /></>) },
  { a: "مجنونه", sfx: "swell", r: (p) => (<>{D("surprised", 540, 1010, 0.85)}<ChipAt text="عمل حاجة مجنونة!" hot p={p} /></>) },
  { a: "منظار", sfx: "pop", r: (p) => (<><Place x={540} y={940} s={1.1}><I.Scope /></Place><Place x={540} y={1190} s={0.6}><I.StomachC state="ok" /></Place><ChipAt text="منظار: معدته سليمة" p={p} /></>) },
  { a: "شرب", sfx: "glass", r: (p, f) => (<>{D("surprised", 330, 1010, 0.8)}<Place x={780} y={1030} s={1.35} r={-6 + Math.sin(f / 8) * 3}><I.GlassBug /></Place><ChipAt text="شرب جرثومة المعدة!" hot p={p} /></>) },
  { a: "ايام", sfx: "tick", r: (p) => (<><Place x={300} y={1010} s={0.95}><I.Cal text="أيام" /></Place><Place x={780} y={1010} s={0.9}><I.StomachC state="red" /></Place></>) },
  { a: "التهاب", r: (p) => (<><Place x={540} y={1000} s={1.0}><I.StomachC state="red" /></Place><ChipAt text="أعراض والتهاب" p={p} /></>) },
  { a: "جايزه", sfx: "ding", r: (p) => (<>{D("happy", 320, 1010, 0.8)}{Big(p, <I.Medal />, 770, 1000, 1.1)}<ChipAt text="جايزة نوبل في الطب" hot p={p} /></>) },
  { a: "القصه", sfx: "pop", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="القصة دي ليها معنى" hot p={p} /></>) },
  { a: "حقيقيه", sfx: "pop", r: (p) => (<><Place x={540} y={1010} s={1.2}><I.BugC /></Place>{Tick(p, 830, 790)}<ChipAt text="جرثومة المعدة حقيقية" hot p={p} /></>) },
  { a: "غلط", sfx: "bump", r: (p) => (<>{D("worried", 330, 1010, 0.8)}<Place x={780} y={1020} s={0.8}><I.BugC /></Place>{Cross(p, 540, 1000, 1.6)}<ChipAt text="اللي الناس بتعمله معاها: غلط" w={780} size={46} p={p} /></>) },
  { a: "ازاي", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><Magnifier /></Place><ChipAt text="إزاي تتشخّص" hot p={p} /></>) },
  { a: "تتعالج", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.5 * p}><I.Pill r={-20} /></Place><ChipAt text="وإزاي تتعالج" hot p={p} /></>) },
  { a: "الخرافات", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Chili /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="والخرافات اللي تسيبها" hot p={p} /></>) },
]);
// ============================================================ 2. Name and spread
const S2 = mk(2, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.25 * p}><I.BugC /></Place><ChipAt text="Helicobacter pylori" dir="ltr" w={720} size={48} hot p={p} /></>) },
  { a: "لولبي", sfx: "shimmer", r: (p, f) => (<><Place x={540} y={1000} s={1.25}><I.BugC wiggle={Math.sin(f / 6) * 14} /></Place><ChipAt text="هيليكو = لولبي" w={560} p={p} /></>) },
  { a: "بايلوري", r: (p) => (<><Place x={540} y={1000} s={1.0}><I.StomachC state="ok" /></Place><Place x={720} y={1150} s={0.5}><Arrow len={110} /></Place><ChipAt text="بايلوري = فتحة المعدة السفلية" w={800} size={44} p={p} /></>) },
  { a: "الحلزوني", r: (p, f) => (<><Place x={540} y={1000} s={1.2}><I.BugC mood="smile" wiggle={Math.sin(f / 6) * 14} /></Place><ChipAt text="المكروب الحلزوني" p={p} /></>) },
  { a: "44", sfx: "swell", r: (p, f, a) => (<><Place x={540} y={990} s={1.05}><I.Pie v={0.44 * L(f, a, 40)} /></Place><Place x={540} y={990}><text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={110} fill={C.ink} stroke={C.bg} strokeWidth={10} paintOrder="stroke" direction="ltr">44%</text></Place><ChipAt text="من سكان العالم" hot p={p} /></>) },
  { a: "قريب", sfx: "pop", r: (p, f, a) => (<><Place x={540} y={990} s={1.05}><I.Pie v={0.44 + 0.06 * L(f, a, 20)} /></Place><ChipAt text="قريب من نص العالم" p={p} /></>) },
  { a: "النسبه", r: (p) => (<>{[0, 1].map((i) => (<Place key={i} x={320 + i * 440} y={1010} s={0.5}><I.Pie v={i ? 0.51 : 0.35} /></Place>))}<ChipAt y={1230} x={320} w={380} size={36} text="الدول المتقدمة 35%" p={p} /><ChipAt y={1230} x={760} w={380} size={36} text="الدول النامية 51%" p={p} /></>) },
  { a: "افريقيا", sfx: "ding", r: (p, f, a) => (<><Place x={540} y={990} s={1.05}><I.Pie v={0.7 * L(f, a, 40)} /></Place><ChipAt text="أفريقيا: تقديرات لحد 70%" hot w={760} size={46} p={p} /></>) },
  { a: "المفاجاه", sfx: "swell", r: (p) => (<>{Pt("happy", 330, 1010, 0.8)}{Big(p, <I.BugC s={0.7} />, 790, 1030)}<ChipAt text="أغلبهم مش حاسين بحاجة" w={700} p={p} /></>) },
  { a: "السؤال", sfx: "pop", r: (p) => (<>{D("worried", 540, 1010, 0.8)}{Q(p, 800, 820)}<ChipAt text="عندي جرثومة ولا لأ؟" p={p} /></>) },
  { a: "مشكله", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="هل عندي مشكلة منها؟" hot p={p} /></>) },
]);
// ============================================================ 3. Symptoms are not proof + alarm signs
const S3 = mk(3, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1010} s={1.4 * p}><I.Belly /></Place><ChipAt text="حرقان • ألم • انتفاخ • غثيان" w={860} size={44} p={p} /></>) },
  { a: "الحموضه", r: (p) => (<>{["الحموضة", "القولون", "المسكنات"].map((x, i) => (<g key={i}><Place x={230 + i * 310} y={1000} s={0.6}><I.Blister /></Place><Place x={230 + i * 310} y={1120}><text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.ink} direction="rtl">{x}</text></Place></g>))}<ChipAt text="نفس الأعراض من أسباب تانية" w={800} size={44} p={p} /></>) },
  { a: "دليل", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Belly /></Place>{Cross(p, 540, 1000, 2.4)}<ChipAt text="الأعراض لوحدها مش دليل" hot p={p} /></>) },
  { a: "علامات", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.5 * p}><Warn /></Place><ChipAt text="علامات متستناش معاها" hot p={p} /></>) },
  { a: "دم", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.4 * p}><I.BloodDrop /></Place><ChipAt text="قيء فيه دم" p={p} /></>) },
  { a: "اسود", r: (p) => (<><Place x={540} y={990} s={1.3}><circle r={70} fill="#3A2F2A" stroke={C.ink} strokeWidth={6} /></Place><ChipAt text="براز أسود" p={p} /></>) },
  { a: "وزن", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.3}><Arrow len={170} /></Place><ChipAt text="نزول وزن من غير سبب" p={p} /></>) },
  { a: "البلع", r: (p) => (<>{Pt("worried", 540, 1010, 0.85)}<ChipAt text="صعوبة في البلع" p={p} /></>) },
  { a: "مستمر", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.StomachC state="red" /></Place><ChipAt text="قيء مستمر" p={p} /></>) },
  { a: "فورا", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="روح للدكتور فورًا" hot p={p} /></>) },
]);
// ============================================================ 4. The blood-test trap + proper tests
const S4 = mk(4, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><I.Tube /></Place><ChipAt text="تحليل الدم: الفخ" hot p={p} /></>) },
  { a: "اجسام", sfx: "pop", r: (p) => (<><Place x={540} y={1010} s={1.3}><I.Tube /></Place><ChipAt text="بيكشف أجسام مضادة" p={p} /></>) },
  { a: "قابل", r: (p) => (<>{D("explain", 320, 1010, 0.8)}<Place x={780} y={1020} s={0.8}><I.BugC /></Place><ChipAt text="جسمك قابل الجرثومة قبل كده" w={800} size={44} p={p} /></>) },
  { a: "موجب", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.Tube /></Place><Place x={770} y={900} s={1.1 * p}><Warn /></Place><ChipAt text="ممكن يفضل «موجب» لسنين" w={760} p={p} /></>) },
  { a: "تتعالج", sfx: "pop", r: (p) => (<><Place x={300} y={1000} s={1.3}><I.Pill r={-15} /></Place><Place x={770} y={1000} s={1.2}><I.Tube /></Place><ChipAt text="حتى بعد العلاج" p={p} /></>) },
  { a: "مصاب", sfx: "swell", r: (p) => (<>{Pt("tired", 540, 1010, 0.85)}{Q(p, 820, 820)}<ChipAt text="مش بيقولك إنك مصاب دلوقتي" w={800} size={44} hot p={p} /></>) },
  { a: "الادق", r: (p) => (<><Place x={540} y={990} s={1.4}><Magnifier /></Place><ChipAt text="التحاليل الأدق للعدوى الحالية" w={820} size={44} p={p} /></>) },
  { a: "النفس", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><I.Breath /></Place><ChipAt text="اختبار النَّفَس" p={p} /></>) },
  { a: "البراز", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><I.Jar /></Place><ChipAt text="تحليل البراز" p={p} /></>) },
  { a: "المنظار", sfx: "pop", r: (p) => (<><Place x={540} y={940} s={1.1 * p}><I.Scope /></Place><ChipAt text="المنظار مع عينة" p={p} /></>) },
  { a: "ادويه", r: (p) => (<>{D("explain", 320, 1010, 0.8, true)}<Place x={780} y={1000} s={1.1}><I.Pill /></Place><ChipAt text="قول للدكتور بتاخد إيه" p={p} /></>) },
  { a: "تغير", sfx: "bump", r: (p) => (<><Place x={300} y={1000} s={1.0}><I.Pill c1="#E7B79C" /></Place><Place x={780} y={1000} s={1.0}><I.Pill c1="#9CC48A" r={20} /></Place><ChipAt text="ممكن تغيّر النتيجة" p={p} /></>) },
  { a: "اسبوعين", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.Cal text="أسبوعين" size={60} /></Place><ChipAt text="وقف أدوية الحموضة" p={p} /></>) },
  { a: "اسابيع", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.Cal text="4 أسابيع" size={64} /></Place><ChipAt text="المضادات الحيوية" p={p} /></>) },
  { a: "يقرر", sfx: "bump", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<Place x={800} y={800} s={1.1 * p}><StopHand /></Place><ChipAt text="الدكتور اللي يقرر" hot p={p} /></>) },
]);
// ============================================================ 5. Treatment
const S5 = mk(5, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.BugC mood="evil" /></Place><ChipAt text="الجرثومة بقت بتقاوم" hot p={p} /></>) },
  { a: "ارشادات", sfx: "pop", r: (p) => (<>{D("explain", 540, 1010, 0.85)}<ChipAt text="الكلية الأمريكية لأمراض الجهاز الهضمي" w={900} size={40} p={p} /></>) },
  { a: "acg", sfx: "ding", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><Chip text="ACG 2024" dir="ltr" w={520} size={80} fill="#FFF3CF" /></Place></>) },
  { a: "رباعيه", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.0}>{[-1, 1].map((x) => [-1, 1].map((y) => (<Place key={`${x}${y}`} x={x * 120} y={y * 80} s={0.9}><I.Pill c1={x * y > 0 ? "#9DC9E8" : "#F7C548"} r={x * 12} /></Place>)))}</Place><ChipAt text="خطة رباعية" hot p={p} /></>) },
  { a: "دوا", sfx: "pop", r: (p) => (<><Place x={540} y={940} s={1.1}><I.StomachC face={false} /></Place><Place x={540} y={1160} s={1.2}><I.Pill c1="#CFE0EE" /></Place><ChipAt text="دوا بيقلل الحمض" p={p} /></>) },
  { a: "تحميه", r: (p) => (<><Place x={540} y={1010} s={1.0}><I.StomachC face={false} /></Place><Place x={540} y={1010} s={2.2 * p} o={0.35}><circle r={110} fill="#9DC9E8" /></Place><ChipAt text="ومادة بتحميه" p={p} /></>) },
  { a: "حيويين", sfx: "pop", r: (p) => (<><Place x={320} y={1000} s={1.2}><I.Pill c1="#E7B79C" r={-15} /></Place><Place x={760} y={1000} s={1.2}><I.Pill c1="#F7C548" r={15} /></Place><ChipAt text="ومضادين حيويين" p={p} /></>) },
  { a: "14", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Cal text="14 يوم" size={80} /></Place><ChipAt text="مع بعض لمدة 14 يوم" hot p={p} /></>) },
  { a: "معروف", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Pill c1="#E7B79C" /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="مضاد قديم شائع: بلاش كأساس" w={780} size={44} p={p} /></>) },
  { a: "حساسه", r: (p) => (<><Place x={540} y={1000} s={1.0}><I.Tube fill="#9CC48A" /></Place>{Tick(p, 780, 840)}<ChipAt text="إلا لو الفحص أثبت حساسيتها له" w={820} size={42} p={p} /></>) },
  { a: "بلدك", sfx: "pop", r: (p) => (<>{D("explain", 540, 1010, 0.85)}<ChipAt text="الخطة حسب بلدك وحالتك" p={p} /></>) },
  { a: "يحددها", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="الدكتور اللي يحددها" hot p={p} /></>) },
  { a: "كمل", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.4 * p}><Warn /></Place><ChipAt text="كمّل الكورس للآخر!" hot p={p} /></>) },
  { a: "نص", sfx: "bump", r: (p, f, a) => (<><Place x={540} y={1000} s={1.15}><I.BugC mood="evil" s={0.7 + 0.3 * L(f, a, 40)} /></Place><ChipAt text="نص كورس = جرثومة أقوى" w={720} hot p={p} /></>) },
  { a: "تحلل", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.Cal text="4 أسابيع" size={64} /></Place><ChipAt text="تحليل تاني بعد العلاج" p={p} /></>) },
  { a: "راحت", sfx: "ding", r: (p) => (<>{D("happy", 540, 1010, 0.85)}{Tick(p, 820, 800)}<ChipAt text="تتأكد إنها راحت" hot p={p} /></>) },
]);
// ============================================================ 6. Food + stress
const S6 = mk(6, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.BugC /></Place>{Q(p, 830, 780)}<ChipAt text="في أكلة بتقتل الجرثومة؟" p={p} /></>) },
  { a: "عسل", sfx: "pop", r: (p) => (<>{[<I.Honey key="a" />, <I.Yogurt key="b" />, <I.Garlic key="c" />, <I.Herb key="d" />].map((n, i) => (<Place key={i} x={190 + i * 233} y={1010} s={0.62}>{n}</Place>))}<ChipAt text="عسل • زبادي • ثوم • أعشاب" w={800} size={46} p={p} /></>) },
  { a: "مفيش", sfx: "bump", r: (p) => (<>{[<I.Honey key="a" />, <I.Yogurt key="b" />, <I.Garlic key="c" />, <I.Herb key="d" />].map((n, i) => (<Place key={i} x={190 + i * 233} y={1010} s={0.62}>{n}</Place>))}{Cross(p, 540, 1010, 3)}<ChipAt text="مفيش أكل ولا عشب أثبت إنه بيعالجها" w={920} size={42} p={p} /></>) },
  { a: "الحار", sfx: "pop", r: (p) => (<><Place x={310} y={1010} s={1.1}><I.Chili /></Place><Place x={770} y={1010} s={1.0}><I.Coffee /></Place><ChipAt text="الأكل الحار والقهوة" p={p} /></>) },
  { a: "سبب", sfx: "bump", r: (p) => (<><Place x={310} y={1010} s={1.1}><I.Chili /></Place><Place x={770} y={1010} s={1.0}><I.Coffee /></Place>{Cross(p, 540, 1000, 2.4)}<ChipAt text="مش هم سبب القرحة" hot p={p} /></>) },
  { a: "يزودوا", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Belly /></Place><ChipAt text="بس ممكن يزودوا الأعراض" w={720} p={p} /></>) },
  { a: "حاجات", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.4 * p}><Warn /></Place><ChipAt text="حاجات بتزوّد المشكلة" hot p={p} /></>) },
  { a: "التدخين", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Cig /></Place><Place x={540} y={1000} s={1.2 * p} o={0.9}><I.NoSign /></Place><ChipAt text="التدخين" p={p} /></>) },
  { a: "المسكنات", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Blister /></Place><ChipAt text="المسكنات الكتير" p={p} /></>) },
  { a: "الملح", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.4}><I.Salt /></Place><ChipAt text="والملح الزيادة" p={p} /></>) },
  { a: "التوتر", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.4}><I.StressCloud /></Place><ChipAt text="والتوتر مش السبب الأساسي" w={720} p={p} /></>) },
  { a: "مساعد", sfx: "ding", r: (p) => (<><Place x={540} y={990} s={1.3}><I.StressCloud /></Place><Place x={540} y={1250} s={0.7}><I.StomachC state="red" face={false} /></Place><ChipAt text="دراسات: عامل مساعد" hot p={p} /></>) },
  { a: "بتمرض", sfx: "pop", r: (p) => (<>{[0, 1, 2, 3, 4].map((i) => (<Place key={i} x={140 + i * 200} y={1010} s={0.45}><CutePatient mood={i === 1 ? "tired" : "happy"} /></Place>))}{Q(p, 540, 800)}<ChipAt text="ليه ناس بتمرض وناس لأ؟" p={p} /></>) },
  { a: "نوع", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.BugC mood="evil" /></Place><ChipAt text="نوع الجرثومة بيفرق" p={p} /></>) },
  { a: "جسمك", r: (p) => (<>{Pt("happy", 540, 1010, 0.85)}<ChipAt text="وجسمك والعوامل التانية" p={p} /></>) },
  { a: "بيأثروا", r: (p) => (<><Place x={310} y={1010} s={0.9}><I.StressCloud /></Place><Place x={770} y={1000} s={0.85}><I.StomachC state="red" /></Place><ChipAt text="الأكل والتوتر بيأثروا على المعدة" w={860} size={44} p={p} /></>) },
  { a: "بيتحدد", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="العلاج بالتحليل والدكتور" hot p={p} /></>) },
]);
// ============================================================ 7. Transmission + kids
const S7 = mk(7, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.BugC /></Place>{Q(p, 830, 780)}<ChipAt text="طريقة العدوى مش محسومة تمامًا" w={860} size={44} p={p} /></>) },
  { a: "بالفم", sfx: "pop", r: (p) => (<>{Pt("happy", 320, 1010, 0.7)}{Pt("happy", 780, 1010, 0.7)}<Place x={540} y={1010} s={0.8}><Arrow len={150} /></Place><ChipAt text="غالبًا بالفم" p={p} /></>) },
  { a: "ملوثين", sfx: "drip", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.WaterBottle /></Place><Place x={540} y={1000} s={0.6}><I.BugC s={0.4} /></Place><ChipAt text="أكل ومياه ملوثين" p={p} /></>) },
  { a: "الحمايه", sfx: "swell", r: (p) => (<>{D("happy", 540, 1010, 0.85)}<ChipAt text="طيب الحماية؟" hot p={p} /></>) },
  { a: "الايدين", sfx: "bubbles", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Soap /></Place><ChipAt text="غسل الإيدين" p={p} /></>) },
  { a: "نضيفين", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.WaterBottle /></Place>{Tick(p, 780, 800)}<ChipAt text="أكل ومياه نضيفين" p={p} /></>) },
  { a: "الاطفال", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place><Place x={540} y={1190} s={0.45}><I.Belly /></Place><ChipAt text="وجع البطن عند الأطفال" p={p} /></>) },
  { a: "جرثومه", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place>{Cross(p, 540, 1000, 1.6)}<ChipAt text="مش دايمًا جرثومة" hot p={p} /></>) },
  { a: "الفحص", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="الفحص والعلاج: قرار طبيب الأطفال" w={880} size={42} hot p={p} /></>) },
]);
// ============================================================ 8. The 3 things
const S8 = mk(8, [
  { a: "", sfx: "swell", r: (p) => (<>{D("happy", 540, 1010, 0.85, true)}<ChipAt text="الخلاصة: 3 حاجات" hot p={p} /></>) },
  { a: "اولا", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><I.Tube /></Place><ChipAt text="1) اتأكد بالتحليل الصح" hot p={p} /></>) },
  { a: "ثانيا", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><I.Pill r={-20} /></Place><ChipAt text="2) كمّل العلاج" hot p={p} /></>) },
  { a: "ثالثا", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3 * p}><I.Breath /></Place><ChipAt text="3) حلّل بعد العلاج" hot p={p} /></>) },
  { a: "الكومنتات", sfx: "ding", r: (p) => (<><Place x={540} y={980} s={1.8 * p}><QuestionIcon /></Place><ChipAt text="اكتب في التعليقات: الحلقة الجاية؟" w={860} size={46} hot p={p} /></>) },
]);
export const SCENES_LONG: Record<number, SceneDef> = { 1: S1, 2: S2, 3: S3, 4: S4, 5: S5, 6: S6, 7: S7, 8: S8 };
export const THEME_EP08: Record<number, "curiosity" | "tension" | "hope"> = { 0: "curiosity", 1: "curiosity", 2: "curiosity", 3: "tension", 4: "tension", 5: "hope", 6: "curiosity", 7: "tension", 8: "hope" };
/** 3D hero bacterium overlays: [line id, x, y, scale] (shown from the line start to its end) */
export const HERO3D: Record<string, [string, number, number, number][]> = { short01_story: [["s1l2", 790, 760, 0.3]], short05_four_drugs: [["s1l2", 540, 700, 0.4]], long: [["s1l6", 790, 760, 0.3], ["s2l5", 800, 700, 0.32], ["s5l1", 540, 700, 0.4]] };
export const DISCLAIMER_EP08 = "شرح مبسط للتوعية، مش بديل لاستشارة الطبيب أو الصيدلي. المصادر في الوصف.";
import { SHORTS } from "./ShortsEp08";
export const sceneDef = (variant: string, id: number): SceneDef => (variant === "long" ? SCENES_LONG[id] : SHORTS[variant]);
export { easeIn, clamp, bob, Clock, CheckIcon, Drop };
