# Retake timbre matching: numbers (before = version heard, after = per-sentence matching, pass 2)

All five retakes went through exactly the same chain as the rest (they were spliced in BEFORE cleaning:
DeepFilterNet atten 18 dB -> LR4 80 Hz HPF -> A+ EQ -> de-esser -> comp 2.5:1 -> -14 LUFS). The
difference is in the source (other room / distance), not in the processing.

Octave-band spectral deviation of each retake, 250 Hz-8 kHz (RMS / worst band, dB):

| sentence | vs same sentence in original take | vs neighbouring sentences | verdict |
|---|---|---|---|
| 1 البكتيريا تدخل من الجرح | 2.6/4.8 -> 1.7/3.0 | 2.0/3.8 -> 1.8/2.6 | improved |
| 2 أنقذ ملايين الأرواح | 1.8/3.2 -> 2.3/4.1 | 3.1/4.2 -> 4.6/8.8 | NOT fixable within +/-4 dB (needs ~+11 dB @4 kHz) |
| 3 وماتت… ملهاش علاج | 2.8/5.5 -> 0.9/1.4 | 4.3/7.9 -> 3.6/8.2 (content: neighbour full of «س») | good |
| 4 لانسيت (من «حسب») | 4.2/7.7 -> 1.2/1.4 | 3.5/6.8 -> 2.0/4.4 | good |
| 5 الولادة القيصرية | 3.0/6.6 -> 1.6/3.3 | 3.7/7.4 -> 2.3/4.3 | good |

Low end (80-250 Hz vs 250 Hz-2 kHz, proximity): retakes -1.5 to -2.8 dB vs original -2.6 to -4.4 dB (retakes ~+1.5 dB fuller).
Room reverb (energy 30-110 ms after word ends): retakes -17.6 dB vs original -24.8 dB -> retakes ~7 dB WETTER.
  Single-channel WPE (nara_wpe, MIT): only 0.3-0.6 dB less tail for 0.6-1.1 dB voice change -> not used.
  Gentle downward expander: no tail reduction, 0.6-0.9 dB voice change -> not used.
Room tone in pauses inside sentences: retakes -47.7 vs original -49.3 dBFS (mostly the reverb tail).
Dynamics after the chain: similar (same compressor). Loudness review: all 42 lines within +/-1.4 dB of neighbours.

Per-sentence EQ actually applied (total on the raw retake, capped +/-4 dB): eq_per_sentence.json
