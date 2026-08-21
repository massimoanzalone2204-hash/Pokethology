import re
with open('src/App.tsx', 'r') as f:
    text = f.read()

text = text.replace(
    "useState<'All' | 'Gym Leader' | 'Elite Four' | 'Champion'>('All')",
    "useState<'All' | 'Gym Leader' | 'Elite Four' | 'Champion' | 'Protagonist' | 'Trainer' | 'Villain'>('All')"
)

text = text.replace(
    "['All', 'Gym Leader', 'Elite Four', 'Champion'].map(role => (",
    "['All', 'Protagonist', 'Gym Leader', 'Elite Four', 'Champion', 'Trainer', 'Villain'].map(role => ("
)

with open('src/App.tsx', 'w') as f:
    f.write(text)
