const fs = require('fs');

let content = fs.readFileSync('src/components/PokethologyCombatMissionWidget.tsx', 'utf8');

// Add getDailyHubCombatChallenges import
if (!content.includes('getDailyHubCombatChallenges')) {
    content = content.replace("import { cn } from '../lib/utils';", "import { cn } from '../lib/utils';\nimport { getDailyHubCombatChallenges, HubCombatChallenge } from '../utils/dailyHubChallenges';");
}

// Write the hook at the top
if (!content.includes('usePersistentState')) {
    const hookCode = `
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      // Ignore
    }
  }, [key, state]);

  return [state, setState];
}
`;
    content = content.replace("export const PokethologyCombatMissionWidget", hookCode + "\nexport const PokethologyCombatMissionWidget");
}

fs.writeFileSync('src/components/PokethologyCombatMissionWidget.tsx', content);
