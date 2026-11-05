"""Timbre metrics for a speech span: 1/3-oct spectrum, low-end ratio, reverb tail, room tone, dynamics."""
import numpy as np

FC = [100 * 2 ** (k / 3) for k in range(0, 22)]  # 100 Hz .. ~10 kHz


def _frames(y, sr, n=2048, hop=512):
    if len(y) < n: y = np.pad(y, (0, n - len(y)))
    fr = np.lib.stride_tricks.sliding_window_view(y, n)[::hop] * np.hanning(n)
    return fr, np.fft.rfftfreq(n, 1 / sr)


def spectrum(y, sr):
    fr, f = _frames(y, sr)
    lv = 10 * np.log10((fr ** 2).mean(1) + 1e-15)
    sp = lv > np.max(lv) - 30                         # speech frames
    P = (np.abs(np.fft.rfft(fr[sp], axis=1)) ** 2).mean(0)
    out = []
    for c in FC:
        m = (f >= c / 2 ** (1 / 6)) & (f < c * 2 ** (1 / 6))
        out.append(10 * np.log10(P[m].mean() + 1e-20))
    out = np.array(out); mid = [i for i, c in enumerate(FC) if 300 <= c <= 3000]
    return out - np.median(out[mid])


def low_end(y, sr):
    fr, f = _frames(y, sr)
    lv = 10 * np.log10((fr ** 2).mean(1) + 1e-15); sp = lv > np.max(lv) - 30
    P = (np.abs(np.fft.rfft(fr[sp], axis=1)) ** 2).mean(0)
    return 10 * np.log10(P[(f >= 80) & (f < 250)].sum() / P[(f >= 250) & (f < 2000)].sum())


def reverb_tail(y, sr, word_ends_next):
    """median dB of energy 30-110 ms after a word ends (pause >= 0.15 s follows) relative to the last 60 ms of
    the word: higher (less negative) = more room reverb / slower decay"""
    h = int(0.005 * sr); vals = []
    for e, nxt in word_ends_next:
        if nxt - e < 0.15: continue
        a = y[int((e - 0.06) * sr): int(e * sr)]; b = y[int((e + 0.03) * sr): int((e + 0.11) * sr)]
        if len(a) < h or len(b) < h: continue
        vals.append(10 * np.log10((b ** 2).mean() + 1e-15) - 10 * np.log10((a ** 2).mean() + 1e-15))
    return float(np.median(vals)) if vals else None, len(vals)


def room_tone(y, sr, gaps):
    segs = [y[int((a + 0.05) * sr): int((b - 0.05) * sr)] for a, b in gaps if b - a > 0.2]
    if not segs: return None
    s = np.concatenate(segs); return float(10 * np.log10((s ** 2).mean() + 1e-15))


def dynamics(y, sr):
    h = int(0.02 * sr); fr = y[: len(y) // h * h].reshape(-1, h)
    lv = 20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-12); act = lv[lv > lv.max() - 30]
    return float(np.percentile(act, 90) - np.percentile(act, 30))
