import { searchPokemon } from './src/lib/api';

async function test() {
  const p = await searchPokemon('greninja-mega');
  console.log("Greninja Mega moves:", p.moves.length);
  console.log("Greninja Mega description:", p.description);
  console.log("Greninja Mega art:", p.sprites.other?.['official-artwork']?.front_default);
}
test();
