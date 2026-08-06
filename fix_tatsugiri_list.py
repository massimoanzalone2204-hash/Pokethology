import re

with open('src/lib/api.ts', 'r') as f:
    content = f.read()

replacement = """
    let relatedForms = allForms.filter((f: any) => 
      f.name !== baseName && 
      f.name.startsWith(baseName + '-')
    );

    // Special logic for Tatsugiri: replace curly-mega with stretchy-mega
    if (baseName === 'tatsugiri-curly') {
      relatedForms = relatedForms.filter((f: any) => f.name !== 'tatsugiri-curly-mega');
      const stretchyMega = allForms.find((f: any) => f.name === 'tatsugiri-stretchy-mega');
      if (stretchyMega) {
        relatedForms.push(stretchyMega);
      }
    }
"""

content = re.sub(
    r"const relatedForms = allForms\.filter\(\(f: any\) =>\s*f\.name !== baseName &&\s*f\.name\.startsWith\(baseName \+ '-'\)\s*\);",
    replacement.strip(),
    content
)

with open('src/lib/api.ts', 'w') as f:
    f.write(content)
