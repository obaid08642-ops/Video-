"""Publish a finished voice for Remotion: public/voice/NAME.flac (lossless, 24-bit) + NAME_timing.json (audio field set).

    python -I publish_voice.py NAME VOICE.wav TIMING.json        e.g.  ep04_long fin/voice_final.wav gs/timing.json
FLAC keeps the repo small (a 9-minute float WAV is ~100 MB, over GitHub's file limit). public/voice/ep04_*.flac is git-ignored
(re-created from out/voice/epXX/ by this script); the timing JSON is committed.
"""
import json, os, subprocess, sys
name, wav, tj = sys.argv[1:4]
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "video", "public", "voice")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-c:a", "flac", "-sample_fmt", "s32", "-bits_per_raw_sample", "24", f"{D}/{name}.flac"], check=True)
T = json.load(open(tj, encoding="utf-8")); T["audio"] = f"{name}.flac"; T["voice"] = name
json.dump(T, open(f"{D}/{name}_timing.json", "w", encoding="utf-8"), ensure_ascii=False)
print(name, T["duration"])
