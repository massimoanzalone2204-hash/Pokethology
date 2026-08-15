const fs = require('fs');

let content = fs.readFileSync('src/components/PokethologyCombatMissionWidget.tsx', 'utf8');

const regex = /function usePersistentState.*?return \[state, setState\];\n}\n/gs;
const matches = content.match(regex);

if (matches && matches.length > 1) {
    content = content.replace(matches[0], '');
    fs.writeFileSync('src/components/PokethologyCombatMissionWidget.tsx', content);
}
