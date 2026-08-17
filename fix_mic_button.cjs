const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `<button
                                               onClick={() => { sounds.scan(); setPendingAction('flee'); setShowExitConfirmation(true); }}`;

const replacement = `<div className="flex items-center gap-2">
                                            <button
                                               onClick={toggleVoiceCommand}
                                               title="Voice Command"
                                               className={cn("py-1 px-3 rounded text-[9px] border active:scale-95 font-hud font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-colors",
                                                  isListening ? "bg-cyan-950/80 border-cyan-500/80 text-cyan-400 animate-pulse" : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80"
                                               )}
                                             >
                                               {isListening ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />} VOICE
                                             </button>
                                            <button
                                               onClick={() => { sounds.scan(); setPendingAction('flee'); setShowExitConfirmation(true); }}`;

code = code.replace(target, replacement);

const target2 = `FLEE
                                             </button>
                                          </div>`;

const replacement2 = `FLEE
                                             </button>
                                            </div>
                                          </div>`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', code);
