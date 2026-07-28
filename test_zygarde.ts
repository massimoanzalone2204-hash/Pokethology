import { searchPokemon } from './src/lib/api';

async function test() {
  const p = await searchPokemon('zygarde-complete');
  console.log("Zygarde Complete moves:", p.moves.length);
  console.log("Zygarde Complete description:", p.description);
  console.log("Zygarde Complete art:", p.sprites.other?.['official-artwork']?.front_default);
}
test();
