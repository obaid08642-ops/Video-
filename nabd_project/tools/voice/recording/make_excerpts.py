import re, subprocess
OUTD = "/home/user/Video-/out/voice_edit"
import json
_w = [w for w in json.load(open("/opt/nabd/edit/words_out.json")) if w["w"] == "ماتت"][0]
E, S = round(_w["end"] + 0.10, 2), round(_w["src_end"] + 0.10, 2)   # end of the sentence "...اللي حواليه ماتت"
print("excerpt: edited 0 ->", E, "s | original 0 ->", S, "s")
names = {"A": "02_A_natural", "B": "03_B_warm", "C": "04_C_warm_lower_half_semitone"}

def run(*a):
    return subprocess.run(a, check=True, capture_output=True, text=True)

def lufs(p):
    m = run("ffmpeg", "-hide_banner", "-nostats", "-i", p, "-af", "ebur128", "-f", "null", "-").stderr
    return float(re.search(r"I:\s+(-?[\d.]+) LUFS", m[m.rfind("Summary"):]).group(1))

for v, n in names.items():
    run("ffmpeg", "-v", "error", "-y", "-i", f"/opt/nabd/edit/master/voice_{v}.wav", "-t", str(E),
        "-af", f"afade=t=out:st={E - 0.03}:d=0.03", "-c:a", "pcm_s24le", f"{OUTD}/{n}.wav")

seg = "/opt/nabd/edit/orig_seg.wav"
run("ffmpeg", "-v", "error", "-y", "-i", "/opt/nabd/edit/raw.wav", "-t", str(S), "-c:a", "pcm_f32le", seg)
ia, io = lufs(f"{OUTD}/02_A_natural.wav"), lufs(seg)
g = round(ia - io, 2)
print(f"A excerpt {ia} LUFS, original excerpt {io} LUFS -> gain {g} dB (gain + peak limiter only)")
for _ in range(4):
    run("ffmpeg", "-v", "error", "-y", "-i", seg, "-af",
        f"volume={g}dB,aresample=192000,alimiter=limit=0.84:attack=1:release=60:level=false,aresample=48000:resampler=soxr,"
        f"afade=t=out:st={S - 0.03}:d=0.03", "-c:a", "pcm_s24le", f"{OUTD}/01_original_level_matched.wav")
    got = lufs(f"{OUTD}/01_original_level_matched.wav")
    if abs(got - ia) <= 0.2: break
    g += ia - got
print("original excerpt now", got, "LUFS (A excerpt", ia, ")")
