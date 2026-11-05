"""Loudness, true peak, noise floor, speech/noise ratio, hum share, for any wav."""
import sys, json, subprocess, re
import numpy as np, soundfile as sf
def measure(path):
    y, sr = sf.read(path, dtype="float64")
    if y.ndim > 1: y = y.mean(1)
    o = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    summ = o[o.rfind("Summary"):]
    I = float(re.search(r"I:\s+(-?[\d.]+) LUFS", summ).group(1)); TP = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", summ).group(1))
    hop = int(0.02 * sr); fr = y[: len(y) // hop * hop].reshape(-1, hop)
    rms = 20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-12)
    noise = np.percentile(rms, 5); speech = np.percentile(rms, 90)
    quiet = fr[rms <= np.percentile(rms, 8)].ravel()
    S = np.abs(np.fft.rfft(quiet[: len(quiet) // 4096 * 4096].reshape(-1, 4096) * np.hanning(4096), axis=1)) ** 2
    f = np.fft.rfftfreq(4096, 1 / sr); P = S.mean(0)
    hum = 10 * np.log10(P[f < 200].sum() / P.sum())
    return dict(file=path.split("/")[-1], lufs=I, true_peak_dbtp=TP, noise_floor_dbfs=round(noise, 1), speech_level_dbfs=round(speech, 1),
                snr_db=round(speech - noise, 1), noise_below_200hz_pct=round(100 * 10 ** (hum / 10), 1), duration=round(len(y) / sr, 2))
if __name__ == "__main__":
    for p in sys.argv[1:]: print(json.dumps(measure(p), ensure_ascii=False))
