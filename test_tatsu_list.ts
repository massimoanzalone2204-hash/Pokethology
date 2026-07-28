import { getPokemonList } from './src/lib/api.js';
(async () => {
  const p = await getPokemonList(978, 978);
  console.log(p.map(x => x.name));
})();
