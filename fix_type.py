import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'let highestMsgType: "default" | "critical" | "effective" | "status" | "move" = "move";',
    'let highestMsgType: any = "move";'
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
