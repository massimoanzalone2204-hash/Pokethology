import re
with open('src/App.tsx', 'r') as f:
    text = f.read()

text = text.replace('onClick={() = />', 'onClick={() =>')

with open('src/App.tsx', 'w') as f:
    f.write(text)
