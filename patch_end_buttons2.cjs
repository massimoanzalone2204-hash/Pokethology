const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetButtons = `                                            <button
                                              onClick={() => {
                                                sounds.battleStart();
                                                setIsBattling(false);
                                                setBattleState('setup');
                                                setTimeout(() => {
                                                  runBattle();
                                                }, 100);
                                              }}
                                              className="w-full py-3 bg-green-900/40 hover:bg-green-800/60 text-green-300 font-hud rounded-lg border border-green-500/40 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 relative overflow-hidden active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.1)] cursor-pointer animate-btn-entrance btn-breathe-cyan"
                                            >
                                              <HUDCorners />
                                              <RefreshCw className="w-3.5 h-3.5" />
                                              REMATCH NOW
                                            </button>
                                            <button
                                              onClick={resetSimulation}
                                              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-hud rounded-lg border border-slate-700 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 cursor-pointer animate-btn-entrance"
                                            >
                                              <RotateCcw className="w-3.5 h-3.5" />
                                              CHOOSE NEW BATTLE
                                            </button>`;

const newButtons = `                                            <button
                                              onClick={() => handlePostBattleAction('rematch')}
                                              className="w-full py-3 bg-green-900/40 hover:bg-green-800/60 text-green-300 font-hud rounded-lg border border-green-500/40 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 relative overflow-hidden active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.1)] cursor-pointer animate-btn-entrance btn-breathe-cyan"
                                            >
                                              <HUDCorners />
                                              <RefreshCw className="w-3.5 h-3.5" />
                                              REMATCH NOW
                                            </button>
                                            <button
                                              onClick={() => handlePostBattleAction('new_battle')}
                                              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-hud rounded-lg border border-slate-700 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 cursor-pointer animate-btn-entrance"
                                            >
                                              <RotateCcw className="w-3.5 h-3.5" />
                                              CHOOSE NEW BATTLE
                                            </button>`;

code = code.replace(targetButtons, newButtons);
fs.writeFileSync('src/App.tsx', code, 'utf8');
