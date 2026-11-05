import json, sys
import numpy as np, soundfile as sf
sys.path.insert(0, "/home/user/Video-/nabd_project/tools/voice/recording")
from timbre_metrics import spectrum, low_end, reverb_tail, room_tone, dynamics, FC

FINAL = sys.argv[1] if len(sys.argv) > 1 else "/opt/nabd/v4/final/voice_Aplus_hpf80xb4.wav"
TIM = sys.argv[2] if len(sys.argv) > 2 else "/home/user/Video-/out/voice_final/ep01_recording_timing.json"
y, sr = sf.read(FINAL); T = json.load(open(TIM))
L = {l["id"]: l for l in T["lines"]}
ref, _ = sf.read("/opt/nabd/ref/voice_Aplus_hpf80xb4.wav"); RW = json.load(open("/opt/nabd/edit/words_out.json"))

def words_of(lid, from_word=None):
    ws = L[lid]["words"]
    if from_word: ws = ws[[w["w"] for w in ws].index(from_word):]
    return ws
def span_metrics(sig, ws):
    a, b = ws[0]["start"] - 0.02, ws[-1]["end"] + 0.05
    seg = sig[int(a * sr): int(b * sr)]
    ends = [(w["end"], n["start"]) for w, n in zip(ws, ws[1:])]
    gaps = [(w["end"], n["start"]) for w, n in zip(ws, ws[1:])]
    rv, n = reverb_tail(sig, sr, ends)
    return dict(spec=spectrum(seg, sr), low=low_end(seg, sr), rev=rv, nrev=n, room=room_tone(sig, sr, gaps), dyn=dynamics(seg, sr))
def ref_words(first, last, near):
    idx = [i for i, w in enumerate(RW) if w["w"] == first]; i = min(idx, key=lambda i: abs(RW[i]["src_start"] - near))
    j = next(k for k in range(i, len(RW)) if RW[k]["w"] == last)
    return [dict(w=w["w"], start=w["start"], end=w["end"]) for w in RW[i: j + 1]]

RET = {  # retake line -> (from_word, original neighbours, same sentence in the original take)
 "البكتيريا تدخل من الجرح": ("s2l3", None, ["s2l2", "s2l4"], ("البكتيريا", "يوقفها", 25.7)),
 "أنقذ ملايين الأرواح": ("s2l7", None, ["s2l6", "s3l1"], ("ومع", "الأرواح", 41.0)),
 "وماتت من عدوى ملهاش علاج": ("s6l7", None, ["s6l6", "s6l4"], ("وماتت", "علاج", 153.3)),
 "جملة لانسيت (من «حسب»)": ("s7l1", "حسب", ["s6l6", "s8l2"], ("حسب", "الملاريا", 157.6)),
 "الولادة القيصرية والعمليات": ("s7l2", None, ["s8l2", "s8l4"], ("ولو", "جدا", 165.9)),
}
res = {}
for name, (lid, fw, nbs, (rf, rl, near)) in RET.items():
    r = span_metrics(y, words_of(lid, fw))
    nb = [span_metrics(y, words_of(n)) for n in nbs]
    same = span_metrics(ref, ref_words(rf, rl, near))
    nbm = dict(spec=np.mean([m["spec"] for m in nb], 0), low=np.mean([m["low"] for m in nb]),
               rev=np.mean([m["rev"] for m in nb if m["rev"] is not None]), room=np.mean([m["room"] for m in nb if m["room"] is not None]),
               dyn=np.mean([m["dyn"] for m in nb]))
    res[name] = dict(lid=lid, fw=fw, retake=r, neighbours=nbm, same_orig=same)
    d_nb = r["spec"] - nbm["spec"]; d_same = r["spec"] - same["spec"]
    bands = [(i, c) for i, c in enumerate(FC)]
    print(f"\n=== {name} ({lid}) ===")
    print("  spectrum vs SAME sentence (orig take):", " ".join(f"{int(c)}:{d_same[i]:+.1f}" for i, c in bands))
    print("  spectrum vs NEIGHBOURS              :", " ".join(f"{int(c)}:{d_nb[i]:+.1f}" for i, c in bands))
    print(f"  low-end 80-250 vs 250-2k : retake {r['low']:+.1f} dB | same orig {same['low']:+.1f} | neighbours {nbm['low']:+.1f}")
    print(f"  reverb tail (30-110 ms)  : retake {r['rev']} (n={r['nrev']}) | same orig {same['rev']} | neighbours {nbm['rev']:.1f}")
    print(f"  room tone in pauses      : retake {r['room']} | same orig {same['room']} | neighbours {nbm['room']:.1f} dBFS")
    print(f"  dynamics (90-30 pct)     : retake {r['dyn']:.1f} | same orig {same['dyn']:.1f} | neighbours {nbm['dyn']:.1f} dB")
json.dump({k: dict(lid=v["lid"], fw=v["fw"], d_same=(v["retake"]["spec"] - v["same_orig"]["spec"]).tolist(),
                   d_nb=(v["retake"]["spec"] - v["neighbours"]["spec"]).tolist(), low=[v["retake"]["low"], v["same_orig"]["low"], v["neighbours"]["low"]],
                   rev=[v["retake"]["rev"], v["same_orig"]["rev"], v["neighbours"]["rev"]], room=[v["retake"]["room"], v["same_orig"]["room"], v["neighbours"]["room"]],
                   dyn=[v["retake"]["dyn"], v["same_orig"]["dyn"], v["neighbours"]["dyn"]]) for k, v in res.items()},
          open(sys.argv[3] if len(sys.argv) > 3 else "/opt/nabd/v4/retake_metrics.json", "w"), ensure_ascii=False, indent=1)
