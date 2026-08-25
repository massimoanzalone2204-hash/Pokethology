import re

with open("src/components/PokethologyQuizWidget.tsx", "r") as f:
    text = f.read()

pattern = r"\{\/\* DAILY REFRESH STATUS BANNER \*\/\}[\s\S]*?<\/div>\s*\{\/\* REGION SELECTION TABS \*\/\} "
new_text = re.sub(pattern, "{/* REGION SELECTION TABS */} ", text)

with open("src/components/PokethologyQuizWidget.tsx", "w") as f:
    f.write(new_text)

if text != new_text:
    print("Banner removed!")
else:
    print("Pattern not found!")
