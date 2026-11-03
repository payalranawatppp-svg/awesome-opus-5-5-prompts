#!/usr/bin/env bash
# Rebuild "The Front Desk Magic Show" (Script 5, male presenter) from its Google Flow clips
# (public/footage/ms/clip01..10.mp4, in script order; no burned-in subtitles. Takes 9-10 are framed closer: that
# join stays a hard cut (morph_cuts --skip) and the edit covers it with a punch-in transition).
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
ORDER="01 02 03 04 05 06 07 08 09 10"
clips=""
for o in $ORDER; do clips="$clips public/footage/ms/clip$o.mp4"; done
$PY scripts/match_grade.py --ref 0 "$TMP/graded" $clips
ins=()
parts=""
k=0
for o in $ORDER; do
  ins+=(-i "$TMP/graded/clip$o.mp4")
  parts="$parts[$k:v][$k:a]"
  k=$((k + 1))
done
ffmpeg -v error -y "${ins[@]}" -filter_complex "${parts}concat=n=10:v=1:a=1[v][a];[v]fps=30[vo]" \
  -map "[vo]" -map "[a]" -c:v libx264 -crf 12 -preset slow -pix_fmt yuv420p -c:a aac -b:a 320k -ar 48000 "$TMP/joined.mp4"
$PY - "$TMP/joined.mp4" public/footage/ms/ms-src.mp4 <<'EOF'
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
# pauses only, picked from each take's energy profile; the comic beats (after "Ta-da!") are kept
python3 scripts/cut_spans.py public/footage/ms/ms-src.mp4 public/footage/ms-cut \
  0.00-0.23 7.35-7.60 7.92-8.05 15.83-15.96 16.88-17.23 20.58-21.13 23.28-23.75 23.75-24.33 31.55-31.67 31.67-31.85 35.27-35.67 42.03-42.23 45.08-45.83 46.98-47.50 47.50-48.28 54.05-55.42 55.42-55.80 56.62-56.92 59.42-59.92 62.92-63.33 63.33-63.81 68.13-68.78 71.25-71.88 73.65-73.90 75.35-75.55 78.60-79.25
# the take 8 -> 9 join (take 9 starts at 63.33 s of the source) (framing change) in output seconds, from the cut json
SKIP=$(python3 -c "import json;d=json.load(open('public/footage/ms-cut.json'));print(min(x['at']+max(0,63.34-x['in']) for x in d['segments'] if x['out']>63.34))")
$PY scripts/morph_cuts.py public/footage/ms-cut.mp4 public/footage/ms-cut.json "$TMP/m.mp4" --clip-lens 7.9167,7.9167,7.9167,7.9167,7.9167,7.9167,7.9167,7.9167,7.9167,8 --all --skip "$SKIP"
mv "$TMP/m.mp4" public/footage/ms-cut.mp4
cp public/footage/ms-cut.json src/data/ms-cut-segments.json
