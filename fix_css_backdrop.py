import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Fix backdrop blurs blending too dark in light mode */
.light [class*="bg-slate-950/98"],
.light [class*="bg-slate-950/95"],
.light [class*="bg-slate-950/90"],
.light [class*="bg-black/85"],
.light [class*="bg-black/80"],
.light [class*="bg-slate-900/80"],
.light [class*="bg-slate-900/60"] {
  background-color: rgba(248, 250, 252, 0.95) !important; /* Extremely opaque f8fafc */
  backdrop-filter: blur(12px) !important;
}
"""

if "Fix backdrop blurs blending too dark" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
