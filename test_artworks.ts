import { searchPokemon } from './src/lib/api';

async function test() {
  const list = ['lucario-mega-z', 'zygarde-mega', 'greninja-mega', 'delphox-mega', 'chesnaught-mega'];
  for (const n of list) {
    const p = await searchPokemon(n);
    console.log(n, p.sprites.other?.['official-artwork']?.front_default);
  }
}
test();
