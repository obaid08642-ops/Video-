"""
Trim the head/tail silence of an edited voice: keep 0.08 s before the first word and 0.10 s after the last,
10 ms fades; shifts the timing JSON.

    python -I trim_voice.py IN.wav TIMING.json OUT_DIR      -> OUT_DIR/voice.wav, OUT_DIR/timing.json
"""
import json, sys
import numpy as np, soundfile as sf

IN, TJ, OUT = sys.argv[1:4]
y, sr = sf.read(IN, dtype="float64"); T = json.load(open(TJ, encoding="utf-8"))
a = T["lines"][0]["words"][0]["start"] - 0.08; b = T["lines"][-1]["words"][-1]["end"] + 0.10
seg = y[int(a * sr):int(b * sr)].copy(); r = int(0.01 * sr); w = np.sin(np.linspace(0, np.pi / 2, r)) ** 2
seg[:r] *= w; seg[-r:] *= w[::-1]
for l in T["lines"]:
    for x in l["words"]: x["start"] = round(x["start"] - a, 3); x["end"] = round(x["end"] - a, 3)
    l["start"], l["end"] = l["words"][0]["start"], l["words"][-1]["end"]
for s in T["scenes"]: s["start"] = round(s["start"] - a, 3); s["end"] = round(s["end"] - a, 3)
T["duration"] = round(len(seg) / sr, 3); T["trim_head"] = round(a, 3)
sf.write(f"{OUT}/voice.wav", seg.astype(np.float32), sr, subtype="FLOAT")
json.dump(T, open(f"{OUT}/timing.json", "w"), ensure_ascii=False, indent=1)
print("head cut", round(a, 3), "duration", T["duration"], "+1.5 logo =", round(T["duration"] + 1.5, 2))
