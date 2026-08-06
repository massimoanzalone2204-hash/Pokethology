import { searchPokemon } from './src/lib/api';

async function test() {
  const p = await searchPokemon('zacian-crowned');
  console.log("Zacian Crowned moves:", p.moves.length);
  console.log("Zacian Crowned description:", p.description);
  console.log("Zacian Crowned art:", p.sprites.other?.['official-artwork']?.front_default);
}
test();
