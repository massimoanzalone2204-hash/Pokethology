import { searchPokemon } from './src/lib/api';

async function test() {
  const p = await searchPokemon('dialga-origin');
  console.log("Dialga Origin moves:", p.moves.length);
  console.log("Dialga Origin description:", p.description);
  console.log("Dialga Origin art:", p.sprites.other?.['official-artwork']?.front_default);
}
test();
