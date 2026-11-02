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

## Stills for edits (`reel/public/dash2/`, 1920×965, browser chrome cropped)

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
frames: always crop to the page area (y 75–1040) and never show the browser tabs or taskbar.

## Script ideas these features unlock

- "Your website's contact page is losing patients" → Contact Us lead form with insurance pre-verification and a
  membership-plan button for uninsured patients.
- "Do you know where your referrals leak?" → Referral funnel with "% leak" labels and Ghost rate.
- "How fast does your team call back?" → Time to first contact + Staff responsiveness.
- "Close the loop in one click" → completion note signed with DocuSign and sent to the GP.
- "Which GPs actually send you patients?" → Top senders + Referral sources.
- "Nothing falls through the cracks" → Needs attention (Mark complete / Re-assign / Send reminder) and the Status board
  (Left a Voice Message, Callback Requested, Unable to Contact).
