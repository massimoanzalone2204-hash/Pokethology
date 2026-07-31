import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

pattern = r'(\{/\* Abilities \*/\}.*?</div>\s*</div>\s*)<div className=\{cn\(\s*"backdrop-blur-md'

replacement = r'<div className="grid grid-cols-1 md:grid-cols-2 gap-4">\n\1</div>\n                                    <div className={cn(\n                                      "backdrop-blur-md'

content, n = re.subn(pattern, replacement, content, flags=re.DOTALL)
if n > 0:
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print(f"Success, replaced {n} instances")
else:
    print("Pattern not found")
