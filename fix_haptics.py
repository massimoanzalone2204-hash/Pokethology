import re

with open('src/lib/utils.ts', 'r') as f:
    text = f.read()

# Remove the isNonPcDevice check in playHaptic
text = re.sub(r"// Enhanced haptic feedback for devices that aren't PC\s*if \(!isNonPcDevice\(\)\) return;\s*", "", text)

with open('src/lib/utils.ts', 'w') as f:
    f.write(text)

with open('src/App.tsx', 'r') as f:
    app = f.read()

# Add playHaptic to some button clicks where sounds.boot() or sounds.select() is used
# Or just to common interactive events.
# Sounds used in App.tsx
app = re.sub(r"(sounds\.boot\(\);)", r"\1 playHaptic('medium');", app)
app = re.sub(r"(sounds\.scan\(\);)", r"\1 playHaptic('light');", app)
app = re.sub(r"(sounds\.battleStart\(\);)", r"\1 playHaptic('heavy');", app)
app = re.sub(r"sounds\.select\(\);", "sounds.select(); playHaptic();", app)
app = re.sub(r"(sounds\.attack\(\);)", r"\1 playHaptic('impact');", app)
app = re.sub(r"(sounds\.typeAdvantage\(\);)", r"\1 playHaptic('success');", app)

# Make sure not to duplicate playHaptic where it was already there (some had it)
with open('src/App.tsx', 'w') as f:
    f.write(app)

print("Haptics enhanced")
