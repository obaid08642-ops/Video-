"""
faster-whisper large-v3 (MIT, CPU int8) transcript with word times.

    python -I transcribe.py IN.wav OUT.json [INITIAL_PROMPT]
    python -I transcribe.py IN.wav OUT.json --clips "a-b,c-d"     # each clip alone (0.5 s padding), no context

Notes: writes numbers as digits («1992»), sometimes guesses years wrong, and may hallucinate
«شكراً للمشاهدة» over long silence. Check names/numbers per clip + with align.score().
"""
import json, os, sys
import numpy as np, librosa
from faster_whisper import WhisperModel

src, out = sys.argv[1], sys.argv[2]
clips = sys.argv[sys.argv.index("--clips") + 1] if "--clips" in sys.argv else None
prompt = sys.argv[3] if len(sys.argv) > 3 and not clips else None
y, _ = librosa.load(src, sr=16000, mono=True)
m = WhisperModel("large-v3", device="cpu", compute_type="int8",
                 download_root=os.path.join(os.environ.get("NABD_MODELS", "/opt/nabd"), "whisper"), cpu_threads=4)
kw = dict(language="ar", beam_size=5, condition_on_previous_text=False, temperature=0.0)
res = []
if clips:
    for c in clips.split(","):
        a, b = map(float, c.split("-"))
        seg = np.concatenate([np.zeros(8000), y[int(a * 16000):int(b * 16000)], np.zeros(8000)])
        text = " ".join(s.text.strip() for s in m.transcribe(seg, **kw)[0])
        res.append(dict(start=a, end=b, text=text)); print(f"[{a:.2f}-{b:.2f}] {text}", flush=True)
else:
    for s in m.transcribe(y, word_timestamps=True, vad_filter=False, initial_prompt=prompt, **kw)[0]:
        res.append(dict(start=s.start, end=s.end, text=s.text,
                        words=[dict(w=w.word.strip(), start=w.start, end=w.end, p=round(w.probability, 3)) for w in s.words]))
        print(f"[{s.start:7.2f}-{s.end:7.2f}] {s.text}", flush=True)
json.dump(res, open(out, "w"), ensure_ascii=False, indent=1)
