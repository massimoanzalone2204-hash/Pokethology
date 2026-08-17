const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove the old IIFE for battleState === 'finished' overlay (6952 to 7154 roughly)
let lines = text.split('\n');
let startIdx = lines.findIndex(l => l.includes("{battleState === 'finished' && (() => {"));
if (startIdx !== -1) {
  let endIdx = startIdx;
  while (endIdx < lines.length && !lines[endIdx].includes("})()}")) {
    endIdx++;
  }
  lines.splice(startIdx, endIdx - startIdx + 1);
  text = lines.join('\n');
}

// 2. Add import for BattleResultScreen
text = text.replace("import { motion, AnimatePresence } from 'framer-motion';", 
  "import { motion, AnimatePresence } from 'framer-motion';\nimport { BattleResultScreen } from './components/BattleResultScreen';");

// 3. Render BattleResultScreen outside the main flow.
// We can put it right before the Exit Confirmation Modal.
const modalTrigger = `        {/* Battle Result Modal */}
        <BattleResultScreen
          isOpen={battleState === 'finished'}
          battleResult={battleResult}
          pokemon={pokemon}
          battleOpponent={battleOpponent}
          battleLog={battleLog}
          turnNumber={turnNumber}
          pokemonHP={pokemonHP}
          opponentHP={opponentHP}
          pokemonMaxHP={pokemonMaxHP}
          opponentMaxHP={opponentMaxHP}
          pokemonStatus={pokemonStatus}
          opponentStatus={opponentStatus}
          isLightMode={isLightMode}
          onRematch={() => {
            sounds.battleStart();
            setIsBattling(false);
            setBattleState('setup');
            setTimeout(() => {
              runBattle();
            }, 100);
          }}
          onInspect={() => {
            setInspectingOpponent(true);
            setActiveTab('data');
            setBattleState('setup');
            setIsBattling(false);
            sounds.scan();
          }}
          onNewBattle={() => {
            resetSimulation();
          }}
        />

`;
text = text.replace('{/* Settings Modal */}', modalTrigger + '        {/* Settings Modal */}');

// 4. Change inline battleState === 'finished' ? null to false (it already is actually, wait let's check)
// At 7731: `) : battleState === 'finished' ? (`
let lines2 = text.split('\n');
let sIdx = lines2.findIndex(l => l.includes(") : battleState === 'finished' ? ("));
if (sIdx !== -1) {
  let eIdx = sIdx;
  while (eIdx < lines2.length && !lines2[eIdx].includes(") : false ? (")) {
    eIdx++;
  }
  lines2.splice(sIdx, eIdx - sIdx); // remove this inline chunk completely
  text = lines2.join('\n');
}

fs.writeFileSync('src/App.tsx', text);
console.log("App.tsx updated");
