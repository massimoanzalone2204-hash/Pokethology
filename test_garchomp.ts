import { searchPokemon } from './src/lib/api.js';
(async () => {
  const p = await searchPokemon('lucario-mega-z');
  console.log("Lucario-mega-z official:", !!p.sprites?.other?.['official-artwork']?.front_default);
  console.log("Lucario-mega-z home:", !!p.sprites?.other?.home?.front_default);
  const m = await searchPokemon('garchomp-mega');
  console.log("Garchomp-mega official:", !!m.sprites?.other?.['official-artwork']?.front_default);
  console.log("Garchomp-mega home:", !!m.sprites?.other?.home?.front_default);
})();
