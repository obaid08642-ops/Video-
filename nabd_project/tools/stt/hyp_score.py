"""
Which wording was actually said? Score competing hypotheses on the same time window (higher = more likely).

    NABD_ALIGN_DIR=/work/epXX python -I hyp_score.py T0 T1 "hypothesis one" "hypothesis two" ...

Tip: for words with ج test the «ك» spelling too (the model hears Egyptian g as k); confirm names with Whisper per clip.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from align import score  # noqa: E402

t0, t1 = float(sys.argv[1]), float(sys.argv[2])
for s, h in sorted(((score(h.split(), t0, t1), h) for h in sys.argv[3:]), reverse=True):
    print(f"{s:8.1f}  {h}")
