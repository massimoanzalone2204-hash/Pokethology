import re

with open('src/components/PokethologyCombatMissionWidget.tsx', 'r') as f:
    content = f.read()

# Add getDailyHubCombatChallenges import
if 'getDailyHubCombatChallenges' not in content:
    content = content.replace("import { cn } from '../lib/utils';", "import { cn } from '../lib/utils';\nimport { getDailyHubCombatChallenges } from '../utils/dailyHubChallenges';")

with open('src/components/PokethologyCombatMissionWidget.tsx', 'w') as f:
    f.write(content)
