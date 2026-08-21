import re
with open('server.ts', 'r') as f:
    text = f.read()

text = re.sub(r"CRITICAL MULTILINGUAL MANDATE[^\`]+\`", "`", text, flags=re.DOTALL)
# It seems my previous replace left some targetLangName inside strings.
# Let's completely remove targetLangName and the mandate text.
text = re.sub(r"CRITICAL MULTILINGUAL MANDATE: The user's preferred language is \$\{targetLangName\}\. You MUST write the entire analysis in \$\{targetLangName\}\. Translate all tactical reports, status values, and directions cleanly to \$\{targetLangName\}\.", "", text)
text = re.sub(r"CRITICAL MULTILINGUAL MANDATE: The user's preferred language is \$\{targetLangName\}\. You MUST respond exclusively in \$\{targetLangName\}\.", "", text)

with open('server.ts', 'w') as f:
    f.write(text)

with open('src/App.tsx', 'r') as f:
    text = f.read()
text = re.sub(r"const \{ t \} = useTranslation\(\);", "", text)
text = re.sub(r"const \{\s*t\s*\} = useTranslation\(\);", "", text)
with open('src/App.tsx', 'w') as f:
    f.write(text)

with open('src/lib/api.ts', 'r') as f:
    text = f.read()
# Find where `lang` is used in api.ts
text = re.sub(r"language:\s*lang", "language: 'en'", text)
text = re.sub(r"\&language=\$\{lang\}", "&language=en", text)
with open('src/lib/api.ts', 'w') as f:
    f.write(text)

