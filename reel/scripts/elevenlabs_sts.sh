#!/usr/bin/env bash
# Re-voice each clip with ElevenLabs speech-to-speech (Voice Changer).
# Speech-to-speech keeps the original performance's timing word for word, so the
# avatar's lip sync, the captions and every graphic/SFX cue stay locked; it also gives
# the four separately generated clips one consistent voice.
#
#   ELEVENLABS_API_KEY=... ./scripts/elevenlabs_sts.sh      → public/audio/voice-elevenlabs/*.mp3
#
# Voice: "Chris" (premade, conversational) — closest to the original speaker's pitch
# (median F0 ≈ 132 Hz vs ≈ 126 Hz). Verify each take with scripts/verify_voice.py.
set -euo pipefail
cd "$(dirname "$0")/.."
: "${ELEVENLABS_API_KEY:?Set ELEVENLABS_API_KEY (never commit it)}"

VOICE_ID=${VOICE_ID:-iP95p4xoKVk53GoZ742B}
OUT=public/audio/voice-elevenlabs
mkdir -p "$OUT"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

for clip in 01-hook 02-solution 03-outcome 04-cta; do
  ffmpeg -v error -y -i "public/footage/$clip.mp4" -vn -ac 1 -ar 44100 -c:a pcm_s16le "$tmp/$clip.wav"
  curl -sS --fail-with-body -X POST \
    "https://api.elevenlabs.io/v1/speech-to-speech/$VOICE_ID?output_format=mp3_44100_128" \
    -H "xi-api-key: $ELEVENLABS_API_KEY" \
    -F "audio=@$tmp/$clip.wav;type=audio/wav" \
    -F "model_id=eleven_multilingual_sts_v2" \
    -F 'voice_settings={"stability":0.5,"similarity_boost":0.8,"style":0,"use_speaker_boost":true}' \
    -F "remove_background_noise=true" \
    -F "seed=7" \
    -o "$OUT/$clip.mp3"
  echo "$clip → $OUT/$clip.mp3"
done
