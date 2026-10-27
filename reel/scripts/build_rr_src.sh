#!/usr/bin/env bash
# Rebuild "The Referral Roast" one-take source from its Google Flow clips (public/footage/rr/clip01..10.mp4; clip03 is a
# garbled retake of clip04 and is not used). Script order: 01 10 08 02 04 05 06 07 09.
#   1. colour-match every take to clip01 (scripts/match_grade.py), join in order, 24 -> 30 fps
#   2. replace the frames where a take fades to white (or cuts to a foreign shot) with its last clean frame
#   3. cut the pauses at hand-picked spans (scripts/cut_spans.py; silence detection keeps too much air here because
#      the generated pauses are full of breaths and clicks), then hide every join with a morph cut
# Python with opencv: pass it as PY (e.g. a venv). The talking take's voice is re-voiced afterwards with ElevenLabs
# speech-to-speech (see reelfx/RefRoast.tsx), the matte is scripts/matte.py, the hand track scripts/handtrack.py.
set -euo pipefail
cd "$(dirname "$0")/.."
PY=${PY:-python3}
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
ORDER="01 10 08 02 04 05 06 07 09"
clips=""
for o in $ORDER; do clips="$clips public/footage/rr/clip$o.mp4"; done
$PY scripts/match_grade.py --ref 0 "$TMP/graded" $clips
ins=()
parts=""
k=0
for o in $ORDER; do
  ins+=(-i "$TMP/graded/clip$o.mp4")
  parts="$parts[$k:v][$k:a]"
  k=$((k + 1))
done
ffmpeg -v error -y "${ins[@]}" -filter_complex "${parts}concat=n=9:v=1:a=1[v][a];[v]fps=30[vo]" \
  -map "[vo]" -map "[a]" -c:v libx264 -crf 12 -preset slow -pix_fmt yuv420p -c:a aac -b:a 320k -ar 48000 "$TMP/joined.mp4"
$PY - "$TMP/joined.mp4" public/footage/rr/rr-src.mp4 <<'EOF'
import subprocess, sys
import cv2
src, dst = sys.argv[1:3]
bad = [(950, 960), (1197, 1200), (1673, 1680), (1916, 1920)]  # 30 fps frames of the joined source
cap = cv2.VideoCapture(src)
w, h = int(cap.get(3)), int(cap.get(4))
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", "30", "-i", "-", "-i", src,
                        "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "12", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", dst], stdin=subprocess.PIPE)
i, last = 0, None
while True:
    ok, f = cap.read()
    if not ok:
        break
    if any(a <= i < b for a, b in bad):
        f = last
    else:
        last = f
    enc.stdin.write(f.tobytes())
    i += 1
enc.stdin.close()
enc.wait()
EOF
python3 scripts/cut_spans.py public/footage/rr/rr-src.mp4 public/footage/rr-cut \
  7.45-8.30 13.42-13.90 15.50-16.45 23.75-24.62 39.21-40.36 41.90-42.29 45.00-45.40 47.32-48.00 55.70-56.75 63.45-64.75 66.48-66.80 71.40-72.04
$PY scripts/morph_cuts.py public/footage/rr-cut.mp4 public/footage/rr-cut.json "$TMP/m.mp4" --clip-lens 8,8,8,8,8,8,8,8,8 --all
mv "$TMP/m.mp4" public/footage/rr-cut.mp4
cp public/footage/rr-cut.json src/data/rr-cut-segments.json
