# Project skills

Installed from archives supplied by the repository owner; each skill keeps its upstream
licence (MIT, Apache-2.0 or ISC) in its folder. Claude Code loads every folder here that
contains a `SKILL.md`.

| Source | Skills |
| --- | --- |
| obsidian-skills (MIT) | defuddle, json-canvas, knap, obsidian-bases, obsidian-cli, obsidian-markdown |
| ponytail (MIT) | ponytail, ponytail-audit, ponytail-debt, ponytail-gain, ponytail-help, ponytail-review |
| agent-skills (MIT) | 25 engineering-workflow skills (api-and-interface-design … using-agent-skills) |
| claude-remotion-skill (MIT) | remotion-motion-graphics |
| video-use (MIT) | video-use (with vendored `skills/manim-video`) |
| playwright-cli (Apache-2.0) | playwright-cli |
| magic-mcp / 21st (ISC) | 21st-ui, plus the `21st` server in the repo's `.mcp.json` |
| graphify (Apache-2.0) | graphify |
| skills-only bundle | banner-design, brand, brandkit, design, design-system, design-taste-frontend(-v1), full-output-enforcement, gpt-taste, high-end-visual-design, image-to-code, imagegen-frontend-mobile/web, industrial-brutalist-ui, minimalist-ui, redesign-existing-projects, slides, stitch-design-taste, ui-styling, ui-ux-pro-max |
| awesome-design-md (MIT) | awesome-design-md (74 brand DESIGN.md files; SKILL.md written for this repo) |
| anthropics/skills (Apache-2.0), via `npx skills add` | canvas-design, frontend-design |
| pbakaus/impeccable (Apache-2.0), via `npx skills add` | impeccable (design audit/polish/critique; downloads its own engine binary to `~/.impeccable` on first run) |
| lewislulu/html-ppt-skill (MIT), via `npx skills add` | html-ppt |

`skills-lock.json` at the repo root records the five skills installed with the `skills` CLI;
`npx skills experimental_install` restores them. Anthropic's `pdf` skill is installed locally
through that lock file but is not committed: its licence does not allow redistribution, so it is
listed in `.gitignore`.

Not installed: `dev` (playwright-cli's own repo maintenance) and
`everything-claude-code-conventions` (another repository's conventions) — both describe
other projects. Duplicate copies of `playwright-cli` and `21st-ui` were identical and
installed once.

## Requirements some skills need at run time

These are not part of the repo; add them to the cloud environment's setup script (or
install locally) so they exist in every session:

- **graphify** — `pip install graphifyy` (provides the `graphify` CLI).
- **playwright-cli** — `npm install -g @playwright/cli@latest`.
- **obsidian-cli / defuddle / knap** — the Obsidian, Defuddle and Knap CLIs.
- **21st-ui / `21st` MCP** — environment variable `API_KEY_21ST` (key from 21st.dev/mcp).
- **video-use** — `ELEVENLABS_API_KEY`, ffmpeg, and its Python deps (`pip install -e .claude/skills/video-use`).

Keep API keys in the environment's secrets/variables, never in files in this repo.

## From the "15 Claude Code skills for motion designers & video editors" reel (installed 2026-10-31)

Copied unmodified from each upstream repository (each folder keeps its licence; existing copies were refreshed):

| # | In the reel | Installed as | Source | Licence |
|---|---|---|---|---|
| 1 | GSAP | `gsap-*` (8) | github.com/greensock/gsap-skills | MIT |
| 2 | Cube Motion | `cube-motion` | github.com/danielwh2/cube-motion | MIT |
| 3 | Oil Motion | `oil-motion` | github.com/oil-oil/oil-motion | MIT |
| 4 | ShaderCN | `typegpu`, `launch-shadcn-registry` | github.com/shadcn-labs/shadercn | MIT |
| 5 | Hairline | `hairline-create`, `hairline-adopt` | github.com/lucasmarkes/hairline | MIT |
| 6 | Remotion | `remotion-*` (12) | github.com/remotion-dev/skills | none stated: kept local, git-ignored |
| 7 | Evil Buttons | `evil-button-docs`, `bklit-ui` | github.com/radiumcoders/evil-buttons | Apache-2.0 |
| 8 | Motion B-roll + object separation | `motion-broll`, `object-separation`, `sound-effects`, `explainer-*` (3) | github.com/barty-bart/motion-graphics | MIT |
| 9 | Lemo Opuscar | `lemo-opuscar` (fetches its style library on first run) | github.com/lemomo-ai/lemo-opuscar | MIT |
| 10 | OpenMontage | `tools/openmontage/` (its 47 skills load when working in that folder) | github.com/guyronnen/openmontage | AGPL-3.0 |
| 11 | HyperFrames | `hyperframes*`, `media-use`, `remotion-to-hyperframes`, `reverse-any-video`, `slideshow`, `figma`, `oversized-cursor`, `changelog-video`, `cut-the-curve`, `seam-craft`, `motion-doctrine`, `captions-overlay` | github.com/heygen-com/hyperframes | Apache-2.0 |
| 12 | Diffusion Studio | `editor`, `watch` | github.com/diffusionstudio/skills (app: diffusionstudio/editor) | MIT |
| 13 | Whiteboard Video | `whiteboard-video` (needs `pip install "git+https://github.com/gnipbao/whiteboard-video-engine.git"`) | github.com/gnipbao/codex-whiteboard-video-skill | MIT |
| 14 | Video Shotcraft | `video-shotcraft` (without its `videos/` demos) | github.com/vincentwei1021/video-shotcraft | Apache-2.0 |
| 15 | Howseen Motion | `motion-design` | github.com/howseen-ai/claude-motion-design | MIT |
