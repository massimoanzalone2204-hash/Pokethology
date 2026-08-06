import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Hoist anyCrit declaration
content = re.sub(r'let totalDamage = 0;\n\s*for \(let i = 0; i < numHits; i\+\+\) \{', 'let totalDamage = 0;\n      let anyCrit = false;\n      for (let i = 0; i < numHits; i++) {', content)

# Set anyCrit inside the loop
content = re.sub(r'const isCrit = Math\.random\(\) < 0\.0625;', 'const isCrit = Math.random() < 0.0625;\n        if (isCrit) anyCrit = true;', content)

# Update the references to isCrit in the unified message block
unified_block_pattern = r'// Unified aesthetic battle message for hits.*?if \(hitMsg\) \{'

def replace_isCrit(match):
    text = match.group(0)
    return text.replace('isCrit', 'anyCrit')

content = re.sub(unified_block_pattern, replace_isCrit, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
