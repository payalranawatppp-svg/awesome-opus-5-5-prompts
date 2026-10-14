#!/usr/bin/env bash
# Usage: scripts/sheet.sh NAME FRAME... → out/stills/sheet-NAME.png (360px-wide tiles side by side)
set -euo pipefail
cd "$(dirname "$0")/../out/stills"
name=$1; shift
args=(); filt=""; i=0
for f in "$@"; do args+=(-i "SignalReachReel-$(printf %04d "$f").png"); filt+="[$i:v]scale=360:-1[v$i];"; i=$((i+1)); done
ins=""; for ((j=0; j<i; j++)); do ins+="[v$j]"; done
ffmpeg -v error -y "${args[@]}" -filter_complex "${filt}${ins}hstack=inputs=$i" "sheet-$name.png"
