import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Explicit overrides for AudioSettings */
.light [class*="bg-slate-950/90"],
.light [class*="bg-slate-800/80"],
.light [class*="bg-slate-800/60"] {
  background-color: rgba(241, 245, 249, 0.9) !important;
  border-color: rgba(203, 213, 225, 0.5) !important;
}

.light [class*="hover:bg-slate-800/60"]:hover {
  background-color: rgba(226, 232, 240, 0.9) !important;
}
"""

if "Explicit overrides for AudioSettings" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
