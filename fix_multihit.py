import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove setBattleMessage(null) inside the loop
content = re.sub(
    r'(setBattleMessage\(\{ text: `\$\{move\.name\.toUpperCase\(\)\} \(Hit \$\{i \+ 1\}\)`, type: \'move\' \};\n\s*\})\n\s*await battleDelay\(400\);\n\s*setBattleMessage\(null\);',
    r'\1\n        await battleDelay(400);',
    content
)

# Add setBattleMessage(null) after the loop if numHits > 1
content = re.sub(
    r'if \(numHits > 1\) \{\n\s*log\(`Hit \$\{numHits\} times!`, \'normal\'\);\n\s*\}',
    'if (numHits > 1) {\n        log(`Hit ${numHits} times!`, \'normal\');\n        setBattleMessage(null);\n      }',
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
