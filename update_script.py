import re
import json

with open('src/App.tsx', 'r') as f:
    app_text = f.read()

start_idx = app_text.find("const TRAINER_SPRITES = [")
end_idx = app_text.find("];", start_idx) + 1

if start_idx != -1 and end_idx != 1:
    json_str = app_text[start_idx+24:end_idx]
    trainers = json.loads(json_str)
    
    new_gen6_9 = [
        { "name": 'Calem', "id": 'calem', "role": 'Protagonist', "lore": 'The stylish hero of the Kalos region, striving to uncover the mysteries of Mega Evolution.' },
        { "name": 'Serena', "id": 'serena', "role": 'Protagonist', "lore": 'A passionate and determined trainer from Kalos, seeking to become the very best.' },
        { "name": 'Elio', "id": 'elio', "role": 'Protagonist', "lore": 'The bright-eyed champion of Alola, who brought the Island Challenge to new heights.' },
        { "name": 'Selene', "id": 'selene', "role": 'Protagonist', "lore": 'A cheerful Alolan trainer, always ready for an adventure beneath the tropical sun.' },
        { "name": 'Victor', "id": 'victor', "role": 'Protagonist', "lore": 'The determined hero of Galar, ready to conquer the Gym Challenge in packed stadiums.' },
        { "name": 'Gloria', "id": 'gloria', "role": 'Protagonist', "lore": 'A spirited Galarian trainer with an unstoppable drive to become the Champion.' },
        { "name": 'Florian', "id": 'florian-s', "role": 'Protagonist', "lore": 'A student of Naranja Academy in Paldea, exploring the vast region on a treasure hunt.' },
        { "name": 'Juliana', "id": 'juliana-s', "role": 'Protagonist', "lore": 'A student of Uva Academy in Paldea, seeking her own unique treasure across the region.' },
        { "name": 'Leon', "id": 'leon', "role": 'Champion', "lore": 'The undefeated Champion of the Galar region. Known for his incredible battle sense and terrible sense of direction.' },
        { "name": 'Geeta', "id": 'geeta', "role": 'Champion', "lore": 'The Top Champion of the Paldea region. She oversees the Pokemon League with unmatched grace and authority.' },
        { "name": 'Diantha', "id": 'diantha', "role": 'Champion', "lore": 'The glamorous Champion of the Kalos region and a world-renowned movie star.' },
        { "name": 'Kukui', "id": 'kukui', "role": 'Champion', "lore": 'The passionate Pokemon Professor of Alola, and the founder of its first-ever Pokemon League.' },
        { "name": 'Hop', "id": 'hop', "role": 'Rival', "lore": 'Leon\'s younger brother and a fiercely determined rival aiming to step out of his brother\'s shadow.' },
        { "name": 'Nemona', "id": 'nemona', "role": 'Rival', "lore": 'A battle-obsessed Champion-ranked trainer from Paldea who loves testing new strategies.' },
        { "name": 'Kieran', "id": 'kieran', "role": 'Rival', "lore": 'A quiet trainer from Kitakami whose intense determination pushed him to become the BB League Champion.' },
        { "name": 'Carmine', "id": 'carmine', "role": 'Rival', "lore": 'A strong-willed student from Blueberry Academy who fiercely protects her younger brother Kieran.' },
        { "name": 'Marnie', "id": 'marnie', "role": 'Rival', "lore": 'A composed trainer from Spikemuth. Her quiet strength earned her the fanatic devotion of Team Yell.' },
        { "name": 'Bede', "id": 'bede', "role": 'Rival', "lore": 'A proud and arrogant trainer who eventually found his true calling as the Ballonlea Gym Leader.' },
        { "name": 'Penny', "id": 'penny', "role": 'Trainer', "lore": 'A shy tech genius from Paldea who secretly led Team Star to protect her friends.' },
        { "name": 'Arven', "id": 'arven', "role": 'Trainer', "lore": 'A culinary expert from Paldea on a quest to find the mythical Herba Mystica to heal his partner Pokemon.' }
    ]
    
    trainers.extend(new_gen6_9)
    new_js = "const TRAINER_SPRITES = " + json.dumps(trainers, indent=2) + ";"
    
    app_text = app_text[:start_idx] + new_js + app_text[end_idx+1:]
    
    # Text replacements
    app_text = app_text.replace("'DAILY SPECIMEN SCAN'", "'DAILY SCAN'")
    app_text = app_text.replace("'DAILY OPERATIONS HUB'", "'DAILY HUB'")
    app_text = app_text.replace(">DAILY SPECIMEN SCAN<", ">DAILY SCAN<")
    app_text = app_text.replace(">DAILY OPERATIONS HUB<", ">DAILY HUB<")
    
    with open('src/App.tsx', 'w') as f:
        f.write(app_text)
    print("Done")
else:
    print("Could not find boundaries")

