"""
Lengthen too-short pauses between sentences by inserting room tone at the quietest point of the join.

    python -I pad_pauses.py IN.wav TIMING.json ROOMTONE.wav RT_FROM RT_TO PLAN.json OUT_DIR

PLAN: {"<line id of the sentence AFTER the pause>": target_seconds, ...}
The acoustic pause = frames below floor+10 dB around the quietest 10 ms frame of the join; room tone is
added only for the missing part (30 ms equal-power crossfades). Refuses joins with no dip <= -40 dBFS.
Writes padded.wav, timing_padded.json, pad_table.json.
"""
import json, sys
import numpy as np, soundfile as sf

IN, TJ, RT, R0, R1, PLAN, OUT = sys.argv[1:8]
y, sr = sf.read(IN, dtype="float64")
T = json.load(open(TJ, encoding="utf-8"))
plan = json.load(open(PLAN, encoding="utf-8"))
rt_all, rsr = sf.read(RT, dtype="float64")
assert rsr == sr
rt_src = rt_all[int(float(R0) * sr): int(float(R1) * sr)]
H = int(0.01 * sr)
db = 20 * np.log10(np.sqrt((y[: len(y) // H * H].reshape(-1, H) ** 2).mean(1)) + 1e-12)
FLOOR = float(np.percentile(db, 5))
rng = np.random.default_rng(5)
X = int(0.03 * sr)
fi = np.sin(np.linspace(0, np.pi / 2, X)) ** 2


def roomtone(n):
    st = rng.integers(0, len(rt_src) - n - 1)
    return rt_src[st: st + n].copy()


ids = [l["id"] for l in T["lines"]]
ins = []  # (time, seconds)
table = []
for lid, target in plan.items():
    k = ids.index(lid)
    a, b = T["lines"][k - 1], T["lines"][k]
    lo, hi = int((a["end"] - 0.10) * 100), int((b["start"] + 0.10) * 100)
    q = min(range(lo, hi + 1), key=lambda i: db[i])
    assert db[q] <= -40, (lid, db[q])
    thr = FLOOR + 10
    s = q
    while s - 1 > lo - 10 and db[s - 1] < thr: s -= 1
    e = q
    while e + 1 < hi + 10 and db[e + 1] < thr: e += 1
    acoustic = (e - s + 1) * 0.01
    add = max(0.0, target - acoustic)
    if add < 0.03: continue
    ins.append((q * 0.01 + 0.005, add))
    table.append(dict(before_line=lid, after_word=a["words"][-1]["w"], before_word=b["words"][0]["w"],
                      at_src=round(q * 0.01, 3), dip_db=round(float(db[q]), 1), pause_before=round(acoustic, 2),
                      added=round(add, 3), pause_after=round(acoustic + add, 2)))
ins.sort()
out, cur = np.zeros(0), 0
for t, add in ins:
    i = int(t * sr)
    piece = y[cur:i].copy()
    if len(out):
        out[-X:] = out[-X:] * fi[::-1] + piece[:X] * fi; piece = piece[X:]
    out = np.concatenate([out, piece])
    rt = roomtone(int(add * sr) + 2 * X)
    out[-X:] = out[-X:] * fi[::-1] + rt[:X] * fi
    out = np.concatenate([out, rt[X:]])
    cur = i - X  # next piece starts X earlier, its first X samples crossfade with the room-tone tail
out_piece = y[cur:].copy()
out[-X:] = out[-X:] * fi[::-1] + out_piece[:X] * fi
out = np.concatenate([out, out_piece[X:]])


def shift(t):
    return t + sum(add for tt, add in ins if tt <= t)


for l in T["lines"]:
    for w in l["words"]:
        w["start"], w["end"] = round(shift(w["start"]), 3), round(shift(w["end"]), 3)
    l["start"], l["end"] = l["words"][0]["start"], l["words"][-1]["end"]
for s_ in T["scenes"]:
    ls = [l for l in T["lines"] if l["scene"] == s_["id"]]
    s_["start"], s_["end"] = ls[0]["start"], ls[-1]["end"]
T["duration"] = round(len(out) / sr, 3)
sf.write(f"{OUT}/padded.wav", out.astype(np.float32), sr, subtype="FLOAT")
json.dump(T, open(f"{OUT}/timing_padded.json", "w"), ensure_ascii=False, indent=1)
json.dump(table, open(f"{OUT}/pad_table.json", "w"), ensure_ascii=False, indent=1)
for r in table: print(r)
print(f"{len(y)/sr:.2f} s -> {len(out)/sr:.2f} s")
