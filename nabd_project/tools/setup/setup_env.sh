#!/usr/bin/env bash
# One-time setup for the Nabd pipeline on a fresh Linux machine (CPU only is fine).
# Everything is free and allows commercial use (licences listed in CONTEXT.md, section 3).
#
#   bash nabd_project/tools/setup/setup_env.sh [NABD_MODELS=/opt/nabd]
#
# Afterwards:  export NABD_MODELS=/opt/nabd   (tools read models from there)
#              source $NABD_MODELS/venv/bin/activate   (or call $NABD_MODELS/venv/bin/python directly)
set -euo pipefail
NABD_MODELS=${1:-${NABD_MODELS:-/opt/nabd}}
REPO=$(cd "$(dirname "$0")/../../.." && pwd)
mkdir -p "$NABD_MODELS"/{tools,whisper,w2v}

echo "== system packages (ffmpeg 6.x, node 18+ for Remotion)"
command -v ffmpeg >/dev/null || sudo apt-get install -y ffmpeg
command -v node   >/dev/null || { echo "install Node.js 18+ (e.g. nodesource) and re-run"; exit 1; }

echo "== python venv (python 3.12 tested)"
python3 -m venv "$NABD_MODELS/venv"
PIP="$NABD_MODELS/venv/bin/pip"
"$PIP" install --upgrade pip
# CPU torch first (smaller), then the rest. Tested versions in CONTEXT.md section 3.
"$PIP" install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
"$PIP" install transformers faster-whisper librosa soundfile scipy numpy pyloudnorm pyworld pillow gradio_client

echo "== speech recognition models"
# Whisper large-v3 for CTranslate2 (MIT): downloaded on first use into $NABD_MODELS/whisper
"$NABD_MODELS/venv/bin/python" - <<PY
from faster_whisper import WhisperModel
WhisperModel("large-v3", device="cpu", compute_type="int8", download_root="$NABD_MODELS/whisper")
PY
# wav2vec2 Arabic CTC (Apache-2.0) -> $NABD_MODELS/w2v (needs vocab.json there)
"$NABD_MODELS/venv/bin/python" - <<PY
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
m = "jonatasgrosman/wav2vec2-large-xlsr-53-arabic"
Wav2Vec2Processor.from_pretrained(m).save_pretrained("$NABD_MODELS/w2v")
Wav2Vec2ForCTC.from_pretrained(m).save_pretrained("$NABD_MODELS/w2v")
PY

echo "== DeepFilterNet 0.5.6 command-line binary (MIT/Apache-2.0)"
curl -L -o "$NABD_MODELS/tools/deep-filter" \
  https://github.com/Rikorose/DeepFilterNet/releases/download/v0.5.6/deep-filter-0.5.6-x86_64-unknown-linux-musl
chmod +x "$NABD_MODELS/tools/deep-filter"

echo "== optional: VoiceTut-TTS (Apache-2.0) for synthetic voices (episode 01 tests); not needed for recorded episodes"
if [ "${WITH_TTS:-0}" = 1 ]; then
  "$PIP" install "git+https://github.com/k2-fsa/OmniVoice.git@08be0b4ccbac3e13e374e86fbfead4b4cac343e2"
  "$PIP" install "git+https://github.com/MohammedAly22/VoiceTuT-TTS.git@44cba00cd3ddb04b5213353e19e960045e332da7"
  "$NABD_MODELS/venv/bin/python" - <<PY
from huggingface_hub import snapshot_download
snapshot_download("mohammedaly22/VoiceTut-TTS", local_dir="$NABD_MODELS/model")
PY
fi

echo "== Remotion project dependencies"
(cd "$REPO/nabd_project/video" && npm ci)

echo "== done. NABD_MODELS=$NABD_MODELS"
