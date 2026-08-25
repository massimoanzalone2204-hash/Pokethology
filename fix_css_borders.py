import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Robust border conversions for light mode */
.light [class*="border-slate-800"],
.light [class*="border-slate-900"],
.light [class*="border-slate-700"],
.light [class*="border-slate-600"] {
  border-color: #cbd5e1 !important; /* slate-300 */
}
"""

if "Robust border conversions for light mode" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
