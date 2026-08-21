import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Fix 'en' === 'auto' ? navigator.language : 'en' -> 'en'
text = re.sub(r"'en' === 'auto' \? navigator\.language : 'en'", "'en'", text)

# Fix 'en' === 'it' ? "CHIEDI..." : "ASK..."
text = re.sub(r"'en' === 'it' \? \"CHIEDI[^\"]+\" : (\"[^\"]+\")", r"\1", text)
text = re.sub(r"'en' === 'it'\s*\?\s*`([^`]+)`\s*:\s*`([^`]+)`", r"`\2`", text)

# Fix empty if branches from language translations
text = re.sub(r"if \('en' === 'it'\) \{.*?(?=  \}, \['en'\]\);)", "", text, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(text)
print("Syntax fixed")
