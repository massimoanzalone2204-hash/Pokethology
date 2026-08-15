const fs = require('fs');

let content = fs.readFileSync('src/components/PokethologyCombatMissionWidget.tsx', 'utf8');

// Add getDailyHubCombatChallenges import
if (!content.includes('getDailyHubCombatChallenges')) {
    content = content.replace("import { cn } from '../lib/utils';", "import { cn } from '../lib/utils';\nimport { getDailyHubCombatChallenges } from '../utils/dailyHubChallenges';");
}

fs.writeFileSync('src/components/PokethologyCombatMissionWidget.tsx', content);
