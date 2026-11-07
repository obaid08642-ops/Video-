"""
wav2vec2 Arabic CTC over a whole recording -> per-frame log-probs (20 ms) + a greedy verbatim word list.
The greedy text exposes stutters, restarts and asides that Whisper tends to "clean up".

    python -I ctc_logits.py RAW.wav OUT_DIR [MODEL_DIR=$NABD_MODELS/w2v]

Writes OUT_DIR/logits.npy and OUT_DIR/ctc_greedy.json ({dt, words:[{w,start,end}]}).
Model: jonatasgrosman/wav2vec2-large-xlsr-53-arabic (Apache-2.0). Note: it hears the Egyptian ج (g) as «ك».
"""
import json, os, sys
import numpy as np, torch, librosa
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

RAW, OUT = sys.argv[1], sys.argv[2]
M = sys.argv[3] if len(sys.argv) > 3 else os.path.join(os.environ.get("NABD_MODELS", "/opt/nabd"), "w2v")
torch.set_num_threads(int(os.environ.get("NABD_THREADS", "4")))
os.makedirs(OUT, exist_ok=True)
proc = Wav2Vec2Processor.from_pretrained(M); model = Wav2Vec2ForCTC.from_pretrained(M).eval()
y, sr = librosa.load(RAW, sr=16000, mono=True)
CH, CTX = 20 * sr, 2 * sr          # 20 s chunks with 2 s context on each side
out = []
with torch.inference_mode():
    for s in range(0, len(y), CH):
        a, b = max(0, s - CTX), min(len(y), s + CH + CTX)
        x = proc(y[a:b], sampling_rate=sr, return_tensors="pt").input_values
        lp = torch.log_softmax(model(x).logits[0], -1).numpy()
        fps = lp.shape[0] / ((b - a) / sr)
        i0 = int(round((s - a) / sr * fps)); i1 = i0 + int(round(min(CH, len(y) - s) / sr * fps))
        out.append(lp[i0:i1])
lp = np.concatenate(out); np.save(os.path.join(OUT, "logits.npy"), lp)
vocab = {v: k for k, v in proc.tokenizer.get_vocab().items()}
dt = len(y) / sr / lp.shape[0]
ids = lp.argmax(-1); words, cur, t0, prev, tend = [], "", None, -1, 0
for i, k in enumerate(ids):
    if k != prev and k != 0:
        ch = vocab[int(k)]
        if ch == "|":
            if cur: words.append(dict(w=cur, start=round(t0, 2), end=round(tend, 2))); cur, t0 = "", None
        else:
            if t0 is None: t0 = i * dt
            cur += ch; tend = i * dt
    prev = k
if cur: words.append(dict(w=cur, start=round(t0, 2), end=round(tend, 2)))
json.dump(dict(dt=dt, words=words), open(os.path.join(OUT, "ctc_greedy.json"), "w"), ensure_ascii=False, indent=0)
print(f"frames {lp.shape} dt {dt:.5f} words {len(words)}")
