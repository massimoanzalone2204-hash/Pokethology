import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Grid lines for light mode */
.light .bg-\\[linear-gradient\\(to_right\\,\\#1e293b_1px\\,transparent_1px\\)\\,linear-gradient\\(to_bottom\\,\\#1e293b_1px\\,transparent_1px\\)\\] {
  background-image: linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px) !important;
}
"""

if "Grid lines for light mode" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
