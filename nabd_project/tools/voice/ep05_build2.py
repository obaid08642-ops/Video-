"""
Episode 05 (sleep) master voice, v2 (after the owner's listening notes).

    python ep05_build2.py WORKDIR OUTDIR [--pitch 0|1] [--speed 1.05]

WORKDIR/clean/c1.wav c2.wav c3.wav = hum-notched + HPF80 + DeepFilterNet (float, 48 kHz, same time base as the raw files).
What changed vs v1: (a) rec2 (the sample the owner liked) is the tonal reference; rec1/rec3 are matched to it at full strength,
plus a gentle "warmer / less mud / more air" tweak; (b) silence is detected with a per-recording adaptive threshold (rec1's pauses
sit at -55 dB, not at digital zero), pauses > 0.6 s inside a take are cut to 0.42 s, gaps between takes are tighter;
(c) explicit DROPS (coughs / throat clears found by energy+voicing analysis) and false starts / repeats removed from the take list;
(d) real room tone instead of synthetic noise; (e) children's-sleep block placed before the closing lines.
Only whole spans of the original recordings are used; nothing is synthesised. Originals are never modified.
"""
import json, os, re, subprocess, sys
import numpy as np, soundfile as sf, scipy.signal as sg

W, OUT = sys.argv[1], sys.argv[2]
PITCH = int(sys.argv[sys.argv.index("--pitch") + 1]) if "--pitch" in sys.argv else 1
SPEED = float(sys.argv[sys.argv.index("--speed") + 1]) if "--speed" in sys.argv else 1.05
REF = os.environ.get("NABD_REF", "/home/user/Video-/nabd_project/video/public/voice/ep01_recording.wav")
os.makedirs(OUT, exist_ok=True)
SR = 48000
GAP = {"S": 0.65, "s": 0.40, "m": 0.48, "w": 0.30}      # scene / sentence / ellipsis / within-sentence silence (s)
ST = {1: 1.0, 2: 1.0, 3: 0.0}                            # semitones with --pitch 1 (subtle); --pitch 0 = no shift at all
TWEAK = {100: 0.0, 130: 1.0, 180: 0.0, 250: -1.5, 400: -0.5, 1000: 0.0, 2500: 0.0, 3200: 1.5, 5000: 1.0, 8000: 1.5, 12000: 1.0}

# non-speech sounds inside the used spans (coughs / throat clears / clicks), raw-timeline seconds
DROPS = {2: [(74.45, 75.55)], 1: [], 3: []}

# (rec, a, b, break_before, note[, opts]) a/b = speech start/end in the raw timeline.
PIECES = [
 # ---- scene 1 (recording 2)
 (2, 0.0, 9.9, "-", "s1: إنت بقالك ساعة… وتحاول من أول وجديد"),
 (2, 17.7, 19.0, "s", "s1: طب مين اللي سرق نومك؟"),
 (2, 24.3, 33.0, "s", "s1: كباية الشاي والقهوة؟ ولا الموبايل؟ ولا دماغك… (retake)"),
 (2, 36.4, 47.8, "s", "s1: المشكلة إن ساعات السبب… وإزاي ترجع نومك لطبيعته"),
 # ---- scene 2
 (2, 57.5, 83.0, "S", "s2: عشان تنام كويس… الأدينوزين… ساعتك البيولوجية (retake 2; throat-clear 74.5 removed)"),
 (2, 87.9, 90.1, "w", "s2: وإمتى يبقى مستعد للصحيان (retake 2)"),
 (2, 93.8, 101.8, "s", "s2: وفي الظلام… الميلاتونين"),
 (2, 113.6, 119.8, "s", "s2: لكن خد بالك… مش زرار إطفاء (retake 2)"),
 (2, 142.2, 158.4, "S", "s2: الكافيين بيقفل… جسمك لسه محتاج ينام (take 2; the lead-in «وهنا بقى تيجي القهوة» dropped: a cough replaces «تيجي»)"),
 # ---- scene 3 (recording 2 -> 3)
 (2, 168.9, 180.2, "S", "s3: أول حاجة الكافين… تاني حاجة الضوء والموبايل"),
 (3, 4.1, 8.1, "s", "s3: الضوء بالليل… ساعتك البيولوجية (retake)"),
 (3, 11.8, 15.5, "s", "s3: والمحتوى اللي بتقلب فيه… بدل ما تهدى (retake)"),
 (3, 19.4, 33.15, "s", "s3: ثالث حاجة التوتر… وتراقب الساعة", dict(mb=0.05, nosnap=True)),
 (3, 36.55, 43.7, "w", "s3: وتقلق إنك مش هتصحى نشيط… وتخلي النوم أصعب (last «وتقلق»; the doubled one removed)"),
 # ---- scene 4
 (3, 45.4, 47.55, "S", "s4: خلينا نفرّق بين 4 حاجات", dict(mb=0.05, nosnap=True)),
 (3, 50.6, 52.6, "s", "s4: أولًا: تأخر الساعة البيولوجية (take 2)", dict(ma=0.12)),
 (3, 59.55, 64.5, "s", "s4: في ناس ساعتهم متأخرة… عن المطلوب (take 2)", dict(ma=0.12)),
 (3, 64.8, 71.1, "s", "s4: المشكلة هنا… مش متوافق مع يومهم"),
 (3, 73.3, 92.45, "s", "s4: ثانيًا الأرق المزمن… 3 شهور أو أكتر", dict(mb=0.05, nosnap=True)),
 (3, 94.45, 96.9, "w", "s4: ممكن تدخل ضمن تشخيص الأرق المزمن (take 2)", dict(ma=0.1)),
 (3, 97.4, 100.2, "s", "s4: ثالثًا انقطاع النفس أثناء النوم"),
 (3, 107.0, 109.1, "s", "s4: ودي حاجة ممكن تحصل وانت مش حاسس بيها (إضافة منك، take 2)", dict(ma=0.12)),
 (3, 109.5, 112.2, "s", "s4: الشخص ممكن يشخر بصوت عالي"),
 (3, 114.8, 118.3, "w", "s4: ويقف نفسه لحظات (take 2)… أو يصحى يلهث"),
 (3, 122.0, 127.7, "w", "s4: من غير ما يكون فاكر كل مرة (take 2)… وده اضطراب محتاج تقييم"),
 (3, 128.6, 142.55, "s", "s4: رابعًا تململ الساقين… قبل ما تقول أنا عندي أرق", dict(mb=0.12, nosnap=True)),
 (3, 149.2, 151.7, "m", "s4: لازم نعرف إيه اللي فعلًا بيمنعك تنام (take 2)", dict(ma=0.12)),
 # ---- scene 5
 (3, 168.4, 181.1, "S", "s5: طيب نعمل إيه؟ أول خطوة… حتى لو ليلة نومك كانت سيئة"),
 (3, 181.4, 184.5, "s", "s5: اتعرّض لضوء النهار"),
 (3, 189.5, 194.3, "s", "s5: راجع توقيت القهوة والشاي (3rd attempt)"),
 (3, 199.2, 208.2, "s", "s5: ومتدخلش السرير بدري… ولو قعدت… (take 2)"),
 (3, 226.6, 233.1, "s", "s5: قوم اعمل حاجة هادية (أو اشرب حاجة دافية - إضافة منك)… إضاءة خافتة"),
 (3, 279.4, 283.8, "s", "s5: لكن لو الأرق بقى مزمن… فيه علاج مهم (take 2)"),
 (3, 292.4, 295.3, "s", "s5: اسمه العلاج السلوكي المعرفي للأرق (إضافة منك)"),
 (3, 303.7, 310.5, "w", "s5: والمعروف باسم CBT-I… Cognitive Behavioral Therapy for Insomnia"),
 (3, 313.4, 319.8, "s", "s5: وده مش مجرد جلسة فضفضة…"),
 (3, 321.3, 329.2, "s", "s5: وبيشمل تنظيم وقت السرير… الأرق"),
 (3, 337.6, 344.83, "s", "s5: والأهم: ده من أقوى العلاجات… ونظافة النوم لوحدها مش كفاية لعلاجه (آخر الملف؛ fade 90ms)", dict(mb=0.0, nosnap=True, fade=0.09)),
 # ---- scene 6 (recording 1)
 (1, 3.5, 6.3, "S", "s6: وهنا نوصل للسؤال اللي ناس كتير بتسأله"),
 (1, 13.0, 28.95, "s", "s6: طب آخد ميلاتونين ولا منوّم؟… مش علاج سحري لكل أنواع الأرق"),
 (1, 30.7, 33.5, "s", "s6: ومش معنى إنك أخدته إنك لازم تنام (retake)"),
 (1, 34.0, 53.8, "s", "s6: النوع التاني: Z-drugs أو Benzodiazepines… GABA"),
 (1, 56.9, 59.55, "s", "s6: لكن استخدامها مش بلا مخاطر (take 1)", dict(mb=0.0, nosnap=True)),
 (1, 70.4, 80.55, "s", "s6: ممكن تسبب نعاس… أعراض الانسحاب", dict(mb=0.15, nosnap=True)),
 (1, 82.8, 96.3, "w", "s6: وفيه تحذير مهم جدًا… أنشطة خطيرة", dict(ma=0.12)),
 (1, 104.2, 106.9, "w", "s6: وفي حالات نادرة إصابات شديدة (retake حسب تعليمك: من غير «وفيات»)"),
 (1, 136.4, 140.75, "S", "s6: وفي فئة تالتة اسمها Orexin Receptor Antagonists", dict(mb=0.0, nosnap=True)),
 (1, 151.6, 158.5, "s", "s6: دي بتقلل إشارات اليقظة في المخ… (take 2)"),
 (1, 171.9, 194.9, "s", "s6: مضادات الحساسية… والخلاصة؟ اختيار الدواء بيعتمد…"),
 # ---- scene 7
 (1, 204.9, 230.9, "S", "s7: لو نومك متلخبط يوم أو يومين… ومتبدأش منوّم من نفسك"),
 (1, 233.4, 241.35, "s", "s7: وممكن نستشير الطبيب أو الصيدلي (إضافة منك) وافتكر: مش كل أرق…", dict(mb=0.1, nosnap=True)),
 # ---- children's sleep and growth (moved before the closing lines, per the owner)
 (1, 344.2, 349.3, "S", "kids: لو عندك طفل فالنقطة دي مهمة جدًا لأن النوم مش رفاهية بالنسبة له (إضافة منك)"),
 (1, 335.3, 340.2, "s", "kids: والنوم مش بيريّح الطفل… جزء أساسي من نموه وتطوره"),
 (1, 369.3, 378.3, "s", "kids: أثناء النوم العميق… هرمون النمو… ساعة سحرية (take 2)"),
 (1, 391.6, 404.0, "s", "kids: الأهم إنه يحصل على نوم كافي… الطفل 6–12… المراهق 8–10"),
 (1, 419.8, 426.1, "s", "kids: ويفضل إنه على حسب بعض الدراسات ينام بدري… ما يتأخرش في النوم (إضافة منك، قرارك)"),
 (1, 437.3, 443.3, "s", "kids: لأن ده بيزود من إفراز هرمون النمو (Growth Hormone) وجودته ونسبته (إضافة منك، قرارك؛ المحاولة الأخيرة)"),
 # ---- closing
 (1, 257.9, 260.9, "S", "closing: وخليك عارف وراء كل حبة حكاية (take B)", dict(ma=0.1, mb=0.25, nosnap=True)),
 (1, 274.1, 281.2, "s", "closing: لو الحلقة فادتك… ابعتها لحد بيقضي الليل بيحارب مع المخدة… اكتب لنا (take 2)", dict(ma=0.12)),
]

def rms_db(x):
    if len(x) == 0: return -120.0
    return 20 * np.log10(np.sqrt(np.mean(x.astype(np.float64) ** 2)) + 1e-9)
def frame_db(y, H=SR // 100):
    n = len(y) // H
    return 20 * np.log10(np.sqrt((y[: n * H].reshape(n, H) ** 2).mean(1)) + 1e-9)

# ---------------------------------------------------------------- 1. pitch + EQ
def profile(y, sr):
    db = frame_db(y); H = sr // 100
    m = np.repeat(db > np.percentile(db, 55), H)[: len(y)]; m = np.pad(m, (0, len(y) - len(m)))
    f, P = sg.welch(y[m], sr, nperseg=16384); return f, P
fc = 2 ** (np.arange(-12, 14) / 3) * 1000; fc = fc[(fc >= 100) & (fc <= 10000)]
def bands(f, P): return np.array([10 * np.log10(P[(f >= c / 2 ** (1 / 6)) & (f < c * 2 ** (1 / 6))].sum() + 1e-20) for c in fc])
def fir_from(d):
    tw = np.interp(np.log(fc), np.log(list(TWEAK.keys())), list(TWEAK.values()))
    g = d + tw
    return sg.firwin2(4095, np.concatenate([[0], [60], fc, [14000, SR / 2]]) / (SR / 2), 10 ** (np.concatenate([[0], [0], g, [g[-1] * 0.5, 0]]) / 20)), g
def smooth(d): return np.convolve(np.pad(d, 1, mode="edge"), [0.25, 0.5, 0.25], mode="valid")

ref, rsr = sf.read(REF, dtype="float32"); ref = ref if ref.ndim == 1 else ref.mean(1)
ref_prof = bands(*profile(ref, rsr))
shifted, eq_log = {}, {}
for i in (1, 2, 3):
    src = f"{W}/clean/c{i}.wav"; st = ST[i] if PITCH else 0.0
    if st > 0.05:
        tmp = f"{W}/clean/p{i}.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", f"rubberband=pitch={2 ** (st / 12):.5f}:formant=preserved:pitchq=quality:transients=smooth", "-c:a", "pcm_f32le", tmp], check=True)
        src = tmp
    y, _ = sf.read(src, dtype="float32"); shifted[i] = y if y.ndim == 1 else y.mean(1)
# reference tone = recording 2 matched 75 % to the Ep01 master (this is the sample the owner liked)
b2 = bands(*profile(shifted[2], SR)); d2 = ref_prof - b2; d2 = d2 - d2[(fc >= 200) & (fc <= 5000)].mean()
d2 = smooth(np.clip(0.75 * d2, -5, 5))
tone_ref = b2 + d2                                           # profile of the liked sound (without the gentle tweak)
proc = {}
for i in (1, 2, 3):
    d = d2 if i == 2 else smooth(np.clip((lambda x: x - x[(fc >= 200) & (fc <= 5000)].mean())(tone_ref - bands(*profile(shifted[i], SR))), -7, 7))
    h, g = fir_from(d)
    proc[i] = sg.fftconvolve(shifted[i], h, mode="same").astype(np.float32)
    eq_log[i] = dict(pitch_semitones=round(float(ST[i] if PITCH else 0), 2), eq_db={int(round(c)): round(float(x), 1) for c, x in zip(fc, g)})
    sf.write(f"{W}/clean/e{i}.wav", proc[i], SR, subtype="FLOAT")

# silence threshold per recording (rec1's pauses sit near -55 dB, the others near digital silence)
SIL = {i: float(np.percentile(frame_db(proc[i]), 80)) - 24 for i in (1, 2, 3)}
for i in (1, 2, 3):                                          # blank the non-speech sounds (short fades, no clicks)
    for a, b in DROPS[i]:
        k0, k1 = int(a * SR), int(b * SR); proc[i][k0:k1] = 0.0

# ---------------------------------------------------------------- 2. assemble
def snap(y, t, lo, hi, thr):
    k = int(t * SR); w = int(0.03 * SR)
    if rms_db(y[k: k + w]) < thr: return t
    best, bt = 1e9, t
    for u in np.arange(max(lo, 0), hi, 0.01):
        v = rms_db(y[int(u * SR): int(u * SR) + w])
        if v < best: best, bt = v, u
    return bt + 0.015
def tighten(seg, thr, maxs=0.55, keep=0.40):
    H = SR // 100; n = len(seg) // H; db = frame_db(seg); sil = db < thr; out = []; pos = 0; k = 0
    while k < n:
        if sil[k]:
            e = k
            while e < n and sil[e]: e += 1
            if (e - k) * 0.01 > maxs and k > 0 and e < n:
                out.append(seg[pos: k * H + int((keep / 2) * SR)]); pos = e * H - int((keep / 2) * SR)
            k = e
        else: k += 1
    out.append(seg[pos:]); return np.concatenate(out)

X = int(0.02 * SR); fade = np.sin(np.linspace(0, np.pi / 2, X)) ** 2
parts, edl, cursor = [], [], 0.0
for n_, pc in enumerate(PIECES):
    rec, a, b, brk, note = pc[:5]; opt = pc[5] if len(pc) > 5 else {}
    ma, mb = opt.get("ma", 0.16), opt.get("mb", 0.32)
    y = proc[rec]; thr = SIL[rec]; a = max(a, ma)
    a2 = snap(y, a - ma, a - 0.30, a + 0.30, thr + 4) if rms_db(y[int((a - ma) * SR): int((a - ma + 0.03) * SR)]) > thr + 4 else a - ma
    b2 = b + mb
    if not opt.get("nosnap") and rms_db(y[int(b2 * SR): int((b2 + 0.03) * SR)]) > thr + 4: b2 = snap(y, b2, b - 0.30, b + 0.45, thr + 4)
    seg = y[int(a2 * SR): min(int(b2 * SR), len(y))].copy()
    seg = tighten(seg, thr)
    db = frame_db(seg); idx = np.where(db > thr)[0]
    if len(idx): seg = seg[max(0, idx[0] * (SR // 100) - int(0.03 * SR)): min(len(seg), (idx[-1] + 1) * (SR // 100) + int(0.05 * SR))]
    if len(seg) < X * 4: print("EMPTY piece", n_, rec, a, b); continue
    seg[:X] *= fade
    fo = max(X, int(opt.get("fade", 0.02) * SR)); seg[-fo:] *= np.sin(np.linspace(0, np.pi / 2, fo))[::-1] ** 2
    if parts:
        g = GAP.get(brk, 0.4); parts.append(np.zeros(int(g * SR), dtype=np.float32)); cursor += g
    edl.append(dict(n=n_, rec=rec, src_a=round(a2, 2), src_b=round(b2, 2), out_at=round(cursor, 2), dur=round(len(seg) / SR, 2), gap_before=GAP.get(brk, 0), note=note))
    parts.append(seg.astype(np.float32)); cursor += len(seg) / SR
v = np.concatenate(parts)

# real room tone: the quietest 2 s of recording 3's own pauses (hum-notched, HPF, NOT denoised), looped with crossfades, ~46 dB under the speech
pre, _ = sf.read(f"{W}/clean/pre3.wav", dtype="float32")
dbp = frame_db(pre); win = 200; best = min(range(0, len(dbp) - win, 25), key=lambda k: np.percentile(dbp[k: k + win], 95))
rt = pre[best * (SR // 100): (best + win) * (SR // 100)].astype(np.float64); rt -= rt.mean()
speech_rms = rms_db(v[np.abs(v) > 10 ** (-45 / 20)]) if np.any(np.abs(v) > 10 ** (-45 / 20)) else -25
rt = rt / (np.sqrt(np.mean(rt ** 2)) + 1e-9) * 10 ** ((speech_rms - 46) / 20)
Xr = int(0.5 * SR); fr = np.sin(np.linspace(0, np.pi / 2, Xr)) ** 2; bed = np.zeros(len(v)); pos = 0
while pos < len(v):
    piece = rt.copy(); m = min(len(piece), len(v) - pos)
    if pos >= Xr: bed[pos - Xr: pos] = bed[pos - Xr: pos] * fr[::-1] + piece[:Xr] * fr; piece = piece[Xr:]; m = min(len(piece), len(v) - pos)
    bed[pos: pos + m] = piece[:m]; pos += m
v = (v + bed).astype(np.float32)
sf.write(f"{OUT}/assembled.wav", v, SR, subtype="FLOAT")
json.dump(dict(pieces=edl, eq=eq_log, pitch=PITCH, speed=SPEED, duration=round(len(v) / SR, 2), sil_thr={k: round(x, 1) for k, x in SIL.items()}), open(f"{OUT}/edl.json", "w"), ensure_ascii=False, indent=1)

# ---------------------------------------------------------------- 3. finish
def run(cmd): return subprocess.run(cmd, capture_output=True, text=True)
pre_f = f"{OUT}/_pre.wav"
e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", f"{OUT}/assembled.wav", "-af", "ebur128", "-f", "null", "-"]).stderr
I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", e)[-1])
chain = f"volume={-20 - I:.2f}dB,deesser=i=0.45,acompressor=threshold=0.063:ratio=2.5:attack=8:release=110:makeup=1.5"
if abs(SPEED - 1) > 1e-3: chain += f",atempo={SPEED}"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{OUT}/assembled.wav", "-af", chain, "-c:a", "pcm_f32le", pre_f], check=True)
ln = run(["ffmpeg", "-hide_banner", "-nostats", "-i", pre_f, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"]).stderr
m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", ln, re.S).group())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", pre_f, "-af",
                f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,alimiter=limit=0.84:level=disabled",
                "-ar", "48000", "-c:a", "pcm_s24le", f"{OUT}/Final_Master_VO.wav"], check=True)
os.remove(pre_f)
e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", f"{OUT}/Final_Master_VO.wav", "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
print(f"assembled {len(v)/SR:.1f}s -> master {sf.info(f'{OUT}/Final_Master_VO.wav').duration:.1f}s;",
      "LUFS", re.findall(r"I:\s+(-?[\d.]+) LUFS", e)[-1], "TP", re.findall(r"Peak:\s+(-?[\d.]+) dBFS", e)[-1], "SIL", {k: round(x, 1) for k, x in SIL.items()})
