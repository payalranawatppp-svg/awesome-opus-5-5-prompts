# Project memory: everything from the cloud sessions (Sept 24 – Nov 21, 2026)

Read this first in any new session. It is the condensed memory of ~2 months of chat, 331 commits and every client
rule. Deeper sources, in order: `.claude/skills/toothreferral-messaging/` (SKILL.md, PRODUCT-UNDERSTANDING.md,
PLATFORM-FEATURES.md, DASHBOARD.md, VIDEO-INDEX.md), `docs/memory/CHAT-LOG-USER-MESSAGES.md` (every user message since
12 Nov, verbatim), `docs/memory/INSTALLED-SKILLS.md`, `SETUP-LOCAL.md`, `git log`, and the header comment at the top of
every composition in `reel/src/`.

---

## 1. Who, what, where

- **User:** Nitesh (Signal Reach, nitesh@signalreach.in), video/marketing producer. Writes fast with typos; read intent,
  not spelling ("tooth ref", "toothreffer", "truth referral", "tooth Zafar" = **Tooth Referral**; "Avtar" = avatar;
  "crousle" = carousel; "google flow" = Google Flow / Veo video generator; "ss" = screenshot; "eleven/even labs" = ElevenLabs).
- **Client:** **Vejay** (spelled Vijay/Vejay), owner of **Tooth Referral** (toothreferral.com): a cloud SaaS that
  replaces static one-way dental referral web forms with a shared, two-way referral case between the referring general
  dentist's office and the specialist's office. Vejay reviews everything; his rules are law (section 3).
- **Repo:** `github.com/payalranawatppp-svg/awesome-opus-5-5-prompts`, working branch **`claude/happy-fermat-cuii9h`**
  (all work is here; `main` is the old CMS prompt collection). Clone: `git clone -b claude/happy-fermat-cuii9h …`.
- **Google Drive:** folder **Toothref** (id `1dcdEfuzk1ViZAtXvI0lXlRaPmvTOeB2p`) holds finished deliverables
  (Buried v2.mp4, buried-in-emails.mp4, Eps-2.mp4, episode4-front-row.mp4, s20-did-they-ever-send-it.mp4, CFM1/Cmf2/Cfm3.mp4,
  UCP-1.pdf, Ulcp-1.pdf, ULCp-2.pdf, Img1.png). Subfolder **Toothref Claude Data** (`1PZ5gFsuX-8L5xiWCZySGzk-P71XpLTqI`)
  is the full repo backup (5,360 files, 2.7 GB, 15 Nov) + 8 reference Google Docs (00–07). Folder **screen**
  (`1m0Nzy26yr9LornEXdsqK3ISIFUQ_CPWt`) holds the dashboard recordings `dashboard-2-lead-forms-analytics-docusign.mp4`
  and `dashboard-3-case-audit-trail.mp4` (local copies in `reel/public/screen/`).
- **Week-1 launch links (Drive):** Day 1 Buried in Emails v1 `1DNz7KdbK5SxNp_ety7PHv6eoF8lnVMW4`; Day 2 carousel 1
  `1RIHICtpyWQeK_K8T0G82aFyFj_K9a0zE`; Day 3 Buried v2 `1HUm8GC_l8n0KYs1QtYH9PG5unF8gZL4E`; Day 4 carousel 2
  `1hB9hVRxQ5aVdVPxo42TG061KXbiGxV4q`; Day 5 image post `1sL5pFAgt9rxPQ1GPcJsMAqma68pcShkz`.

## 2. Standing working rules (from the user)

1. **Commit and push everything** to `claude/happy-fermat-cuii9h` when done. No PR unless asked. Commit trailer used:
   `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` (+ a `Claude-Session:` line in the cloud). No model ids in commits.
2. **Never commit, print or reuse API keys/tokens.** The user pasted ElevenLabs keys and Google OAuth codes/tokens in
   chat several times — all must be treated as compromised; advise rotating. Keep keys in env vars
   (`ELEVENLABS_API_KEY`), never in files in the repo.
3. **"Before deleting anything, upload it to Drive"** (Toothref Claude Data). Confirm before irreversible actions
   (deleting files, sending email). Otherwise the user said: "I am allowing all permission, don't ask me again and
   again" — work autonomously.
4. Never download whole Drive videos when only seconds are needed (VIDEO-INDEX.md has timestamps).
5. Scripts are delivered as **PDF** (built with Python → HTML → Playwright PDF, see `scripts-incoming-referrals/src/`),
   usually also `.md`. "Don't include prompts" unless asked; when asked, Google Flow prompts are full and per clip.
6. Videos are delivered as MP4 renders in `reel/renders/…`, committed, and sent to the user.
7. Highest quality always: the user hates blur ("crystal clear when zoomed"). PDFs with 3D/graphics → render pages
   as 4× PNG (`deviceScaleFactor: 4`) and assemble with img2pdf; never let Chromium print rasterise 3D/shadows.
8. Check every frame: no overlaps, no text covering faces, no AI glitches left in; cut "unusual movements", silences,
   voice overlaps, wrong-speaker lines.

## 3. Client rules (Vejay) — apply to EVERY script, video, carousel, caption, still

- **Never "GP"** → "general dentist(s)" / "referring general dentist" / "referring office".
- **Never "EHR"** → "electronic health record" (hashtag #ElectronicHealthRecords). PMS may be written as
  "Practice Management Software (PMS)" when the client's own text uses it.
- **Never "shared inbox".** No "Contact us" page / contact CTA (CTA = toothreferral.com / "set up in about 5 minutes",
  or none).
- **People:** staff names only **Tanya, Amanda, Greg, Barbara**. **No doctors' names** — EXCEPT the episode series,
  where the user approved **Dr. Vance** (oral surgeon). Patients may be named (Mrs. Ortiz/Maria Ortiz, Mr. Turner,
  Michael Turner, Carter Wiley in recordings, etc.). Never show the real dev/test names that appear in the recordings
  (Lee Davis, Jonathan Kilbourn, Barbara Smith, Jane White, Tom Colpack, Flora Gibson, Gary Charlson, The Dental Center,
  umairasma31@gmail.com, hamza@…).
- **Offices (demo data):** Gentle Dental (referring general dentist), St. Andrew's Family Dental (specialist); episode
  series uses **Oakridge Oral Surgery** (Dr. Vance's practice, Ep 4–5).
- **No red** in our own graphics (reads as blood) → amber #FFB020/#E89D15, purple, yellow. Real app recordings keep
  their native colours (incl. red badges).
- **Never condescend to the front desk** (they make buying decisions). Problems are human error / overload, never
  incompetence. Don't say "a coordinator steals follow-ups"; say "nobody knows what still needs to be done".
- Write for **both** general dentists and specialists; show both directions of communication; each carousel
  conversation slide uses a different conversation.
- One message per post. Big idea: **"Not just a form — a system for the team."**
- ROI only as "potential / up to"; no per-incident dollar countdowns. Ghost rate stat: 46% (Kelton Research).
- Cloudflare spam protection on the insurance link is **confirmed** (user, 18 Nov).
- Avoid AI look/voice: one consistent voice per character, film grain, no glossy motion. Don't remove AI watermarks
  from third-party material (Flow watermark on our own clips is removed with ffmpeg delogo).
- Captions/posts are **LinkedIn only**.
- Analytics numbers/screens only from `reel/public/analytics-ref/` (28 referrals, 3.7 h, 76%, 7% ghost rate, staff
  Amanda/Tanya/Barbara).

## 4. Product facts (short; full in PLATFORM-FEATURES.md)

One case per referral shared by both offices; Office Communication (two-way messages, @mentions, replies/quotes,
attachments); Administrative Notes (private to the team, reply flow, Journey); status board (Left a Voicemail,
Voicemail Not Set Up, Unable to Contact, Declined Appointment, Referred Out, Cancelled, Spoke with Patient /
Scheduled, Consultation Scheduled/Completed, Other); activity log / audit trail; X-rays & documents; insurance
cards + "Request from patient" secure link (patient snaps front/back, no account, HIPAA, Cloudflare); Prepare
Consultation Note with templates + smart variables ({{patientName}} etc.), route to doctor, DocuSign e-signature;
signed notes visible to both offices; copy notes into the PMS/electronic health record; Provider's **Day-Prep
Station** (pre-op viewer); Website Lead Forms (embeddable referral form + Contact Us page builder, embed trial);
Analytics (Received/Sent, KPIs, funnel, senders, procedures, clocks, needs attention, staff, outcomes, sources,
status board, Export PDF); Notifications; Invite your Network; Access PIN; set up in ~5 minutes.

## 5. Characters and voices (keep consistent across the series)

| Character | Look (Flow avatar) | Role | ElevenLabs voice |
|---|---|---|---|
| Tanya | late 20s, long dark curly hair in high ponytail, lavender scrubs, gold hoops | Front Desk Coordinator (Dr. Vance's practice) | Jessica `cgSgspJ2msm6clMCkdW9` (Ep2); Matilda in Buried v1/v2 |
| Amanda | early 40s, black hair low bun, black glasses, olive scrub top over white long sleeve | Office Manager / Treatment Coordinator | Bella `hpp4J3VqNfWAUOO0d1Us` (Ep2); Jessica in Buried v1 |
| Greg | late 20s, warm brown skin, short black curly hair, trimmed beard, ceil-blue scrubs, smartwatch | Front Desk Coordinator | Will |
| Barbara | referring office front desk (Gentle Dental); in Script 20 had specs on head, blue dress | Front Desk Coordinator, Gentle Dental | Matilda |
| Dr. Vance | oral surgeon | Oakridge Oral Surgery / St. Andrew's in Ep2 screens | Eric `cjVigY5qzO86Huf0OWal` |
| Mrs. Ortiz | nervous implant-consult patient | Ep2 | Sarah `EXAVITQu4vr4xnSDxMaL` |
| Lily | Tanya's ~8-year-old daughter, navy velvet recital dress | Ep4 | — |
| Script 20 cast | Greg, Sarah (jacket in hand), Barbara, David (young, blue T-shirt), Tanya (purple), Amanda | Script 20 | — |
| Gesture-series host | male, early 30s, short dark textured hair low fade, trimmed beard, black knit sweater, silver chain | "Don't / Do" series | (Flow voice / pick in ElevenLabs) |

Presenter defaults from older videos: male "Chris" `iP95p4xoKVk53GoZ742B`, female "Bella"; Vejay prefers the female presenter.

## 6. Google Flow prompt house style (the user insists on it)

Every clip prompt contains, in this order: **Ingredients** (background image + each avatar image) → **Start image**
("the last frame of clip N" or a named cast image) and **"Continue from the exact position in the start image … no
jump, reset or change of outfit"** + explicit starting positions → format line (16:9 or 9:16, 8 s, one continuous
shot, photorealistic, Sony FX3 look, film grain, not AI-looking) → **full background description** (repeat it every
time) → **every character's full description** (so Flow never confuses who is who) → **Emotion** (matched to the
dialogue) → **Action** (natural movement, small pauses, head moves) → **Camera** (exact angle, same as the image) →
**DIALOGUE (on camera, lip-synced)** or **VOICE-OVER (off screen, not lip-synced)** stated explicitly, speaker, voice
description, the line "say it once, word for word", timing, "everyone else keeps mouth closed" (fixes wrong-speaker
lines) → negatives: **no animation, no cartoon/CGI, no on-screen text/captions/titles, no readable screens, no logos,
no red, no extra people, no warped hands, no lip-sync drift, no jump cut**. Max 3 characters per scene when asked. PDF
layout: per clip page = script direction + emotion + dialogue + full prompt + the avatar prompts for that clip.

## 7. Editing house style (Remotion, `reel/`)

Remotion 4.0.535 project. Pattern per episode (see `reel/src/reelfx/Ep2Story.tsx` header): PLAN/EDL of Flow clips
(`public/<ep>/uNN.mp4`, Flow watermark removed with `delogo=x=572:y=1132:w=56:h=56` then lanczos to 1080×1920,
loudnorm) → cut silences/glitches → **ElevenLabs** re-voice (speech-to-speech `eleven_multilingual_sts_v2` keeps
timing; TTS `eleven_multilingual_v2` / `eleven_v4` for missing lines) → **3D transparent "Glass" dashboards** built
from coded app screens rendered live via `<Freeze>` with camera keyframes, timed to the voice → **text-behind words**
(RVM person mattes `scripts/matte_stream.py` → `*-cut.webm`) → vibrant word captions (faster-whisper word timings
`scripts/transcribe.py`) → chips, whips, punch-ins, light leaks, grain, soft SFX (`public/audio/sfx`) and a quiet
music bed → end card. Loudness about −14 to −17 LUFS. Render: `npx remotion render <Id> out.mp4`; stills:
`npx remotion still <Id> f.png --frame=N`. Use the **earshot** skill to listen/check audio.

## 8. Coded Tooth Referral app copy (for all future dashboard videos)

`reel/src/app/`: `AppShell.tsx` (sidebar, header, viewport presets **912** (default, dashboard-3), **869**
(dashboard-2), **842** (analytics-ref)), `Incoming.tsx`, `CaseDetail.tsx` + `CaseSections.tsx` (Details tab, full
3,053 px page, Messages tab), `LeadForms.tsx`, `Analytics.tsx`, `ConsultNote.tsx` (Prepare Consultation Note modal +
success toast). Compositions: `App-Incoming`, `App-Incoming-Top`, `App-CaseDetail`, `App-CaseDetail-FullPage`,
`App-CaseMessages`, `App-LeadForms(-869)`, `App-Analytics(-FullPage)`, `App-ConsultNote-Modal`. Pixel match vs the
recordings: 93–96% (`reel/scripts/app_diff.py <comp> <ref> <out>`). Assets cropped from recordings in
`reel/public/app/`. **Default data still uses the recording's names (Barbara Smith, Tom Colpack, Dr Lee Davis…) —
swap to approved names via props before any public video.** Not yet built: Lead-form builder editor, DocuSign signing
screen, Outgoing, Notifications, Notes, Settings, Offices. Older clean screens: `reel/src/reelfx/DayPrepClean.tsx`,
`CaseChat.tsx`, `CompletionNote.tsx`, `AnalyticsDemo.tsx`.

## 9. Everything made, in order (deliverables and where they are)

**Sept–Oct:** CMS prompt collection (main). Signal Reach Instagram reel + effects library (42 effects, showcase).
ToothReferral effects video, animated dashboard scenes (TR-01…16, transparent WebMs, showreel, depth reel), UGC #2 +
ad version, Chocolate Box (2:10), PDF Dead End, Referral Roast, Where The Hell Is That X-Ray, Leak Inside Your
Office, Front Desk Magic Show (client-revised), Analytics demo. Many skills installed (GSAP, Anime.js, Three.js, R3F,
ai-film-skills, /effects, OpenFilm, motion-design set, hook-reference, huashu-motion, argo, video-director, explainroo).

**Scripts (`scripts-incoming-referrals/`):** Scripts 1–3 (Phone Tag Funeral, Referral Roast, X-Ray), 4–7, 5–10
humour, 9 (consultation-note templates + DocuSign, influencer style), 11–12 (client call), **13 Buried in Emails**
(+ v2 natural, approved by Vejay as the brand-awareness foundation), 14–17 conversational stories (+ Flow), 18 five
conversations, 19 Day in the Life (endo start-up), 19-A Day One founder selfie (solo, clean look), **20 Did They Ever
Send It?**, 21–23 feature series (story-first, 90–100 s, one feature each), **21 v2 / Episode 2 No More Phone Tag**,
**Episode 3 Tanya's Day Off** (carousel exists: `carousels/episodes-2-4/carousel-ep3-tanyas-day-off.pdf`), **Episode 4 Front Row** (Oakridge, Lily's recital, completion-note templates, route to doctor, e-signature, copy to
PMS), **Episode 5 The Numbers** + **5B The Voicemail** (analytics-focused), **Old Way vs Tooth Referral** gesture
series (see 10).

**Videos (`reel/renders/`):** buried-in-emails.mp4 (v1, all audio re-dubbed eleven_v4, "eight referrals" line),
buried-in-emails-v2.mp4, s20-did-they-ever-send-it.mp4 (v3), camp-*.mp4 (form vs software, form compare v1/v2, same
referral two ways, day in the life, Day One founder), ep2/episode2-no-more-phone-tag.mp4 (94 s, latest fix 19 Nov),
ep4/episode4-front-row.mp4 + completion-note-ep4.mp4, preop/dayprep-clean.mp4 + casechat-clean.mp4,
kawasaki/kawasaki-flip-4k.mp4 (2 s) + kawasaki-flip-5s-4k.mp4 (5 s, softer glow) + reveal, app/*.png comparisons.

**Carousels (`carousels/`):** linkedin v1–v7, web-form posts (3 carousels + 2 image posts, per-post PDFs), feature
posts (A Office Communication, B Notes/templates, C Insurance), vejay-brief, episodes-2-4 (separate per episode: ep2 phone tag, ep3 Tanya's day off, ep4 front row, plus
"three days, one front desk"; professional titles), client-revisions-2026-11-18 and **client-exact-2026-11-18** (oral surgery 3-tasks carousel
with the client's exact text but **no "TASK 1/2/3" labels** (user asked 18 Nov), endodontic insurance carousel,
combined `ToothReferral-Carousels-Insurance-and-Oral-Surgery-UHD.pdf`, LinkedIn captions; original post copy saved).

**Launch (`launch/week1/`):** Week-1 schedule PDF with workflow graphic, captions and Drive links, Excel workbook, email
draft to Vejay, Day 5 image post PDF.

## 10. Latest work (19–21 Nov) — the state to continue from

- **"Old Way vs Tooth Referral" hand-gesture series** (inspired by Instagram reel DVEDqmBDSRO, presenter pointing
  "Don't" / "Do"): `scripts-incoming-referrals/Old-Way-vs-Tooth-Referral-8s-Clips-Google-Flow.pdf/.md` (built by
  `src/build_old_way_gesture.py`) + short `Old-Way-vs-Tooth-Referral-Clip-Plan-and-Dialogue.pdf`. 12 clips × 8 s,
  vertical 9:16, **male host**, dim warm home-studio background like the reel (no red; cognac chair). Every clip is a
  **"Don't … / Do …" pair**: "Don't" = traditional waste, said while his **LEFT hand points up toward his left (top-right
  of the frame) and HOLDS still the whole line**; then the left hand drops and his **RIGHT hand points to the top-left
  and HOLDS through the whole "Do" line to the end of the clip**; next clip starts from that pose. No finger taps.
  "Tooth Referral" spoken only in clips 01–02. Topics: hook, how referrals arrive, updates, communication, status,
  insurance, consult notes, efficiency, website leads, analytics, what makes it different, close. Also an earlier 60 s
  single-script version `Old-Way-vs-Tooth-Referral-60s-Gesture-Script.md`.
- **Episode 2 fix:** missed-call shot (u07) starts at 1.2 s (no pickup/hang-up) and freezes on Tanya's "one moment"
  finger from 4.5 s with an animated "Gentle Dental calling…" ringing chip, then "Missed call · Gentle Dental"; thud SFX
  removed. Render committed (94 s).
- Pending/possible next: build the remaining app pages; swap recording names in the app copy to approved demo names;
  Episode 5 video edit when Flow clips arrive; rotate leaked keys.

## 11. Local setup

See `SETUP-LOCAL.md`: clone the branch, `cd reel && npm install`, Node 22+, ffmpeg, Python venv (opencv, numpy,
faster-whisper, onnxruntime), RVM model, `npx skills add remotion-dev/skills`, OpenFilm, /effects setup, earshot
(`.claude/skills/earshot`), ElevenLabs key in `ELEVENLABS_API_KEY`. Fonts in `reel/public/fonts` (Inter, Plus Jakarta Sans).
