const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace opponent size
const targetOpponent = `className="relative h-28 w-28 xs:h-32 xs:w-32 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-64 lg:w-64 xl:h-72 xl:w-72 flex items-center justify-center max-h-[45vh]"`;
const repOpponent = `className="relative h-28 w-28 xs:h-32 xs:w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-52 lg:w-52 xl:h-56 xl:w-56 flex items-center justify-center max-h-[40vh]"`;
code = code.replace(targetOpponent, repOpponent);

// Replace player size
const targetPlayer = `className="relative h-32 w-32 xs:h-36 xs:w-36 sm:h-52 sm:w-52 md:h-60 md:w-60 lg:h-72 lg:w-72 xl:h-80 xl:w-80 flex items-center justify-center max-h-[45vh]"`;
const repPlayer = `className="relative h-32 w-32 xs:h-36 xs:w-36 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-64 lg:w-64 xl:h-72 xl:w-72 flex items-center justify-center max-h-[40vh]"`;
code = code.replace(targetPlayer, repPlayer);

fs.writeFileSync('src/App.tsx', code, 'utf8');
