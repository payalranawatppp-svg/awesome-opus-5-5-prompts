"""Builds the PDF and the copy page for UGC17-Claude-Editing-Prompt.md."""
import html, os, pathlib, subprocess, tempfile
import markdown
D = pathlib.Path(__file__).resolve().parent.parent
md = (D / 'UGC17-Claude-Editing-Prompt.md').read_text()
css = ('<style>body{font:10.5pt/1.5 Inter,Arial,sans-serif;color:#17142a;margin:0}h1{color:#4b2fc4;font-size:20pt}h2{color:#4b2fc4;border-bottom:2px solid #e4defa;padding-bottom:3px;margin-top:20px}'
       'h3{color:#2a1a7a;margin-top:14px}table{border-collapse:collapse;width:100%;font-size:9pt}td,th{border:1px solid #d9d3f0;padding:4px 6px;vertical-align:top}th{background:#f1edff;text-align:left}code{background:#f1edff;padding:0 3px;border-radius:3px}</style>')
tmp = pathlib.Path(tempfile.mkdtemp())
(tmp / 'ep.html').write_text('<!doctype html><meta charset=utf-8>' + css + markdown.markdown(md, extensions=['tables', 'sane_lists']))
(tmp / 'ep.cjs').write_text("const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();"
  f"await p.goto('file://{tmp}/ep.html');await p.waitForTimeout(500);await p.pdf({{path:'{D}/UGC17-Claude-Editing-Prompt.pdf',format:'A4',printBackground:true,"
  "margin:{top:'14mm',bottom:'14mm',left:'13mm',right:'13mm'}});await b.close()})()")
subprocess.run(['node', str(tmp / 'ep.cjs')], check=True)
prompt = md.split('\n---\n', 1)[1].strip()
page = (D / 'UGC17-Claude-Editing-Prompt-Copy.html').read_text()
a, b = page.index('<pre id="p">') + len('<pre id="p">'), page.index('</pre>')
page = page[:a] + html.escape(prompt) + page[b:]
import re
page = re.sub(r'\d+ words · paste', f'{len(prompt.split())} words · paste', page)
(D / 'UGC17-Claude-Editing-Prompt-Copy.html').write_text(page)
print('ok', len(prompt.split()), 'words')
