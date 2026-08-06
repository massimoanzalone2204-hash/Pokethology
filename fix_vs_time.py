import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Change opponent cry timeout from 900 to 1400
content = re.sub(
    r"(vsOpponentCryTimeoutRef\.current = setTimeout\(\(\) => \{\s*sounds\.playCry\(.*?\);\s*\}\, )900(\);)",
    r"\1 1400\2",
    content
)

# Change VS screen skip from 1800 to 3500
content = re.sub(
    r"(vsTimeoutRef\.current = setTimeout\(\(\) => \{\s*skipVSScreen\(\);\s*\}\, )1800(\);)",
    r"\1 3500\2",
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
