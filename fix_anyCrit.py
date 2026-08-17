import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add let anyCrit = false;
content = re.sub(r'let totalDamage = 0;\n\s*let effectiveness = 1;', 'let totalDamage = 0;\n    let effectiveness = 1;\n    let anyCrit = false;', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
