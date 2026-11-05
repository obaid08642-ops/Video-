# Ep01 v4: full voice (VoiceTut-TTS, CPU)

| Voice | Base speed | Duration | Actual pace (words/min) | Pause scale | Retries | Questions not rising at the end |
|---|---|---|---|---|---|---|
| Youssef | 1.00 | 3:15.0 | 113 | 0.30 | 4 | «وإنت تعبان؟» (flat, -0.1 st) |
| Ali | 1.08 | 3:20.7 | 110 | 0.30 | 6 | «طب المضاد بيعمل إيه جوه جسمك؟» (+0.5), «والفيروس؟» (-0.6), «وفي منطقتنا؟» (-2.4) |
| Ahmed | 1.03 | 3:16.2 | 113 | 0.30 | 4 | none |

- Every line was checked with faster-whisper large-v3; lowest match: Youssef 93 %, Ali 92.6 %, Ahmed 91.3 % (differences are Egyptian spelling variants, e.g. «بيجمعوه» -> «بيجمعوا»). No word left flagged.
- Pauses between lines were cut to 30 % (target < 2:59). Still over: see the report for the speed options.
- Files per voice: `ep01_<voice>.mp3` (-14 LUFS), `ep01_<voice>_timing.json` (word timings driving the video), `ep01_<voice>_qa.json` (whisper transcript, seed, pitch at the end of each question).
