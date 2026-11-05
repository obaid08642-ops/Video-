"""
Speed up one sentence of an edited voice (pitch kept), splice it back silence-to-silence.

    python -I speed_line.py IN.wav TIMING.json LINE_ID FACTOR METHOD OUT_DIR
METHOD: atempo (WSOLA) | rubberband
"""
import json, subprocess, sys
import numpy as np, soundfile as sf

IN, TJ, LID, FACTOR, METHOD, OUT = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]), sys.argv[5], sys.argv[6]
y, sr = sf.read(IN, dtype="float64")
T = json.load(open(TJ, encoding="utf-8"))
h = int(0.01 * sr)
db = 20 * np.log10(np.sqrt((y[: len(y) // h * h].reshape(-1, h) ** 2).mean(1)) + 1e-12)
ids = [l["id"] for l in T["lines"]]; k = ids.index(LID)
L, P, N = T["lines"][k], T["lines"][k - 1], T["lines"][k + 1]
def quietest(a, b):
    ks = range(int(a * 100), int(b * 100) + 1); q = min(ks, key=lambda i: db[i]); assert db[q] < -44, db[q]; return q / 100
a = quietest(P["end"] + 0.03, L["start"] - 0.03)      # in the pause before the sentence
b = quietest(L["end"] + 0.03, N["start"] - 0.03)      # in the pause after it
seg = y[int(a * sr): int(b * sr)]
sf.write(f"{OUT}/_seg.wav", seg.astype(np.float32), sr, subtype="FLOAT")
af = {"atempo": f"atempo={FACTOR}",
      "rubberband": f"rubberband=tempo={FACTOR}:pitchq=quality:transients=smooth:detector=soft:window=standard"}[METHOD]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{OUT}/_seg.wav", "-af", af, "-c:a", "pcm_f32le", f"{OUT}/_fast.wav"], check=True)
fast, _ = sf.read(f"{OUT}/_fast.wav", dtype="float64")
X = int(0.03 * sr); fi = np.sin(np.linspace(0, np.pi / 2, X)) ** 2
head = y[: int(a * sr)].copy(); tail = y[int(b * sr):].copy()
mid = fast.copy()
head[-X:] = head[-X:] * fi[::-1] + mid[:X] * fi; mid = mid[X:]
mid[-X:] = mid[-X:] * fi[::-1] + tail[:X] * fi; tail = tail[X:]
out = np.concatenate([head, mid, tail])
r = len(fast) / len(seg)          # actual time ratio
new_len = len(fast) / sr - 2 * X / sr  # crossfades overlap
def to_out(t):
    if t <= a: return t
    if t >= b: return t - (b - a) + (len(fast) / sr) - 2 * X / sr
    return a + (t - a) * r - X / sr * ((t - a) / (b - a))
for l in T["lines"]:
    for w in l["words"]: w["start"], w["end"] = round(to_out(w["start"]), 3), round(to_out(w["end"]), 3)
    l["start"], l["end"] = l["words"][0]["start"], l["words"][-1]["end"]
for s in T["scenes"]:
    ls = [l for l in T["lines"] if l["scene"] == s["id"]]; s["start"], s["end"] = ls[0]["start"], ls[-1]["end"]
T["duration"] = round(len(out) / sr, 3)
sf.write(f"{OUT}/sped_{METHOD}.wav", out.astype(np.float32), sr, subtype="FLOAT")
json.dump(T, open(f"{OUT}/timing_sped_{METHOD}.json", "w"), ensure_ascii=False, indent=1)
print(f"{LID}: {a:.2f}-{b:.2f}s ({b-a:.2f}s) x{FACTOR} [{METHOD}] -> {len(fast)/sr:.2f}s; total {len(out)/sr:.2f}s")
