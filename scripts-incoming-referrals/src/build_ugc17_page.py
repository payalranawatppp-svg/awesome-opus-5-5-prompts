"""Copy-friendly HTML page (one Copy button per prompt) for UGC 17, from the same data as build_ugc17_flow.py."""
import html, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_ugc17_flow import CAST, BG, CLIPS, VO, HERO, prompt, D
import s2_detailed as S2

E = html.escape
NM = {'Ruiz': 'Dr. Elena Ruiz', 'Whitaker': 'Dr. James Whitaker', 'Rachel': 'Rachel Moore', 'Kevin': 'Kevin Tran', 'Megan': 'Megan Cole', 'Ethan': 'Ethan'}
n = 0
def box(label, text, big=False):
    global n; n += 1
    return (f'<div class="pbox{" big" if big else ""}"><div class="ph"><span>{E(label)}</span>'
            f'<button class="cp" data-t="t{n}" type="button">Copy</button></div><div class="txt" id="t{n}">{E(text)}</div></div>')

nav = ''.join(f'<a href="#{c["id"]}">{c["id"]}</a>' for c in CLIPS)
out = ['<title>UGC 17 Flow Prompts</title><meta name="claude:viewport-fit-sides" content="cover">',
'<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">',
'''<style>
/* VOICE work. IDEA a production call sheet with tear-off prompt slips
   PICTURE the prompt slips themselves, each with its own Copy button
   COLOUR white / near-black ink / Tooth Referral purple, amber for voice-over
   TYPE Inter 800 + Inter  LAYOUT sticky clip bar, one column of clip cards */
:root{color-scheme:light dark;--bg:light-dark(#ffffff,#121019);--ink:light-dark(#17142a,#ece9f7);--mut:light-dark(#5d5873,#a7a1c0);--line:light-dark(#e3def3,#2d2842);--card:light-dark(#f7f5fe,#1b1727);--acc:light-dark(#5b3fd6,#a48cff);--accInk:light-dark(#fff,#120c2a);--vo:light-dark(#fff6e3,#2a2212);--voL:light-dark(#e89d15,#e8b04a);--dl:light-dark(#eefaf3,#14251c);--dlL:light-dark(#1f9d61,#4cc489)}
:root[data-theme=light]{color-scheme:light}:root[data-theme=dark]{color-scheme:dark}
*{box-sizing:border-box;min-width:0}
body{background:var(--bg);color:var(--ink);font:16px/1.55 Inter,system-ui,sans-serif;overflow-x:clip;margin:0}
.wrap{max-width:980px;margin:0 auto;padding-left:max(5vw,16px,env(safe-area-inset-left,0px));padding-right:max(5vw,16px,env(safe-area-inset-right,0px))}
header{padding-block:32px 12px}
h1{font-size:clamp(28px,4.5vw,44px);line-height:1.08;letter-spacing:-.02em;margin:0 0 10px;font-weight:800}
.sub{color:var(--mut);margin:0 0 16px}
ol.how{margin:0;padding-left:20px}ol.how li{margin:4px 0}
nav{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--bg);border-bottom:1px solid var(--line)}
nav .wrap{display:flex;flex-wrap:wrap;gap:6px;padding-block:10px}
nav a{text-decoration:none;color:var(--ink);border:1px solid var(--line);border-radius:999px;padding:4px 12px;font-weight:600;font-size:14px}
nav a:hover{border-color:var(--acc);color:var(--acc)}
section{padding-block:26px;border-bottom:1px solid var(--line);scroll-margin-top:60px}
h2{font-size:26px;line-height:1.15;letter-spacing:-.01em;margin:0 0 6px}
h3{font-size:17px;margin:18px 0 8px}
.meta{color:var(--mut);font-size:15px;margin:0 0 10px}
.dl{background:var(--dl);border-left:4px solid var(--dlL);padding:8px 12px;border-radius:8px;margin:6px 0}
.vo{background:var(--vo);border-left:4px solid var(--voL);padding:8px 12px;border-radius:8px;margin:6px 0}
.pbox{border:1px solid var(--line);background:var(--card);border-radius:12px;margin:10px 0;overflow:hidden}
.pbox.big{border-color:color-mix(in srgb,var(--acc) 45%,var(--line))}
.ph{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 10px 8px 14px;border-bottom:1px solid var(--line);font-weight:600;font-size:14px}
.txt{padding:12px 14px;font-size:14px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere;max-height:260px;overflow:auto;user-select:all}
.big .txt{max-height:340px}
button.cp{font:600 14px Inter,system-ui,sans-serif;background:var(--acc);color:var(--accInk);border:0;border-radius:8px;padding:9px 18px;min-height:40px;cursor:pointer;white-space:nowrap}
button.cp:hover{filter:brightness(1.1)}button.cp.ok{background:var(--dlL)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:0 14px}
.k{font-weight:700}
</style>''',
'<header class="wrap"><h1>UGC 17 · Five moments every specialist office knows</h1>'
'<p class="sub">Google Flow (Veo 3.1) prompts, vertical 9:16, 8 s clips. Press <b>Copy</b> and paste straight into Flow: each prompt is plain text with no line breaks inside, so nothing gets cut or merged.</p>'
'<ol class="how"><li>Make the avatar sheets, backgrounds and the two hero stills first (section 1).</li>'
'<li>For each clip, add its background and avatar images as Ingredients, set the start image, then paste the clip prompt.</li>'
'<li>Ethan\'s five fix lines are voice-over only (section 3). They are not in any Flow prompt.</li></ol></header>',
f'<nav><div class="wrap"><a href="#setup">1 Avatars &amp; backgrounds</a>{nav}<a href="#vo">3 Voice-overs</a></div></nav><main class="wrap">']

# 1 setup
s = ['<section id="setup"><h2>1 · Avatars, backgrounds and hero stills</h2><p class="meta">Generate these images once, then reuse them in every clip.</p><h3>Avatar image prompts</h3><div class="grid">']
s += [box(v['role'], v['avatar']) for v in CAST.values()]
s += ['</div><h3>Background image prompts</h3><div class="grid">'] + [box(v['name'], v['img']) for v in BG.values()]
s += ['</div><h3>Hero stills (start images)</h3>'] + [box(t, p) for t, p in HERO] + ['</section>']
out += s

# 2 clips
for c in CLIPS:
    flat = ' '.join(prompt(c)) if c['id'] != 'S2' else S2.MAIN  # one paragraph, single spaces
    out.append(f'<section id="{c["id"]}"><h2>Clip {c["id"]} · {E(c["seg"])}</h2>'
               f'<p class="meta">Ingredients: background “{E(BG[c["bg"]]["name"])}” + ' + ' + '.join(f'avatar “{NM[k]}”' for k in c['cast'])
               + f'. Start image: {E(c["start"])}.</p>'
               + ''.join(f'<div class="dl"><span class="k">{E(sp)} ({tm}):</span> {E(t)}</div>' for sp, t, tm in c['lines'])
               + (('<p class="meta"><b>Step 1:</b> make this start-frame still first and use it as the start image.</p>' + box('S2 start-frame still (image prompt)', S2.START_STILL, True) + '<p class="meta"><b>Step 2:</b> paste this into Flow.</p>') if c['id'] == 'S2' else '')
               + box(f'Google Flow prompt · {c["id"]}', flat, True)
               + (('<p class="meta"><b>No-lip-sync version</b> (use it if Flow still mixes up who says what): the same scene with no speech; add the three lines in ElevenLabs.</p>' + box('Google Flow prompt · S2 (no lip-sync)', S2.NO_LIPSYNC, True) + f'<p class="meta">{E(S2.DUB)}</p>') if c['id'] == 'S2' else '')
               + '<h3>Avatar prompts for this clip</h3><div class="grid">' + ''.join(box(CAST[k]['role'], CAST[k]['avatar']) for k in c['cast']) + '</div>'
               + box('Background image prompt · ' + BG[c['bg']]['name'], BG[c['bg']]['img']) + '</section>')

# 3 VO
v = ['<section id="vo"><h2>3 · Ethan\'s voice-overs (not Flow prompts)</h2><p class="meta">Record these in Ethan\'s voice (for example an ElevenLabs clone made from clips E1 and E7) and lay them over the dashboard shots.</p>']
for num, title, dash, line, chips in VO:
    v.append(f'<h3>Fix {num} · {E(title)}</h3><p class="meta">Dashboard: {E(dash)} Chips: {E(chips)}</p>' + box(f'Voice-over line · fix {num}', line))
out += v + ['</section></main>']

out.append('''<script>{
const copy=async(t)=>{try{await navigator.clipboard.writeText(t);return true}catch(e){const a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}a.remove();return ok}};
document.querySelectorAll('button.cp').forEach(b=>b.addEventListener('click',async()=>{const t=document.getElementById(b.dataset.t).textContent;const ok=await copy(t);b.textContent=ok?'Copied ✓':'Select text and copy';b.classList.toggle('ok',ok);setTimeout(()=>{b.textContent='Copy';b.classList.remove('ok')},1800)}));
}</script>''')
p = os.path.join(D, 'UGC17-Five-Moments-Flow-Prompts-Copy.html')
open(p, 'w').write('\n'.join(out)); print(p, n, 'copy boxes')
