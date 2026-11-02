#!/usr/bin/env bash
# Rebuild "The Leak Is Inside Your Office" (Script 4, female presenter) from its Google Flow clips
# (public/footage/lk/clip01..08.mp4, already in script order; clip01 and clip06 had burned-in subtitles, removed with
# scripts/remove_subtitles.py, originals in lk/orig/).
#   1. colour-match every take to clip01 (scripts/match_grade.py), join in order, 24 -> 30 fps
#   2. replace the frames where a take fades to white (or cuts to a foreign shot) with its last clean frame
#   3. cut the pauses at hand-picked spans (scripts/cut_spans.py; silence detection keeps too much air here because
#      the generated pauses are full of breaths and clicks), then hide every join with a morph cut
# Python with opencv: pass it as PY (e.g. a venv). The talking take's voice is re-voiced afterwards with ElevenLabs
# voice conversion to take 1's voice (Seed-VC, see reelfx/LeakInside.tsx), the matte is scripts/matte.py, the hand track scripts/handtrack.py.
set -euo pipefail
cd "$(dirname "$0")/.."
PY=${PY:-python3}
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
ORDER="01 02 03 04 05 06 07 08"
clips=""
for o in $ORDER; do clips="$clips public/footage/lk/clip$o.mp4"; done
$PY scripts/match_grade.py --ref 0 "$TMP/graded" $clips
ins=()
parts=""
k=0
for o in $ORDER; do
  ins+=(-i "$TMP/graded/clip$o.mp4")
  parts="$parts[$k:v][$k:a]"
  k=$((k + 1))
done
ffmpeg -v error -y "${ins[@]}" -filter_complex "${parts}concat=n=8:v=1:a=1[v][a];[v]fps=30[vo]" \
  -map "[vo]" -map "[a]" -c:v libx264 -crf 12 -preset slow -pix_fmt yuv420p -c:a aac -b:a 320k -ar 48000 "$TMP/joined.mp4"
$PY - "$TMP/joined.mp4" public/footage/lk/lk-src.mp4 <<'EOF'
import subprocess, sys
import cv2
src, dst = sys.argv[1:3]
bad = []  # no faded or foreign frames in these takes
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
# pauses, plus two words Flow garbled: "who stop" in take 2 ("a status who stop clicked") and "Anyone can pick up" at
# the start of take 8 (the first 0.58 s go; the next 0.5 s stay as picture under a full-screen card, where the line's
# missing first word "Setup" is spliced into the voice).
python3 scripts/cut_spans.py public/footage/lk/lk-src.mp4 public/footage/lk-cut \
  0.00-0.28 1.92-2.16 4.34-4.64 7.42-8.49 10.27-10.59 12.37-12.99 13.67-14.43 15.48-16.61 19.58-20.01 23.69-24.56 \
  26.45-26.87 28.85-29.27 31.60-32.59 35.88-36.21 39.43-40.53 42.88-43.44 47.55-47.95 49.78-50.56 51.43-52.06 \
  55.62-56.43 58.17-58.90 63.50-63.90
$PY scripts/morph_cuts.py public/footage/lk-cut.mp4 public/footage/lk-cut.json "$TMP/m.mp4" --clip-lens 8,8,8,8,8,8,8,8 --all
mv "$TMP/m.mp4" public/footage/lk-cut.mp4
cp public/footage/lk-cut.json src/data/lk-cut-segments.json
