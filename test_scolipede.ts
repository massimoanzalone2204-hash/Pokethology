import { searchPokemon } from './src/lib/api';

async function test() {
  const p = await searchPokemon('scolipede-mega');
  console.log("Scolipede Mega moves:", p.moves.length);
}
test();
