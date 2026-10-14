#!/usr/bin/env bash
# Level the voice track of each clip to a consistent loudness with a -1.5 dBFS ceiling.
# Remotion plays these instead of the clips' embedded audio (the <OffthreadVideo>
# elements are muted). The target is measured on the source; Remotion places the mono
# result ~3 dB lower per channel, so dialogue lands around -16 LUFS in the final mix
# and the full mix (with music + SFX) around -15 LUFS.
#
# VOICE_SOURCE=elevenlabs (default): the ElevenLabs speech-to-speech takes in
#   public/audio/voice-elevenlabs/ (already de-noised by ElevenLabs).
# VOICE_SOURCE=original: the clips' own audio, lightly de-noised.
set -euo pipefail
cd "$(dirname "$0")/.."

VOICE_SOURCE=${VOICE_SOURCE:-elevenlabs}
TARGET=-12.5
COMP="acompressor=threshold=-22dB:ratio=2.5:attack=6:release=140:makeup=1.5"
if [ "$VOICE_SOURCE" = elevenlabs ]; then
  CHAIN="highpass=f=70,$COMP"
else
  CHAIN="highpass=f=75,afftdn=nr=6:nf=-48,$COMP"
fi

for clip in 01-hook 02-solution 03-outcome 04-cta; do
  if [ "$VOICE_SOURCE" = elevenlabs ]; then src="public/audio/voice-elevenlabs/$clip.mp3"; else src="public/footage/$clip.mp4"; fi
  measured=$(ffmpeg -hide_banner -i "$src" -af "$CHAIN,ebur128" -f null - 2>&1 |
    awk '/Summary/{s=1} s && $1=="I:"{print $2; exit}')
  # Mono sources measure ~3 LU lower than the stereo clip audio the target was set on.
  channels=$(ffprobe -v error -select_streams a:0 -show_entries stream=channels -of csv=p=0 "$src")
  [ "$channels" = 1 ] && measured=$(python3 -c "print($measured + 3.01)")
  gain=$(python3 -c "print(round($TARGET - ($measured), 2))")
  echo "$clip ($VOICE_SOURCE): measured ${measured} LUFS, gain ${gain} dB"
  # Pad/trim to exactly 8 s so segment in/out frames map 1:1 onto the picture.
  ffmpeg -v error -y -i "$src" -vn -ac 1 -ar 48000 \
    -af "$CHAIN,volume=${gain}dB,alimiter=limit=0.84:attack=2:release=60:level=disabled,apad=whole_dur=8" \
    -t 8 "public/audio/voice/$clip.wav"
done
