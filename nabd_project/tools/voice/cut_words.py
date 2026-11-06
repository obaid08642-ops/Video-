"""
Remove whole words from a finished voice, silence to silence (30 ms equal-power crossfade), and update the timing.

    python -I cut_words.py IN.wav TIMING.json LINE_ID FIRST_WORD_IDX LAST_WORD_IDX PAUSE_S OUT_DIR

The cut runs from the quietest 10 ms frame in the pause before the first removed word to the quietest frame
in the pause after the last one, placed so the remaining pause is about PAUSE_S. Refuses if either cut point
is louder than -40 dBFS. Writes cut.wav, timing_cut.json, cut.json.
"""
import json, sys
import numpy as np, soundfile as sf

IN, TJ, LID, I0, I1, PAUSE, OUT = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]), float(sys.argv[6]), sys.argv[7]
y, sr = sf.read(IN, dtype="float64")
T = json.load(open(TJ, encoding="utf-8"))
H = int(0.01 * sr)
db = 20 * np.log10(np.sqrt((y[: len(y) // H * H].reshape(-1, H) ** 2).mean(1)) + 1e-12)
line = next(l for l in T["lines"] if l["id"] == LID)
ws = line["words"]
prev_end, first_start = ws[I0 - 1]["end"], ws[I0]["start"]
last_end, next_start = ws[I1]["end"], ws[I1 + 1]["start"]
g1, g2 = first_start - prev_end, next_start - last_end
# split the wanted pause between the two sides in proportion to the gaps that exist
h1 = min(g1 - 0.03, PAUSE * g1 / (g1 + g2)); h2 = PAUSE - h1


def quiet(t, lo, hi):
    ks = range(int(max(lo, t - 0.05) * 100), int(min(hi, t + 0.05) * 100) + 1)
    return min(ks, key=lambda k: db[k]) / 100


a = quiet(prev_end + h1, prev_end + 0.04, first_start - 0.03)
b = quiet(next_start - h2, last_end + 0.04, next_start - 0.03)
assert db[int(a * 100)] < -40 and db[int(b * 100)] < -40, (db[int(a * 100)], db[int(b * 100)])
X = int(0.03 * sr); fi = np.sin(np.linspace(0, np.pi / 2, X)) ** 2
head, tail = y[: int(a * sr)].copy(), y[int(b * sr):].copy()
head[-X:] = head[-X:] * fi[::-1] + tail[:X] * fi
out = np.concatenate([head, tail[X:]])
shift = (b - a) + X / sr
removed = ws[I0: I1 + 1]
line["words"] = ws[:I0] + ws[I1 + 1:]
for l in T["lines"]:
    for w in l["words"]:
        if w["start"] >= b - 1e-3:
            w["start"], w["end"] = round(w["start"] - shift, 3), round(w["end"] - shift, 3)
    l["start"], l["end"] = l["words"][0]["start"], l["words"][-1]["end"]
for s in T["scenes"]:
    ls = [l for l in T["lines"] if l["scene"] == s["id"]]
    s["start"], s["end"] = ls[0]["start"], ls[-1]["end"]
T["duration"] = round(len(out) / sr, 3)
k = line["words"][I0 - 1]
sf.write(f"{OUT}/cut.wav", out.astype(np.float32), sr, subtype="FLOAT")
json.dump(T, open(f"{OUT}/timing_cut.json", "w"), ensure_ascii=False, indent=1)
rep = dict(line=LID, removed=" ".join(w["w"] for w in removed), cut_from=round(a, 3), cut_to=round(b, 3),
           db_at_cuts=[round(float(db[int(a * 100)]), 1), round(float(db[int(b * 100)]), 1)],
           pause_after=round(line["words"][I0]["start"] - k["end"], 3), duration=T["duration"])
json.dump(rep, open(f"{OUT}/cut.json", "w"), ensure_ascii=False, indent=1)
print(rep)
