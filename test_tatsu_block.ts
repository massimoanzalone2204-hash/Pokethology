import { searchPokemon } from './src/lib/api.js';
(async () => {
  try {
    const p = await searchPokemon('tatsugiri-curly-mega');
    console.log(p.name, !!p);
  } catch (e) {
    console.error(e.message);
  }
  
  try {
    const p2 = await searchPokemon('tatsugiri-droopy-mega');
    console.log(p2.name, !!p2);
  } catch (e) {
    console.error(e.message);
  }
})();
