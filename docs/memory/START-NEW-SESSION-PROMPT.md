# Prompt to paste into a new Claude Code session on your computer

Open a terminal in the cloned repo (`git clone -b claude/happy-fermat-cuii9h https://github.com/payalranawatppp-svg/awesome-opus-5-5-prompts.git`,
then `cd awesome-opus-5-5-prompts && claude`) and paste this as the first message:

---

You are continuing my Tooth Referral / Signal Reach project from earlier cloud sessions. Before you answer anything else:

1. Read `CLAUDE.md`, then `docs/memory/PROJECT-MEMORY.md` in full, then `docs/memory/INSTALLED-SKILLS.md`, then skim
   `docs/memory/CHAT-LOG-USER-MESSAGES.md` (every message I sent since 12 Nov) and run `git log --oneline -60`.
2. Read the project skill `.claude/skills/toothreferral-messaging/SKILL.md` and its files PRODUCT-UNDERSTANDING.md,
   PLATFORM-FEATURES.md, DASHBOARD.md and VIDEO-INDEX.md. Every script, video, carousel and caption must follow them.
3. Remember and always apply, without me repeating them:
   - Vejay's client rules: never "GP" (say general dentist), never "EHR" (say electronic health record), never
     "shared inbox", no contact CTA, staff names only Tanya, Amanda, Greg, Barbara, no doctors' names except Dr. Vance
     in the episode series, offices Gentle Dental / St. Andrew's Family Dental / Oakridge Oral Surgery, no red in our
     graphics, never condescend to the front desk, write for both general dentists and specialists, never show the
     real dev names from the recordings.
   - My Google Flow prompt style: ingredients, start image + "continue from the exact position", full background and
     every character described in every prompt, emotion, action, camera, dialogue vs voice-over stated explicitly with
     exact line and timing, and the no animation / no text / no red / no glitches negatives.
   - My editing style: Remotion in `reel/`, ElevenLabs voices (one consistent voice per character), cut silences and
     glitches, 3D glass dashboards from the coded app screens in `reel/src/app/`, text-behind words, vibrant captions,
     highest quality (4× renders for PDFs), check every frame.
   - Work rules: commit and push to `claude/happy-fermat-cuii9h`, no PR unless I ask, never store or print API keys
     (use the `ELEVENLABS_API_KEY` env var), upload to Google Drive (Toothref Claude Data) before deleting anything,
     confirm before irreversible actions, otherwise don't keep asking me for permission.
4. Check the local setup in `SETUP-LOCAL.md` (Node 22+, ffmpeg, `cd reel && npm install`, Python venv, models, skills)
   and tell me what is missing on this computer.
5. Then reply with: a short summary of where the project stands (latest deliverables and pending items from section 10
   of PROJECT-MEMORY.md), the list of skills you can see, and anything that needs my action (for example rotating the
   ElevenLabs keys and Google tokens I pasted in chat, re-authorising the 21st connector). Then wait for my next task.

---

Tip: Claude Code also loads `CLAUDE.md` automatically, so even a plain "continue the Tooth Referral work" will pick up
the memory; the prompt above makes it read the deeper files too.
