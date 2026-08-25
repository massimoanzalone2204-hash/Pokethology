import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Make all modal headers (bg-slate-900/90) and similar bright and clean in light mode */
.light [class*="bg-slate-900/90"],
.light [class*="bg-slate-900/80"],
.light [class*="bg-slate-900/70"] {
  background-color: rgba(248, 250, 252, 0.95) !important; /* Extremely opaque f8fafc */
  backdrop-filter: blur(12px) !important;
}
"""

if "Make all modal headers" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
