import re
with open('src/App.tsx', 'r') as f:
    text = f.read()

with open('new_trainers.js', 'r') as f:
    new_trainers = f.read()

start_marker = "const TRAINER_SPRITES = ["
end_marker = "];"

start_idx = text.find(start_marker)
end_idx = text.find(end_marker, start_idx) + len(end_marker)

new_text = text[:start_idx] + new_trainers.strip() + text[end_idx:]

with open('src/App.tsx', 'w') as f:
    f.write(new_text)

print("Replaced TRAINER_SPRITES")
