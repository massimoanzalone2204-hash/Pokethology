import re
with open('src/App.tsx', 'r') as f:
    text = f.read()

text = re.sub(r"  const \{ t \} = useTranslation\(\);\n", "", text)
# And replace usages of `t('...')` with just the string '...'
# This could be tricky. Let's see if there are any usages of `t(`.
