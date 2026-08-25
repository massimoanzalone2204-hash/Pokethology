import re

with open("src/components/PokethologyCombatMissionWidget.tsx", "r") as f:
    text = f.read()

replacements = {
    "Defeat a Fortress Pokémon with extreme Defense": "Defeat a Pokémon with extreme Defense",
    "Defeat physical powerhouses with Base Attack": "Defeat physical Pokémon with Base Attack",
    "Defeat Special Attack powerhouses with Base Sp.Atk": "Defeat Special Attack Pokémon with Base Sp.Atk",
    "Defeat Special Defense fortresses with Base Sp.Def": "Defeat Special Defense Pokémon with Base Sp.Def",
    "Defeat Gigantamax & Dynamax Powerhouses in battle": "Defeat Gigantamax & Dynamax Pokémon in battle",
    "against physical sweepers.": "against physical attackers.",
    "neutralizing setup sweepers.": "neutralizing setup attackers."
}

for old, new in replacements.items():
    text = text.replace(old, new)

with open("src/components/PokethologyCombatMissionWidget.tsx", "w") as f:
    f.write(text)
