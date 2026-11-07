"""
Last-pass breath check on a finished voice: unvoiced sounds inside pauses (> 50 ms, high spectral centroid) are
breaths the editor did not classify; lower them by DB (never remove them). 15 ms ramps.

    python -I lower_breaths.py IN.wav TIMING.json OUT.wav [DB=-12] [REPORT.json]
"""
import json, sys
import numpy as np, soundfile as sf, librosa

IN, TJ, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
GAIN = 10 ** (float(sys.argv[4]) / 20) if len(sys.argv) > 4 else 10 ** (-12 / 20)
REP = sys.argv[5] if len(sys.argv) > 5 else None
y, sr = sf.read(IN, dtype="float64")
H = int(0.01 * sr)
db = 20 * np.log10(np.sqrt((y[: len(y) // H * H].reshape(-1, H) ** 2).mean(1)) + 1e-12)
T = json.load(open(TJ, encoding="utf-8"))
W = [w for l in T["lines"] for w in l["words"]]
r = int(0.015 * sr); ramp = np.sin(np.linspace(0, np.pi / 2, r)) ** 2
done = []
for a, b in zip(W, W[1:]):
    i0, i1 = int(a["end"] * 100) + 3, int(b["start"] * 100) - 3
    if i1 - i0 < 8: continue
    act = db[i0:i1] > -42; k = 0
    while k < len(act):
        if not act[k]: k += 1; continue
        s = k
        while k < len(act) and act[k]: k += 1
        if k - s < 5: continue
        seg = y[(i0 + s) * H:(i0 + k) * H]
        _, v, _ = librosa.pyin(np.pad(seg, (0, max(0, 4096 - len(seg)))), fmin=70, fmax=350, sr=sr, frame_length=2048, hop_length=H)
        c = float(librosa.feature.spectral_centroid(y=seg, sr=sr, n_fft=1024, hop_length=H).mean())
        if np.nanmean(v) > 0.3 or c < 1500: continue          # voiced / dark: not a breath, leave it
        p0, p1 = (i0 + s) * H - r, (i0 + k) * H + r
        g = np.full(p1 - p0, GAIN); g[:r] = 1 - (1 - GAIN) * ramp; g[-r:] = g[:r][::-1]
        y[p0:p1] *= g
        done.append(dict(t=round((i0 + s) / 100, 2), ms=(k - s) * 10, peak_before=round(float(db[i0 + s:i0 + k].max()), 1), centroid=round(c)))
sf.write(OUT, y.astype(np.float32), sr, subtype="FLOAT")
if REP: json.dump(done, open(REP, "w"), ensure_ascii=False, indent=1)
print(f"{len(done)} breaths lowered by {20*np.log10(GAIN):.0f} dB")
