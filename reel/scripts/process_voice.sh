#!/usr/bin/env bash
# Clean and level the voice track of each clip to a consistent loudness with a -1.5 dBFS
# ceiling. Remotion plays these instead of the clips' embedded audio (the <OffthreadVideo>
# elements are muted). The target is measured on the stereo source; Remotion places the
# mono result ~3 dB lower per channel, so dialogue lands around -16 LUFS in the final mix
# and the full mix (with music + SFX) around -15 LUFS.
set -euo pipefail
cd "$(dirname "$0")/.."

CHAIN="highpass=f=75,afftdn=nr=6:nf=-48,acompressor=threshold=-22dB:ratio=2.5:attack=6:release=140:makeup=1.5"
TARGET=-12.5

for clip in 01-hook 02-solution 03-outcome 04-cta; do
  src="public/footage/$clip.mp4"
  measured=$(ffmpeg -hide_banner -i "$src" -af "$CHAIN,ebur128" -f null - 2>&1 |
    awk '/Summary/{s=1} s && $1=="I:"{print $2; exit}')
  gain=$(python3 -c "print(round($TARGET - ($measured), 2))")
  echo "$clip: measured ${measured} LUFS, gain ${gain} dB"
  ffmpeg -v error -y -i "$src" -vn -ac 1 -ar 48000 \
    -af "$CHAIN,volume=${gain}dB,alimiter=limit=0.84:attack=2:release=60:level=disabled" \
    "public/audio/voice/$clip.wav"
done
