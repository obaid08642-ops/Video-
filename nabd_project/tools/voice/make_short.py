"""
Build a Short (or any cut-down) from the finished long voice by picking whole lines (no word is ever cut).

    python -I make_short.py VOICE.wav TIMING.json SPEC.json OUT_DIR

SPEC: {"scenes": [["s1l6@الرئيس", "s1l7"], ["s2l1-s2l13"], ...],   # new scene = list of line ids / id ranges (long ids);
                                                                  # "id@word": start that line at its first «word» (needs a pause there)
       "gap": 0.36,          # silence between non-adjacent lines (real silence after the last word ends)
       "scene_gap": 0.55,    # same, at a new scene
       "loudness": -14}      # final integrated loudness (true peak kept <= -1 dBTP)
Lines that were adjacent in the long voice keep their original pause; a join between non-adjacent lines is
cut at the energy end of the last word / start of the next word, filled with room tone taken from the long
voice's own pauses, with 30 ms equal-power crossfades. Writes voice.wav, timing.json (new ids sNlM, each
line carries "src": the long id) and parts.json (where every piece came from).
"""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf

VOICE, TJ, SPEC, OUT = sys.argv[1:5]
os.makedirs(OUT, exist_ok=True)
y, sr = sf.read(VOICE, dtype="float64")
T = json.load(open(TJ, encoding="utf-8"))
spec = json.load(open(SPEC, encoding="utf-8"))
GAP, SGAP = spec.get("gap", 0.36), spec.get("scene_gap", 0.55)
L = T["lines"]; idx = {l["id"]: i for i, l in enumerate(L)}
H = int(0.01 * sr)
db = 20 * np.log10(np.sqrt((y[: len(y) // H * H].reshape(-1, H) ** 2).mean(1)) + 1e-12)
FLOOR = float(np.percentile(db, 5))

START = {}   # line index -> first kept word index ("id@word")
def expand(item):
    if "@" in item:
        lid, wd = item.split("@"); i = idx[lid]
        START[i] = next(k for k, w in enumerate(L[i]["words"]) if w["w"] == wd); return [i]
    if "-" in item:
        a, b = item.split("-"); return list(range(idx[a], idx[b] + 1))
    return [idx[item]]

def energy_end(t, lim):    # word ends in the timing are CTC estimates: follow the energy (<= lim)
    k = int(t * 100)
    while k < len(db) and db[k] > FLOOR + 12 and k / 100 < lim: k += 1
    return k / 100

def energy_start(t, lim):
    k = int(t * 100)
    while k > 0 and db[k - 1] > FLOOR + 12 and k / 100 > lim: k -= 1
    return k / 100

# room tone: the quietest 1.5 s stretch of the long voice's pauses
gaps = [(a["end"], b["start"]) for a, b in zip(L, L[1:]) if b["start"] - a["end"] > 0.5]
best = min(gaps, key=lambda g: db[int(g[0] * 100) + 5: int(g[1] * 100) - 5].max())
RT = y[int((best[0] + 0.08) * sr): int((best[1] - 0.08) * sr)]
rng = np.random.default_rng(7)
def roomtone(n):
    out = np.zeros(n); pos = 0; X = int(0.03 * sr)
    while pos < n:
        piece = RT.copy(); m = min(len(piece), n - pos)
        if pos >= X:
            g = np.sin(np.linspace(0, np.pi / 2, X)) ** 2
            out[pos - X: pos] = out[pos - X: pos] * g[::-1] + piece[:X] * g; piece = piece[X:]; m = min(len(piece), n - pos)
        out[pos: pos + m] = piece[:m]; pos += m
    return out

# runs of adjacent long lines
# a scene entry is a list of ids (lines keep their LONG ids and scene numbers, so the long video's scene
# components work unchanged) or {"id": 11, "lines": [...]} (lines renamed s11l1.. = a Short-only scene; needed for
# repeated lines and for lines whose long scene is only partly used)
seq = []   # (group_no, line_index, renamed_scene_or_None)
for k, sc in enumerate(spec["scenes"], 1):
    items, ren = (sc["lines"], sc["id"]) if isinstance(sc, dict) else (sc, None)
    for it in items:
        for i in expand(it): seq.append((k, i, ren))
runs = []
for sc, i, ren in seq:
    if runs and runs[-1]["lines"][-1] + 1 == i and runs[-1]["group"] == sc: runs[-1]["lines"].append(i); runs[-1]["ren"].append(ren)
    elif runs and runs[-1]["lines"][-1] + 1 == i and not ren and runs[-1]["ren"][-1] is None: runs[-1]["lines"].append(i); runs[-1]["ren"].append(ren)
    else: runs.append(dict(group=sc, lines=[i], ren=[ren]))

X = int(0.03 * sr); fade = np.sin(np.linspace(0, np.pi / 2, X)) ** 2
pieces, parts, out_t = [], [], 0.0
new_lines = []
for r, run in enumerate(runs):
    first, last = L[run["lines"][0]], L[run["lines"][-1]]
    k0 = START.get(run["lines"][0], 0)
    if k0:
        first = json.loads(json.dumps(first)); prev_end = first["words"][k0 - 1]["end"]; first["words"] = first["words"][k0:]
    else:
        prev_end = L[run["lines"][0] - 1]["end"] if run["lines"][0] > 0 else 0.0
    nxt_start = L[run["lines"][-1] + 1]["start"] if run["lines"][-1] + 1 < len(L) else len(y) / sr
    a = energy_start(first["words"][0]["start"], prev_end) - 0.03
    assert a - 0.03 >= prev_end - 0.02 or not k0, f"no pause before «{first['words'][0]['w']}»"
    b = energy_end(last["words"][-1]["end"], nxt_start) + 0.03
    seg = y[int(a * sr): int(b * sr)].copy()
    seg[:X] *= fade; seg[-X:] *= fade[::-1]
    if r:
        g = SGAP if (run["ren"][0] or L[run["lines"][0]]["scene"]) != (runs[r - 1]["ren"][-1] or L[runs[r - 1]["lines"][-1]]["scene"]) else GAP
        n = int((g - 0.06) * sr); rt = roomtone(n + 2 * X)
        # overlap-add room tone under the fades of both neighbours
        pieces[-1][-X:] += rt[:X] * fade
        pieces.append(rt[X: X + n]); out_t += n / sr
        seg[:X] += rt[-X:] * fade[::-1]
    else:
        lead = roomtone(int(0.08 * sr)); lead[-X:] *= 0; pieces.append(lead); out_t += 0.08
        seg[:X] += 0
    off = out_t - a
    for i, ren in zip(run["lines"], run["ren"]):
        l = json.loads(json.dumps(L[i]))
        if START.get(i):
            l["words"] = l["words"][START[i]:]; w0 = l["words"][0]["w"]
            l["raw"] = l["raw"][l["raw"].find(w0):] if w0 in l["raw"] else l["raw"]
        for w in l["words"]: w["start"] = round(w["start"] + off, 3); w["end"] = round(w["end"] + off, 3)
        l["start"] = l["words"][0]["start"]; l["end"] = l["words"][-1]["end"]; l["src"] = l["id"]; l["ren"] = ren; l["scene"] = ren or l["scene"]
        new_lines.append(l)
    parts.append(dict(src_from=round(a, 3), src_to=round(b, 3), out_at=round(out_t, 3), lines=[L[i]["id"] for i in run["lines"]]))
    pieces.append(seg); out_t += len(seg) / sr
tail = roomtone(int(0.10 * sr)); tail[:X] *= fade; pieces.append(tail)
v = np.concatenate(pieces)

# ids + scenes
cnt = {}
for l in new_lines:
    if l.pop("ren"): cnt[l["scene"]] = cnt.get(l["scene"], 0) + 1; l["id"] = f"s{l['scene']}l{cnt[l['scene']]}"
scenes = []
for s in dict.fromkeys(l["scene"] for l in new_lines):      # order of appearance
    ls = [l for l in new_lines if l["scene"] == s]
    scenes.append(dict(id=s, start=ls[0]["start"], end=ls[-1]["end"]))
tmp = f"{OUT}/_raw.wav"; sf.write(tmp, v.astype(np.float32), sr, subtype="FLOAT")

# loudness: linear gain to target, then verify true peak (the long voice is already limited at -1.5 dBTP)
def meas(p):
    e = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", p, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", e)[-1]); tp = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", e)[-1])
    return I, tp
I, tp = meas(tmp); g = spec.get("loudness", -14) - I
if tp + g > -1.0: g = -1.0 - tp
v2 = v * 10 ** (g / 20); sf.write(f"{OUT}/voice.wav", v2.astype(np.float32), sr, subtype="FLOAT"); os.remove(tmp)
I2, tp2 = meas(f"{OUT}/voice.wav")
dur = len(v2) / sr
TT = dict(T); TT.update(duration=round(dur, 3), lines=new_lines, scenes=scenes)
json.dump(TT, open(f"{OUT}/timing.json", "w"), ensure_ascii=False, indent=1)
json.dump(parts, open(f"{OUT}/parts.json", "w"), ensure_ascii=False, indent=1)
print(f"{len(new_lines)} lines from {len(runs)} pieces -> {dur:.2f} s (+1.5 logo = {dur + 1.5:.2f}); {I2:.1f} LUFS, TP {tp2:.1f} dBTP")
