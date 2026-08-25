import re

with open("src/index.css", "r") as f:
    text = f.read()

# Replace the complicated :not() in text-white and text-slate overrides
old_not = ':not([class*="bg-cyan-"], [class*="bg-red-"], [class*="bg-purple-"], [class*="bg-pink-"], [class*="bg-green-"], [class*="bg-emerald-"], [class*="bg-amber-"], [class*="bg-sky-"], button, button *)'
new_not = ':not([class*="bg-cyan-"], [class*="bg-red-"], [class*="bg-purple-"], [class*="bg-pink-"], [class*="bg-green-"], [class*="bg-emerald-"], [class*="bg-amber-"], [class*="bg-sky-"], [class*="bg-slate-900"]:not([class*="bg-slate-900/"]), [class*="bg-slate-950"]:not([class*="bg-slate-950/"]))'

# Wait, if we use new_not, we want to KEEP dark text when the background is light (which happens for bg-slate-950/ etc).
# Actually, the simplest new_not is just removing `button, button *`.
new_not_simple = ':not([class*="bg-cyan-"], [class*="bg-red-"], [class*="bg-purple-"], [class*="bg-pink-"], [class*="bg-green-"], [class*="bg-emerald-"], [class*="bg-amber-"], [class*="bg-sky-"])'

text = text.replace(old_not, new_not_simple)

# Also remove the block that forces button text-white to stay white unless it's a colored button.
# Let's just find and replace the block:
old_button_whites = """/* Keep button whites pristine and vibrant elements visible */
.light button .text-white,
.light button .text-slate-100,
.light button .text-zinc-100,"""
new_button_whites = """/* Keep button whites pristine and vibrant elements visible */
.light button.bg-red-600 .text-white,"""

text = text.replace(old_button_whites, new_button_whites)

with open("src/index.css", "w") as f:
    f.write(text)
