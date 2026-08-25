import re

with open("src/index.css", "r") as f:
    text = f.read()

text = text.replace(".light .text-amber-400, .light .text-amber-300", ".light .text-amber-400, .light .text-amber-300, .light .text-amber-200")
text = text.replace(".light .text-cyan-400, .light .text-cyan-300", ".light .text-cyan-400, .light .text-cyan-300, .light .text-cyan-200")
text = text.replace(".light .text-emerald-400, .light .text-emerald-300", ".light .text-emerald-400, .light .text-emerald-300, .light .text-emerald-200")

with open("src/index.css", "w") as f:
    f.write(text)
