with open('src/components/Tutorial.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "{/* Avatar Personalization */}" in line:
        skip = True
    
    if not skip:
        new_lines.append(line)
        
    if skip and '</div>' in line:
        # Check if we have closed the 2 nested divs.
        # Actually it's easier to just skip the exact number of lines.
        pass

# Let's do it with python re
import re
with open('src/components/Tutorial.tsx', 'r') as f:
    text = f.read()

text = re.sub(r'[ \t]*\{\/\* Avatar Personalization \*\/}.*?<\/div>\n[ \t]*<\/div>\n', '', text, flags=re.DOTALL)

with open('src/components/Tutorial.tsx', 'w') as f:
    f.write(text)

