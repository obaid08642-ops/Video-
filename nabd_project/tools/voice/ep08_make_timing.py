"""
Ep08 (H. pylori): word-timing JSON + captions config for Remotion, from Whisper word times of the final voice masters.

    python ep08_make_timing.py WT.json OUT_TIMING.json CAPTIONS.json AUDIO_NAME [--scenes]

--scenes: long video; scene boundaries are the first word of the listed scene-opening phrases (SCENE_STARTS); otherwise one scene (id 1).
Whisper's Arabic spelling is fixed with REPL (Egyptian th->s etc.) and lines are Whisper segments (split at scene boundaries).
"""
import json, re, sys

WT, OUT, CAP, AUDIO = sys.argv[1:5]
LONG = "--scenes" in sys.argv
REPL = [
 ("فوجع", "في وجع"), ("فواجع", "في وجع"), ("القيق", "القيء"), ("واتاها", "وقتها"), ("منظر", "منظار"), ("والتابات", "والتهابات"), ("والعداد", "والعادات"), ("القرح ", "القرحة "), ("الكرح", "القرحة"),
 ("اتخذت", "اتاخدت"), ("داوة", "دوا"), ("الحمد", "الحمض"), ("حيوين", "حيويين"), ("مضادة حية ومعين", "مضاد حيوي معين"), ("من استخدمش", "ما نستخدمش"), ("ولايت أن", "ولاحظت إن"), ("للوقت دي", "دلوقتي"),
 ("الالتحليل", "التحليل"), ("الألاج", "العلاج"), ("الانسب", "الأنسب"), ("ميةه", "مية"), ("أكله", "أكل"), ("توم ", "ثوم "), ("تحميه المعدة", "تحمي المعدة"), ("الوظيف", "الوظيفي"), ("بتتربط", "بتترتبط"),
 ("عامل سمي اسمه كاج إيه", "عامل سُمّي اسمه CagA"), ("وبتنصح من", "وبتنصح ما"), ("التوتر واس", "التوتر بس"), ("يسوي", "يسبب"), ("اغلب", "أغلب"), ("الاطباء", "الأطباء"), ("الاساسي", "الأساسي"), ("الاعتقاد", "الاعتقاد"), ("الاكل", "الأكل"), ("اعراض", "أعراض"), ("ايام", "أيام"), ("اكتشف", "اكتشف"), ("الدكتور", "الدكتور"),
 ("جرسومة", "جرثومة"), ("الجرسوم", "الجرثوم"), ("كرسومة", "جرثومة"), ("هيلوكو باكتر بايلوري", "هيليكوباكتر بايلوري"), ("هيلوكو باكتر", "هيليكوباكتر"),
 ("هيلوكو", "هيليكو"), ("لولابي", "لولبي"), ("لولا بي", "لولبي"), ("المزهل", "المذهل"), ("التهف", "التهاب"), ("غسان", "غثيان"), 
 ("الخرفات", "الخرافات"), ("تسبها", "تسيبها"), ("تتعالك", "تتعالج"), ("اتتعالك", "تتعالج"), ("موجة", "موجب"), ("بلسنين", "لسنين"), ("بالسنين", "لسنين"),
 ("أربعة سبيع", "4 أسابيع"), ("أربع سبيع", "4 أسابيع"), ("4 سبيع", "4 أسابيع"), ("الشادات", "إرشادات"), ("ارشادات", "إرشادات"), ("ربعية", "رباعية"),
 ("دوى", "دوا"), ("ملوسين", "ملوثين"), ("وسالسا", "وثالثًا"), ("سالسا", "ثالثًا"), ("يكرر", "يقرر"), ("تقدرات", "تقديرات"), ("أكو", "أقوى"),
 ("دو من نفسك", "ده من نفسك"), ("دو من", "ده من"), ("بيعليكها", "بيعالجها"), ("واجع", "وجع"), ("بيقل الحمض", "بيقلل حمض"), ("المد�", "المدة"),
 ("كامل الكورس", "كمّل الكورس"), ("نظاف", "نضيفين"), ("للعدوا", "للعدوى"), ("العدوا", "العدوى"), ("الجرثوم ", "الجرثومة "), ("تحليل الأدق", "التحليل الأدق"), ("المدة 14", "لمدة 14"), ("حيو معروف", "حيوي معروف"), ("توم،", "ثوم،"), ("عشاب", "أعشاب"), ("بتحمي ", "بتحميه "), ("لان ", "لأن "), ("معها", "معاها"), ("بيأثر", "بيأثروا"), ("اولا", "أولًا"), ("أولا", "أولًا"), ("ثانيا", "ثانيًا"), ("الأكتر", "أكتر"), ("الاكتر", "أكتر"), ("وايه", "وإيه"), ("ازاي", "إزاي"), ("اسمها", "اسمها"),
 ("الجهاز الهضمي الـ ACG", "الجهاز الهضمي (ACG)"), ("الـ ACG", "(ACG)"), ("سبيع", "أسابيع"), ("اختبار النفس", "اختبار النَّفَس"),
 ("وميا", "ومية"), ("ميا", "مية"), ("علشان", "عشان"), ("احيانا", "أحيانًا"), ("اللي", "اللي"), ("لسه", "لسه"), ("يتأكد أن", "يتأكد إن"),
 ("كان عنده", "كان عنده"), ("هقولك", "هقولك"), ("بتعملوا", "بتعمله"), ("تتشخص", "تتشخّص"), ("القرحه", "القرحة"), ("الموضة", "الحموضة"),
]
RX = [(r"(?<![ء-ي])انه(?![ء-ي])", "إنه"), (r"(?<![ء-ي])استنى(?![ء-ي])", "استنّى"), (r"(?<![ء-ي])ايه(?![ء-ي])", "إيه"), (r"(?<![ء-ي])ان(?![ء-ي])", "إن"), (r"الجرثوم(?![ءيةا])", "الجرثومة"), (r"(?<![ء-ي])قيق(?![ء-ي])", "قيء"), (r"(?<![ء-ي])ل(\d)", r"لـ\1"), (r" %", "%"), (r"(?<![ء-ي0-9])حقيقيه", "حقيقية"), (r"(?<![ء-ي])ال ?ACG", "ACG")]
KW = ["جرثوم", "44", "70", "14", "هيليكو", "نوبل", "دم", "أسود", "أسود", "وزن", "البلع", "قيء", "أجسام", "موجب", "ACG", "أسابيع", "رباعية", "كمّل", "الكورس", "التحليل", "النَّفَس", "البراز", "المنظار", "تقاوم", "فورًا", "مصاب", "دلوقتي", "أثبت", "التدخين", "الملح", "عامل", "الأطفال", "ثلاث", "أولًا", "ثانيًا", "ثالثًا"]
SCENE_STARTS = ["اسمها العلمي", "ممكن تحس", "نيجي", "زمان العلاج", "هل فيه أكلة", "طريقة العدوى", "عد على"]  # scenes 2..8
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
