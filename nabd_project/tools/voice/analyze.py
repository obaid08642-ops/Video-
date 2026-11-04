"""Measure each round-1 wav: total duration, voiced span, mean/median F0, words per minute."""
import glob, json, os, sys
import numpy as np, soundfile as sf, librosa

D = sys.argv[1]
WORDS = 11  # طب عمرك سألت نفسك ليه الدكتور ساعات بيرفض يكتبهولك وإنت تعبان
rows = []
for p in sorted(glob.glob(os.path.join(D, "*.wav"))):
    y, sr = sf.read(p, dtype="float32")
    if y.ndim > 1: y = y.mean(1)
    dur = len(y) / sr
    iv = librosa.effects.split(y, top_db=35)          # non-silent intervals
    span = (iv[-1][1] - iv[0][0]) / sr                # first sound -> last sound
    gaps = [(iv[i+1][0]-iv[i][1])/sr for i in range(len(iv)-1)]
    f0, vf, _ = librosa.pyin(y, fmin=60, fmax=300, sr=sr, frame_length=2048)
    f0 = f0[vf & ~np.isnan(f0)]
    # last 0.6 s of voiced pitch vs utterance median: >0 => question rises at the end
    hop = 512; last = f0[-int(0.6*sr/hop):] if len(f0) else f0
    rows.append(dict(name=os.path.basename(p)[:-4], duration=round(dur, 2), span=round(span, 2),
                     wpm=round(WORDS / span * 60), f0_mean=round(float(np.mean(f0)), 1),
                     f0_median=round(float(np.median(f0)), 1),
                     f0_range_st=round(float(12*np.log2(np.percentile(f0,95)/np.percentile(f0,5))), 1),
                     end_rise_st=round(float(12*np.log2(np.median(last)/np.median(f0))), 1),
                     pauses_over_150ms=[round(g, 2) for g in gaps if g > 0.15],
                     peak_db=round(float(20*np.log10(np.abs(y).max()+1e-9)), 1)))
for r in rows: print(json.dumps(r, ensure_ascii=False))
json.dump(rows, open(os.path.join(D, "_analysis.json"), "w"), ensure_ascii=False, indent=1)
