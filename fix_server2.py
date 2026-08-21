import re
with open('server.ts', 'r') as f:
    text = f.read()

text = re.sub(r"const getRequestLanguage = \([^)]+\)[\s\S]*?\};", "", text)
text = re.sub(r"const targetLangName = langNameMap\[lang\] \|\| \"English\";", "", text)
text = re.sub(r"const langNameMap: Record<string, string> = \{[^\}]+\};", "", text)
text = re.sub(r"const langNameMap = \{[^\}]+\};", "", text)

with open('server.ts', 'w') as f:
    f.write(text)
