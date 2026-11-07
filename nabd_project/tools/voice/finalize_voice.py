"""
Final voice (chosen version A) with sentence-level loudness review.

    python -I finalize_voice.py EDITED.wav WORDS_OUT.json OUT_DIR [HPF_HZ]

1. DeepFilterNet (atten. limit 18 dB)    2. chain A: highpass -> de-esser -> gentle compression
3. sentence loudness review: every line's active-speech level vs. the median of its neighbours (2 each side);
   lines off by more than 1.5 dB are brought back to within 0.5 dB with a gain ride whose ramps sit in the
   pauses between lines (never inside a word)
4. -14 LUFS (EBU R128), true peak <= -1 dBTP (4x oversampled limiter)
"""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf

EDITED, WORDS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
HPF = sys.argv[4] if len(sys.argv) > 4 else "80"            # "80" (12 dB/oct) or e.g. "90x4" (24 dB/oct)
HZ, POLES = (HPF.split("x") + ["2"])[:2]
PRESET = sys.argv[5] if len(sys.argv) > 5 else "A"
# A : natural and clean.  Aplus : A with a little less boxiness, more presence and a touch of air
#     (no pitch change, no low-end boost): -1.5 dB @300 Hz, +1.25 dB @3.2 kHz, +1 dB shelf from 10.5 kHz,
#     de-esser after the shelf, slightly firmer (still gentle) compression.
TONE = {"A": "", "Aplus": "equalizer=f=300:t=q:w=1.6:g=-1.5,equalizer=f=3200:t=q:w=1.3:g=1.25,highshelf=f=10500:t=q:w=0.7:g=1,"}[PRESET]
DEESS = {"A": "deesser=i=0.35:m=0.5:f=0.5:s=o", "Aplus": "deesser=i=0.45:m=0.5:f=0.5:s=o"}[PRESET]
COMP = {"A": "acompressor=threshold=-22dB:ratio=2:attack=12:release=140:knee=6:makeup=1",
        "Aplus": "acompressor=threshold=-24dB:ratio=2.5:attack=8:release=110:knee=6:makeup=1"}[PRESET]
os.makedirs(OUT, exist_ok=True)
sh = lambda *a: subprocess.run(a, check=True, capture_output=True, text=True)

den = f"{OUT}/denoised.wav"
if not os.path.exists(den):
    sh("ffmpeg", "-v", "error", "-y", "-i", EDITED, "-ar", "48000", "-c:a", "pcm_f32le", f"{OUT}/_in.wav")
    os.makedirs(f"{OUT}/_df", exist_ok=True)
    sh("/opt/nabd/tools/deep-filter", "--compensate-delay", "--atten-lim-db", "18", "-o", f"{OUT}/_df", f"{OUT}/_in.wav")
    os.replace(f"{OUT}/_df/_in.wav", den); os.remove(f"{OUT}/_in.wav")
# words: either the edit tool's words_out list or a video timing JSON
_wj = json.load(open(WORDS, encoding="utf-8"))
if isinstance(_wj, dict):
    _wl = []
    for k, l in enumerate(_wj["lines"]):
        for w in l["words"]: _wl.append(dict(w=w["w"], line=k, scene=l["scene"], start=w["start"], end=w["end"]))
    WORDS = f"{OUT}/_words.json"; json.dump(_wl, open(WORDS, "w"), ensure_ascii=False)

if POLES == "b4":   # true 4th-order Butterworth (24 dB/oct) done in scipy: rumble down, voice fundamental untouched
    from scipy import signal as _sg
    _y, _sr = sf.read(den, dtype="float64")
    _y = _sg.sosfilt(_sg.butter(4, float(HZ), "highpass", fs=_sr, output="sos"), _y)
    src_for_chain = f"{OUT}/_hpf_b4.wav"; sf.write(src_for_chain, _y.astype(np.float32), _sr, subtype="FLOAT")
    hpf = "anull"
else:
    src_for_chain = den
    hpf = f"highpass=f={HZ}:poles=2" + (f",highpass=f={HZ}:poles=2" if POLES == "4" else "")
PRE_EQ = os.environ.get("NABD_PRE_EQ", "")   # per-recording mic/room correction (e.g. ep03: phone farther away, boomy low end)
chain = f"{hpf},{PRE_EQ + ',' if PRE_EQ else ''}{TONE}{DEESS},{COMP}"
pre = f"{OUT}/_pre_{HPF}_{PRESET}.wav"
sh("ffmpeg", "-v", "error", "-y", "-i", src_for_chain, "-af", chain, "-c:a", "pcm_f32le", pre)

# ---------------------------------------------------------------- sentence loudness review
y, sr = sf.read(pre, dtype="float64")
W = json.load(open(WORDS, encoding="utf-8"))
lines = {}
for w in W: lines.setdefault(w["line"], []).append(w)
L = [dict(line=k, scene=v[0]["scene"], start=v[0]["start"], end=v[-1]["end"], text=" ".join(x["w"] for x in v)) for k, v in sorted(lines.items())]
h = int(0.01 * sr)
db = 20 * np.log10(np.sqrt((y[: len(y) // h * h].reshape(-1, h) ** 2).mean(1)) + 1e-12)
def level(a, b):
    s = db[int(a * 100): int(b * 100)]; s = s[s > np.percentile(db, 50) - 6]
    s = s[s > -40]
    return 10 * np.log10(np.mean(10 ** (s / 10))) if len(s) else None
for l in L: l["level"] = level(l["start"], l["end"])
for i, l in enumerate(L):
    nb = [L[j]["level"] for j in range(max(0, i - 2), min(len(L), i + 3)) if j != i and L[j]["level"] is not None]
    l["ref"] = float(np.median(nb)); l["dev"] = l["level"] - l["ref"]
    l["fix"] = 0.0 if abs(l["dev"]) <= 1.5 else -(l["dev"] - np.sign(l["dev"]) * 0.5)
gain_db = np.zeros(len(y))
for i, l in enumerate(L):
    if l["fix"] == 0: continue
    # ramps of 40 ms centred in the pauses before / after the line
    a = (L[i - 1]["end"] + l["start"]) / 2 if i else max(0.0, l["start"] - 0.05)
    b = (l["end"] + L[i + 1]["start"]) / 2 if i + 1 < len(L) else len(y) / sr
    r = 0.02
    i0, i1 = max(0, int((a - r) * sr)), min(len(y), int((b + r) * sr))
    env = np.interp(np.arange(i0, i1) / sr, [a - r, a + r, b - r, b + r], [0, l["fix"], l["fix"], 0])
    gain_db[i0:i1] += env
y = y * 10 ** (gain_db / 20)
rode = f"{OUT}/_rode_{HPF}_{PRESET}.wav"; sf.write(rode, y.astype(np.float32), sr, subtype="FLOAT")
db = 20 * np.log10(np.sqrt((y[: len(y) // h * h].reshape(-1, h) ** 2).mean(1)) + 1e-12)
for l in L: l["level_after"] = level(l["start"], l["end"])

# ---------------------------------------------------------------- loudness + true peak
def measure(p):
    m = sh("ffmpeg", "-hide_banner", "-nostats", "-i", p, "-af", "ebur128=peak=true", "-f", "null", "-").stderr
    m = m[m.rfind("Summary"):]
    return float(re.search(r"I:\s+(-?[\d.]+) LUFS", m).group(1)), float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", m).group(1))
final = f"{OUT}/voice_{PRESET}_hpf{HPF}.wav"
g = -14.0 - measure(rode)[0]
for _ in range(8):
    sh("ffmpeg", "-v", "error", "-y", "-i", rode, "-af",
       f"volume={g:.2f}dB,aresample=192000,alimiter=limit=0.84:attack=1:release=60:level=false,aresample=48000:resampler=soxr",
       "-c:a", "pcm_s24le", final)
    i, tp = measure(final)
    if abs(i + 14) <= 0.05: break
    g += -14.0 - i
json.dump(L, open(f"{OUT}/line_levels_{PRESET}_hpf{HPF}.json", "w"), ensure_ascii=False, indent=1)
for p in (pre, rode): os.remove(p)
print(f"{final}: {i} LUFS, true peak {tp} dBTP; lines fixed: {sum(1 for l in L if l['fix'])}")
