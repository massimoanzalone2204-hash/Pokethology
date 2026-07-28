import { searchPokemon } from './src/lib/api';

async function test() {
  const p = await searchPokemon('mewtwo-mega-x');
  console.log("Mewtwo Mega X moves:", p.moves.length);
  console.log("Mewtwo Mega X description:", p.description);
  console.log("Mewtwo Mega X art:", p.sprites.other?.['official-artwork']?.front_default);
  
  const z = await searchPokemon('charizard-mega-x');
  console.log("Charizard Mega X moves:", z.moves.length);
  console.log("Charizard Mega X description:", z.description);
}
test();
