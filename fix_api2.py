import re
with open('src/lib/api.ts', 'r') as f:
    text = f.read()

text = re.sub(r"const baseLang = lang\.split\('-'\)\[0\];", "const baseLang = 'en';", text)

with open('src/lib/api.ts', 'w') as f:
    f.write(text)
