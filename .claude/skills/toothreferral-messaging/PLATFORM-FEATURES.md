# Tooth Referral platform: feature knowledge (permanent reference)

Source: Vejay's read-only audit of dev.toothreferral.com, 12 Nov 2026
(`platform-audit/ToothReferral_Platform_Audit_2026-11-12.html`), plus the screenshots in `platform-audit/`
and the recorded GIFs it lists (01_Analytics … 07_Top_Bar_and_Chat). Read this before writing any script, ad,
carousel or caption, together with SKILL.md (section 000: "a system for the team").

Rules when using it:
- Only claim what is listed here (or in DASHBOARD.md). If a feature is not here, ask before showing it.
- The dev data shows real-looking names (Lee Davis, Sally Smith, Davis General Dentistry, Holland General Dentistry,
  Apex Dental, Oral Surgery Associates, Sarah Chen, Jennifer Harris, Tom Colpack, "Sam Smith"). **Never show or say
  these in public content.** Use the approved demo set: staff Barbara, Tanya, Amanda, Greg; offices Gentle Dental /
  St. Andrew's Family Dental; blur or crop names in any new screen.
- Analytics numbers in public content still come only from `reel/public/analytics-ref/` (the canonical page).
- Not for marketing yet: the **Contact Us page** builder (Vejay: no contact page for now); anything marked
  "unconfirmed" below; the HIPAA wording is on screen but Vejay should confirm it for ads (open question 12).
- Filming clean-ups the audit found: "Dr. Dr", stray ", DDS", "Denitst", "the the" in notifications. Never show them.

## The product in one line
A referral **system** (tagline "Just Refer it"): one account sees what it **receives** (Incoming) and what it
**sends** (Outgoing). Each referral is one case with the patient, procedures, X-rays and documents, insurance cards,
signed notes, a two-office message thread, a status and an activity log. Around it: analytics, notifications, note
templates, website forms, team and office settings. General dentists AND specialists use it.

## Who uses it (the team journey)
| Role | What they do in it | Value to them |
|---|---|---|
| Referring general dentist / their front desk | sends the referral (or via the specialist's website form), sees status, messages, gets the completion note, Cases Completed, Sent analytics | knows what happened to the patient ("closing the loop"), no calling to ask |
| Specialist front desk | Incoming list, status chips (Left a Voicemail, Callback Requested…), Request insurance from patient, schedule | one list, no hunting, no retyping insurance |
| Office manager | Needs attention, status board, staff responsiveness, notifications feed, settings | sees what's stuck and who is working it |
| Dental assistant / RDH | X-rays and documents on the case, All Attachments ordering, messages | the images are already there |
| Dentist / specialist | @mentioned in messages, signs notes, completion-note templates, Provider's Day-Prep Station | notes write themselves; day prepared |
| Owner | Analytics (funnel, leakage, top senders, ROI), weekly/monthly reports | sees referral growth and lost patients |
| The patient | secure link to submit their own insurance | less back-and-forth |
Team roles in Dental Team: Associate Dentist, Office Manager, RDH, Front Desk, Dental Assistant, Sterilization Tech,
Other (+ "Owner Dentist" on messages). BAA Accepted status per user.

## Lifecycle (statuses as shown)
Created → **New** (receiver) / **Sent** (sender) → staff work contact statuses: *Received, Left a Voicemail,
Voicemail Not Set Up, Callback Requested, In Progress, Unable to Contact, Other* → **Consultation Scheduled** →
**Consultation Completed** (consultation note signed) → **Spoke with Patient / Scheduled** (lists say "Scheduled") →
**Completed** (completion note goes back; case shows in the sender's Cases Completed). Exits: **Cancelled, Declined
Appointment, Referred Out** (+ "Referred Out - Forward" on Outgoing). Also **Draft** (outgoing) and **Amended**
(meaning unconfirmed). Changing to Completed / Cancelled / Consultation Completed prompts for a note (unless "Hide
Note Creator"). Analytics outcome buckets: Awaiting contact, Working, Consultation, Scheduled, Completed, Closed w/o
completion.

## Sections and features
**Referrals lists** (Incoming / Outgoing / Cases Completed): search (patient, DOB, office), status filter, month
filter, show archived, Add patient; columns Patient, DOB, Referring/Receiving Office, Status, Received/Sent, Last
Update; badges "@ n" unread mentions, green dot **Connected Network Member**, **Signed Referral** link. Cases
Completed: "Browse before & after outcomes from your patients' specialist visits."

**Inside a referral – Details tab**: Edit Referral (signed referral warns it must be re-signed), Download PDF for
patient, Delete. Patient block; Referral Status (type: Routine/Urgent/Symptomatic/Elective/Consultation/Treatment;
chief complaint; "Please consult and treat" numbered procedures with diagnosis/tooth). **Attachments** "shared with
both offices": X-rays, Documents. **Signed notes** "Visible to both offices" (Referral signed by the referring
dentist, Consultation Note). **Insurance cards** (primary/secondary, front/back, policy, group, subscriber) with
**Request from patient** (secure link) and "Submitted by Staff". **Activity log** (who did what, when). **All
Attachments** – drag cards to set the order specialists and exports see. **Primary Referral Source** card.
Right column: **Office Communication**, **Status & Schedule** (chips, Schedule, Create a Note, Email notification
settings), **Administrative Notes** ("Company-private notes. Not shared with other parties."). Footer "All
communications are HIPAA compliant and encrypted · Secure".

**Messages tab / Office Communication** (screenshot `messages-tab-office-communication.webp`): threaded chat between
the two offices, name + office + role + time, quoted replies, emoji, **@mentions** (highlighted, "4 unread
@mentions", Mark all as read), composer "Enter to send". Referral snapshot on the left. This is the "direct
communication / secure cloud messages" feature.

**Notifications** (`notifications-read.webp`): one feed of every case event from partner offices. Tabs All / Unread /
Read; Audience (Company / Me); Type (Status, Mentions, Insurance Submission, Case Correspondence); search. Events:
new referral created, sent message, mentioned you (also in a note), sent completion note, consultation
scheduled/completed, scheduled (with date), updated referral details, sent secure insurance request, patient
submitted / updated insurance, in progress, edited referral.

**Notes – Case Communication Templates**: reusable completion-note templates with **smart variables that auto-fill**:
Patient Name, Patient DOB, Referring/Receiving Doctor Name, Referring Doctor Address, Referring/Receiving Office
Name, Referring/Receiving Doctor Company Email and Phone, Specialty, Company Logo, X-ray Images, Completion Date,
Today's Date, Declined Reason. Used for: General, Declined Appointment, Consultation Completed. Rich-text editor,
Insert Variable, Show values/codes, **Import from Word / PDF**, Reset to Default. ("Completion letters write
themselves.") Vejay also says staff can **copy and paste notes into their own EHR**.

**Website Lead Forms** (`website-lead-forms-contact-us.webp`): (1) **Referral Web Form for Dental Specialists**
[LIVE] – logo, welcome message (samples or your own), Insurance Accepted display, "What we are known for!" skill
tags, Specialty & Doctor Routing, toggles (Referral Status, Chief Complaint, Office Map, Membership Links, Send a
Secure Link to the Patient, Upload Information Manually, Tooth Numbers, Pediatric Chart), Live patient preview, Get
embed code. (2) **Contact Us page** for general dentists [NEW] – **do not market yet**. Trial: embed available on a
trial, Pro to keep it. Feeds the "Embed widget" referral source.

**Analytics – Received** (specialist): KPI cards Volume received, Time to first contact (median receipt → first
patient contact), Case acceptance (received → scheduled → completed), Ghost rate (patients we could not reach). Top
senders (click → drawer), Top procedures, Volume chart, **Referral funnel with "dropped · % leak"**, Lifecycle clocks,
Consultation cards, **Needs attention** (overdue completion notes, ghost referrals, insurance requests > 48 h),
**Staff responsiveness** (log-ins, avg time, changes per person), Referral outcomes donut, **Referral sources**
(Embed widget / Network / Manual), **Status board** (where referrals sit now, oldest cases). Period/granularity/
specialty filters, Export PDF.
**Analytics – Sent** (general dentist): Volume sent, **Recipient turnaround**, **Loop closure**, **Patient leakage**
(sent but never scheduled), Specialty mix, **Closing the loop** funnel, Where referrals go, **Most responsive
offices**, Needs attention (stuck outgoing > 24 h, missing completion notes > 14 d, patients lost in transit,
one-sided relationships ≥ 5:1).
Reports: weekly analytics email, monthly PDF.

**Top bar**: **Provider's Day-Prep Station** (dark full-screen, provider + date picker; shows scheduled appointments
from referrals), **Invite your Network** (copy template email with benefits "Direct Collaboration, Centralized &
Secure, Real-Time Access, SEO & Marketing"; Manual Entry; Upload CSV; invitees get you as a favorite), user menu,
**Ask ToothReferral** box (suggestion chips: embed the form, forward a referral, add a patient, invite a provider,
Day-Prep…; Places links), floating **Contact support**.

**Settings**: Company Settings (logo; inbound email alerts; **outbound per-status emails to referring providers**;
Mentions, Completion Note, Direct Messages, Patient Insurance Submitted notifications; weekly/monthly analytics
reports; **Insurance acceptance** In-Network / Out-of-Network / Fee-for-Service – "Stop losing referrals to the 'Do
they take my insurance?' question"). Dental Team (invite, roles, offices, BAA, find-a-dentist listing "In search"
when insurance on file). **Referral Access Code** (Company Access PIN: staff auto-fill their office details on another
practice's Tooth Referral form; completed referral info tracks back to their dashboard). Memberships (practice
membership plans; "No Dental Insurance? View Membership Plans" link on the form). My Settings. **Offices** (details;
multi-office with per-user office assignment).

## Feature → story angle (for scripts and posts)
| Feature | Problem it solves | Story beat |
|---|---|---|
| One case per referral, Incoming list | referrals lost in email, fax, voicemail | "It's not just a form, it's a system" |
| Office Communication + @mentions | phone tag between offices | "Ask on the case, answer the same day" |
| Status chips + outbound status emails | "Did anyone call my patient?" calls | the referring office sees each update |
| Request insurance from patient | chasing insurance | the patient uploads it via a secure link |
| Completion-note templates + smart variables (+ copy into EHR) | retyping letters | "completion letters write themselves" |
| Signed notes visible to both offices | unsigned paperwork, faxing notes | signed note back automatically |
| Administrative Notes | sticky notes, hallway chats | private team notes with @mentions |
| Notifications feed | missing updates | nothing slips |
| Activity log / Staff responsiveness | who did what; workload | anyone can pick it up; owners see the work |
| Needs attention + Status board | stuck referrals | a daily to-do list from the data |
| Funnel leak / Patient leakage / Loop closure | invisible lost patients | "see where patients drop off" |
| Top senders / Most responsive offices / one-sided relationships | relationship blind spots | nurture the network |
| Website referral form (embed) | website form that just emails | form on your site that starts a case |
| Invite your Network / Connected Network Member / Access PIN | onboarding partner offices | grow the referral network in minutes |
| Provider's Day-Prep Station | starting the day unprepared | the doctor's day, ready from the referrals |
| Insurance acceptance settings / find-a-dentist listing | "do they take my insurance?" | patients and dentists see it up front |

Top 10 filmable moments (audit): funnel leak lines; Sent closing-the-loop + patient leakage; message thread with
@mentions and quoted reply; status chips; insurance card + Request from patient + activity log; Needs attention;
Website form builder with live preview; Status board; template editor with Insert Variable; Staff responsiveness.

## Open questions (do not claim until answered)
Amended / Draft / Referred Out - Forward meaning; which statuses change automatically; bold row and envelope icon
meaning; case-acceptance calculation; HIPAA wording approval for marketing; multi-office switcher not yet seen.
