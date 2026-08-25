import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Light mode translucent slate background overrides */
.light [class*="bg-slate-800/"],
.light [class*="bg-slate-700/"],
.light [class*="bg-slate-600/"] {
  background-color: rgba(241, 245, 249, 0.9) !important; /* f1f5f9 with slight transparency */
  backdrop-filter: blur(8px);
}
"""

if "Light mode translucent slate background overrides" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
