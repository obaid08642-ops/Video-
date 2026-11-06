"""
Last-pass declick on a finished voice: short isolated ticks inside pauses -> room tone.

    python -I declick_gaps.py IN.wav TIMING.json OUT.wav [REPORT.json]

A tick = a run of 10 ms frames above -40 dBFS, <= 50 ms long, inside a pause between two words and
separated from both words by >= 60 ms of quiet. Breaths (longer runs) and anything touching a word are
never touched. Replacement = the file's own quietest 0.4 s (inside a pause), 5 ms equal-power ramps.
"""
import json, sys
import numpy as np, soundfile as sf

IN, TJ, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
REP = sys.argv[4] if len(sys.argv) > 4 else None
y, sr = sf.read(IN, dtype="float64")
H = int(0.01 * sr)
db = 20 * np.log10(np.sqrt((y[: len(y) // H * H].reshape(-1, H) ** 2).mean(1)) + 1e-12)
T = json.load(open(TJ, encoding="utf-8"))
W = [w for l in T["lines"] for w in l["words"]]

# room tone: quietest 0.4 s window that lies inside a pause
best = None
for a, b in zip(W, W[1:]):
    i0, i1 = int(a["end"] * 100) + 5, int(b["start"] * 100) - 5
    for s in range(i0, i1 - 40):
        m = db[s: s + 40].max()
        if best is None or m < best[0]: best = (m, s)
rt = y[best[1] * H: (best[1] + 40) * H].copy()
rng = np.random.default_rng(11)
r = int(0.005 * sr); ramp = np.sin(np.linspace(0, np.pi / 2, r)) ** 2

fixed = []
for a, b in zip(W, W[1:]):
    i0, i1 = int(a["end"] * 100), int(b["start"] * 100)
    if i1 - i0 < 14: continue
    act = db[i0:i1] > -40
    k = 0
    while k < len(act):
        if not act[k]: k += 1; continue
        s = k
        while k < len(act) and act[k]: k += 1
        e = k
        if s >= 6 and e <= len(act) - 6 and (e - s) <= 5:
            p0, p1 = (i0 + s - 1) * H, (i0 + e + 1) * H
            n = p1 - p0
            st = rng.integers(0, len(rt) - n - 1)
            g = np.ones(n); g[:r] = ramp; g[-r:] = ramp[::-1]
            y[p0:p1] = y[p0:p1] * (1 - g) + rt[st: st + n] * g
            fixed.append(dict(t=round((i0 + s) / 100, 2), ms=(e - s) * 10, peak=round(float(db[i0 + s: i0 + e].max()), 1),
                              between=[a["w"], b["w"]]))
sf.write(OUT, y.astype(np.float32), sr, subtype="FLOAT")
if REP: json.dump(fixed, open(REP, "w"), ensure_ascii=False, indent=1)
print(f"room tone from {best[1]/100:.2f}s (peak {best[0]:.1f} dBFS); {len(fixed)} ticks replaced")
