import re
with open('src/App.tsx', 'r') as f:
    text = f.read()

# I want to ensure `isProcessingMoveRef.current = false;` is definitely inside `handlePlayerMove`'s `finally` block,
# and that `processing` doesn't get un-locked too early. Let's make absolutely sure.

text = re.sub(
    r"isProcessingMoveRef\.current = false;\s*\}\s*\};\s*const opponentTurnStartedRef",
    "isProcessingMoveRef.current = false;\n    }\n  };\n\n  const opponentTurnStartedRef",
    text
)
with open('src/App.tsx', 'w') as f:
    f.write(text)
