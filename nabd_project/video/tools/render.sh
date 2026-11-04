#!/usr/bin/env bash
# usage: tools/render.sh <Ep01|Ep01Hook> <voice> <out.mp4>
# Remotion render (H.264, 14 Mbps, AAC) -> loudness normalise mix to -14 LUFS / -1 dBTP (video stream copied)
set -euo pipefail
cd "$(dirname "$0")/.."
COMP=$1; VOICE=$2; OUT=$3
TMP=$(mktemp -d)
npx remotion render src/index.ts "$COMP" "$TMP/raw.mp4" --props="{\"voice\":\"$VOICE\",\"mode\":\"$([ "$COMP" = Ep01Hook ] && echo hook || echo full)\"}" \
  --codec=h264 --video-bitrate=14M --audio-codec=aac --audio-bitrate=256k --concurrency=4 --log=error
ffmpeg -v error -y -i "$TMP/raw.mp4" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2> "$TMP/ln.json" || true
read -r I TP LRA THR OFF < <(python3 -c "import json,re;d=json.loads(re.search(r'\{.*\}',open('$TMP/ln.json').read(),re.S).group());print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
ffmpeg -v error -y -i "$TMP/raw.mp4" -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$THR:offset=$OFF:linear=true,alimiter=limit=0.89:level=false" \
  -ar 48000 -c:a aac -b:a 256k -movflags +faststart "$OUT"
rm -rf "$TMP"
ffmpeg -v error -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | tail -0
echo "rendered $OUT"
