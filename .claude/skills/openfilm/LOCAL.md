# Local notes for this project (not part of the upstream skill)

- Installed from github.com/openfilm/openfilm (MIT, see LICENSE) on 2026-10-27 at commit ea8cf6d: `skills/openfilm/SKILL.md`
  copied here unmodified. The skill is a pointer: the `openfilm` CLI prints the manual and holds the real skills.
- CLI: `npm i -g openfilm@0.2.6` (on a fresh machine run it again; `openfilm doctor` checks everything).
- Its film skills (collage, keynote, long-to-short, lyric-video, motion-graphics, presenter-pip, replicate,
  screen-demo, vintage-film, plus whiteboard added from the repo) are switched on; `openfilm skills` lists them,
  `openfilm skill <name>` prints one.
- Browser: OpenFilm's playwright-core 1.61.1 needs chromium-headless-shell v1228. In the cloud container install it
  next to the pre-installed browsers without touching them:
  `PLAYWRIGHT_SKIP_BROWSER_GC=1 node $(npm root -g)/openfilm/node_modules/playwright-core/cli.js install chromium-headless-shell`
  (the Remotion edits keep using chromium_headless_shell-1194). No GPU here, so renders use SwiftShader: slower, correct.
- Tested: a 2 s 1080x1920 page film renders with `openfilm render`.
