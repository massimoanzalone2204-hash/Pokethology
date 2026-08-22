import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Make sure we don't duplicate
if 'hardware-accelerated-layer' not in text:
    text = text.replace('className="fixed inset-0', 'className="fixed inset-0 hardware-accelerated-layer')
    text = text.replace('className="w-full h-full', 'className="w-full h-full hardware-accelerated-layer')
    text = text.replace('className="relative w-20 h-20', 'className="relative w-20 h-20 hardware-accelerated-layer')
    text = text.replace('custom-scrollbar', 'custom-scrollbar optimize-scrolling')

    with open('src/App.tsx', 'w') as f:
        f.write(text)
    print("FPS classes applied")
else:
    print("Already applied")

