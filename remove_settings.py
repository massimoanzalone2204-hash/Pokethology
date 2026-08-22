import re

with open('src/components/Tutorial.tsx', 'r') as f:
    text = f.read()

# Pattern to remove
pattern = r'\s*\{\/\* SETTINGS SECTION \*\/}.*?System Settings.*?<\/div>\n\s*<\/div>'

import sys
match = re.search(pattern, text, re.DOTALL)
if match:
    text = text[:match.start()] + text[match.end():]
    with open('src/components/Tutorial.tsx', 'w') as f:
        f.write(text)
    print("Successfully removed Settings Section.")
else:
    print("Could not find Settings Section!")
