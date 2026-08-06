(async () => {
  const p2 = await fetch('https://pokeapi.co/api/v2/pokemon/tatsugiri-droopy').then(r => r.json());
  console.log("RAW tatsugiri-droopy official:", p2.sprites?.other?.['official-artwork']?.front_default);
  console.log("RAW tatsugiri-droopy home:", p2.sprites?.other?.home?.front_default);
})();
