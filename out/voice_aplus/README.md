# A vs A+ (same excerpt: from the start to «…والبكتيريا اللي حواليه ماتت», 33.9 s, after tightening the pauses)

| | A | A+ |
|---|---|---|
| Loudness (this excerpt) | -13.8 LUFS | -13.8 LUFS (full file: both -14.0) |
| True peak | -1.5 dBTP | -1.5 dBTP |
| Median pitch | 115.0 Hz | 114.4 Hz (0.09 semitone, within measurement error: no pitch change) |

A+ = A with: -1.5 dB @300 Hz (Q 1.6) · +1.25 dB @3.2 kHz (Q 1.3) · high shelf +1 dB from 10.5 kHz · de-esser after the shelf (0.35 -> 0.45) · compression 2:1 -> 2.5:1 (threshold -22 -> -24 dB). No pitch shift, no low-frequency boost.

Measured A+ minus A on speech: 250-350 Hz -1.0 dB · 2.5-4 kHz +1.3 dB · 10-12 kHz +1.2 dB · 80-150 Hz +0.3 dB (loudness matching only) · sibilance peaks 8.1 -> 7.8 dB (not sharper).

Pauses (both files): 21 pauses shortened (`pause_cuts.json`), cuts in silence only (every cut point <= -47.5 dBFS), 30 ms crossfades.
Inside a sentence max 0.41 s (one pause keeps a breath), between sentences max 0.55 s; 0.6 s kept only before «لكن سنة ألف تسعمية…» (number) and before the last sentence.
New duration: 2:42.52 voice, 2:44.0 with the logo.
