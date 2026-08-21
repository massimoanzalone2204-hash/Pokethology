import re

with open('server.ts', 'r') as f:
    text = f.read()

# 1. Clean up `function name(..., lang: 'it' | 'es' | 'fr' | 'de' | 'en')`
# This might be tricky because there are many functions. I'll just remove the parameter
# and any if (lang === 'it') logic. Actually, I can just use a regex for removing the lang param
# and then replace all the `if (lang === 'it') ...` lines with their English counterparts.

# Since it's a bit complex, maybe I can just hardcode `lang = 'en'` at the start of these functions
# and delete the parameter. Wait, easier: just replace the parameter with nothing in the function call,
# and in the function definition. 
# But doing it correctly with regex might break. I'll just write a quick script that replaces `lang` variables
# with 'en' in all the API endpoints and removes `lang` parameter passing.

text = re.sub(r"const lang = getRequestLanguage\(req,.*?\);", "const lang = 'en';", text)
text = re.sub(r"const lang = getRequestLanguage\(req\);", "const lang = 'en';", text)
text = re.sub(r"function getRequestLanguage\([^)]+\).*?\}", "", text, flags=re.DOTALL)

# Let's also remove the whole `CRITICAL MULTILINGUAL MANDATE` lines
text = re.sub(r"CRITICAL MULTILINGUAL MANDATE:.*?(\.\`|\,\`)", r"\1", text, flags=re.DOTALL)

with open('server.ts', 'w') as f:
    f.write(text)

print("Server updated")
