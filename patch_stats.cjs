const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `<div className="flex justify-center gap-4 text-xs font-sans shrink-0 w-full max-w-sm mx-auto">
                                      <div className={cn(
                                        "flex-1 p-2 sm:p-3 rounded-xl text-center border shadow-sm transition-colors flex flex-col items-center justify-center gap-1",
                                        isLightMode
                                           ? "bg-white border-slate-200"
                                           : "bg-slate-900/40 border-slate-800"
                                      )}>
                                        <p className={cn("mb-0.5 uppercase tracking-wider text-[10px] font-bold", isLightMode ? "text-slate-500" : "text-slate-400")}>Weight</p>
                                        <p className={cn("text-[13px] sm:text-[14px] font-bold leading-none", isLightMode ? "text-slate-800" : "text-slate-200")}>{(pokemon.weight / 10).toFixed(1)} KG</p>
                                        <p className={cn("text-[10px] text-slate-500 leading-none")}>{((pokemon.weight / 10) * 2.20462).toFixed(1)} lbs</p>
                                      </div>
                                      <div className={cn(
                                        "flex-1 p-2 sm:p-3 rounded-xl text-center border shadow-sm transition-colors flex flex-col items-center justify-center gap-1",
                                        isLightMode
                                           ? "bg-white border-slate-200"
                                           : "bg-slate-900/40 border-slate-800"
                                      )}>
                                        <p className={cn("mb-0.5 uppercase tracking-wider text-[10px] font-bold", isLightMode ? "text-slate-500" : "text-slate-400")}>Height</p>
                                        <p className={cn("text-[13px] sm:text-[14px] font-bold leading-none", isLightMode ? "text-slate-800" : "text-slate-200")}>{(pokemon.height / 10).toFixed(1)} M</p>
                                        <p className={cn("text-[10px] text-slate-500 leading-none")}>{Math.floor((pokemon.height / 10) * 3.28084)}'{Math.round(((pokemon.height / 10) * 3.28084 - Math.floor((pokemon.height / 10) * 3.28084)) * 12)}"</p>
                                      </div>
                                    </div>
                                    <div className="flex justify-center gap-4 text-xs font-sans shrink-0 w-full max-w-sm mx-auto my-4"><div className={cn("flex-1 p-2 sm:p-3 rounded-xl text-center border shadow-sm transition-colors flex flex-col items-center justify-center gap-1", isLightMode ? "bg-white border-slate-200" : "bg-slate-900/40 border-slate-800")}><p className={cn("mb-0.5 uppercase tracking-wider text-[9px] font-bold whitespace-nowrap", isLightMode ? "text-slate-500" : "text-slate-400")}>Base EXP</p><p className={cn("text-[12px] sm:text-[13px] font-bold leading-none", isLightMode ? "text-slate-800" : "text-slate-200")}>{pokemon.base_experience || "N/A"}</p></div><div className={cn("flex-1 p-2 sm:p-3 rounded-xl text-center border shadow-sm transition-colors flex flex-col items-center justify-center gap-1", isLightMode ? "bg-white border-slate-200" : "bg-slate-900/40 border-slate-800")}><p className={cn("mb-0.5 uppercase tracking-wider text-[9px] font-bold whitespace-nowrap", isLightMode ? "text-slate-500" : "text-slate-400")}>Catch Rate</p><p className={cn("text-[12px] sm:text-[13px] font-bold leading-none", isLightMode ? "text-slate-800" : "text-slate-200")}>{pokemon.capture_rate || "N/A"}</p></div><div className={cn("flex-1 p-2 sm:p-3 rounded-xl text-center border shadow-sm transition-colors flex flex-col items-center justify-center gap-1", isLightMode ? "bg-white border-slate-200" : "bg-slate-900/40 border-slate-800")}><p className={cn("mb-0.5 uppercase tracking-wider text-[9px] font-bold whitespace-nowrap", isLightMode ? "text-slate-500" : "text-slate-400")}>Growth Rate</p><p className={cn("text-[11px] sm:text-[12px] font-bold leading-none capitalize", isLightMode ? "text-slate-800" : "text-slate-200")}>{pokemon.growth_rate ? pokemon.growth_rate.replace("-", " ") : "N/A"}</p></div></div>{/* Abilities */}`;

const replacement = `<div className="flex justify-center gap-4 text-xs font-sans shrink-0 w-full max-w-md mx-auto mb-4">
                                      <div className={cn(
                                        "flex-1 p-2 sm:p-3 rounded-xl text-center border shadow-sm transition-colors flex flex-col items-center justify-center gap-1",
                                        isLightMode
                                           ? "bg-white border-slate-200"
                                           : "bg-slate-900/40 border-slate-800"
                                      )}>
                                        <p className={cn("mb-0.5 uppercase tracking-wider text-[10px] font-bold", isLightMode ? "text-slate-500" : "text-slate-400")}>Weight</p>
                                        <p className={cn("text-[13px] sm:text-[14px] font-bold leading-none", isLightMode ? "text-slate-800" : "text-slate-200")}>{(pokemon.weight / 10).toFixed(1)} KG</p>
                                        <p className={cn("text-[10px] text-slate-500 leading-none")}>{((pokemon.weight / 10) * 2.20462).toFixed(1)} lbs</p>
                                      </div>
                                      <div className={cn(
                                        "flex-1 p-2 sm:p-3 rounded-xl text-center border shadow-sm transition-colors flex flex-col items-center justify-center gap-1",
                                        isLightMode
                                           ? "bg-white border-slate-200"
                                           : "bg-slate-900/40 border-slate-800"
                                      )}>
                                        <p className={cn("mb-0.5 uppercase tracking-wider text-[10px] font-bold", isLightMode ? "text-slate-500" : "text-slate-400")}>Height</p>
                                        <p className={cn("text-[13px] sm:text-[14px] font-bold leading-none", isLightMode ? "text-slate-800" : "text-slate-200")}>{(pokemon.height / 10).toFixed(1)} M</p>
                                        <p className={cn("text-[10px] text-slate-500 leading-none")}>{Math.floor((pokemon.height / 10) * 3.28084)}'{Math.round(((pokemon.height / 10) * 3.28084 - Math.floor((pokemon.height / 10) * 3.28084)) * 12)}"</p>
                                      </div>
                                      <div className={cn(
                                        "flex-1 p-2 sm:p-3 rounded-xl text-center border shadow-sm transition-colors flex flex-col items-center justify-center gap-1",
                                        isLightMode
                                           ? "bg-white border-slate-200"
                                           : "bg-slate-900/40 border-slate-800"
                                      )}>
                                        <p className={cn("mb-0.5 uppercase tracking-wider text-[10px] font-bold", isLightMode ? "text-slate-500" : "text-slate-400")}>Base EXP</p>
                                        <p className={cn("text-[13px] sm:text-[14px] font-bold leading-none", isLightMode ? "text-slate-800" : "text-slate-200")}>{pokemon.base_experience || "N/A"}</p>
                                        <p className={cn("text-[10px] text-slate-500 leading-none opacity-0")}>XP</p>
                                      </div>
                                    </div>
                                    {/* Abilities */}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Success');
} else {
  console.log('Target not found');
}
