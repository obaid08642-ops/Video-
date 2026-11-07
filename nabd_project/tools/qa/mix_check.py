"""
After rendering: subtract the voice from the mix -> music+SFX residual (50 ms RMS), compare with ep01,
and check that the music is silent just before the big moments.

    python -I mix_check.py VIDEO.mp4 VOICE.wav [T_MOMENT ...]
ep01 reference: speech p90 -10.2 | residual p50 -36.6, p99 -25.6, max -20.0. Before a big moment: <= about -55 dB.
"""
import subprocess, sys, tempfile, os
import numpy as np, soundfile as sf

tmp = os.path.join(tempfile.mkdtemp(), "mix.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", sys.argv[1], "-ac", "1", "-ar", "48000", "-c:a", "pcm_f32le", tmp], check=True)
m, sr = sf.read(tmp); v, _ = sf.read(sys.argv[2]); v = v if v.ndim == 1 else v.mean(1)
n = min(len(m), len(v)); m, v = m[:n], v[:n]; g = np.dot(m, v) / np.dot(v, v); r = m - g * v
H = int(.05 * sr); db = lambda x: 20 * np.log10(np.sqrt((x[:len(x) // H * H].reshape(-1, H) ** 2).mean(1)) + 1e-12)
dv, dr = db(g * v), db(r)
print("speech p90 %.1f | music+sfx p50 %.1f p99 %.1f max %.1f" % (np.percentile(dv, 90), np.percentile(dr, 50), np.percentile(dr, 99), dr.max()))
for t in map(float, sys.argv[3:]):
    k = lambda s: int(s / 0.05)
    print(f"before {t:.2f}s: [-2,-1.3] {dr[k(t - 2):k(t - 1.3)].mean():.1f} dB -> [-0.9,0] {dr[k(t - 0.9):k(t)].mean():.1f} dB")
