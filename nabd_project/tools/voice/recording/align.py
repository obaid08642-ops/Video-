"""CTC forced alignment (wav2vec2 Arabic, Apache-2.0) of a verbatim transcript + local hypothesis scoring."""
import json, re, sys
import numpy as np, torch, torchaudio.functional as F

LP = torch.from_numpy(np.load("/opt/nabd/edit/logits.npy"))  # [T, V] log-probs
VOC = json.load(open("/opt/nabd/w2v/vocab.json"))
DT = json.load(open("/opt/nabd/edit/ctc_greedy.json"))["dt"]
DIAC = re.compile(r"[ً-ْٰـ]")


def chars(word):
    w = DIAC.sub("", word)
    return [VOC[c] for c in w if c in VOC and c not in "|-"]


def tokens(words):
    ids, owner = [], []
    for i, w in enumerate(words):
        if ids:
            ids.append(VOC["|"]); owner.append(-1)
        for c in chars(w):
            ids.append(c); owner.append(i)
    return ids, owner


def align(words, f0=0, f1=None):
    """-> list of (word, start_s, end_s, mean_logprob) and total path score"""
    lp = LP[f0:f1] if f1 else LP[f0:]
    ids, owner = tokens(words)
    tg = torch.tensor([ids], dtype=torch.int32)
    al, sc = F.forced_align(lp.unsqueeze(0), tg, blank=0)
    al, sc = al[0].numpy(), sc[0].numpy()
    # map frames to token index
    spans = F.merge_tokens(torch.from_numpy(al), torch.from_numpy(sc))
    out = [[None, None, []] for _ in words]
    k = 0
    for sp in spans:
        while k < len(ids) and ids[k] != sp.token:
            k += 1
        if k >= len(ids):
            break
        o = owner[k]
        if o >= 0:
            if out[o][0] is None:
                out[o][0] = sp.start
            out[o][1] = sp.end
            out[o][2].append(float(sp.score))
        k += 1
    res = [(w, (f0 + a) * DT, (f0 + b) * DT, float(np.mean(s)) if s else None) for w, (a, b, s) in zip(words, out)]
    return res, float(sc.sum())


def score(words, t0, t1):
    """total forced-alignment log-prob of `words` inside [t0, t1] seconds (comparable across hypotheses)"""
    f0, f1 = int(t0 / DT), int(t1 / DT)
    lp = LP[f0:f1]
    ids, _ = tokens(words)
    tg = torch.tensor([ids], dtype=torch.int32)
    _, sc = F.forced_align(lp.unsqueeze(0), tg, blank=0)
    return float(sc.sum())
