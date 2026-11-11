"""Script 19-A "Day One" (solo founder selfie, clean-look avatar) -> PDF.
Source: Script-19A-Day-One-Clean-Look-Google-Flow.txt (avatar + 13 clip prompts with dialogue)."""
import html, os, re, subprocess
E = html.escape
D = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals'
SRC = os.path.join(D, 'Script-19A-Day-One-Clean-Look-Google-Flow.txt')
OUT = os.path.join(D, 'Script-19A-Day-One-Clean-Look-Google-Flow.pdf')
FONTS = '/home/user/awesome-opus-5-5-prompts/reel/public/fonts'

txt = open(SRC).read()
avatar = txt.split('### CLIP 01')[0].split('\n', 1)[1].strip()
clips = []
for blk in re.split(r'^### ', txt, flags=re.M)[1:]:
    head, body = blk.split('\n', 1)
    num, title = re.match(r'CLIP (\d+) - (.+)', head.strip()).groups()
    lines = body.strip().split('\n')
    dialogue = lines[0].replace('DIALOGUE: ', '').strip()
    prompt = '\n'.join(lines[1:]).strip()
    emo = next((l[9:] for l in lines if l.startswith('Emotion: ')), '')
    hands = next((l[7:] for l in lines if l.startswith('Hands: ')), '')
    clips.append(dict(num=num, title=title, dialogue=dialogue, prompt=prompt, emo=emo, hands=hands))

css = f'''@page {{ size: A4; margin: 16mm 15mm; }}
@font-face {{ font-family: Jakarta; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); font-weight: 800; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-500-normal.woff2); font-weight: 500; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-700-normal.woff2); font-weight: 700; }}
body {{ font-family: InterW, sans-serif; color: #16132B; font-size: 10.5pt; line-height: 1.5; }}
h1 {{ font-family: Jakarta; font-size: 28pt; letter-spacing: -.02em; margin: 2mm 0 3mm; line-height: 1.1; }}
h2 {{ font-family: Jakarta; font-size: 16pt; margin: 0 0 2mm; }}
.k {{ color: #6D4AE8; font-weight: 700; font-size: 9pt; letter-spacing: .12em; text-transform: uppercase; }}
.box {{ border: 1px solid #E4DBFF; border-radius: 3mm; padding: 4mm 5mm; margin: 3mm 0; background: #FBFAFF; page-break-inside: avoid; }}
.prompt {{ font-size: 8.8pt; line-height: 1.45; white-space: pre-wrap; background: #F6F3FF; border-left: 3px solid #6D4AE8; padding: 3mm 4mm; border-radius: 1.5mm; }}
.line {{ font-family: Jakarta; font-size: 13pt; line-height: 1.35; margin: 1mm 0 2mm; }}
.clip {{ page-break-before: always; }}
table {{ border-collapse: collapse; width: 100%; font-size: 10pt; }}
td {{ padding: 2.2mm 2mm; border-bottom: 1px solid #EEE9FF; vertical-align: top; }}
td.n {{ width: 10mm; color: #6D4AE8; font-weight: 700; }} td.t {{ width: 38mm; font-weight: 700; }}
.small {{ color: #6B7085; font-size: 9pt; }}
ul {{ margin: 1mm 0; padding-left: 5mm; }}
'''
rows = ''.join(f'<tr><td class="n">{c["num"]}</td><td class="t">{E(c["title"])}</td><td>“{E(c["dialogue"])}”</td></tr>' for c in clips)
parts = [f'''<div class="k">Tooth Referral · Script 19-A · Google Flow</div>
<h1>Day One: a day in the life of an endodontic start-up</h1>
<p>A solo founder selfie vlog in 13 clips of 8 seconds each (vertical 9:16, TikTok / Reels / Shorts). She opens her new practice, nearly puts a basic web form on her website, chooses Tooth Referral instead, and gets her first referral the same day. This version uses the <b>clean-look avatar</b>: clear, even skin, a polished blowout and thin gold glasses.</p>
<div class="box"><b>How to use in Google Flow</b><ul>
<li>Generate the avatar image first, then add it as the reference image (ingredient) for every clip, so her face stays the same.</li>
<li>Paste each clip prompt as it is. The dialogue is already inside the prompt, so the speech is lip-synced.</li>
<li>Every prompt says she is holding her own phone and recording through the front camera (selfie video).</li>
<li>Clip 11 keeps the desk phone on the counter and clip 13 stays by the glass door, which avoids an object popping into her hand and a sudden jump cut.</li>
<li>No subtitles are baked in; captions are added in the edit.</li></ul></div>
<h2 style="margin-top:6mm">The script</h2>
<table>{rows}</table>
<p class="small">Running time about 90 to 100 seconds before the edit; about 78 seconds after cutting the pauses. The founder is never named; offices and patients are fictional.</p>''',
 f'''<div class="clip"><div class="k">Step 1 · reference image</div><h2>Avatar prompt (clean look)</h2>
<p>Use this first to create her look, then reuse the image for every clip.</p>
<div class="prompt">{E(avatar)}</div></div>''']
for c in clips:
    parts.append(f'''<div class="clip"><div class="k">Clip {c["num"]} · 8 seconds</div><h2>{E(c["title"])}</h2>
<div class="box"><div class="k">Dialogue</div><div class="line">“{E(c["dialogue"])}”</div>
<div class="small"><b>Emotion:</b> {E(c["emo"])}<br><b>Hands:</b> {E(c["hands"])}</div></div>
<div class="k" style="margin-top:3mm">Google Flow prompt (copy all)</div><div class="prompt">{E(c["prompt"])}</div></div>''')
doc = os.path.join(D, 'src', '_19a_clean.html')
open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(parts)}</body></html>')
js = os.path.join(D, 'src', '_19a_clean.cjs')
open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{doc}');
await p.evaluate(() => document.fonts.ready); await p.pdf({{ path: '{OUT}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
subprocess.run(['node', js], check=True)
os.remove(doc); os.remove(js)
print(OUT, len(clips), 'clips')
