import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Make all yellow/amber translucent backgrounds light in light mode */
.light [class*="bg-yellow-500/"],
.light [class*="bg-amber-500/"],
.light [class*="bg-yellow-400/"],
.light [class*="bg-amber-400/"] {
  background-color: rgba(254, 243, 199, 0.8) !important; /* amber-100 */
}

/* Same for cyan */
.light [class*="bg-cyan-500/"] {
  background-color: rgba(224, 242, 254, 0.8) !important; /* sky-100 */
}

/* And emerald/green */
.light [class*="bg-emerald-500/"],
.light [class*="bg-green-500/"] {
  background-color: rgba(209, 250, 229, 0.8) !important; /* emerald-100 */
}
"""

if "Make all yellow/amber translucent backgrounds light" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
