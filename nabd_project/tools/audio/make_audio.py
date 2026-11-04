"""
Nabd sound family, generated 100 % in code (numpy/scipy) -> owned by the channel, no licence issues.
Same spirit as brand/nabd_sound_demo.mp3: ~88 BPM, C major, warm low-centroid tone, double heartbeat.

    python -I make_audio.py OUT_DIR        # writes OUT_DIR/sfx/*.wav, OUT_DIR/music/*.mp3, licenses.txt
"""
import os, subprocess, sys
import numpy as np
from scipy import signal
import soundfile as sf

SR = 48000
rng = np.random.default_rng(7)
OUT = sys.argv[1]


def t_(d): return np.arange(int(d * SR)) / SR
def env(d, a=0.005, r=None, curve=6.0):
    t = t_(d); e = np.minimum(1, t / max(a, 1e-4))
    e *= np.exp(-curve * t / d) if r is None else np.clip((d - t) / r, 0, 1)
    return e
def lp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, "high", fs=SR, output="sos"), x)
def bp(x, a, b, o=2): return signal.sosfilt(signal.butter(o, [a, b], "band", fs=SR, output="sos"), x)
def norm(x, db=-6.0): return x / (np.abs(x).max() + 1e-9) * 10 ** (db / 20)
def noise(d): return rng.standard_normal(int(d * SR))
def save(name, x, db=-6.0):
    os.makedirs(os.path.join(OUT, "sfx"), exist_ok=True)
    x = norm(x, db); n = int(0.004 * SR); x[-n:] *= np.linspace(1, 0, n)
    sf.write(os.path.join(OUT, "sfx", name + ".wav"), x.astype(np.float32), SR)


def reverb(x, dur=1.2, mix=0.22, seed=3):
    r = np.random.default_rng(seed)
    ir = r.standard_normal(int(dur * SR)) * np.exp(-5 * t_(dur) / dur)
    ir = lp(ir, 5000); ir /= np.sqrt(np.sum(ir ** 2))
    wet = signal.fftconvolve(x, ir)[: len(x)]
    return (1 - mix) * x + mix * wet


# ------------------------------------------------------------------------------------- SFX
def heartbeat():
    def thump(d, f0, f1, amp):
        t = t_(d); f = f1 + (f0 - f1) * np.exp(-t * 30)
        return amp * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.004, None, 7)
    x = np.zeros(int(0.75 * SR))
    a = thump(0.22, 95, 48, 1.0); b = thump(0.2, 85, 45, 0.7)
    x[: len(a)] += a; o = int(0.25 * SR); x[o: o + len(b)] += b
    return lp(x, 400)

def pop():
    t = t_(0.12); f = 520 + 380 * (1 - np.exp(-t * 60))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(0.12, 0.002, None, 9)
    return lp(s + 0.15 * hp(noise(0.12), 3000) * env(0.12, 0.001, None, 40), 3500)

def paper():
    d = 0.42; x = bp(noise(d), 900, 5200)
    e = np.sin(np.pi * np.clip(t_(d) / d, 0, 1)) ** 1.6
    return lp(x * e * (0.8 + 0.2 * np.sin(2 * np.pi * 23 * t_(d))), 6000)

def scribble():
    d = 0.55; t = t_(d); x = bp(noise(d), 1800, 7000)
    strokes = (0.5 + 0.5 * np.sin(2 * np.pi * 11 * t + 2 * np.sin(2 * np.pi * 3 * t))) ** 2
    return x * strokes * env(d, 0.02, 0.12)

def whoosh():
    d = 0.6; t = t_(d); x = noise(d)
    fc = 300 + 1100 * np.sin(np.pi * t / d) ** 2
    y = np.zeros_like(x); zi = None
    for i in range(0, len(x), 480):           # time-varying low-pass
        sos = signal.butter(2, fc[i], "low", fs=SR, output="sos")
        if zi is None: zi = signal.sosfilt_zi(sos) * 0
        y[i:i + 480], zi = signal.sosfilt(sos, x[i:i + 480], zi=zi)
    return y * np.sin(np.pi * t / d) ** 2

def glass():
    d = 1.4; t = t_(d); x = np.zeros_like(t)
    for f, a, k in [(2093, 1, 4), (5310, .5, 7), (8770, .25, 10), (3141, .3, 5)]:
        x += a * np.sin(2 * np.pi * f * t) * np.exp(-k * t)
    return x * env(d, 0.001, None, 0.01)

def ding():
    d = 1.6; t = t_(d); x = np.zeros_like(t)
    for f, a, k in [(1046.5, 1, 2.6), (2093, .35, 4), (2889, .18, 6), (523.25, .25, 2)]:
        x += a * np.sin(2 * np.pi * f * t) * np.exp(-k * t)
    return lp(x * np.minimum(1, t / 0.004), 6000)

def bubbles():
    d = 0.7; x = np.zeros(int(d * SR))
    for k in range(6):
        s = int(rng.uniform(0, d - 0.1) * SR); bd = rng.uniform(0.04, 0.08); tt = t_(bd)
        f = rng.uniform(280, 520) * (1 + 1.4 * tt / bd)
        b = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / bd) * rng.uniform(.4, 1)
        x[s:s + len(b)] += b
    return lp(x, 2500)

def shimmer():
    d = 1.3; t = t_(d); x = np.zeros_like(t)
    for f in [1567.98, 2093.0, 2637.0, 3135.96]:
        x += np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) * (0.6 + 0.4 * np.sin(2 * np.pi * rng.uniform(5, 9) * t))
    return lp(x * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2, 7000)

def crack():
    d = 0.35; x = np.zeros(int(d * SR))
    for k in range(9):
        s = int((0.02 + 0.03 * k + rng.uniform(0, 0.02)) * SR); c = hp(noise(0.006), 2500) * np.exp(-t_(0.006) * 600)
        x[s:s + len(c)] += c * rng.uniform(.3, 1)
    return x + 0.25 * glass()[: len(x)] * np.exp(-t_(d) * 8)

def click():
    x = np.zeros(int(0.25 * SR))
    for o, a in [(0, 1), (0.07, 0.6)]:
        tt = t_(0.03); c = (np.sin(2 * np.pi * 3200 * tt) + .5 * np.sin(2 * np.pi * 5100 * tt)) * np.exp(-tt * 260)
        s = int(o * SR); x[s:s + len(c)] += a * c
    return x

def tick():
    tt = t_(0.05); return (np.sin(2 * np.pi * 2600 * tt) + hp(noise(0.05), 4000) * .3) * np.exp(-tt * 180)

def drip():
    tt = t_(0.18); f = 700 + 900 * np.exp(-tt * 40)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(0.18, 0.002, None, 10)


# ------------------------------------------------------------------------------------- music
NOTE = {n: i for i, n in enumerate("C C# D D# E F F# G G# A A# B".split())}
def hz(name, octv): return 440 * 2 ** ((NOTE[name] + 12 * (octv + 1) - 69) / 12)

def pluck(f, d=1.2, bright=1.0):
    t = t_(d)
    x = (np.sin(2 * np.pi * f * t) * np.exp(-3.2 * t) + 0.35 * bright * np.sin(2 * np.pi * 4 * f * t) * np.exp(-14 * t)
         + 0.08 * bright * np.sin(2 * np.pi * 9.9 * f * t) * np.exp(-30 * t))
    return x * np.minimum(1, t / 0.003)

def pad(freqs, d):
    t = t_(d); x = np.zeros_like(t)
    for f in freqs:
        for det in (-0.12, 0.12):
            x += signal.sawtooth(2 * np.pi * f * (1 + det / 100) * t + rng.uniform(0, 6))
    x = lp(x, 900, 2) / (2 * len(freqs))
    a = min(0.8, d / 3)
    return x * np.minimum(1, np.minimum(t / a, (d - t) / a))

def music(chords, bpm, bars, pattern, out_name, bright=1.0, pulse=False, heart_every=0):
    beat = 60 / bpm; bar = 4 * beat; total = bars * bar + 2
    L = np.zeros(int(total * SR)); R = np.zeros_like(L)
    def add(buf, x, t0, g):
        s = int(t0 * SR); e = min(len(buf), s + len(x)); buf[s:e] += g * x[: e - s]
    hb = heartbeat()
    for b in range(bars):
        root, tones = chords[b % len(chords)]
        t0 = b * bar
        p = pad([hz(n, o) for n, o in tones], bar + 0.6)
        add(L, p, t0, 0.20); add(R, p, t0, 0.20)
        add(L, pluck(hz(root, 2), 2.0, 0.4), t0, 0.35); add(R, pluck(hz(root, 2), 2.0, 0.4), t0, 0.35)
        for k, idx in enumerate(pattern):                  # eighth notes
            if idx is None: continue
            n, o = tones[idx % len(tones)]
            x = pluck(hz(n, o + 1 + idx // len(tones)), 1.1, bright)
            g = 0.22 if k % 2 == 0 else 0.15
            add(L, x, t0 + k * beat / 2, g * (1.0 if k % 4 < 2 else 0.8))
            add(R, x, t0 + k * beat / 2 + 0.012, g * (0.8 if k % 4 < 2 else 1.0))
        if pulse:
            for k in range(4):
                x = pluck(hz(root, 1), 0.5, 0.2)
                add(L, x, t0 + k * beat, 0.12); add(R, x, t0 + k * beat, 0.12)
        if heart_every and b % heart_every == 0:
            add(L, hb, t0, 0.25); add(R, hb, t0, 0.25)
    st = np.stack([reverb(L, mix=0.25, seed=1), reverb(R, mix=0.25, seed=2)], 1)
    st = norm(st, -3)
    os.makedirs(os.path.join(OUT, "music"), exist_ok=True)
    wav = os.path.join(OUT, "music", out_name + ".wav")
    sf.write(wav, st.astype(np.float32), SR)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-af", "loudnorm=I=-20:TP=-2", "-ar", "48000",
                    "-b:a", "192k", wav[:-4] + ".mp3"], check=True)
    os.remove(wav)


if __name__ == "__main__":
    for name, fn, db in [("heartbeat", heartbeat, -3), ("pop", pop, -6), ("paper", paper, -8), ("scribble", scribble, -9),
                         ("whoosh", whoosh, -6), ("glass", glass, -10), ("ding", ding, -8), ("bubbles", bubbles, -8),
                         ("shimmer", shimmer, -10), ("crack", crack, -10), ("click", click, -6), ("tick", tick, -8),
                         ("drip", drip, -8)]:
        save(name, fn(), db)
    # 1) curiosity (hook -> explanation): C major / A minor colour, 88 BPM, questioning motif
    music([("C", [("C", 3), ("E", 3), ("G", 3), ("B", 3)]), ("A", [("A", 2), ("C", 3), ("E", 3), ("G", 3)]),
           ("F", [("F", 2), ("A", 2), ("C", 3), ("E", 3)]), ("G", [("G", 2), ("B", 2), ("D", 3), ("F", 3)])],
          88, 48, [0, None, 2, 1, 3, None, 2, None], "curiosity")
    # 2) calm tension (resistance + numbers): A minor, sparse, low pulse, faint heartbeat every 2 bars
    music([("A", [("A", 2), ("C", 3), ("E", 3)]), ("F", [("F", 2), ("A", 2), ("C", 3)]),
           ("D", [("D", 3), ("F", 3), ("A", 3)]), ("E", [("E", 2), ("G#", 2), ("B", 2)])],
          84, 24, [0, None, None, 2, None, 1, None, None], "tension", bright=0.6, pulse=True, heart_every=2)
    # 3) warm hope (ending): F - C - G - Am, brighter plucks
    music([("F", [("F", 2), ("A", 2), ("C", 3), ("E", 3)]), ("C", [("C", 3), ("E", 3), ("G", 3)]),
           ("G", [("G", 2), ("B", 2), ("D", 3)]), ("A", [("A", 2), ("C", 3), ("E", 3)])],
          90, 20, [0, 1, 2, None, 3, 2, 1, None], "hope", bright=1.2)
    with open(os.path.join(OUT, "licenses.txt"), "w", encoding="utf-8") as f:
        f.write("All files in sfx/ and music/ were synthesised from scratch with numpy/scipy by\n"
                "nabd_project/tools/audio/make_audio.py (no samples, no third-party audio).\n"
                "Owner: Nabd channel. Licence: proprietary, free for any commercial use by the channel.\n"
                "Voice: VoiceTut-TTS (Apache-2.0, mohammedaly22/VoiceTut-TTS, base k2-fsa/OmniVoice Apache-2.0).\n"
                "Font: IBM Plex Sans Arabic (SIL OFL 1.1, see public/fonts/OFL.txt).\n")
    print("ok")
