const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `}, [pokemonMaxHP, opponentMaxHP, pokemonStatus, opponentStatus, pokemonFlinched, opponentFlinched, pokemon, battleOpponent, selectedMoves, opponentMoves, playerStatStages, opponentStatStages, enableAnimations, battleSpeed, delay, addFloatingText, getEffectiveStat, getTypeEffectiveness, isAnimating, customStats, turnNumber]);`;
const replacement = `}, [pokemonMaxHP, opponentMaxHP, pokemonStatus, opponentStatus, pokemonFlinched, opponentFlinched, pokemon, battleOpponent, selectedMoves, opponentMoves, playerStatStages, opponentStatStages, enableAnimations, battleSpeed, delay, addFloatingText, getEffectiveStat, getTypeEffectiveness, isAnimating, customStats, turnNumber, pokemonHP, opponentHP]);`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Fixed executeMove dependencies!");
} else {
    console.log("Could not find dependencies.");
}
