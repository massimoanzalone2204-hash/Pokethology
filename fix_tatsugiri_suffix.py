import re

with open('src/lib/api.ts', 'r') as f:
    content = f.read()

replacement1 = """
      let suffix = form.name.replace(baseName, '');
      if (form.name === 'tatsugiri-stretchy-mega') suffix = '-stretchy-mega';
      if (!ALLOWED_SUFFIXES.includes(suffix)) return;
"""

content = re.sub(
    r"const suffix = form\.name\.replace\(baseName, ''\);\s*if \(\!ALLOWED_SUFFIXES\.includes\(suffix\)\) return;",
    replacement1.strip(),
    content
)

with open('src/lib/api.ts', 'w') as f:
    f.write(content)
