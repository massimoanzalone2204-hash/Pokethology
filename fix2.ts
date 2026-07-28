import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/pokemon\?\.name\.includes/g, 'pokemon?.name?.includes');
content = content.replace(/pokemon\?\.name\.split/g, 'pokemon?.name?.split');
content = content.replace(/pokemon\?\.name\.localeCompare/g, 'pokemon?.name?.localeCompare');
content = content.replace(/pokemon\?\.name\.toUpperCase/g, 'pokemon?.name?.toUpperCase');
content = content.replace(/pokemon\?\.name\.replace/g, 'pokemon?.name?.replace');
content = content.replace(/pokemon\?\.name\.endsWith/g, 'pokemon?.name?.endsWith');
content = content.replace(/pokemon\?\.name\.toLowerCase/g, 'pokemon?.name?.toLowerCase');

content = content.replace(/battleOpponent\?\.name\.includes/g, 'battleOpponent?.name?.includes');
content = content.replace(/battleOpponent\?\.name\.split/g, 'battleOpponent?.name?.split');
content = content.replace(/battleOpponent\?\.name\.localeCompare/g, 'battleOpponent?.name?.localeCompare');
content = content.replace(/battleOpponent\?\.name\.toUpperCase/g, 'battleOpponent?.name?.toUpperCase');
content = content.replace(/battleOpponent\?\.name\.replace/g, 'battleOpponent?.name?.replace');
content = content.replace(/battleOpponent\?\.name\.endsWith/g, 'battleOpponent?.name?.endsWith');
content = content.replace(/battleOpponent\?\.name\.toLowerCase/g, 'battleOpponent?.name?.toLowerCase');

// Let's also fix pokeData?.name.includes and similar
content = content.replace(/pokeData\?\.name\.includes/g, 'pokeData?.name?.includes');
content = content.replace(/pokeData\?\.name\.toUpperCase/g, 'pokeData?.name?.toUpperCase');

fs.writeFileSync('src/App.tsx', content);

console.log("Fixed chained methods!");
