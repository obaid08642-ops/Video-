"""
Splice re-recorded sentences into the original recording (silence to silence) and fix the quiet hook start.

    python -I build_composite.py PLAN.json OUT_DIR

For each retake: cut silence->silence, matching EQ (linear-phase FIR from the same sentences recorded in
both sessions), level match to the neighbouring original sentences, retake room noise replaced by the
original room tone in the pauses, optional pause lengthening, 30 ms equal-power crossfades at the splice
points (always in silence). Writes composite.wav, the new verbatim transcript, cut list with shifted times.
"""
import json, sys
import numpy as np, soundfile as sf
from scipy import signal

sys.path.insert(0, "/opt/nabd/edit"); import align as AO          # original-session aligner
sys.path.insert(0, "/opt/nabd/retake"); import align_r as AR      # retake-session aligner

P = json.load(open(sys.argv[1], encoding="utf-8")); OUT = sys.argv[2]
raw, sr = sf.read(P["original"], dtype="float64")
ret, sr2 = sf.read(P["retake"], dtype="float64"); assert sr == sr2 == 48000
X = int(0.030 * sr)

def dbs(y):
    h = int(0.01 * sr); return 20 * np.log10(np.sqrt((y[: len(y) // h * h].reshape(-1, h) ** 2).mean(1)) + 1e-12)
DBO, DBR = dbs(raw), dbs(ret)

def quiet_point(db, lo, hi, prefer):
    """quietest 10 ms frame in [lo, hi] (seconds), ties broken towards `prefer`; must be real silence"""
    ks = range(int(lo * 100), int(hi * 100) + 1)
    k = min(ks, key=lambda k: (round(db[k], 0), abs(k / 100 - prefer)))
    assert db[k] < -44, f"no silence between {lo:.2f} and {hi:.2f} (best {db[k]:.1f} dB)"
    return k / 100

def words_span(aligner, text, a, b):
    ws = text.split(); res, _ = aligner.align(ws, int(a / 0.02002), int(b / 0.02002))
    return res

def active_level(db, a, b):
    s = db[int(a * 100): int(b * 100)]; s = s[s > -40]; return 10 * np.log10(np.mean(10 ** (s / 10)))

# ---- matching EQ (retake -> original), from identical sentences; 1/3-octave, smoothed, capped
diff = json.load(open(P["eq_diff"]))
fc = np.array([c for c, _ in diff], float); g = -np.array([d for _, d in diff], float)
g = np.convolve(np.pad(g, 1, mode="edge"), np.ones(3) / 3, mode="valid")          # smooth across bands
g = np.clip(g, -6.0, 8.0); g -= np.interp(1000, fc, g)                            # 0 dB at 1 kHz
freqs = np.concatenate([[0], fc, [sr / 2]]) / (sr / 2); gains = 10 ** (np.concatenate([[g[0]], g, [g[-1]]]) / 20)
FIR = signal.firwin2(4097, freqs, gains)
eq = lambda y: signal.fftconvolve(y, FIR, mode="same")

# ---- original room tone generator
rt_src = raw[int(P["roomtone"][0] * sr): int(P["roomtone"][1] * sr)]
rng = np.random.default_rng(5)
def roomtone(n):
    out = np.zeros(n); pos = 0; L = int(0.5 * sr); x = int(0.05 * sr); w = np.sin(np.linspace(0, np.pi / 2, x)) ** 2
    while pos < n:
        st = rng.integers(0, len(rt_src) - L); piece = rt_src[st: st + L].copy()
        if pos: out[pos - x: pos] = out[pos - x: pos] * w[::-1] + piece[:x] * w; piece = piece[x:]
        m = min(len(piece), n - pos); out[pos: pos + m] = piece[:m]; pos += m
    return out

# ---- hook: clip-gain automation, piecewise-linear in dB; every gain change sits in a dip between words
src = raw.copy()
if P.get("gain_curve"):
    pts = np.array(P["gain_curve"], float)
    t = np.arange(len(src)) / sr
    gdb = np.interp(t, pts[:, 0], pts[:, 1], left=0.0, right=0.0)
    src *= 10 ** (gdb / 20)

# ---- build replacements
log, pieces, cursor, shifts = [], [], 0.0, []
for R in P["replace"]:
    o = words_span(AO, R["orig_text"], *R["orig_window"])
    o_first_s, o_last_e = o[0][1], o[-1][2]
    a = quiet_point(DBO, R["orig_prev_end"] + 0.02, o_first_s - 0.02, o_first_s - 0.06)
    b = quiet_point(DBO, o_last_e + 0.03, R["orig_next_start"] - 0.02, o_last_e + 0.10)
    t = words_span(AR, R["take_text"], *R["take_window"])
    ta = quiet_point(DBR, t[0][1] - 0.5, t[0][1] - 0.02, t[0][1] - 0.08)
    tb = quiet_point(DBR, t[-1][2] + 0.03, t[-1][2] + 0.6, t[-1][2] + 0.10)
    seg = ret[int(ta * sr): int(tb * sr)].copy()
    # optional pause lengthening inside the take (in its own silence)
    for after_word, new_len in R.get("lengthen_after", {}).items():
        k = R["take_text"].split().index(after_word)
        we, ws_next = t[k][2], t[k + 1][1]
        cut = quiet_point(DBR, we + 0.02, ws_next - 0.02, (we + ws_next) / 2) - ta
        have = ws_next - we; add = max(0.0, new_len - have)
        if add > 0:
            i = int(cut * sr)
            seg = np.concatenate([seg[:i], np.zeros(int(add * sr)), seg[i:]])   # silence, filled with room tone below
    seg = eq(seg)
    # level match to the original neighbours (active speech level)
    tgt = np.mean([active_level(DBO, *w) for w in R["level_ref"]])
    cur = active_level(dbs(seg), 0, len(seg) / sr)
    gain = tgt - cur; seg *= 10 ** (gain / 20)
    # room tone: frames clearly below speech -> original room tone (20 ms ramps)
    d = dbs(seg); sil = d < (tgt - 32)
    sil = np.convolve(sil.astype(float), np.ones(5) / 5, mode="same") > 0.99          # >= 50 ms of quiet
    mask = np.repeat(sil.astype(float), int(0.01 * sr)); mask = np.pad(mask, (0, len(seg) - len(mask)), constant_values=mask[-1] if len(mask) else 0)
    mask = signal.fftconvolve(mask, np.ones(int(0.02 * sr)) / int(0.02 * sr), mode="same").clip(0, 1)
    seg = seg * (1 - mask) + roomtone(len(seg)) * mask
    pieces.append((cursor, a)); pieces.append(seg); cursor = b
    shifts.append((a, b, len(seg) / sr))
    log.append(dict(name=R["name"], orig_from=round(a, 3), orig_to=round(b, 3), take_from=round(ta, 3), take_to=round(tb, 3),
                    gain_db=round(gain, 1), new_len=round(len(seg) / sr, 3), old_len=round(b - a, 3)))
pieces.append((cursor, len(src) / sr))

fi = np.sin(np.linspace(0, np.pi / 2, X)) ** 2
out = np.zeros(0)
for p in pieces:
    if isinstance(p, tuple):          # original audio; pre-roll X samples (silence) for the crossfade
        i0 = int(p[0] * sr); piece = src[max(0, i0 - (X if len(out) else 0)): int(p[1] * sr)]
    else:                             # retake segment; X samples of room tone in front absorb the crossfade
        piece = np.concatenate([roomtone(X), p]) if len(out) else p
    if len(out) and len(piece) > X:
        out[-X:] = out[-X:] * fi[::-1] + piece[:X] * fi; piece = piece[X:]
    out = np.concatenate([out, piece])

def shift(t):
    """original time -> composite time (for anything outside the replaced spans)"""
    d = 0.0
    for a, b, n in shifts:
        if t >= b: d += n - (b - a)
        elif t > a: raise ValueError(f"{t} lies inside a replaced span")
    return t + d

sf.write(f"{OUT}/composite.wav", out.astype(np.float32), sr, subtype="FLOAT")
cuts = json.load(open(P["cuts"], encoding="utf-8"))
cuts["restarts"] = {k: [round(shift(a), 3), round(shift(b), 3)] for k, (a, b) in cuts["restarts"].items()}
cuts["roomtone"] = [round(shift(P["roomtone"][0]), 3), round(shift(P["roomtone"][1]), 3)]
cuts["_note"] = cuts.get("_note", "") + " Times shifted to composite.wav (retakes spliced)."
json.dump(cuts, open(f"{OUT}/cuts_composite.json", "w"), ensure_ascii=False, indent=1)
json.dump(log, open(f"{OUT}/splices.json", "w"), ensure_ascii=False, indent=1)
print(json.dumps(log, ensure_ascii=False, indent=1)); print("composite", round(len(out) / sr, 2), "s")
