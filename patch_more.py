import re

with open("src/utils/dailyHubChallenges.ts", "r") as f:
    text = f.read()

replacements = {
    "Foes": "Pokémon",
    "Bastions": "Pokémon",
    "Juggernauts": "Pokémon"
}

for old, new in replacements.items():
    text = text.replace(old, new)

with open("src/utils/dailyHubChallenges.ts", "w") as f:
    f.write(text)

with open("src/components/PokethologyCombatMissionWidget.tsx", "r") as f:
    text = f.read()

replacements2 = {
    "speedsters": "Pokémon",
    "champions": "Pokémon"
}

for old, new in replacements2.items():
    text = text.replace(old, new)

with open("src/components/PokethologyCombatMissionWidget.tsx", "w") as f:
    f.write(text)
