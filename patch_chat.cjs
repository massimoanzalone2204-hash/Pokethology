const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add HUDCorners to chat container
code = code.replace(
  `                                    <div className={cn(
                                      "flex-1 rounded-xl border overflow-hidden flex flex-col relative",
                                      isLightMode ? "bg-white border-slate-200" : "bg-slate-950/95 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                                    )}>
                                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />`,
  `                                    <div className={cn(
                                      "flex-1 rounded-xl border overflow-hidden flex flex-col relative min-h-0",
                                      isLightMode ? "bg-white border-slate-200" : "bg-slate-950/95 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                                    )}>
                                      <HUDCorners className="opacity-40" />
                                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />`
);

// 2. Animate incoming messages using motion.div
code = code.replace(
  `                                        {chatMessages.map((msg, i) => (
                                          <div key={i} className="flex w-full gap-2.5 flex-row py-2 relative z-10 border-b border-cyan-900/20 last:border-0">`,
  `                                        {chatMessages.map((msg, i) => (
                                          <motion.div 
                                            key={i} 
                                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="flex w-full gap-2.5 flex-row py-2 relative z-10 border-b border-cyan-900/20 last:border-0"
                                          >`
);

code = code.replace(
  `                                              )}
                                            </div>
                                          </div>
                                        ))}
                                        {isChatLoading && <Loader2 className="w-4 h-4 animate-spin text-cyan-500 mx-auto" /> }`,
  `                                              )}
                                            </div>
                                          </motion.div>
                                        ))}
                                        {isChatLoading && (
                                          <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex items-center justify-center gap-2 py-4"
                                          >
                                            <div className="flex gap-1">
                                              {[0, 1, 2].map(i => (
                                                <motion.div
                                                  key={i}
                                                  className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                                                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                                />
                                              ))}
                                            </div>
                                            <span className="text-[8px] font-hud text-cyan-500/70 tracking-widest uppercase">Processing Request...</span>
                                          </motion.div>
                                        )}`
);

// Fix chat end ref
code = code.replace(
  `                                        {isChatLoading && <Loader2 className="w-4 h-4 animate-spin text-cyan-500 mx-auto" /> }`,
  ``
); // In case it wasn't caught by the above

fs.writeFileSync('src/App.tsx', code, 'utf8');
