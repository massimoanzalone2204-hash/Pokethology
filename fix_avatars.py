import re
import json

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Fix ids
text = text.replace('"id": "nemona"', '"id": "nemona-s"')
text = text.replace('"id": "arven"', '"id": "arven-s"')

# Remove Elite Four characters
start_idx = text.find("const TRAINER_SPRITES = [")
end_idx = text.find("];\n\nconst getShowdownName", start_idx) + 1

json_str = text[start_idx+24:end_idx]
trainers = json.loads(json_str)

filtered_trainers = [t for t in trainers if t.get("role") != "Elite Four"]

new_js = "const TRAINER_SPRITES = " + json.dumps(filtered_trainers, indent=2) + ";"
text = text[:start_idx] + new_js + text[end_idx:]

# Update the filter arrays
text = text.replace(
    "useState<'All' | 'Gym Leader' | 'Elite Four' | 'Champion' | 'Protagonist' | 'Trainer' | 'Villain'>",
    "useState<'All' | 'Protagonist' | 'Rival' | 'Gym Leader' | 'Champion' | 'Trainer' | 'Villain'>"
)

text = text.replace(
    "['All', 'Protagonist', 'Gym Leader', 'Elite Four', 'Champion', 'Trainer', 'Villain']",
    "['All', 'Protagonist', 'Rival', 'Gym Leader', 'Champion', 'Trainer', 'Villain']"
)

with open('src/App.tsx', 'w') as f:
    f.write(text)

