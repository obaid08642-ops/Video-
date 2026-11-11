"""
Episode 05 (sleep) first-pass master voice. Three recording sessions -> one continuous narration.

    python ep05_build.py WORKDIR OUTDIR [--pitch 0|1] [--speed 1.05]

WORKDIR has clean/c1.wav c2.wav c3.wav (hum-notched + HPF80 + DeepFilterNet, float, 48 kHz, same time base as raw{i}.wav).
Steps: (1) optional subtle per-recording pitch (rubberband, formants kept) toward a common median, (2) per-recording
matching EQ toward the Ep01 master's long-term spectrum (the owner's own voice, previous episodes), (3) assemble the chosen
takes (PIECES) with equal-power crossfades and controlled pauses, (4) de-ess + compress + pitch-preserving speed-up +
two-pass loudnorm (-14 LUFS, TP <= -1.5), (5) write master + a map of every piece (edl.json).
Only whole spans of the original recordings are used; nothing is synthesised. Originals are never modified.
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf, scipy.signal as sg

W, OUT = sys.argv[1], sys.argv[2]
PITCH = int(sys.argv[sys.argv.index("--pitch") + 1]) if "--pitch" in sys.argv else 1
SPEED = float(sys.argv[sys.argv.index("--speed") + 1]) if "--speed" in sys.argv else 1.05
REF = os.environ.get("NABD_REF", "/home/user/Video-/nabd_project/video/public/voice/ep01_recording.wav")
os.makedirs(OUT, exist_ok=True)
SR = 48000
GAP = {"S": 0.95, "s": 0.52, "m": 0.62, "w": 0.36}      # scene / sentence / ellipsis / within-sentence silence (s)
TARGET_F0 = 108.0                                         # common median pitch (Hz); the owner's Ep01 median is 118
F0 = {1: 99.2, 2: 102.1, 3: 112.6}                        # measured medians of the three sessions (pyin)

# (rec, a, b, break_before, note). a/b are speech start/end times in the raw timeline (seconds).
PIECES = [
 # ---- scene 1 (recording 2)
 (2, 0.0, 9.9, "-", "s1: إنت بقالك ساعة… وتحاول من أول وجديد"),
 (2, 17.7, 19.0, "s", "s1: طب مين اللي سرق نومك؟"),
 (2, 24.3, 33.0, "s", "s1: كباية الشاي والقهوة؟ ولا الموبايل؟ ولا دماغك… (retake)"),
 (2, 36.4, 47.8, "s", "s1: المشكلة إن ساعات السبب… وإزاي ترجع نومك لطبيعته"),
 # ---- scene 2
 (2, 57.5, 83.0, "S", "s2: عشان تنام كويس… الأدينوزين… ساعتك البيولوجية (retake 2)"),
 (2, 87.9, 90.1, "w", "s2: وإمتى يبقى مستعد للصحيان (retake 2)"),
 (2, 93.8, 101.8, "s", "s2: وفي الظلام… الميلاتونين"),
 (2, 113.6, 119.8, "s", "s2: لكن خد بالك… مش زرار إطفاء (retake 2)"),
 (2, 123.0, 125.2, "S", "s2: وهنا بقى تيجي القهوة (take 1 lead-in)"),
 (2, 142.2, 158.4, "m", "s2: الكافيين بيقفل… جسمك لسه محتاج ينام (take 2)"),
 # ---- scene 3 (recording 2 -> 3)
 (2, 168.9, 180.2, "S", "s3: أول حاجة الكافين… تاني حاجة الضوء والموبايل"),
 (3, 0.2, 15.5, "s", "s3: الضوء بالليل… بدل ما تهدى"),
 (3, 19.4, 43.7, "s", "s3: ثالث حاجة التوتر… وتخلي النوم أصعب"),
 # ---- scene 4
 (3, 45.6, 71.1, "S", "s4: خلينا نفرّق بين 4 حاجات… أولًا"),
 (3, 73.3, 96.9, "s", "s4: ثانيًا الأرق المزمن"),
 (3, 97.4, 100.2, "s", "s4: ثالثًا انقطاع النفس أثناء النوم"),
 (3, 105.2, 109.1, "s", "s4: ودي حاجة ممكن تحصل وانت مش حاسس بيها (إضافة منك)"),
 (3, 109.5, 112.2, "s", "s4: الشخص ممكن يشخر بصوت عالي"),
 (3, 114.9, 127.7, "w", "s4: ويقف نفسه لحظات… وده اضطراب محتاج تقييم (تكرار ويقف نفسه اتشال)"),
 (3, 128.6, 142.7, "s", "s4: رابعًا تململ الساقين… قبل ما تقول أنا عندي أرق"),
 (3, 147.3, 151.7, "m", "s4: لازم نعرف إيه اللي فعلًا بيمنعك تنام (retake)"),
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
 (3, 337.6, 344.8, "s", "s5: والأهم: ده من أقوى العلاجات… ونظافة النوم لوحدها مش كفاية لعلاج (آخر كلمة مقطوعة في التسجيل)"),
 # ---- scene 6 (recording 1)
 (1, 3.5, 6.3, "S", "s6: وهنا نوصل للسؤال اللي ناس كتير بتسأله"),
 (1, 13.0, 28.95, "s", "s6: طب آخد ميلاتونين ولا منوّم؟… مش علاج سحري لكل أنواع الأرق"),
 (1, 30.7, 33.5, "s", "s6: ومش معنى إنك أخدته إنك لازم تنام (retake)"),
 (1, 34.0, 53.8, "s", "s6: النوع التاني: Z-drugs أو Benzodiazepines… GABA"),
 (1, 56.9, 59.45, "s", "s6: لكن استخدامها مش بلا مخاطر (take 1)"),
 (1, 70.4, 96.3, "s", "s6: ممكن تسبب نعاس… وفيه تحذير مهم جدًا… أنشطة خطيرة"),
 (1, 104.2, 106.9, "w", "s6: وفي حالات نادرة إصابات شديدة (retake حسب تعليمك: من غير «وفيات»)"),
 (1, 136.4, 140.45, "S", "s6: وفي فئة تالتة اسمها Orexin Receptor Antagonists"),
 (1, 151.6, 158.5, "s", "s6: دي بتقلل إشارات اليقظة في المخ… (take 2)"),
 (1, 171.9, 194.9, "s", "s6: مضادات الحساسية… والخلاصة؟ اختيار الدواء بيعتمد…"),
 # ---- scene 7
 (1, 204.9, 230.9, "S", "s7: لو نومك متلخبط يوم أو يومين… ومتبدأش منوّم من نفسك"),
 (1, 233.4, 241.5, "s", "s7: وممكن نستشير الطبيب أو الصيدلي (إضافة منك) وافتكر: مش كل أرق…"),
 (1, 256.6, 260.6, "S", "s7: وخليك عارف وراء كل حبة حكاية (take B)"),
 (1, 271.7, 281.2, "s", "s7: لو الحلقة فادتك… ابعتها لحد بيقضي الليل بيحارب مع المخدة… اكتب لنا"),
 # ---- children's sleep and growth
 (1, 344.2, 349.3, "S", "kids: لو عندك طفل فالنقطة دي مهمة جدًا لأن النوم مش رفاهية بالنسبة له (إضافة منك)"),
 (1, 335.3, 340.2, "s", "kids: والنوم مش بيريّح الطفل… جزء أساسي من نموه وتطوره"),
 (1, 369.3, 378.3, "s", "kids: أثناء النوم العميق… هرمون النمو… ساعة سحرية (take 2)"),
 (1, 391.6, 404.0, "s", "kids: الأهم إنه يحصل على نوم كافي… الطفل 6–12… المراهق 8–10"),
]

def rms_db(x):
    if len(x) == 0: return -120.0
    return 20 * np.log10(np.sqrt(np.mean(x.astype(np.float64) ** 2)) + 1e-9)

# ---------------------------------------------------------------- 1. pitch (per recording) + matching EQ
def third_octave_profile(y, sr):
    H = sr // 100; n = len(y) // H
    db = 20 * np.log10(np.sqrt((y[: n * H].reshape(n, H) ** 2).mean(1)) + 1e-9)
    m = np.repeat(db > np.percentile(db, 55), H)[: len(y)]; m = np.pad(m, (0, len(y) - len(m)))
    f, P = sg.welch(y[m], sr, nperseg=16384)
    return f, P
def centres():
    return 2 ** (np.arange(-12, 14) / 3) * 1000      # 1/3-octave centres ~63 Hz .. ~10 kHz
def band_db(f, P, fc):
    out = []
    for c in fc:
        k = (f >= c / 2 ** (1 / 6)) & (f < c * 2 ** (1 / 6)); out.append(10 * np.log10(P[k].sum() + 1e-20))
    return np.array(out)
ref, rsr = sf.read(REF, dtype="float32"); ref = ref if ref.ndim == 1 else ref.mean(1)
fc = centres(); fc = fc[(fc >= 100) & (fc <= 10000)]
rf, rP = third_octave_profile(ref, rsr); ref_prof = band_db(rf, rP, fc)

proc = {}
eq_log = {}
for i in (1, 2, 3):
    src = f"{W}/clean/c{i}.wav"
    st = 0.0
    if PITCH:
        st = max(0.0, 12 * np.log2(TARGET_F0 / F0[i]))
        if st > 0.05:
            tmp = f"{W}/clean/p{i}.wav"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af",
                            f"rubberband=pitch={2 ** (st / 12):.5f}:formant=preserved:pitchq=quality:transients=smooth", "-c:a", "pcm_f32le", tmp], check=True)
            src = tmp
    y, sr = sf.read(src, dtype="float32"); y = y if y.ndim == 1 else y.mean(1)
    f, P = third_octave_profile(y, sr)
    d = ref_prof - band_db(f, P, fc)                       # dB needed to reach the Ep01 balance (1/3 octave)
    d = d - d[(fc >= 200) & (fc <= 5000)].mean()           # keep the overall level / tilt of 0.2-5 kHz
    d = np.clip(0.75 * d, -5.0, 5.0); d = np.convolve(np.pad(d, 1, mode="edge"), [0.25, 0.5, 0.25], mode="valid")   # 75 %: subtle
    freqs = np.concatenate([[0], [60], fc, [14000, sr / 2]]); gains = np.concatenate([[0], [0], d, [d[-1] * 0.5, 0]])
    h = sg.firwin2(4095, freqs / (sr / 2), 10 ** (gains / 20))
    ye = sg.fftconvolve(y, h, mode="same").astype(np.float32)
    proc[i] = ye; eq_log[i] = dict(pitch_semitones=round(float(st), 2), eq_db={int(round(c)): round(float(g), 1) for c, g in zip(fc, d)})
    sf.write(f"{W}/clean/e{i}.wav", ye, sr, subtype="FLOAT")

# ---------------------------------------------------------------- 2. assemble
def snap(y, t, lo, hi):
    """if there is speech/noise at t, move to the quietest 30 ms within [lo, hi]"""
    k = int(t * SR); w = int(0.03 * SR)
    if rms_db(y[k: k + w]) < -58: return t
    best, bt = 1e9, t
    for u in np.arange(max(lo, 0), hi, 0.01):
        v = rms_db(y[int(u * SR): int(u * SR) + w])
        if v < best: best, bt = v, u
    return bt + 0.015

def tighten(seg, maxs=0.85, keep=0.60):
    """shorten silences longer than maxs inside a piece to `keep` seconds"""
    H = SR // 100; n = len(seg) // H
    db = 20 * np.log10(np.sqrt((seg[: n * H].reshape(n, H) ** 2).mean(1)) + 1e-9)
    sil = db < -62; out = []; pos = 0; k = 0
    while k < n:
        if sil[k]:
            e = k
            while e < n and sil[e]: e += 1
            if (e - k) * 0.01 > maxs and k > 0 and e < n:
                cut_a, cut_b = k * H + int((keep / 2) * SR), e * H - int((keep / 2) * SR)
                out.append(seg[pos:cut_a]); pos = cut_b
            k = e
        else: k += 1
    out.append(seg[pos:]); return np.concatenate(out)

X = int(0.02 * SR); fade = np.sin(np.linspace(0, np.pi / 2, X)) ** 2
parts, edl, cursor = [], [], 0.0
for n_, (rec, a, b, brk, note) in enumerate(PIECES):
    y = proc[rec]
    a = max(a, 0.14)
    a2 = snap(y, a - 0.14, a - 0.30, a + 0.30) if rms_db(y[int((a - 0.14) * SR): int((a - 0.11) * SR)]) > -58 else a - 0.14
    b2 = b + 0.20
    if rms_db(y[int(b2 * SR): int((b2 + 0.03) * SR)]) > -58: b2 = snap(y, b2, b - 0.30, b + 0.45)
    seg = y[int(a2 * SR): min(int(b2 * SR), len(y))].copy()
    seg = tighten(seg)
    if len(seg) < X * 4: print("EMPTY piece", n_, rec, a, b, a2, b2, len(y)/SR); continue
    # trim outer silence to 30 ms
    H = SR // 100; n = len(seg) // H
    db = 20 * np.log10(np.sqrt((seg[: n * H].reshape(n, H) ** 2).mean(1)) + 1e-9)
    idx = np.where(db > -62)[0]
    if len(idx): seg = seg[max(0, idx[0] * H - int(0.03 * SR)): min(len(seg), (idx[-1] + 1) * H + int(0.05 * SR))]
    seg[:X] *= fade; seg[-X:] *= fade[::-1]
    if parts:
        g = GAP[brk] if brk in GAP else 0.4
        parts.append(np.zeros(int(g * SR), dtype=np.float32)); cursor += g
    edl.append(dict(n=n_, rec=rec, src_a=round(a2, 2), src_b=round(b2, 2), out_at=round(cursor, 2), dur=round(len(seg) / SR, 2), gap_before=GAP.get(brk, 0), note=note))
    parts.append(seg.astype(np.float32)); cursor += len(seg) / SR
v = np.concatenate(parts)
# room-tone bed (the cleaned files have digital silence in the pauses): shaped noise at -70 dBFS
rng = np.random.default_rng(5)
nz = rng.standard_normal(len(v)); nz = sg.sosfilt(sg.butter(2, [120, 5000], "bandpass", fs=SR, output="sos"), nz)
nz = nz / (np.sqrt(np.mean(nz ** 2)) + 1e-9) * 10 ** (-70 / 20)
v = (v + nz).astype(np.float32)
sf.write(f"{OUT}/assembled.wav", v, SR, subtype="FLOAT")
json.dump(dict(pieces=edl, eq=eq_log, pitch=PITCH, speed=SPEED, duration=round(len(v) / SR, 2)), open(f"{OUT}/edl.json", "w"), ensure_ascii=False, indent=1)

# ---------------------------------------------------------------- 3. finish: level, de-ess, compress, speed, loudnorm
def run(cmd): return subprocess.run(cmd, capture_output=True, text=True)
pre = f"{OUT}/_pre.wav"
e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", f"{OUT}/assembled.wav", "-af", "ebur128", "-f", "null", "-"]).stderr
import re
I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", e)[-1])
chain = f"volume={-20 - I:.2f}dB,deesser=i=0.45,acompressor=threshold=0.063:ratio=2.5:attack=8:release=110:makeup=1.5"
if abs(SPEED - 1) > 1e-3: chain += f",atempo={SPEED}"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{OUT}/assembled.wav", "-af", chain, "-c:a", "pcm_f32le", pre], check=True)
ln = run(["ffmpeg", "-hide_banner", "-nostats", "-i", pre, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"]).stderr
m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", ln, re.S).group())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", pre, "-af",
                f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,alimiter=limit=0.84:level=disabled",
                "-ar", "48000", "-c:a", "pcm_s24le", f"{OUT}/Final_Master_VO.wav"], check=True)
os.remove(pre)
e = run(["ffmpeg", "-hide_banner", "-nostats", "-i", f"{OUT}/Final_Master_VO.wav", "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
print(f"assembled {len(v)/SR:.1f}s -> master {sf.info(f'{OUT}/Final_Master_VO.wav').duration:.1f}s;",
      "LUFS", re.findall(r"I:\s+(-?[\d.]+) LUFS", e)[-1], "TP", re.findall(r"Peak:\s+(-?[\d.]+) dBFS", e)[-1])
