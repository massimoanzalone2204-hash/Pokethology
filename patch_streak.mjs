import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold whitespace-nowrap shadow-sm">
                      {today}
                    </span>`;

const replacement = `                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 text-[10px] sm:text-xs font-mono font-bold whitespace-nowrap shadow-sm">
                      {today}
                    </span>
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="ml-1 sm:ml-2 px-2.5 py-0.5 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-400 text-[10px] sm:text-xs font-hud font-bold whitespace-nowrap shadow-[0_0_10px_rgba(249,115,22,0.3)] flex items-center gap-1.5"
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1], 
                          rotate: [-3, 3, -3],
                          filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] 
                        }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-orange-500 text-orange-400" />
                      </motion.div>
                      <span>{dailyStreak} DAY{dailyStreak !== 1 ? 'S' : ''}</span>
                    </motion.div>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
