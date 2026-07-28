import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Insert the display block
display_block = """
    if (turnOutcomeMessages.length > 0) {
      setBattleMessage({ text: turnOutcomeMessages.join(' • '), type: 'move' });
      await battleDelay(1500);
      setBattleMessage(null);
    }
"""

content = re.sub(
    r'(\s*await battleDelay\(800\);\n\s*\}\n\s*)// Check for flinch',
    r'\1' + display_block + '\n    // Check for flinch',
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
