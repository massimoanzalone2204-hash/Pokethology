import re

with open("src/App.tsx", "r") as f:
    text = f.read()

# Replace any sequence of spaces, )}, newline, spaces, )}, newline, spaces, </AnimatePresence>
text = re.sub(r'(\s*\)\})\n\s*\)\}\n(\s*</AnimatePresence>)', r'\1\n\2', text)
text = re.sub(r'(\s*\)\})\n\s*\)\}\n(\s*</AnimatePresence>)', r'\1\n\2', text)

with open("src/App.tsx", "w") as f:
    f.write(text)
