"""
Episode 06 (hair loss): word-timing JSON for Remotion from the final master (Whisper word times) + the build EDL (scene boundaries).

    python ep06_make_timing.py whisper_final.json edl.json OUT_TIMING.json CAPTIONS.json [audio_name]

Whisper's word times are used as they are; its Arabic spelling is corrected with the REPL list below (phrase level, then re-tokenised;
when the token count changes the original word times are spread proportionally). Lines = Whisper segments, split at scene boundaries.
"""
import json, os, re, sys

WH, EDL, OUT, CAP = sys.argv[1:5]
AUDIO = sys.argv[5] if len(sys.argv) > 5 else "ep06_recording.flac"
SCENE_OF = lambda n: int(re.match(r"s(\d+)", n).group(1))

REPL = [
 ("ووتبدأ", "وتبدأ"), ("معنى صلع", "معناه صلع"), ("حساسة لوراثيا", "حساسة له وراثيًا"), ("ينابط", "ينبت"), ("تظهر معايا نتيجة", "تظهر معاها النتيجة"), ("DHD", "DHT"),
 ("صلع براسي", "صلع وراثي"), ("ست شهور", "6 شهور"), ("كرس وخلاص", "كورس وخلاص"), ("طيب الزيوت طبيعية", "طيب والزيوت الطبيعية"), ("من 50 % شعر", "من 50 لـ100 شعرة"), ("انبات اه ", "إنبات… "), ("اه التركيبة", "التركيبة"),
 ("درصات", "دراسات"), ("اهم نقطة", "أهم نقطة"), ("اكليل", "إكليل"), ("الاطفال", "الأطفال"),
 ("بتسكت", "بتسقط"), ("تبدأ شعرك دي ده مكانها", "وتبدأ شعرة جديدة مكانها"), ("تبدأ شعر جديد مكانها", "وتبدأ شعرة جديدة مكانها"), ("التستسترون", "التستوستيرون"), ("التستستيرون", "التستوستيرون"),
 ("منتريزيشن", "Miniaturization"), ("منطية", "منطقة"), ("تورسها", "تورثها"), ("تلوجين افلوفيوم", "Telogen Effluvium"), ("تلوجين إفلوفيوم", "Telogen Effluvium"), ("التربات الغدة الضرقية", "اضطرابات الغدة الدرقية"),
 ("التربات الغدة الدراقية", "اضطرابات الغدة الدرقية"), ("الغدة الدراكية", "الغدة الدرقية"), ("الغدة الدراقية", "الغدة الدرقية"), ("تكايس المبايد", "تكيس المبايض"), ("السعلبة", "الثعلبة"), ("منعية", "مناعية"),
 ("بوع صلع مفاجأة", "بقع صلع مفاجئة"), ("فطريات في فرط الراس", "فطريات فروة الرأس"), ("وكشور", "وقشور"), ("بوع", "بقع"), ("المجدودة", "المشدودة"), ("الكماوي", "الكيماوي"), ("تضيع وقته وفلوس", "تضييع وقت وفلوس"),
 ("تريكوسكوب", "Trichoscope"), ("فروط", "فروة"), ("فرط", "فروة"), ("فباع او ففروة", "في بقع أو في فروة"), ("فباع أو ففروة", "في بقع أو في فروة"), ("آلم", "ألم"), ("المينوكسديل", "المينوكسيديل"), ("المينوكس دي", "المينوكسيديل"),
 ("المونكسديل", "المينوكسيديل"), ("الصلاع الوراصي", "الصلع الوراثي"), ("الصلاع الوراثي", "الصلع الوراثي"), ("السلع الوراصي", "الصلع الوراثي"), ("الصالع الوراثي", "الصلع الوراثي"), ("الصلع الوراصي", "الصلع الوراثي"), ("صلع وراسي", "صلع وراثي"),
 ("وراسيا", "وراثيًا"), ("لوراسيا", "لوراثيًا"), ("وكسيف", "وكثيف"), ("بكسافته", "بكثافته"), ("كسافته", "كثافته"), ("والكسافة", "والكثافة"), ("معناه صلاة", "معناه صلع"), ("لرجال وللستات", "للرجال وللستات"),
 ("ويطالت", "وإطالة"), ("سنك", "سُمك"), ("تضفك", "تدفق"), ("فبيبدأ يغزي", "فبيغذّي"), ("العلاق", "العلاج"), ("لو أقفته", "لو وقفته"), ("لو أقفت", "لو وقفته"), ("تخوتها", "تاخدها"), ("أصار جانبية", "آثار جانبية"), ("أثار جانبية", "آثار جانبية"),
 ("وارتبطة", "ومرتبطة"), ("الدي اتش تي", "الـDHT"), ("الزيوتة", "الزيوت"), ("الرزماري", "الروزماري"), ("الججوبة", "الجوجوبا"), ("البرقة", "البركة"), ("الترصات", "الدراسات"), ("الدرصات", "الدراسات"), ("للصلحة", "للصلع"),
 ("بتملع", "بتمنع"), ("تساقد", "تساقط"), ("اقويل", "أقاويل"), ("امبات", "إنبات"), ("واسق", "واثق"), ("الموضيعي", "الموضعي"), ("نيدلنج", "نيدلينج"), ("الديرمرول", "الديرما رولر"), ("الديرمارول", "الديرما رولر"),
 ("وسالسا", "وثالثًا"), ("سالسا", "ثالثًا"), ("ثانيا", "ثانيًا"), ("أولا", "أولًا"), ("اولا", "أولًا"), ("طيبه", "طيب"), ("تعلى لي", "تعالى لي"), ("وتعلى", "وتعالى"), ("اكتبلي", "اكتب لي"), ("قبل ما البصيلات", "قبل ما البصيلات"),
 ("البصايلة", "البصيلة"), ("الوراصي", "الوراثي"), ("وراصي", "وراثي"), ("الوراسي", "الوراثي"), ("وراسي", "وراثي"), ("شعرين", "شعرنا"), ("الراس", "الرأس"), ("منيوتريزيشن", "Miniaturization"),
]
RX = [(r"أرفع وأقص(?!ر)", "أرفع وأقصر"), (r"(?<![ء-ي])انبات", "إنبات"), (r"الDHD", "الـDHT"), (r"(?<![ء-ي])الDHT", "الـDHT"), (r"(?<![ء-ي])ويمتى", "وإمتى"), (r"(?<![ء-ي])ازاي", "إزاي"), (r"(?<![ء-ي])ان(?![ء-ي])", "إن"), (r"(?<![ء-ي])او(?![ء-ي])", "أو"), (r"(?<![ء-ي])لان(?![ء-ي])", "لأن")]
KW = ["DHT", "الصلع", "البصيلة", "البصيلات", "المينوكسيديل", "الفيناسترايد", "Telogen", "Miniaturization", "الحديد", "الغدة", "الثعلبة", "فطريات", "الزيوت", "الزراعة", "الديرما", "المايكرو", "تحذير", "الطبيب", "السبب"]
SOURCES = []
nrm = lambda s: re.sub(r"[^a-z0-9ء-ي]", "", re.sub(r"[ً-ْٰـ]", "", s.lower()).replace("أ", "ا").replace("إ", "ا").replace("آ", "ا").replace("ة", "ه").replace("ى", "ي"))

segs = json.load(open(WH, encoding="utf-8")); edl = json.load(open(EDL, encoding="utf-8")); SP = edl["speed"]
ranges = {}
POS = json.load(open(os.environ["EP_POS"])) if os.environ.get("EP_POS") else None
for i_, p in enumerate(edl["pieces"]):
    sc = SCENE_OF(p["note"]); a, b = (POS[i_][0], POS[i_][1]) if POS else (p["out_at"] / SP, (p["out_at"] + p["dur"]) / SP)
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
dur = round(POS[-1][1], 3) if POS else round(edl["duration"] / SP, 3)
T = dict(voice="recording", audio=AUDIO, duration=dur, sampleRate=48000, pauseScale=1.0,
         scenes=[dict(id=sc, start=round(a, 3), end=round(b, 3)) for sc, (a, b) in sorted(ranges.items())], lines=lines)
import os
if os.environ.get("EP06_STRICT"): T["strict"] = True
json.dump(T, open(OUT, "w", encoding="utf-8"), ensure_ascii=False)
src = {}
for l in lines:
    for keys, label in SOURCES:
        if any(k in l["raw"] for k in keys): src[l["id"]] = label; break
json.dump(dict(maxWords=9, overrides={}, sources=src, rename={}, renamePhrase={}), open(CAP, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{len(lines)} lines, {sum(len(l['words']) for l in lines)} words, {dur} s, scenes {[(s['id'], round(s['start']), round(s['end'])) for s in T['scenes']]}")
