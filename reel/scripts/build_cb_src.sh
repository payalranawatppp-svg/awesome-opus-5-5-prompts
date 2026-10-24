#!/usr/bin/env bash
# Rebuild the Chocolate Box source from its 19 original 8-second clips (public/footage/cbq/clip01..19.mp4): joined in
# order and converted 24 -> 30 fps by frame repetition (the composition runs at 30), video at CRF 12 so no quality is
# lost before the edit. Then cut it with natural pauses:
#   python3 scripts/cut_by_words.py public/footage/cbq/cbq-src.mp4 src/data/transcript-cbq-src.json public/footage/cb-cut \
#     --start 1.06 --hold 12.0:0.5 16.5:0.36 63.0:0.6 92.4:0.6 95.6:0.5 100.9:0.55 139.9:0.6 --drop 64.0-65.0
# and hide the jumps (cuts and clip joins) with morph cuts, in place:
#   python3 scripts/morph_cuts.py public/footage/cb-cut.mp4 public/footage/cb-cut.json /tmp/m.mp4 \
#     --clip-lens 8,8,8,8,8,8,8,8,8,8,8,8,8,8,4.0517,8,8,8,8 --mic public/cutouts/cb-cut-mic.png && mv /tmp/m.mp4 public/footage/cb-cut.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
ins=()
parts=""
for i in $(seq 1 19); do
  ins+=(-i "public/footage/cbq/clip$(printf %02d "$i").mp4")
  parts="$parts[$((i - 1)):v][$((i - 1)):a]"
done
ffmpeg -v error -y "${ins[@]}" -filter_complex "${parts}concat=n=19:v=1:a=1[v][a];[v]fps=30[vo]" \
  -map "[vo]" -map "[a]" -c:v libx264 -crf 12 -preset slow -pix_fmt yuv420p -c:a aac -b:a 320k -ar 48000 \
  public/footage/cbq/cbq-src.mp4
