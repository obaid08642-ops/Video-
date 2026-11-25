"""
Ep07 (cold/flu/cough): word-timing JSON + captions config for Remotion, from Whisper word times of the final voice masters.

    python ep08_make_timing.py WT.json OUT_TIMING.json CAPTIONS.json AUDIO_NAME [--scenes]

--scenes: long video; scene boundaries are the first word of the listed scene-opening phrases (SCENE_STARTS); otherwise one scene (id 1).
Whisper's Arabic spelling is fixed with REPL (Egyptian th->s etc.) and lines are Whisper segments (split at scene boundaries).
"""
import json, re, sys

WT, OUT, CAP, AUDIO = sys.argv[1:5]
LONG = "--scenes" in sys.argv
REPL = [
 ("الأيبوبروفين", "الإيبوبروفين"), ("الديكلوفوناك", "الديكلوفيناك"), ("الديكليفوناك", "الديكلوفيناك"), ("بارستامول", "باراسيتامول"), ("هستمين", "هستامين"),
 ("الأنفلوانزة", "الأنفلونزا"), ("الإنفلوانزة", "الأنفلونزا"), ("الأنفلوانزا", "الأنفلونزا"), ("الانفلوانزة", "الأنفلونزا"), ("الانفلوانزا", "الأنفلونزا"), ("أنفلوانزة", "أنفلونزا"), ("انفلوانزة", "أنفلونزا"), ("انفلوانزا", "أنفلونزا"), ("الأنفلوانزة", "الأنفلونزا"),
 ("مضعفة", "مضاعفة"), ("التحميل", "التحاميل"), ("والتحميل", "والتحاميل"), ("الأعراس", "الأقراص"), ("أعراس", "أقراص"), ("الكلة", "الكلى"), ("كرحة", "قرحة"), ("الجامع بينهم", "الجمع بينهم"),
 ("مبصدر", "مبستر"), ("معكم", "معقم"), ("موصك", "موثوق"), ("رابو", "ربو"), ("ربوة", "ربو"), ("عراض صعبة", "أعراض صعبة"), ("الوشيك", "الوشيقي"), ("الردع", "الرضع"),
 ("الحاوي", "الحيوي"), ("المضاد الحيو ", "المضاد الحيوي "), ("دوائيا", "دوائين"), ("دوة", "دوا"), ("فيتامين دال", "فيتامين د"), ("وفيتامين دال", "وفيتامين د"), ("متضربة", "متضاربة"), ("بيصر", "بيسهر"),
 ("الهوى", "الهوا"), ("عدوة", "عدوى"), ("ناموا", "ناموا"), ("نموا", "ناموا"), ("الكحفة", "الكحة"), ("الأهضر", "الأخضر"), ("اللون البلغم", "لون البلغم"), ("جنبية", "جانبية"), ("الصيدل ", "الصيدلي "),
 ("العراض", "الأعراض"), ("دكف", "ضيق"), ("دخة", "دوخة"), ("ضك في", "ضيق في"), ("دالين", "دليل"), ("ابعاتها", "ابعتها"), ("ابعثها", "ابعتها"), ("وواجع جسم جديد", "ووجع جسم شديد"), ("وواجع", "ووجع"), ("حال إبيوجع", "حلق بيوجع"),
 ("الشادات", "إرشادات"), ("سائل", "سوائل"), ("روحة", "راحة"), ("هنحتاج راحة", "راحة"), ("سويل", "سوائل"), ("اتحتاج", "راحة"), ("بتفضل", "بتفضل"),
 ("ازاي", "إزاي"), ("وايه", "وإيه"), ("ايوة", "أيوة"), ("اكتر", "أكتر"), ("الاكتر", "أكتر"), ("علشان", "عشان"), ("الاطفال", "الأطفال"), ("الاعراض", "الأعراض"), ("الاسابيع", "الأسابيع"), ("اسابيع", "أسابيع"),
 ("للاسابيع", "لأسابيع"), ("الايدين", "الإيدين"), ("الادين", "الإيدين"), ("بماية", "بمياه"), ("ماية", "مياه"), ("بمية", "بمياه"), ("مية", "مياه"), ("ميا", "ميا"), ("اللي ", "اللي "), ("أولا", "أولًا"), ("اولا", "أولًا"), ("ثانيا", "ثانيًا"), ("سالسا", "ثالثًا"), ("وسالسا", "وثالثًا"),
 ("تعرض فيها ناس", "اتعرّض فيها ناس"), ("لفيروس", "لفيروس"), ("ست ساعات أول", "6 ساعات أو أقل"), ("6 ساعات أول", "6 ساعات أو أقل"),
 ("بتخفل وحدها", "بتخف لوحدها"), ("عدوا", "عدوى"), ("فاجأ", "فجأة"), ("الحمياه", "الحماية"), ("وانهم كفاية", "ونوم كفاية"), ("الأنفلونزا سابوا فيروس", "الأنفلونزا سببه فيروس"), ("سبع اكتلت", "تلات"), ("هعد معايا على", "عدّي معايا على"), ("والكحل", "والكحة"), ("أثار", "آثار"),
 ("اللي أدل أنها بتفيد", "الأدلة إنها بتفيد"), ("بتأثر الكحة", "بتقصّر الكحة"), ("ومتخلصش أكتر من ده وفيهم", "ومتخلطش أكتر من دوا فيهم"), ("والسوايل", "وسوائل"), ("وفيتامين د فايدته للعدوى التنفسية الصغيرة هو مش مؤكد", "وفيتامين د فايدته للعدوى التنفسية صغيرة ومش مؤكدة"), ("وهو هيحد", "وهو هيحدد"), ("حلقة وها", "حلقة"), ("بردة", "برد"),
 ("الوشيق", "الوشيقي"), ("ري سندروم", "ريّ سندروم"), ("متلازم نادرة", "متلازمة نادرة"), ("خفضات", "خافضات"), ("بس بالجرعة للدكتور", "بس بجرعة الدكتور"), ("للطوار", "للطوارئ"), ("كل شدة", "كل شتا"), ("ما نتاكش عنها عدوى", "ما نتجش عنها عدوى"), ("معاملية", "معملية"), ("الاحتكاج", "الاحتكاك"), ("مبداي", "مبدئي"), ("السنتاج", "استنتاج"), ("ووششهم", "ووشوشهم"),
 ("أنفلوانزا", "أنفلونزا"), ("ولمش عارف او مش عارف", "ولو مش عارف"), ("تحميل", "تحاميل"), ("بالزبط", "بالظبط"), ("بيلغبط", "بيلخبط"), ("اعتبار", "اعتبار"), ("وانهم", "ونوم"), ("اكتلت", "تلات"),
 ("تبطل تعالج", "تبطل تعالج"), ("فضروري", "فضروري"), ("الأعراض اللي تحسنت", "الأعراض اللي تحسنت"),
]
RX = [(r"(?<![ء-ي])(و?)ميا(?!ه)", r"\1مياه"), (r"(?<![ء-ي])انه(?![ء-ي])", "إنه"), (r"(?<![ء-ي])استنى(?![ء-ي])", "استنّى"), (r"(?<![ء-ي])ايه(?![ء-ي])", "إيه"), (r"(?<![ء-ي])ان(?![ء-ي])", "إن"), (r"الجرثوم(?![ءيةا])", "الجرثومة"), (r"(?<![ء-ي])قيق(?![ء-ي])", "قيء"), (r"(?<![ء-ي])ل(\d)", r"لـ\1"), (r" %", "%"), (r"(?<![ء-ي0-9])حقيقيه", "حقيقية"), (r"(?<![ء-ي])ال ?ACG", "ACG")]
KW = ["فيروس", "فيروسات", "علاج", "مضاد", "حيوي", "عسل", "سنة", "سنتين", "أسبرين", "باراسيتامول", "الإيبوبروفين", "الديكلوفيناك", "نفس المادة", "مياه", "معقمة", "مغلية", "فورًا", "نوم", "الأنفلونزا", "6", "4", "3", "8%", "14%", "ممنوع", "خطر", "جرثوم", "44", "70", "14", "هيليكو", "نوبل", "دم", "أسود", "أسود", "وزن", "البلع", "قيء", "أجسام", "موجب", "ACG", "أسابيع", "رباعية", "كمّل", "الكورس", "التحليل", "النَّفَس", "البراز", "المنظار", "تقاوم", "فورًا", "مصاب", "دلوقتي", "أثبت", "التدخين", "الملح", "عامل", "الأطفال", "ثلاث", "أولًا", "ثانيًا", "ثالثًا"]
SCENE_STARTS = ["نزلة البرد غالبا بتبدأ", "أغلب نزلات البرد", "هنحتاج", "معظم أشربة", "طب إنت", "طب والجو", "الخلاصة"]  # scenes 2..8
nrm = lambda s: re.sub(r"[^a-z0-9ء-ي]", "", re.sub(r"[ً-ْٰـ]", "", s.lower()).replace("أ", "ا").replace("إ", "ا").replace("آ", "ا").replace("ة", "ه").replace("ى", "ي"))

segs = json.load(open(WT, encoding="utf-8"))
segs = [x for x in segs if "اشتركوا في القناة" not in x["text"]]   # Whisper hallucination in trailing silence (not in the audio)
words = [dict(w=w["w"], start=w["start"], end=w["end"]) for s in segs for w in s["words"]]
# scene boundaries (long): index of the first word of each scene phrase, searched in order
bounds = [0]
if LONG:
    pos = 0
    for ph in SCENE_STARTS:
        toks = [nrm(x) for x in ph.split()]
        for i in range(pos, len(words) - len(toks)):
            if all(nrm(words[i + j]["w"]).startswith(toks[j][:3]) for j in range(len(toks))): bounds.append(i); pos = i + 1; break
        else: raise SystemExit(f"scene phrase not found: {ph}")
scene_of = lambda i: max(k for k, b in enumerate(bounds) if i >= b) + 1
# lines = Whisper segments, split at scene boundaries
lines = []; n_by = {}; idx = 0
for s in segs:
    groups = []
    for w in s["words"]:
        sc = scene_of(idx); idx += 1
        if groups and groups[-1][0] == sc: groups[-1][1].append(w)
        else: groups.append((sc, [w]))
    for sc, gw in groups:
        text = " ".join(w["w"] for w in gw)
        for a, b in REPL: text = text.replace(a, b)
        for a, b in RX: text = re.sub(a, b, text)
        toks = text.split(); n0, n1 = len(gw), len(toks); t0, t1 = gw[0]["start"], gw[-1]["end"]
        if n0 == n1: times = [(w["start"], w["end"]) for w in gw]
        else:
            Ls = [max(1, len(t)) for t in toks]; tot = sum(Ls); acc = t0; times = []
            for l in Ls: times.append((acc, acc + (t1 - t0) * l / tot)); acc += (t1 - t0) * l / tot
        ws = []
        for tok, (a, b) in zip(toks, times):
            m = re.match(r"^(.*?)([.؟?!،,…:]*)$", tok); core, pu = m.group(1), m.group(2)
            pu = pu.replace("?", "؟").replace(",", "،").replace(".", "")
            if core: ws.append(dict(w=core, punct=pu, kw=any(k in core for k in KW), tags=[], start=round(a, 3), end=round(b, 3)))
        if not ws: continue
        n_by[sc] = n_by.get(sc, 0) + 1
        lines.append(dict(id=f"s{sc}l{n_by[sc]}", scene=sc, raw=" ".join(w["w"] + w["punct"] for w in ws), start=ws[0]["start"], end=ws[-1]["end"], words=ws))
scs = sorted(set(l["scene"] for l in lines))
scenes = []
for sc in scs:
    ls = [l for l in lines if l["scene"] == sc]
    scenes.append(dict(id=sc, start=round(ls[0]["start"] - 0.05, 3), end=round(ls[-1]["end"], 3)))
for a, b in zip(scenes, scenes[1:]):                       # scenes touch (as in Ep06)
    m = round((a["end"] + b["start"]) / 2, 3); a["end"] = m; b["start"] = m
scenes[0]["start"] = -0.05
dur = round(lines[-1]["end"] + 0.35, 3)
T = dict(voice="recording", audio=AUDIO, duration=dur, sampleRate=48000, pauseScale=1.0, scenes=scenes, lines=lines)
json.dump(T, open(OUT, "w", encoding="utf-8"), ensure_ascii=False)
json.dump(dict(maxWords=9, overrides={}, sources={}, rename={}, renamePhrase={}), open(CAP, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(lines), "lines", sum(len(l["words"]) for l in lines), "words", dur, "s; scenes", [(s["id"], round(s["start"]), round(s["end"])) for s in scenes])
