"""
Force-align a verbatim transcript (same format as edit_recording.py) and print every line's span and its
low-confidence words; writes $NABD_ALIGN_DIR/aligned.json. Use it to find attempts, asides and words to re-check.

    NABD_ALIGN_DIR=/work/epXX python -I align_verbatim.py VERBATIM.txt [ALIGN_END_S]
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from align import align, DT  # noqa: E402

words, lines, line = [], [], -1
for raw in open(sys.argv[1], encoding="utf-8"):
    raw = raw.strip()
    if not raw or raw.startswith("# ") or raw.startswith("##"): continue
    line += 1; lines.append(raw); rm = False
    for tok in raw.lstrip("!").split():
        if tok.startswith("["): rm = True
        words.append(dict(w=tok.strip("[]"), line=line, remove=rm))
        if tok.endswith("]"): rm = False
f1 = int(float(sys.argv[2]) / DT) if len(sys.argv) > 2 else None
res, _ = align([w["w"] for w in words], 0, f1)
for w, (_, a, b, c) in zip(words, res): w.update(start=a, end=b, conf=c)
json.dump(words, open(os.path.join(os.environ.get("NABD_ALIGN_DIR", "."), "aligned.json"), "w"), ensure_ascii=False, indent=0)
for i, l in enumerate(lines):
    ws = [w for w in words if w["line"] == i]
    low = [f"{w['w']}({w['conf']:.1f})" for w in ws if w["conf"] is not None and w["conf"] < -3]
    print(f"{i:2d} {ws[0]['start']:7.2f}-{ws[-1]['end']:7.2f} {'X' if ws[0]['remove'] else ' '} {l[:50]} | {' '.join(low)}")
