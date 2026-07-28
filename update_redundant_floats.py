import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove addFloatingText for status checks
content = re.sub(r'addFloatingText\("FLINCHED!", \'status\', !isPlayer\);\n\s*', '', content)
content = re.sub(r'addFloatingText\("PARALYZED", \'status\', !isPlayer\);\n\s*', '', content)
content = re.sub(r'addFloatingText\("THAWED!", \'status\', !isPlayer\);\n\s*', '', content)
content = re.sub(r'addFloatingText\("FROZEN!", \'status\', !isPlayer\);\n\s*', '', content)
content = re.sub(r'addFloatingText\("ASLEEP", \'status\', !isPlayer\);\n\s*', '', content)
content = re.sub(r'addFloatingText\("SNAPPED OUT!", \'status\', !isPlayer\);\n\s*', '', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
