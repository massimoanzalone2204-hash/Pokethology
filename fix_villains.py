import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

text = text.replace('"id": "maxie"', '"id": "maxie-gen6"')
text = text.replace('"id": "archie"', '"id": "archie-gen6"')

with open('src/App.tsx', 'w') as f:
    f.write(text)
