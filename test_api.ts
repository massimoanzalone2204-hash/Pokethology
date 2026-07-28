import { searchPokemon } from './src/lib/api.js';
(async () => {
  const p = await searchPokemon('lucario-mega-z');
  console.log("Abilities:", p.abilities.length);
  console.log("Moves:", p.moves.length);
  console.log("Cries:", !!p.cries);
  console.log("Stats:", p.stats.length);
  console.log("Types:", p.types.length);
})();
