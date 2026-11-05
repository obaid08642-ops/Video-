#!/usr/bin/env bash
# usage: tools/render.sh <Ep01|Ep01Hook> <voice> <out.mp4>
# 1) Remotion render (near-lossless intermediate)
# 2) final H.264 encode: 14 Mbps target, capped so the file stays < 90 MB (repo limit 95 MB)
# 3) audio mix loudness-normalised to -14 LUFS, true peak <= -1 dBTP (two-pass loudnorm), AAC 256k
set -euo pipefail
cd "$(dirname "$0")/.."
COMP=$1; VOICE=$2; OUT=$3
MODE=$([ "$COMP" = Ep01Hook ] && echo hook || echo full)
TMP=$(mktemp -d)
npx remotion render src/index.ts "$COMP" "$TMP/raw.mov" --props="{\"voice\":\"$VOICE\",\"mode\":\"$MODE\"}" \
  --codec=h264 --crf=14 --audio-codec=pcm-16 --concurrency=4 --log=error
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TMP/raw.mov")
VBR=$(python3 -c "d=float('$DUR'); print(int(min(14_000_000, (90*8*1_000_000/d) - 300_000)))")
ffmpeg -hide_banner -nostats -y -i "$TMP/raw.mov" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2> "$TMP/ln.json" || true
read -r I TP LRA THR OFF < <(python3 -c "import json,re;d=json.loads(re.search(r'\{[^{}]*\"input_i\"[^{}]*\}',open('$TMP/ln.json').read(),re.S).group());print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
X264="-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -b:v $VBR -maxrate $((VBR * 12 / 10)) -bufsize $((VBR * 2)) -passlogfile $TMP/x264"
ffmpeg -v error -y -i "$TMP/raw.mov" $X264 -pass 1 -an -f mp4 /dev/null
ffmpeg -v error -y -i "$TMP/raw.mov" $X264 -pass 2 \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$THR:offset=$OFF:linear=true" \
  -ar 48000 -c:a aac -b:a 256k -movflags +faststart "$OUT"
rm -rf "$TMP"
echo "video bitrate target: $((VBR / 1000)) kbps"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -A12 Summary | grep -E "I:|Peak:"
ls -la "$OUT"
