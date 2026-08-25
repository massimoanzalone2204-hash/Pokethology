import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Stone text overrides */
.light [class*="text-stone-"] {
  color: #1e293b !important;
  font-weight: 700 !important;
  opacity: 1 !important;
}
"""

if "Stone text overrides" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
