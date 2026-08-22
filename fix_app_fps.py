import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Let's clean up over-use of hardware-accelerated-layer. 
# We should only use it on the main moving elements, not the backgrounds.
text = text.replace('className="w-full h-full hardware-accelerated-layer', 'className="w-full h-full')
text = text.replace('className="absolute inset-0 hardware-accelerated-layer bg-gradient-to-b', 'className="absolute inset-0 bg-gradient-to-b')
text = text.replace('className="fixed inset-0 hardware-accelerated-layer', 'className="fixed inset-0')
text = text.replace('className="relative w-20 h-20 hardware-accelerated-layer', 'className="relative w-20 h-20')
text = text.replace('hardware-accelerated-layer', '')

with open('src/App.tsx', 'w') as f:
    f.write(text)

