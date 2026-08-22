import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

start = content.find("const TRAINER_SPRITES = [")
end = content.find("];", start) + 2

print(content[start:start+100])
print("...")
print(content[end-100:end])

with open('trainers.js', 'w') as f:
    f.write(content[start:end])
