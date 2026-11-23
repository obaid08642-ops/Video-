// Ep07 (cold / flu / cough). Long video: 8 scenes. Same engine and kit as Ep08 (cute doctor/patient + flat icons).
import { Place, QuestionIcon, CheckIcon } from "../../assets";
import { Warn, StopHand } from "../../assets/v9";
import { Magnifier, Arrow } from "../../assets/hair";
import { Thermo } from "../../assets/ep04";
import { Virus, Bacterium } from "../../assets";
import { Moon } from "../../assets/more";
import * as I from "../../assets/ep08";
import * as J from "../../assets/ep07";
import { FONT, C } from "../../theme";
import { mk, ChipAt, D, Pt, Cross, Tick, Q, L, type SceneDef } from "../ep08/engine08";
import { SHORTS07 } from "./ShortsEp07";
export type { SceneDef };

export const S1 = mk(1, [
  { a: "", sfx: "pop", r: (p) => (<>{Pt("tired", 540, 1010, 0.9)}<ChipAt text="نزلة البرد: مفيش علاج" hot p={p} /></>) },
  { a: "ايوة", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.4}><I.Pill r={-20} /></Place>{Cross(p, 540, 1000, 2.4)}<ChipAt text="مفيش دوا بيشفيها" hot p={p} /></>) },
  { a: "الجسم", sfx: "pop", r: (p) => (<>{Pt("happy", 540, 1010, 0.9)}{Tick(p, 820, 800)}<ChipAt text="الجسم هو اللي بيتعافى" p={p} /></>) },
  { a: "بنشتريه", sfx: "pop", r: (p) => (<><Place x={250} y={1020} s={1.1}><J.Syrup /></Place><Place x={540} y={1030} s={1.1}><I.Blister /></Place><Place x={830} y={1020} s={1.0}><I.Pill r={15} /></Place><ChipAt text="إيه اللي بنشتريه من الصيدلية؟" w={820} size={46} p={p} /></>) },
  { a: "المضاد", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.4}><I.Pill c1="#E7B79C" r={-12} /></Place>{Q(p, 800, 790)}<ChipAt text="هل المضاد الحيوي بيفيد؟" p={p} /></>) },
  { a: "شراب", sfx: "pop", r: (p) => (<><Place x={330} y={1010} s={1.2}><J.Syrup /></Place><Place x={760} y={1010} s={1.2}><I.Honey /></Place><ChipAt text="شراب الكحة • فيتامين سي" p={p} /></>) },
  { a: "هقولك", sfx: "swell", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="اللي بينفع • واللي مالوش لازمة" w={780} hot p={p} /></>) },
  { a: "تضيع", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><J.Coin /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="اللي تضيّع عليه فلوسك" p={p} /></>) },
  { a: "وامتى", sfx: "pop", r: (p) => (<>{D("worried", 540, 1010, 0.8)}<Place x={800} y={800} s={1.1 * p}><Warn /></Place><ChipAt text="وإمتى تروح للدكتور" p={p} /></>) },
  { a: "استنى", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.3}><J.Bed /></Place><ChipAt text="استنى لآخر الحلقة… " hot p={p} /></>) },
  { a: "اكتر", sfx: "ding", r: (p) => (<><Place x={540} y={1000} s={1.8 * p}><QuestionIcon /></Place><ChipAt text="في حاجة بتحميك أكتر من أي دوا" w={820} size={46} hot p={p} /></>) },
]);
export const S2 = mk(2, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.4}><Thermo level={0.25} /></Place><ChipAt text="البرد: بيبدأ بالتدريج" hot p={p} /></>) },
  { a: "رشحه", sfx: "pop", r: (p) => (<><Place x={540} y={1010} s={1.3}><J.Tissue /></Place><ChipAt text="رشح • عطس • حلق بيوجع" p={p} /></>) },
  { a: "الانفلونزا", sfx: "bump", r: (p) => (<><Place x={540} y={990} s={1.4}><Thermo level={0.9} /></Place><ChipAt text="الأنفلونزا: فجأة" hot p={p} /></>) },
  { a: "سخونه", r: (p) => (<>{Pt("tired", 540, 1010, 0.9)}<ChipAt text="سخونة • وجع جسم • تعب كبير" p={p} /></>) },
  { a: "الاعراض", sfx: "pop", r: (p) => (<><Place x={320} y={1010} s={0.8}><Thermo level={0.25} /></Place><Place x={780} y={1010} s={0.8}><Thermo level={0.9} /></Place>{Q(p, 540, 800)}<ChipAt text="الأعراض بتتشابه" p={p} /></>) },
  { a: "التحليل", sfx: "ding", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Tube /></Place><ChipAt text="التحليل هو اللي بيأكد" hot p={p} /></>) },
  { a: "اسبوع", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.Cal text="أسبوع" size={90} /></Place><ChipAt text="غالبًا بتخف في أسبوع لعشرة أيام" w={800} size={44} p={p} /></>) },
  { a: "ثلاث", r: (p) => (<>{Pt("happy", 300, 1010, 0.7)}{Pt("tired", 780, 1010, 0.7)}<ChipAt text="بتختلف من شخص لشخص" p={p} /></>) },
  { a: "الكحه", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.Cal text="أسابيع" size={80} /></Place><ChipAt text="الكحة ممكن تكمّل أسابيع" p={p} /></>) },
]);
export const S3 = mk(3, [
  { a: "", sfx: "pop", r: (p, f) => (<><Place x={540} y={1000} s={1.3}><Virus spin={f / 20} /></Place><ChipAt text="أغلب النزلات: فيروسات" hot p={p} /></>) },
  { a: "المضاد", sfx: "pop", r: (p) => (<><Place x={300} y={1010} s={1.2}><I.Pill c1="#E7B79C" /></Place><Place x={780} y={1010} s={1.1}><Bacterium /></Place><ChipAt text="المضاد: على البكتيريا بس" p={p} /></>) },
  { a: "غير", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.4 * p}><Warn /></Place><ChipAt text="من غير داعي: آثار جانبية ومقاومة" w={880} size={44} p={p} /></>) },
  { a: "لون", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.4}><J.Mucus /></Place><ChipAt text="لون البلغم لوحده مش دليل" hot p={p} /></>) },
  { a: "الدكتور", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="لو بكتيريا بعد الفحص: الدكتور يقرر" w={880} size={44} hot p={p} /></>) },
]);
export const S4 = mk(4, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={330} y={1010} s={1.2}><J.Mug /></Place><Place x={770} y={1010} s={1.2}><I.WaterBottle /></Place><ChipAt text="راحة • سوائل • مشروبات دافية" w={820} size={46} p={p} /></>) },
  { a: "والنوم", sfx: "swell", r: (p) => (<><Place x={540} y={1010} s={1.3}><J.Bed /></Place><ChipAt text="6 ساعات نوم أو أقل = 4 أضعاف" w={820} size={46} hot p={p} /></>) },
  { a: "غسول", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.WaterBottle /></Place><ChipAt text="غسول الأنف بمحلول ملحي" p={p} /></>) },
  { a: "مياه", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><J.Tap /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="مش مياه الحنفية مباشرة" hot p={p} /></>) },
  { a: "والعسل", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Honey /></Place>{Tick(p, 820, 800)}<ChipAt text="العسل: فوق سنة" p={p} /></>) },
  { a: "تحت", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Honey /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="تحت سنة: ممنوع" hot p={p} /></>) },
]);
export const S5 = mk(5, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><J.Syrup /></Place><ChipAt text="أشربة الكحة: بتخفف الأعراض بس" w={860} size={44} p={p} /></>) },
  { a: "الادله", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.2}><J.Syrup /></Place>{Cross(p, 540, 1000, 1.8)}<ChipAt text="أدلة تقصير الكحة ضعيفة" p={p} /></>) },
  { a: "للاطفال", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place>{Cross(p, 540, 1000, 1.6)}<ChipAt text="تحت سنتين: ممنوع" hot p={p} /></>) },
  { a: "ومكملات", sfx: "pop", r: (p) => (<>{D("explain", 540, 1010, 0.85)}<ChipAt text="مكملات المناعة؟" p={p} /></>) },
  { a: "فيتامين", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Pie v={0.14} /></Place><ChipAt text="فيتامين سي المنتظم: يقصّر شوية" w={820} size={44} p={p} /></>) },
  { a: "الزنك", r: (p) => (<>{Q(p, 540, 900)}<ChipAt text="الزنك: الأدلة مختلف عليها" p={p} /></>) },
  { a: "والاشناسيه", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Herb /></Place><ChipAt text="د والإشناسية: أدلة ضعيفة" p={p} /></>) },
  { a: "لازم", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="مش لازم مكمل طول الشتا" hot p={p} /></>) },
]);
export const S6 = mk(6, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.6 * p}><Warn /></Place><ChipAt text="إمتى تروح للدكتور؟" hot p={p} /></>) },
  { a: "للكبار", sfx: "pop", r: (p) => (<>{Pt("worried", 540, 1010, 0.85)}<ChipAt text="ضيق تنفس • ألم صدر • دوخة • تشوش" w={900} size={42} p={p} /></>) },
  { a: "للاطفال", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place><ChipAt text="تنفس سريع • شفايف زرقا • مش بيشرب" w={900} size={42} p={p} /></>) },
  { a: "والرضيع", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.4}><Thermo level={0.9} /></Place><ChipAt text="رضيع تحت 3 شهور + سخونة: دكتور فورًا" w={900} size={42} hot p={p} /></>) },
  { a: "والكحه", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.Cal text="3 أسابيع" size={64} /></Place><ChipAt text="كحة أكتر من 3 أسابيع: دكتور" p={p} /></>) },
]);
export const S7 = mk(7, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><Moon /></Place><ChipAt text="الجو البارد؟" hot p={p} /></>) },
  { a: "فيروس", sfx: "bump", r: (p, f) => (<><Place x={540} y={1000} s={1.3}><Virus spin={f / 20} /></Place><ChipAt text="السبب فيروس، مش الهوا نفسه" w={780} hot p={p} /></>) },
  { a: "الاطفال", sfx: "pop", r: (p) => (<>{[0, 1, 2, 3].map((i) => (<Place key={i} x={190 + i * 233} y={1010} s={0.6}><I.KidHead /></Place>))}<ChipAt text="الأطفال بيتعدوا في المدرسة" p={p} /></>) },
  { a: "نغسل", sfx: "bubbles", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Soap /></Place><ChipAt text="غسل الإيدين" hot p={p} /></>) },
  { a: "اسبرين", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Pill c1="#F7C548" /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="لا أسبرين لطفل أو مراهق" hot p={p} /></>) },
  { a: "تطعيم", sfx: "ding", r: (p) => (<><Place x={540} y={1000} s={1.3}><J.Syringe /></Place><ChipAt text="تطعيم الأنفلونزا كل سنة (فوق 6 شهور)" w={880} size={42} hot p={p} /></>) },
]);
export const S8 = mk(8, [
  { a: "", sfx: "swell", r: (p) => (<>{D("happy", 540, 1010, 0.85, true)}<ChipAt text="الخلاصة: 3 حاجات" hot p={p} /></>) },
  { a: "اولا", sfx: "pop", r: (p, f) => (<><Place x={540} y={1000} s={1.2}><Virus spin={f / 20} /></Place><ChipAt text="1) أغلب النزلات فيروس" hot p={p} /></>) },
  { a: "ثانيا", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><J.Bed /></Place><ChipAt text="2) راحة ونوم وسوائل" hot p={p} /></>) },
  { a: "ثالثا", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.4}><Warn /></Place><ChipAt text="3) اعرف علامات الخطر" hot p={p} /></>) },
  { a: "الكومنتات", sfx: "ding", r: (p) => (<><Place x={540} y={980} s={1.8 * p}><QuestionIcon /></Place><ChipAt text="اكتب في التعليقات: الحلقة الجاية؟" w={860} size={46} hot p={p} /></>) },
]);
export const SCENES_LONG07: Record<number, SceneDef> = { 1: S1, 2: S2, 3: S3, 4: S4, 5: S5, 6: S6, 7: S7, 8: S8 };
export const THEME_EP07: Record<number, "curiosity" | "tension" | "hope"> = { 0: "curiosity", 1: "curiosity", 2: "curiosity", 3: "tension", 4: "hope", 5: "curiosity", 6: "tension", 7: "curiosity", 8: "hope" };
export const DISCLAIMER_EP07 = "شرح مبسط للتوعية، مش بديل لاستشارة الطبيب أو الصيدلي. المصادر في الوصف.";
export const sceneDef = (variant: string, id: number): SceneDef => (variant === "long" ? SCENES_LONG07[id] : SHORTS07[variant]);
export { Arrow, Magnifier, StopHand, CheckIcon, FONT, C, L };
