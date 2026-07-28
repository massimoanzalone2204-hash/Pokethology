const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

// 1. Remove the global Battle Result Modal
let mStart = lines.findIndex(l => l.includes('{/* Battle Result Modal */}'));
if (mStart !== -1) {
  let mEnd = mStart;
  while (mEnd < lines.length && !lines[mEnd].includes('        {/* Settings Modal */}')) {
    mEnd++;
  }
  lines.splice(mStart, mEnd - mStart);
}

// 2. Remove the useEffect that triggers the modal
let effectStart = lines.findIndex(l => l.includes('if (battleState === \'finished\') {'));
if (effectStart !== -1) {
  lines.splice(effectStart - 1, 8); // Should remove the useEffect
}

// 3. Update the arena rendering logic
let target = "                                      ) : battleState === 'finished' ? (\n" +
             "                                        null\n" +
             "                                      ) : false ? (";

let replacement = `                                      ) : battleState === 'finished' ? (
                                        <motion.div
                                          key="arena-finished"
                                          initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95, y: -15 }}
                                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                          className={cn("p-4 rounded-xl border-2 shadow-2xl relative overflow-hidden", 
                                            battleResult === 'victory' 
                                              ? (isLightMode ? "bg-green-50 border-green-400 shadow-green-500/20" : "bg-green-950/90 border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)]")
                                              : (isLightMode ? "bg-red-50 border-red-400 shadow-red-500/20" : "bg-red-950/90 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]")
                                          )}
                                        >
                                          <div className="text-center space-y-4 relative z-10">
                                            <h2 className={cn("font-hud font-black text-2xl uppercase tracking-widest", 
                                              battleResult === 'victory' ? "text-green-500" : "text-red-500"
                                            )}>
                                              {battleResult === 'victory' ? "Victory" : "Defeat"}
                                            </h2>
                                            <p className={cn("font-mono text-sm uppercase tracking-wider", isLightMode ? "text-slate-600" : "text-slate-300")}>
                                              {battleResult === 'victory' 
                                                ? \`\${pokemon?.name?.toUpperCase()} fainted the opponent!\` 
                                                : \`\${pokemon?.name?.toUpperCase()} has fainted.\`}
                                            </p>
                                            
                                            <div className="pt-4 flex justify-center">
                                              <button
                                                onClick={() => { setBattleState('setup'); }}
                                                className={cn("px-6 py-2 rounded font-hud font-black uppercase tracking-widest text-sm transition-all",
                                                  battleResult === 'victory' 
                                                    ? "bg-green-500 text-white hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                                                    : "bg-red-500 text-white hover:bg-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                                )}
                                              >
                                                Return to Arena
                                              </button>
                                            </div>
                                          </div>
                                        </motion.div>
                                      ) : false ? (`;

let fullText = lines.join('\n');
fullText = fullText.replace(target, replacement);

fs.writeFileSync('src/App.tsx', fullText);
console.log("Replaced modal with inline arena result");
