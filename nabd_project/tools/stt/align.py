"""
CTC forced alignment of a known word list on the logits of ONE recording + hypothesis scoring.
The logits folder is $NABD_ALIGN_DIR (must hold logits.npy + ctc_greedy.json of THAT input file;
using another file's logits silently misaligns everything). Used by tools/voice/edit_recording.py.
"""
import json, os, re
import numpy as np, torch, torchaudio.functional as F

_D = os.environ.get("NABD_ALIGN_DIR", ".")
_M = os.path.join(os.environ.get("NABD_MODELS", "/opt/nabd"), "w2v")
LP = torch.from_numpy(np.load(os.path.join(_D, "logits.npy")))
VOC = json.load(open(os.path.join(_M, "vocab.json")))
DT = json.load(open(os.path.join(_D, "ctc_greedy.json")))["dt"]
DIAC = re.compile(r"[ً-ْٰـ]")


def chars(word):
    """letters the model knows; Latin words (e.g. FDA) have none -> write them as spoken Arabic in the verbatim"""
    w = DIAC.sub("", word)
    return [VOC[c] for c in w if c in VOC and c not in "|-"]


def tokens(words):
    ids, owner = [], []
    for i, w in enumerate(words):
        if ids: ids.append(VOC["|"]); owner.append(-1)
        for c in chars(w): ids.append(c); owner.append(i)
    return ids, owner


def align(words, f0=0, f1=None):
    """-> [(word, start_s, end_s, mean_logprob)], total score"""
    lp = LP[f0:f1] if f1 else LP[f0:]
    ids, owner = tokens(words)
    al, sc = F.forced_align(lp.unsqueeze(0), torch.tensor([ids], dtype=torch.int32), blank=0)
    al, sc = al[0].numpy(), sc[0].numpy()
    spans = F.merge_tokens(torch.from_numpy(al), torch.from_numpy(sc))
    out = [[None, None, []] for _ in words]; k = 0
    for sp in spans:
        while k < len(ids) and ids[k] != sp.token: k += 1
        if k >= len(ids): break
        o = owner[k]
        if o >= 0:
            if out[o][0] is None: out[o][0] = sp.start
            out[o][1] = sp.end; out[o][2].append(float(sp.score))
        k += 1
    return [(w, (f0 + a) * DT, (f0 + b) * DT, float(np.mean(s)) if s else None) for w, (a, b, s) in zip(words, out)], float(sc.sum())


def score(words, t0, t1):
    """total forced-alignment log-prob of `words` inside [t0, t1] s: compare competing hypotheses on the SAME window"""
    lp = LP[int(t0 / DT): int(t1 / DT)]
    ids, _ = tokens(words)
    _, sc = F.forced_align(lp.unsqueeze(0), torch.tensor([ids], dtype=torch.int32), blank=0)
    return float(sc.sum())
