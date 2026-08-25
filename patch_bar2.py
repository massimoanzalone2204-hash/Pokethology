import re

with open("src/App.tsx", "r") as f:
    text = f.read()

old_classes = '"flex flex-row justify-between items-center bg-slate-900/80 rounded-none border-b border-cyan-500/30 relative z-20 shadow-lg shrink-0 transition-all duration-300 w-full !m-0 overflow-hidden flex-nowrap"'
new_classes = '"flex flex-row justify-between items-center bg-slate-900/80 rounded-none border-b border-cyan-500/30 relative z-20 shadow-lg shrink-0 transition-all duration-300 w-full !mx-0 !mt-0 overflow-hidden flex-nowrap"'

text = text.replace(old_classes, new_classes)

with open("src/App.tsx", "w") as f:
    f.write(text)
