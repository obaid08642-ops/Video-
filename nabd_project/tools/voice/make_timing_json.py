"""
Build the video timing JSON (same format as tools/voice/gen_episode.py) for a recorded voice.

    python -I make_timing_json.py TRANSCRIPT.txt WORDS_OUT.json AUDIO_NAME DURATION OUT.json

TRANSCRIPT: "## N" scene headers, one line per sentence, punctuation and **keywords**; its words must be
exactly the kept words of the edit (checked, word by word).
"""
import json, re, sys
TR, WO, AUDIO, DUR, OUT = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]), sys.argv[5]
W = json.load(open(WO, encoding="utf-8"))

lines, scene, n = [], 0, 0
for raw in open(TR, encoding="utf-8"):
    raw = raw.strip()
    if not raw or raw.startswith("# "): continue
    if raw.startswith("##"): scene = int(raw[2:]); n = 0; continue
    n += 1
    toks, kw = [], False
    for tok in re.findall(r"\*\*|[^\s*]+", raw):
        if tok == "**": kw = not kw; continue
        m = re.match(r"^(.*?)([.…؟?:،,!]*)$", tok); w, p = m.group(1), m.group(2)
        if not w:
            if toks: toks[-1]["punct"] += p
            continue
        toks.append(dict(w=w, punct=p, kw=kw, tags=[]))
    # keywords spanning "**a b**" are handled by the toggle; strip stray ** inside tokens
    lines.append(dict(id=f"s{scene}l{n}", scene=scene, raw=re.sub(r"\*\*", "", raw), words=toks))

flat = [t for l in lines for t in l["words"]]
assert len(flat) == len(W), f"transcript has {len(flat)} words, audio has {len(W)}"
for t, w in zip(flat, W):
    assert t["w"] == w["w"], f"word mismatch: transcript «{t['w']}» vs audio «{w['w']}» at {w['start']}"
    assert lines and True
    t["start"], t["end"] = round(w["start"], 3), round(w["end"], 3)
for l in lines:
    l["start"], l["end"] = l["words"][0]["start"], l["words"][-1]["end"]
    assert len({w2["scene"] for w2 in W if l["start"] <= w2["start"] <= l["end"]}) == 1
scenes = {}
for l in lines:
    s = scenes.setdefault(l["scene"], dict(id=l["scene"], start=l["start"], end=l["end"])); s["end"] = l["end"]
json.dump(dict(voice="recording", audio=AUDIO, duration=round(DUR, 3), sampleRate=48000, pauseScale=1.0,
               scenes=list(scenes.values()), lines=lines), open(OUT, "w"), ensure_ascii=False, indent=1)
print(f"{len(lines)} lines, {len(flat)} words, {len(scenes)} scenes -> {OUT}")
