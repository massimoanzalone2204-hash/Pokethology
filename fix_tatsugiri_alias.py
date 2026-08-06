import re

with open('src/lib/api.ts', 'r') as f:
    content = f.read()

replacement = """
export const MALE_BASE_FORMS: Record<string, string> = {
  'pyroar': 'pyroar-male',
  'jellicent': 'jellicent-male',
  'frillish': 'frillish-male',
  'meowstic': 'meowstic-male',
  'indeedee': 'indeedee-male',
  'oinkologne': 'oinkologne-male',
  'basculegion': 'basculegion-male',
  'tatsugiri': 'tatsugiri-curly'
};
"""

content = re.sub(
    r"export const MALE_BASE_FORMS: Record<string, string> = \{[^\}]+\};",
    replacement.strip(),
    content
)

with open('src/lib/api.ts', 'w') as f:
    f.write(content)
