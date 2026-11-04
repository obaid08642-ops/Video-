# Round 1: VoiceTut-TTS, 12 built-in male voices

Sentence: «طب عمرك سألت نفسك… ليه الدكتور ساعات بيرفض يكتبهولك… وإنت تعبان؟»
(the two «…» went to the model as «،» so the question stays one utterance with one intonation)

Settings for every voice: speed=1.0, num_step=32, guidance_scale=2.0, seed=1234, CPU float32, 24 kHz WAV, no post-processing.

| Voice | Duration (s) | Mean pitch F0 (Hz) | Pitch range (semitones) | Speed (WPM) | Pitch at end of question | Pauses >150ms (s) |
|---|---|---|---|---|---|---|
| Ahmed | 5.36 | 147 | 12.3 | 131 | falls 1.0 st | 0.26, 0.26, 0.55 |
| Ali | 5.74 | 106 | 12.6 | 121 | rises 0.7 st | 0.53, 0.90 |
| Hassan | 4.92 | 131 | 13.6 | 143 | falls 6.3 st | 0.30, 0.49 |
| Karim | 5.24 | 131 | 16.4 | 135 | rises 1.1 st | 0.64, 0.45 |
| Mahmoud | 6.06 | 101 | 12.9 | 115 | flat | 0.49 |
| Mohammed | 5.17 | 118 | 8.1 | 137 | flat | 0.21 |
| Mostafa | 4.28 | 110 | 6.1 | 167 | flat | 0.21 |
| Ramy | 4.45 | 139 | 10.9 | 159 | rises 0.9 st | 0.21 |
| Shaker | 5.76 | 174 | 16.9 | 123 | falls 2.0 st | 0.49, 0.66 |
| Tareq | 4.48 | 122 | 13.1 | 159 | falls 3.1 st | 0.32, 0.43 |
| Yehia | 4.88 | 166 | 18.6 | 146 | falls 3.5 st | 0.43, 0.17 |
| Youssef | 5.18 | 133 | 10.5 | 135 | falls 1.0 st | 0.43, 0.36 |

WPM = 11 words over the span from first to last sound. Target in the voice guide: 135-150.
Raw numbers: `_analysis.json`. Generation times: `_gen_log.json`. Scripts: `nabd_project/tools/voice/`.
