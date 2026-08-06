import { searchPokemon } from './src/lib/api';

async function test() {
  const p = await searchPokemon('zygarde-mega');
  console.log("Zygarde Mega moves:", p.moves.length);
  console.log("Zygarde Mega description:", p.description);
  console.log("Zygarde Mega art:", p.sprites.other?.['official-artwork']?.front_default);
}
test();
