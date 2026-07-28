import re

with open('src/lib/api.ts', 'r') as f:
    content = f.read()

replacement = """
  let formattedQuery = query.trim().toLowerCase();

  // Block removed Tatsugiri megas
  if (formattedQuery === 'tatsugiri-curly-mega' || formattedQuery === 'tatsugiri-droopy-mega') {
    throw new Error("Pokemon " + formattedQuery + " not found!");
  }

  if (MALE_BASE_FORMS[formattedQuery]) {
"""

content = content.replace(
    "let formattedQuery = query.trim().toLowerCase();\n  if (MALE_BASE_FORMS[formattedQuery]) {",
    replacement.strip()
)

with open('src/lib/api.ts', 'w') as f:
    f.write(content)
