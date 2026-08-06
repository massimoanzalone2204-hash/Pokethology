import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace unsafe pokemon.name accesses inside JSX with optional chaining where appropriate
// We'll just replace 'pokemon.name' with 'pokemon?.name' ignoring where it's already 'pokemon?.name'
content = content.replace(/pokemon\.name/g, 'pokemon?.name');
content = content.replace(/pokemon\?\.\?\./g, 'pokemon?.'); // fix any double optional chains we might create
content = content.replace(/battleOpponent\.name/g, 'battleOpponent?.name');
content = content.replace(/battleOpponent\?\.\?\./g, 'battleOpponent?.');

fs.writeFileSync('src/App.tsx', content);

console.log("Replaced safely!");
