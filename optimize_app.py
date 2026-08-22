with open('src/App.tsx', 'r') as f:
    text = f.read()

# Add transform-gpu to all framer-motion divs
text = text.replace(
    'className="fixed inset-0',
    'className="fixed inset-0 transform-gpu'
)

text = text.replace(
    'className="w-full h-full bg-slate-950',
    'className="w-full h-full bg-slate-950 transform-gpu'
)

text = text.replace(
    'className="relative w-20 h-20',
    'className="relative w-20 h-20 transform-gpu'
)

text = text.replace(
    'className="absolute inset-0 bg-gradient-to-b',
    'className="absolute inset-0 bg-gradient-to-b transform-gpu will-change-transform'
)

text = text.replace(
    'className={cn(\n                                "w-16 h-16',
    'className={cn(\n                                "transform-gpu will-change-transform w-16 h-16'
)

with open('src/App.tsx', 'w') as f:
    f.write(text)
print("Updated App.tsx")
