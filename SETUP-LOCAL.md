# Setting this project up on your own computer

Everything made in the cloud sessions lives in this repository on the branch `claude/happy-fermat-cuii9h`: the skills,
the video project (`reel/`), the finished videos (`reel/renders/`), the scripts (`scripts-incoming-referrals/`) and
the PDFs. Clone it and open the folder with Claude Code; the project skills load from `.claude/skills/` by themselves.

## 1. Get everything

```sh
git clone -b claude/happy-fermat-cuii9h https://github.com/payalranawatppp-svg/awesome-opus-5-5-prompts.git
cd awesome-opus-5-5-prompts
```

(Git LFS is not needed; the largest file is under 100 MB.)

## 2. Skills

- 125 skills are in `.claude/skills/` and work as soon as Claude Code is opened in this folder.
- Two were left out of the repository for licence reasons; install them with their own installers:
  - Remotion best practices: `npx skills add remotion-dev/skills`
  - PDF: already on your claude.ai account (`anthropic-skills:pdf`), nothing to do.
- OpenFilm: `npm i -g openfilm`, then `openfilm doctor` (its film skills: see `.claude/skills/openfilm/LOCAL.md`).
- `/effects` (talking-head effects): `cd .claude/skills/effects && bash scripts/setup.sh` (see its `LOCAL.md`).

## 3. Tools the video edits use

| Tool | Install |
|---|---|
| Node 22+, ffmpeg | from nodejs.org / your package manager |
| Remotion project | `cd reel && npm install` |
| Python for the scripts in `reel/scripts/` | `python3 -m venv .venv && .venv/bin/pip install opencv-python-headless numpy faster-whisper onnxruntime` |
| Person matting model (RVM, GPL, not in the repo) | download `rvm_mobilenetv3_fp32.onnx` from github.com/PeterL1n/RobustVideoMatting releases |
| Hand tracking model | `hand_landmarker.task` from storage.googleapis.com/mediapipe-models (used by `reel/scripts/handtrack.py`) |
| Voice conversion in a clip's own voice (optional) | github.com/Plachtaa/seed-vc (GPL; run it as a tool, keep it out of this repo) |

Render a video: `cd reel && npx remotion render <CompositionId> out.mp4` (ids: `XrayHunt`, `RefRoast`,
`PdfDeadEnd`, `ChocolateBox`, ...; `npx remotion studio` shows them all).

## 4. Not in the repository (on purpose)

- API keys (ElevenLabs): never committed. Keep them in an environment variable, e.g. `ELEVENLABS_API_KEY`.
- Large rebuildable intermediates (`*-src.mp4`, `*-cut.mp4`, listed in `.gitignore`): `reel/scripts/build_rr_src.sh`
  and `reel/scripts/build_cb_src.sh` rebuild them from the clips in `reel/public/footage/`.
- Claude Code "memory": these sessions saved none; the decisions and notes are in the skills' `LOCAL.md` files and in
  the header comment of each composition in `reel/src/reelfx/`.
