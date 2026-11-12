# Source: Vejay's platform audit, 12 Nov 2026 (full text, kept verbatim for reference)


ToothReferral Platform Audit

- 

# ToothReferral Platform Audit
  Read-only feature audit for the video & marketing team

|  | Audit date | Thursday, 12 November 2026
    
|  | Environment | dev.toothreferral.com (logged-in session)
    
|  | Account type | General dental office (specialty shown: General Dentistry). Signed-in user role: Associate Dentist. One office in the company.
    
|  | Mode | Read-only. No data saved, sent, updated or deleted. New Referral excluded.

### GIFs recorded

|  | File | Covers
    
|  | 01_Analytics.gif | Analytics: Received/Sent toggle, filters, tooltips, all panels
    
|  | 02_Referrals_Lists.gif | Incoming, Outgoing, Cases Completed
    
|  | 03_Referral_Detail.gif | One referral: Details, Messages, Edit Referral (cancelled)
    
|  | 04_Notifications.gif | All / Unread / Read tabs and filters
    
|  | 05_Notes_and_Lead_Forms.gif | Note templates editor, Website Lead Forms builders
    
|  | 06_Settings_and_Offices.gif | Company Settings, Dental Team, Referral Access Code, Memberships, My Settings, Office Details
    
|  | 07_Top_Bar_and_Chat.gif | Day-Prep Station, Invite your Network, user menu, Contact support, AI help box
  
  Privacy: patients are shown as Patient A, B…, partner practices as Office A, B…, and people by role. Aggregate counts are reproduced as seen on screen.

## 2. Platform overview
  
### What the product does
  ToothReferral (tagline on the logo: "Just Refer it") is a dental referral workspace. One account sees referrals it receives (Incoming) and referrals it sends (Outgoing), with each referral holding the patient, the requested procedures, X-rays and documents, insurance cards, signed notes, a two-office message thread, a status, and an activity log. Around that core sit analytics, notifications, note templates, embeddable website forms that bring referrals and leads in, and team/office settings.

### Who uses it

- General dental offices — send patients to specialists and track whether the patient was contacted, scheduled and treated ("Closing the loop", "Patient leakage").
    
- Specialist offices — receive referrals, work them through call statuses, and send back consultation/completion notes. The embed builder is titled "Referral Web Form for Dental Specialists".
    
- Front desk and office managers — work the status chips (Left a Voicemail, Callback Requested…), request insurance from the patient, and see "Needs attention" items. Analytics tracks staff log-ins, time in app and changes per person.
    
- Dentists — @mentioned in case messages, sign notes, prepare their day in the Provider's Day-Prep Station.

### How a referral moves from received to completed
  
    Created / sent by the referring office (or via the website embed) → appears as New at the receiving office → staff work contact statuses (Left a Voicemail, Voicemail Not Set Up, Callback Requested, In Progress, Unable to Contact, Other) → Consultation Scheduled → Consultation Completed (consultation note signed) → Spoke with Patient / Scheduled → Completed (completion note sent back). Exit statuses: Cancelled, Declined Appointment, Referred Out.

  The example referral's activity log showed this sequence: new referral created → secure insurance request sent to patient → patient submitted insurance → consultation scheduled → consultation completed → a document added.

  Screens: 02_Referrals_Lists.gif, 03_Referral_Detail.gif

## 3. Navigation map
Top bar
├─ Page title
├─ Office label (Davis General Dentistry — single office, not a dropdown here)
├─ Provider's Day-Prep Station (full-screen view)
├─ Invite your Network (modal: Copy Template · Manual Entry · Upload CSV)
├─ New Referral  ← EXCLUDED
├─ User menu: Profile Picture · Push Notifications · Account Settings · Help & Support · Sign out
└─ Ask ToothReferral box: Try asking chips · Places list

Left sidebar
├─ Analytics
│   ├─ Received view (default)
│   └─ Sent view
├─ Referrals
│   ├─ Incoming
│   ├─ Outgoing
│   └─ Cases Completed
│       └─ Referral (View)
│           ├─ Details tab
│           ├─ Messages tab
│           └─ Edit Referral screen
├─ Notifications (badge: 27)
│   ├─ All · Unread (27) · Read
│   └─ Filters: Audience · Type · Search
├─ Notes
│   └─ Case Communication Templates → Create Completion Note Template (modal)
├─ Website Lead Forms
│   ├─ Build a Lead Generating Referral Form  [LIVE]
│   │   └─ tabs: 1. Demographic Information · 2. Procedures
│   └─ Build a Lead-Generating Contact Us Page  [NEW] [LIVE]
├─ Settings
│   ├─ Company Settings
│   ├─ Dental Team
│   ├─ Referral Access Code
│   ├─ Memberships
│   └─ My Settings
└─ Offices
    └─ Details

Floating button (bottom right) → Contact support dialog

## 4. Section-by-section feature detail

### 4.1 Analytics — Received view
  Purpose: show a receiving office how many referrals arrive, how fast staff respond, and where patients drop out.

#### Controls

- Received / Sent toggle with counts (Received 9, Sent 3).
    
- Date range: Period — Last 7 days, Last 30 days (default), Last 90 days, Quarter to date, Year to date, Last 12 months, Custom range. Granularity — D, W, M, Q, Y.
    
- Specialty filter: All specialties, General Dentistry.
    
- Export PDF — seen, not clicked.

#### KPI cards (tooltip text as shown)

|  | Card | Value seen | Tooltip
    
|  | Volume received | 9 (→ 0% vs prior) | Total referrals received in the selected period
    
|  | Time to first contact | 10.3 h | Median wall-clock from receipt to first patient contact
    
|  | Case acceptance | 0 % | Cohort conversion received → scheduled → completed
    
|  | Ghost rate | 0 % | Patients we could not reach (voicemail / no callback)

#### Panels

- Top senders — "Practices sending you referrals · click any row to see what they sent". Six offices with count and %. Clicking a row opens a side drawer listing that office's referrals (patient initials, specialty, age) and "View all referrals".
    
- Top procedures — Crown Recementation 4 (40%), Implant Restoration 2, Sleep Appliance 2, New Patient Dental Exam and Dental Cleaning 1, Second opinion 1.
    
- Volume received chart — daily receipts, Current vs Prior period.
    
- Referral funnel — Received 9 (100%) → Contacted 4 (44%, 5 dropped · 56% leak) → Scheduled 1 (11%, 75% leak) → Completed 0 (100% leak). Conversion 0%.
    
- Lifecycle clocks — Time to first contact 10.3 h, Time to schedule 0 h, Time to completion (No data yet · Awaiting events), Waiting while scheduled 0 h, Open referrals age 9.7 days. Solid line = this period, dashed = previous.
    
- Consultation cards — Consultations scheduled 3, Consult to completion 6 d, Referrals to consultation 33%, Consultations completed 100%; plus a Consultations scheduled chart.
    
- Needs attention (read only) — "1 scheduled appointments past appointment date · no completion note" [Mark complete]; "0 ghost referrals — patients we have not reached · 3+ attempts logged" [Re-assign]; "0 insurance requests outstanding · older than 48 h" [Send reminder]. Action links not clicked.
    
- Staff responsiveness — Staff, Log-ins, Avg time, Changes for each team member (Associate Dentist 19 / 31m / 18; Office Manager 2 / 11m / 8; Dental Assistant 2 / 16m / 8).
    
- Referral outcomes donut — Awaiting contact, Working, Consultation, Scheduled, Completed, Closed w/o completion.
    
- Referral sources donut — Embed widget, Network, Manual (Network 9 = 100%).
    
- Status board — "Where referrals sit right now": one card per status with count, average and longest age, and the oldest cases listed by patient initials and referring doctor. Completed, Cancelled, Declined Appointment and Referred Out show "Last 30 days" totals.
  
  Problem solved: no visibility of slow first contact, lost referrals and staff workload; the funnel's "leak" numbers make drop-off concrete.

  01_Analytics.gif

### 4.2 Analytics — Sent view
  Purpose: show a referring office what happens to patients it sends out.

|  | Card | Value | Tooltip
    
|  | Volume sent | 3 | Total referrals sent in the selected period
    
|  | Recipient turnaround | 0.4 h | Median wall-clock from us sending to the specialist's first contact with the patient
    
|  | Loop closure | 33 % | Share of sent referrals that reached completion
    
|  | Patient leakage | 67 % | Sent referrals where the patient was never scheduled by the recipient

- Volume sent chart with Specialty mix bar (Oral Surgeon 67%, Endodontist 33%).
    
- Closing the loop funnel — Sent 3 → Contacted 1 → Scheduled 1 → Completed 1 (33%).
    
- Lifecycle clocks — Recipient first contact, Time to schedule, Time to completion, Completion note return (No data yet), Waiting after sending.
    
- Where referrals go — top destination offices, click to see referrals.
    
- Most responsive offices — median first-contact time per specialist office.
    
- Needs attention — outgoing referrals stuck with no recipient response (older than 24 h) [Reassign / nudge]; completed appointments missing completion notes (older than 14 d) [Request signed PDF]; patients lost in transit [Open list]; specialists with no reciprocal referrals in 90 days, asymmetry ≥ 5:1 [Review relationship].
    
- Status board adds a Draft column and labels new outgoing items Sent.
  
  Problem solved: patients who never make it to the specialist; one-sided referral relationships.

  01_Analytics.gif

### 4.3 Referrals — Incoming
  Purpose: work list of referrals received.

- Search: "Search patients, DOB, referring office, or receiving office".
    
- Status filter: All referrals, Active, New, Received, Consultation Scheduled, Consultation Completed, Scheduled, Left a Voice Message, Voicemail Not Set Up, Other, Callback Requested, In Progress, Completed, Cancelled, Referred Out, Unable to Contact, Declined Appointment, Amended.
    
- Received filter: All months, November 2026, October 2026.
    
- Show archived checkbox; Add patient button (not clicked).
    
- Columns: checkbox, Patient Name, DOB, Referring Office, Receiving Office, Status, Received (sortable, newest first), Last Update (sortable), actions View · Archive.
    
- Badges: "@ n" purple badge = unread @mentions on that case; green dot = Connected Network Member (legend at top); a Signed Referral link under some rows; some rows bold/tinted.
    
- Status pills seen: New, Consultation completed. Pagination "Showing 1 to 8 of 8 results".

#### What the two labels mean

- Connected Network Member — the referral card and list show it under the referring practice's name with a green dot; the practice is a ToothReferral member connected to this office.
    
- Signed Referral — on the referral, "Signed notes · Visible to both offices" lists a "Referral" item "Signed … by [Owner Dentist]". The list link points to that signed document (seen, not opened).
  
  Problem solved: lost referrals and fax piles — one searchable list with status and who sent it.

  02_Referrals_Lists.gif

### 4.4 Referrals — Outgoing

- Search "Search patients, DOB, or office"; Status filter; Sent month filter; Show archived.
    
- Columns: Patient Name, DOB, Receiving Office, Status, Sent (sortable), Last Update (sortable), View · Archive.
    
- Status list: All referrals, Active, Sent, Draft, Sent, Consultation Scheduled, Consultation Completed, Scheduled, Left a Voice Message, Voicemail Not Set Up, Other, Callback Requested, In Progress, Completed, Cancelled, Referred Out, Referred Out - Forward, Unable to Contact, Declined Appointment, Amended.
    
- An envelope icon appears beside one patient's name (meaning not labelled — see Open questions).
  
  02_Referrals_Lists.gif

### 4.5 Referrals — Cases Completed
  Header: "Browse before & after outcomes from your patients' specialist visits." Empty state: "No completed cases yet. Once a specialist marks a referral you sent as completed, it will show up here."

  Problem solved: the referring dentist sees the outcome of work they sent out.

  02_Referrals_Lists.gif

### 4.6 Inside a referral (Patient A) — Details tab
  Top actions: Back to Referrals · Edit Referral · Download PDF for patient (seen, not downloaded) · Delete Referral (not clicked). Tabs: Details · Messages (badge 4).

- Patient block: Referred to (office + dentist); Patient Name, DOB, Age, Preferred pronoun, Gender, Dental Insurance Company, Patient's Phone, Patient's Email.
    
- Referral Status: "Status and requested treatment for this referral." Type pill (Routine), Chief Complaint, "Please consult and treat" with numbered procedures (e.g. Crown Recementation with Diagnosis: tooth #, Sleep Appliance).
    
- Attachments: "Imaging, documents, and signed notes shared with both offices." X-rays (count, thumbnail, file name, date, Download, Edit X-rays) and Documents (Edit Documents; "No documents attached").
    
- Signed notes — "Visible to both offices." Referral (Signed by Owner Dentist: View, Download) and Consultation Note (Signed by Associate Dentist: View, Rename, Edit, Download).
    
- Insurance cards (1) — "Primary / secondary cards for this patient." + Add card, Request from patient ("Last requested 24 days ago"). Card: PRIMARY, Submitted by Staff, Edit, Delete, FRONT image, back "missing", Policy, Group, Subscriber, Subscriber DOB, Employer, Insurance Company.
    
- Activity log — time-stamped actions by person (created, insurance request sent, insurance submitted, status changes, document added).
    
- All Attachments — "Every image and file on this referral, in one place. Drag any card to set the order specialists and exports will see." "Order saved automatically".
    
- Primary Referral Source card — practice logo, name, Connected Network Member, Address, Phone, Email.

#### Right column

- Office Communication — "Messaging with [referring office]", Expand, "4 unread @mentions" badge, Mark all as read (not clicked), threaded messages with name, office, role and time, quoted replies, highlighted @mentions; composer with @ and emoji buttons, "Enter to send · Shift+Enter for new line" (nothing typed).
    
- Status & Schedule — "Update referral status, call the office, or schedule an appointment." Link: Email notification settings. Status chips (current one outlined): Received, Consultation Scheduled, Consultation Completed, Spoke with Patient / Scheduled, Left a Voicemail, Voicemail Not Set Up, Callback Requested, In Progress, Completed, Cancelled, Referred Out, Unable to Contact, Declined Appointment, Other. Checkbox Hide Note Creator: "Don't prompt for a note when changing to Completed, Cancelled, or Consultation Completed. You can still use Create a Note." Buttons: Schedule, Create a Note. Chips were not clicked — clicking would change the status.
    
- Administrative Notes — "Company-private notes. Not shared with other parties." "No notes yet".
    
- Footer: "All communications are HIPAA compliant and encrypted · Secure · Last updated".
  
  Problems solved: missing X-rays, chasing insurance (patient self-submits via secure link), phone tag (status chips + messages), unsigned paperwork.

  03_Referral_Detail.gif

### 4.7 Messages tab
  Left: Referral snapshot (patient, status pill, From, To, Type, "Open full details →"). Right: full-width Office Communication thread with the same composer and HIPAA footer.

  03_Referral_Detail.gif

### 4.8 Edit Referral screen (opened, then Cancel)
  Warning banner: "This referral has been signed. Saving changes will clear the signature and require re-signing."

- Patient Information: First Name*, Last Name*, Email*, Phone*, Date of Birth* (locked), Gender (Male, Female, Other), Pronouns (he/him, she/her, they/them, Other), Guardian Name.
    
- Referral Details: Referral Type (Routine, Urgent, Symptomatic, Elective, Consultation, Treatment, Consultation and Treatment); Contact Preference* (Patient will contact, Contact patient, Contact guardian); Preferred Contact Methods (Email, Phone, Text); Chief Complaint; Additional Notes; Edit Message (optional) "Add a note about these changes".
    
- Buttons: Cancel (used) · Save Changes (not clicked).
  
  03_Referral_Detail.gif

### 4.9 Notifications

- Tabs: All, Unread (27), Read. Mark all as read (not clicked). Select all + Mark as read (not used). Search notifications.
    
- Audience: All audiences, Company, Me.
    
- Type: All notifications, Status Notifications, Mentions, Insurance Submission, Case Correspondence.
    
- Each row: expand arrow ▸, unread dot, icon (✦ activity / @ mention), title, preview text, age. "Showing 1 to 20 of 63 results", Previous/Next.

#### Event types seen
  sent messagementioned youmentioned you in a noteNew referral createdsent completion noteconsultation completed Referralcompleted Referralupdated referral detailsscheduled Referral (with appointment date)consultation scheduled Referral (with date)edited referralsent secure insurance request to patientin progress Referralupdated patient insuranceadded patient insuranceupdated reason group

  Problem solved: nothing slips because every case event from partner offices is in one feed.

  04_Notifications.gif

### 4.10 Notes — Case Communication Templates
  "Build reusable note templates with smart variables that auto-fill patient data, doctor names, and more." Empty state: "No templates yet — Get started by creating your first completion note template, or upload an existing Word doc or PDF to import it."

  Create from scratch opens "Create Completion Note Template" (closed with Cancel):

- Template Title; Used for: General ("Any completion note."), Declined Appointment, Consultation Completed.
    
- Template Content with Show values / Show codes toggle, Template Tutorial, Import from Word / PDF.
    
- Rich-text toolbar: undo, bold, code, list, link, Paragraph, Size, lists, alignment, insert image, Insert Variable…
    
- Pre-filled sample letter ("Thank you for referring … to our office for treatment…").
    
- Buttons: Reset to Default, Cancel, Create Completion Note Template.

#### Smart variables (exact list)
  Patient NamePatient DOBReferring Doctor NameReferring Doctor AddressReferring Office NameReceiving Doctor NameReceiving Office NameReferring Doctor Company EmailReceiving Doctor Company EmailReferring Doctor Company Phone NumberReceiving Doctor Company Phone NumberSpecialtyCompany LogoX-ray ImagesCompletion DateToday's DateDeclined Reason

  Problem solved: retyping completion letters for every case.

  05_Notes_and_Lead_Forms.gif

### 4.11 Website Lead Forms (not in the brief — found in sidebar)
  Banner: "Embed trial active. Your website referral embed is available until Dec 2, 2026. Upgrade to Pro to keep embeds after the trial." "Choose a web form — Configure and embed forms on your practice website from Office Management." Disable embed (not clicked).

#### Build a Lead Generating Referral Form [LIVE]
  Title "Referral Web Form for Dental Specialists". Tabs 1. Demographic Information · 2. Procedures, with a Live patient preview ("Open in new tab →"). Options seen:

- Logo (ideal 800×400 or 400×400; PNG, SVG, JPEG, WebP; max 2 MB).
    
- Welcome message: sample messages "Neighborhood dental home", "Community 'Cheers' atmosphere", or Create your own (rich text).
    
- Insurance Accepted display: Show all accepted insurances / in-network only / out-of-network only / Don't show insurances.
    
- "What we are known for!" skill tags (e.g. Bone Graft, Full Arch Implant Placement, Implant Restorations; long pick-list incl. IV Sedation, Same Day Crowns, Spanish, Therapy Dog…); Badge style Simple / Fun & colorful.
    
- Specialty & Doctor Routing ("This company has only one dentist … Referrals will be routed to them automatically").
    
- Toggles: Referral Status (ON), Chief Complaint (ON), Office Map (OFF), Membership Links (OFF), Send a Secure Link to the Patient (ON), Upload Information Manually (ON), Tooth Numbers (OFF), Pediatric Chart (OFF).
    
- Buttons: Save, Get embed code (neither clicked).

#### Build a Lead-Generating Contact Us Page [NEW][LIVE]
  Title "Contact Us Web Form for General Dentists — Stop Losing Patients to Cluttered Websites: Transform Your Contact Page into a High-Converting Patient Funnel." Preview shows welcome message, insurance notice, Google map with Directions, known-for tags, and a "Ready to Schedule!" form starting with "Interested dental treatment".

  Problem solved: referrals and new-patient leads arriving by phone/fax or getting lost on the website. Feeds the "Embed widget" source in Analytics.

  05_Notes_and_Lead_Forms.gif

### 4.12 Settings — Company Settings

- Company Logo upload (Upload Logo).
    
- Company Inbound Email Notifications — sends alerts to the company email for all account activity; ON. Warning: "Turning this off disables all email notifications, including new referrals, mentions, and all office communications."
    
- Company Outbound Email Notifications — "Customize which outbound email updates referring providers receive when a referral's status changes in your practice." Per-status toggles: Received, In Progress, Scheduled (ON), Consultation Scheduled, Consultation Completed, Completed (ON), Cancelled, Referred Out, Unable to Contact, Declined Appointment, Left a Voice Message, Callback Requested, Amended.
    
- Other notifications: Mentions (ON), Completion Note (ON), Direct Messages (OFF), Patient Insurance Submitted (ON), New Contact Us Lead (ON).
    
- Analytics Report: Weekly Analytics Report (ON), Monthly Analytics Report (PDF) (ON).
    
- Insurance promo panel: "Stop Losing Referrals to the 'Do They Take My Insurance?' Question" — manage In-Network / Out-of-Network / Fee-for-Service. Add Insurance Provider, Add New Carrier, Save Settings (not clicked).

### 4.13 Settings — Dental Team

- "Manage your team and office assignments." "3 users, 1 doctors, 1 offices". Invite team member (not clicked).
    
- Filters: Search by name or email, Office, Role, Sort (Name A→Z).
    
- Columns: Doctor, Role, Specialty, Status, Offices, edit/delete icons.
    
- Status badges: Active, BAA Accepted [date] with PDF link, In search.
    
- Roles available: Associate Dentist, Office Manager, RDH, Front Desk, Dental Assistant, Sterilization Tech, Other.
    
- Find-a-dentist listing legend: "In search — at least one insurance carrier on file…" / "Not listed — dentist does not appear in search until insurance is added."

### 4.14 Settings — Referral Access Code
  "Company Access PIN": a PIN staff enter on another practice's ToothReferral-powered website to auto-fill the office's contact details without logging in; "All completed referral information will track directly back to your dashboard." Fields PIN (4–8 digits), Confirm PIN; Update PIN (not clicked).

### 4.15 Settings — Memberships
  "Manage your membership plans settings" with Add New Plan (not clicked). No plans listed. Linked to the "Membership Links" toggle on the embed form ("No Dental Insurance? View Membership Plans").

### 4.16 Settings — My Settings
  Upload Picture; First/Last Name, Email ("managed by your administrator"), Phone, Role (locked), Degree; Save Changes. Change Password (Old/New/Confirm). "Reset your password — We'll send a verification code to [masked email]" · Email me a reset code. Nothing changed.

### 4.17 Offices — Details
  Office Name, Street Address (Google address lookup), Suite, State, City, ZIP, Email, Phone, Fax, Save Changes; Manage Dental Team button; note "Email notifications for the main office are managed in Company Settings." Only one office exists, so there is no multi-location dropdown on this account.

  06_Settings_and_Offices.gif

### 4.18 Top bar

- Provider's Day-Prep Station — dark full-screen view with provider picker, "Today" label and date picker; empty state "No scheduled appointments for this day — Use the Schedule button on referrals to add appointments." Close.
    
- Invite your Network — "Invite multiple people from your referral network to join ToothReferral. When they sign up, each invitee will have you as a favorite…" Tabs: Copy Template (pre-written invitation email with sign-up link and benefits: Direct Collaboration, Centralized & Secure, Real-Time Access, SEO & Marketing; buttons Copy Invitation Template, Rotate Link), Manual Entry (Name, Email, + Add Another, Send Invitations), Upload CSV (upload/drag CSV, Download template, Send Invitations). Nothing sent.
    
- User menu — Profile Picture, Push Notifications, Account Settings, Help & Support, Sign out (seen, not opened).
    
- Ask ToothReferral box — placeholder "Ask how to embed, forward, invite…". On focus: Try asking chips (How do I embed the form?, Forward a referral, Add a patient, Invite a provider, Can't find a patient?, Day-Prep for a scheduled referral, Open support chat) and Places quick links (Incoming Referrals, New Referral, Add a patient, Website Lead Forms, Invite your Network). Nothing submitted.
    
- Notification bell — no separate bell icon in the top bar; unread count shows as a red badge (27) on the sidebar Notifications item.

### 4.19 Floating chat button
  Opens Contact support: From (user name), Email, Category (Technical, Billing, General question, Inquiries), Your message ("Please enter at least 3 characters"), Cancel, Send message. Closed with Cancel.

  07_Top_Bar_and_Chat.gif

## 5. The referral lifecycle

|  | # | Status (as shown) | Meaning / trigger as seen
    
|  | 0 | Draft | Outgoing only (Sent filter and Sent status board). Trigger not observed.
    
|  | 1 | New (receiver) / Sent (sender) | Automatic when a referral is created — notification "New referral created"; activity log "new referral created for…".
    
|  | 2 | Received | Manual chip. Company setting: "When a referral is first received by your office".
    
|  | 3 | Left a Voicemail / Left a Voice Message | Manual chip — "When a voicemail is left for the patient".
    
|  | 4 | Voicemail Not Set Up | Manual chip.
    
|  | 5 | Callback Requested | Manual chip — "When a callback is requested".
    
|  | 6 | In Progress | Manual chip.
    
|  | 7 | Unable to Contact | Manual chip; feeds Ghost rate.
    
|  | 8 | Other | Manual chip.
    
|  | 9 | Consultation Scheduled | Manual (chip or Schedule button); notifications carry the date.
    
|  | 10 | Consultation Completed | Manual chip; prompts for a note unless "Hide Note Creator" is checked.
    
|  | 11 | Spoke with Patient / Scheduled (list name: Scheduled) | Manual; "When an appointment is scheduled".
    
|  | 12 | Completed | Manual; prompts for a note; "completion note" event goes to the referring office; case appears in their Cases Completed.
    
|  | — | Cancelled · Declined Appointment · Referred Out (· Referred Out - Forward on Outgoing) | Manual exit statuses; Cancelled prompts for a note; Declined Appointment has its own note template type and a "Declined Reason" variable.
    
|  | — | Amended | In filters and email settings ("When a referral is amended"). Possibly set when a signed referral is edited — unconfirmed.
  
  Analytics groups these into outcome buckets: Awaiting contact, Working, Consultation, Scheduled, Completed, Closed w/o completion.

## 6. Communication features

- Office Communication (per referral) — threaded chat between the two offices, with names, office, role, time, quoted replies, emoji and an @ button. Available on Details (side panel) and Messages tab (full width).
    
- @mentions — highlighted in messages; counted as "n unread @mentions" on the referral and as "@ n" badges in the referral list; "Mark all as read". Also "mentioned you in a note".
    
- Notifications — central feed with Unread/Read, Audience (Company / Me) and Type (Status, Mentions, Insurance Submission, Case Correspondence) filters.
    
- Email — inbound alerts to the company email; outbound per-status emails to referring providers; weekly and monthly analytics reports; "Email notification settings" link on each referral.
    
- Note templates — completion-letter templates with 17 smart variables, three "Used for" types, Word/PDF import.
    
- Signed notes — Referral and Consultation Note, "Visible to both offices".
    
- Administrative Notes — "Company-private notes. Not shared with other parties."
    
- Patient touchpoint — "Request from patient" sends a secure insurance link; the patient's submission is logged and notified.
    
- Contact support — floating button.

## 7. Analytics and ROI features

|  | Metric | Decision it helps the owner make
    
|  | Volume received / sent (vs prior) | Is referral flow growing or shrinking; which periods to push marketing.
    
|  | Time to first contact / Recipient turnaround | Is the front desk calling patients fast enough; which specialists respond fastest.
    
|  | Case acceptance / Loop closure | How many referrals turn into treatment (revenue).
    
|  | Ghost rate / Patient leakage | How many patients are lost after the referral; whether to change follow-up or specialist.
    
|  | Referral funnel with leaks | Which step loses most patients (contact, scheduling, completion).
    
|  | Lifecycle clocks / Open referrals age | Where cases stall in time.
    
|  | Consultation cards | Consult-to-treatment conversion and speed.
    
|  | Top senders / Where referrals go | Which partner relationships to thank, nurture or rebalance.
    
|  | Most responsive offices | Which specialists to send patients to.
    
|  | Top procedures / Specialty mix | What services drive referrals.
    
|  | Staff responsiveness | Who is working the referrals (log-ins, time, changes).
    
|  | Referral sources (Embed widget / Network / Manual) | Whether the website embed and network invites are paying off.
    
|  | Needs attention | Today's to-do list: overdue completions, ghosts, stale insurance requests, stuck outgoing referrals, missing completion notes, one-sided relationships.
    
|  | Status board | Real-time pipeline with oldest cases surfaced.
  
  Also: Export PDF on Analytics (not clicked), weekly email and monthly PDF reports (Company Settings).

## 8. Collaboration and multi-office features

- Network — Connected Network Member badges; Invite your Network (template email with sign-up link, manual entry, CSV upload; invitees get you as a favorite); "Network" as a referral source.
    
- Referral Access Code (Company Access PIN) — staff auto-fill office details on other practices' ToothReferral forms; "shared across every office in your company".
    
- Offices — Offices menu with Details; Dental Team has an Office filter and per-user office assignment ("In all offices" chip). This account has 1 office, so multi-location switching could not be observed.
    
- Roles — Associate Dentist, Office Manager, RDH, Front Desk, Dental Assistant, Sterilization Tech, Other. Referring messages also show "Owner Dentist".
    
- Find-a-dentist listing — "In search" vs "Not listed" depending on insurance on file.
    
- Specialty & Doctor Routing — embed form routes to the doctors covering a specialty.
    
- Memberships — practice membership plans (none set up).

## 9. Security and compliance wording (exact)

- "All communications are HIPAA compliant and encrypted" · "Secure" — footer of every referral (Details and Messages).
    
- "Company-private notes. Not shared with other parties." — Administrative Notes.
    
- "Visible to both offices." — Signed notes.
    
- "This referral has been signed. Saving changes will clear the signature and require re-signing." — Edit Referral.
    
- "sent secure insurance request to patient" — activity log / notifications; embed option "Send a Secure Link to the Patient".
    
- "BAA Accepted [date]" with PDF — Dental Team status per user.
    
- "Your email is managed by your administrator." — My Settings.
    
- Invite template bullet "Centralized & Secure: It keeps all our case-related discussions in one secure location, ensuring patient data remains protected."

## 10. Strongest features for marketing videos — top 10 moments

|  | # | Section | What to show | Why it matters
    
|  | 1 | Analytics | Referral funnel with red "dropped · % leak" lines | Makes lost patients visible in one glance.
    
|  | 2 | Analytics (Sent) | Closing the loop + Patient leakage card | The referring dentist finally sees what happened to their patient.
    
|  | 3 | Referral detail | Office Communication thread with @mentions and quoted reply | Ends phone tag between offices.
    
|  | 4 | Referral detail | Status & Schedule colored chips | One click replaces sticky notes and call logs.
    
|  | 5 | Referral detail | Insurance card + "Request from patient" + activity log showing the patient submitted it | No more chasing insurance.
    
|  | 6 | Analytics | Needs attention list | A daily to-do list built from the data.
    
|  | 7 | Website Lead Forms | Builder with Live patient preview, skill tags, map | Turns the practice website into a referral and lead funnel.
    
|  | 8 | Analytics | Status board with oldest cases and ages | Real-time pipeline, nothing hidden.
    
|  | 9 | Notes | Template editor with Insert Variable and Show values/codes | Completion letters write themselves.
    
|  | 10 | Analytics | Staff responsiveness table | Owners see who is working the referrals.
  
  Honorable mentions: Provider's Day-Prep Station, Ask ToothReferral suggestion chips, Invite your Network template, All Attachments drag-to-order.

## 11. Skipped items

|  | Item | Reason
    
|  | New Referral button and form (top bar and "Places" link) | Excluded on purpose by the brief.
    
|  | Status chips, Schedule, Create a Note | Would change referral data. Options recorded without clicking.
    
|  | Mark complete / Re-assign / Send reminder / Reassign-nudge / Request signed PDF / Open list / Review relationship | Action links — seen, not opened.
    
|  | Export PDF (Analytics), Download PDF for patient, X-ray/note Download | Export/download — seen, not opened.
    
|  | Signed Referral link, signed-note View | May open or download a patient document — seen, not opened.
    
|  | Archive, Delete Referral, Mark all as read, Mark as read, Add patient, Add card, Request from patient, Invite team member, Add New Plan, Update PIN, Save/Save Changes/Save Settings, Send Invitations, Copy Invitation Template, Rotate Link, Get embed code, Disable embed, Send message | Change data or send — prohibited by the brief.
    
|  | Expanding individual notifications | Might mark them as read — seen, not opened.
    
|  | Embed builder "2. Procedures" tab, Template Tutorial | Not opened (time); seen only.
    
|  | User menu: Profile Picture, Push Notifications, Account Settings, Help & Support | Seen, not opened. Sign out never clicked.
    
|  | Multi-location office dropdown | Not present — account has one office.
    
|  | Remaining "?" tooltips (lifecycle clocks, consultation cards, status board) | Present; only the 8 KPI-card tooltips were read.

## 12. Open questions for the ToothReferral team

- Outgoing status filter shows "Sent" twice (for two different underlying values). Intended?
    
- What exactly sets Amended, Draft and Referred Out - Forward?
    
- The referral page lists the status chip as "Spoke with Patient / Scheduled" while lists/filters use "Scheduled"; and "Left a Voicemail" vs "Left a Voice Message". Same statuses?
    
- Which status changes happen automatically (beyond "New" on creation)? E.g. does opening a referral set "Received"?
    
- What does the bold/tinted row in referral lists mean (unread/unopened?), and the envelope icon beside a patient name on Outgoing?
    
- Analytics shows Case acceptance 0% while Consultations completed is 100% and 4 referrals sit in Consultation Completed — confirm how acceptance is calculated.
    
- Referral outcomes donut shows 8 referrals while Volume received shows 9 for the same 30 days — why the difference?
    
- Day-Prep Station showed "Today: 11/11/2026" while the date picker showed 11/12/2026 — time-zone handling?
    
- The embed builder is titled "for Dental Specialists" on a general-dentist account — is that intended copy?
    
- Is there a notification bell, or is the sidebar Notifications badge the only indicator?
    
- How does the multi-office experience look (office switcher, per-office analytics)? Not visible on a single-office account.
    
- Confirm the HIPAA/encryption claim wording is approved for use in marketing.
    
- Display inconsistencies worth cleaning before filming: the same sender appears with and without ", DDS" (and a stray space before the comma) in notifications; one office name in Top senders contains a typo ("Denitst"); a notification reads "added the the post op x-ray"; some doctor names show "Dr. Dr".

