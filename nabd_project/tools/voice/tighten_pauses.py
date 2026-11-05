"""
Tighten pauses on an edited voice (only shortens; cuts in silence, 30 ms equal-power crossfades).

    python -I tighten_pauses.py EDITED.wav TIMING.json OUT_DIR

Rules: inside a sentence <= 0.35-0.4 s (target 0.35); between sentences 0.45-0.55 s (target 0.50);
up to 0.8 s only before numbers, before «وماتت» and before the last sentence. A breath right before the
next word is kept (pause may then reach target + 0.15 s).
"""
import json, sys
import numpy as np, soundfile as sf

ED, TJ, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
y, sr = sf.read(ED, dtype="float64")
T = json.load(open(TJ, encoding="utf-8"))
H = int(0.01 * sr)
db = 20 * np.log10(np.sqrt((y[: len(y) // H * H].reshape(-1, H) ** 2).mean(1)) + 1e-12)
FLOOR = float(np.percentile(db, 5))
NUM_START = {"مية", "ألف", "ألفين", "التسعمية", "واحد", "اتنين", "تلاتة"}
ws = [(l["id"], i, w) for l in T["lines"] for i, w in enumerate(l["words"])]
last_line = T["lines"][-2]["id"]       # "المضاد الحيوي مش قوة خارقة…" is the closing sentence before the outro question

def is_number_next(lid, i, words_line):
    w = words_line[i]["w"]
    nxt = words_line[i + 1]["w"] if i + 1 < len(words_line) else ""
    return w in NUM_START or (w == "سنة" and nxt in NUM_START) or (w in ("ست", "ستة") and nxt == "وعشرين") \
        or (w == "لكن" and nxt == "سنة")

lines = {l["id"]: l["words"] for l in T["lines"]}
plan = []
for (la, ia, a), (lb, ib, b) in zip(ws, ws[1:]):
    g = b["start"] - a["end"]
    same = la == lb
    special = is_number_next(lb, ib, lines[lb]) or b["w"] == "وماتت" or (lb == last_line and ib == 0)
    if special: lim, target = 0.80, 0.70
    elif same: lim, target = 0.40, 0.35
    else: lim, target = 0.55, 0.50
    if g <= lim + 1e-3: continue
    if g - target < 0.06: continue                    # barely over: not worth a cut
    A, B = a["end"], b["start"]
    # a breath just before the next word (only the last 0.45 s are searched)
    k0, k1 = int(max(A + 0.06, B - 0.45) * 100), int((B - 0.04) * 100)
    content = [k for k in range(k0, k1) if db[k] > FLOOR + 10]
    h, t = min(0.12, target / 2), target - min(0.12, target / 2)
    if content:
        tb = B - content[0] / 100 + 0.03               # tail that keeps the whole breath
        hb = max(0.05, target - tb)
        if hb + tb <= lim + 0.05: h, t = hb, tb       # keep it, shrinking the silence before it
    def quiet(x, lo, hi):
        ks = range(int(max(lo, x - 0.03) * 100), int(min(hi, x + 0.03) * 100) + 1)
        return min(ks, key=lambda k: db[k]) / 100 if ks else x
    ca = quiet(A + h, A + 0.04, B - t - 0.02)
    cb = quiet(B - t, ca + 0.02, B - 0.03)
    if cb - ca < 0.03: continue
    plan.append(dict(after=a["w"], before=b["w"], line=lb, kind="special" if special else ("within" if same else "between"),
                     gap_before=round(g, 2), cut_from=round(ca, 3), cut_to=round(cb, 3),
                     gap_after=round(g - (cb - ca), 2)))

# render
X = int(0.03 * sr); fi = np.sin(np.linspace(0, np.pi / 2, X)) ** 2
out = np.zeros(0); cur = 0.0; seg_map = []
for p in plan + [dict(cut_from=len(y) / sr, cut_to=None)]:
    i0 = int(cur * sr); i0p = max(0, i0 - (X if len(out) else 0))
    piece = y[i0p: int(p["cut_from"] * sr)]
    seg_map.append((cur, p["cut_from"], len(out) / sr + (i0 - i0p) / sr - (X / sr if len(out) else 0)))
    if len(out) and len(piece) > X:
        out[-X:] = out[-X:] * fi[::-1] + piece[:X] * fi; piece = piece[X:]
    out = np.concatenate([out, piece])
    cur = p["cut_to"] if p["cut_to"] is not None else cur
# exact mapping from lengths
pos, seg_map2, cur = 0.0, [], 0.0
for p in plan + [dict(cut_from=len(y) / sr, cut_to=None)]:
    seg_map2.append((cur, p["cut_from"], pos)); pos += p["cut_from"] - cur
    cur = p["cut_to"] if p["cut_to"] is not None else cur
def to_out(t):
    for a, b, o in seg_map2:
        if a - 1e-3 <= t <= b + 1e-3: return o + (min(max(t, a), b) - a)
    raise ValueError(t)
for l in T["lines"]:
    for w in l["words"]: w["start"], w["end"] = round(to_out(w["start"]), 3), round(to_out(w["end"]), 3)
    l["start"], l["end"] = l["words"][0]["start"], l["words"][-1]["end"]
for s in T["scenes"]:
    ls = [l for l in T["lines"] if l["scene"] == s["id"]]; s["start"], s["end"] = ls[0]["start"], ls[-1]["end"]
T["duration"] = round(len(out) / sr, 3)
sf.write(f"{OUT}/tightened.wav", out.astype(np.float32), sr, subtype="FLOAT")
json.dump(T, open(f"{OUT}/timing_tightened.json", "w"), ensure_ascii=False, indent=1)
json.dump(plan, open(f"{OUT}/pause_cuts.json", "w"), ensure_ascii=False, indent=1)
print(f"{len(plan)} pauses shortened, {sum(p['gap_before'] - p['gap_after'] for p in plan):.2f} s removed: "
      f"{len(y)/sr:.2f} s -> {len(out)/sr:.2f} s")
