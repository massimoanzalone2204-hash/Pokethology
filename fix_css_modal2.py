import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Specifically ensure inner modal bodies (bg-slate-900/60) are light and readable */
.light [class*="bg-slate-900/60"] {
  background-color: rgba(241, 245, 249, 0.85) !important; /* Extremely opaque f1f5f9 */
  backdrop-filter: blur(12px) !important;
}
"""

if "inner modal bodies" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
