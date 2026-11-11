"""
Episode 05 (sleep) master voice, v2 (after the owner's listening notes).

    python ep05_build3.py WORKDIR OUTDIR [--speed 1.05] [--speedmode wsola|tape]

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
PITCH = 0            # no pitch shifting at all (the owner heard wobble / stereo-like artefacts in the shifted version)
SPEEDMODE = sys.argv[sys.argv.index("--speedmode") + 1] if "--speedmode" in sys.argv else "wsola"   # wsola = pitch kept, tape = resample (pitch +0.85 st, no artefacts)
SPEED = float(sys.argv[sys.argv.index("--speed") + 1]) if "--speed" in sys.argv else 1.05
REF = os.environ.get("NABD_REF", "/home/user/Video-/nabd_project/video/public/voice/ep01_recording.wav")
os.makedirs(OUT, exist_ok=True)
SR = 48000
GAP = {"S": 0.55, "s": 0.40, "m": 0.48, "w": 0.30}      # scene / sentence / ellipsis / within-sentence silence (s)
ST = {1: 0.0, 2: 0.0, 3: 0.0}                            # semitones with --pitch 1 (subtle); --pitch 0 = no shift at all
TWEAK = {100: 0.0, 130: 0.8, 180: 0.0, 250: -2.0, 400: -1.0, 1000: 0.0, 2500: 0.0, 3200: 0.8, 5000: 0.5, 8000: 0.8, 12000: 0.5}   # calmer / lighter: less thick, no harsh presence boost

# non-speech sounds / false starts to drop (raw-timeline seconds; any speech run that overlaps is removed)
DROPS = {
 1: [(82.6, 83.04), (156.0, 156.8), (172.0, 174.6)],   # «وفيه» stutter, first «بالطريقة», first take of «أما مضادات الحساسية»
 2: [(73.3, 74.3), (74.45, 75.6), (97.6, 99.6), (142.4, 144.6)],   # cut-off «النظام», throat-clear, first «هرمون بيساعد جس-», first «الكافيين بيقفل المستقبل-»
 3: [(45.2, 45.7), (35.6, 37.5)],                       # cough before «خلينا», doubled «وتقلق»
}
# (rec, a, b, break_before, note[, opts]): a..b select the speech RUNS (energy-separated phrases) whose centre lies inside;
# a run that straddles a boundary is trimmed at the quietest point nearby.
PIECES = [
 (2, 0.0, 9.9, "-", "s1: إنت بقالك ساعة… وتحاول من أول وجديد"),
 (2, 17.5, 19.3, "s", "s1: طب مين اللي سرق نومك؟"),
 (2, 24.3, 33.4, "s", "s1: كباية الشاي والقهوة؟ ولا الموبايل؟ ولا دماغك… (retake)"),
 (2, 36.2, 48.2, "s", "s1: المشكلة إن ساعات السبب… وإزاي ترجع نومك لطبيعته"),
 (2, 57.2, 73.3, "S", "s2: عشان تنام كويس… sleep pressure… adenosine (retake 2)"),
 (2, 77.2, 83.2, "s", "s2: النظام التاني بقى هو ساعتك البيولوجية… (the cut-off «النظام» and the throat-clear removed)"),
 (2, 87.8, 90.3, "w", "s2: وإمتى يبقى مستعد للصحيان (retake 2)"),
 (2, 93.75, 102.0, "s", "s2: وفي الظلام… الميلاتونين (the sigh before it removed)"),
 (2, 113.3, 120.0, "s", "s2: لكن خد بالك… مش زرار إطفاء (retake 2)"),
 (2, 122.9, 125.5, "S", "s2: وهنا بقى تيجي القهوة (take 1; restored)"),
 (2, 141.9, 158.6, "s", "s2: الكافيين بيقفل… جسمك لسه محتاج ينام (take 2)"),
 (2, 168.7, 180.5, "S", "s3: أول حاجة الكافين… تاني حاجة الضوء والموبايل"),
 (3, 3.9, 8.3, "s", "s3: الضوء بالليل… ساعتك البيولوجية (retake)"),
 (3, 11.6, 15.7, "s", "s3: والمحتوى اللي بتقلب فيه… بدل ما تهدى (retake)"),
 (3, 19.2, 33.8, "s", "s3: ثالث حاجة التوتر… وتراقب الساعة وتقلق"),
 (3, 38.3, 43.9, "w", "s3: إنك مش هتصحى نشيط… وتخلي النوم أصعب"),
 (3, 45.7, 47.6, "S", "s4: خلينا نفرّق بين 4 حاجات (cough before it removed)"),
 (3, 50.5, 52.8, "s", "s4: أولًا: تأخر الساعة البيولوجية (take 2)"),
 (3, 59.4, 64.6, "s", "s4: في ناس ساعتهم متأخرة… عن المطلوب (take 2)"),
 (3, 64.7, 71.3, "s", "s4: المشكلة هنا… مش متوافق مع يومهم"),
 (3, 73.1, 92.6, "s", "s4: ثانيًا الأرق المزمن… 3 شهور أو أكتر"),
 (3, 94.3, 97.1, "w", "s4: ممكن تدخل ضمن تشخيص الأرق المزمن (take 2)"),
 (3, 97.3, 100.4, "s", "s4: ثالثًا انقطاع النفس أثناء النوم"),
 (3, 106.9, 109.3, "s", "s4: ودي حاجة ممكن تحصل وانت مش حاسس بيها (إضافة منك، take 2)"),
 (3, 109.4, 112.5, "s", "s4: الشخص ممكن يشخر بصوت عالي"),
 (3, 114.7, 118.5, "w", "s4: ويقف نفسه لحظات (take 2)… أو يصحى يلهث"),
 (3, 121.9, 127.9, "w", "s4: من غير ما يكون فاكر كل مرة (take 2)… وده اضطراب محتاج تقييم"),
 (3, 128.5, 142.8, "s", "s4: رابعًا تململ الساقين… قبل ما تقول أنا عندي أرق"),
 (3, 149.1, 151.9, "m", "s4: لازم نعرف إيه اللي فعلًا بيمنعك تنام (take 2)"),
 (3, 152.9, 163.0, "s", "s4: وفي حاجة كمان… قلة النوم بسبب ألم أو مشكلة… محتاج مسكن (إضافة منك؛ اترجعت)"),
 (3, 168.3, 169.95, "S", "s5: طيب نعمل إيه؟"),
 (3, 174.3, 177.3, "s", "s5: أول خطوة: ثبّت ميعاد الصحيان قدر الإمكان (take 2)"),
 (3, 179.2, 181.3, "w", "s5: حتى لو ليلة نومك كانت سيئة (take 2)"),
 (3, 181.3, 184.7, "s", "s5: اتعرّض لضوء النهار"),
 (3, 189.4, 194.5, "s", "s5: راجع توقيت القهوة والشاي (3rd attempt)"),
 (3, 199.1, 208.4, "s", "s5: ومتدخلش السرير بدري… ولو قعدت… (take 2)"),
 (3, 226.5, 233.3, "s", "s5: قوم اعمل حاجة هادية (أو اشرب حاجة دافية - إضافة منك)… إضاءة خافتة"),
 (3, 279.3, 284.0, "s", "s5: لكن لو الأرق بقى مزمن… فيه علاج مهم (take 2)"),
 (3, 292.3, 295.5, "s", "s5: اسمه العلاج السلوكي المعرفي للأرق (إضافة منك)"),
 (3, 303.6, 310.7, "w", "s5: والمعروف باسم CBT-I… Cognitive Behavioral Therapy for Insomnia"),
 (3, 313.3, 320.0, "s", "s5: وده مش مجرد جلسة فضفضة…"),
 (3, 321.2, 329.4, "s", "s5: وبيشمل تنظيم وقت السرير… الأرق"),
 (3, 337.5, 345.0, "s", "s5: والأهم: ده من أقوى العلاجات… ونظافة النوم لوحدها مش كفاية لعلاجه (آخر الملف؛ fade 90ms)", dict(fade=0.09)),
 (1, 3.3, 6.25, "S", "s6: وهنا نوصل للسؤال اللي ناس كتير بتسأله"),
 (1, 12.9, 28.95, "s", "s6: طب آخد ميلاتونين ولا منوّم؟… مش علاج سحري لكل أنواع الأرق"),
 (1, 30.6, 33.6, "s", "s6: ومش معنى إنك أخدته إنك لازم تنام (retake)"),
 (1, 33.9, 53.9, "s", "s6: النوع التاني: Z-drugs أو Benzodiazepines… GABA"),
 (1, 63.7, 69.5, "s", "s6: لكن استخدامها مش بلا مخاطر. ولا براحتنا؟ أكيد في مشاكل وبتحتاج وصفات طبية (إضافة منك؛ اترجعت، take 2)"),
 (1, 70.3, 80.7, "s", "s6: ممكن تسبب نعاس… أعراض الانسحاب"),
 (1, 83.0, 96.4, "w", "s6: وفيه تحذير مهم جدًا… أنشطة خطيرة (the stuttered first «وفيه» removed)"),
 (1, 104.1, 107.0, "w", "s6: وفي حالات نادرة إصابات شديدة (retake حسب تعليمك: من غير «وفيات»)"),
 (1, 137.3, 140.8, "S", "s6: وفي فئة تالتة اسمها Orexin Receptor Antagonists"),
 (1, 152.0, 158.7, "s", "s6: دي بتقلل إشارات اليقظة في المخ… (take 2; the doubled «بالطريقة» removed)"),
 (1, 174.7, 195.0, "s", "s6: أما مضادات الحساسية… والخلاصة؟ اختيار الدواء بيعتمد… (take 2; the repeated opening removed)"),
 (1, 195.0, 202.4, "s", "s6: فأنصحك تستشير الطبيب وتقوم بالروتين اليومي بتاعك (إضافة منك؛ اترجعت)"),
 (1, 204.8, 231.0, "S", "s7: لو نومك متلخبط يوم أو يومين… ومتبدأش منوّم من نفسك"),
 (1, 233.3, 241.5, "s", "s7: وممكن نستشير الطبيب أو الصيدلي (إضافة منك) وافتكر: مش كل أرق…"),
 (1, 344.1, 349.5, "S", "kids: لو عندك طفل فالنقطة دي مهمة جدًا لأن النوم مش رفاهية بالنسبة له (إضافة منك)"),
 (1, 335.2, 340.4, "s", "kids: والنوم مش بيريّح الطفل… جزء أساسي من نموه وتطوره"),
 (1, 369.2, 378.5, "s", "kids: أثناء النوم العميق… هرمون النمو… ساعة سحرية (take 2)"),
 (1, 391.5, 404.2, "s", "kids: الأهم إنه يحصل على نوم كافي… الطفل 6–12… المراهق 8–10"),
 (1, 419.8, 426.2, "s", "kids: ويفضل إنه على حسب بعض الدراسات ينام بدري… (إضافة منك، قرارك)"),
 (1, 437.2, 443.5, "s", "kids: لأن ده بيزود من إفراز هرمون النمو (Growth Hormone) وجودته ونسبته (إضافة منك، قرارك)"),
 (1, 257.8, 261.2, "S", "closing: وخليك عارف وراء كل حبة حكاية (take B)"),
 (1, 274.0, 281.4, "s", "closing: لو الحلقة فادتك… ابعتها لحد بيقضي الليل بيحارب مع المخدة… اكتب لنا (take 2)"),
 (1, 283.0, 286.2, "s", "closing: ولو عندك أي استفسار اكتب لنا في الكومنتات (إضافة منك؛ اترجعت)"),
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
    f = np.concatenate([[0], [60], fc, [14000, SR / 2]]) / (SR / 2); G = np.concatenate([[0], [0], g, [g[-1] * 0.5, 0]])
    h = sg.firwin2(2047, f, 10 ** (2 * G / 20))                  # squared magnitude: minimum_phase() returns the square root
    return sg.minimum_phase(h, method="homomorphic"), g            # minimum phase = no pre-echo / ringing before words
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
    proc[i] = sg.fftconvolve(shifted[i], h, mode="full")[: len(shifted[i])].astype(np.float32)
    eq_log[i] = dict(pitch_semitones=round(float(ST[i] if PITCH else 0), 2), eq_db={int(round(c)): round(float(x), 1) for c, x in zip(fc, g)})
    sf.write(f"{W}/clean/e{i}.wav", proc[i], SR, subtype="FLOAT")

# silence threshold per recording (rec1's pauses sit near -55 dB, the others near digital silence)
SIL = {i: float(np.percentile(frame_db(proc[i]), 80)) - 24 for i in (1, 2, 3)}
for i in (1, 2, 3):                                          # blank the non-speech sounds (short fades, no clicks)
    for a, b in DROPS[i]:
        k0, k1 = int(a * SR), int(b * SR); proc[i][k0:k1] = 0.0

# ---------------------------------------------------------------- 2. assemble (run-based)
import librosa
SIL = {i: float(np.percentile(frame_db(proc[i]), 80)) - 24 for i in (1, 2, 3)}
def runs_of(y, thr, gap=0.10, minlen=0.04):
    db = frame_db(y); sp = db > thr; R = []; s = l = None
    for k, v in enumerate(sp):
        if v:
            if s is None: s = k
            l = k
        elif s is not None and k - l > int(gap * 100): R.append([s / 100, (l + 1) / 100]); s = None
    if s is not None: R.append([s / 100, (l + 1) / 100])
    return [r for r in R if r[1] - r[0] >= minlen]
RUNS, KEEP = {}, {}
for i in (1, 2, 3):
    vp = f"{W}/clean/voiced{i}.npy"
    if os.path.exists(vp): vf = np.load(vp)
    else:
        y16 = librosa.resample(sf.read(f"{W}/clean/c{i}.wav", dtype="float32")[0], orig_sr=SR, target_sr=16000)
        _, vf, _ = librosa.pyin(y16, fmin=60, fmax=400, sr=16000, frame_length=1024, hop_length=160); vf = np.nan_to_num(vf).astype(bool); np.save(vp, vf)
    R = runs_of(proc[i], SIL[i] + 3); RUNS[i] = R; KEEP[i] = []
    for a, b in R:
        vfrac = float(np.mean(vf[int(a * 100): int(b * 100)])) if int(b * 100) > int(a * 100) else 0.0
        non_speech = vfrac < 0.30 and (b - a) < 0.9                         # breath / sigh / swallow / cough / click: not voiced, short, isolated
        dropped = any(a < e and b > s for s, e in DROPS[i])
        KEEP[i].append(not (non_speech or dropped))
def quietest(y, lo, hi):
    best, bt = 1e9, lo; w = int(0.03 * SR)
    for u in np.arange(lo, hi, 0.01):
        v = rms_db(y[int(u * SR): int(u * SR) + w])
        if v < best: best, bt = v, u
    return bt + 0.015
F10 = int(0.012 * SR); f_in = np.sin(np.linspace(0, np.pi / 2, F10)) ** 2
parts, edl, cursor = [], [], 0.0
for n_, pc in enumerate(PIECES):
    rec, a, b, brk, note = pc[:5]; opt = pc[5] if len(pc) > 5 else {}
    y = proc[rec]; R = RUNS[rec]; sel = []
    for k, (ra, rb) in enumerate(R):
        if KEEP[rec][k] and a <= (ra + rb) / 2 <= b:
            pre = min(0.05, (ra - R[k - 1][1]) / 2) if k else 0.05; post = min(0.10, (R[k + 1][0] - rb) / 2) if k + 1 < len(R) else 0.10
            sa, sb = ra - max(pre, 0.0), rb + max(post, 0.0)
            if ra < a - 0.15: sa = quietest(y, a - 0.2, a + 0.2)               # a run that straddles the start: cut at the quietest point
            if rb > b + 0.15: sb = quietest(y, b - 0.2, b + 0.2)
            sel.append((ra, rb, max(sa, 0.0), sb))
    if not sel: print("EMPTY piece", n_, rec, a, b); continue
    pieces_audio = []; prev_b = None
    for ra, rb, sa, sb in sel:
        seg = y[int(sa * SR): int(sb * SR)].copy(); seg[:F10] *= f_in; seg[-F10:] *= f_in[::-1]
        if prev_b is not None:
            g_orig = ra - prev_b; g_new = 0.40 if g_orig > 0.45 else max(g_orig, 0.10)
            pieces_audio.append(np.zeros(int(g_new * SR), dtype=np.float32))
        pieces_audio.append(seg); prev_b = rb
    seg = np.concatenate(pieces_audio)
    fo = max(F10, int(opt.get("fade", 0.012) * SR)); seg[-fo:] *= np.sin(np.linspace(0, np.pi / 2, fo))[::-1] ** 2
    if parts:
        g = GAP.get(brk, 0.4); parts.append(np.zeros(int(g * SR), dtype=np.float32)); cursor += g
    edl.append(dict(n=n_, rec=rec, src_a=round(sel[0][2], 2), src_b=round(sel[-1][3], 2), out_at=round(cursor, 2), dur=round(len(seg) / SR, 2), runs=len(sel), gap_before=GAP.get(brk, 0), note=note))
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
if abs(SPEED - 1) > 1e-3: chain += (f",atempo={SPEED}" if SPEEDMODE == "wsola" else f",asetrate={int(SR * SPEED)},aresample={SR}")
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
