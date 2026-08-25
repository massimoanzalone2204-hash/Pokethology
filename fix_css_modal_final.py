import re

with open("src/index.css", "r") as f:
    text = f.read()

additional_rules = """
/* Critical catch-all for Light Mode modal components */
.light .bg-slate-950\\/90,
.light .bg-slate-900\\/90,
.light .bg-slate-900\\/80,
.light .bg-slate-900\\/60,
.light .bg-slate-950\\/80,
.light .bg-slate-950\\/60,
.light .bg-slate-950\\/40,
.light .bg-slate-900\\/40 {
  background-color: rgba(241, 245, 249, 0.95) !important;
  border-color: rgba(203, 213, 225, 0.6) !important;
}
"""

if "Critical catch-all for Light Mode modal components" not in text:
    text += additional_rules

with open("src/index.css", "w") as f:
    f.write(text)
