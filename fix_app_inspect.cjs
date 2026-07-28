const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldOnInspect = `          onInspect={() => {
            setInspectingOpponent(true);
            setActiveTab('data');
            setBattleState('setup');
            setIsBattling(false);
            sounds.scan();
          }}`;

const newOnInspect = `          onInspect={() => {
            setInspectingOpponent(true);
            setActiveTab('data');
            setBattleState('setup');
            setIsBattling(false);
            
            // Reset Arena Status
            setPokemonHP(pokemonMaxHP);
            setOpponentHP(opponentMaxHP);
            setPokemonStatus(null);
            setOpponentStatus(null);
            setPokemonFlinched(false);
            setOpponentFlinched(false);
            setPlayerStatStages({ attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0, evasion: 0, accuracy: 0 });
            setOpponentStatStages({ attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0, evasion: 0, accuracy: 0 });
            setBattleLog([]);
            
            sounds.scan();
          }}`;

code = code.replace(oldOnInspect, newOnInspect);
fs.writeFileSync('src/App.tsx', code);
