import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Placeholder color overrides for light mode */
.light ::placeholder {
  color: #64748b !important; /* slate-500 */
  opacity: 1 !important;
}
"""

if "Placeholder color overrides" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
