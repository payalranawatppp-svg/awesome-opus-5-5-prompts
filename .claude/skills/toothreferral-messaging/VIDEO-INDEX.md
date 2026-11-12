# Screen-recording index (timestamped) — use for every future edit

Two recordings of the real dev platform (dev.toothreferral.com), shared by the client on 2026-11-12.
Look up the moment you need here; you never need to re-watch the whole video. Stills of the key moments are in
`platform-audit/video-stills/` (file name = video + second, e.g. `v2_110s.jpg` = video 2 at 1:50).

| | Video 1 (V1) — full audit session | Video 2 (V2) — product walkthrough |
|---|---|---|
| Drive ID | `1o1yNDHbrXsIdESUbnHu7SvjyxFMRZ2jb` | `1IpIKHHOVlXdvvgGB0dF4u-3c8-bQW1mG` |
| Length | 12:29 (748.9 s) | 3:30 (210.2 s) |
| Format | 1920×1020, 60 fps, H.264 MP4, 904 MB | 1920×842, 60 fps, H.264 MKV (remux to MP4), 30 MB |
| Audio | none usable (near-silent; transcription only hallucinates) | none |
| Look | whole Chrome window: tab bar, "Claude started debugging" banner, Claude side panel on the right, purple glow border, a "Stop Claude" pill bottom-centre | clean app only, already zoomed/panned like a Screen Studio recording; crisp text; no overlays |
| Use it for | reference + B-roll of any section (Analytics, Settings, Notifications, Invite, Day-Prep…) | hero footage: messages, insurance request, Consultation note → EHR copy → DocuSign signing |

Download again (both work without login):
`curl -L -o v1.mp4 "https://drive.usercontent.google.com/download?id=1o1yNDHbrXsIdESUbnHu7SvjyxFMRZ2jb&export=download&confirm=t"`
(same URL with the V2 id → MKV; `ffmpeg -i v2.mkv -c copy v2.mp4` to get a normal duration).

**V1 crop to the app only:** `crop=1420:820:10:182` (removes tab bar, address bar, debugging banner and the Claude
panel; the "Stop Claude" pill at about x=720,y=979 is just below the crop). The crop is 1420 px wide, so scaling to
1920 enlarges it 1.35× (slightly soft); prefer V2 when the same screen exists there.

**Privacy (both videos):** real-looking dev names are on screen (Lee Davis DDS, Davis General Dentistry, Barbara
Smith, Jane White, Sally Smith / Holland General Dentistry, Tom Colpack / Apex Dental, Gary Charlson / The Dental
Center, Carter Wiley, Conrad Smith, john carter, Sam Smith, Vijay Ravindran, Sarah Chen, Jennifer Harris…). Before any
public use: blur or replace names, offices, emails, phones, DOBs, addresses and the DocuSign envelope ID; keep to the
approved demo names (Barbara, Tanya, Amanda, Greg; Gentle Dental; St. Andrew's Family Dental). Barbara is an
approved name. The app's own red (error banner, Delete buttons, badges) stays in real recordings (user rule).
Don't show the Contact Us builder (V1 6:51–7:21) in marketing yet.

---

## V2 — product walkthrough (3:30) ★ best footage

| Time | What's on screen | Edit use |
|---|---|---|
| 0:00–0:02 | Incoming Referrals → referral detail (patient "Carter Wiley", from Apex Dental), Details tab; top buttons Edit Referral / Download PDF / Download PDF for patient / Delete Referral | "every referral is one case" opener |
| 0:02–0:06 | Camera pans right: **Office Communication** thread with the referring office (@mentions, "I updated the latest xray", quoted replies), then **Status & Schedule** chips | direct communication / messages |
| 0:06–0:08 | Referral Status (Symptomatic, chief complaint "pain in #32", Crown Recementation), Attachments | complete referral |
| 0:08 | **X-rays (3)** thumbnails + status chips + "Hide Note Creator" + Schedule / Create a Note | X-rays on the case |
| 0:10 | ★ **Administrative Notes (10)** "Company-private notes. Not shared with other parties." · 1 unread @mention · **Referral Timeline** (Spoke with Patient / Scheduled → Consultation Completed, **Surgery 11/07/2026** chip) · **Signed notes – Consultation Note "Signed 11/07/2026 · by Barbara Smith"** (View / Rename / Edit / Download) · Jane White note with @mention | team notes, journey, signed note |
| 0:12 | Insurance card (front + back) beside the team notes thread | insurance |
| 0:14 | **All Attachments** (3 X-rays, drag to order) + Primary Referral Source card (Apex Dental, Connected Network Member) | everything in one place |
| 0:16–0:20 | Cursor goes to signed **Consultation Note → View** | — |
| 0:22 | "General.pdf" preview loading | — |
| 0:24–0:30 | ★ PDF viewer: the signed consultation letter ("Thank you for referring… I appreciate the opportunity to participate…") with signature | signed note visible to both offices |
| 0:32–0:38 | Closes PDF, scrolls back up | — |
| 0:40 | Insurance cards (1) + **Activity log** | audit trail |
| 0:42–0:46 | Cursor on **Request from patient**, clicks | secure insurance link |
| 0:48 | ★ Green **"Success · Insurance request sent"** toast | |
| 0:50–0:52 | Activity log now shows "sent secure insurance request to patient" | |
| 0:54–0:56 | Back to the top of the referral | |
| 0:58–1:00 | **Create New Referral** wizard, step 1 of 3 (Demographic Information · Procedures · Referring information): "Choose a Provider", Office favorites, "Find a specialist — nearby shown by default", filters Specialty / Insurance plan / Skill sets | the sending side (general dentist) |
| 1:02 | Referral status (Routine) + **Patient Information** fields | |
| 1:04–1:10 | **Patient Insurance (Optional)**: Option 1 Send a Secure Link to the Patient (consent checkbox) / Option 2 Upload Information Manually / "Prefer to wait?" → **Continue** | patient uploads own insurance |
| 1:12–1:16 | Validation error banner "Receiving doctor is required. Select one or invite a doctor to ToothReferral" (app's red) | avoid, or use as "it won't let a referral go out incomplete" |
| 1:18–1:20 | Back on the Carter Wiley referral | |
| 1:22–1:24 | Incoming list (8 rows, @ badges, green network dots, status pills) | inbox → list contrast |
| 1:26–1:30 | Referral "Conrad Smith" (North Carolina Hospital Dentistry): messages "added team member working on new office…" | |
| 1:32–1:34 | Incoming list, hover | |
| 1:36–1:38 | Referral "john carter" from The Dental Center, **Urgent**, New Patient Dental Exam and Dental Cleaning, diagnosis #5, #6, #7, #14, #16, #20; message "we contacted patient she will visit office tomorrow" | |
| 1:40–1:42 | Status chips with **New** selected | status at a glance |
| 1:44–1:46 | Click **Consultation Completed** → modal: Date, Surgery date, Note, Next Step | |
| 1:48 | Modal closed; chips | |
| 1:50–1:54 | ★ **Consultation Scheduled** modal: "**Administrative Notes:** Record when the consultation is booked. **Privacy:** Saved internally for your staff only; not shared with external parties. **EHR Export:** Feel free to copy and paste this note into your own patient health record system to keep external charts synchronized." Note "Spoke to john carter on 11/12/2026." · "Copy and paste into your patient electronic health record as a note" · **Next Step: Check back in 2 business days (11/16/2026)? [Remind me on 11/16]** · Save & update status | notes → EHR, reminders (Vejay's "copy into EHR") |
| 1:56–2:00 | Status saved; Administrative Notes panel updates | |
| 2:02–2:10 | Scroll top → status chips (Consultation Scheduled highlighted) | |
| 2:12–2:18 | **Consultation Completed** modal: Date 11/12/2026, Surgery date, note "Consultation completed on 11/12/2026." | |
| 2:20–2:22 | Surgery date picker (November 2026 calendar) | |
| 2:24 | Note "Patient has scheduled surgery on 11/19/2026" → **Save & update status** | |
| 2:26 | ★ **Prepare Consultation Note** ("Review, edit, and sign the consultation note before sending it"): Template = General, Show values / Show codes, rich-text toolbar, Insert Variable, Preview | note templates |
| 2:28–2:30 | Letter auto-filled (date, doctor, address, patient, DOB as purple variable chips) + toast "Success · Status updated successfully" | completion letters write themselves |
| 2:30 | ★ "**Who signs this note?** ○ I'll sign it myself ○ Sign on behalf of a doctor ○ **Route to a doctor to sign**" (routing feature) | staff can prepare, doctor signs |
| 2:32–2:38 | **Available Variables** list (17: patientName, patientDob, referringDoctorName/Address, referring/receivingOfficeName, receivingDoctorName, company emails/phones, specialty, companyLogo, xrayImages, completionDate, todaysDate, declinedReason) · buttons Cancel / Save Draft / Save Changes / Save as New Template / **Sign and Send Consultation Note** · **docusign** logo | |
| 2:38–2:40 | Click Sign and Send → "Preparing…" | |
| 2:42–2:52 | DocuSign loading (white screen, spinner) | cut |
| 2:54–3:00 | ★ DocuSign "Drag and drop fields from the left panel onto the document": the letter; Signature field dropped onto it | e-signature |
| 3:02–3:04 | Signature placed, **Finish** button highlighted | |
| 3:06–3:10 | Finishing (grey overlay) | cut |
| 3:12–3:16 | "**All done — your document is signed!**" | |
| 3:18 | Toast "Success · Consultation Note signed and sent successfully" | signed note goes back |
| 3:20–3:22 | Referral: **Signed notes → Consultation Note, Signed 11/12/2026** (View / Rename / Edit / Download) | |
| 3:24–3:26 | View → General.pdf preview loading | |
| 3:28–3:30 | Back to referral (end) | |

## V1 — full audit session (12:29), app area = crop above

| Time | Screen | Notes |
|---|---|---|
| 0:00–0:06 | Analytics · Received · **Specialty** dropdown open (All specialties / General Dentistry) | |
| 0:09 | **Period** dropdown open (Last 7 days, 30, 90, Quarter to date, Year to date, Last 12 months, Custom) + granularity D W M Q Y | |
| 0:12–0:15 | Hover a **Top senders** row | |
| 0:18–0:27 | **Top senders drawer** (an office's referrals list, "View all referrals") | |
| 0:30 | Received KPIs: Volume 9, Time to first contact 10.3 h, Case acceptance 0 %, Ghost rate 0 % + Top senders / Top procedures | use canonical analytics for numbers in public |
| 0:33–0:48 | **Sent** view: Volume sent 3, Recipient turnaround 0.4 h, Loop closure 33 %, Patient leakage 67 %; Volume sent chart; **Closing the loop** funnel | |
| 0:51–1:06 | Sent KPI **tooltips** (volume sent 0:54, loop closure 1:00, patient leakage 1:03) | |
| 1:09–1:15 | Back to Received; KPI tooltips (volume received, ghost rate) | |
| 1:18 | **Lifecycle clocks** (10.3 h, 0 h, 9.7 days) + consultation cards (3, 6 d, 33 %, 100 %) | |
| 1:21–1:51 | **Status board** "where referrals sit right now" (New 4, Consultation completed 4, oldest cases) — long static hold | |
| 1:54–2:21 | **Incoming Referrals** list, 8 rows: @ badges, green Connected Network Member dots, Signed Referral links, status pills | |
| 2:24–2:39 | **Outgoing Referrals** (3 rows, Sent/Draft statuses) | |
| 2:42–2:54 | **Cases Completed** empty state | |
| 2:57–3:00 | Incoming list → open a referral (Sam Smith) | |
| 3:03–3:15 | Referral **Details** tab: patient block + Office Communication side panel | |
| 3:18–3:24 | Scrolled: **Activity log**, All Attachments, Primary Referral Source (Holland General Dentistry) | |
| 3:27–3:36 | **Messages** tab: referral snapshot + full-width Office Communication | |
| 3:39–3:48 | **Edit Referral** form with "This referral has been signed…" banner | |
| 3:51–4:12 | Messages tab again (thread scrolled) | |
| 4:15–4:27 | Notifications briefly, then Outgoing list | |
| 4:30–4:51 | **Notifications · All** (sent message, mentioned you in a note, new referral created, sent completion note…) | |
| 4:54–4:57 | Notifications · **Unread (27)** | |
| 5:00–5:15 | Notifications · **Read** | |
| 5:18–5:24 | **Notes → Case Communication Templates** empty state | |
| 5:27–5:42 | ★ **Create Completion Note Template** modal: sample letter with variable chips, Used for, Show values/codes, Insert Variable, Import from Word/PDF | |
| 5:45–5:54 | Notes empty state again | |
| 5:57–6:12 | **Website Lead Forms** chooser + "Embed trial active" banner | |
| 6:15–6:36 | ★ **Referral Web Form builder** + Live patient preview ("Create New Referral", Select location) | website form → case |
| 6:39–6:48 | Chooser again | |
| 6:51–7:21 | Contact Us page builder (map, known-for tags) | **do not market yet** |
| 7:24–7:36 | **Company Settings**: logo, inbound / outbound email notifications toggles | |
| 7:39–7:54 | **Dental Team**: 3 users, roles, BAA Accepted, In search | |
| 7:57–8:09 | **Referral Access Code** (Company Access PIN) | |
| 8:12–8:18 | **Memberships** (Add New Plan) | |
| 8:21–8:42 | **My Settings** (profile, change password, reset code) | |
| 8:45–9:03 | **Office Details** form | |
| 9:06–9:12 | **Provider's Day-Prep Station** (dark full screen: loading → "No scheduled appointments for this day") | |
| 9:15 | Office Details | |
| 9:18–9:39 | ★ **Invite your Network** · Copy Template tab (invitation email, benefits list, Copy Invitation Template / Rotate Link) | network growth |
| 9:42–9:45 | Invite · **Manual Entry** tab | |
| 10:00–10:15 | Invite · Copy Template again | |
| 10:18–10:27 | Invite · **Upload CSV** tab | |
| 10:30–10:42 | **User menu** open (Profile Picture, Push Notifications, Account Settings, Help & Support, Sign out) | |
| 10:45–10:57 | **Contact support** dialog | |
| 11:00–11:09 | **Ask ToothReferral** dropdown (Try asking chips + Places) | |
| 11:12–12:29 | Office Details, idle / scrolling (nothing new) | skip |

## Animation recipes (for future edits)
- Treat V2 like the dash3c stills: zoom/pan within it, add our highlight boxes (purple; amber for problems), callout
  chips and cursor accents; keep the 3D panel swing from Buried in Emails v2 (`BuriedInEmails2.tsx`).
- Ready-made beats: messages (0:02–0:06) · team notes + timeline + signed note (0:10) · insurance request + toast
  (0:42–0:52) · new referral wizard (0:58–1:10) · EHR export modal (1:50–1:54) · template auto-fill (2:26–2:30) · route
  to a doctor (2:30) · DocuSign sign (2:54–3:04) → "All done" (3:12) → signed note on the case (3:20).
- Cut every loading gap (V2 0:22, 2:42–2:52, 3:06–3:10, 3:24).
- Blur names/IDs (see Privacy) or overlay the approved demo names before export.
