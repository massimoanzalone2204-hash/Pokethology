import { searchPokemon } from './src/lib/api';

async function test() {
  const p = await searchPokemon('lucario-mega-z');
  console.log("Lucario Mega Z moves:", p.moves.length);
  console.log("Lucario Mega Z description:", p.description);
  console.log("Lucario Mega Z art:", p.sprites.other?.['official-artwork']?.front_default);
  console.log("Art URL status:", await fetch(p.sprites.other?.['official-artwork']?.front_default || "").then(r=>r.status));
}
test();
