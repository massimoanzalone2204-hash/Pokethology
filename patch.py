import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

pattern = r'<div className="flex justify-center gap-4 text-xs font-sans shrink-0 w-full max-w-sm mx-auto">.*?</div></div>{/\* Abilities \*/}'
replacement = """<div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs font-sans shrink-0 w-full max-w-md mx-auto mb-4">
                                      <div className={cn(
                                        "p-2 sm:p-3 rounded-xl text-center border shadow-sm transition-colors flex flex-col items-center justify-center gap-1",
                                        isLightMode
                                           ? "bg-white border-slate-200"
                                           : "bg-slate-900/40 border-slate-800"
                                      )}>
                                        <p className={cn("mb-0.5 uppercase tracking-wider text-[9px] sm:text-[10px] font-bold", isLightMode ? "text-slate-500" : "text-slate-400")}>Weight</p>
                                        <p className={cn("text-[12px] sm:text-[14px] font-bold leading-none", isLightMode ? "text-slate-800" : "text-slate-200")}>{(pokemon.weight / 10).toFixed(1)} KG</p>
                                        <p className={cn("text-[9px] sm:text-[10px] text-slate-500 leading-none")}>{((pokemon.weight / 10) * 2.20462).toFixed(1)} lbs</p>
                                      </div>
                                      <div className={cn(
                                        "p-2 sm:p-3 rounded-xl text-center border shadow-sm transition-colors flex flex-col items-center justify-center gap-1",
                                        isLightMode
                                           ? "bg-white border-slate-200"
                                           : "bg-slate-900/40 border-slate-800"
                                      )}>
                                        <p className={cn("mb-0.5 uppercase tracking-wider text-[9px] sm:text-[10px] font-bold", isLightMode ? "text-slate-500" : "text-slate-400")}>Height</p>
                                        <p className={cn("text-[12px] sm:text-[14px] font-bold leading-none", isLightMode ? "text-slate-800" : "text-slate-200")}>{(pokemon.height / 10).toFixed(1)} M</p>
                                        <p className={cn("text-[9px] sm:text-[10px] text-slate-500 leading-none")}>{Math.floor((pokemon.height / 10) * 3.28084)}'{Math.round(((pokemon.height / 10) * 3.28084 - Math.floor((pokemon.height / 10) * 3.28084)) * 12)}"</p>
                                      </div>
                                      <div className={cn(
                                        "p-2 sm:p-3 rounded-xl text-center border shadow-sm transition-colors flex flex-col items-center justify-center gap-1",
                                        isLightMode
                                           ? "bg-white border-slate-200"
                                           : "bg-slate-900/40 border-slate-800"
                                      )}>
                                        <p className={cn("mb-0.5 uppercase tracking-wider text-[9px] sm:text-[10px] font-bold", isLightMode ? "text-slate-500" : "text-slate-400")}>Base EXP</p>
                                        <p className={cn("text-[13px] sm:text-[14px] font-bold leading-none", isLightMode ? "text-slate-800" : "text-slate-200")}>{pokemon.base_experience || "N/A"}</p>
                                        <p className={cn("text-[9px] sm:text-[10px] text-slate-500 leading-none opacity-0")}>XP</p>
                                      </div>
                                    </div>
                                    {/* Abilities */}"""
content, n = re.subn(pattern, replacement, content, flags=re.DOTALL)
if n > 0:
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print(f"Success, replaced {n} instances")
else:
    print("Pattern not found")
