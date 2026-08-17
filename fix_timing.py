import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add a delay and clear after the move name is shown, so it doesn't overlap with damage animations.
# But actually, keeping the move name up while the animation plays is cool. Let's just clear it before showing outcomes or if it's a normal hit.
content = re.sub(
    r'(setBattleMessage\(\{ text: move\.name\.toUpperCase\(\), type: \'move\' \};\n)',
    r'\1    await battleDelay(800);\n    setBattleMessage(null);\n',
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

with open('src/components/BattleMessage.tsx', 'r') as f:
    content = f.read()

# Remove the useEffect that auto-hides
content = re.sub(r'  useEffect\(\(\) => \{\n.*?  \}, \[message, onComplete, type\]\);\n', '', content, flags=re.DOTALL)

with open('src/components/BattleMessage.tsx', 'w') as f:
    f.write(content)
