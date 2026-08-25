import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Fix purple text variants in Light Mode */
.light [class*="text-purple-"], .light [class*="text-violet-"], .light [class*="text-indigo-"] {
  color: #581c87 !important; /* purple-900 */
  opacity: 1 !important;
}

/* Hardcode specific bright cyan to sky blue */
.light .text-cyan-400 {
  color: #0369a1 !important; /* sky-700 */
}
"""

if "Fix purple text variants" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
