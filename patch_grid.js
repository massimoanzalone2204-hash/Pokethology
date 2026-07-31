const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `{/* Abilities */}
                                    <div className={cn(
                                      "rounded-xl p-4 border-2 shadow-[0_4px_22px_rgba(0,0,0,0.03)]",
                                      isLightMode ? "bg-white border-slate-200" : "bg-slate-950/60 border-cyan-900/40 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                    )}>`;
const replacement = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Abilities */}
                                    <div className={cn(
                                      "rounded-xl p-4 border-2 shadow-[0_4px_22px_rgba(0,0,0,0.03)]",
                                      isLightMode ? "bg-white border-slate-200" : "bg-slate-950/60 border-cyan-900/40 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                    )}>`;

code = code.replace(target, replacement);

const target2 = `                                    {/* Weaknesses */}
                                    <div className={cn(
                                      "rounded-xl p-4 border-2 shadow-[0_4px_22px_rgba(0,0,0,0.03)]",
                                      isLightMode ? "bg-white border-slate-200" : "bg-slate-950/60 border-cyan-900/40 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                    )}>`;
const replacement2 = `                                    {/* Weaknesses */}
                                    <div className={cn(
                                      "rounded-xl p-4 border-2 shadow-[0_4px_22px_rgba(0,0,0,0.03)]",
                                      isLightMode ? "bg-white border-slate-200" : "bg-slate-950/60 border-cyan-900/40 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                                    )}>`;

// Now we need to close the grid after weaknesses
const target3 = `                                        )}
                                      </div>
                                    </div>

                                    {/* Combat HUD */}`;

// Wait, is there a comment for Combat HUD? Let's check what is after weaknesses.
