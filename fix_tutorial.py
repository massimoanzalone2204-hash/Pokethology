import re

with open('src/components/Tutorial.tsx', 'r') as f:
    text = f.read()

# Filter by 18 Elemental Types ...
text = re.sub(
    r"Filter by 18 Elemental Types with dual-type combinations, jump across Generation selectors \(Gen I–IX\), and sort instantly",
    "Jump across Generation selectors (Gen I–IX), and sort instantly",
    text
)

with open('src/components/Tutorial.tsx', 'w') as f:
    f.write(text)

print("Tutorial updated")
