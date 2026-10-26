# Local notes for this project (not part of the upstream skill)

- Installed from github.com/Vibha-Ramprakash/claude-video-effects (MIT, see LICENSE) on 2026-10-26, unmodified apart
  from this file. Its `.venv/` is git-ignored: run `bash scripts/setup.sh` once per fresh machine (prints READY).
- In the cloud container MediaPipe also needs the system EGL/GLES libraries, otherwise every effect fails with
  `OSError: libEGL.so.1`. Install them once: `apt-get install -y libegl1 libgles2 libgl1`.
- Tested on reel/public/footage/cbq/clip02.mp4 (720x1280): glass-widgets, orbit, spotlight, glitter-spotlight,
  checklist, timeline, match-cut and apple-toggles all render. Single-effect check:
  `.venv/bin/python scripts/fx.py <fx> <video> <out>.png --start 0.5 --end 4.5 --text "..." --still 2.5`
- How to use it in this repo's edits: `.claude/skills/reel-effects/SKILL.md`, section 0.
