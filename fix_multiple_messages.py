import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Initialize turnOutcomeMessages after anyCrit
content = re.sub(
    r'let anyCrit = false;\n',
    'let anyCrit = false;\n    let turnOutcomeMessages: string[] = [];\n',
    content
)

# 2. Replace hitMsg display
hitmsg_pattern = r'if \(hitMsg\) \{\n\s*setBattleMessage\(\{ text: hitMsg, type: hitType as any \}\);\n\s*await battleDelay\(1000\);\n\s*setBattleMessage\(null\);\n\s*\}'
content = re.sub(hitmsg_pattern, 'if (hitMsg) turnOutcomeMessages.push(hitMsg);', content)

# 3. Replace stat changes BattleMessage
stat_change_pattern = r'setBattleMessage\(\{ text: `\$\{statName\.toUpperCase\(\)\} \$\{change\.change > 0 \? \'ROSE\' : \'FELL\'\}!`, type: change\.change > 0 \? \'effective\' : \'status\' \}\);\n\s*await battleDelay\(800\);\n\s*setBattleMessage\(null\);'
content = re.sub(stat_change_pattern, 'turnOutcomeMessages.push(`${statName.toUpperCase()} ${change.change > 0 ? \'ROSE\' : \'FELL\'}!`);', content)

# 4. Replace Status Ailments floating text with turnOutcomeMessages
ailments = [
    ("PARALYZED!", "PARALYZED!"),
    ("BURNED!", "BURNED!"),
    ("POISONED!", "POISONED!"),
    ("FROZEN!", "FROZEN!"),
    ("ASLEEP!", "ASLEEP!"),
    ("CONFUSED!", "CONFUSED!")
]
for text, replace_text in ailments:
    content = re.sub(
        r'addFloatingText\("{}", \'status\', isPlayer\);'.format(text),
        'turnOutcomeMessages.push("{}");'.format(replace_text),
        content
    )

with open('src/App.tsx', 'w') as f:
    f.write(content)
