import re

with open("src/utils/dailyHubChallenges.ts", "r") as f:
    text = f.read()

replacements = {
    "Huge Defense Fortresses": "Huge Defense Pokémon",
    "Huge Attack Powerhouses": "Huge Attack Pokémon",
    "Huge Speed Sweepers": "Huge Speed Pokémon",
    "Huge Special Defense Walls": "Huge Special Defense Pokémon",
    "Gigantamax & Dynamax Powerhouses": "Gigantamax & Dynamax Pokémon",
    "Colossal Sp. Defense Walls": "Colossal Sp. Defense Pokémon",
    "Colossal Base Stat Powerhouses": "Colossal Base Stat Pokémon"
}

for old, new in replacements.items():
    text = text.replace(old, new)

with open("src/utils/dailyHubChallenges.ts", "w") as f:
    f.write(text)
