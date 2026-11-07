"""
Voice colour vs a reference episode: long-term speech spectrum, both normalised at 1-3 kHz, mean dB per band.
Use it to design NABD_PRE_EQ (target: every band within ~±4.5 dB of ep01, like ep02 was).

    python -I ltas_compare.py VOICE.wav TIMING.json [REF.wav REF_TIMING.json]   (default ref = ep01 final voice)
"""
import json, os, sys
import numpy as np, soundfile as sf
from scipy import signal

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "video", "public", "voice")
def ltas(wav, tj):
    y, sr = sf.read(wav); y = y if y.ndim == 1 else y.mean(1); T = json.load(open(tj, encoding="utf-8"))
    sp = np.concatenate([y[int(w["start"] * sr):int(w["end"] * sr)] for l in T["lines"] for w in l["words"]])
    f, P = signal.welch(sp, sr, nperseg=8192); return f, 10 * np.log10(P + 1e-20)
ref = sys.argv[3:5] if len(sys.argv) > 4 else [os.path.join(ROOT, "ep01_recording.wav"), os.path.join(ROOT, "ep01_recording_timing.json")]
f, a = ltas(*ref); _, c = ltas(sys.argv[1], sys.argv[2])
m = (f > 1000) & (f < 3000); d = (c - c[m].mean()) - (a - a[m].mean())
bands = [(60, 100), (100, 150), (150, 220), (220, 350), (350, 500), (500, 800), (800, 1500), (1500, 3000), (3000, 6000), (6000, 10000)]
print("vs ref (dB):", "  ".join(f"{lo}-{hi}:{d[(f >= lo) & (f < hi)].mean():+.1f}" for lo, hi in bands))
