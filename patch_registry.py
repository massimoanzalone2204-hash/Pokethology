import re

with open("src/App.tsx", "r") as f:
    text = f.read()

old_settings_box = """                {/* Registry & Utilities */}
                <div className="flex flex-col gap-3 bg-slate-900/90 p-4 sm:p-6 rounded-2xl border border-cyan-500/30 shadow-xl w-full">
                  <HUDCorners />"""
new_settings_box = """                {/* Registry & Utilities */}
                <div className="flex flex-col gap-4 w-full pt-4 border-t border-cyan-500/20 mt-2">"""

text = text.replace(old_settings_box, new_settings_box)

with open("src/App.tsx", "w") as f:
    f.write(text)
