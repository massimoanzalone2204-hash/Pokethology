const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const hookStr = `  const [isMoveLearningOpen, setIsMoveLearningOpen] = useState(false);`;
const hookReplacement = `  const [isMoveLearningOpen, setIsMoveLearningOpen] = useState(false);
  const [actionAfterMoveLearn, setActionAfterMoveLearn] = useState<'rematch' | 'new_battle' | null>(null);

  const handlePostBattleAction = (action: 'rematch' | 'new_battle') => {
    setBattleResult(null); // Remove victory/defeat interface
    if (pokemon) {
      const currentSelectedMoves = selectedMovesRef.current;
      const potentialMoves = pokemon.moves.filter(m => 
        !currentSelectedMoves.some(sm => sm.name === m.name)
      );
      
      if (potentialMoves.length > 0) {
        const shuffled = [...potentialMoves].sort(() => 0.5 - Math.random());
        const offered = shuffled.slice(0, Math.min(3, shuffled.length));
        setOfferedMoves(offered);
        setActionAfterMoveLearn(action);
        setIsMoveLearningOpen(true);
        setIsReplacingMove(false);
        return;
      }
    }
    // If no moves to learn, execute immediately
    if (action === 'rematch') {
      sounds.battleStart();
      setIsBattling(false);
      setBattleState('setup');
      setTimeout(() => runBattle(), 100);
    } else {
      resetSimulation();
    }
  };

  const finalizeMoveLearn = () => {
    setIsMoveLearningOpen(false);
    if (actionAfterMoveLearn === 'rematch') {
      sounds.battleStart();
      setIsBattling(false);
      setBattleState('setup');
      setTimeout(() => runBattle(), 100);
    } else if (actionAfterMoveLearn === 'new_battle') {
      resetSimulation();
    }
    setActionAfterMoveLearn(null);
  };`;
code = code.replace(hookStr, hookReplacement);

fs.writeFileSync('src/App.tsx', code, 'utf8');
