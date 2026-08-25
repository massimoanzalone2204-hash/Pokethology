import re

with open("src/index.css", "r") as f:
    text = f.read()

# I want to add rules that handle [class*="text-something"] for light mode text visibility.
# Since attribute selectors have higher specificity, they will override existing ones nicely.

additional_rules = """
/* Fix for opacity variants and general robust text visibility in light mode */
.light [class*="text-slate-400"]:not([class*="bg-cyan-"], [class*="bg-red-"], [class*="bg-purple-"], [class*="bg-pink-"], [class*="bg-green-"], [class*="bg-emerald-"], [class*="bg-amber-"], [class*="bg-sky-"]),
.light [class*="text-slate-500"]:not([class*="bg-cyan-"], [class*="bg-red-"], [class*="bg-purple-"], [class*="bg-pink-"], [class*="bg-green-"], [class*="bg-emerald-"], [class*="bg-amber-"], [class*="bg-sky-"]),
.light [class*="text-gray-400"], .light [class*="text-gray-500"],
.light [class*="text-zinc-400"], .light [class*="text-zinc-500"] {
  color: #0f172a !important;
  font-weight: 700 !important;
  opacity: 1 !important; /* Force full opacity for readability */
}

.light [class*="text-slate-300"]:not([class*="bg-cyan-"], [class*="bg-red-"], [class*="bg-purple-"], [class*="bg-pink-"], [class*="bg-green-"], [class*="bg-emerald-"], [class*="bg-amber-"], [class*="bg-sky-"]) {
  color: #1e293b !important;
  font-weight: 700 !important;
  opacity: 1 !important;
}

.light [class*="text-cyan-300"], .light [class*="text-cyan-400"] {
  color: #0369a1 !important;
  text-shadow: none !important;
  font-weight: 800 !important;
  opacity: 1 !important;
}

.light [class*="text-cyan-500"] {
  color: #0284c7 !important;
  opacity: 1 !important;
}
"""

if "Fix for opacity variants" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
