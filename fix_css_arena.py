import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Force arena to center properly without left margin gaps */
.arena-container {
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100% !important;
}

/* Ensure right sidebar stays in place without shifting */
.lg\\:col-span-4 {
  margin-left: auto;
}
"""

if "Force arena to center properly" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
