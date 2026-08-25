import re

with open("src/components/PokethologyCombatMissionWidget.tsx", "r") as f:
    text = f.read()

# Replace verbose descriptions to be concise and start with "Defeat"
replacements = [
    (r"Defeat ([A-Za-z]+)-type Pokémon in battle to complete the mission\.", r"Defeat \1-type Pokémon."),
    (r"Defeat a Pokémon with a very high Defense stat \(150\+ Base Defense\) in battle\.", r"Defeat a Pokémon with 150+ Base Defense."),
    (r"Defeat a Pokémon with extreme Defense \(180\+ Base Defense\)\.", r"Defeat a Pokémon with 180+ Base Defense."),
    (r"Defeat high-speed Pokémon with Base Speed of 120 or higher\.", r"Defeat a Pokémon with 120+ Base Speed."),
    (r"Defeat physical Pokémon with Base Attack of 130 or higher\.", r"Defeat a Pokémon with 130+ Base Attack."),
    (r"Defeat Special Attack Pokémon with Base Sp\.Atk of 130 or higher\.", r"Defeat a Pokémon with 130+ Base Sp.Atk."),
    (r"Defeat Special Defense Pokémon with Base Sp\.Def of 130 or higher\.", r"Defeat a Pokémon with 130+ Base Sp.Def."),
    (r"Defeat massive stamina Pokémon with Base HP of 130 or higher\.", r"Defeat a Pokémon with 130+ Base HP."),
    (r"Defeat Pokémon with Huge Total Base Stats \(540\+ Base Stats\)\.", r"Defeat a Pokémon with 540+ Total Base Stats."),
    (r"Defeat Legendary or Mythical Pokémon in combat\.", r"Defeat a Legendary or Mythical Pokémon."),
    (r"Defeat Mega-Evolved or Primal Pokémon forms in battle\.", r"Defeat a Mega-Evolved or Primal Pokémon."),
    (r"Defeat Gigantamax & Dynamax Pokémon in battle\.", r"Defeat a Gigantamax or Dynamax Pokémon.")
]

for pattern, replacement in replacements:
    text = re.sub(pattern, replacement, text)

with open("src/components/PokethologyCombatMissionWidget.tsx", "w") as f:
    f.write(text)
