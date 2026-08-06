import re

with open('src/components/BattleMessage.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'text-center relative z-10 leading-none", styles.text',
    'text-center relative z-10 leading-relaxed max-w-full break-words whitespace-pre-wrap", styles.text'
)

with open('src/components/BattleMessage.tsx', 'w') as f:
    f.write(content)
