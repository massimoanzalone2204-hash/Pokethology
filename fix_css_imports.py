with open('src/index.css', 'r') as f:
    lines = f.readlines()

imports = []
others = []

for line in lines:
    if line.startswith('@import '):
        imports.append(line)
    else:
        others.append(line)

with open('src/index.css', 'w') as f:
    f.writelines(imports + others)
print("CSS imports fixed")
