(async () => {
  const p1 = await fetch('https://pokeapi.co/api/v2/pokemon/tatsugiri-curly').then(r => r.json());
  const p2 = await fetch('https://pokeapi.co/api/v2/pokemon/tatsugiri-droopy').then(r => r.json());
  console.log("curly official:", p1.sprites?.other?.['official-artwork']?.front_default);
  console.log("droopy official:", p2.sprites?.other?.['official-artwork']?.front_default);
})();
