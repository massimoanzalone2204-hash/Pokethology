import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Colored border and ring overrides for high contrast in light mode */
.light [class*="border-yellow-"], .light [class*="ring-yellow-"], .light [class*="border-amber-"], .light [class*="ring-amber-"] {
  border-color: #b45309 !important; /* amber-700 */
}
.light [class*="border-cyan-"]:not(.border-cyan-500\/10, .border-cyan-500\/20), .light [class*="ring-cyan-"] {
  border-color: #0369a1 !important; /* sky-700 */
}
.light [class*="border-emerald-"]:not(.border-emerald-500\/20), .light [class*="ring-emerald-"] {
  border-color: #047857 !important; /* emerald-700 */
}
"""

if "Colored border and ring overrides" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
