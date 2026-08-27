import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We will just find 'Effect Chance' and rewrite the span
old = '<span className="text-[8px] font-bold tracking-wider text-cyan-700 uppercase font-hud">Effect Chance</span>'
new = '<span className="text-[8px] font-bold tracking-wider text-cyan-700 uppercase font-hud">Effect Chance</span>'
content = content.replace(old, new)
with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
