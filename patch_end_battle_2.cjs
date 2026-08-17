const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `        setTimeout(() => {
          if (pokemon) {
            const currentSelectedMoves = selectedMovesRef.current;
            const potentialMoves = pokemon.moves.filter(m => 
              !currentSelectedMoves.some(sm => sm.name === m.name)
            );
            
            if (potentialMoves.length > 0) {
              // Offer up to 3 random moves
              const shuffled = [...potentialMoves].sort(() => 0.5 - Math.random());
              const offered = shuffled.slice(0, Math.min(3, shuffled.length));
              setOfferedMoves(offered);
              setIsMoveLearningOpen(true);
              setIsReplacingMove(false);
            }
          }
        }, 3000); // slightly longer delay for defeat`;

code = code.replace(target1, '');

const target2 = `        // Simulate learning a new move after victory
        setTimeout(() => {
          if (pokemon) {
            const currentSelectedMoves = selectedMovesRef.current;
            const potentialMoves = pokemon.moves.filter(m => 
              !currentSelectedMoves.some(sm => sm.name === m.name)
            );
            
            if (potentialMoves.length > 0) {
              // Offer up to 3 random moves
              const shuffled = [...potentialMoves].sort(() => 0.5 - Math.random());
              const offered = shuffled.slice(0, Math.min(3, shuffled.length));
              setOfferedMoves(offered);
              setIsMoveLearningOpen(true);
              setIsReplacingMove(false);
            }
          }
        }, 2000);`;

code = code.replace(target2, '');

fs.writeFileSync('src/App.tsx', code, 'utf8');
