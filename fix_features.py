import re

# 1. App.tsx
with open('src/App.tsx', 'r') as f:
    app_text = f.read()

# Remove language state entirely if possible, or just replace useTranslation and usages
# The easiest way: remove `import { useTranslation } from 'react-i18next';`
# Replace `selectedLang` logic with `'en'`
app_text = app_text.replace("import { useTranslation } from 'react-i18next';", "")
app_text = app_text.replace("const { t, i18n } = useTranslation();", "")
app_text = app_text.replace("const selectedLang = 'en' as string;", "")
# Replace all usages of selectedLang with 'en'
app_text = re.sub(r'selectedLang', "'en'", app_text)

# Also remove currentType logic
app_text = re.sub(r'const \[currentType, setCurrentType\] = useState<string \| null>\(null\);', '', app_text)
app_text = re.sub(r'setCurrentType\(null\);', '', app_text)
app_text = re.sub(r'setCurrentType\(type\);', '', app_text)

# Clean up loadTypePokemon which uses currentType
app_text = re.sub(r'if \(currentType\) \{\s*loadTypePokemon\(currentType\);\s*\} else \{\s*loadAllPokemon\(\);\s*\}', 'loadAllPokemon();', app_text)

with open('src/App.tsx', 'w') as f:
    f.write(app_text)

print("App.tsx cleaned.")
