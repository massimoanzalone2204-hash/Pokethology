import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Explicit overrides for all settings sections and quiz boxes */
.light [class*="bg-slate-900/40"],
.light [class*="bg-slate-950/40"],
.light [class*="bg-slate-950/60"],
.light [class*="bg-slate-950/80"] {
  background-color: rgba(241, 245, 249, 0.9) !important;
  border-color: rgba(203, 213, 225, 0.5) !important;
}

.light [class*="border-slate-800"] {
  border-color: #cbd5e1 !important;
}
"""

if "Explicit overrides for all settings sections" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
