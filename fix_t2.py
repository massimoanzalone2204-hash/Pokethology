import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Replace `{t('FAVS') || 'Favs'}` with `{'Favs'}` or just `'Favs'` if we want, but since it's already in JSX `{t('...') || '...'}` I can just replace `t('...') || ` with ``
text = re.sub(r"t\('[^']+'\)\s*\|\|\s*", "", text)

with open('src/App.tsx', 'w') as f:
    f.write(text)

print("t() removed")
