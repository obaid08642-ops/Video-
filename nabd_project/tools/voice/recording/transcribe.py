import json, sys, librosa
from faster_whisper import WhisperModel
src, out, prompt = sys.argv[1], sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 else None)
y, _ = librosa.load(src, sr=16000, mono=True)
m = WhisperModel("large-v3", device="cpu", compute_type="int8", download_root="/opt/nabd/whisper", cpu_threads=4)
segs, info = m.transcribe(y, language="ar", word_timestamps=True, beam_size=5, vad_filter=False,
                          condition_on_previous_text=False, initial_prompt=prompt, temperature=0.0)
res = []
for s in segs:
    res.append(dict(start=s.start, end=s.end, text=s.text, words=[dict(w=w.word.strip(), start=w.start, end=w.end, p=round(w.probability, 3)) for w in s.words]))
    print(f"[{s.start:7.2f}-{s.end:7.2f}] {s.text}", flush=True)
json.dump(res, open(out, "w"), ensure_ascii=False, indent=1)
