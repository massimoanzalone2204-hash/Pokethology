import re

with open("src/App.tsx", "r") as f:
    text = f.read()

old_classes = '"flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80"'
new_classes = '"flex flex-col sm:flex-row items-center justify-between gap-3 pt-3"'

text = text.replace(old_classes, new_classes)

with open("src/App.tsx", "w") as f:
    f.write(text)
