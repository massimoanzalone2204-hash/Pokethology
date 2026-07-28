import { searchPokemon } from './src/lib/api.js';
(async () => {
  try {
    const p = await searchPokemon('tatsugiri-stretchy-mega');
    console.log(p.name, !!p);
  } catch (e) {
    console.error(e);
  }
})();
