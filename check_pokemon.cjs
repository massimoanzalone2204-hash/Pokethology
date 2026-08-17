const fs = require('fs');

async function checkMegas() {
  const fakeMegasMap = {
    'lucario-mega-z': 'lucario-mega',
    'garchomp-mega-z': 'garchomp-mega',
    'absol-mega-z': 'absol-mega',
    'zygarde-mega': 'zygarde-complete',
    'greninja-mega': 'greninja',
    'delphox-mega': 'delphox',
    'chesnaught-mega': 'chesnaught',
    'raichu-mega-x': 'raichu',
    'raichu-mega-y': 'raichu',
    'malamar-mega': 'malamar',
    'pyroar-mega': 'pyroar',
    'dragalge-mega': 'dragalge',
    'barbaracle-mega': 'barbaracle',
    'scrafty-mega': 'scrafty',
    'eelektross-mega': 'eelektross',
    'scolipede-mega': 'scolipede',
    'hawlucha-mega': 'hawlucha',
    'falinks-mega': 'falinks',
    'heatran-mega': 'heatran',
    'darkrai-mega': 'darkrai',
    'golisopod-mega': 'golisopod',
    'magearna-mega': 'magearna',
    'magearna-original-mega': 'magearna-original',
    'zeraora-mega': 'zeraora',
    'baxcalibur-mega': 'baxcalibur',
    'staraptor-mega': 'staraptor'
  };

  const results = [];

  for (const [mega, original] of Object.entries(fakeMegasMap)) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${mega}`);
      if (res.ok) {
        const data = await res.json();
        
        let hasAbilities = data.abilities && data.abilities.length > 0;
        let hasMoves = data.moves && data.moves.length > 0;
        let hasArtwork = data.sprites?.other?.['official-artwork']?.front_default != null;
        let hasShowdown = data.sprites?.other?.showdown?.front_default != null;

        results.push({
          name: mega,
          status: 'exists',
          hasAbilities,
          hasMoves,
          hasArtwork,
          hasShowdown,
          stats: data.stats.map(s => s.base_stat).reduce((a,b)=>a+b, 0),
          types: data.types.map(t => t.type.name).join('/')
        });
      } else {
        results.push({ name: mega, status: 'not found' });
      }
    } catch (e) {
      results.push({ name: mega, status: 'error', error: e.message });
    }
  }
  
  console.log(JSON.stringify(results, null, 2));
}

checkMegas();
