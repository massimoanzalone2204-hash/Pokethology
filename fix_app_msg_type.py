import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add a variable to track the highest priority message type
content = re.sub(
    r'let turnOutcomeMessages: string\[\] = \[\];',
    'let turnOutcomeMessages: string[] = [];\n    let highestMsgType: "default" | "critical" | "effective" | "status" | "move" = "move";',
    content
)

# Replace hitMsg pushes
content = re.sub(
    r'if \(hitMsg\) turnOutcomeMessages\.push\(hitMsg\);',
    '''if (hitMsg) {
        turnOutcomeMessages.push(hitMsg);
        if (hitType === 'critical') highestMsgType = 'critical';
        else if (hitType === 'effective' && highestMsgType !== 'critical') highestMsgType = 'effective';
        else if (hitType === 'status' && highestMsgType === 'move') highestMsgType = 'status';
      }''',
    content
)

# And for the display block
content = re.sub(
    r"setBattleMessage\(\{ text: turnOutcomeMessages\.join\(' • '\), type: 'move' \}\);",
    r"setBattleMessage({ text: turnOutcomeMessages.join(' • '), type: highestMsgType });",
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
