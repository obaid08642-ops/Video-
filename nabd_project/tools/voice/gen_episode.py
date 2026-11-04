"""
Generate a full episode voice with VoiceTut-TTS (CPU), line by line, check every line with
faster-whisper, and write: final WAV + MP3, a word-timing JSON, and a QA report.

    python -I gen_episode.py SCRIPT.md VOICE OUT_DIR [--base-speed 1.0] [--only s1]

Tag handling (CLAUDE.md "تحويل الـ tags"):
  * line-initial [slowly]            -> generation speed x0.90
  * line-initial [clear] (lists)     -> generation speed x1.05
  * mid-line [slowly]                -> rest of the line time-stretched to 0.90 (pitch kept)
  * [softly] / [thoughtful]          -> 0.45 s pause before
  * [pause]                          -> 1.0 s silence
  * "…"                              -> 0.30 s silence (sent to the model as "،" for a natural breath)
  * **keyword**                      -> 0.20 s pause before + 6 % slower on the keyword
  * "؟" mid-line                     -> 0.30 s pause after (question, pause, answer)
Every line is checked with faster-whisper; a line whose transcript differs too much, or whose
question does not rise at the end, is regenerated with a new seed (best take wins).
"""
from __future__ import annotations
import argparse, difflib, hashlib, json, os, re, subprocess, sys, tempfile, time
import numpy as np, soundfile as sf

SEEDS = [1234, 7, 42, 2024]
MIN_SIM = 0.90             # whisper vs. script similarity required to accept a take
# pronunciation fixes (diacritics only, used for generation; the script text never changes)
LEXICON = {"ساعات": "سَاعَات"}
PAUSE = dict(ellipsis=0.30, keyword=0.20, pause=1.00, soft=0.45, question=0.30,
             sentence=0.30, colon=0.15)
LINE_GAP, SOFT_GAP, SCENE_GAP, LEAD_IN, TAIL = 0.35, 0.50, 0.70, 0.12, 0.40
KW_TEMPO, SLOW_TEMPO = 0.94, 0.90
TAG_RE = re.compile(r"\[(\w+)\]")
AR_DIAC = re.compile(r"[ً-ْٰـ]")


# ----------------------------------------------------------------------------- script parsing
def parse_script(path):
    """-> list of lines: {id, scene, raw}"""
    lines, scene, grab = [], 0, False
    for row in open(path, encoding="utf-8"):
        row = row.rstrip("\n")
        m = re.match(r"^## المشهد (\d+)", row)
        if m:
            scene, grab, n = int(m.group(1)), False, 0
            continue
        if row.startswith("**المنطوق:**"):
            grab = True
            continue
        if grab:
            if not row.strip():
                grab = False
                continue
            n += 1
            lines.append(dict(id=f"s{scene}l{n}", scene=scene, raw=row.strip()))
    return lines


def tokenize(raw):
    """Split a script line into words with prosody marks.
    -> words: [{w, kw, punct, tags_before}], line_tags (tags before first word)"""
    words, pending_tags, kw = [], [], False
    for tok in re.findall(r"\[\w+\]|\*\*|[^\s\[\]*]+|\*", raw):
        t = TAG_RE.fullmatch(tok)
        if t:
            pending_tags.append(t.group(1)); continue
        if tok == "**":
            kw = not kw; continue
        # a token may carry trailing ** (e.g. "جبار**.") — handled by regex split already
        m = re.match(r"^(.*?)([.…؟?:،,!]*)$", tok)
        w, p = m.group(1), m.group(2)
        if not w:              # pure punctuation token
            if words: words[-1]["punct"] += p
            continue
        words.append(dict(w=w, kw=kw, punct=p, tags=pending_tags))
        pending_tags = []
    return words


def gen_text(words):
    out = []
    for i, x in enumerate(words):
        x = dict(x, w=LEXICON.get(x["w"], x["w"]))
        p = x["punct"].replace("…", "،")
        if i == len(words) - 1:
            p = p.replace("،", ".") or "."
        out.append(x["w"] + p)
    return " ".join(out).replace("،.", ".")


# ----------------------------------------------------------------------------- text compare
def norm(s):
    s = AR_DIAC.sub("", s.lower())
    for a, b in [("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ٱ", "ا"), ("ة", "ه"), ("ى", "ي"),
                 ("ؤ", "و"), ("ئ", "ي"), ("ء", ""), ("ث", "ت"), ("ذ", "د"), ("ظ", "ض")]:
        s = s.replace(a, b)
    return re.sub(r"[^a-zء-ي]", "", s)


def align_words(words, hyp):
    """Map whisper words (with times) onto the script words via char-level alignment.
    -> per script word: (start, end, matched_fraction)"""
    exp_chars, owner = [], []
    for i, x in enumerate(words):
        for c in norm(x["w"]):
            exp_chars.append(c); owner.append(i)
    hyp_chars, ht = [], []
    for h in hyp:
        cs = norm(h["word"])
        for k, c in enumerate(cs):
            a = h["start"] + (h["end"] - h["start"]) * k / max(1, len(cs))
            b = h["start"] + (h["end"] - h["start"]) * (k + 1) / max(1, len(cs))
            hyp_chars.append(c); ht.append((a, b))
    sm = difflib.SequenceMatcher(None, "".join(exp_chars), "".join(hyp_chars), autojunk=False)
    cmap = {}
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            cmap[blk.a + k] = ht[blk.b + k]
    n = len(words)
    res = [[None, None, 0.0] for _ in range(n)]
    for i in range(n):
        idx = [k for k, o in enumerate(owner) if o == i]
        hit = [cmap[k] for k in idx if k in cmap]
        res[i][2] = len(hit) / max(1, len(idx))
        if hit:
            res[i][0], res[i][1] = hit[0][0], hit[-1][1]
    # interpolate words with no matched chars, by char length between known neighbours
    known = [i for i in range(n) if res[i][0] is not None]
    t_end = max([h["end"] for h in hyp] + [0.0])
    for i in range(n):
        if res[i][0] is not None: continue
        L = max([k for k in known if k < i], default=None)
        R = min([k for k in known if k > i], default=None)
        a = res[L][1] if L is not None else 0.0
        b = res[R][0] if R is not None else t_end
        lo = L + 1 if L is not None else 0
        hi = R if R is not None else n
        tot = sum(len(words[k]["w"]) for k in range(lo, hi)) or 1
        acc = sum(len(words[k]["w"]) for k in range(lo, i))
        res[i][0] = a + (b - a) * acc / tot
        res[i][1] = a + (b - a) * (acc + len(words[i]["w"])) / tot
    for i in range(1, n):  # monotonic
        res[i][0] = max(res[i][0], res[i - 1][1] - 0.02)
        res[i][1] = max(res[i][1], res[i][0] + 0.05)
    return [tuple(r) for r in res]


def similarity(words, hyp_text):
    a = "".join(norm(x["w"]) for x in words)
    b = norm(hyp_text)
    return difflib.SequenceMatcher(None, a, b, autojunk=False).ratio()


# ----------------------------------------------------------------------------- audio helpers
def pitch_rise(y, sr, t0, t1):
    """Semitones: pitch over the last 40 % of [t0,t1] vs. the first 60 % (>0 = rising)."""
    import librosa
    seg = y[int(t0 * sr):int(t1 * sr)]
    if len(seg) < int(0.12 * sr):
        return None
    f0, vf, _ = librosa.pyin(seg, fmin=60, fmax=320, sr=sr, frame_length=1024, hop_length=160)
    f0 = np.where(vf, f0, np.nan)
    v = f0[~np.isnan(f0)]
    if len(v) < 6:
        return None
    k = int(len(v) * 0.6)
    return float(12 * np.log2(np.median(v[k:]) / np.median(v[:k])))


def glide_up(y, sr, t0, t1, semitones=3.5):
    """Raise pitch smoothly over [t0, t1] (end of a question) with the WORLD vocoder.
    Only that word is re-synthesised; 25 ms cross-fades on both sides."""
    import pyworld as pw
    a, b = max(0, int((t0 - 0.04) * sr)), min(len(y), int((t1 + 0.08) * sr))
    seg = y[a:b].astype(np.float64)
    if len(seg) < int(0.1 * sr):
        return y
    f0, tt = pw.harvest(seg, sr, frame_period=5.0)
    sp = pw.cheaptrick(seg, f0, tt, sr)
    ap = pw.d4c(seg, f0, tt, sr)
    x = np.clip((tt - 0.04) / max(1e-3, (t1 - t0)), 0, 1)
    f0 = f0 * 2 ** (semitones * x ** 1.6 / 12)
    z = pw.synthesize(f0, sp, ap, sr, frame_period=5.0)[: len(seg)]
    z = np.pad(z, (0, len(seg) - len(z)))
    n = int(0.025 * sr)
    w = np.ones(len(seg)); w[:n] = np.linspace(0, 1, n); w[-n:] = np.linspace(1, 0, n)
    out = y.copy()
    out[a:b] = (seg * (1 - w) + z * w).astype(np.float32)
    return out


def quiet_point(y, sr, a, b):
    """Lowest-energy 10 ms frame between times a and b (cut point)."""
    a, b = max(0, a), min(len(y) / sr, b)
    if b - a < 0.02:
        return (a + b) / 2
    hop = int(0.01 * sr)
    seg = y[int(a * sr):int(b * sr)]
    e = [np.sqrt(np.mean(seg[i:i + hop] ** 2) + 1e-12) for i in range(0, max(1, len(seg) - hop), hop)]
    return a + (int(np.argmin(e)) * hop + hop / 2) / sr


def atempo(y, sr, tempo):
    if abs(tempo - 1) < 1e-3 or len(y) < sr * 0.05:
        return y
    with tempfile.TemporaryDirectory() as d:
        i, o = os.path.join(d, "i.wav"), os.path.join(d, "o.wav")
        sf.write(i, y, sr)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", i, "-af", f"atempo={tempo}", o], check=True)
        z, _ = sf.read(o, dtype="float32")
    return z


def fade(y, sr, ms=6):
    n = min(len(y) // 2, int(sr * ms / 1000))
    if n > 0:
        r = np.linspace(0, 1, n, dtype=np.float32)
        y = y.copy(); y[:n] *= r; y[-n:] *= r[::-1]
    return y


# ----------------------------------------------------------------------------- per-line shaping
def boundary_pauses(words):
    """Required silence before word i (i>=1) and which words get slowed."""
    n = len(words)
    need, tempo = [0.0] * n, [1.0] * n
    slow_from = None
    for i, x in enumerate(words):
        if i > 0:
            prev = words[i - 1]["punct"]
            if "…" in prev: need[i] = max(need[i], PAUSE["ellipsis"])
            if "؟" in prev or "?" in prev: need[i] = max(need[i], PAUSE["question"])
            if "." in prev: need[i] = max(need[i], PAUSE["sentence"])
            if ":" in prev: need[i] = max(need[i], PAUSE["colon"])
            if x["kw"] and not words[i - 1]["kw"]: need[i] = max(need[i], PAUSE["keyword"])
            if "pause" in x["tags"]: need[i] = max(need[i], PAUSE["pause"])
            if {"softly", "thoughtful"} & set(x["tags"]): need[i] = max(need[i], PAUSE["soft"])
            if "slowly" in x["tags"]: slow_from = i
        if slow_from is not None and i >= slow_from: tempo[i] *= SLOW_TEMPO
        if x["kw"]: tempo[i] *= KW_TEMPO
    return need, tempo


def shape_line(y, sr, words, times):
    """Insert pauses at word boundaries, stretch slow regions. -> (audio, new word times)"""
    n = len(words)
    need, tempo = boundary_pauses(words)
    import librosa
    _, (on, off) = librosa.effects.trim(y, top_db=40)
    first = max(0.0, min(times[0][0] - 0.06, on / sr - 0.02))
    last = min(len(y) / sr, max(times[-1][1] + 0.05, off / sr + 0.05))
    cuts = [first]
    for i in range(1, n):
        a, b = times[i - 1][1], times[i][0]
        cuts.append(quiet_point(y, sr, min(a, b) - 0.05, max(a, b) + 0.05))
    cuts.append(last)
    out, new_times, t = [], [], 0.0
    for i in range(n):
        piece = y[int(cuts[i] * sr):int(cuts[i + 1] * sr)]
        gap_have = max(0.0, times[i][0] - cuts[i]) + (max(0.0, cuts[i] - times[i - 1][1]) if i else 0)
        add = max(0.0, need[i] - gap_have) if i else 0.0
        if add > 0:
            out.append(np.zeros(int(add * sr), dtype=np.float32)); t += add
        z = fade(atempo(piece, sr, tempo[i]), sr)
        k = len(z) / max(1, len(piece))
        ws = t + (times[i][0] - cuts[i]) * k
        we = t + (times[i][1] - cuts[i]) * k
        out.append(z.astype(np.float32)); t += len(z) / sr
        new_times.append((max(0.0, ws), min(t, we)))
    return np.concatenate(out), new_times


# ----------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script"); ap.add_argument("voice"); ap.add_argument("out")
    ap.add_argument("--base-speed", type=float, default=1.0)
    ap.add_argument("--only", default=None, help="scene prefix, e.g. s1")
    ap.add_argument("--model", default="/opt/nabd/model")
    ap.add_argument("--whisper", default="/opt/nabd/whisper")
    ap.add_argument("--max-seconds", type=float, default=179.0)
    args = ap.parse_args()

    import torch
    from voicetut_tts import VoiceTutTTS
    from faster_whisper import WhisperModel
    torch.set_num_threads(os.cpu_count())

    lines = parse_script(args.script)
    if args.only:
        lines = [l for l in lines if l["id"].startswith(args.only + "l")]
    takes_dir = os.path.join(args.out, "takes", args.voice)
    os.makedirs(takes_dir, exist_ok=True)

    tts = VoiceTutTTS.from_pretrained(args.model, device="cpu", dtype="float32")
    sr = tts.sampling_rate
    asr = WhisperModel("large-v3", device="cpu", compute_type="int8", download_root=args.whisper,
                       cpu_threads=os.cpu_count())

    def transcribe(path):
        import librosa
        y16, _ = librosa.load(path, sr=16000, mono=True)
        segs, _ = asr.transcribe(y16, language="ar", word_timestamps=True, beam_size=5,
                                 vad_filter=False, condition_on_previous_text=False)
        hyp = [dict(word=w.word.strip(), start=w.start, end=w.end) for s in segs for w in s.words]
        return hyp, " ".join(h["word"] for h in hyp)

    report, shaped = [], []
    t_start = time.time()
    for L in lines:
        words = tokenize(L["raw"])
        tags0 = words[0]["tags"]
        speed = args.base_speed * (0.9 if "slowly" in tags0 else 1.0) * (1.05 if "clear" in tags0 else 1.0)
        text = gen_text(words)
        q_idx = [i for i, x in enumerate(words) if "؟" in x["punct"]]
        best, tries = None, 0
        for seed in SEEDS:
            tries += 1
            key = hashlib.md5(f"{text}|{speed}".encode()).hexdigest()[:6]
            path = os.path.join(takes_dir, f"{L['id']}_{key}_seed{seed}.wav")
            if not os.path.exists(path):
                torch.manual_seed(seed); np.random.seed(seed)
                t0 = time.time()
                wav = tts.synthesize(text, speaker=args.voice, speed=speed, num_step=32, guidance_scale=2.0)
                sf.write(path, wav, sr)
                print(f"  gen {L['id']} seed={seed} {time.time()-t0:.0f}s", flush=True)
            y, _ = sf.read(path, dtype="float32")
            hyp, hyp_text = transcribe(path)
            sim = similarity(words, hyp_text)
            times = align_words(words, hyp)
            rises = [pitch_rise(y, sr, times[i][0], times[i][1] + 0.05) for i in q_idx]
            q_ok = all(r is None or r > 0 for r in rises)
            flg = [words[i]["w"] for i, tm in enumerate(times)
                   if tm[2] < 0.5 and not re.search(r"[A-Za-z]", words[i]["w"]) and len(norm(words[i]["w"])) > 1]
            score = sim + (0.03 if q_ok else 0) - 0.04 * len(flg)
            take = dict(seed=seed, path=path, sim=round(sim, 3), hyp=hyp_text, times=times,
                        rises=[None if r is None else round(r, 1) for r in rises], q_ok=q_ok, score=score, flagged=flg)
            if best is None or score > best["score"]:
                best = take
            if sim >= MIN_SIM and not flg and (q_ok or SEEDS.index(seed) >= 1):
                break
        y, _ = sf.read(best["path"], dtype="float32")
        glided = []
        for qi, r in zip(q_idx, best["rises"]):
            if r is None or r <= 0.5:
                t0, t1 = best["times"][qi][0], best["times"][qi][1]
                if qi == len(words) - 1:
                    import librosa
                    _, (_, off) = librosa.effects.trim(y, top_db=35)
                    t1 = max(t1, off / sr - 0.03)
                base = y
                r0 = pitch_rise(base, sr, t0, t1 + 0.05)
                best_y, best_r, best_st = base, (r0 if r0 is not None else -99), 0.0
                for st in (4.0, 5.5, 7.0):
                    z = glide_up(base, sr, t0, t1, st)
                    r2 = pitch_rise(z, sr, t0, t1 + 0.05)
                    if r2 is not None and r2 > best_r:
                        best_y, best_r, best_st = z, r2, st
                    if r2 is not None and r2 >= 0.8:
                        break
                y = best_y
                glided.append((words[qi]["w"], r, round(best_r, 1), best_st))
        flagged = best["flagged"]
        z, nt = shape_line(y, sr, words, best["times"])
        shaped.append(dict(L=L, words=words, audio=z, times=nt))
        report.append(dict(id=L["id"], text=text, speed=round(speed, 3), seed=best["seed"],
                           tries=tries,
                           similarity=best["sim"], whisper=best["hyp"], question_rise_st=best["rises"],
                           question_ok=best["q_ok"], question_glide=glided, flagged_words=flagged))
        print(f"{L['id']}: sim={best['sim']} q={best['rises']} glide={glided} seed={best['seed']} flagged={flagged}", flush=True)

    # ---- assemble, shrinking pauses if over the time budget
    def assemble(scale):
        pieces, timeline, t = [np.zeros(int(LEAD_IN * sr), np.float32)], [], LEAD_IN
        prev_scene = None
        for k, s in enumerate(shaped):
            L, words = s["L"], s["words"]
            if k:
                gap = SCENE_GAP if L["scene"] != prev_scene else LINE_GAP
                if {"softly", "thoughtful"} & set(words[0]["tags"]): gap = max(gap, SOFT_GAP)
                if "pause" in words[0]["tags"]: gap = max(gap, PAUSE["pause"])
                gap *= scale
                pieces.append(np.zeros(int(gap * sr), np.float32)); t += gap
            line_start = t
            pieces.append(s["audio"])
            timeline.append(dict(id=L["id"], scene=L["scene"], raw=L["raw"],
                                 start=round(line_start, 3), end=round(line_start + len(s["audio"]) / sr, 3),
                                 words=[dict(w=x["w"], punct=x["punct"], kw=x["kw"], tags=x["tags"],
                                             start=round(line_start + a, 3), end=round(line_start + b, 3))
                                        for x, (a, b) in zip(words, s["times"])]))
            t += len(s["audio"]) / sr
            prev_scene = L["scene"]
        pieces.append(np.zeros(int(TAIL * sr), np.float32))
        return np.concatenate(pieces), timeline

    scale = 1.0
    full, timeline = assemble(scale)
    while len(full) / sr + 1.5 > args.max_seconds and scale > 0.4:   # +1.5 s logo outro
        scale -= 0.1
        full, timeline = assemble(scale)

    os.makedirs(args.out, exist_ok=True)
    name = args.voice.lower()
    raw_path = os.path.join(args.out, f"_raw_{name}.wav")
    sf.write(raw_path, full, sr)
    wav_path = os.path.join(args.out, f"ep01_{name}.wav")
    mp3_path = os.path.join(args.out, f"ep01_{name}.mp3")
    # warmth EQ, de-esser, gentle compression, then loudness -14 LUFS / -1 dBTP
    chain = ("highpass=f=70,equalizer=f=180:t=q:w=1.0:g=2,equalizer=f=3200:t=q:w=1.5:g=-1,"
             "deesser=i=0.4,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,"
             "loudnorm=I=-14:TP=-1.5:LRA=7")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw_path, "-af", chain, "-ar", "48000", "-ac", "1",
                    wav_path], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav_path, "-b:a", "192k", mp3_path], check=True)
    os.remove(raw_path)
    dur = sf.info(wav_path).duration
    scenes = {}
    for l in timeline:
        s = scenes.setdefault(l["scene"], dict(id=l["scene"], start=l["start"], end=l["end"]))
        s["end"] = l["end"]
    json.dump(dict(voice=args.voice, audio=os.path.basename(wav_path), duration=round(dur, 3),
                   sampleRate=48000, pauseScale=round(scale, 2), scenes=list(scenes.values()), lines=timeline),
              open(os.path.join(args.out, f"ep01_{name}_timing.json"), "w"), ensure_ascii=False, indent=1)
    json.dump(dict(voice=args.voice, base_speed=args.base_speed, pause_scale=round(scale, 2),
                   duration=round(dur, 2), gen_minutes=round((time.time() - t_start) / 60, 1), lines=report),
              open(os.path.join(args.out, f"ep01_{name}_qa.json"), "w"), ensure_ascii=False, indent=1)
    print(f"DONE {args.voice}: {dur:.2f}s  pause_scale={scale:.2f}  {(time.time()-t_start)/60:.1f} min")


if __name__ == "__main__":
    main()
