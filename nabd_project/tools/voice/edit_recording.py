"""
Edit a voice recording from its verbatim transcript (no denoise / EQ here: pure editing).

    python -I edit_recording.py RAW.wav VERBATIM.txt OUT_DIR

* word timings: wav2vec2 Arabic CTC forced alignment (align.py), refined on the waveform energy
* removes: restarts / stumbles marked [..] in the transcript, non-speech sounds (clicks, knocks,
  background voices) and long silences; cuts land only in silence (quietest 10 ms frame), never
  inside a word; 30 ms equal-power crossfades; gaps filled with real room tone
* pauses: any silence > 0.6 s -> 0.35-0.6 s (longer before scene changes / numbers / "!" lines)
* breaths: kept, lowered by 12 dB
Writes: edited.wav, edl.json (every cut, in source + output time), words_out.json (word timings in
the edited file), events.json (classified non-speech sounds).
"""
import json, sys
import numpy as np, soundfile as sf, librosa

sys.path.insert(0, "/opt/nabd/edit")
from align import align  # noqa: E402

RAW, VERB, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
CUTS = json.load(open(sys.argv[4], encoding="utf-8")) if len(sys.argv) > 4 else {"restarts": {}}
XF = 0.030                       # crossfade (s)
BREATH_DB = -12.0
T_SCENE, T_IMPORTANT, T_LINE, T_WITHIN = 0.60, 0.55, 0.45, 0.35
LONG = 0.60
ROOMTONE = (54.0, 58.0)          # quietest stretch inside the long silence (no events)

y, sr = sf.read(RAW, dtype="float64")
HOP = int(0.01 * sr)
db = 20 * np.log10(np.sqrt((y[: len(y) // HOP * HOP].reshape(-1, HOP) ** 2).mean(1)) + 1e-12)
FLOOR = float(np.percentile(db, 5))
fidx = lambda t: int(max(0, min(len(db) - 1, round(t / 0.01))))

# ------------------------------------------------------------------ transcript + alignment
words, scene, line = [], 0, -1
for raw in open(VERB, encoding="utf-8"):
    raw = raw.strip()
    if not raw or raw.startswith("# "):
        continue
    if raw.startswith("##"):
        scene = int(raw[2:]); continue
    line += 1
    imp = raw.startswith("!")
    rm = False
    for k, tok in enumerate(raw.lstrip("!").split()):
        if tok.startswith("["): rm = True
        words.append(dict(w=tok.strip("[]"), remove=rm, scene=scene, line=line, first=(k == 0), important=imp and k == 0))
        if tok.endswith("]"): rm = False
res, _ = align([w["w"] for w in words])
for w, (_, a, b, c) in zip(words, res):
    w["a"], w["b"], w["conf"] = a, b, c

# refine on energy: extend start back / end forward while clearly above the floor
for i, w in enumerate(words):
    lo = words[i - 1]["b"] if i else 0.0
    hi = words[i + 1]["a"] if i + 1 < len(words) else len(y) / sr
    s = w["a"]
    while s - 0.01 > max(lo, w["a"] - 0.25) and db[fidx(s - 0.01)] > FLOOR + 10: s -= 0.01
    e = w["b"]
    while e + 0.01 < min(hi, w["b"] + 0.35) and db[fidx(e)] > FLOOR + 10: e += 0.01
    w["s"], w["e"] = s, e
# energy-verified restart spans override the alignment estimate
for key, (a, b) in CUTS["restarts"].items():
    toks = key.split()
    for i in range(len(words) - len(toks) + 1):
        if all(words[i + k]["remove"] and words[i + k]["w"] == toks[k] for k in range(len(toks))):
            words[i]["s"] = a; words[i + len(toks) - 1]["e"] = b
            for k in range(1, len(toks) - 1): words[i + k]["s"] = words[i + k]["e"] = (a + b) / 2
            if len(toks) > 1: words[i]["e"] = words[i + len(toks) - 1]["s"] = (a + b) / 2
            if i and words[i - 1]["e"] > a: words[i - 1]["e"] = a - 0.005
            j = i + len(toks)
            if j < len(words) and words[j]["s"] < b: words[j]["s"] = b + 0.005
for i in range(1, len(words)):   # never overlap neighbours
    if words[i]["s"] < words[i - 1]["e"]:
        m = (words[i]["s"] + words[i - 1]["e"]) / 2
        words[i - 1]["e"] = words[i]["s"] = m

# ------------------------------------------------------------------ non-speech events
f0, vf, _ = librosa.pyin(y, fmin=70, fmax=350, sr=sr, frame_length=2048, hop_length=HOP)
cent = librosa.feature.spectral_centroid(y=y, sr=sr, n_fft=1024, hop_length=HOP)[0]
spans = [(w["s"] - 0.04, w["e"] + 0.04) for w in words]
inside = np.zeros(len(db), bool)
for a, b in spans: inside[fidx(a): fidx(b) + 1] = True
act = (db > FLOOR + 9) & ~inside
events, s = [], None
for k, v in enumerate(list(act) + [False]):
    if v and s is None: s = k
    if not v and s is not None:
        d = (k - s) * 0.01
        if d >= 0.02:
            seg = y[s * HOP: k * HOP]
            crest = 20 * np.log10(np.abs(seg).max() / (np.sqrt((seg ** 2).mean()) + 1e-12))
            pk = float(db[s:k].max()); voiced = float(np.mean(vf[s:k])); c = float(np.median(cent[s:k]))
            if pk > -25 and voiced < 0.4: kind = "knock/handling"
            elif d <= 0.08 and crest > 9: kind = "mouth click"
            elif voiced >= 0.5 and pk < -36: kind = "background voice"
            elif d >= 0.08 and voiced < 0.4 and c > 1500: kind = "breath"
            elif d <= 0.08: kind = "mouth click"
            else: kind = "noise"
            t0, t1 = s * 0.01, k * 0.01
            near = min(min(abs(t0 - w["e"]), abs(w["s"] - t1)) for w in words)
            if kind in ("background voice", "mouth click", "noise") and pk < -40 and near < 0.12:
                kind = "word tail (kept)"
            events.append(dict(t=round(t0, 2), end=round(t1, 2), peak=round(pk, 1), kind=kind))
        s = None

# ------------------------------------------------------------------ room tone + cleaned source
rt_src = y[int(ROOMTONE[0] * sr): int(ROOMTONE[1] * sr)]
rng = np.random.default_rng(3)
def roomtone(n):
    out = np.zeros(n); pos = 0; L = int(0.5 * sr); x = int(0.05 * sr)
    w_in = np.sin(np.linspace(0, np.pi / 2, x)) ** 2
    while pos < n:
        st = rng.integers(0, len(rt_src) - L); piece = rt_src[st: st + L].copy()
        if pos: out[pos - x: pos] = out[pos - x: pos] * w_in[::-1] + piece[:x] * w_in; piece = piece[x:];
        m = min(len(piece), n - pos); out[pos: pos + m] = piece[:m]; pos += m
    return out

clean = y.copy()
def fade_replace(a, b, src, ramp=0.01):
    """replace clean[a:b] (seconds) by src with short equal-power ramps"""
    i0, i1 = int(a * sr), int(b * sr); r = int(ramp * sr)
    i0, i1 = max(r, i0), min(len(clean) - r, i1)
    seg = src(i1 - i0 + 2 * r)
    g = np.ones(i1 - i0 + 2 * r); g[:r] = np.sin(np.linspace(0, np.pi / 2, r)) ** 2; g[-r:] = g[:r][::-1]
    clean[i0 - r: i1 + r] = clean[i0 - r: i1 + r] * (1 - g) + seg * g
for e in events:
    if e["kind"] == "breath":
        fade_replace(e["t"], e["end"], lambda n, a=e["t"]: y[int(a * sr) - int(0.01 * sr): int(a * sr) - int(0.01 * sr) + n] * 10 ** (BREATH_DB / 20), ramp=0.02)
    elif e["kind"] != "word tail (kept)":
        fade_replace(e["t"], e["end"], roomtone)

# ------------------------------------------------------------------ edit decision list
def quiet(t, lo, hi):
    a, b = max(lo, t - 0.03), min(hi, t + 0.03)
    if b - a < 0.01: return t
    fr = range(fidx(a), fidx(b) + 1)
    return min(fr, key=lambda k: db[k]) * 0.01

K = [i for i, w in enumerate(words) if not w["remove"]]
chunks, edl, cursor = [], [], 0.0     # chunks: ("src", a, b) | ("rt", seconds)
for n in range(len(K) - 1):
    i, j = K[n], K[n + 1]
    wi, wj = words[i], words[j]
    A, B = wi["e"], wj["s"]
    removed = [words[k] for k in range(i + 1, j)]
    loud = [e for e in events if A <= e["t"] < B and e["kind"] not in ("breath", "word tail (kept)")]
    g = B - A
    if g <= LONG and not removed:
        continue
    if wj["scene"] != wi["scene"]: target = T_SCENE
    elif wj["important"]: target = T_IMPORTANT
    elif wj["line"] != wi["line"]: target = T_LINE
    else: target = T_WITHIN
    if removed and wj["line"] == wi["line"]:
        target = float(np.clip(removed[0]["s"] - A, 0.10, 0.40))
    target = min(target, g) if not removed else target
    forb = [(r["s"] - 0.03, r["e"] + 0.03) for r in removed] + [(e["t"], e["end"]) for e in loud]
    head_max = (min(f[0] for f in forb) if forb else B) - A
    tail_max = B - (max(f[1] for f in forb) if forb else A)
    h = max(min(0.15, head_max, target * 0.4), min(0.06, head_max))
    t = min(max(target - h, 0.06), tail_max)
    br = [e for e in events if e["kind"] == "breath" and A + h < e["t"] and e["end"] <= B and all(not (f[0] < e["end"] and e["t"] < f[1]) for f in forb)]
    if br:   # keep the breath just before the next phrase (lowered), never drop it
        need = B - (br[-1]["t"] - 0.04)
        if need <= min(tail_max, target + 0.35): t = max(t, need)
    h = max(0.0, min(h, target - t)) if t + h > target and not br else h
    cut_a = quiet(A + h, A + 0.02, B) if h > 0 else A
    cut_b = quiet(B - t, cut_a, B - 0.02) if t > 0 else B
    fill = max(0.0, target - (cut_a - A) - (B - cut_b))
    chunks.append(("src", cursor, cut_a))
    # a breath that would fall in the removed middle is kept (already -12 dB) inside the new pause
    mid = None
    if br and br[-1]["t"] - 0.04 < cut_b:
        bs, be = br[-1]["t"] - 0.04, br[-1]["end"] + 0.04
        if bs > cut_a + 0.01 and be < cut_b - 0.01:
            mid = (quiet(bs, cut_a, bs + 0.02), quiet(be, be - 0.02, cut_b))
    if mid:
        fill = max(0.0, fill - (mid[1] - mid[0]))
        if fill / 2 > 0.005: chunks.append(("rt", fill / 2))
        chunks.append(("src", mid[0], mid[1]))
        if fill / 2 > 0.005: chunks.append(("rt", fill / 2))
    elif fill > 0.005:
        chunks.append(("rt", fill))
    cursor = cut_b
    why = []
    if removed: why.append("إعادة/تلعثم: «" + " ".join(r["w"] for r in removed) + "»")
    if loud: why.append("صوت مش كلام: " + ", ".join(f"{e['kind']} @{e['t']:.2f}s" for e in loud))
    if g > LONG: why.append(f"سكوت طويل {g:.2f}ث")
    if mid: why.append(f"(النَفَس اللي في النص اتساب واتوطّى @{br[-1]['t']:.2f}s)")
    edl.append(dict(src_from=round(cut_a, 3), src_to=round(cut_b, 3), removed_s=round(cut_b - cut_a - ((mid[1] - mid[0]) if mid else 0), 3), fill_s=round(fill, 3),
                    kept_breath=None if not mid else [round(mid[0], 3), round(mid[1], 3)],
                    gap_before=round(g, 2), gap_after=round((cut_a - A) + fill + (B - cut_b) + ((mid[1] - mid[0]) if mid else 0), 2), after_word=wi["w"], before_word=wj["w"], why=" + ".join(why)))
chunks.append(("src", cursor, len(y) / sr))

# ------------------------------------------------------------------ render with 30 ms equal-power crossfades
X = int(XF * sr)
fi = np.sin(np.linspace(0, np.pi / 2, X)) ** 2
out = np.zeros(0)
seg_map = []   # (src_a, src_b, out_a)
for c in chunks:
    if c[0] == "src":
        a, b = c[1], c[2]
        i0 = max(0, int(a * sr) - (X if len(out) else 0)); piece = clean[i0: int(b * sr)]
        oa = len(out) / sr
    else:
        piece = roomtone(int(c[1] * sr) + (X if len(out) else 0)); a = b = None
    if len(out) and len(piece) > X:
        out[-X:] = out[-X:] * fi[::-1] + piece[:X] * fi
        piece = piece[X:]
    if c[0] == "src": seg_map.append((a, b, len(out) / sr - (a - i0 / sr) + (X / sr if i0 < int(a * sr) else 0) - (X / sr if i0 < int(a * sr) else 0)))
    out = np.concatenate([out, piece])
# exact source->output mapping: recompute from chunk lengths
pos, seg_map = 0.0, []
for c in chunks:
    if c[0] == "src": seg_map.append((c[1], c[2], pos)); pos += c[2] - c[1]
    else: pos += c[1]
def to_out(t):
    best = None
    for a, b, o in seg_map:
        if a - 1e-3 <= t <= b + 1e-3: return o + (min(max(t, a), b) - a)
        if b <= t: best = o + (b - a)          # t fell inside a removed span: map to the cut point
    return best
for e in edl: e["out_at"] = round(to_out(e["src_from"]), 3)
wo = []
for w in words:
    if w["remove"]: continue
    s, e = to_out(w["s"]), to_out(w["e"])
    wo.append(dict(w=w["w"], scene=w["scene"], line=w["line"], start=round(s, 3), end=round(e, 3), src_start=round(w["s"], 3), src_end=round(w["e"], 3)))
sf.write(f"{OUT}/edited.wav", out.astype(np.float32), sr, subtype="FLOAT")
json.dump(edl, open(f"{OUT}/edl.json", "w"), ensure_ascii=False, indent=1)
json.dump(wo, open(f"{OUT}/words_out.json", "w"), ensure_ascii=False, indent=1)
for e in events:
    o = to_out(e["t"]); e["out_t"] = None if o is None else round(o, 3)
    e["in_output"] = any(sa - 1e-3 <= e["t"] and e["end"] <= sb + 1e-3 for sa, sb, _ in seg_map)
json.dump(events, open(f"{OUT}/events.json", "w"), ensure_ascii=False, indent=1)
print(f"replaced: {sum(e['kind'] not in ('breath','word tail (kept)') for e in events)}, kept tails: {sum(e['kind']=='word tail (kept)' for e in events)}")
print(f"source {len(y)/sr:.2f}s -> edited {len(out)/sr:.2f}s, {len(edl)} gap edits, "
      f"{sum(e['kind']!='breath' for e in events)} sounds replaced, {sum(e['kind']=='breath' for e in events)} breaths lowered")
