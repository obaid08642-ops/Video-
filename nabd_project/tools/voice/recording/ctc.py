"""wav2vec2 Arabic CTC over the whole file -> logits (20 ms frames) + greedy verbatim words with times."""
import json, numpy as np, torch, librosa
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
torch.set_num_threads(4)
M = "/opt/nabd/w2v"
proc = Wav2Vec2Processor.from_pretrained(M); model = Wav2Vec2ForCTC.from_pretrained(M).eval()
y, sr = librosa.load("/opt/nabd/edit/raw.wav", sr=16000, mono=True)
CH, CTX = 20 * sr, 2 * sr
out = []
with torch.inference_mode():
    for s in range(0, len(y), CH):
        a, b = max(0, s - CTX), min(len(y), s + CH + CTX)
        x = proc(y[a:b], sampling_rate=sr, return_tensors="pt").input_values
        lp = torch.log_softmax(model(x).logits[0], -1).numpy()
        fps = lp.shape[0] / ((b - a) / sr)
        i0 = int(round((s - a) / sr * fps)); i1 = i0 + int(round(min(CH, len(y) - s) / sr * fps))
        out.append(lp[i0:i1])
lp = np.concatenate(out); np.save("/opt/nabd/edit/logits.npy", lp)
vocab = {v: k for k, v in proc.tokenizer.get_vocab().items()}
dt = len(y) / sr / lp.shape[0]
ids = lp.argmax(-1); words, cur, t0, prev = [], "", None, -1
for i, k in enumerate(ids):
    if k != prev and k not in (0,):
        ch = vocab[int(k)]
        if ch == "|":
            if cur: words.append(dict(w=cur, start=round(t0, 2), end=round(i * dt, 2))); cur, t0 = "", None
        else:
            if t0 is None: t0 = i * dt
            cur += ch; tend = i * dt
    prev = k
if cur: words.append(dict(w=cur, start=round(t0, 2), end=round(len(ids) * dt, 2)))
json.dump(dict(dt=dt, words=words), open("/opt/nabd/edit/ctc_greedy.json", "w"), ensure_ascii=False, indent=0)
print("frames", lp.shape, "dt", dt, "words", len(words))
