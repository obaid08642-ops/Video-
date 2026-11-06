#!/usr/bin/env bash
# usage: tools/make_long.sh <TailComposition> <short.mp4> <out_long.mp4>
# YouTube long-form version: renders only the tail composition and appends it to the finished Short
# (the main video is not re-rendered). Video re-encoded once (same size target), audio loudness-checked.
set -euo pipefail
cd "$(dirname "$0")/.."
TAIL=$1; SHORT=$2; OUT=$3; TMP=$(mktemp -d)
npx remotion render src/index.ts "$TAIL" "$TMP/tail.mov" --codec=h264 --crf=14 --audio-codec=pcm-16 --concurrency=4 --log=error
DUR=$(python3 -c "import subprocess as s;f=lambda p:float(s.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',p]));print(f('$SHORT')+f('$TMP/tail.mov'))")
VBR=$(python3 -c "d=float('$DUR'); print(int(min(14_000_000, (90*8*1_000_000/d) - 300_000)))")
FC="[0:v]fps=30,format=yuv420p[v0];[1:v]fps=30,format=yuv420p[v1];[0:a]aresample=48000,aformat=channel_layouts=mono|stereo[a0];[1:a]aresample=48000,aformat=channel_layouts=mono|stereo[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]"
FCV="[0:v]fps=30,format=yuv420p[v0];[1:v]fps=30,format=yuv420p[v1];[v0][v1]concat=n=2:v=1:a=0[v]"
X264="-c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p -b:v $VBR -maxrate $((VBR * 12 / 10)) -bufsize $((VBR * 2)) -passlogfile $TMP/x264"
ffmpeg -v error -y -i "$SHORT" -i "$TMP/tail.mov" -filter_complex "$FCV" -map "[v]" $X264 -pass 1 -an -f mp4 /dev/null
ffmpeg -v error -y -i "$SHORT" -i "$TMP/tail.mov" -filter_complex "$FC" -map "[v]" -map "[a]" $X264 -pass 2 -ar 48000 -c:a aac -b:a 256k -movflags +faststart "$OUT"
rm -rf "$TMP"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -A12 Summary | grep -E "I:|Peak:"
ls -la "$OUT"
