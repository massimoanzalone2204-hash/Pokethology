import re
with open('src/App.tsx', 'r') as f:
    text = f.read()

text = re.sub(
    r"if \(turn !== 'player' \|\| !isBattling \|\| isAnimating \|\| !pokemon \|\| !battleOpponent\) return;",
    "if (turn !== 'player' || !isBattling || isAnimating || !pokemon || !battleOpponent || isProcessingMoveRef.current) return;\n    isProcessingMoveRef.current = true;",
    text
)

text = re.sub(
    r"setIsAnimating\(false\);\n    \}",
    "setIsAnimating(false);\n      isProcessingMoveRef.current = false;\n    }",
    text
)

with open('src/App.tsx', 'w') as f:
    f.write(text)
