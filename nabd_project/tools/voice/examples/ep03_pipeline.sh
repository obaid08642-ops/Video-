#!/usr/bin/env bash
# Worked example: the exact voice pipeline of episode 03 (CONTEXT.md section 6), from the preserved original
# to the delivered voice. Adapt the cut lists, ids and numbers per episode. Working dir is scratch (W).
set -euo pipefail
REPO=$(cd "$(dirname "$0")/../../../.." && pwd); T=$REPO/nabd_project/tools; PY=${NABD_MODELS:-/opt/nabd}/venv/bin/python
W=${W:-/opt/nabd/ep03}; mkdir -p $W/{work,ed,tt,pad,sp1,sp2,sp3,trim,gs,fin}
ORIG=$REPO/nabd_project/recordings/ep03_take1_ORIGINAL.m4a
ffmpeg -v error -y -i $ORIG -c:a pcm_f32le $W/raw.wav
$PY -c "import soundfile as sf,numpy as np;y,sr=sf.read('$W/raw.wav');sf.write('$W/raw_g11.wav',(y*10**(11/20)).astype(np.float32),sr,subtype='FLOAT')"
$PY $T/stt/ctc_logits.py $W/raw.wav $W                         # logits for THIS file (gain does not matter for CTC)
$PY $T/stt/transcribe.py $W/raw.wav $W/whisper.json
# ... write recordings/ep03_take1_verbatim.txt and the approved-cut variant (verbatim_F.txt / transcript_F.txt) ...
cat > $W/work/cuts.json <<'J'
{"restarts": {"والدكتور والدكتور": [328.77, 330.90], "أما النوع السابع ده": [155.52, 156.58], "نسأل": [408.30, 409.54]},
 "roomtone": [398.5, 402.5], "align_end": 419.5, "tail_keep": {"near": 0.3, "peak": -34}}
J
NABD_ALIGN_DIR=$W $PY $T/voice/edit_recording.py $W/raw_g11.wav $W/F/verbatim_F.txt $W/ed $W/work/cuts.json
DUR=$($PY -c "import soundfile as sf;print(sf.info('$W/ed/edited.wav').duration)")
python3 $T/voice/make_timing_json.py $W/F/transcript_F.txt $W/ed/words_out.json ep03.wav $DUR $W/ed/timing.json
cat > $W/tighten.json <<'J'
{"num_start": ["مية","مرتين","خمس","نص","أسبوعين"], "special_before": ["كوكايين","المخ","للمخ"], "special_after_lines": ["s1l8"],
 "last_line": false, "between": [0.5, 0.45], "within": [0.35, 0.3]}
J
$PY $T/voice/tighten_pauses.py $W/ed/edited.wav $W/ed/timing.json $W/tt $W/tighten.json
echo '{"s5l3": 0.47, "s5l4": 0.47}' > $W/pad.json
$PY $T/voice/pad_pauses.py $W/tt/tightened.wav $W/tt/timing_tightened.json $W/raw_g11.wav 398.5 402.5 $W/pad.json $W/pad
$PY $T/voice/speed_line.py $W/pad/padded.wav $W/pad/timing_padded.json s3l2 1.15 atempo $W/sp1
$PY $T/voice/speed_line.py $W/sp1/sped_atempo.wav $W/sp1/timing_sped_atempo.json s3l3 1.15 atempo $W/sp2
$PY $T/voice/speed_line.py $W/sp2/sped_atempo.wav $W/sp2/timing_sped_atempo.json s4l2 1.15 atempo $W/sp3
$PY $T/voice/trim_voice.py $W/sp3/sped_atempo.wav $W/sp3/timing_sped_atempo.json $W/trim
$PY $T/voice/speed_all.py $W/trim/voice.wav $W/trim/timing.json 1.079 $W/gs        # 191.32 s -> 177.32 s (+1.5 = 2:58.8)
export NABD_PRE_EQ="equalizer=f=85:t=q:w=1.0:g=-8,equalizer=f=170:t=q:w=1.2:g=-4,equalizer=f=600:t=q:w=1.2:g=4"
$PY $T/voice/finalize_voice.py $W/gs/voice.wav $W/gs/timing.json $W/fin 80xb4 Aplus
$PY $T/voice/declick_gaps.py $W/fin/voice_Aplus_hpf80xb4.wav $W/gs/timing.json $W/fin/_dc.wav $W/fin/declick.json
$PY $T/voice/lower_breaths.py $W/fin/_dc.wav $W/gs/timing.json $W/fin/voice_final.wav -12 $W/fin/breaths.json
$PY $T/qa/qa_voice.py $W/fin/voice_final.wav $W/gs/timing.json $W/fin/line_levels_Aplus_hpf80xb4.json
$PY $T/qa/ltas_compare.py $W/fin/voice_final.wav $W/gs/timing.json
$PY $T/stt/transcribe.py $W/fin/voice_final.wav $W/fin/whisper_check.json      # read it end to end
