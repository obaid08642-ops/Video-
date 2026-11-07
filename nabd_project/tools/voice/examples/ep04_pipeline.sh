#!/usr/bin/env bash
# Worked example: the exact voice pipeline of episode 04 (noisy 17-min take, 3 versions from one recording).
# CONTEXT.md sections 6.1-6.13 (6.11: denoise BEFORE editing for noisy takes; 6.12b: Shorts from the long voice).
set -euo pipefail
REPO=$(cd "$(dirname "$0")/../../../.." && pwd); T=$REPO/nabd_project/tools; R=$REPO/nabd_project/recordings
PY=${NABD_MODELS:-/opt/nabd}/venv/bin/python; export NABD_MODELS=${NABD_MODELS:-/opt/nabd}
W=${W:-/opt/nabd/ep04}; mkdir -p $W/{work,ed,tt,pad,sp,trim,fin,dfall,short1,short2}
# 1. lossless join of the two uploaded parts (already done once: recordings/ep04_take1_ORIGINAL.flac + .sha256)
ffmpeg -v error -y -i $R/ep04_take1_ORIGINAL.flac -c:a pcm_f32le $W/raw.wav
$PY $T/stt/ctc_logits.py $W/raw.wav $W                     # logits of the ORIGINAL (timing identical after filtering)
$PY $T/stt/transcribe.py $W/raw.wav $W/whisper.json
# 2. notch 59.33 Hz + HPF 80 (b4), -2.5 dB headroom, DeepFilterNet 18 dB on the whole take (before editing)
$PY - <<PY
import soundfile as sf, numpy as np
from scipy import signal as sg
y, sr = sf.read("$W/raw.wav", dtype="float64")
b, a = sg.iirnotch(59.33, 8, fs=sr); y = sg.filtfilt(b, a, y)
y = sg.sosfilt(sg.butter(4, 80, "highpass", fs=sr, output="sos"), y)
sf.write("$W/raw_pre.wav", y.astype(np.float32), sr, subtype="FLOAT")
sf.write("$W/dfall/raw_pre.wav", (y * 10 ** (-2.5 / 20)).astype(np.float32), sr, subtype="FLOAT")
PY
$NABD_MODELS/tools/deep-filter --compensate-delay --atten-lim-db 18 -o $W/dfall/out $W/dfall/raw_pre.wav
$PY -c "import soundfile as sf,numpy as np;y,sr=sf.read('$W/dfall/out/raw_pre.wav');sf.write('$W/raw_df.wav',y.astype(np.float32),sr,subtype='FLOAT')"
# 3. edit (verbatim with [..] cuts), timing, pauses, one slow line x1.15, trim
cat > $W/work/cuts.json <<'J'
{"restarts": {}, "roomtone": [406.5, 410.5], "align_end": 1032.0,
 "keep": [[8.75, 9.0], [149.6, 149.8], [265.4, 265.6], [887.5, 887.9]],
 "word_bounds": [["معايا", 137.5, null, 137.85], ["كده", 28.6, null, 28.95], ["الشوكي", 283.3, null, 283.62], ["النهارده", 301.7, null, 302.12]]}
J
NABD_ALIGN_DIR=$W $PY $T/voice/edit_recording.py $W/raw_df.wav $R/ep04_take1_verbatim.txt $W/ed $W/work/cuts.json
DUR=$($PY -c "import soundfile as sf;print(sf.info('$W/ed/edited.wav').duration)")
python3 $T/voice/make_timing_json.py $R/ep04_final_transcript.txt $W/ed/words_out.json ep04.wav $DUR $W/ed/timing.json
cat > $W/tighten.json <<'J'
{"num_start": ["ألف","اتنين","تمن","أول"], "special_before": ["بالتوحد","نابكي","السببية","كويس"], "special_after_lines": [],
 "last_line": false, "between": [0.5, 0.45], "within": [0.35, 0.3]}
J
$PY $T/voice/tighten_pauses.py $W/ed/edited.wav $W/ed/timing.json $W/tt $W/tighten.json
echo '{"s2l1":0.65,"s3l1":0.65,"s4l1":0.65,"s5l1":0.65,"s6l1":0.65,"s7l1":0.65,"s8l1":0.65,"s9l1":0.65}' > $W/pad.json
$PY $T/voice/pad_pauses.py $W/tt/tightened.wav $W/tt/timing_tightened.json $W/raw_df.wav 406.5 410.5 $W/pad.json $W/pad
$PY $T/voice/speed_line.py $W/pad/padded.wav $W/pad/timing_padded.json s2l3 1.15 atempo $W/sp
$PY $T/voice/trim_voice.py $W/sp/sped_atempo.wav $W/sp/timing_sped_atempo.json $W/trim     # long: 538.59 s, no global speed-up
# 4. A+ chain (denoise already done) + recording EQ (phone presence peak at 2.2 kHz), declick, breaths
export NABD_DF_DONE=1
export NABD_PRE_EQ="equalizer=f=2200:t=q:w=1.0:g=-4.5,equalizer=f=4200:t=q:w=1.2:g=-1,equalizer=f=1100:t=q:w=1.0:g=1,equalizer=f=180:t=q:w=1.2:g=1"
$PY $T/voice/finalize_voice.py $W/trim/voice.wav $W/trim/timing.json $W/fin 60xb4 Aplus
$PY $T/voice/declick_gaps.py $W/fin/voice_Aplus_hpf60xb4.wav $W/trim/timing.json $W/fin/_dc.wav $W/fin/declick.json
$PY $T/voice/lower_breaths.py $W/fin/_dc.wav $W/trim/timing.json $W/fin/voice_final.wav -12 $W/fin/breaths.json
$PY $T/qa/qa_voice.py $W/fin/voice_final.wav $W/trim/timing.json $W/fin/line_levels_Aplus_hpf60xb4.json
$PY $T/qa/ltas_compare.py $W/fin/voice_final.wav $W/trim/timing.json
$PY $T/stt/transcribe.py $W/fin/voice_final.wav $W/fin/whisper_check.json      # read it end to end
# 5. Shorts: whole lines from the finished long voice (ids = long timing ids)
O=$REPO/out/voice/ep04
$PY $T/voice/make_short.py $W/fin/voice_final.wav $W/trim/timing.json $O/shorts_spec_short1.json $W/short1
$PY $T/voice/make_short.py $W/fin/voice_final.wav $W/trim/timing.json $O/shorts_spec_short2.json $W/short2
$PY $T/qa/make_cut_table.py $W $O $W/trim/timing.json $T/voice/examples/ep04_cut_notes.json
