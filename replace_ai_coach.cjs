const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startIdx = code.indexOf('{/* AI Coach Tactical Advice Panel - Displayed directly inside the Combat Arena */}');
const endIdx = code.indexOf('<div className={cn("flex flex-col justify-center", !isBattling ? "flex-1" : "flex-initial mt-4")}>');

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find AI Coach block");
  process.exit(1);
}

const replacement = `
                                     {/* AI Coach Tactical Advice Panel - Displayed directly inside the Combat Arena */}
                                     {isBattling && (isAiSuggesting || battleSuggestion) && (
                                       <motion.div 
                                         initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                         animate={{ opacity: 1, scale: 1, y: 0 }}
                                         className="bg-slate-950/95 rounded-xl border border-purple-500/30 p-3 sm:p-4 text-[10px] sm:text-[11px] leading-relaxed relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.15)] select-text my-2"
                                       >
                                         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
                                         <div className="flex justify-between items-center mb-2 border-b border-purple-900/40 pb-2">
                                           <div className="flex items-center gap-1.5">
                                             <div className={cn("w-1.5 h-1.5 rounded-full", isAiSuggesting ? "bg-purple-400 animate-pulse shadow-[0_0_8px_rgba(192,132,252,0.6)]" : "bg-purple-500")} />
                                             <span className="text-[10px] font-black uppercase tracking-[0.15em] font-hud text-purple-300">
                                               Grandmaster Tactical Advisor
                                              </span>
                                            </div>
                                            <button 
                                              onClick={() => setBattleSuggestion(null)}
                                              className="text-[8px] font-hud bg-purple-950/40 border border-purple-900/50 hover:bg-purple-900/60 text-purple-400 hover:text-purple-300 transition-colors uppercase font-bold px-2 py-0.5 rounded cursor-pointer"
                                            >
                                              DISMISS
                                            </button>
                                          </div>
                                          
                                          {isAiSuggesting ? (
                                            <div className="py-4 flex flex-col items-center justify-center gap-2">
                                              <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                                              <span className="text-[9px] font-mono text-purple-400/80 uppercase tracking-widest animate-pulse">Running Neural Simulation...</span>
                                            </div>
                                          ) : (
                                            <div className="text-purple-100 font-sans text-[11px] leading-relaxed select-text space-y-2 pr-1 markdown-body prose prose-invert prose-p:text-purple-100 prose-headings:text-purple-300 prose-strong:text-purple-300">
                                              <Markdown>
                                                {battleSuggestion || ""}
                                              </Markdown>
                                            </div>
                                          )}
                                       </motion.div>
                                     )}
                                      `;

code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
fs.writeFileSync('src/App.tsx', code);
console.log("Replaced AI Coach!");
