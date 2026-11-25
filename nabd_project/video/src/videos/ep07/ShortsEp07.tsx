// Ep07 Shorts (11): one scene each, beats anchored to the owner's words.
import { Place, QuestionIcon } from "../../assets";
import { Warn, StopHand } from "../../assets/v9";
import { Magnifier } from "../../assets/hair";
import { Thermo } from "../../assets/ep04";
import { Virus, Bacterium } from "../../assets";
import { Moon } from "../../assets/more";
import * as I from "../../assets/ep08";
import * as J from "../../assets/ep07";
import { mk, ChipAt, D, Pt, Cross, Tick, Q, L, type SceneDef, type Beat } from "../ep08/engine08";

const S: Record<string, SceneDef> = {};
S.short01 = mk(1, [
  { a: "", sfx: "pop", r: (p) => (<>{Pt("tired", 540, 1010, 0.9)}<ChipAt text="نزلة البرد: مفيش علاج" hot p={p} /></>) },
  { a: "فيروس", sfx: "bump", r: (p, f) => (<><Place x={540} y={1000} s={1.3}><Virus spin={f / 20} /></Place><ChipAt text="أغلبها فيروس" hot p={p} /></>) },
  { a: "بيقتلش", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.4}><I.Pill c1="#E7B79C" r={-12} /></Place>{Cross(p, 540, 1000, 2.4)}<ChipAt text="المضاد مش بيقتل الفيروس" p={p} /></>) },
  { a: "البكتيريا", sfx: "pop", r: (p) => (<><Place x={300} y={1010} s={1.2}><I.Pill c1="#E7B79C" /></Place><Place x={780} y={1010} s={1.1}><Bacterium /></Place><ChipAt text="بيشتغل على البكتيريا بس" p={p} /></>) },
  { a: "بيتعافى", sfx: "pop", r: (p) => (<>{Pt("happy", 540, 1010, 0.9)}<ChipAt text="الجسم بيتعافى • العلاج للأعراض" w={800} size={46} p={p} /></>) },
  { a: "داعي", sfx: "bump", r: (p) => (<><Place x={540} y={990} s={1.4 * p}><Warn /></Place><ChipAt text="من غير داعي: آثار جانبية ومقاومة" w={880} size={44} p={p} /></>) },
  { a: "الدكتور", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="بعد الفحص: الدكتور يقرر" hot p={p} /></>) },
  { a: "تفاصيل", sfx: "pop", r: (p) => (<>{D("happy", 540, 1010, 0.85)}<ChipAt text="حلقة: المضادات الحيوية" hot p={p} /></>) },
]);
S.short02 = mk(1, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={320} y={1010} s={0.9}><Thermo level={0.25} /></Place><Place x={780} y={1010} s={0.9}><Thermo level={0.9} /></Place>{Q(p, 540, 800)}<ChipAt text="برد ولا أنفلونزا؟" hot p={p} /></>) },
  { a: "ثلاث", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.5}><text textAnchor="middle" y={60} fontSize={200} fontWeight={700} fill="#D9622B" fontFamily="sans-serif">3</text></Place><ChipAt text="3 فروق وحاجة بتحسم" p={p} /></>) },
  { a: "البرد", sfx: "pop", r: (p) => (<><Place x={540} y={990} s={1.4}><Thermo level={0.25} /></Place><ChipAt text="البرد: بالتدريج" p={p} /></>) },
  { a: "رشح", r: (p) => (<><Place x={540} y={1010} s={1.3}><J.Tissue /></Place><ChipAt text="رشح • عطس • حلق" p={p} /></>) },
  { a: "الانفلونزا", sfx: "bump", r: (p) => (<><Place x={540} y={990} s={1.4}><Thermo level={0.9} /></Place><ChipAt text="الأنفلونزا: فجأة" hot p={p} /></>) },
  { a: "سخونه", r: (p) => (<>{Pt("tired", 540, 1010, 0.9)}<ChipAt text="سخونة • وجع جسم • تعب" p={p} /></>) },
  { a: "التحليل", sfx: "ding", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Tube /></Place><ChipAt text="التحليل هو المؤكد" hot p={p} /></>) },
  { a: "وسخونه", r: (p) => (<><Place x={540} y={990} s={1.4}><Thermo level={0.35} /></Place><ChipAt text="سخونة البرد: قليلة أو مفيش" p={p} /></>) },
  { a: "الحالتين", sfx: "pop", r: (p) => (<><Place x={330} y={1010} s={1.1}><J.Mug /></Place><Place x={770} y={1010} s={1.0}><I.WaterBottle /></Place><ChipAt text="راحة وسوائل" hot p={p} /></>) },
]);
S.short03 = mk(1, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.5}><J.Mucus /></Place><ChipAt text="البلغم لونه أخضر؟" hot p={p} /></>) },
  { a: "يعني", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><J.Mucus /></Place>{Q(p, 800, 790)}<ChipAt text="يعني لازم مضاد حيوي؟" p={p} /></>) },
  { a: "لون", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.3}><J.Mucus /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="اللون لوحده مش دليل" hot p={p} /></>) },
  { a: "الفيروسات", sfx: "pop", r: (p, f) => (<><Place x={540} y={1000} s={1.2}><Virus spin={f / 20} /></Place><ChipAt text="بيتغير حتى مع الفيروسات" p={p} /></>) },
  { a: "بكتيريا", r: (p) => (<>{D("explain", 540, 1010, 0.85)}<ChipAt text="حتى مع البكتيريا: مش كل حالة مضاد" w={880} size={44} p={p} /></>) },
  { a: "الكحه", sfx: "tick", r: (p) => (<><Place x={540} y={1000} s={1.1}><I.Cal text="3 أسابيع" size={64} /></Place><ChipAt text="الكحة بعد البرد: لحد 3 أسابيع" w={800} size={44} p={p} /></>) },
  { a: "عدت", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.4 * p}><Warn /></Place><ChipAt text="أكتر من 3 أسابيع: دكتور" hot p={p} /></>) },
  { a: "دم", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.BloodDrop /></Place><ChipAt text="دم • ضيق تنفس • سخونة بتزيد" w={880} size={44} p={p} /></>) },
  { a: "روح", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="روح للدكتور" hot p={p} /></>) },
]);
S.short04 = mk(1, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.5}><I.Honey /></Place><ChipAt text="عسل للكحة" hot p={p} /></>) },
  { a: "بينفع", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.4}><I.Honey /></Place>{Q(p, 820, 780)}<ChipAt text="بينفع… بس لناس مش كلهم" p={p} /></>) },
  { a: "انت", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.4}><I.Honey /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="في ناس ممنوع: إنت منهم؟" hot p={p} /></>) },
  { a: "ممكن", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place>{Tick(p, 800, 780)}<ChipAt text="فوق سنة: ممكن يخفف الكحة" p={p} /></>) },
  { a: "محدودة", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Pie v={0.3} /></Place><ChipAt text="الأدلة محدودة ومتفاوتة" p={p} /></>) },
  { a: "الرضع", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place>{Cross(p, 540, 1000, 1.6)}<ChipAt text="الرضع تحت سنة: ممنوع" hot p={p} /></>) },
  { a: "التسمم", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.4 * p}><Warn /></Place><ChipAt text="خطر: التسمم الوشيقي" hot p={p} /></>) },
  { a: "مبستر", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Honey /></Place><ChipAt text="عسل معقّم أو مبستر" p={p} /></>) },
  { a: "ربو", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="ربو أو أعراض صعبة: اسأل الدكتور" w={880} size={44} hot p={p} /></>) },
]);
S.short05 = mk(1, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.4}><J.Syrup /></Place><Place x={800} y={800} s={1.2 * p}><Warn /></Place><ChipAt text="شراب الكحة: خطر على الطفل الصغير" w={880} size={44} hot p={p} /></>) },
  { a: "بتدي", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place><Place x={820} y={1050} s={0.8}><J.Syrup /></Place><ChipAt text="بتدي طفلك شراب كحة؟" p={p} /></>) },
  { a: "استنى", sfx: "bump", r: (p) => (<><Place x={540} y={990} s={1.5 * p}><StopHand /></Place><ChipAt text="استنى قبل ما تديه" hot p={p} /></>) },
  { a: "مزيل", sfx: "pop", r: (p) => (<><Place x={300} y={1010} s={1.1}><I.Blister /></Place><Place x={780} y={1010} s={1.0}><J.Syrup /></Place><ChipAt text="مزيل احتقان أو مضاد هستامين" w={860} size={44} p={p} /></>) },
  { a: "ممنوع", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place>{Cross(p, 540, 1000, 1.6)}<ChipAt text="تحت سنتين: ممنوع" hot p={p} /></>) },
  { a: "جانبيه", r: (p) => (<><Place x={540} y={990} s={1.3 * p}><Warn /></Place><ChipAt text="ممكن يسبب آثار جانبية خطيرة" w={800} p={p} /></>) },
  { a: "الادله", r: (p) => (<><Place x={540} y={1000} s={1.2}><J.Syrup /></Place><ChipAt text="وبعدها: الأدلة إنها بتفيد ضعيفة" w={860} size={44} p={p} /></>) },
  { a: "اربع", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><J.Syrup /></Place><ChipAt text="كتير مكتوب: مش لتحت 4 سنين" w={820} size={44} p={p} /></>) },
  { a: "اسال", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="اسأل الدكتور أو الصيدلي" hot p={p} /></>) },
  { a: "ومتخلطش", sfx: "bump", r: (p) => (<><Place x={320} y={1010} s={1.0}><I.Blister /></Place><Place x={780} y={1010} s={1.0}><J.Syrup /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="متخلطش أدوية فيها نفس المادة" w={860} size={44} p={p} /></>) },
  { a: "وسوائل", r: (p) => (<><Place x={330} y={1010} s={1.1}><I.WaterBottle /></Place><Place x={770} y={1010} s={1.1}><I.Honey /></Place><ChipAt text="سوائل وراحة وعسل (فوق سنة)" w={820} size={44} p={p} /></>) },
]);
S.short06 = mk(1, [
  { a: "", sfx: "pop", r: (p) => (<>{D("explain", 540, 1010, 0.85)}<ChipAt text="عايز ترفع مناعتك؟" hot p={p} /></>) },
  { a: "حباية", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.4}><I.Pill r={-20} /></Place>{Cross(p, 540, 1000, 2.4)}<ChipAt text="مفيش حباية سحرية" hot p={p} /></>) },
  { a: "دليل", sfx: "pop", r: (p) => (<>{D("happy", 540, 1010, 0.85, true)}<ChipAt text="في حاجات ليها دليل" p={p} /></>) },
  { a: "نوم", sfx: "pop", r: (p) => (<><Place x={540} y={1010} s={1.3}><J.Bed /></Place><ChipAt text="نوم 7 ساعات أو أكتر" p={p} /></>) },
  { a: "غسل", sfx: "bubbles", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Soap /></Place><ChipAt text="غسل الإيدين" p={p} /></>) },
  { a: "حركه", r: (p) => (<>{Pt("happy", 540, 1010, 0.9)}<ChipAt text="حركة منتظمة" p={p} /></>) },
  { a: "وتطعيم", sfx: "ding", r: (p) => (<><Place x={540} y={1000} s={1.3}><J.Syringe /></Place><ChipAt text="تطعيم الأنفلونزا كل سنة (فوق 6 شهور)" w={880} size={42} hot p={p} /></>) },
  { a: "المكملات", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Blister /></Place><ChipAt text="المكملات: أدلة محدودة" p={p} /></>) },
  { a: "فيتامين", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Pie v={0.14} /></Place><ChipAt text="فيتامين سي المنتظم: يقصّر شوية" w={820} size={44} p={p} /></>) },
  { a: "دراسات", r: (p) => (<><Place x={320} y={1000} s={0.8}><I.Pie v={0.08} /></Place><Place x={770} y={1000} s={0.8}><I.Pie v={0.14} /></Place><ChipAt text="8% للكبار • 14% للأطفال" p={p} /></>) },
  { a: "الزنك", r: (p) => (<>{Q(p, 540, 900)}<ChipAt text="الزنك: مختلف عليه" p={p} /></>) },
  { a: "والاشناسيه", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Herb /></Place><ChipAt text="الإشناسية: أدلة ضعيفة ومتضاربة" w={860} size={44} p={p} /></>) },
  { a: "ممكن", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Herb /></Place><ChipAt text="لكن ممكن يفيد" p={p} /></>) },
  { a: "لازم", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="مش لازم مكمل كل الشتا" hot p={p} /></>) },
  { a: "اكتب", sfx: "pop", r: (p) => (<><Place x={540} y={980} s={1.8 * p}><QuestionIcon /></Place><ChipAt text="اكتب سؤالك في الكومنتات" hot p={p} /></>) },
]);
S.short07 = mk(1, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={1010} s={1.4}><J.Bed /></Place><ChipAt text="6 ساعات نوم أو أقل" hot p={p} /></>) },
  { a: "احتمال", sfx: "ding", r: (p, f, a) => (<><Place x={540} y={990} s={1.0}><I.Pie v={0.8 * L(f, a, 30)} /></Place><ChipAt text="البرد أكتر من 4 أضعاف" hot p={p} /></>) },
  { a: "فيتامين", sfx: "pop", r: (p) => (<><Place x={320} y={1010} s={1.0}><I.Pill /></Place><Place x={770} y={1010} s={1.0}><I.Pie v={0.14} /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="مش فيتامين سي ولا دوا" p={p} /></>) },
  { a: "اقوى", sfx: "swell", r: (p) => (<><Place x={540} y={1010} s={1.3}><J.Bed /></Place><ChipAt text="في حاجة أقوى" hot p={p} /></>) },
  { a: "دراسه", sfx: "pop", r: (p, f) => (<><Place x={540} y={1000} s={1.2}><Virus spin={f / 20} /></Place><ChipAt text="دراسة: ناس اتعرّضوا لفيروس البرد" w={860} size={44} p={p} /></>) },
  { a: "ناموا", r: (p) => (<>{Pt("tired", 330, 1010, 0.7)}{Pt("happy", 780, 1010, 0.7)}<ChipAt text="6 ساعات أو أقل ↔ أكتر من 7" p={p} /></>) },
  { a: "علاقه", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><Magnifier /></Place><ChipAt text="علاقة… مش بتثبت السبب لوحده" w={860} size={44} p={p} /></>) },
  { a: "الدليل", sfx: "ding", r: (p) => (<>{Tick(p, 540, 900, 1.8)}<ChipAt text="بس الدليل قوي" hot p={p} /></>) },
  { a: "فنوم", r: (p) => (<><Place x={330} y={1010} s={1.1}><J.Bed /></Place><Place x={770} y={1010} s={1.1}><I.Soap /></Place><ChipAt text="نوم كويس + غسل إيدين" hot p={p} /></>) },
  { a: "ابعتها", sfx: "pop", r: (p) => (<><Place x={540} y={1010} s={1.3}><J.Bed /></Place><ChipAt text="ابعتها لصاحبك اللي بيسهر" hot p={p} /></>) },
]);
S.short09 = mk(1, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.6 * p}><Warn /></Place><ChipAt text="برد عادي ولا علامة خطر؟" hot p={p} /></>) },
  { a: "امتى", sfx: "pop", r: (p) => (<>{D("worried", 540, 1010, 0.8)}<ChipAt text="إمتى تروح للدكتور فورًا؟" p={p} /></>) },
  { a: "للكبار", sfx: "pop", r: (p) => (<>{Pt("worried", 540, 1010, 0.85)}<ChipAt text="للكبار: ضيق تنفس • ألم صدر" w={800} size={46} p={p} /></>) },
  { a: "دوخه", r: (p) => (<>{Pt("tired", 540, 1010, 0.85)}<ChipAt text="دوخة مستمرة • تشوش • مرض مزمن بيزيد" w={900} size={42} p={p} /></>) },
  { a: "والاعراض", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><Thermo level={0.9} /></Place><ChipAt text="تحسّن وبعدين رجعت أسوأ: علامة" w={880} size={44} hot p={p} /></>) },
  { a: "للاطفال", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place><ChipAt text="للأطفال: تنفس سريع أو صعب" w={800} size={46} p={p} /></>) },
  { a: "شفايف", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place><ChipAt text="شفايف زرقا • مش بيشرب • نعسان جدًا" w={900} size={42} p={p} /></>) },
  { a: "والرضيع", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.4}><Thermo level={0.9} /></Place><ChipAt text="رضيع تحت 3 شهور + سخونة: دكتور فورًا" w={900} size={42} hot p={p} /></>) },
]);
S.short10 = mk(1, [
  { a: "", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.4}><I.Pill c1="#F7C548" /></Place><Place x={800} y={780} s={1.2 * p}><Warn /></Place><ChipAt text="قبل ما تديه دوا للحرارة" hot p={p} /></>) },
  { a: "دواء", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.4}><I.Pill c1="#F7C548" /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="دوا موجود في كل بيت: ممنوع" hot p={p} /></>) },
  { a: "اسبرين", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place><Place x={800} y={800} s={1.0}><I.Pill c1="#F7C548" /></Place>{Cross(p, 540, 1000, 1.8)}<ChipAt text="لا أسبرين لطفل أو مراهق" hot p={p} /></>) },
  { a: "متلازمه", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.4 * p}><Warn /></Place><ChipAt text="مرتبط بمتلازمة نادرة وخطيرة" w={820} p={p} /></>) },
  { a: "خافضات", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Pill c1="#9DC9E8" /></Place><ChipAt text="خافضات تانية: ممكن" p={p} /></>) },
  { a: "بجرعه", sfx: "ding", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="بجرعة الدكتور أو الصيدلي (حسب الوزن)" w={900} size={42} hot p={p} /></>) },
  { a: "يترجع", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place><ChipAt text="تحسّن وبعدين ترجيع كتير…" p={p} /></>) },
  { a: "للطوارئ", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.5 * p}><Warn /></Place><ChipAt text="روح الطوارئ" hot p={p} /></>) },
]);
S.short11 = mk(1, [
  { a: "", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><Moon /></Place><ChipAt text="الهوا البارد بيجيب برد؟" hot p={p} /></>) },
  { a: "ليه", sfx: "pop", r: (p) => (<>{[0, 1, 2, 3].map((i) => (<Place key={i} x={190 + i * 233} y={1010} s={0.6}><I.KidHead /></Place>))}<ChipAt text="ليه الأطفال بيرجعوا بالبرد؟" p={p} /></>) },
  { a: "سبب", sfx: "bump", r: (p, f) => (<><Place x={540} y={1000} s={1.3}><Virus spin={f / 20} /></Place><ChipAt text="السبب فيروس، مش الهوا" hot p={p} /></>) },
  { a: "وتجارب", r: (p) => (<><Place x={540} y={1000} s={1.2}><Magnifier /></Place><ChipAt text="تجارب: برد من غير فيروس = مفيش عدوى" w={880} size={42} p={p} /></>) },
  { a: "دراسات", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Belly /></Place><ChipAt text="دراسات معملية: برودة الأنف…" p={p} /></>) },
  { a: "تضعف", sfx: "bump", r: (p) => (<>{Q(p, 540, 880)}<ChipAt text="ممكن تضعف دفاعه لو الفيروس موجود" w={880} size={42} p={p} /></>) },
  { a: "مبدئي", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Pie v={0.2} /></Place><ChipAt text="لسه بحث مبدئي" p={p} /></>) },
  { a: "والاطفال", sfx: "pop", r: (p) => (<><Place x={300} y={1010} s={0.7}><I.KidHead /></Place><Place x={540} y={1010} s={0.7}><I.KidHead /></Place><Place x={780} y={1010} s={0.7}><I.KidHead /></Place><ChipAt text="الأطفال بيتعدوا لأنهم مع بعض" p={p} /></>) },
  { a: "والاحتكاك", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Soap /></Place><ChipAt text="الاحتكاك غالبًا أهم من الجو" w={780} p={p} /></>) },
  { a: "استنتاج", sfx: "tick", r: (p) => (<>{Q(p, 540, 880)}<ChipAt text="ده استنتاج، مش تجربة مباشرة" w={780} p={p} /></>) },
  { a: "غسل", sfx: "bubbles", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Soap /></Place><ChipAt text="غسل الإيدين" hot p={p} /></>) },
  { a: "عياني", r: (p) => (<>{Pt("tired", 540, 1010, 0.9)}<ChipAt text="الطفل العيّان: في البيت" p={p} /></>) },
  { a: "علامات", sfx: "swell", r: (p) => (<><Place x={540} y={990} s={1.4 * p}><Warn /></Place><ChipAt text="علامات الخطر: دكتور فورًا" hot p={p} /></>) },
]);
export const B12: Beat[] = [
  { a: "", sfx: "swell", r: (p) => (<><Place x={300} y={1010} s={1.1}><I.Blister /></Place><Place x={780} y={1010} s={1.1}><I.Blister /></Place><ChipAt text="اقرأ كلمة واحدة على العلبة" hot p={p} /></>) },
  { a: "لكل", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.4}><I.Blister /></Place><ChipAt text="لكل دوا مادة فعالة" p={p} /></>) },
  { a: "واسماء", sfx: "bump", r: (p) => (<><Place x={300} y={1010} s={1.0}><I.Blister /></Place><Place x={780} y={1010} s={1.0}><I.Blister /></Place><Place x={540} y={1010} s={1.0}><text textAnchor="middle" y={30} fontSize={120} fontWeight={700} fill="#D9622B" fontFamily="sans-serif">=</text></Place><ChipAt text="أسماء مختلفة… نفس المادة" hot p={p} /></>) },
  { a: "باراسيتامول", sfx: "ding", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.Pill c1="#CFE0EE" /></Place><ChipAt text="مثال: باراسيتامول" p={p} /></>) },
  { a: "مضاعفه", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Pill c1="#CFE0EE" /></Place><Place x={620} y={1060} s={1.0}><I.Pill c1="#CFE0EE" r={20} /></Place><ChipAt text="جرعة مضاعفة: ممكن يضر الكبد" w={860} hot p={p} /></>) },
  { a: "المركبه", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Blister /></Place><ChipAt text="حتى أدوية البرد المركّبة" p={p} /></>) },
  { a: "مسكنات", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Belly /></Place><ChipAt text="مسكنات الالتهاب: إيبوبروفين وديكلوفيناك" w={900} size={40} p={p} /></>) },
  { a: "العيله", sfx: "bump", r: (p) => (<><Place x={540} y={1000} s={1.2}><I.StomachC state="ulcer" /></Place><ChipAt text="الجمع بينهم: قرحة ونزيف وكلى" w={820} p={p} /></>) },
  { a: "الاقراص", r: (p) => (<><Place x={250} y={1010} s={0.9}><I.Blister /></Place><Place x={540} y={1010} s={0.9}><J.Syrup /></Place><Place x={830} y={1010} s={0.9}><I.Pill /></Place><ChipAt text="أقراص • شراب • تحاميل • فوّار: كلهم بيتحسبوا" w={920} size={40} p={p} /></>) },
  { a: "ولكن", sfx: "ding", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.Blister /></Place><ChipAt text="شكل مختلف… نفس الدوا" hot p={p} /></>) },
  { a: "الاطفال", sfx: "pop", r: (p) => (<><Place x={540} y={1000} s={1.3}><I.KidHead /></Place><ChipAt text="مع الأطفال: اسأل الدكتور أو الصيدلي" w={860} size={44} p={p} /></>) },
  { a: "صيدلي", r: (p) => (<>{D("explain", 540, 1010, 0.85, true)}<ChipAt text="مش عارف؟ اسأل صيدلي أو طبيب" w={820} size={44} p={p} /></>) },
  { a: "القاعده", sfx: "swell", r: (p) => (<><Place x={540} y={1000} s={1.3}><Magnifier /></Place><ChipAt text="القاعدة: اقرأ المادة الفعالة" hot p={p} /></>) },
  { a: "علبتين", sfx: "bump", r: (p) => (<><Place x={300} y={1010} s={1.0}><I.Blister /></Place><Place x={780} y={1010} s={1.0}><I.Blister /></Place>{Cross(p, 540, 1000, 2.2)}<ChipAt text="في علبتين؟ متجمعش" hot p={p} /></>) },
  { a: "ابعتها", sfx: "pop", r: (p) => (<>{D("happy", 540, 1010, 0.85, true)}<ChipAt text="ابعتها لحد بيخلط أدوية البرد" hot p={p} /></>) },
];
S.short12 = mk(1, B12);
export const SHORTS07 = S;
