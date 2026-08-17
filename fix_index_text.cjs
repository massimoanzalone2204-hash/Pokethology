const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const t1 = `<p className="font-serif italic text-[11px] xxs:text-[12px] xs:text-[13px] sm:text-sm md:text-base lg:text-lg text-cyan-400 select-none px-2 mt-2 tracking-wider whitespace-normal min-[380px]:whitespace-nowrap overflow-visible">
                            "Where dreams and adventures begin!"
                          </p>`;
const t2 = `<p className="text-cyan-500/70 font-mono text-[9.5px] xxs:text-[10px] xs:text-[11.5px] sm:text-[12px] md:text-[13px] lg:text-sm uppercase tracking-[0.18em] xs:tracking-[0.25em] max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto leading-relaxed px-4 break-words mt-3">
                            Advanced Biological Database & Combat Simulation Environment
                          </p>`;

code = code.replace(t1, "");
code = code.replace(t2, "");

// Also in the header:
const t3 = `<span className="text-[6.5px] xxs:text-[7.5px] xs:text-[9.5px] sm:text-[11px] font-bold tracking-wide xs:tracking-widest text-cyan-500/90 font-hud uppercase mt-1.5 block animate-pulse whitespace-normal min-[350px]:whitespace-nowrap overflow-visible">
                                    Where dreams and adventures begin!
                                  </span>`;
code = code.replace(t3, "");

fs.writeFileSync('src/App.tsx', code);
console.log("Deleted extra text!");
