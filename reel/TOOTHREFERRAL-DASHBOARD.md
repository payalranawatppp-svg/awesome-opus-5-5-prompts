# ToothReferral dashboard: how it works, and the animations built from it

Built from three screen captures of the live dashboard (the D Care Alliance demo account, logged in as Lee Davis,
Associate Dentist). Two of the three captures are identical.

## The app at a glance

A referral network for dental offices. A general dentist sends a patient to a specialist (or another office) as one
secure package (patient details, clinical notes, X-rays, insurance). Both offices then track the same case, message
each other inside it, and see the outcome. The dashboard is the specialist's or the receiving office's view of all of
that.

**Layout.** There's a pale blue sidebar on the left with the office name ("D Care Alliance"), the ToothReferral logo
and the navigation. A top bar holds:

- the page title;
- the office switcher;
- **Provider's Day-Prep Station**;
- **Invite your Network**;
- the purple **New Referral** button;
- the user menu;
- an AI help box ("Ask how to embed, forward, invite…").

A purple chat bubble sits bottom-right (support). The visual style is white cards with light grey borders, brand
purple #774AEE for actions and highlights, green for good or verified, amber for attention.

## Navigation and what each screen does

| Section | What it shows | What you can do |
| --- | --- | --- |
| **Analytics** | Received / Sent toggle, date range (Last 30 days · daily), a specialty filter and Export PDF. Four KPI cards: **Volume received**, **Time to first contact**, **Case acceptance**, **Ghost rate**, each with a sparkline and a "vs prior" change. Then: **Top senders** (practices sending you referrals, with share %), **Top procedures** (e.g. Crown recementation, Implant restoration, Sleep appliance), **Volume received** chart (current against prior period), **Referral funnel** (Received → Contacted → Scheduled → Completed, with drop-off), **Lifecycle clocks** (time to first contact, time to schedule, time to completion, waiting while scheduled, open referral age), consultation metrics (scheduled, consult-to-completion, referrals-to-consultation, completed), **Needs attention**, **Staff responsiveness** (log-ins, average time in app, changes per staff member), **Referral outcomes** (donut: awaiting contact, working, consultation) and **Referral sources** (e.g. embed widget). | Filter, compare periods, export PDF, click a sender or an attention item to open those referrals, re-assign, send reminders. |
| **Referrals → Incoming** | A table of referrals sent to you: patient (avatar, name), DOB, referring office (green dot = connected network member), receiving office, status (New…), received date, last update. There's a search, status and month filters, and Show archived. | Add patient, View, Archive, open the signed referral. |
| **Referrals → Outgoing** | The same table for referrals you sent, with columns for receiving office, status, sent date and last update. | Track what you sent. |
| **Referrals → Cases Completed** | Before and after outcomes of patients' specialist visits. A case shows up once the specialist marks a referral completed. | Review outcomes. |
| **Referral detail** (View) | **Details** and **Messages** tabs, plus Edit Referral, Download PDF for patient and Delete Referral. It shows who the referral is to (office and dentist), the patient (name, DOB, age, pronoun, gender, dental insurance company, phone, email), the **Referral Status** (status chip such as Routine, chief complaint, requested treatments such as Crown recementation (diagnosis #2, UR) and Sleep appliance), and the insurance block (policy, group, subscriber, employer, insurance company). The **Activity log** reads like: new referral created → secure insurance request sent to patient → patient insurance submitted. **All attachments** holds X-rays such as a panoramic image, plus documents. **Internal notes** are company-private. | **Office Communication** chat with the other office (@mentions, unread count, mark all as read, Expand). **Status & Schedule**: change status (New → …), schedule, call the office, create a note, optionally hide the note creator. Edit X-rays and documents. Everything is labelled HIPAA-compliant and encrypted. |
| **Notifications** | A feed of everything that happened: new referral created, patient insurance updated, insurance submitted, secure insurance request sent to patient, message sent. Filters by audience and type, with All / Unread / Read tabs. | Mark as read, select all. |
| **Notes** | Notes across referrals. | |
| **Company** | Company logo upload and notification settings (email or push for new referrals and similar). | |
| **Offices** | A map of your offices, an office card with address, and "My Office". | Create a new office, manage team members and embedded referral forms. |
| **Memberships** | Membership plan settings. | Add new plan. |
| **My Settings** | Personal profile: first and last name, email, phone, role (Associate Dentist), degree, picture, password. | Save changes. |

## The referral lifecycle (the story every UGC video tells)

1. **Sent.** The referring office creates a **New Referral**: the patient, who it's referred to, and notes, X-rays and
   insurance attached. It goes out securely in minutes, with no fax or phone tag.
2. **Received.** It lands in the specialist's **Incoming** list as **New**, with a notification.
3. **Insurance.** The patient gets a **secure link**, adds their insurance from their phone, and arrives already
   verified (shown in the activity log).
4. **Talk.** The two offices message inside the case (**Office Communication**, @mentions), HIPAA-secure instead of
   texts.
5. **Status.** The case moves Received → Contacted → Scheduled → Completed. Both offices see the same status, and
   the activity log records every step.
6. **Outcome.** Completed cases appear in **Cases Completed**. **Analytics** shows volume, speed (time to first
   contact), acceptance, ghost rate, top senders and procedures, and what **needs attention**.

## The animations (src/tr/)

Sixteen scenes (seven screen-based, four custom, five v2 brand pieces). The table lists the 9:16 versions (1080×1920, 30 fps). Each shows white UI cards rebuilt from the real dashboard, floating on the
deep purple stage used in the brand's UGC inserts. They are made to cut into talking-head videos. Preview any of
them in Studio, or render one with `npx remotion render <id> out/<id>.mp4`.

| Composition | Length | Shows | Use it when the speaker says… |
| --- | --- | --- | --- |
| `TR-01-overview` | 4.5 s | The full dashboard builds in (sidebar, top bar, KPIs), then the camera pushes into the KPI row | "Here's the dashboard" / "everything in one place" |
| `TR-02-new-referral` | 5 s | The New Referral form fills in (patient, refer to, notes, X-rays, insurance); the cursor clicks Send and it turns to "Sent securely" | "sends the whole referral as one secure package" |
| `TR-03-incoming` | 4.5 s | A notification drops in and the new referral slides to the top of Incoming with a New badge | "it lands straight in their list" |
| `TR-04-office-chat` | 4.5 s | Office Communication: an @mention question, typing, then a reply; HIPAA-secure | "secure messages instead of texts" |
| `TR-05-case-lifecycle` | 5 s | Received → Contacted → Scheduled → Completed lights up step by step while the activity log fills | "both offices track the same case" |
| `TR-06-analytics` | 4.5 s | The four KPIs count up and the volume chart draws against the prior period | "you can see how fast your team responds" |
| `TR-07-needs-attention` | 4.5 s | Needs attention: the cursor clicks Send reminder on an outstanding insurance request | "nothing slips through" |
| `TR-08-referral-journey` | 4.5 s | *Custom.* A referral package (patient, attachments) flies from the general dentist's office card to the specialist's along a glowing path and lands as **New referral** | "the whole referral goes out in minutes" |
| `TR-09-insurance-link` | 4.7 s | *Custom.* A phone gets the secure link; the patient adds Delta Dental and their member ID, it turns **Verified**, and an "Insurance verified" chip pops beside it | "the patient adds their insurance from their phone" |
| `TR-10-notification-stack` | 5 s | *Custom.* The day's events cascade in: new referral, insurance added, message, appointment, case completed | "both offices see every step" |
| `TR-11-referral-funnel` | 4 s | *Custom.* Received → Contacted → Scheduled → Completed bars grow with counts (illustrative numbers) | results, "nothing gets lost" |
| `TR-12-before-after` | 5 s | *v2.* Fax sheets, a ringing phone and red pain tags ("Phone tag", "Missing X-rays", "Insurance unknown"); a purple shock ring clears it and one clean referral checks off notes, X-rays and insurance, then **Sent securely · 2 min** | the problem / "no more faxing" |
| `TR-13-referral-network` | 5 s | *v2.* Eight practices orbit a glowing ToothReferral hub; lines draw in and referrals flow in (purple) and out (green); "38 referrals this week" (illustrative) | "your whole network in one place" |
| `TR-14-case-stack` | 5 s | *v2.* Patient, X-ray, insurance and messages layers fan out in 3D, then flatten into one tidy column | "everything is inside the referral" |
| `TR-15-big-stats` | 4.5 s | *v2.* Three kinetic number beats with a ring: **2 min** to send, **0** faxes, **100%** HIPAA-secure messaging (claims to confirm with the client) | results, punchlines |
| `TR-16-cta` | 4 s | *v2.* End card: logo reveal with a light sweep, "Refer patients in minutes.", "Free for general dentists", cursor clicks **Start referring**, toothreferral.com. Holds on the last frame | the call to action |
| `TR-V2-Showreel` | 24 s | The five v2 pieces back to back (`renders/toothreferral-v2-showreel.mp4`) | review |
| `TR-Dashboard-Tour` | 74 s | All sixteen back to back (render: `renders/toothreferral-dashboard-tour.mp4`) | review |

### Three formats: vertical, horizontal, transparent

Every animation exists in each of these:

- **Vertical 9:16** (1080×1920): `TR-05-case-lifecycle`, on the purple stage.
- **Horizontal 16:9** (1920×1080): `TR-05-case-lifecycle-h`. The same animation is framed for landscape videos.
- **Transparent**: no background, only the floating UI and its shadows, ready to lay over footage. Pass
  `--props='{"transparent":true}'`. For horizontal, `"side": "left" | "center" | "right"` puts the UI beside the
  speaker.

Ready-made transparent files come from `scripts/render_tr_alpha.sh` (all scenes, or pass ids):

- **ProRes 4444 with alpha** (`out/tr-alpha/<id>-h.mov`, `<id>-v.mov`): drag into Premiere, Final Cut, DaVinci
  Resolve or CapCut and place it on a track above the footage. These are large, so they aren't committed; re-render
  them with the script.
- **VP9 WebM with alpha** (`renders/tr-alpha/<id>-h.webm`, `-v.webm`): small, committed, for web players or web
  editors.

**Inside a reel, behind-glass look** (`ToothReferralDepth`, `src/reelfx/ToothDepth.tsx`, render
`renders/toothreferral-depth.mp4`). The UGC video plays as usual. On three lines the room frosts over (blur, dim,
purple tint), the speaker (a cutout from `scripts/matte.py`) eases back behind it, and the transparent animation
floats on top: before/after on "phone and fax", the case stack on "With ToothReferral…", and the CTA on "It is free
for general dentists". There's no cut to a purple slide, so the animations look like part of the shot. In
transparent mode the glass panels turn darker and headlines get a soft shadow, so they stay readable over bright
footage. To reuse it, copy `MOMENTS` (scene id, start frame, length) for another clip that has a cutout.

To use one inside a Remotion video, render `<TrFormatted id="TR-09-insurance-link" horizontal transparent side="right" />`
(src/tr/formats.tsx) in a `<Sequence>` over the footage.

Notes:

- **Data is demo and fictional** (Maria Alvarez, Toledo Family Dental, Holland General Dentistry). The **analytics
  numbers are illustrative** (the demo account shows zeros); use real figures only once the client confirms them.
- Each scene enters and exits by itself, so it can be dropped on a cut. The text sits in the middle of the frame,
  leaving room for captions top and bottom.
- Code: `src/tr/ui.tsx` (palette, cards, badges, cursor, toast), `src/tr/motion.tsx` (v2 motion toolkit),
  `src/tr/scenes.tsx`, `src/tr/custom.tsx` and `src/tr/v2.tsx` (the scenes).
- To make a new one in the same style, follow `.claude/skills/tr-animations/SKILL.md` (design rules, toolkit,
  recipe, unbuilt ideas).
