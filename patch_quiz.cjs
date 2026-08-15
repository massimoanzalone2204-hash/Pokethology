const fs = require('fs');

const content = fs.readFileSync('src/components/PokethologyQuizWidget.tsx', 'utf8');
const lines = content.split('\n');

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

let newContent = content;
if (!newContent.includes('usePersistentState')) {
  newContent = newContent.replace("export const PokethologyQuizWidget: React.FC = memo(() => {", hookCode + "\nexport const PokethologyQuizWidget: React.FC = memo(() => {");
}

newContent = newContent.replace(/const \[userAnswersMap, setUserAnswersMap\] = useState<Record<string, number>>\({}\);/, "const [userAnswersMap, setUserAnswersMap] = usePersistentState<Record<string, number>>(`pokethology_quiz_answers_${new Date().toISOString().split('T')[0]}`, {});");
newContent = newContent.replace(/const \[selectedOptionMap, setSelectedOptionMap\] = useState<Record<string, number>>\({}\);/, "const [selectedOptionMap, setSelectedOptionMap] = usePersistentState<Record<string, number>>(`pokethology_quiz_selected_${new Date().toISOString().split('T')[0]}`, {});");
newContent = newContent.replace(/const \[lockedMap, setLockedMap\] = useState<Record<string, boolean>>\({}\);/, "const [lockedMap, setLockedMap] = usePersistentState<Record<string, boolean>>(`pokethology_quiz_locked_${new Date().toISOString().split('T')[0]}`, {});");

fs.writeFileSync('src/components/PokethologyQuizWidget.tsx', newContent);
