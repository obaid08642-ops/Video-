"""
Episode 05: word-timing JSON for Remotion from the final master (Whisper word times) + the build EDL (scene boundaries).

    python ep05_make_timing.py whisper_final.json edl.json OUT_TIMING.json CAPTIONS.json [audio_name]

Whisper's word times are used as they are; its Arabic spelling is corrected with the REPL list below (phrase level, then re-tokenised;
when the token count changes the original word times are spread proportionally). Lines = Whisper segments, split at scene boundaries.
"""
import json, re, sys

WH, EDL, OUT, CAP = sys.argv[1:5]
AUDIO = sys.argv[5] if len(sys.argv) > 5 else "ep05_recording.flac"
SCENE_OF = {"s1": 1, "s2": 2, "s3": 3, "s4": 4, "s5": 5, "s6": 6, "s7": 7, "kids": 8, "closing": 9}

REPL = [
 ("بتتقلف", "بتتقلب"), ("من قوله جديد", "من أول وجديد"), ("حبيت منوم", "حباية منوّم"), ("المخد ", "المخدة "), ("المخد؟", "المخدة؟"), ("المخد.", "المخدة."),
 ("الأدينوزين", "Adenosine"), ("أدينوزين", "Adenosine"), ("الثاني بقى", "التاني بقى"), ("للصحيح", "للصحيان"), ("المخي بيبدأ", "المخ بيبدأ"),
 ("الملوتينين", "الميلاتونين"), ("الملاتونين", "الميلاتونين"), ("ملاتونين", "ميلاتونين"), ("تيجي الأهو", "تيجي القهوة"),
 ("بيقف المستقبلات", "بيقفل مستقبلات"), ("أهل إحساس", "أقل إحساس"), ("إنك كفاية", "إنك فايق"), ("اللي تراكم", "اللي اتراكم"), ("وتراكب", "وتراقب"),
 ("بتقلف", "بتقلب"), ("أو ألان", "أو قلقان"), ("يقزة", "يقظة"), ("مش متوفر", "مش متوافق"), ("التراب في النوم", "اضطراب في النوم"), ("وده التراب", "وده اضطراب"),
 ("يلهس", "يلهث"), ("تملم للساقين", "تململ الساقين"), ("تحرككم", "تحركهم"), ("القارك", "الأرق"), ("القرق", "الأرق"), ("قرق", "أرق"), ("سالسا", "ثالثًا"),
 ("سبت معادل", "ثبّت ميعاد"), ("اراجع", "راجع"), ("الأهواء والشاي", "القهوة والشاي"), ("التعالج", "تتعالج"), ("ولو عادت", "ولو قعدت"),
 ("إضافة خفتة", "إضاءة خافتة"), ("فتفضة", "فضفضة"), ("المسيرات", "المثيرات"), ("الموصة", "الموصى"), ("لعلاجها", "لعلاجه"), ("الطراب", "اضطراب"),
 ("الزيد راج", "Z-drugs"), ("البنزو دايازبين", "Benzodiazepines"), ("أو اللي اتنين", "أو الاتنين"), ("الزاكرة", "الذاكرة"), ("أثارها", "آثارها"),
 ("بتقلق الإشارات", "بتقلل إشارات"), ("الإشارات اليقظة", "إشارات اليقظة"), ("مضاد الحساسية", "مضادات الحساسية"), ("أوركسين ريسبتور أنتاجنست", "Orexin Receptor Antagonists"),
 ("جابا", "GABA"), ("المنوم الأكو", "المنوّم الأقوى"), ("بالنسباله", "بالنسبة له"), ("الجروس هرمون", "Growth Hormone"), ("هيتول", "هيطول"),
 ("من ستة لاتناشر", "من 6 لـ12"), ("من تسعة لاتناشر", "من 9 لـ12"), ("من تمانية لعشر", "من 8 لـ10"), ("ابعادها", "ابعتها"), ("مسلا", "مثلًا"),
 ("الجيت لاج", "Jet Lag"), ("يصهرش", "يسهرش"), ("اسبوعيا", "أسبوعيًا"), ("وتقوم بالريتوني وتغير الريتين", "وتغيّر الروتين"), ("الريتين", "الروتين"),
 ("بيريح الطفل", "بيريّح الطفل"), ("مرات اسبوعيا", "مرات أسبوعيًا"), ("لقلة النوم", "قلة النوم"), ("مش بيمسح", "مش بيمسح"), ("الأرق المزم", "الأرق المزمن"),
 ("ممكن تدخل ضمن", "ممكن تدخل ضمن"), ("من من", "من"), ("نشر", "نشر"),
]

RX = [
 (r"(?<![ء-ي])انت بالك", "إنت بقالك"), (r"حبيت منه", "حباية منوّم"), (r"(?<![ء-ي])المخد(?![ء-يً-ْة])", "المخدة"), (r"الملاتينين", "الميلاتونين"),
 (r"المزمنن", "المزمن"), (r"للسقين|الساقين(?=)", "الساقين"), (r"تملم ", "تململ "), (r"ويقف نفس ولحظات", "ويقف نفسه لحظات"), (r"(?<![ء-ي])فرق بين", "نفرّق بين"),
 (r"أو الآن", "أو قلقان"), (r"بيتقلف", "بتقلب"), (r"(?<![ء-ي])أولا(?![ء-ي])", "أولًا"), (r"(?<![ء-ي])رابعا(?![ء-ي])", "رابعًا"), (r"(?<![ء-ي])ثانيا(?![ء-ي])", "ثانيًا"),
 (r"أنهم", "إنهم"), (r"أنك", "إنك"), (r"(?<![ء-ي])أن نفسك", "إن نفسك"), (r"أن عندك", "إن عندك"), (r"مش حبيت", "مش حباية"), (r"صحيان قدر", "الصحيان قدر"),
 (r"عايز تعود", "عايز تعوّض"), (r"بتغازي", "بتغذي"), (r"المسايرات", "المثيرات"), (r"الماشية", "المشي"), (r"التقلضية", "التقليدية"), (r"أصارها", "آثارها"),
 (r"المناوم الأكو", "المنوّم الأقوى"), (r"وضغير الروتين", "وتغيّر الروتين"), (r"عندك تراب في", "عندك اضطراب في"), (r"دوة", "دوا"), (r"لإن النوم", "لأن النوم"),
 (r"اللي هام إنه", "الأهم إنه"), (r"يصارش", "يسهرش"), (r"وGrowth Hormone", "(Growth Hormone)"), (r"تعالج(?![ء-ي])", "تتعالج"), (r"CBT -I", "CBT-I"), (r"المشكلة أن", "المشكلة إن"), (r"(?<![ء-ي])الاول", "الأول"), (r"(?<![ء-ي])هنام", "هنام"),
 (r"(?<![ء-ي])المخد(?![ء-ي])", "المخدة"), (r"ثبّت ميعاد صحيان", "ثبّت ميعاد الصحيان"), (r"مش بلا مخاطر ولا براحتنا", "مش بلا مخاطر. ولا براحتنا؟"),
]
KW = ["Adenosine", "الميلاتونين", "الكافيين", "التوتر", "الأرق", "CBT-I", "Z-drugs", "Benzodiazepines", "GABA", "Orexin", "Growth", "Hormone", "تحذير", "اضطراب", "تململ",
      "انقطاع", "الضوء", "الموبايل", "الشاي", "القهوة", "أقوى", "ثبّت", "sleep", "pressure", "هرمون", "ساعتك", "البيولوجية"]
SOURCES = [  # (keywords in the line, small source line under the caption card)
 (["الميلاتونين بيساعد", "مش علاج سحري"], "NCCIH"), (["سلوكيات أثناء النوم", "تحذير مهم"], "FDA"), (["Benzodiazepines", "Z-drugs"], "FDA • VA/DoD 2025"),
 (["العلاج السلوكي", "CBT-I", "أقوى العلاجات", "نظافة النوم"], "AASM • VA/DoD 2025"), (["ثلاث مرات", "تلات مرات", "ثلاث شهور"], "VA/DoD 2025"),
 (["من 6 لـ12", "من 9 لـ12", "من 8 لـ10"], "AASM 2016 • AAP"), (["Orexin"], "VA/DoD 2025"),
]
nrm = lambda s: re.sub(r"[^a-z0-9ء-ي]", "", re.sub(r"[ً-ْٰـ]", "", s.lower()).replace("أ", "ا").replace("إ", "ا").replace("آ", "ا").replace("ة", "ه").replace("ى", "ي"))

segs = json.load(open(WH, encoding="utf-8")); edl = json.load(open(EDL, encoding="utf-8")); SP = edl["speed"]
ranges = {}
for p in edl["pieces"]:
    sc = SCENE_OF[p["note"].split(":")[0]]; a, b = p["out_at"] / SP, (p["out_at"] + p["dur"]) / SP
    ranges[sc] = [min(ranges.get(sc, [a, b])[0], a), max(ranges.get(sc, [a, b])[1], b)]
def scene_of(t):
    for sc, (a, b) in ranges.items():
        if a - 0.3 <= t <= b + 0.3: return sc
    return min(ranges, key=lambda s: min(abs(t - ranges[s][0]), abs(t - ranges[s][1])))

lines = []; n_by_scene = {}
for s in segs:
    ws = s["words"]
    if not ws: continue
    groups = []
    for w in ws:
        sc = scene_of((w["start"] + w["end"]) / 2)
        if groups and groups[-1][0] == sc: groups[-1][1].append(w)
        else: groups.append((sc, [w]))
    for sc, gw in groups:
        text = " ".join(w["w"].strip() for w in gw)
        for a, b in REPL: text = text.replace(a, b)
        text = re.sub(r"المزم(?!ن)", "المزمن", text)
        for a, b in RX: text = re.sub(a, b, text)
        toks = text.split()
        # map the (possibly different number of) corrected tokens onto the original word times
        n0, n1 = len(gw), len(toks); words = []
        t0, t1 = gw[0]["start"], gw[-1]["end"]
        if n0 == n1: times = [(w["start"], w["end"]) for w in gw]
        else:
            L = [max(1, len(t)) for t in toks]; tot = sum(L); acc = t0; times = []
            for l in L: times.append((acc, acc + (t1 - t0) * l / tot)); acc += (t1 - t0) * l / tot
        for tok, (a, b) in zip(toks, times):
            m = re.match(r"^(.*?)([.؟?!،,…:]*)$", tok); core, pu = m.group(1), m.group(2)
            pu = pu.replace("?", "؟").replace(",", "،").replace(".", "")                  # a full stop is not shown, the card ends there anyway
            if not core: continue
            words.append(dict(w=core, punct=pu, kw=any(k.lower() in core.lower() for k in KW), tags=[], start=round(a, 3), end=round(b, 3)))
        if not words: continue
        n_by_scene[sc] = n_by_scene.get(sc, 0) + 1
        lines.append(dict(id=f"s{sc}l{n_by_scene[sc]}", scene=sc, raw=" ".join(w["w"] + w["punct"] for w in words), start=words[0]["start"], end=words[-1]["end"], words=words))
# a one-word line at the end of a scene whose sentence continues in the next scene (e.g. «أول | حاجة الكافين», «لو | نومك متلخبط») -> next line
k = 0
while k < len(lines) - 1:
    a, b = lines[k], lines[k + 1]
    if len(a["words"]) == 1 and a["scene"] != b["scene"] and b["start"] - a["end"] < 0.8:
        b["words"] = a["words"] + b["words"]; b["raw"] = " ".join(w["w"] + w["punct"] for w in b["words"]); b["start"] = b["words"][0]["start"]; lines.pop(k)
    else: k += 1
cnt = {}
for l in lines: cnt[l["scene"]] = cnt.get(l["scene"], 0) + 1; l["id"] = f"s{l['scene']}l{cnt[l['scene']]}"
for sc in ranges:
    ls = [l for l in lines if l["scene"] == sc]; ranges[sc] = [min(ranges[sc][0], ls[0]["start"] - 0.05), max(ranges[sc][1], ls[-1]["end"])]
# sentence-final marks: Whisper's segment end -> "." is dropped, so end a line with « » (no mark) unless it had ؟
dur = round(edl["duration"] / SP, 3)
T = dict(voice="recording", audio=AUDIO, duration=dur, sampleRate=48000, pauseScale=1.0,
         scenes=[dict(id=sc, start=round(a, 3), end=round(b, 3)) for sc, (a, b) in sorted(ranges.items())], lines=lines)
import os
if os.environ.get("EP05_STRICT"): T["strict"] = True
json.dump(T, open(OUT, "w", encoding="utf-8"), ensure_ascii=False)
src = {}
for l in lines:
    for keys, label in SOURCES:
        if any(k in l["raw"] for k in keys): src[l["id"]] = label; break
json.dump(dict(maxWords=9, overrides={}, sources=src, rename={}, renamePhrase={}), open(CAP, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{len(lines)} lines, {sum(len(l['words']) for l in lines)} words, {dur} s, scenes {[(s['id'], round(s['start']), round(s['end'])) for s in T['scenes']]}")
