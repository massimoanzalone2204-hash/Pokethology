const name = "charizard-gmax";
const validVersions = [];
if (name.includes('-gmax')) validVersions.push('sword', 'shield');
else if (name.includes('-mega')) validVersions.push('x', 'y', 'omega-ruby', 'alpha-sapphire', 'sun', 'moon', 'ultra-sun', 'ultra-moon', 'lets-go-pikachu', 'lets-go-eevee');
else if (name.includes('-alola')) validVersions.push('sun', 'moon', 'ultra-sun', 'ultra-moon', 'lets-go-pikachu', 'lets-go-eevee', 'sword', 'shield', 'scarlet', 'violet');
else if (name.includes('-galar')) validVersions.push('sword', 'shield', 'scarlet', 'violet');
else if (name.includes('-hisui')) validVersions.push('legends-arceus', 'scarlet', 'violet');
else if (name.includes('-paldea')) validVersions.push('scarlet', 'violet');

console.log(validVersions);
