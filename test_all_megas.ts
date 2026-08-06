fetch('https://pokeapi.co/api/v2/pokemon?limit=10000').then(r=>r.json()).then(async d => {
  const megas = d.results.filter(p => p.name.includes('-mega'));
  for (const m of megas) {
    const res = await fetch(m.url);
    const data = await res.json();
    if (data.moves.length === 0) {
      console.log(m.name, "has 0 moves!");
    }
  }
  console.log("Done checking megas.");
});
