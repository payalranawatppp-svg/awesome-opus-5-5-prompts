# ToothReferral dashboard: what the product actually shows

Source of truth for scripts and edits. Built from the two screen recordings the client shared (Oct 2026 incoming-referrals
walkthrough, and `reel/public/screen/dashboard-2-lead-forms-analytics-docusign.mp4`, 4:10, recorded 11/2/2026).
Only claim on screen or in dialogue what is listed here; anything else (agentic re-queueing, rule-enforced statuses) comes
from the client's marketing brief and must be shown as motion graphics, never as fake product UI.
All patient/practice names are fictional demo data (D Care Alliance, Lee Davis, Bob Smith, Sarah Chen…).

## Layout (every page)

- Left sidebar: practice name (D Care Alliance), ToothReferral logo ("Just Refer it"), then **Analytics**, **Referrals**
  (Incoming · Outgoing · Cases Completed), **Notifications** (red count badge), **Notes**, **Website Lead Forms**,
  **Settings**, **Offices**.
- Top bar: page title, office switcher, **Provider's Day-Prep Station**, **Invite your Network**, **New Referral**
  (purple), user (Lee Davis, Associate Dentist).
- Under the title: an AI assistant box, "Ask how to embed, forward, invite…" (sparkle icon).
- Bottom-right: purple chat bubble.
- Brand purple ≈ #6D4AE8 / #7B4CF0; light lavender sidebar.

## 1. Referrals (Incoming / Outgoing / Cases Completed)

- **Incoming list**: search (patient, DOB, referring office), Status filter, Received month filter, Show archived,
  **Add patient**. Columns: Patient Name (avatar + **@N mention badge**), DOB, Referring Office (**green dot = Connected
  Network Member**), Receiving Office, Status pill, Received, Last Update, View · Archive, **Signed Referral** link once a
  completion note is signed. New rows are highlighted.
- **Outgoing**: same table for referrals you send (Receiving Office, Sent date). "No referrals found" when empty.
- **Case detail** (View): tabs Details / Messages (count). Patient block (name, DOB, age, pronoun, gender, phone, email);
  Referral Status (e.g. "Symptomatic"), "Please consult and treat", requested treatment cards (e.g. Implant Restoration,
  diagnosis #26 #27, notes) with Edit/Delete; buttons Edit Referral, **Download PDF**, Download PDF for patient,
  Delete Referral.
- **Attachments**, "shared with both offices": X-rays (thumbnails, Download, Edit X-rays), Documents, **Insurance cards**
  (front/back, policy, group, subscriber; + Add card, **Request from patient**).
- **Activity log**: who did what and when (e.g. "Sarah Chen … updated: x-rays added").
- **Office Communication** (right column): chat with the referring office, **@mentions** ("2 unread @mentions", Mark all
  as read), threaded replies, emoji/@ composer; footer "All communications are HIPAA compliant and encrypted · Secure".
- **Status & Schedule**: status dropdown + **Update Status** → green toast "Success · Status updated successfully! A
  notification has been created." Options: Hide Note Creator, **Schedule**, **Create a Note**, Email notification
  settings.
- **Administrative Notes**: company-private, not shared with other parties.

### Statuses that exist (Analytics "Status board")
New · Received · In Progress · **Left a Voice Message** · **Callback Requested** · **Unable to Contact** · Consultation
Scheduled · Consultation Completed · Scheduled · Completed · Cancelled · Declined Appointment · Referred Out.
(So voicemails and callbacks ARE tracked as statuses; calls themselves are not logged as call records.)

## 2. Consultation / completion note + DocuSign (closing the loop with the GP)

1. Set status to Consultation Completed → **Prepare Consultation Note** modal: Template (General), rich-text editor,
   **Insert Variable** ({{completionDate}}, {{referringDoctorName}}, {{referringDoctorAddress}}, {{patientName}},
   {{patientDob}}), Preview, Save Draft / Save Changes / Save as New Template, **Sign and Send Completion Note**.
2. **DocuSign** opens inside ToothReferral ("Sign Completion Note · docusign"): letter to the referring doctor
   ("Thank you for referring Bob Smith to our office for treatment… Sincerely, Lee Davis"), drag-and-drop fields
   (Signature, Initial, Stamp, Date Signed, Name…), **Finish**.
3. "All done — your document is signed!" → back in the case: toast **"Consultation Note signed and sent successfully."**
   and the list row shows **Signed Referral**.
Message angle: the GP gets a signed thank-you/completion letter automatically, no printing, faxing or scanning.

## 3. Website Lead Forms (lead generation for the practice's own website)

- Banner: "Embed trial active… available until [date]. Upgrade to Pro to keep embeds after the trial." (no prices)
- **Choose a web form**: *Build a Lead Generating Referral Form* (custom embedded form for referring offices) or
  *Build a Lead-Generating Contact Us Page* (NEW).
- **Embed Settings** ("Contact Us Web Form for General Dentists — Stop Losing Patients to Cluttered Websites: Transform
  Your Contact Page into a High-Converting Patient Funnel") with a **Live patient preview** on the right:
  - Office logo (800×400 or 400×400, PNG/SVG/JPEG/WebP).
  - Welcome message: write your own or pick a sample ("Neighborhood dental home…"), with {{companyName}} variable.
  - **"What we are known for!"** skill chips picked from a long list (Bone Graft, Full Arch Implant Placement, Implant
    Restorations, IV Sedation, Botox, Holistic Dentist, Nitrous Oxide, Coffee Bar, languages…) or typed in.
  - Toggle: Google Map with directions to the office.
  - **Ready to Schedule!** — interested-treatment dropdown with your own options.
  - "Turn your contact us page into a safe lead generator: all submissions come securely in your ToothReferral portal,
    protecting your email and server."
  - **Submit Insurance** button: secure insurance submission link capturing insurance info for pre-verification
    (label + colour editable).
  - **No Insurance** button: opens your Dental Membership Plans to capture uninsured patients (label + colour editable).
  - Up to 5 **custom link buttons** (e.g. "BOOK NOW" → your scheduling page).
  - Insurance carriers shown once Insurance Acceptance Settings are filled.
- **Go live on your website**: enable the embed to publish and get the install snippet.
Message angle: the practice website becomes a lead source that feeds straight into the dashboard (Analytics →
Referral sources shows "Embed widget").

## 4. Analytics

- Toggles **Received / Sent**, date range (Last 30 days · daily), Specialty filter, **Export PDF**.
- KPI cards with sparklines: **Volume received** (vs prior), **Time to first contact** (e.g. 18.5 h), **Case
  acceptance %**, **Ghost rate %**.
- **Top senders** (practices sending you referrals, count + %; click to see what they sent) and **Top procedures**
  (Crown recementation, Implant Restoration, Sleep Appliance…).
- **Volume received** line chart (current vs prior period).
- **Referral funnel**: Received → Contacted → Scheduled → Completed with "N dropped · X% leak" between steps, overall
  conversion. (Strong visual for the "leak" story.)
- **Lifecycle clocks**: time to first contact, time to schedule, time to completion, waiting while scheduled, open
  referrals age.
- Cards: Consultations scheduled, Consult to completion (days), Referrals to consultation %, Consultations completed %;
  Consultations scheduled chart.
- **Needs attention** with one-click actions: scheduled appointments past date with no completion note → **Mark
  complete**; ghost referrals (3+ attempts logged) → **Re-assign**; insurance requests outstanding > 48 h → **Send
  reminder**.
- **Staff responsiveness**: per staff member log-ins, average time in app, changes (last 30 days).
- **Referral outcomes** donut (Awaiting contact, Working, Consultation, Scheduled, Completed) and **Referral sources**
  donut (Embed widget, Network, Manual).
- **Status board**: every status with count, average and longest wait, and which referring doctors' cases sit there.

## Stills for edits (`reel/public/dash2/`, 1904×868, page only: browser bars, taskbar and scrollbar cropped)

lf-01-choose-form · lf-02-embed-settings-preview · lf-03-skills-dropdown · lf-04-secure-lead-generator ·
lf-05-submit-insurance · lf-06-insurance-buttons-preview · lf-07-custom-book-now · an-01-kpis ·
an-02-senders-procedures · an-03-volume-funnel · an-04-lifecycle-clocks · an-05-consultations ·
an-06-needs-attention-staff · an-07-outcomes-sources · an-08-status-board · in-01-incoming-list · cs-01-case-detail ·
cs-02-consultation-note · cs-03-docusign-preparing · cs-04-docusign-document · cs-05-signature-placed ·
cs-06-signed-done · cs-07-signed-success · cs-08-case-messages.
Earlier stills: `reel/public/dash/rec-*.jpg`. Full recording for motion: `reel/public/screen/…mp4` (timestamps:
lead forms 0:00–1:50, analytics 1:55–2:20, outgoing/incoming 2:20–2:40, case + consultation note 2:40–2:58,
DocuSign 2:58–3:55, signed success 3:55–4:10).
The recording has a Windows taskbar and a screen-share bar ("app.scre.io is sharing your screen") at the bottom of some
frames: always crop to the page area (x 0-1904, y 151-1019 of the 1920x1080 recording) and never show the browser tabs or taskbar.

## Script ideas these features unlock

- "Your website's contact page is losing patients" → Contact Us lead form with insurance pre-verification and a
  membership-plan button for uninsured patients.
- "Do you know where your referrals leak?" → Referral funnel with "% leak" labels and Ghost rate.
- "How fast does your team call back?" → Time to first contact + Staff responsiveness.
- "Close the loop in one click" → completion note signed with DocuSign and sent to the GP.
- "Which GPs actually send you patients?" → Top senders + Referral sources.
- "Nothing falls through the cracks" → Needs attention (Mark complete / Re-assign / Send reminder) and the Status board
  (Left a Voice Message, Callback Requested, Unable to Contact).

## Recording 3 (2026-11-07): case detail, messages, notes, insurance, audit trail

`reel/public/screen/dashboard-3-case-audit-trail.mp4` (60.6 s, 1920×912 at 30 fps, browser zoomed in, so text is
large and crisp). Key stills in `reel/public/dash3/` (r3-01 … r3-09). What it shows, in order:

| Time | Screen | Use it for |
|---|---|---|
| 0–8 s | Case detail (patient Carter Wiley, "Referred to Gentle dental clinic"), Office Communication thread on the right | the case, shared by both offices |
| 9–17 s | **Messages** tab: Office Communication with Apex Dental (x-ray request → "I updated the latest xray" → "Got the updated x-ray thank you"), Referral snapshot (From Apex Dental, To Gentle dental clinic, Consultation Completed) | messaging the referring general dentist inside the platform |
| 18–20 s | **Incoming Referrals** list (Carter Wiley Consultation completed; Conrad Smith, John Carter, George Miranda New; green "Connected Network Member" dots) | one centralized place for every referral |
| 21–27 s | Status & Schedule (**Log a contact attempt** chips: Left a Voicemail, Voicemail Not Set Up, Unable to Contact, Declined Appointment, Referred Out, Cancelled, Spoke with Patient / Scheduled), Attachments: X-rays (New Pano 2026, pristine) | X-rays on the referral; contact attempts logged |
| 27–31 s | **Administrative Notes** ("Company-private notes. Not shared with other parties", 9 notes, @mentions, Journey: Spoke with Patient / Scheduled → Consultation Completed, Build journey document); Signed notes: Consultation Note signed | administrative notes / internal team communication |
| 31–44 s | **Insurance cards (1)**: Delta Dental front and back, Policy, Group, Subscriber; Add card / Request from patient | insurance already on the referral |
| 44–51 s | **Activity log** (the audit trail): who did what, with time stamps: consultation completed, scheduled, "updated: x-rays added", received, "new referral created for…" | the patient audit trail |
| 51–55 s | **All Attachments** (every image and file in one place) and **Primary Referral Source**: Apex Dental, Connected Network Member | the referral network |
| 55–60 s | back to the top of the case | outro |

**Must be cleaned before use (client rules):** doctor names "Dr Lee Davis DDS, DDS", "Tom Colpack, DDS (Owner
Dentist)", plus "Flora Gibson" and "Jane White". Map to staff names: Jane White → Tanya (Dental Assistant), Dr Lee Davis
→ Amanda (Office Manager), Barbara Smith → Barbara, Tom Colpack and Flora Gibson → Greg (Front Desk). Offices: receiving
"Gentle dental clinic" → St. Andrew's Family Dental, referring "Apex Dental" → Gentle Dental. Also blur or replace the
real-looking email address (umairasma31@gmail.com) and phone numbers. Red buttons (Delete Referral, Delete) → amber.
Because names move while scrolling, use cleaned stills with animated camera moves (pan, zoom, cursor, highlights),
not the raw scrolling video.

## Analytics page — CANONICAL REFERENCE (user rule, 2026-11-07)

For **every** analytics visual from now on (videos, stills, carousels, ads, slides, scripts that mention numbers,
any "analytics reference or anything"), use the edited real page in `reel/public/analytics-ref/` and nothing else:

- `analytics-full-page.png` (1920x4785, whole page), `viewport-01..07.png` (1920x842 screens, 600 px apart),
  section crops `01-header-kpis` … `08-status-board`.
- Video version: `reel/renders/analytics-demo.mp4` (the real recording with the data edited in).
- Data behind it (quote these numbers, they all reconcile): `reel/src/data/analytics-demo.json` made by
  `reel/scripts/analytics_data.py`; editing pipeline in `reel/scripts/analytics_plate/`.

Numbers on it: 28 received (+27% vs 22 prior), time to first contact 3.7 h, case acceptance 76%, ghost rate 7% (2),
funnel 28 → 25 → 20 → 9 (leaks 11% / 20% / 55%, conversion 32%), clocks 3.7 h / 16.9 h / 10.3 d / 4.5 d / 8.6 d,
consultations 20 scheduled, 6 d to completion, 71% referrals to consultation, 85% completed; senders St. Andrew's
Family Dental 7, Bright Smile Family Dentistry 6, Maple Grove Dental 5, Riverside Dental Care 4, Lakeside Family
Dentistry 3, Summit Dental Group 3; sources Network 19 / Embed widget 7 / Manual 2; outcomes 3/4/7/4/9/1; staff
Amanda 24/38m/58, Tanya 21/31m/49, Barbara 11/14m/16; needs attention 2 / 2 / 3. Receiving office: Gentle dental
clinic; logged-in user Amanda, Office Manager. Original app colours kept (red badge / leak rows are native).
