import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Strip out over-eager will-change tags that destroy composite layer memory
text = text.replace('will-change-transform', '')
text = text.replace('transform-gpu', '')
text = text.replace('will-change-transformr', '') # in case of typo

# Also remove transition-all on heavy elements
text = text.replace('transition-all duration-500', 'transition-transform duration-500')

with open('src/App.tsx', 'w') as f:
    f.write(text)

print("App.tsx cleaned of heavy FPS-draining classes")
