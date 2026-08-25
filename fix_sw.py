import re

with open("public/sw.js", "r") as f:
    text = f.read()

# Update cache version
text = re.sub(r'const CACHE_NAME = \'pokethology-v[0-9\.]+\';', 'const CACHE_NAME = \'pokethology-v2.8\';', text)

# Replace icon.svg with logo.png
text = text.replace('/icon.svg', '/logo.png')

with open("public/sw.js", "w") as f:
    f.write(text)
