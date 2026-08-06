const getAllFormsList = async () => {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000');
  const data = await res.json();
  return data.results;
};
(async () => {
  const forms = await getAllFormsList();
  const tatsu = forms.filter(f => f.name.includes('tatsugiri'));
  console.log(tatsu);
})();
