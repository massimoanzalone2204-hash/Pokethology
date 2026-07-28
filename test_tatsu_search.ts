import { searchPokemon } from './src/lib/api.js';
(async () => {
  try {
    const p = await searchPokemon('tatsugiri');
    console.log(p.name);
  } catch (e) {
    console.error(e);
  }
})();
