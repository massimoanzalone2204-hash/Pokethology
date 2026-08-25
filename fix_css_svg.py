import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* SVG Fill and Stroke Overrides for Light Mode */
.light [class*="fill-yellow-400"], .light [class*="fill-yellow-300"], .light [class*="fill-amber-400"], .light [class*="fill-amber-300"] {
  fill: #854d0e !important;
}
.light [class*="fill-slate-950"] {
  fill: #f8fafc !important;
}
"""

if "SVG Fill and Stroke Overrides for Light Mode" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
