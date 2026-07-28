import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove addFloatingText for stat changes and push to turnOutcomeMessages
stat_pattern = r'addFloatingText\(`\$\{statName\.toUpperCase\(\)\} \$\{change\.change > 0 \? \'ROSE\' : \'FELL\'\}!`, change\.change > 0 \? \'boost\' : \'lower\', floatingTarget\);'

content = re.sub(
    stat_pattern, 
    'turnOutcomeMessages.push(`${statName.toUpperCase()} ${change.change > 0 ? \'ROSE\' : \'FELL\'}!`);', 
    content
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
