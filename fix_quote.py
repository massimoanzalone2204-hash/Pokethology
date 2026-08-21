import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

text = re.sub(r"const getOpponentMoveQuote = \(pokeName: string, moveName: string, langCode: string\) => \{", "const getOpponentMoveQuote = (pokeName: string, moveName: string) => {", text)
text = re.sub(r"const lang = langCode === 'auto' \? navigator\.language\.slice\(0, 2\)\.toLowerCase\(\) : langCode\.toLowerCase\(\);\s*", "", text)
text = re.sub(r"const pool = translations\[lang\] \|\| translations\['en'\];", "const pool = translations['en'];", text)

with open('src/App.tsx', 'w') as f:
    f.write(text)
print("Quotes fixed")
