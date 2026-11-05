"""
Per-sentence timbre matching of the re-recorded sentences (replaces the earlier pooled matching EQ).

    python -I rematch_retakes.py IN.wav TIMING.json OUT.wav

For each retake sentence: target EQ = -(raw retake - raw original take of the SAME sentence), octave
resolution, capped at +/-4 dB; the previously applied pooled EQ (up to +8 dB) is removed in the same
filter (net = target - old). Linear-phase FIR, applied silence-to-silence with 30 ms crossfades.
Timing is unchanged.
"""
import json, sys
import numpy as np, soundfile as sf
from scipy import signal

IN, TJ, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
y, sr = sf.read(IN, dtype="float64"); T = json.load(open(TJ, encoding="utf-8"))
L = {l["id"]: l for l in T["lines"]}; ids = [l["id"] for l in T["lines"]]
CAP = 4.0
OCT = np.array([125, 250, 500, 1000, 2000, 4000, 8000, 12000], float)
# "need" = how the retake differs (dB, octave bands); default: raw retake - raw original take of the same sentence.
# A later pass can pass a refined file (measured on the finished audio) as the 4th argument.
need = json.load(open(sys.argv[4] if len(sys.argv) > 4 else "/opt/nabd/v4/raw_octave_diff.json"))
SENT = {"S1": ("s2l3", None), "S2": ("s2l7", None), "S3": ("s6l7", None), "S4": ("s7l1", "حسب"), "S5": ("s7l2", None)}

# the pooled EQ that build_composite.py applied before (reproduced exactly)
diff = json.load(open("/opt/nabd/retake/eq_diff.json"))
fc = np.array([c for c, _ in diff], float); g = -np.array([d for _, d in diff], float)
g = np.convolve(np.pad(g, 1, mode="edge"), np.ones(3) / 3, mode="valid"); g = np.clip(g, -6.0, 8.0); g -= np.interp(1000, fc, g)
old = lambda f: np.interp(np.log(f), np.log(fc), g)

h = int(0.01 * sr); db = 20 * np.log10(np.sqrt((y[: len(y) // h * h].reshape(-1, h) ** 2).mean(1)) + 1e-12)
def quiet(a, b):
    ks = range(int(a * 100), int(b * 100) + 1); k = min(ks, key=lambda i: db[i]); return k / 100

X = int(0.03 * sr); fi = np.sin(np.linspace(0, np.pi / 2, X)) ** 2
out = y.copy(); log = {}
for key, (lid, fw) in SENT.items():
    ws = L[lid]["words"]
    if fw: ws = ws[[w["w"] for w in ws].index(fw):]
    k = ids.index(lid)
    prev_end = (L[lid]["words"][[w["w"] for w in L[lid]["words"]].index(fw) - 1]["end"] if fw else T["lines"][k - 1]["end"])
    nxt = T["lines"][k + 1]["start"]
    a = quiet(prev_end + 0.02, ws[0]["start"] - 0.02); b = quiet(ws[-1]["end"] + 0.02, nxt - 0.02)
    want = -np.array(need[key]); want -= np.interp(np.log(1000), np.log(OCT), want)   # 0 dB at 1 kHz (level re-matched later)
    target = np.clip(want, -CAP, CAP)                                                  # hard cap AFTER normalising
    freqs = np.geomspace(40, 20000, 200)
    net = np.interp(np.log(freqs), np.log(OCT), target) - old(freqs)
    gains = 10 ** (net / 20)
    FIR = signal.firwin2(4097, np.concatenate([[0], freqs, [sr / 2]]) / (sr / 2), np.concatenate([[gains[0]], gains, [gains[-1]]]))
    i0, i1 = int(a * sr) - X, int(b * sr) + X
    seg = signal.fftconvolve(y[i0 - 4096: i1 + 4096], FIR, mode="same")[4096: 4096 + (i1 - i0)]
    w = np.ones(i1 - i0); w[:X] = fi; w[-X:] = fi[::-1]
    out[i0:i1] = out[i0:i1] * (1 - w) + seg * w
    log[key] = dict(line=lid, span=[a, b], total_eq_db=dict(zip([int(f) for f in OCT], np.round(target, 1).tolist())),
                    residual_beyond_cap=dict(zip([int(f) for f in OCT], np.round(want - target, 1).tolist())))
sf.write(OUT, out.astype(np.float32), sr, subtype="FLOAT")
json.dump(log, open(OUT.replace(".wav", "_eq.json"), "w"), ensure_ascii=False, indent=1)
for k, v in log.items(): print(k, v["line"], "EQ", v["total_eq_db"], "| uncorrected (beyond ±4):", {f: x for f, x in v["residual_beyond_cap"].items() if abs(x) > 0.05})
