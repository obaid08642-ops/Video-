"""
Quality checks on a finished voice before delivery (see CONTEXT.md 6.12):
duration, pauses, isolated sounds left in pauses, sentence level spread, timbre per scene, reverb tail vs ep01/ep02.
Also run tools/stt/transcribe.py on the file and read it end to end (every sentence once, no fragments).

    python -I qa_voice.py VOICE.wav TIMING.json [LINE_LEVELS.json]
"""
import json, os, sys
import numpy as np, soundfile as sf
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "voice", "recording"))
import timbre_metrics as tm  # noqa: E402

y, sr = sf.read(sys.argv[1]); H = int(.01 * sr)
db = 20 * np.log10(np.sqrt((y[:len(y) // H * H].reshape(-1, H) ** 2).mean(1)) + 1e-12)
T = json.load(open(sys.argv[2], encoding="utf-8")); L = T["lines"]; W = [w for l in L for w in l["words"]]
print("duration %.2f s (+1.5 logo = %.2f)" % (len(y) / sr, len(y) / sr + 1.5))
w = np.array([b["start"] - a["end"] for l in L for a, b in zip(l["words"], l["words"][1:])]); w = w[w > 0.15]
bt = np.array([L[i + 1]["start"] - L[i]["end"] for i in range(len(L) - 1)])
print(f"pauses within (n={len(w)}): median {np.median(w):.2f} max {w.max():.2f} | between (n={len(bt)}): median {np.median(bt):.2f} min {bt.min():.2f} max {bt.max():.2f}")
iso = []
for a, b in zip(W, W[1:]):
    i0, i1 = int(a["end"] * 100), int(b["start"] * 100); act = db[i0:i1] > -40; k = 0
    while k < len(act):
        if act[k]:
            s = k
            while k < len(act) and act[k]: k += 1
            if s >= 6 and k <= len(act) - 6: iso.append(((i0 + s) / 100, (k - s) * 10, round(float(db[i0 + s:i0 + k].max()), 1), a["w"], b["w"]))
        else: k += 1
print(f"isolated sounds inside pauses: {len(iso)} (<=50 ms -> declick_gaps.py; unvoiced & bright -> lower_breaths.py)")
for x in iso[:15]: print("   ", x)
if len(sys.argv) > 3:
    LL = json.load(open(sys.argv[3])); lv = np.array([l["level"] for l in LL])
    print("sentence level p10-p90 %.1f dB, max |dev| %.2f" % (np.percentile(lv, 90) - np.percentile(lv, 10), max(abs(l["dev"]) for l in LL)))
S = {s["id"]: np.array(tm.spectrum(y[int(s["start"] * sr):int(s["end"] * sr)], sr)) for s in T["scenes"]}
M = np.mean(list(S.values()), 0); fc = np.array(tm.FC); band = (fc >= 200) & (fc <= 5000)
print("timbre per scene vs episode mean (200-5k, mean/max dB):", " ".join(f"{k}:{np.abs((v - M)[band]).mean():.2f}/{np.abs((v - M)[band]).max():.2f}" for k, v in S.items()))
rv, n = tm.reverb_tail(y, sr, [(a["end"], b["start"]) for a, b in zip(W, W[1:])])
print(f"reverb tail {rv:.1f} dB (n={n})   [ep01 final -21.9, ep02 -10.3, ep03 -15.5; higher = roomier]")
