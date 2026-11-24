# Tooth Referral dashboard: complete guide to every screen, section and animation

Companion to the video `dashboard-compendium.mp4` (4:22 min, 1920×1080). Upload both files to Claude together: this
document explains what every screen in the video is, what each section does, what data it shows, and where it lives in the code.
Timecodes below are positions in the video (m:ss).

**Rules that apply to everything in this guide (client Vejay):** all names are fictional demo data. Staff are only
Tanya, Amanda, Greg and Barbara; doctors are not named, except Dr. Vance (oral surgeon) in the episode series. Offices are
Gentle Dental (referring general dentist) and St. Andrew's Family Dental (specialist), and Oakridge Oral Surgery in the
episode series. Always "general dentist", never "GP"; "electronic health record", never "EHR"; never "shared inbox". No red in
our own graphics (amber instead); red badges inside the coded app are the product's own colours.

---

## 1. What Tooth Referral is

Tooth Referral ("Just Refer it", toothreferral.com) is a cloud referral system for dental offices. It replaces the static,
one-way referral web form (and the fax, email and phone tag that follow it) with **one shared case per referral** that both the
referring general dentist's office and the specialist's office see and work in. Big idea: **"Not just a form: a system for the team."**

One case holds: the patient, the requested treatment, X-rays and documents, insurance cards, a two-way message thread between the
two offices, a status, private administrative notes, an activity log (audit trail), signed notes, and the analytics that come out of
all of it. General dentists and specialists both use it, so every flow works in both directions.

**Who uses which part**

| Role | What they do | What they get |
|---|---|---|
| Referring general dentist and their front desk | send the referral, see status, message the specialist, receive the completion note | know what happened to the patient without calling |
| Specialist front desk (Tanya, Greg) | work the Incoming list, log contact attempts, request insurance from the patient, schedule | one list, nothing to hunt for, no retyping insurance |
| Office manager (Amanda) | Needs attention, status board, staff responsiveness, notifications | sees what is stuck and who is working it |
| Dental assistant | X-rays and documents on the case | the images are already there |
| Dentist or specialist (Dr. Vance) | @mentions, signs notes, Day-Prep Station | notes write themselves, the day is prepared |
| Owner | Analytics: funnel, leakage, top senders | sees referral growth and lost patients |
| The patient | secure link to submit their own insurance | less back-and-forth |

## 2. The layout of every page (AppShell)

- **Left sidebar** (light lavender): practice name (St. Andrew's Family Dental), the ToothReferral logo with "Just Refer it", then
  **Analytics**, **Referrals** (Incoming, Outgoing, Cases Completed), **Notifications** (count badge), **Notes**, **Website Lead
  Forms**, **Settings**, **Offices**.
- **Top bar**: page title, the office chip, **Provider's Day-Prep Station**, **Invite your Network**, **New Referral** (purple
  button), and the signed-in user (Amanda, Office Manager).
- An assistant box under the title: "Ask how to embed, forward, invite…" (suggestion chips; answers how-to questions).
- A purple chat bubble at bottom right (contact support).
- Brand purple about #6D4AE8 on a white page, lavender sidebar. Font Inter.
- The page can be shown at three browser heights (912, 869, 842 px) so it matches each source recording.

---

## 3. Part A: the coded app (live pages built from code)

These are pixel-matched rebuilds of the real dashboard (93 to 96 % match against the recordings), written as React components so
they can be scrolled, zoomed and filmed with camera moves. Code: `reel/src/app/`.

### 3.1 Incoming Referrals  ·  video 0:04–0:09  ·  `App-Incoming` (`Incoming.tsx`)
**What it is:** the specialist office's inbox of referrals it has received. One row per referral.
**What it shows:** search box (patient, date of birth, referring office), **Status** filter, **Received** month filter, "Show
archived", **Add patient** (manual entry). Columns: Patient Name (avatar with initials and an **@ n** badge for unread @mentions),
DOB, **Referring Office** (a green dot means a **Connected Network Member**), Receiving Office, **Status** pill, Received, Last
Update, **View** and **Archive** actions. New rows are highlighted. A **Signed Referral** link appears once a completion note is signed.
**What it does:** gives the front desk one place for every referral, so nothing hides in email, fax or voicemail. **Outgoing** is the same
table for referrals a general dentist sends. **Cases Completed** lists finished cases with before-and-after outcomes.
**Demo data:** Carter Wiley (Consultation completed, from Gentle Dental), Conrad Smith (New, Riverside Family Dentistry), John Carter
(New, Maple Grove Dental), George Miranda (New, Bright Smile Dental).

### 3.2 Case Details  ·  video 0:09–0:24  ·  `App-CaseDetail`, `App-CaseDetail-FullPage` (`CaseDetail.tsx`, `CaseSections.tsx`)
**What it is:** the single shared case for one referral. Opened from View. Tabs: **Details** and **Messages**. Buttons: Edit Referral,
Download PDF, Download PDF for patient, Delete Referral (red is the app's own colour). The video scrolls the full 3,053 px page.
Sections, top to bottom:

1. **Referred to / Patient block:** receiving office and team, patient name, DOB, age, pronoun, gender, phone, email.
2. **Referral Status:** type (Routine, Urgent, Symptomatic, Elective, Consultation, Treatment), chief complaint, "Please consult and
   treat" with numbered requested-treatment cards (for example Implant Restoration, diagnosis, tooth number, notes), each editable.
3. **Attachments, "shared with both offices":** **X-rays** (thumbnails, Download, Edit X-rays) and **Documents**.
4. **Signed notes, "visible to both offices":** the referral signed by the referring office, and the signed Consultation Note
   (View, Edit, Download).
5. **Insurance cards:** primary and secondary, front and back images, policy, group, subscriber, "Submitted by Staff". **+ Add card**
   and **Request from patient** (a secure link the patient opens on their phone to photograph the card: no account, HIPAA-compliant,
   protected by Cloudflare spam protection).
6. **Activity log (audit trail):** who did what and when, with time stamps ("General was added to the document section", "consultation
   completed Referral", "new referral created for…"). Anyone can pick the case up and see its whole history.
7. **All Attachments:** every image and file in one place; cards can be dragged to set the order that specialists and exports see.
8. **Primary Referral Source:** the referring office (Gentle Dental) with the Connected Network Member mark.
9. **Right column, Office Communication:** the two-office chat (see 3.3), with the footer "All communications are HIPAA compliant and
   encrypted · Secure".
10. **Right column, Status & Schedule:** a status dropdown with **Update Status** (green toast "Success: Status updated successfully!
    A notification has been created."), **Log a contact attempt** chips (Left a Voicemail, Voicemail Not Set Up, Unable to Contact,
    Declined Appointment, Referred Out, Cancelled, Spoke with Patient / Scheduled), **Schedule**, **Create a Note**, Hide Note Creator,
    Email notification settings.
11. **Right column, Administrative Notes:** "Company-private notes. Not shared with other parties." With @mentions, a reply flow and the
    **Journey** (Spoke with Patient / Scheduled, then Consultation Completed) and Build journey document.
**Demo data:** patient Carter Wiley, referred by Barbara (Gentle Dental) to St. Andrew's Family Dental Oral Surgery Team; staff Tanya and Amanda.

### 3.3 Messages tab (Office Communication)  ·  video 0:24–0:29  ·  `App-CaseMessages`
**What it is:** the two-way thread between the referring office and the specialist office, attached to the case.
**What it shows:** each message with name, office, role and time; **@mentions** (highlighted, "unread @mentions", Mark all as read);
threaded replies with a quoted block; attachments (X-rays); emoji; composer ("Enter to send"). A **Referral snapshot** on the left (From,
To, current status).
**What it does:** replaces phone tag and email chains. Example in the video: the specialist asks for the latest x-ray, the referring office
uploads it, the specialist thanks them, all on the case.

### 3.4 Prepare Consultation Note  ·  video 0:29–0:34  ·  `App-ConsultNote-Modal` (`ConsultNote.tsx`)
**What it is:** the modal that opens when the status is set to **Consultation Completed**.
**What it shows:** Template dropdown (General, Declined Appointment, Consultation Completed), a rich-text editor, **Insert Variable**
(smart variables such as {{completionDate}}, {{referringDoctorName}}, {{referringDoctorAddress}}, {{patientName}}, {{patientDob}}),
Preview, Save Draft, Save Changes, Save as New Template, and **Sign and Send Completion Note** (DocuSign e-signature opens inside the app).
**What it does:** the completion letter writes itself from the case data; the signed note goes back to the referring office
automatically and is visible to both offices; staff can also copy it into their own practice management software or electronic health
record. The list row then shows **Signed Referral**, with the toast "Consultation Note signed and sent successfully."

### 3.5 Website Lead Forms  ·  video 0:34–0:40  ·  `App-LeadForms`, `App-LeadForms-869` (`LeadForms.tsx`)
**What it is:** the builder that turns the practice's own website into a referral source.
**What it shows:** the banner "Embed trial active"; **Choose a web form** (a Lead-Generating Referral Form for referring offices, or a Contact
Us page, which is new and not yet used in marketing); **Embed Settings** with a **Live patient preview**: office logo, welcome message (write
your own or pick a sample, with {{companyName}}), **What we are known for** skill chips, a Google Map toggle, **Ready to Schedule** treatment
dropdown, the **Submit Insurance** button (secure insurance link for pre-verification), the **No Insurance** button (opens the practice's
membership plans), up to five custom link buttons (for example BOOK NOW), and **Go live on your website** (install snippet).
**What it does:** submissions arrive securely in the Tooth Referral portal instead of an email inbox, and show up in Analytics as the
**Embed widget** referral source.

### 3.6 Analytics  ·  video 0:40–0:58  ·  `App-Analytics`, `App-Analytics-FullPage` (`Analytics.tsx`)
**What it is:** the owner's and office manager's view of the whole referral relationship. Toggle **Received** (specialist view) or **Sent**
(general dentist view), choose the date range and specialty, **Export PDF**. Cards, top to bottom:
- **KPI cards with sparklines:** Volume received (vs prior period), **Time to first contact**, **Case acceptance %**, **Ghost rate %** (patients
  the office could not reach).
- **Top senders** (which offices send the most, with count and share) and **Top procedures**.
- **Volume received** line chart, current period against the prior one.
- **Referral funnel:** Received, Contacted, Scheduled, Completed, with "N dropped · X % leak" between steps and the overall conversion.
- **Lifecycle clocks:** time to first contact, to schedule, to completion, waiting while scheduled, age of open referrals.
- **Consultation cards:** consultations scheduled, consult to completion (days), referrals to consultation %, consultations completed %.
- **Needs attention** with one-click fixes: appointments past date with no completion note (**Mark complete**), ghost referrals with three or
  more attempts (**Re-assign**), insurance requests outstanding over 48 hours (**Send reminder**).
- **Staff responsiveness:** per person log-ins, average time in the app, number of changes.
- **Referral outcomes** donut and **Referral sources** donut (Embed widget, Network, Manual).
- **Status board:** every status with count, average and longest wait, and which referring offices' cases sit there.
The **Sent** view (general dentist) adds Volume sent, Recipient turnaround, Loop closure, Patient leakage, Specialty mix, Most responsive
offices and one-sided-relationship alerts.

---

## 4. Part B: animated flows (filmed screens rebuilt in code)

Code: `reel/src/reelfx/`. Each plays an interaction as it happens in the app, with a cursor and typing.

### 4.1 Provider's Day-Prep Station  ·  video 0:58–1:14  ·  `DayPrep-Clean` (`DayPrepClean.tsx`, 16 s)
**What it is:** the dark, full-screen pre-op view for the doctor: provider and date picker, the day's scheduled patients drawn from the
referrals. **In the animation:** Dr. Vance opens Mrs. Ortiz's (Maria Ortiz) record, sees the referring office (Gentle Dental) and the old
2022 pano, types an Administrative Note with an **@mention** of Amanda asking for the newest pano; the note posts, Amanda replies, and the
new pano arrives (new thumbnail, main image swaps, "taken Nov 2026"). **Shows:** private team notes with @mentions, X-rays on the case.

### 4.2 Case chat  ·  video 1:14–1:31  ·  `CaseChat-Clean` (`CaseChat.tsx`, 17 s)
**What it is:** Office Communication on Mrs. Ortiz's referral, animated. Amanda @mentions Barbara, Barbara is typing, Barbara replies with a
quoted block and an X-ray "saved to the case", Amanda hovers the message (reply and trash controls), clicks reply ("Replying to Barbara,
Gentle Dental"), types and sends, Barbara answers. **Shows:** quoted replies, typing indicator, attachments saved to the case.

### 4.3 Completion note, route to doctor, e-sign, copy to PMS  ·  video 1:31–2:05  ·  `CompletionNote-Ep4` (`CompletionNote.tsx`, 34 s)
**What it is:** the whole close-the-loop flow for Mr. Turner's case at Oakridge Oral Surgery: status **Consultation Completed**, the form
(date, surgery date, status update, practice-management note, preview), **Create official note**, **Prepare Consultation Note** with the
"Oakridge Letterhead · Implant Consult" template filling in the patient, tooth, referring office and X-rays, Tanya types two sentences,
**Who signs: Route to a doctor to sign**, Dr. Vance's signing screen (signature field, fingertip signature, Finish), then back on the case
the signed note is attached for both offices, Office Communication shows it went to Gentle Dental, and **Copy to PMS** confirms "Copied".

### 4.4 Analytics walk-through  ·  video 2:05–3:05  ·  `AnalyticsDemo` (`AnalyticsDemo.tsx`, 60 s)
**What it is:** the canonical Analytics page scrolling top to bottom with a cursor, built from one dataset
(`reel/src/data/analytics-demo.json`, `reel/scripts/analytics_data.py`) so every number reconciles. **The numbers:** 28 referrals in 30 days
(up 27 % on 22), time to first contact 3.7 h, case acceptance 76 %, ghost rate 7 % (2 patients), funnel 28, 25, 20, 9 (leaks 11 %, 20 %, 55 %;
conversion 32 %), lifecycle clocks 3.7 h, 16.9 h, 10.3 d, 4.5 d, 8.6 d; consultations 20 scheduled, 6 days to completion, 71 % referrals to
consultation, 85 % completed; top senders St. Andrew's Family Dental 7, Bright Smile Family Dentistry 6, Maple Grove Dental 5, Riverside
Dental Care 4, Lakeside Family Dentistry 3, Summit Dental Group 3; sources Network 19, Embed widget 7, Manual 2; staff Amanda (24 log-ins,
38 min, 58 changes), Tanya (21, 31 min, 49), Barbara (11, 14 min, 16); needs attention 2, 2, 3. Use only these numbers in public content.

---

## 5. Part C: the 16 glass motion scenes (TR-01 to TR-16)

Original animated scenes (1080×1920 vertical, also a 1920×1080 horizontal and transparent versions) in a dark purple 3D glass style, used as
inserts over footage. Code: `reel/src/tr/` (`scenes.tsx` TR-01 to TR-07, `custom.tsx` TR-08 to TR-11, `v2.tsx` TR-12 to TR-16). Render
ids `TR-05-case-lifecycle` (vertical) and `TR-05-case-lifecycle-h` (horizontal). Alpha WebM versions in `reel/renders/tr-alpha/`. Demo data only;
counts are illustrative.

| # | Scene | Video | What it shows and means |
|---|---|---|---|
| TR-01 | Dashboard overview | 3:05–3:09 | The whole app builds in (sidebar, top bar, KPI row); the camera pushes into the KPIs. "Everything in one place." |
| TR-02 | New referral | 3:09–3:14 | The referral form fills itself (patient, treatment, tooth, urgency, X-rays) and goes out securely. |
| TR-03 | Incoming referral | 3:14–3:19 | A new referral lands in the receiving list with an unread badge and a status pill (Scheduled, Contacted). |
| TR-04 | Office Communication | 3:19–3:23 | Secure chat between two offices with an @mention, typing indicator and "X-rays attached". |
| TR-05 | Case lifecycle | 3:23–3:28 | One case steps through sent, contacted, insurance added and verified, appointment scheduled, treatment completed with notes shared. |
| TR-06 | Analytics KPIs | 3:28–3:33 | Four KPI cards count up; the volume line draws against the prior period. |
| TR-07 | Needs attention | 3:33–3:37 | Flags appointments past date, a ghost referral and an insurance request over 48 h, each with a one-click action. |
| TR-08 | Referral journey | 3:37–3:42 | A timeline of one referral from sent to completed so nobody asks "where is it?". |
| TR-09 | Insurance link | 3:42–3:46 | The patient adds insurance from a secure link, no account; it arrives verified on the case. |
| TR-10 | Notification stack | 3:46–3:51 | New message, appointment scheduled, case completed arrive as stacked notifications. |
| TR-11 | Referral funnel | 3:51–3:55 | Received, contacted, scheduled, completed bars with the drop-off between steps (the "leak"). |
| TR-12 | Before and after | 3:55–4:00 | The old way (forms, faxes, phone tag) against one shared case. |
| TR-13 | Referral network | 4:00–4:05 | General dentists and specialists as connected nodes on one network, both directions. |
| TR-14 | Case stack | 4:05–4:10 | A 3D stack of case cards: X-rays, notes, insurance and messages together. |
| TR-15 | Big stats | 4:10–4:15 | Headline numbers counting up (illustrative). |
| TR-16 | CTA end card | 4:15–4:19 | Logo reveal with light sweep, "set up in about 5 minutes", button click. No contact CTA. |

---

## 6. Statuses and lifecycle (what the pills mean)

Created, then **New** (receiver) or **Sent** (sender). Staff work contact statuses: Received, **Left a Voicemail**, **Voicemail Not Set Up**,
**Callback Requested**, In Progress, **Unable to Contact**, Other. Then **Consultation Scheduled**, **Consultation Completed** (a consultation
note is signed), **Spoke with Patient / Scheduled** (lists show "Scheduled"), **Completed** (the completion note goes back to the sender; the case
appears in the sender's Cases Completed). Exits: **Cancelled**, **Declined Appointment**, **Referred Out**. Changing to Completed, Cancelled or
Consultation Completed prompts for a note unless Hide Note Creator is on. Analytics outcome buckets: Awaiting contact, Working, Consultation,
Scheduled, Completed, Closed without completion.

## 7. Other product sections that exist but are not yet coded as pages

Outgoing (same table as Incoming, with Sent date); Notifications (one feed of every case event, tabs All, Unread, Read; filters for audience and
type: Status, Mentions, Insurance Submission, Case Correspondence); Notes (Case Communication Templates with smart variables, Import from Word or
PDF, Reset to Default); Settings (company settings, outbound per-status emails to referring offices, insurance acceptance In-Network,
Out-of-Network, Fee-for-Service, Dental Team with roles, Referral Access Code or Access PIN, Memberships); Offices (details, multi-office, per-user
assignment); the lead-form builder editor; the DocuSign signing screen (partly drawn in the completion-note animation); Invite your Network (email
template, manual entry, CSV upload). These are described in `.claude/skills/toothreferral-messaging/PLATFORM-FEATURES.md`.

## 8. Code map

| What | Where |
|---|---|
| Coded app pages | `reel/src/app/AppShell.tsx` (sidebar, header, viewports 912 / 869 / 842), `Incoming.tsx`, `CaseDetail.tsx`, `CaseSections.tsx`, `LeadForms.tsx`, `Analytics.tsx`, `ConsultNote.tsx` |
| Animated flows | `reel/src/reelfx/DayPrepClean.tsx`, `CaseChat.tsx`, `CompletionNote.tsx`, `AnalyticsDemo.tsx` |
| Glass scenes | `reel/src/tr/` (`scenes.tsx`, `custom.tsx`, `v2.tsx`, `formats.tsx`, `motion.tsx`, `ui.tsx`) |
| This combined film | `reel/src/reelfx/Compendium.tsx`, composition `Dashboard-Compendium` |
| Render | `cd reel && npx remotion render Dashboard-Compendium out.mp4` (stills: `npx remotion still <Id> f.png --frame=N`) |
| Pixel check | `reel/scripts/app_diff.py <comp> <reference> <out>` |
| Product knowledge | `.claude/skills/toothreferral-messaging/` (SKILL.md, PRODUCT-UNDERSTANDING.md, PLATFORM-FEATURES.md, DASHBOARD.md, VIDEO-INDEX.md) |

## 9. Glossary

**Case:** the single record both offices share for one referral. **Connected Network Member:** an office also on Tooth Referral (green dot).
**Ghost rate:** share of referred patients the office could not reach after repeated attempts. **Leak:** share of referrals dropped between
two funnel steps. **Needs attention:** the automatic to-do list of stuck items. **Day-Prep Station:** the doctor's pre-op view of the day.
**Smart variables:** placeholders such as {{patientName}} that fill from the case. **Signed Referral:** the list link that appears once the
completion note is signed. **PMS:** Practice Management Software.

## 10. Open questions (do not claim until the client confirms)

Meaning of the Amended, Draft and "Referred Out: Forward" statuses; which statuses change automatically; how case acceptance is calculated;
HIPAA wording approval for marketing; the Contact Us page builder (not for marketing yet).
