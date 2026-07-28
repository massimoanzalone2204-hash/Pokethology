const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `className="relative flex-1 flex flex-col justify-center min-h-[220px] xs:min-h-[260px] sm:min-h-[300px] md:min-h-[320px] lg:min-h-[340px] h-[300px] sm:h-[340px] lg:h-[380px] max-h-[40vh] z-10 p-[clamp(0.5rem,2vw,1.5rem)] font-bold overflow-visible w-full"
                                        style={{ touchAction: 'pan-y', boxSizing: 'border-box' }}`;
const rep = `className="relative flex-1 flex flex-col justify-center min-h-[220px] xs:min-h-[260px] sm:min-h-[300px] md:min-h-[320px] lg:min-h-[340px] h-[300px] sm:h-[340px] lg:h-[380px] max-h-[40vh] z-10 p-[clamp(0.5rem,2vw,1.5rem)] font-bold overflow-visible w-full"
                                        style={{ touchAction: 'none', boxSizing: 'border-box' }}`;

code = code.replace(target, rep);
fs.writeFileSync('src/App.tsx', code, 'utf8');
