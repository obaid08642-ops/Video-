"""
Clean + master an edited voice track into the three candidate versions.

    python -I master_voice.py EDITED.wav OUT_DIR [A|B|C ...]

  denoise : DeepFilterNet 0.5.6 (MIT/Apache-2.0), attenuation limited to 18 dB (chosen: lowest speech
            distortion of afftdn / RNNoise / DeepFilterNet, see report)
  A natural : highpass 80 Hz -> de-esser -> gentle compression -> -14 LUFS, true peak <= -1 dBTP
  B warm    : A + EQ (+2.5 dB @180 Hz warmth, +1 dB @3 kHz clarity, -2.5 dB @7.5 kHz harshness)
  C warm-low: B + pitch -0.5 semitone, formants preserved (librubberband via ffmpeg, GPL-2.0+)
"""
import json, os, re, subprocess, sys

EDITED, OUT = sys.argv[1], sys.argv[2]
WANT = sys.argv[3:] or ["A", "B", "C"]
DF = "/opt/nabd/tools/deep-filter"
os.makedirs(OUT, exist_ok=True)

def sh(*a):
    return subprocess.run(a, check=True, capture_output=True, text=True)

# 1) denoise (DeepFilterNet wants 48 kHz; float input, it writes 16-bit PCM)
den = f"{OUT}/denoised.wav"
if not os.path.exists(den):
    tmp = f"{OUT}/_df_in.wav"
    sh("ffmpeg", "-v", "error", "-y", "-i", EDITED, "-ar", "48000", "-c:a", "pcm_f32le", tmp)
    os.makedirs(f"{OUT}/_df", exist_ok=True)
    sh(DF, "--compensate-delay", "--atten-lim-db", "18", "-o", f"{OUT}/_df", tmp)
    os.replace(f"{OUT}/_df/_df_in.wav", den); os.remove(tmp)

BASE = "highpass=f=80:poles=2,deesser=i=0.35:m=0.5:f=0.5:s=o"
COMP = "acompressor=threshold=-22dB:ratio=2:attack=12:release=140:knee=6:makeup=1"
WARM = "equalizer=f=180:t=q:w=0.9:g=2.5,equalizer=f=3000:t=q:w=1.2:g=1,equalizer=f=7500:t=q:w=1.0:g=-2.5"
PITCH = f"rubberband=pitch={2 ** (-0.5 / 12):.6f}:formant=preserved:pitchq=quality:transients=smooth:window=standard"
CHAINS = {
    "A": f"{BASE},{COMP}",
    "B": f"{BASE},{WARM},{COMP}",
    "C": f"{PITCH},{BASE},{WARM},{COMP}",
}

def measure_i(path):
    m = sh("ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-").stderr
    m = m[m.rfind("Summary"):]
    return float(re.search(r"I:\s+(-?[\d.]+) LUFS", m).group(1)), float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", m).group(1))


def loudnorm(src, dst):
    """gain to -14 LUFS (EBU R128), 4x-oversampled limiter for true peak <= -1 dBTP; iterate the gain so the
    integrated loudness lands on -14.0 after limiting"""
    i0, _ = measure_i(src)
    gain = -14.0 - i0
    for _ in range(4):
        af = (f"volume={gain:.2f}dB,aresample=192000,alimiter=limit=0.84:attack=1:release=60:level=false,"
              f"aresample=48000:resampler=soxr")
        sh("ffmpeg", "-v", "error", "-y", "-i", src, "-af", af, "-c:a", "pcm_s24le", dst)
        i, tp = measure_i(dst)
        if abs(i + 14.0) <= 0.1:
            break
        gain += -14.0 - i
    return i, tp


for v in WANT:
    pre = f"{OUT}/_pre_{v}.wav"
    sh("ffmpeg", "-v", "error", "-y", "-i", den, "-af", CHAINS[v], "-c:a", "pcm_f32le", pre)
    i, tp = loudnorm(pre, f"{OUT}/voice_{v}.wav"); os.remove(pre)
    print("done", v, f"{i} LUFS, true peak {tp} dBTP")
