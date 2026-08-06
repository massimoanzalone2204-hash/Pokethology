const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const lines = code.split('\n');

const startIdx = lines.findIndex((l, i) => i > 7000 && l.includes('{/* Action Bar (Mobile & Desktop) */}'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('</div> {/* End of arenaRef Container */}'));

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find boundaries", startIdx, endIdx);
  process.exit(1);
}

const replacement = `
                                      {/* Action Bar (Mobile & Desktop) */}
                                      <AnimatePresence>
                                         {isBattling && turn === 'player' && !isAnimating && (
                                        <motion.div
                                           key="battle-action-bar-holder"
                                           initial={{ opacity: 0, y: 25, scale: 0.98 }}
                                           animate={{ opacity: 1, y: 0, scale: 1 }}
                                           exit={{ opacity: 0, y: 25, scale: 0.98 }}
                                           transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                                           className="mt-2 sm:mt-4 shrink-0 w-full bg-slate-950/60 backdrop-blur-sm rounded-xl p-2 border border-cyan-500/20 shadow-xl relative z-20 flex flex-col gap-2"
                                         >
                                          <HUDCorners />
                                          <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-[0.2em] font-bold">Combat Actions</span>
                                            <button
                                               onClick={() => { sounds.scan(); setPendingAction('flee'); setShowExitConfirmation(true); }}
                                               onMouseEnter={() => sounds.hover()}
                                               className="py-1 px-3 rounded text-[9px] border border-red-900/40 bg-red-950/40 text-red-400 hover:text-red-300 hover:bg-red-900/30 hover:border-red-500/30 active:scale-95 font-hud font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                                             >
                                               FLEE
                                             </button>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2 relative z-10 w-full">
                                            {selectedMoves.map(move => {
                                              const opponentTypes = battleOpponent?.types?.map((t: any) => t.type.name) || [];
                                              const effectiveness = getTypeEffectiveness(move.type, opponentTypes);
                                              
                                              let effectivenessLabel = '';
                                              let effectivenessBadgeColor = 'bg-slate-800 border-slate-700 text-slate-400';
                                              if (effectiveness > 1) {
                                                effectivenessLabel = \`x\${effectiveness}\`;
                                                effectivenessBadgeColor = 'bg-green-950/80 border-green-500/30 text-green-400';
                                              } else if (effectiveness < 1 && effectiveness > 0) {
                                                effectivenessLabel = \`x\${effectiveness}\`;
                                                effectivenessBadgeColor = 'bg-red-950/80 border-red-500/30 text-red-400';
                                              } else if (effectiveness === 0) {
                                                effectivenessLabel = \`x0\`;
                                                effectivenessBadgeColor = 'bg-slate-900 border-slate-850 text-slate-500';
                                              }
                                              const isOutOfPP = (move.currentPP ?? move.pp) === 0;
                                              
                                              return (
                                                <button
                                                  key={move.name}
                                                  onClick={() => {
                                                    if (!isOutOfPP) {
                                                      handlePlayerMove(move);
                                                      setIsCombatMoveModalOpen(false);
                                                    }
                                                  }}
                                                  onMouseEnter={() => sounds.hover()}
                                                  disabled={isOutOfPP}
                                                  className={cn(
                                                    "w-full text-left p-2 rounded-lg border transition-all relative overflow-hidden flex flex-col gap-1 cursor-pointer",
                                                    (move.name === recommendedMove) && "ring-1 ring-yellow-400 ring-offset-1 ring-offset-slate-950 shadow-[0_0_10px_rgba(250,204,21,0.25)]",
                                                    isOutOfPP
                                                       ? "bg-slate-950/60 text-slate-600 border-slate-900/60 cursor-not-allowed opacity-40"
                                                       : cn(
                                                          "hover:scale-[1.02] active:scale-98 shadow-sm",
                                                          typeColors[move.type]
                                                             ? \`\${typeColors[move.type]} border-white/10 hover:border-white/30 text-white\`
                                                             : "bg-slate-900 border-cyan-900/40 hover:border-cyan-500/60 text-cyan-300 hover:text-white"
                                                        )
                                                  )}
                                                >
                                                  {move.name === recommendedMove && (
                                                    <div className="absolute top-0 right-0 bg-yellow-400 text-slate-950 text-[6px] font-hud font-black px-1.5 py-0.5 rounded-bl uppercase tracking-widest shadow">
                                                      ★ REC
                                                    </div>
                                                  )}
                                                  <div className="flex justify-between items-start w-full gap-1">
                                                    <div className="flex flex-col min-w-0">
                                                      <span className="text-[9px] sm:text-[10px] font-hud font-black uppercase tracking-wider truncate">
                                                        {move.name.replace('-', ' ')}
                                                      </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                      {effectivenessLabel && (
                                                        <span className={cn("text-[7px] font-mono font-bold px-1 rounded border uppercase", effectivenessBadgeColor)}>
                                                          {effectivenessLabel}
                                                        </span>
                                                      )}
                                                      {move.power && (
                                                        <span className="text-[7px] font-mono font-bold bg-black/30 px-1 rounded border border-white/10">
                                                          {move.power}
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <div className="flex items-center justify-between w-full">
                                                    <span className="text-[7px] font-mono opacity-80 uppercase">
                                                      {move.type}
                                                    </span>
                                                    <span className={cn(
                                                      "text-[7px] font-mono font-bold",
                                                      isOutOfPP ? "text-red-500" : "text-white/80"
                                                    )}>
                                                      PP {move.currentPP ?? move.pp}/{move.pp}
                                                    </span>
                                                  </div>
                                                </button>
                                              );
                                            })}
                                          </div>
                                         </motion.div>
                                       )}
                                      </AnimatePresence>
`;

lines.splice(startIdx, endIdx - startIdx, replacement);
fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log("Replaced action bar!");
