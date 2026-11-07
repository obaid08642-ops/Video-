"""
10 ms energy profile (dBFS) of a window, to choose cut points: a clean cut needs frames <= -40 dBFS
(after gain-matching the take to ~-21 LUFS). Connected speech (no dip) must not be cut.

    python -I energy.py IN.wav T0 T1 [STEP_S=0.02]
"""
import sys
import numpy as np, soundfile as sf

y, sr = sf.read(sys.argv[1], dtype="float64")
if y.ndim > 1: y = y.mean(1)
a, b = float(sys.argv[2]), float(sys.argv[3]); st = float(sys.argv[4]) if len(sys.argv) > 4 else 0.02
H = int(0.01 * sr); db = 20 * np.log10(np.sqrt((y[: len(y) // H * H].reshape(-1, H) ** 2).mean(1)) + 1e-12)
k = int(round(st / 0.01))
print(" ".join(f"{a + i * st:.2f}:{db[int(a * 100) + k * i]:.0f}" for i in range(int((b - a) / st))))
s = db[int(a * 100):int(b * 100)]; q = int(np.argmin(s))
print(f"quietest {s.min():.1f} dBFS at {a + q / 100:.2f}s; frames <= -40: {(s <= -40).sum()}")
