# Claude editing prompt: UGC 17 "Five moments every specialist office knows"

Paste everything below the line into Claude Code, in the repo `awesome-opus-5-5-prompts`, branch `claude/happy-fermat-cuii9h`.

---

You are editing UGC 17, "Five moments every specialist office knows", a vertical Tooth Referral video for specialist front desks,
treatment coordinators and office managers. Build it in the Remotion project in `reel/`. Work autonomously, check every frame,
then render, commit and push.

## 0. What changed from the script

- **Ethan never appears on camera.** There is no Ethan avatar and no studio. Ethan is a **voice-over only**, for the hook, the five
  fixes and the close.
- **Every time Ethan speaks, the picture is a 3D transparent glass Tooth Referral dashboard**, built from scratch in code. It shows
  exactly what he is saying at that moment, with the story's names and offices.
- The five office scenes (S1–S5) are the Google Flow clips. Their dialogue is **re-dubbed** so that every character's voice matches their avatar and stays the same in every scene (see 3b).
- **There is no silence anywhere.** The video goes scene, then voice-over, then scene, back to back.

## 1. Output

- Composition id `UGC17-FiveMoments`, 1080×1920, 30 fps, about 92 s.
- Code goes in a new folder, `reel/src/ugc17/`, registered in `reel/src/Root.tsx`.
- Render to `reel/renders/ugc17/ugc17-five-moments.mp4` (H.264, CRF 16, AAC 192 kbps).
- Also save a contact sheet with one frame per beat (`reel/renders/ugc17/beats.png`) and the beat table as `reel/renders/ugc17/edl.md`.

## 2. Names and data (use exactly these, everywhere)

The user asked for this video to use the UGC 17 cast names. They override the default demo names in `CLAUDE.md`, but for this video
only. Never show Tanya, Amanda, Greg, Barbara, Gentle Dental, St. Andrew's, Carter Wiley or any name from the screen recordings.

| What | Value |
|---|---|
| Specialist office (the app account) | **Harborview Dental Group** |
| Logged-in user | **Rachel Moore**, Treatment Coordinator (initials RM) |
| Harborview team | **Kevin Tran**, Front Desk (KT) · **Dr. Elena Ruiz**, Associate Dentist (ER) · **Jenna Park**, Front Desk, shown as "inactive" (JP) |
| Referring office | **Lakeside Family Dental** (green dot = Connected Network Member) |
| Lakeside team | **Dr. James Whitaker**, Owner Dentist (JW) · **Megan Cole**, Office Manager (MC) |
| Patient 1 | **Olivia Bennett**, DOB 04/12/1988, referred for **Implant consultation, tooth #19**, status **Consultation Scheduled**, consult **Nov 14, 2026, 10:00 AM** |
| Patient 2 | **Daniel Ortiz**, DOB 09/03/1971, referred for **Implant placement, tooth #30** |
| Other rows in the lists | Emma Hughes (Riverside Family Dentistry, New) · Marcus Lee (Maple Grove Dental, Left a Voicemail) · Sofia Ramirez (Lakeside Family Dental, Scheduled) |
| Dates | Today = **Mon, Nov 10, 2026** |

Put every name, date and message in one file, `reel/src/ugc17/data.ts`. No screen may hard-code text that contradicts it.

## 3. Inputs

1. **Flow clips.** The user puts them in `reel/public/ugc17/`: `s1.mp4`, `s2.mp4`, `s3.mp4`, `s4.mp4` and `s5.mp4`.
   - Before editing, remove the Flow sparkle watermark with `delogo`; find it per clip and check the frame afterwards.
   - Scale to 1080×1920 with lanczos.
   - Loudness-normalise the dialogue to −16 LUFS.
   - If a clip is missing, stop and list what is missing.
2. **Ethan's voice-over.** Generate it with the ElevenLabs API, using the Ethan voice chosen in 3b.
   - Read the key from the `ELEVENLABS_API_KEY` environment variable. Never print or commit it.
   - Settings: model `eleven_multilingual_v2`, stability 0.45, similarity 0.8, style 0.35, speed 1.05, output `mp3_44100_128`.
   - Generate one file per beat (`vo-hook.mp3`, `vo-fix1.mp3` … `vo-fix5.mp3`, `vo-close.mp3`) into `reel/public/ugc17/vo/`.
   - Trim each file's leading and trailing silence to 40 ms.
   - Transcribe each file with `reel/scripts/transcribe.py` (faster-whisper, word timestamps) to `reel/src/ugc17/vo-words.json`, and check
     that every word matches the script below. Regenerate any take that misses or adds a word.
3. **Scene word timings.** Transcribe each Flow clip the same way to `reel/src/ugc17/scene-words.json`. Use these timings to trim each
   scene to its spoken lines.

## 3b. Re-dub every character so each voice matches their avatar

Flow gives every clip a random voice, so the same person can sound different from scene to scene, and the voice may not fit their look.
Re-voice **every spoken line in S1–S5** with ElevenLabs speech-to-speech, so that:

- each character has one fixed voice for the whole video;
- that voice matches their age, gender and look;
- the timing and lip-sync stay exactly as Flow made them.

**Voice per character.** Choose a voice for each person from the account's voices; list them with the API and pick by labels and preview. If no voice
fits, create one with ElevenLabs Voice Design from the description below and save it. Write the chosen voice ids into
`reel/src/ugc17/voices.json` and reuse them for every line.

| Character | Appears in | Avatar | Voice to match |
|---|---|---|---|
| Rachel Moore | S1, S2, S3, S4 | woman, early 30s, dark brown low ponytail, navy scrubs | warm, mid-range American female, early 30s, quick and friendly, slightly tired; the same voice in all four scenes |
| Kevin Tran | S1, S4 | man, late 20s, black hair, glasses, light-blue scrubs | light, friendly American male, late 20s, casual and upbeat |
| Dr. Elena Ruiz | S2, S3 | woman, early 40s, low bun, white lab coat over teal scrubs | confident, brisk American female, early 40s, warm, a touch of humour; clearly lower and more assured than Rachel |
| Dr. James Whitaker | S5 | man, mid 50s, grey hair, glasses, lab coat | calm, deep, kind American male, mid 50s, slightly puzzled |
| Megan Cole | S5 | woman, late 30s, auburn hair, plum scrubs | warm, honest American female, late 30s, hesitant on this line |
| Ethan (voice-over) | hook, fixes, close | (voice only) | energetic, friendly, conversational American male, early 30s; clearly different from Kevin and Dr. Whitaker |

The two female voices that share scenes, Rachel and Dr. Ruiz, must be easy to tell apart. So must the two male voices in the office, Kevin and Ethan.

**How to re-dub, line by line:**

1. Split each Flow clip's audio into one segment per spoken line, using `scene-words.json`: from the first word − 0.05 s to the last word + 0.08 s.
   Check who speaks each line against the script.
2. Send each segment to speech-to-speech:
   - model `eleven_multilingual_sts_v2`, with that character's voice id;
   - `remove_background_noise=true`, stability 0.55, similarity 0.85, output `mp3_44100_128`.
   - This keeps the original timing, so the lips still match.
3. Transcribe each result and compare it word for word with the line. If a word is missing, added or mispronounced, run it again with a new
   seed. If speech-to-speech still fails, use text-to-speech in the same voice and time-stretch it (at most ±8 %) to the original
   segment length.
4. Put each re-voiced line back at its exact original start time. Under the whole clip, lay the scene's room tone, taken from the
   non-speech parts of the Flow audio with the voices removed, so the space still sounds real. Crossfade 3 frames at both ends of each line.
5. Mute the original Flow voices completely, so no double voice is ever heard.
6. Loudness-match all characters to −16 LUFS per line, so no one is suddenly louder.
7. Lip-sync check: for every line, compare the re-voiced line's word starts with the original Flow word starts. Any word more than 3 frames
   off gets fixed with a small time-stretch or a new take.
8. Listen with `earshot`:
   - `describe` on one line per character, to confirm the gender and age read;
   - `compare` Rachel's lines across S1–S4, which must come out as the same voice.

Save the re-voiced dialogue in `reel/public/ugc17/dub/` as `s1-01-kevin.mp3` etc. and the mapping in `reel/src/ugc17/dub.json`.

## 4. The voice-over lines (word for word)

| Beat | Ethan says |
|---|---|
| HOOK | Sound familiar? Here are five moments every specialist office knows, and how to handle each one. |
| FIX 1 | When someone leaves, the referral shouldn't leave with them. Every update and message stays on the case, so it lives in the platform, not one person's head. |
| FIX 2 | Texting X-rays from a personal phone is one of the most common HIPAA slip-ups. Keep it on the case, and open it from any browser. |
| FIX 3 | Hallway questions disappear. Put it in a private note and tag the doctor. The answer waits on the case, and the other office never sees it. |
| FIX 4 | Turn that Word letter into a template once. Patient and doctor details fill themselves in, the doctor signs digitally, and it goes straight back. |
| FIX 5 | If a patient declines, mark it on the case with a short note. The referring dentist sees it the same day, not at the next recall. |
| CLOSE | None of these are big problems on their own. Together, they're where referrals slip. The dashboard you just saw is Tooth Referral. |

"Tooth Referral" is said once, at the very end.

## 5. Timeline (planned; retime every beat to the real word timings)

The times below assume Ethan speaks at about 2.9 words per second. After generating the voice-over, rebuild the table from
`vo-words.json` and `scene-words.json`:

- every action marked "on *word*" lands within ±3 frames of that word's start;
- every beat starts on the frame the previous one ends.

| Time | Beat | Audio | Picture |
|---|---|---|---|
| 0.0–7.0 | **S1 cold open** | Kevin: "Lakeside's asking where we are on the Bennett referral." Rachel: "No idea. Jenna handled that one, and Friday was her last day." | Flow clip S1 |
| 7.0–12.6 | **HOOK** | Ethan VO (hook) | Glass dashboard: Incoming Referrals (6.1) |
| 12.6–21.6 | **FIX 1** | Ethan VO (fix 1) | Glass dashboard: Olivia Bennett case, history (6.2) |
| 21.6–28.6 | **S2** | Dr. Ruiz: "Can you just text me Olivia's file? I'm running between rooms." Rachel: "From my phone?" Dr. Ruiz: "Yeah, that's a bad idea, isn't it." (use whatever the Flow clip actually says) | Flow clip S2 |
| 28.6–36.8 | **FIX 2** | Ethan VO (fix 2) | Glass dashboard: X-rays on the case (6.3) |
| 36.8–43.8 | **S3** | Rachel: "Doc, Olivia's pano is from 2023. Do we take a new one before her consult?" Dr. Ruiz: "Good question. Remind me after lunch." | Flow clip S3, ending on Rachel's look at the clock |
| 43.8–52.6 | **FIX 3** | Ethan VO (fix 3) | Glass dashboard: Administrative Notes (6.4) |
| 52.6–58.6 | **S4** | Kevin: "You're still here?" Rachel: "Retyping Dr. Ruiz's consult letter. Same letter, new patient name, every time." | Flow clip S4 |
| 58.6–67.2 | **FIX 4** | Ethan VO (fix 4) | Glass dashboard: template, consultation note, e-signature (6.5) |
| 67.2–74.2 | **S5** | Dr. Whitaker: "Daniel Ortiz is back for his cleaning. Did he ever have that implant done?" Megan: "I… don't know. Nobody ever told us." | Flow clip S5 |
| 74.2–82.4 | **FIX 5** | Ethan VO (fix 5) | Glass dashboard: Declined Appointment, both offices (6.6) |
| 82.4–90.4 | **CLOSE** | Ethan VO (close) | Glass recap of the five fixes, then the logo (6.7) |
| 90.4–92.4 | **END CARD** | music tail | Logo, toothreferral.com, "Save this for your next team meeting." |

**No-silence rules**
- Trim every scene clip to 0.08 s before its first word and 0.12 s after its last word. The one exception is S3, which keeps Rachel's
  clock look: up to 0.8 s after "after lunch".
- The voice-over starts on the first frame of the dashboard beat. The next scene's first word comes at most 0.15 s after the voice-over's
  last word.
- The pause between two lines inside a scene can be at most 0.35 s; cut out any longer pause with an invisible punch-in (1.06 scale).
- Under everything, at −30 LUFS: a quiet music bed, plus each scene's room tone crossfaded over 6 frames across every cut.
- Check with `ffmpeg silencedetect=noise=-38dB:d=0.25` on the voice and dialogue stem. It must report **no** silences, apart from the end card.

## 6. The 3D transparent glass dashboard (build it from scratch)

Build these components in `reel/src/ugc17/`. Use the real app copy in `reel/src/app/` as a reference for the visual language (layout,
Inter font, purple #6D4AE8, sidebar items, status pills, Office Communication, Administrative Notes), but write new components that
read only from `data.ts`.

**Shared kit**

- **`GlassStage`**, the background behind every dashboard beat:
  - the last frame of the previous scene, frozen;
  - blur ramping from 0 to 22 px and brightness to 0.55 over 8 frames;
  - a slow 1.00 → 1.04 scale;
  - a soft purple glow (radial, #6D4AE8 at 18 %) behind the glass.
  - The hook uses the S1 freeze; the close uses the S5 freeze.
- **`GlassCard`**, the dashboard container:
  - Glass:
    - frosted glass with `backdrop-filter: blur(28px) saturate(140%)`;
    - fill rgba(255,255,255,0.16) and a 1.5 px border rgba(255,255,255,0.45);
    - an inner top highlight and a 40 px soft shadow;
    - corner radius 28 px.
  - Contents:
    - The app UI sits inside the glass on translucent white panels (rgba(255,255,255,0.88)).
    - Text is always solid, full-contrast ink (#17142A), never transparent.
  - Entrance:
    - over 14 frames, perspective 1600 px with rotateX 14° → 3°, rotateY −12° → −2°, scale 0.86 → 1, opacity 0 → 1;
    - spring with damping 18;
    - a light sweep crosses the card once.
  - Exit: zoom-through into the next scene (see 7).
- **`AppFrame`**, a desktop dashboard at 1440×900 design size, scaled to fit the card:
  - left sidebar: Harborview Dental Group, Tooth Referral logo, Analytics, Referrals (Incoming, Outgoing, Cases Completed),
    Notifications (badge), Notes, Website Lead Forms, Settings;
  - top bar: page title, Provider's Day-Prep Station, Invite your Network, New Referral, and the user chip "Rachel Moore ·
    Treatment Coordinator".
- **`Cursor`**:
  - a macOS-style arrow, 1.4× size, with a soft shadow;
  - moves on eased Bézier paths (never straight robotic lines), 10–16 frames per move;
  - on click: scale 0.85 plus a purple ripple and a soft click sound.
  - **The cursor is always visible during dashboard beats.**
- **`Camera`**:
  - Each beat opens on the **full dashboard, completely visible** inside the card: at least 0.8 s at 1.0× before any zoom, with the whole card in the
    safe area x 50–1030, y 240–1480.
  - Then the camera **zooms in on the cursor's target**, 1.6×–2.2×, over 12–16 frames with an ease-in-out curve. It follows the cursor smoothly with
    some lag, like a real screen-recording zoom, and adds 3 px motion blur only while moving.
  - Zoom out to 1.0× before the beat ends.
  - Never crop a sentence the viewer is meant to read; every zoomed frame keeps its text inside the frame.
- **Highlights:** while a key element is being talked about, it gets a 2 px purple outline that glows (#6D4AE8 at 60 %), plus a 4 % lift.
- **Captions:**
  - word-by-word captions for Ethan and for the scene dialogue, in the band y 1520–1700;
  - Inter 800, 54 px, white with a dark 6 px shadow, at most 2 lines;
  - the current word is highlighted in purple; the problem words ("leaves", "personal phone", "Hallway", "retyped", "declines") are amber #FFB020.
  - Captions never cover the cursor target.
- **Tracker:**
  - five dots numbered 1–5 at the top left (x 60, y 120);
  - the current case fills purple, finished cases get a check mark.
  - It appears on the hook and stays through FIX 5.
- **Chips:**
  - At the end of each fix, two glass chips stack near y 1380:
    - the old way, in amber with ✕;
    - the new way, in green #22C55E with ✓.
  - Chip text for each fix is given in its section below. Never use red anywhere.

### 6.1 HOOK (7.0–12.6) · Incoming Referrals
- **"Sound familiar?"**:
  - S1 freezes and blurs, and the glass card rises in.
  - Incoming Referrals list shows 5 rows: Olivia Bennett (Lakeside Family Dental, **Consultation Scheduled**, Last update "Nov 4 · Jenna Park"),
    Emma Hughes, Marcus Lee, Sofia Ramirez, Daniel Ortiz (Lakeside Family Dental, Scheduled).
- **"five moments"**: the tracker dots 1–5 pop in one after another, 3 frames apart. A kinetic headline "5 moments every specialist office knows"
  types in above the card at y 180–300 (Inter 800, 64 px, white).
- **"how to handle each one"**: the cursor glides to Olivia Bennett's row; the row lights up.
- Last 6 frames: click on the row, which hands off to FIX 1 inside the same card. No cut.

### 6.2 FIX 1 (12.6–21.6) · History stays on the case
Screen: Olivia Bennett's case, Details tab. Right column: **Activity history**. Entries pop in from top to bottom, one every 6 frames, each with
an avatar, name, office and time:
1. "Nov 3, 8:41 AM · Megan Cole (Lakeside Family Dental) · New referral sent · Implant consultation #19"
2. "Nov 3, 9:05 AM · Jenna Park · Status → Received"
3. "Nov 3, 2:30 PM · Jenna Park · Left a Voicemail"
4. "Nov 4, 10:20 AM · Jenna Park · Message to Lakeside: 'Reached Olivia, booking her consult for Nov 14.'"
5. "Nov 4, 10:24 AM · Jenna Park · Status → Consultation Scheduled · Nov 14, 10:00 AM"
6. "Nov 10, 9:12 AM · Rachel Moore · Viewed case"

Beats:
- **"When someone leaves"**: full view of the case; Jenna Park's avatar shows a small grey "inactive" tag.
- **"the referral shouldn't leave with them"**: zoom 1.8× onto the history column as entries 1–5 pop in.
- **"Every update and message"**: the cursor runs down the entries; entry 4, the message, gets the highlight.
- **"stays on the case"**: zoom shifts to the status pill "Consultation Scheduled · Nov 14, 10:00 AM".
- **"so it lives in the platform"**: entry 6 appears, with Rachel Moore's name.
- **"not one person's head"**: the camera zooms out to the full case.
- Chips: ✕ "Jenna knew" → ✓ "Full history on the case".

### 6.3 FIX 2 (28.6–36.8) · X-rays stay on the case
Screen: Olivia Bennett's case, scrolled to **Attachments · shared with both offices**. X-rays: "Panoramic · Mar 2023" and "Bitewings · Mar 2023"
(realistic grey X-ray thumbnails, no real patient images). Documents: "Referral letter.pdf".

Beats:
- **"Texting X-rays from a personal phone"**: full view.
  - Over the left corner of the card, a small amber glass phone mock-up slides in, showing a text bubble with an X-ray photo, and is struck
    through with an amber ✕. This is the old way.
  - It slides out by "slip-ups".
- **"one of the most common HIPAA slip-ups"**: the cursor moves to the X-rays section and the camera zooms 1.7×.
- **"Keep it on the case"**: click on "Panoramic · Mar 2023". A viewer opens inside the card with the X-ray large, plus the lock line
  "Shared with both offices · Encrypted".
- **"open it from any browser"**:
  - The card tilts 6° and shrinks to show a thin browser frame around it, with the address bar `app.toothreferral.com` and a lock icon.
  - A second, smaller glass frame (a tablet) shows the same viewer, so the same case is open on two devices.
- Chips: ✕ "Personal phone" → ✓ "On the case, secure".

### 6.4 FIX 3 (43.8–52.6) · Private note, tagged
Screen: Olivia Bennett's case. Right column: **Administrative Notes**, with the label "Private · only your office" and a lock icon.

Beats:
- **"Hallway questions disappear."**: full view; the empty notes composer is highlighted.
- **"Put it in a private note"**:
  - The camera zooms 2.0× onto the composer.
  - Rachel's note types itself at a natural speed: "@Dr. Elena Ruiz Olivia's pano is from Mar 2023. Should we take a new one before her consult on Nov 14?"
  - The @mention list drops down as she types "@".
- **"and tag the doctor"**:
  - Dr. Elena Ruiz is picked from the list; the mention turns into a purple chip.
  - Post → the note appears. A "1 unread @mention" pill pops on the Notifications item.
- **"The answer waits on the case"**:
  - Dr. Ruiz's reply appears, with Rachel's note quoted above it: "Yes please. Book her a 60-minute slot so we can take it before the consult."
  - Then Kevin Tran: "Done: Nov 14, 10:00 AM, 60 min. New pano added to the visit."
- **"and the other office never sees it"**:
  - The card pulls back and a second, smaller glass card slides in from the right, titled "Lakeside Family Dental · their view of the same case".
  - It shows the case with no Administrative Notes panel, only a muted line: "Administrative notes are private to each office."
  - A lock icon pulses on Harborview's notes.
- Chips: ✕ "Remind me after lunch" → ✓ "Tagged, answered, private".

### 6.5 FIX 4 (58.6–67.2) · Template, signed, sent back
Screens: Notes → Case Communication Templates, then the Prepare Consultation Note modal on Olivia Bennett's case.

Beats:
- **"Turn that Word letter"**:
  - Templates page.
  - A file chip "Dr Ruiz consult letter.docx" drops onto the **Import from Word** area; a 10-frame progress bar.
- **"into a template once"**: a new template card appears: "Harborview · Implant Consultation". Its letter shows the variables in purple:
  {{patientName}}, {{patientDob}}, {{referringDoctorName}}, {{referringOfficeName}}, {{consultDate}}, {{doctorName}}.
- **"Patient and doctor details fill themselves in"**:
  - Cut inside the card to Olivia's case, then the Prepare Consultation Note modal with the template selected.
  - The cursor clicks **Show values**, and each variable flips into the real value with a 4-frame blur swap:
    - Olivia Bennett, 04/12/1988;
    - Dr. James Whitaker, Lakeside Family Dental;
    - Nov 14, 2026;
    - Dr. Elena Ruiz.
  - The camera zooms 1.8× and follows the swaps line by line.
- **"the doctor signs digitally"**: click **Sign and Send**. A signing panel opens titled "Dr. Elena Ruiz · Sign consultation note", and a
  handwritten signature draws itself over 16 frames.
- **"and it goes straight back"**:
  - Panel reads "All done".
  - Success toast: "Consultation note signed and sent to Lakeside Family Dental".
  - The case row shows a "Signed note" link.
  - A small paper-plane trail flies from the card toward a "Lakeside Family Dental" label.
- Chips: ✕ "Retyped every time" → ✓ "Template, signed, sent".

### 6.6 FIX 5 (74.2–82.4) · Declined, and the referring office knows today
Screen: Daniel Ortiz's case at Harborview (Implant placement #30).

Beats:
- **"If a patient declines"**: full view. The cursor opens the status dropdown, which lists the real statuses:
  - Received, Left a Voicemail, Unable to Contact, Consultation Scheduled, Consultation Completed, Scheduled, Completed, Cancelled, **Declined Appointment**, Referred Out.
- **"mark it on the case"**: hover, then click **Declined Appointment**. The pill turns amber.
- **"with a short note"**:
  - A note box appears and types: "Daniel decided not to go ahead with the implant for now. Happy to see him whenever he's ready."
  - Click **Update Status**. Green toast: "Status updated. Lakeside Family Dental has been notified."
- **"The referring dentist sees it"**:
  - The card flips 180° on Y over 14 frames (a light sweep at 90°) to **Lakeside Family Dental's dashboard**: user chip "Megan Cole · Office Manager", Outgoing referrals.
  - Daniel Ortiz's row shows **Declined Appointment**.
  - A notification slides in: "Harborview Dental Group updated Daniel Ortiz: Declined Appointment · Today 2:14 PM".
- **"the same day"**: zoom 1.8× onto "Today 2:14 PM" and the note quoted in Office Communication.
- **"not at the next recall"**: zoom out to the full Lakeside view.
- Chips: ✕ "Found out at recall" → ✓ "Same-day update".

### 6.7 CLOSE (82.4–90.4) and END CARD (90.4–92.4)
- **"None of these are big problems on their own."**:
  - The S5 freeze is the blurred background.
  - Five small glass cards fan out in a 3D arc, each a thumbnail of its fix: History, X-ray on the case, Private note, Signed template, Declined update.
  - Each card lights up in turn, 4 frames apart.
- **"Together, they're where referrals slip."**:
  - The five cards slide together into one stacked dashboard card, with a soft shake on "slip".
  - The tracker dots 1–5 all show a check.
- **"The dashboard you just saw"**: the stack rotates to face the camera and becomes the full Harborview dashboard home.
- **"is Tooth Referral."**: the Tooth Referral logo appears on the glass with a light sweep.
- END CARD (60 frames):
  - logo, `toothreferral.com`, and "Save this for your next team meeting.", on the purple glass stage;
  - music resolves.
  - No "contact us", no "comment KEYWORD".

## 7. Transitions

- **Scene → dashboard:**
  - Freeze the scene's last frame, ramp the blur, and the glass card flies in (see `GlassCard`), with a soft whoosh.
  - Ethan's voice-over starts on the freeze frame.
- **Dashboard → scene:** a zoom-through seam using the `cut-the-curve` skill:
  - the card pushes toward the camera, scale 1 → 1.35, with 16 px blur;
  - the next scene enters at 1.08 → 1.0 with blur 12 → 0, over 6 frames.
- **Within a scene:** a 1.06 punch-in to hide a removed pause.
- Use a constant 1.04 overscale on every Flow clip so no edge ever shows.

## 8. Sound

- Mix and loudness:
  - Ethan's voice-over at −16 LUFS, scene dialogue at −16 LUFS;
  - music bed (`reel/public/audio/music/s13-bed.wav` or a better calm, modern track) at −30 LUFS, ducked another 4 dB under speech;
  - final master −14 LUFS integrated, true peak −1 dBTP.
- Use the `real-sfx` skill with the Openverse CC0 library in `reel/public/audio/openverse-cc0/` for:
  - the card whoosh;
  - soft clicks on every cursor click;
  - light keyboard while notes type;
  - a paper slide for the Word import;
  - a pen scratch for the signature;
  - a soft notification ding for Lakeside's notification;
  - a gentle hit on the logo.
- Effects sit at least 8 dB under the voice and never land on a stressed word.
- Check the final audio with `earshot` (timeline + critique) and fix anything below 8 on sync, speech clarity or balance.

## 9. Quality checks before you render the final

1. Render a still of every dashboard beat (at least 3 per fix) and look at each one:
   - the full dashboard is visible at the start of every beat;
   - no text is cut off at the card edges;
   - nothing overlaps;
   - captions don't cover the cursor target;
   - nothing is blurry when zoomed (render the UI at 2× and scale down, never scale up a bitmap).
2. Names check: grep the `ugc17` folder and the stills for Tanya, Amanda, Greg, Barbara, Gentle Dental, St. Andrew, Lee Davis, Carter and Kilbourn. There must be zero hits.
3. Every action marked "on *word*" lands within ±3 frames of that word.
4. `silencedetect` reports no silence ≥ 0.25 s outside the end card.
5. The Flow watermark is gone in every scene frame.
6. No red anywhere in our graphics; ✕ chips are amber.
7. "Tooth Referral" is said once, at the end.
8. Every character sounds the same in every scene; no original Flow voice is audible anywhere; the lips match the re-dubbed words.

Then render, write `edl.md` (the final beat table with real times) and `beats.png`, and commit and push to `claude/happy-fermat-cuii9h`.
Report:
- the final duration;
- the loudness;
- the silencedetect result;
- anything you could not match.
