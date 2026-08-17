const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We need to find the useEffect that checks pokemonHP and opponentHP, and remove the setTimeout that calls setIsMoveLearningOpen.
const startRegex = /if \(pokemonHP <= 0\) \{/g;
