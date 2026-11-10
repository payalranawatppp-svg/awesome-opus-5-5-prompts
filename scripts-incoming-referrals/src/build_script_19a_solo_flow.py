"""Script 19-A "Day One" (founder selfie vlog): script + Google Flow prompts, 8 s clips, vertical 9:16 (TikTok) -> PDF."""
import html, os, subprocess
E = html.escape
OUT = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals/Script-19A-Solo-Day-One-Founder-Only-Google-Flow.pdf'

LOOK = ('Vertical 9:16 video, 8 seconds, one continuous shot. Authentic TikTok vlog recorded by the speaker herself on her smartphone front '
        'camera (selfie mode): she holds the phone in her right hand at arm\'s length, so the frame is slightly wide-angle with mild lens '
        'distortion near the edges, her right shoulder and the top of her arm are partly visible at the frame edge, the phone itself is never '
        'visible, the camera moves with her hand (natural small sways and tiny re-framings, never a tripod or gimbal), she looks into the lens as '
        'if into her own phone screen. Natural phone-video look, auto exposure, real skin texture with pores and light freckles, no beauty filter, '
        'subtle grain, true-to-life colours. Not AI-looking, not cinematic.')
NEG = ('Audio: only the spoken line{extra} and quiet room tone. No music, no subtitles, no captions, no on-screen text, no readable screens, '
       'no logos, no name tags with text, no red clothing or props, no extra people, no warped hands or fingers, no lip-sync drift.')

FOUNDER = ('THE FOUNDER: a woman in her mid-30s who owns a new endodontic practice, shoulder-length dark-brown hair in soft loose waves '
           'tucked behind her left ear, warm brown eyes, light freckles, clear tortoiseshell glasses, small gold stud earrings, a thin gold '
           'necklace and a slim watch, wearing a tailored navy blazer with sleeves slightly pushed up over a fitted cream knit top '
           '(no scrubs, no white coat, no stethoscope, no name badge)')
AVATAR = ("Vertical 9:16 photorealistic portrait, shot on a smartphone front camera at arm's length (selfie), natural phone-photo look, real skin "
          "texture with pores and light freckles, no beauty filter, subtle grain, true-to-life colours. A confident woman in her mid-30s who owns a "
          "brand-new endodontic dental practice. Shoulder-length dark-brown hair in soft loose waves tucked behind her left ear, warm brown eyes, light "
          "freckles, natural minimal makeup, small gold stud earrings, a thin gold necklace, a slim minimalist watch, clear tortoiseshell glasses. She "
          "wears a tailored navy blazer with the sleeves pushed up slightly over a fitted cream knit top, smart and polished but not medical. No scrubs, "
          "no white coat, no stethoscope, no name badge. She looks clean, precise and calm, like someone who is very good with her hands and her "
          "patients: steady eye contact, a warm, slightly proud half-smile, relaxed shoulders, one hand lifted near her face holding a ring of new keys. "
          "Background, softly out of focus: the bright treatment room of her new practice, a modern dental chair, a surgical microscope on an arm, an "
          "overhead dental light, white walls with a sage-green accent wall, a light-oak cabinet, daylight from a window. Lived-in, professional, real. "
          "No readable text, no logos, no red clothing or objects, no extra people, no warped hands or fingers.")
FVOICE = 'a warm, natural, slightly fast female voice in her mid-30s, neutral American accent, excited and a little nervous, the same voice in every clip'
TANYA = ('TANYA: a woman in her mid-30s with dark-brown hair in a low side ponytail over her left shoulder, navy short-sleeve V-neck scrubs '
         'and a small blank white name badge')
TVOICE = 'a warm mid-to-low female voice in her mid-30s, neutral American accent, upbeat and efficient'

SETS = {
 'lot': 'An early-morning parking lot outside a small, brand-new single-storey dental office with a glass door and fresh landscaping, soft sunrise light, a few empty parking spaces.',
 'lobby': 'The empty lobby of a brand-new endodontic practice: fresh white walls, light-oak front desk still wrapped in a bit of protective film, two new beige waiting chairs, a doorway to a treatment room with a new dental chair and a surgical microscope, ceiling lights flickering on.',
 'office': 'A small private office in the new practice: a light-oak desk with an open laptop angled away from camera (soft glow only, no readable screen), a coffee mug, a stack of unopened boxes, a framed diploma with no readable text, a window with daylight.',
 'desk': 'The front desk of the new practice in the afternoon: white quartz counter, a slim monitor angled away from camera (soft glow, no readable screen), a desk phone, a small plant, a sage-green wall behind, daylight through the window.',
 'night': 'The same front desk at dusk, most lights off, one warm desk lamp on, the parking lot dark outside the glass door.',
}

# (set, title, cast, speaker, line, second (speaker, line) or None, emotion, hands, head, camera, sfx)
CLIPS = [
 ('lot', 'The hook', ['F'], 'F', 'Day one. Fourteen years of school, one very big loan, and a building that smells like fresh paint.', None,
  'Bright, nervous excitement; a disbelieving little laugh on "very big loan".', 'Right hand holds the phone at arm\'s length; left hand holds a jingling ring of new keys up beside her face on "Day one", then lowers it.',
  'Small head shake on "very big loan", eyebrows up, deep breath and a smile at the end.', 'Selfie at arm\'s length, slightly above eye level, she walks slowly toward the glass door; the building behind her shoulder.', ', keys jingling, birds'),
 ('lobby', 'The empty office', ['F'], 'F', 'Two operatories, a microscope, a CBCT. What I don\'t have yet... is patients.', None,
  'Proud while listing; then a beat of honest worry on "is patients", a wry half-smile.', 'Phone in right hand; left hand counts on fingers (one, two, three) on the three items, then flips the switch-panel lights on and opens toward the empty room.',
  'Turns her head to look over the room on the list, then back to the lens, a small shrug on "patients".', 'Selfie walking in through the door, the lobby and the treatment room behind her; lights come on mid-clip.', ', a light switch click'),
 ('office', 'The template', ['F'], 'F', 'Okay, the website. My designer\'s template has a referral form. Doctor\'s name, patient\'s name... Social Security number?', None,
  'Focused, then her face falls into a puzzled frown on "Social Security number?".', 'Phone in her right hand at arm\'s length; her left index finger scrolls the laptop trackpad, then points at the screen, then her left palm turns up toward the lens on the question.',
  'Leans toward the laptop, then pulls back and looks into the lens, one eyebrow raised.', 'Handheld front-camera selfie at arm\'s length, seated at the desk, slightly above eye level, laptop glow on her face.', ', a trackpad click'),
 ('office', 'Where does it go?', ['F'], 'F', 'And when they hit submit, it becomes an email, in an inbox I\'ll check between patients. Maybe.', None,
  'Dry, honest; a skeptical squint on "Maybe".', 'Mimes pressing a button with her index finger on "submit", then draws an envelope shape in the air, then a so-so wobble of her flat hand on "Maybe".',
  'Tilts her head on "inbox", a slow knowing nod at the end.', 'Handheld front-camera selfie at arm\'s length, she brings the phone a little closer as she talks.', ''),
 ('office', 'The realisation', ['F'], 'F', 'Nobody tells you this: your referrals are your business. And I almost ran mine through a contact form.', None,
  'Serious and sincere, then self-aware embarrassment, a short laugh at herself.', 'Leans in toward the phone; her free hand taps two fingers on the desk on "your business", then covers her eyes for a second on "contact form".',
  'Leans close to the lens on the first sentence, then tips her head back laughing.', 'Handheld front-camera selfie close-up, slight natural sway.', ''),
 ('office', 'The choice', ['F'], 'F', 'So I chose Tooth Referral. It sits on my own website, with my logo, my insurance, what I\'m known for.', None,
  'Relief and confidence, a genuine smile.', 'Holding the phone, she turns the laptop slightly toward the lens with her free hand (screen glow only), then ticks off the three items on her fingers.',
  'Confident nod on "Tooth Referral", glances at the laptop and back.', 'Selfie, slightly over her shoulder toward the laptop glow, then back to her face.', ''),
 ('office', 'How it works', ['F'], 'F', 'It\'s HIPAA compliant and encrypted. They pick the procedure, tap the tooth, attach the X-rays. Three steps.', None,
  'Clear, explaining, upbeat, like telling a friend.', 'Free hand makes a small "lock" gesture (fist closing) on "encrypted", then one finger taps the air three times on "pick", "tap", "attach", then holds up three fingers on "Three steps".',
  'Little emphatic nods on each step.', 'Selfie close-up, steady, soft window light on one side of her face.', ''),
 ('office', 'It keeps working', ['F'], 'F', 'And the patient uploads their own insurance with a secure link. Every referral becomes a case we can track.', None,
  'Impressed, warm; eyebrows up on "their own insurance".', 'Mimes taking a photo of a card with her free hand on "uploads their own insurance", then traces a small line forward in the air on "a case we can track".',
  'Slight head tilt and a satisfied smile at the end.', 'Selfie, she walks out of the office into the hallway toward the front desk.', ', footsteps on a new floor'),
 ('desk', 'It\'s live', ['F'], 'F', 'The form is live. I just invited the five offices I know. Gentle Dental first. That was my old practice.', None,
  'Proud, a little emotional on "my old practice".', 'Phone in right hand; left hand taps the monitor edge on "live", counts five fingers on "five offices", then rests on her heart on "my old practice".',
  'Glances at the monitor, back to the lens, a soft nostalgic smile.', 'Selfie at the empty front desk, monitor glow behind her shoulder, afternoon daylight.', ''),
 ('desk', 'The first referral', ['F'], 'F', 'Wait... a referral. Gentle Dental. Root canal, tooth nineteen. X-rays attached, and her insurance is already uploaded.', None,
  'Surprise turning into delight; she reads fast, eyes widening.', 'A soft notification chime; she turns her body so the monitor glow is behind her, points at the screen with her free index finger, then covers her mouth.',
  'Snaps her head toward the monitor on the chime, then back to the lens, eyes wide.', 'Handheld front-camera selfie, she turns so the glowing monitor is behind her shoulder, slightly shaky from excitement.', ', a soft notification chime'),
 ('desk', 'Our first patient', ['F'], 'F', 'Our first patient. I\'m calling her right now. And Gentle Dental sees every update, so nobody has to call to ask.', None,
  'Quiet and emotional on the first words, then focused and happy.', 'Presses her free hand flat to her chest on "Our first patient", then picks up the desk-phone handset and holds it up to the lens.',
  'Lets out a breath, blinks fast, then a determined nod.', 'Selfie close-up at the desk, phone handset entering frame.', ', a desk-phone dial tone'),
 ('night', 'Closing up', ['F'], 'F', 'One referral. It came in complete, it\'s tracked, and the office that sent it knows exactly where it stands.', None,
  'Tired but deeply satisfied, calm and warm.', 'Free hand turns off the desk lamp switch halfway through, then rests on the counter.',
  'Slow nod, soft smile, looks around the quiet office.', 'Selfie at the front desk at dusk, warm lamp light, slightly lower energy and steadier handheld.', ', a lamp click'),
 ('night', 'The line to remember', ['F'], 'F', 'Starting a practice is hard. Losing referrals shouldn\'t be part of it.', None,
  'Sincere, direct to camera; a small confident smile on the last word.', 'Free hand gives a small open-palm gesture toward the lens on "Losing referrals", then she reaches for the door.',
  'Holds eye contact, a final nod.', 'Selfie walking out through the glass door into the dark parking lot, keys in hand.', ', the door closing softly'),
]

NAMES = {'F': ('THE FOUNDER', FOUNDER, FVOICE), 'T': ('TANYA', TANYA, TVOICE)}


def prompt(c):
    st, title, cast, spk, line, second, emo, hands, head, cam, sfx = c
    p = [LOOK, SETS[st]] + [NAMES[x][1] + '.' for x in cast]
    p.append(f'Emotion: {emo}')
    p.append(f'Hands: {hands}')
    p.append(f'Head and body: {head}')
    p.append(f'Camera: {cam} Always a handheld front-camera selfie, phone held by her own arm; never a third-person shot.')
    n, _, v = NAMES[spk]
    if second:
        n2, _, v2 = NAMES[second[0]]
        p.append(f'{n} speaks first, with {v}. Perfectly lip-synced: "{line}"')
        p.append(f'Then {n2} answers, with {v2}. Perfectly lip-synced: "{second[1]}"')
    else:
        p.append(f'{n} speaks with {v}. Perfectly lip-synced: "{line}"')
    p.append(NEG.format(extra=sfx))
    return '\n'.join(p)


clips_html = []
for i, c in enumerate(CLIPS, 1):
    st, title, cast, spk, line, second, emo, hands, head, cam, sfx = c
    dl = f'<div class="dl"><b>{E(NAMES[spk][0])}</b> "{E(line)}"</div>'
    if second:
        dl += f'<div class="dl"><b>{E(NAMES[second[0]][0])}</b> "{E(second[1])}"</div>'
    words = len(line.split()) + (len(second[1].split()) if second else 0)
    clips_html.append(f'''<div class="clip"><div class="ch"><span class="cn">CLIP {i:02d}</span><span class="ct">{E(title)}</span><span class="tc">{(i-1)*8}-{i*8} s · {words} words</span></div>
{dl}<table class="d"><tr><td>Emotion</td><td>{E(emo)}</td></tr><tr><td>Hands</td><td>{E(hands)}</td></tr><tr><td>Head</td><td>{E(head)}</td></tr><tr><td>Camera</td><td>{E(cam)}</td></tr></table>
<div class="pl">Google Flow prompt (paste as is)</div><pre>{E(prompt(c))}</pre></div>''')

script_rows = ''.join(f'<tr><td class="n">{i:02d}</td><td><b>{E(NAMES[c[3]][0])}:</b> {E(c[4])}' + (f'<br><b>{E(NAMES[c[5][0]][0])}:</b> {E(c[5][1])}' if c[5] else '') + '</td></tr>' for i, c in enumerate(CLIPS, 1))

doc = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@page {{ size: Letter; margin: 0.5in 0.55in 0.55in; }}
body {{ font-family: Inter, sans-serif; color: #1B1830; font-size: 9.6pt; line-height: 1.38; margin: 0; }}
.k {{ color: #6D4AE8; font-weight: 700; font-size: 9pt; letter-spacing: .08em; text-transform: uppercase; }}
h1 {{ font-size: 24pt; margin: 4px 0 6px; line-height: 1.1; }} h2 {{ font-size: 13pt; margin: 14px 0 6px; }}
.sub {{ color: #6B6880; font-size: 10.5pt; }}
.box {{ background: #F1ECFE; border-radius: 10px; padding: 9px 13px; margin: 10px 0; }}
.box li {{ margin: 2px 0; }}
table {{ border-collapse: collapse; width: 100%; }}
.s td {{ border-top: 1px solid #E6E3EF; padding: 5px 6px; vertical-align: top; }} .s td.n {{ color: #6D4AE8; font-weight: 800; width: 26px; }}
.cast td {{ border-top: 1px solid #E6E3EF; padding: 5px 6px; vertical-align: top; }} .cast td:first-child {{ font-weight: 800; width: 110px; color: #6D4AE8; }}
.clip {{ border: 1px solid #E6E3EF; border-radius: 10px; padding: 8px 11px; margin: 8px 0; page-break-inside: avoid; }}
.ch {{ display: flex; gap: 8px; align-items: baseline; }} .cn {{ color: #6D4AE8; font-weight: 800; }} .ct {{ font-weight: 700; flex: 1; }} .tc {{ color: #6B6880; font-size: 8.5pt; }}
.dl {{ font-size: 10.5pt; margin: 4px 0; }}
.d td {{ padding: 2px 6px 2px 0; vertical-align: top; font-size: 9pt; }} .d td:first-child {{ color: #6B6880; font-weight: 700; width: 64px; }}
.pl {{ font-size: 7.8pt; text-transform: uppercase; letter-spacing: .06em; color: #6B6880; margin-top: 5px; }}
pre {{ white-space: pre-wrap; font-family: Inter, sans-serif; font-size: 8.2pt; line-height: 1.32; background: #F7F6FB; border-radius: 6px; padding: 7px 9px; margin: 3px 0 0; color: #2A2740; }}
.pb {{ page-break-before: always; }}
</style></head><body>
<div class="k">Script 19 · Variation A · Google Flow · TikTok 9:16</div>
<h1>"Day One" (solo): the founder's selfie vlog</h1>
<div class="sub">An endodontist's first day: the website, the referral-form decision, and the first referral through Tooth Referral. One character only: the founder films everything herself. 13 clips × 8 s ≈ 1:44. For a 60-80 s TikTok cut, drop clips 02, 05 and 13.</div>
<div class="box"><b>How to generate in Flow</b><ul>
<li><b>Every clip is filmed by her, on her phone's front camera:</b> arm's-length selfie, slight wide-angle, her arm at the frame edge, natural hand sway, eyes on the lens. Every prompt says this; never a tripod, gimbal or third-person shot.</li>
<li>Generate the founder still first from the avatar prompt below, and use it as the reference image for every clip, so her face, hair and clothes never change.</li>
<li>Paste each prompt as it is. Lines are kept to about 20 words so they fit 8 seconds; two-speaker clips say who talks first.</li>
<li>"Tooth Referral" is written as two words so Flow says it right. If it slips, re-voice that one line in ElevenLabs.</li>
<li>Use the last frame of a clip to start the next one when they are in the same place (clips 03-08 in the office, 09-11 at the front desk).</li>
<li>In the edit, add captions and short inserts of the real Tooth Referral form (logo/insurance, tooth chart, insurance link) over clips 06-08 and the incoming referral over clip 10. Screens in the footage stay unreadable on purpose.</li></ul></div>
<h2>Avatar prompt (generate this first, as an image)</h2>
<div class="box">Smart-casual, not medical clothing, but a clear doctor vibe from the clinic background, the glasses and watch, and her calm, precise presence. Generate this still in Imagen/Flow and use it as the reference image for every clip. For clip 01 (parking lot) keep the outfit and swap the background for the outside of the new office.</div>
<pre>{E(AVATAR)}</pre>
<h2>Characters (built into every prompt)</h2>
<table class="cast"><tr><td>THE FOUNDER</td><td>{E(FOUNDER[13:])}.<br><span style="color:#6B6880">Voice: {E(FVOICE)}</span></td></tr>
</table>
<h2>The script</h2><table class="s">{script_rows}</table>
<div class="box"><b>End card (edit):</b> Tooth Referral logo · "Starting a practice is hard. Losing referrals shouldn't be part of it." · "Set up in about 5 minutes" · toothreferral.com</div>
<h2 class="pb">Clips and Google Flow prompts</h2>{''.join(clips_html)}
<p style="color:#6B6880;font-size:8.5pt">Client rules: the founder is never named; staff only Barbara, Tanya, Amanda and Greg; "general dentist", never "GP"; no red; product claims only what the live Tooth Referral form shows (HIPAA compliant and encrypted, own logo/insurance/"known for", procedure + tooth chart + X-rays, secure patient insurance link, every referral a tracked case).</p>
</body></html>'''
D = '/tmp/claude-0/-home-user-awesome-opus-5-5-prompts/61ad0f1a-77a7-5e04-8546-bd1e8a80b8f4/scratchpad/stories'
H = os.path.join(D, 's19as.html'); open(H, 'w').write(doc)
js = f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{H}'); await p.evaluate(() => document.fonts.ready);
await p.pdf({{ path: '{OUT}', format: 'Letter', printBackground: true, preferCSSPageSize: true }}); await b.close(); }})();'''
open(os.path.join(D, 's19as.cjs'), 'w').write(js)
subprocess.run(['node', os.path.join(D, 's19as.cjs')], check=True)
for i, c in enumerate(CLIPS, 1):
    n = len(c[4].split()) + (len(c[5][1].split()) if c[5] else 0)
    if n > 22: print('LONG', i, n)
print(OUT)
