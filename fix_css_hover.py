import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Fix hover states for slate backgrounds in light mode */
.light [class*="hover:bg-slate-900"]:hover,
.light [class*="hover:bg-slate-800"]:hover,
.light [class*="hover:bg-slate-700"]:hover,
.light [class*="hover:bg-slate-600"]:hover {
  background-color: #e2e8f0 !important; /* Bright slate hover */
}
"""

if "Fix hover states for slate" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
