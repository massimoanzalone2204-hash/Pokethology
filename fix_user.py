import re
with open('src/components/Tutorial.tsx', 'r') as f:
    text = f.read()

text = text.replace('import { \n  X,', 'import { \n  User,\n  X,')

with open('src/components/Tutorial.tsx', 'w') as f:
    f.write(text)
