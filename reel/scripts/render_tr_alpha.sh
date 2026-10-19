#!/usr/bin/env bash
# Render every ToothReferral dashboard animation with a transparent background:
#   out/tr-alpha/<id>-h.mov / <id>-v.mov   ProRes 4444 + alpha (for Premiere, Final Cut, DaVinci, CapCut)
#   renders/tr-alpha/<id>-h.webm / -v.webm VP9 + alpha (small; browsers, web editors)
# usage: scripts/render_tr_alpha.sh [id ...]   (default: all)  SIDE=left|center|right for horizontal
set -euo pipefail
cd "$(dirname "$0")/.."
SIDE="${SIDE:-center}"
IDS=("$@")
if [ ${#IDS[@]} -eq 0 ]; then
  mapfile -t IDS < <(npx remotion compositions 2>/dev/null | grep -oE '^TR-[0-9]{2}-[a-z-]+' | grep -v -- '-h$' | sort -u)
fi
mkdir -p out/tr-alpha renders/tr-alpha
for id in "${IDS[@]}"; do
  for fmt in h v; do
    comp="$id"; [ "$fmt" = h ] && comp="$id-h"
    props="{\"transparent\":true,\"side\":\"$SIDE\"}"
    npx remotion render "$comp" "out/tr-alpha/$id-$fmt.mov" --codec=prores --prores-profile=4444 \
      --image-format=png --pixel-format=yuva444p10le --props="$props" --muted >/dev/null
    ffmpeg -v error -y -c:v prores -i "out/tr-alpha/$id-$fmt.mov" -c:v libvpx-vp9 -pix_fmt yuva420p \
      -b:v 0 -crf 30 -row-mt 1 -auto-alt-ref 0 "renders/tr-alpha/$id-$fmt.webm"
    echo "$id-$fmt done"
  done
done
