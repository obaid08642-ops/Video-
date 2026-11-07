"""Builds nabd_project/video/src/data/ep04_captions.json from the long + Short timings (ep04).
Splits every line that has no valid <= 9-word split into balanced parts, then applies the hand-made display texts
(Latin names, years as digits, the 8 hours) and the renames (the spoken «برستمول» is written «باراسيتامول»,
«بنادول» is NEVER written on screen). Run once after the timing changes."""
import json, re, sys
BR = re.compile(r'[.؟?!:…]')
OUT = sys.argv[1]; TIMINGS = sys.argv[2:]
manual = {
 "s4l3": [{"words": [0, 6], "text": ["اسمه **AM404@إيه**"]}],
 "s3l17": [{"words": [0, 3], "text": ["أو **Cyclooxygenase@سايكلو**"]}],
 "s5l2": [{"words": [0, 12], "text": ["إحنا بنتكلم عن دوا اتصنع", "لأول مرة سنة **1878@ألف**…"]}],
 "s5l6": [{"words": [0, 11], "text": ["وفي سنة **1886@ألف**…", "حصلت **غلطة صيدلية** غير متوقعة…"]}],
 "s5l13": [{"words": [0, 8], "text": ["والحكاية دي انتشرت سنة **1886@ألف**…"]}],
 "s5l20": [{"words": [0, 6], "text": ["وفي سنة **1948@ألف**…"]}],
 "s6l2": [{"words": [0, 7], "text": ["في **22@اتنين سبتمبر 2025@ألفين**…"]}],
 "s6l13": [{"words": [0, 6], "text": ["ومنها **ACOG@الإيه**… أكدت"]}, {"words": [6, 11]}, {"words": [11, 18]}],
 "s6l15": [{"words": [0, 6]}, {"words": [6, 12]}, {"words": [12, 14]}],
 "s7l26": [{"words": [0, 7], "text": ["لأن فيه علاج اسمه", "**N-acetylcysteine@إن**"]}, {"words": [7, 11]}],
 "s7l27": [{"words": [0, 9], "text": ["وكل ما بدأ **بدري**…", "خصوصا خلال **أول 8@تمن ساعات**…"]}],
}
over = dict(manual)
for tf in TIMINGS:
    T = json.load(open(tf, encoding="utf-8"))
    for l in T["lines"]:
        if l["id"] in over: continue
        w = l["words"]; n = len(w)
        if n <= 9: continue
        cuts = [i + 1 for i, x in enumerate(w) if i < n - 1 and BR.search(x["punct"])]
        pts = [0] + cuts + [n]; seg = [pts[i + 1] - pts[i] for i in range(len(pts) - 1)]
        if max(seg) <= 9: continue            # the lib splits it fine at the "…" points
        # split the oversize segments evenly (<= 8 words), keep the natural breaks
        out = []
        for a, b in zip(pts, pts[1:]):
            k = -(-(b - a) // 8)
            for j in range(k): out.append({"words": [a + (b - a) * j // k, a + (b - a) * (j + 1) // k]})
        over[l["id"]] = out
srcs = {}
def src(ids, text):
    for i in ids: srcs[i] = text
src(["s2l9"], "FDA")
src([f"s4l{i}" for i in (2, 3, 4)], "J Biol Chem 2005")
src([f"s5l{i}" for i in range(6, 15)], "Eur J Pain 2015")
src([f"s5l{i}" for i in (20, 21, 22)], "J Pharmacol Exp Ther 1948")
src(["s6l13"], "ACOG 2025")
src(["s6l14"], "JAMA 2024 • JAMA Pediatrics 2026")
src([f"s7l{i}" for i in (26, 27, 28)], "Merck Manual • UCSF")
data = {
 "maxWords": 9,
 "rename": {"البرستمول": "الباراسيتامول", "والبرستمول": "والباراسيتامول", "برستمول": "باراسيتامول", "بنادول": "مسكن",
            "التايلينول": "Tylenol", "نابكي": "NAPQI", "النابكي": "NAPQI", "كوكس": "COX"},
 "renamePhrase": {"الإيه سي أو جي": "ACOG", "إيه إم فور أو فور": "AM404", "إن أسيتيل سيستين": "N-acetylcysteine",
                  "ألف تمنمية تمانية وسبعين": "1878", "ألف تمنمية ستة وتمانين": "1886", "ألف تسعمية تمانية وأربعين": "1948",
                  "اتنين وعشرين سبتمبر ألفين خمسة وعشرين": "22 سبتمبر 2025", "أول تمن ساعات": "أول 8 ساعات",
                  "سايكلو أوكسيجينيز": "Cyclooxygenase"},
 "overrides": over, "sources": srcs,
}
json.dump(data, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(over), "overrides;", len(srcs), "sources")
