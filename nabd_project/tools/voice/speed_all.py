"""
Global speed-up (WSOLA atempo, pitch kept) of a finished edit + the matching timing JSON.
Pick the factor from the duration limit: factor = voice_s / (limit_s - 1.5 logo), capped by the owner's maximum.

    python -I speed_all.py IN.wav TIMING.json FACTOR OUT_DIR    -> OUT_DIR/voice.wav, OUT_DIR/timing.json
"""
import json, subprocess, sys
import soundfile as sf

IN, TJ, F, OUT = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", IN, "-af", f"atempo={F}", "-c:a", "pcm_f32le", f"{OUT}/voice.wav"], check=True)
T = json.load(open(TJ, encoding="utf-8"))
for l in T["lines"]:
    for w in l["words"]: w["start"] = round(w["start"] / F, 3); w["end"] = round(w["end"] / F, 3)
    l["start"], l["end"] = l["words"][0]["start"], l["words"][-1]["end"]
for s in T["scenes"]: s["start"] = round(s["start"] / F, 3); s["end"] = round(s["end"] / F, 3)
T["duration"] = round(sf.info(f"{OUT}/voice.wav").duration, 3); T["global_speed"] = F
json.dump(T, open(f"{OUT}/timing.json", "w"), ensure_ascii=False, indent=1)
print(T["duration"], "+1.5 =", round(T["duration"] + 1.5, 2))
