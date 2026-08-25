import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Make all text-white and light gray variants with opacity solid and dark in light mode */
.light [class*="text-white/"]:not([class*="bg-cyan-"], [class*="bg-red-"], [class*="bg-purple-"], [class*="bg-pink-"], [class*="bg-green-"], [class*="bg-emerald-"], [class*="bg-amber-"], [class*="bg-sky-"]),
.light [class*="text-slate-100/"]:not([class*="bg-cyan-"], [class*="bg-red-"], [class*="bg-purple-"], [class*="bg-pink-"], [class*="bg-green-"], [class*="bg-emerald-"], [class*="bg-amber-"], [class*="bg-sky-"]),
.light [class*="text-slate-200/"]:not([class*="bg-cyan-"], [class*="bg-red-"], [class*="bg-purple-"], [class*="bg-pink-"], [class*="bg-green-"], [class*="bg-emerald-"], [class*="bg-amber-"], [class*="bg-sky-"]) {
  color: #0f172a !important;
  font-weight: 700 !important;
  opacity: 1 !important;
}

/* Force opacity for all other colored text like text-amber-400/90 */
.light [class*="text-amber-"], .light [class*="text-yellow-"], .light [class*="text-emerald-"], .light [class*="text-green-"], .light [class*="text-red-"], .light [class*="text-rose-"], .light [class*="text-purple-"], .light [class*="text-violet-"] {
  opacity: 1 !important;
}
"""

if "text-white/" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
