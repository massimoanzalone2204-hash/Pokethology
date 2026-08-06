const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `                                        className="relative flex-1 flex flex-col justify-center min-h-[220px] xs:min-h-[260px] sm:min-h-[340px] md:min-h-[380px] lg:min-h-[400px] h-[360px] sm:h-[420px] lg:h-[440px] z-10 p-[clamp(0.5rem,2vw,1.5rem)] font-bold overflow-visible aspect-video"
                                        style={{ aspectRatio: '16/9', touchAction: 'pan-y', boxSizing: 'border-box', minHeight: '220px' }}`;

const replacement1 = `                                        className="relative flex-1 flex flex-col justify-center min-h-[220px] xs:min-h-[260px] sm:min-h-[300px] md:min-h-[320px] lg:min-h-[340px] h-[300px] sm:h-[340px] lg:h-[380px] max-h-[40vh] z-10 p-[clamp(0.5rem,2vw,1.5rem)] font-bold overflow-visible w-full"
                                        style={{ touchAction: 'pan-y', boxSizing: 'border-box' }}`;

code = code.replace(target1, replacement1);

// Also let's check the container around it
const target2 = `                                        <div 
                                          ref={arenaRef}
                                          className="flex-1 bg-slate-900/80 backdrop-blur-md border-b border-white/5 relative shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col mb-2 overflow-visible w-full h-auto min-h-[350px] z-10"
                                        >`;

const replacement2 = `                                        <div 
                                          ref={arenaRef}
                                          className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl relative shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col mb-4 overflow-visible w-full h-auto z-10"
                                        >`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', code, 'utf8');
