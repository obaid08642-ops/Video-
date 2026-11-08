"""
«مقلب الفلفل» (Chili prank): 25 s vertical short built from 6 still images (Pixar-style 3D frames) with code-made animation:
camera moves, squash/stretch, chewing warp, red face flush, procedural fire / steam / sparkles, whip cuts + a synthesized soundtrack.
usage: python3 make_chili.py OUT.mp4 [--silent-test]       (needs: numpy, opencv-python-headless, ffmpeg)
Images: animals/src/shot1.png shot2..shot6.jpg (same folder as this script).
"""
import math, os, subprocess, sys, wave
import cv2, numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
W, H, FPS = 1080, 1920, 30
SR = 44100
OUT = sys.argv[1] if len(sys.argv) > 1 else "chili.mp4"
rng = np.random.default_rng(5)

def load(n):
    for e in ("png", "jpg"):
        p = f"{HERE}/src/shot{n}.{e}"
        if os.path.exists(p): return cv2.imread(p)
IM = {i: load(i) for i in range(1, 7)}

ease = lambda x: x * x * (3 - 2 * x) if 0 <= x <= 1 else (0.0 if x < 0 else 1.0)
lerp = lambda a, b, t: a + (b - a) * t
clamp01 = lambda x: max(0.0, min(1.0, x))
def seg(t, a, b): return clamp01((t - a) / (b - a))

# ------------------------------------------------------------------ shot timeline (seconds)
CUTS = [0, 4.0, 9.0, 13.0, 17.0, 21.0, 25.0]
DUR = CUTS[-1]

# ------------------------------------------------------------------ camera
class Cam:
    def __init__(s, im, cx, cy, z, rot=0, shake=(0, 0)):
        h, w = im.shape[:2]; base = max(W / w, H / h); sc = base * z
        hw, hh = W / 2 / sc, H / 2 / sc
        cx = min(max(cx, hw), w - hw); cy = min(max(cy, hh), h - hh)
        a = math.radians(rot); c, sn = math.cos(a) * sc, math.sin(a) * sc
        tx = W / 2 - (c * cx - sn * cy) + shake[0]; ty = H / 2 - (sn * cx + c * cy) + shake[1]
        s.M = np.array([[c, -sn, tx], [sn, c, ty]], np.float32); s.sc = sc
    def pt(s, x, y): return (s.M[0, 0] * x + s.M[0, 1] * y + s.M[0, 2], s.M[1, 0] * x + s.M[1, 1] * y + s.M[1, 2])
    def render(s, im): return cv2.warpAffine(im, s.M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)

def shake(t, amp, f=22):
    return (amp * math.sin(t * f * 2.1) * math.cos(t * f * 0.7), amp * 0.8 * math.cos(t * f * 1.7))

# ------------------------------------------------------------------ source-space effects
def flush(im, cx, cy, rx, ry, amount, rise=1.0):
    """red face flush: ellipse mask, the colour climbs from the bottom (rise 0..1)"""
    if amount <= 0: return im
    h, w = im.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    m = np.exp(-(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2) * 1.3)
    front = cy + ry * (1 - 2 * rise)
    m *= np.clip((yy - front) / (ry * 0.5 + 1) * -1 + 1, 0, 1) if rise < 1 else 1
    m = (m * amount)[..., None]
    t = im.astype(np.float32); red = t * np.array([0.45, 0.55, 1.25], np.float32) + np.array([0, 0, 25], np.float32)
    return np.clip(t * (1 - m) + red * m, 0, 255).astype(np.uint8)

def chew(im, x0, y0, sig, amp, f, t):
    """vertical sinusoidal wobble around a point (chewing / jaw)"""
    h, w = im.shape[:2]
    x1, x2, y1, y2 = int(max(0, x0 - 3 * sig)), int(min(w, x0 + 3 * sig)), int(max(0, y0 - 3 * sig)), int(min(h, y0 + 3 * sig))
    yy, xx = np.mgrid[y1:y2, x1:x2].astype(np.float32)
    d = amp * math.sin(2 * math.pi * f * t) * np.exp(-((xx - x0) ** 2 + (yy - y0) ** 2) / (2 * sig ** 2))
    out = im.copy(); out[y1:y2, x1:x2] = cv2.remap(im, xx, yy - d, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
    return out

def squash(im, cy_ground, k):
    """squash & stretch about a ground line (k>1 stretch up)"""
    h, w = im.shape[:2]
    M = np.array([[1 / k ** 0.5, 0, w / 2 * (1 - 1 / k ** 0.5)], [0, k, cy_ground * (1 - k)]], np.float32)
    return cv2.warpAffine(im, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)

# ------------------------------------------------------------------ screen-space particles
class Particles:
    def __init__(s, kind): s.kind, s.p = kind, []
    def emit(s, x, y, n, t, spread=40, up=520, size=34, life=0.7, vx=0):
        for _ in range(n):
            s.p.append(dict(x=x + rng.normal(0, spread * 0.25), y=y, vx=vx + rng.normal(0, spread), vy=-up * rng.uniform(0.6, 1.2), t0=t, life=life * rng.uniform(0.7, 1.3), r=size * rng.uniform(0.7, 1.3)))
    def draw(s, frame, t, dt):
        keep = []
        small = np.zeros((H // 2, W // 2, 3), np.float32); alpha = np.zeros((H // 2, W // 2), np.float32)
        for q in s.p:
            a = (t - q["t0"]) / q["life"]
            if a >= 1: continue
            keep.append(q)
            q["x"] += q["vx"] * dt; q["y"] += q["vy"] * dt; q["vy"] *= (0.985 if s.kind == "fire" else 0.97)
            r = q["r"] * (1 - 0.55 * a if s.kind == "fire" else 0.7 + 1.1 * a) / 2
            if s.kind == "fire":
                col = np.array([lerp(120, 40, a), lerp(255, 90, a), lerp(255, 255 - 40, a)]) * (1 - a * 0.6) * 0.9   # BGR: yellow-white -> orange -> red
                col = np.array([lerp(200, 20, a), lerp(235, 80, a * a + a * 0.3), 255 * (1 - 0.35 * a)]) * (1 - 0.7 * a ** 2)
                cv2.circle(small, (int(q["x"] / 2), int(q["y"] / 2)), max(1, int(r)), col.tolist(), -1)
            else:
                cv2.circle(alpha, (int(q["x"] / 2), int(q["y"] / 2)), max(1, int(r)), float(0.42 * (1 - a)), -1)
        s.p = keep
        if s.kind == "fire" and keep:
            g = cv2.GaussianBlur(small, (0, 0), 9); g = cv2.resize(g, (W, H), interpolation=cv2.INTER_LINEAR)
            frame[:] = np.clip(frame.astype(np.float32) + g * 1.25, 0, 255).astype(np.uint8)
        elif keep:
            g = cv2.resize(cv2.GaussianBlur(alpha, (0, 0), 7), (W, H))[..., None]
            frame[:] = (frame * (1 - g) + np.array([238, 238, 242], np.float32) * g).astype(np.uint8)

def sparkle(frame, x, y, r, a=1.0, rot=0):
    if a <= 0.02: return
    ov = np.zeros((H, W, 3), np.float32)
    for k in range(2):
        ang = rot + k * math.pi / 4; L = r * (1 if k == 0 else 0.6)
        p = np.array([[x + L * math.cos(ang), y + L * math.sin(ang)], [x + r * 0.13 * math.cos(ang + math.pi / 2), y + r * 0.13 * math.sin(ang + math.pi / 2)],
                      [x - L * math.cos(ang), y - L * math.sin(ang)], [x - r * 0.13 * math.cos(ang + math.pi / 2), y - r * 0.13 * math.sin(ang + math.pi / 2)]], np.int32)
        cv2.fillPoly(ov, [p], (200, 245, 255))
    ov = cv2.GaussianBlur(ov, (0, 0), 3)
    frame[:] = np.clip(frame.astype(np.float32) + ov * 1.6 * a, 0, 255).astype(np.uint8)

# ------------------------------------------------------------------ the 6 shots: (image, camera, effects) per local time
FIRE, STEAM = Particles("fire"), Particles("steam")
def shot(n, t, dt):
    """returns the frame for shot n at local time t"""
    im = IM[n]; h, w = im.shape[:2]
    if n == 1:
        bite = seg(t, 0.55, 0.75); frz = seg(t, 0.95, 1.1)
        sq = 1 + 0.045 * math.sin(bite * math.pi) * (1 - frz) - 0.03 * frz * math.exp(-(t - 1.0) * 4) * (t > 1.0)
        img = squash(im, h * 0.92, sq)
        img = flush(img, 380, 440, 250, 260, ease(seg(t, 1.0, 2.2)), rise=ease(seg(t, 1.0, 2.2)))
        z = lerp(1.0, 1.22, ease(seg(t, 0, 1.0))) + 0.30 * ease(seg(t, 1.0, 1.18)) * (1 - 0.35 * seg(t, 1.2, 4))
        cam = Cam(img, 380, 520, z, rot=1.2 * math.sin(t * 40) * seg(t, 1.0, 2.4) * 0.5, shake=shake(t, 14 * seg(t, 1.05, 2.8) + 6 * (0.55 < t < 0.8), 26))
        fr = cam.render(img)
        for ex in (185, 585):
            if 1.5 < t < 3.9 and rng.random() < 0.6: STEAM.emit(*cam.pt(ex, 330), 2, t + CUTS[n - 1], spread=30, up=360, size=46, life=1.1)
        if 2.3 < t < 3.9 and rng.random() < 0.5: FIRE.emit(*cam.pt(370, 600), 3, t + CUTS[n - 1], spread=70, up=380, size=26, life=0.45)
        return fr, cam
    if n == 2:
        z = lerp(1.05, 1.5, ease(seg(t, 0, 2.0)))
        cx, cy = lerp(330, 330, 0), 560
        if t > 2.2: cx, cy, z = lerp(330, 540, ease(seg(t, 2.2, 3.0))), lerp(560, 880, ease(seg(t, 2.2, 3.0))), lerp(1.5, 1.35, ease(seg(t, 2.2, 3.0)))
        if t > 3.9: cx, cy, z = lerp(540, 380, ease(seg(t, 3.9, 4.8))), lerp(880, 600, ease(seg(t, 3.9, 4.8))), lerp(1.35, 1.7, ease(seg(t, 3.9, 4.8)))
        cam = Cam(im, cx, cy, z, rot=1.2 * math.sin(t * 2.2), shake=(0, 5 * math.sin(t * 9)))
        fr = cam.render(im)
        sparkle(fr, *cam.pt(420, 600), 90 * cam.sc / 1.4, a=ease(seg(t, 4.5, 4.62)) * (1 - ease(seg(t, 4.75, 4.95))), rot=t * 3)
        return fr, cam
    if n == 3:                                    # landscape: horizontal pan following the rabbit hop, then to the beaver
        cx = lerp(470, 560, ease(seg(t, 0, 1.6))); cx = lerp(cx, 930, ease(seg(t, 1.8, 3.6)))
        hop = -70 * abs(math.sin(t * 5.2)) * (1 - seg(t, 1.5, 2.2))
        cam = Cam(im, cx, 384, 1.0, rot=1.5 * math.sin(t * 2.5), shake=(0, hop))
        return cam.render(im), cam
    if n == 4:
        img = chew(im, 470, 640, 80, 9, 4.2, t) if t < 2.0 else im
        img = chew(img, 240, 1160, 90, 16 * math.exp(-(t - 2.0) * 1.5), 6, t) if t > 2.0 else img
        if t < 2.0: cx, cy, z = lerp(360, 400, ease(seg(t, 0, 2.0))), lerp(620, 640, ease(seg(t, 0, 2.0))), lerp(1.15, 1.55, ease(seg(t, 0, 2.0)))
        else: cx, cy, z = lerp(400, 260, ease(seg(t, 2.0, 2.5))), lerp(640, 1020, ease(seg(t, 2.0, 2.5))), lerp(1.55, 1.3, ease(seg(t, 2.0, 2.5)))
        cam = Cam(img, cx, cy, z, shake=shake(t, 12 * seg(t, 2.0, 2.2) * (1 - seg(t, 2.2, 3.6)), 30))
        return cam.render(img), cam
    if n == 5:
        gulp = seg(t, 0.7, 1.5); frz = seg(t, 1.55, 1.7); ign = seg(t, 2.0, 2.25)
        img = flush(im, 270, 700, 330, 520, ease(seg(t, 1.6, 2.6)), rise=ease(seg(t, 1.6, 2.6)))
        img = squash(img, h * 0.8, 1 + 0.03 * math.sin(gulp * math.pi * 3) * (1 - frz))
        z = lerp(1.2, 1.4, ease(seg(t, 0, 1.6))) - 0.28 * ease(seg(t, 2.0, 2.6)) + 0.06 * math.sin(gulp * 12)
        cam = Cam(img, lerp(330, 270, ease(seg(t, 0, 2))), lerp(740, 640, ease(seg(t, 0, 2))), z, shake=shake(t, 20 * seg(t, 2.0, 2.2) * (1 - 0.4 * seg(t, 2.2, 4)), 28))
        fr = cam.render(img)
        if t > 2.0 and t < 3.95: FIRE.emit(*cam.pt(300, 700), 12, t + CUTS[n - 1], spread=55, up=900, size=70, life=0.9)
        return fr, cam
    if n == 6:
        z = lerp(1.0, 1.0, 0) if t < 1.6 else lerp(1.0, 1.9, ease(seg(t, 1.6, 2.6)))
        cx = lerp(384, 600, ease(seg(t, 1.6, 2.6))); cy = lerp(688, 600, ease(seg(t, 1.6, 2.6)))
        bounce = 0.05 * math.exp(-(t - 3.0) * 7) * math.sin((t - 3.0) * 30) * (t > 3.0)
        cam = Cam(im, cx, cy, z + bounce, rot=0.8 * math.sin(t * 2))
        fr = cam.render(im)
        if t < 1.9 or t > 0:
            if rng.random() < 0.55: FIRE.emit(*cam.pt(290, 690), 2, t + CUTS[n - 1], spread=25, up=340, size=26, life=0.5)
        sparkle(fr, *cam.pt(668, 545), 90 * cam.sc / 1.4, a=ease(seg(t, 2.55, 2.65)) * (1 - ease(seg(t, 2.9, 3.2))), rot=t * 2)
        return fr, cam

def grade(fr, t):
    f = fr.astype(np.float32)
    v = 1 - 0.28 * (((np.mgrid[0:H, 0:W][0] / H - 0.5) ** 2 + (np.mgrid[0:H, 0:W][1] / W - 0.5) ** 2) * 2.2)[..., None]
    f *= v
    g = cv2.cvtColor(np.clip(f, 0, 255).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32); g[..., 1] *= 1.1
    return cv2.cvtColor(np.clip(g, 0, 255).astype(np.uint8), cv2.COLOR_HSV2BGR)

# ------------------------------------------------------------------ audio
def audio():
    N = int(DUR * SR); mix = np.zeros(N, np.float32); music = np.zeros(N, np.float32)
    def add(buf, x, t0, g=1.0):
        i = int(t0 * SR); x = x[: max(0, len(buf) - i)]; buf[i:i + len(x)] += x * g
    T = lambda d: np.arange(int(d * SR)) / SR
    def lp(x, fc):  # one-pole low-pass
        a = math.exp(-2 * math.pi * fc / SR); y = np.zeros_like(x); s = 0.0
        for i in range(len(x)): s = a * s + (1 - a) * x[i]; y[i] = s
        return y
    def hp(x, fc): return x - lp(x, fc)
    def wavload(n):
        with wave.open(f"{HERE}/../nabd_project/video/public/audio/sfx/{n}.wav") as w:
            d = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
            if w.getnchannels() > 1: d = d.reshape(-1, w.getnchannels()).mean(1)
            if w.getframerate() != SR:
                d = np.interp(np.arange(0, len(d), w.getframerate() / SR), np.arange(len(d)), d)
            return d
    def crunch():
        out = np.zeros(int(0.32 * SR), np.float32)
        for k, t0 in enumerate((0.0, 0.09, 0.19)):
            n = rng.normal(0, 1, int(0.07 * SR)).astype(np.float32) * np.exp(-T(0.07) * 55)
            out[int(t0 * SR):int(t0 * SR) + len(n)] += hp(n, 1500) * (1 - 0.2 * k)
        return out * 0.9
    def boing(f0=420, d=0.5):
        t = T(d); f = f0 * (1 + 0.5 * np.exp(-t * 9)) ; ph = 2 * np.pi * np.cumsum(f * (1 + 0.04 * np.sin(2 * np.pi * 14 * t))) / SR
        return (np.sin(ph) + 0.4 * np.sin(2 * ph)).astype(np.float32) * np.exp(-t * 6) * 0.5
    def slide(f0, f1, d=0.7):
        t = T(d); f = f0 * (f1 / f0) ** (t / d); ph = 2 * np.pi * np.cumsum(f) / SR
        return np.sin(ph).astype(np.float32) * np.minimum(1, t * 40) * np.exp(-t * 2.5) * 0.45
    def stinger():
        t = T(0.5); f = 900 * np.exp(-t * 4.5); ph = 2 * np.pi * np.cumsum(f) / SR
        n = rng.normal(0, 1, len(t)).astype(np.float32) * np.exp(-t * 18)
        return (np.sin(ph) * np.exp(-t * 6) * 0.5 + hp(n, 800) * 0.35).astype(np.float32)
    def roar(d, g=1.0):
        t = T(d); n = rng.normal(0, 1, len(t)).astype(np.float32)
        low = lp(n, 500) * 4 * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * t))
        crack = np.zeros(len(t), np.float32); idx = rng.integers(0, len(t), int(d * 60)); crack[idx] = rng.uniform(0.4, 1, len(idx)); crack = hp(lp(crack, 6000), 800) * 6
        env = np.minimum(1, t / 0.12) * np.minimum(1, (d - t) / 0.4)
        return ((low + crack * 0.5 + hp(n, 3000) * 0.25) * env * g * 0.5).astype(np.float32)
    def hiss(d):
        t = T(d); n = rng.normal(0, 1, len(t)).astype(np.float32); env = np.minimum(1, t / 0.15) * np.minimum(1, (d - t) / 0.3)
        return hp(lp(n, 9000), 3500) * env * 0.35
    def glug(f=300):
        t = T(0.14); return np.sin(2 * np.pi * np.cumsum(f * (1 + 1.2 * t / 0.14)) / SR).astype(np.float32) * np.exp(-t * 18) * 0.5
    def ding(f=1760):
        t = T(1.2); return ((np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.5 * t)) * np.exp(-t * 3.2) * 0.4).astype(np.float32)
    def pluck(f, d=0.28, g=0.5):
        t = T(d); return ((np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 9) * g).astype(np.float32)
    def mallet(f, d=0.22):
        t = T(d); return ((np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 30)) * np.exp(-t * 11) * 0.4).astype(np.float32)
    def woodblock():
        t = T(0.08); return (np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 60) * 0.3).astype(np.float32)

    whoosh, pop, shim, bump = wavload("whoosh"), wavload("pop"), wavload("shimmer"), wavload("bump")
    # sfx timeline (absolute seconds)
    S = []
    S += [(0.55, crunch(), 1.0), (0.6, boing(520, 0.3), 0.6), (1.02, stinger(), 1.0), (1.55, hiss(2.2), 0.7), (2.4, pop, 0.6), (3.0, pop, 0.5), (3.9, whoosh, 0.9)]
    S += [(4.9, shim, 0.5), (4.52, pop, 0.5), (6.9, whoosh, 0.7), (7.8, shim, 0.5), (8.9, whoosh, 0.9)]
    S += [(9.05, boing(380, 0.6), 0.8), (9.7, bump, 0.5), (10.3, bump, 0.45), (10.8, bump, 0.4), (11.0, whoosh, 0.8), (12.9, whoosh, 0.9)]
    S += [(13.15, crunch(), 1.0), (13.7, crunch(), 0.7), (14.1, pop, 0.8), (14.2, ding(2200), 0.4), (15.0, slide(900, 150, 0.8), 0.9), (15.05, stinger(), 0.8), (16.9, whoosh, 0.9)]
    S += [(17.75 + 0.18 * k, glug(280 - 12 * k), 1.0) for k in range(5)]
    S += [(18.6, stinger(), 1.0), (19.0, hiss(1.0), 0.6), (19.05, roar(1.9, 1.0), 1.0), (19.0, bump, 0.8), (20.9, whoosh, 0.9)]
    S += [(21.05, roar(2.6, 0.45), 0.8), (22.2, hiss(0.9), 0.3), (23.62, ding(1760), 0.9), (23.62, shim, 0.7), (24.35, slide(300, 1500, 0.35), 0.9), (24.62, pop, 1.0)]
    for t0, x, g in S: add(mix, x, t0, g)
    # music: 120 BPM, A minor "sneaky" groove
    beat = 0.5; bass = [110, 0, 110, 165, 0, 131, 0, 147]; mel = [0, 440, 0, 523, 440, 0, 392, 0, 0, 440, 523, 587, 523, 440, 0, 0]
    for b in range(int(DUR / beat)):
        t0 = b * beat; i8 = b % 8
        if bass[i8]: add(music, pluck(bass[i8]), t0, 0.9)
        add(music, woodblock(), t0 + 0.25, 0.5)
        if b % 2 == 0: add(music, woodblock(), t0, 0.35)
        if 4 <= t0 < 24 and mel[b % 16]: add(music, mallet(mel[b % 16]), t0, 0.8)
        if 17 <= t0 < 23 and b % 2: add(music, mallet(mel[(b + 1) % 16] * 2 or 880), t0 + 0.25, 0.4)
    music = music * 0.55 * np.clip(1 - 0.5 * np.exp(-((np.arange(N) / SR - 0) ** 2)), 0, 1)
    out = mix + music; out = np.clip(out / max(1e-6, np.abs(out).max()) * 0.9, -1, 1)
    p = f"{OUT}.wav"
    with wave.open(p, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype(np.int16).tobytes())
    return p

# ------------------------------------------------------------------ render
def main():
    wavp = audio()
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", wavp,
           "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
           "-shortest", "-movflags", "+faststart", OUT]
    pr = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n = int(DUR * FPS); dt = 1 / FPS
    for k in range(n):
        t = k * dt
        s = max(i for i in range(6) if CUTS[i] <= t) + 1; lt = t - CUTS[s - 1]
        fr, cam = shot(s, lt, dt)
        # incoming punch + white whip flash at every cut
        if lt < 0.2 and s > 1:
            fr = cv2.addWeighted(fr, 1, np.full_like(fr, 255), 0.55 * (1 - lt / 0.2) ** 2, 0)
        FIRE.draw(fr, t, dt); STEAM.draw(fr, t, dt)
        if s != 1 and lt < 0.01: FIRE.p.clear() if s in (2, 3, 4) else None
        if s in (5,) and 2.0 < lt < 2.1: fr = cv2.addWeighted(fr, 1, np.full_like(fr, 255), 0.5, 0)     # ignition flash
        if s == 1 and 1.0 < lt < 1.08: fr = cv2.addWeighted(fr, 1, np.full_like(fr, 255), 0.35, 0)
        fr = grade(fr, t)
        if k == n - 1 or t > DUR - 0.5: fr = (fr * clamp01((DUR - t) / 0.5)).astype(np.uint8)   # fade out
        pr.stdin.write(np.ascontiguousarray(fr).tobytes())
    pr.stdin.close(); pr.wait(); os.remove(wavp); print("done", OUT)

if __name__ == "__main__": main()
