import json
import re

# Read the current array from trainers.js
with open('trainers.js', 'r') as f:
    text = f.read()

# It starts with "const TRAINER_SPRITES = [" and ends with "];"
json_str = text[text.find('['):text.rfind(']')+1]
trainers = json.loads(json_str)

# Remove lorelei, agatha, tateandliza, hexmaniac
to_remove = ['lorelei', 'agatha', 'tateandliza', 'hexmaniac']
filtered_trainers = [t for t in trainers if t['id'] not in to_remove]

# Add new principal villains
new_villains = [
    { "name": 'Maxie', "id": 'maxie', "role": 'Villain', "lore": 'The analytical leader of Team Magma, who wishes to expand the landmass to create more space for human progress and development.' },
    { "name": 'Archie', "id": 'archie', "role": 'Villain', "lore": 'The boisterous leader of Team Aqua, who seeks to expand the sea to return the world to its primordial, natural state for Pokémon.' },
    { "name": 'Cyrus', "id": 'cyrus', "role": 'Villain', "lore": 'The emotionless boss of Team Galactic. He despises the human spirit and aims to destroy the universe to rebuild a perfect one without emotion.' },
    { "name": 'Ghetsis', "id": 'ghetsis', "role": 'Villain', "lore": 'The true mastermind behind Team Plasma. A manipulative and cruel dictator who uses the ideal of Pokémon liberation as a front for world domination.' },
    { "name": 'N', "id": 'n', "role": 'Villain', "lore": 'The enigmatic King of Team Plasma. Raised alongside Pokémon, he can hear their inner voices and seeks to separate their world from humans.' },
    { "name": 'Lysandre', "id": 'lysandre', "role": 'Villain', "lore": 'The charismatic leader of Team Flare. Obsessed with preserving the world\'s beauty, he plans to activate the ultimate weapon to wipe out the "ugly" elements of society.' },
    { "name": 'Guzma', "id": 'guzma', "role": 'Villain', "lore": 'The destructive boss of Team Skull. A misunderstood outcast who relies on Bug-type Pokémon and overwhelming force to beat down his opponents.' },
    { "name": 'Lusamine', "id": 'lusamine', "role": 'Villain', "lore": 'The elegant president of the Aether Foundation. Her obsessive love for Ultra Beasts drives her to terrifying extremes, disregarding the safety of everyone around her.' }
]

filtered_trainers.extend(new_villains)

# Generate new javascript code
new_js = "const TRAINER_SPRITES = " + json.dumps(filtered_trainers, indent=2) + ";"

with open('src/App.tsx', 'r') as f:
    app_text = f.read()

start_idx = app_text.find("const TRAINER_SPRITES = [")
end_idx = app_text.find("];", start_idx) + 2

new_app_text = app_text[:start_idx] + new_js + app_text[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(new_app_text)

print("Updated trainers successfully.")
