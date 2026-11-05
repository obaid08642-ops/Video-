import sys, json, numpy as np, soundfile as sf, librosa
sys.path.insert(0, "/opt/nabd/retake")
from align_r import align, score

y, sr = sf.read("/opt/nabd/retake/retake.wav")
HOP = int(0.01 * sr)
db = 20 * np.log10(np.sqrt((y[: len(y) // HOP * HOP].reshape(-1, HOP) ** 2).mean(1)) + 1e-12)
W = json.load(open("/opt/nabd/retake/whisper.json"))

TAKES = {
 "S1": [(46.9, 52.2, "البكتيريا تدخل من الجرح توصل للدم ومفيش دوا يوقفها"),
        (54.0, 59.9, "البكتيريا تدخل من الجرح وتوصل للدم ومفيش دوا يوقفها"),
        (63.7, 75.5, "البكتيريا تدخل من الدم البكتيريا تدخل من الجرح وتوصل للدم ومفيش دوا يوقفها")],
 "S2": [(78.2, 82.9, "ومع الأربعينات أنقذ ملايين الأرواح"), (83.8, 88.4, "ومع الأربعينات أنقذ ملايين الأرواح"),
        (89.7, 94.0, "ومع الأربعينات أنقذ ملايين الأرواح")],
 "S3": [(100.6, 104.0, "وماتت من عدوى ملهاش علاج"), (105.4, 108.3, "وماتت من عدوى ملهاش علاج"), (110.0, 112.8, "وماتت من عدوى ملهاش علاج")],
 "S4": [(116.6, 128.0, "حسب دراسة في لانسيت البكتيريا المقاومة قتلت سنة ألفين وتسعتاشر حوالي مليون وربع يعني أكتر من الإيدز وأكتر من الملاريا"),
        (129.7, 140.0, "حسب دراسة في لانسيت البكتيريا المقاومة قتلت سنة ألفين وتسعتاشر حوالي مليون وربع يعني أكتر من الإيدز وأكتر من الملاريا"),
        (141.9, 154.3, "حسب دراسة عملت في لانسيت البكتيريا المقاومة قتلت سنة ألفين وتسعتاشر حوالي مليون وربع يعني أكتر من الإيدز وأكتر من الملاريا")],
 "S5": [(156.7, 165.6, "ولو المضادات بطلت تشتغل الولادة القيصرية والعمليات والكيماوي كلها تبقى في خطر كبير"),
        (166.0, 182.8, "ولو المضادات بطلت تشتغل الولادة القيصرية والعمليات والكيماوي كلها تبقى في خطر كبير"),
        (184.0, 192.4, "ولو المضادات بطلت تشتغل الولادة القيصرية والعمليات والكيماوي كلها هتبقى في خطر كبير")],
}
TESTS = {"S2": [("الأربعينات", "الأربعينيات")], "S3": [("علاج", "عليك")], "S4": [("وتسعتاشر", "وستاشر")],
         "S5": [("والعمليات", "والعبليات")]}

out = {}
for s, takes in TAKES.items():
    for k, (a, b, txt) in enumerate(takes, 1):
        ws = txt.split()
        res, tot = align(ws, int(a / 0.02002), int(b / 0.02002))
        st, en = res[0][1], res[-1][2]
        conf = np.mean([c for *_, c in res if c is not None])
        seg = db[int(st * 100): int(en * 100)]
        act = seg[seg > -40]
        lvl = 10 * np.log10(np.mean(10 ** (act / 10)))
        pauses = (seg < -45).sum() * 0.01
        rate = len(ws) / max(0.1, (en - st - pauses)) * 60
        f0, vf, _ = librosa.pyin(y[int(st * sr): int(en * sr)], fmin=70, fmax=300, sr=sr, frame_length=2048, hop_length=HOP)
        f0m = float(np.nanmedian(f0[vf])) if vf.any() else None
        tests = []
        for good, bad in TESTS.get(s, []):
            i = ws.index(good)
            wa, wb = res[max(0, i - 1)][1] - 0.1, res[min(len(ws) - 1, i + 1)][2] + 0.1
            ctx = ws[max(0, i - 1): i + 2]
            alt = [bad if w == good else w for w in ctx]
            tests.append((good, round(score(ctx, wa, wb) - score(alt, wa, wb), 1)))
        wp = [w for seg_ in W for w in seg_["words"] if st - 0.2 <= w["start"] <= en + 0.2]
        low = [(w["w"], w["p"]) for w in wp if w["p"] < 0.5]
        out[f"{s}#{k}"] = dict(start=round(st, 2), end=round(en, 2), conf=round(float(conf), 2), level_db=round(float(lvl), 1),
                              rate_wpm=round(rate), f0=None if f0m is None else round(f0m, 1), pauses_s=round(pauses, 2), key_tests=tests, whisper_low=low)
        print(f"{s}#{k}: {out[f'{s}#{k}']}")
json.dump(out, open("/opt/nabd/retake/takes_analysis.json", "w"), ensure_ascii=False, indent=1)
