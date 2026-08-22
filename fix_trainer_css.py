import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Replace the weird classes
text = text.replace('z-0 pointer-events-none opacity-80 mix-blend-screen drop-shadow-md', 'z-0 pointer-events-none opacity-90')

with open('src/App.tsx', 'w') as f:
    f.write(text)
