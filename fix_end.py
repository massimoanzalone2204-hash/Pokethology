with open("src/App.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if "      </div>\n  );\n}" in content:
    content = content.replace("      </div>\n  );\n}", "      </div>\n      </Suspense>\n    </ErrorBoundary>\n  );\n}")
    with open("src/App.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced!")
else:
    print("Pattern not found!")
