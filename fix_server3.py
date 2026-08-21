import re
with open('server.ts', 'r') as f:
    text = f.read()

text = re.sub(r"\$\{targetLangName\}", "English", text)
text = re.sub(r"CRITICAL MULTILINGUAL MANDATE[^\`]+\`", "`", text, flags=re.DOTALL)

with open('server.ts', 'w') as f:
    f.write(text)
