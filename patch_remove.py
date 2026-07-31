import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Pattern 1: Base EXP removal
pattern1 = r'<div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs font-sans shrink-0 w-full max-w-md mx-auto mb-4">.*?<p className=\{cn\("mb-0\.5 uppercase tracking-wider text-\[9px\] sm:text-\[10px\] font-bold", isLightMode \? "text-slate-500" : "text-slate-400"\)\}>Base EXP</p>.*?</div>\s*</div>\s*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">'

replacement1 = """<div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs font-sans shrink-0 w-full max-w-md mx-auto mb-4">
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
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">"""

content, n1 = re.subn(pattern1, replacement1, content, flags=re.DOTALL)
print(f"Replaced {n1} instances of Base EXP")

# Pattern 2: EV removal
pattern2 = r'<div className="flex flex-col items-end shrink-0 w-12 sm:w-16">\s*<span className=\{cn\("text-right text-\[10px\] sm:text-\[12px\] font-mono shrink-0", isLightMode \? "text-slate-800 font-bold" : "text-cyan-300 font-black"\)\}>\{s\.base_stat\}</span>\s*\{s\.effort > 0 && \(\s*<span className=\{cn\("text-\[8px\] font-bold uppercase tracking-tighter leading-none mt-0\.5", isLightMode \? "text-amber-600" : "text-amber-400"\)\}>\+\{s\.effort\} EV</span>\s*\)\}\s*</div>'

replacement2 = r'<span className={cn("w-8 sm:w-10 text-right text-[10px] sm:text-[12px] font-mono shrink-0", isLightMode ? "text-slate-800 font-bold" : "text-cyan-300 font-black")}>{s.base_stat}</span>'

content, n2 = re.subn(pattern2, replacement2, content)
print(f"Replaced {n2} instances of EV")

with open('src/App.tsx', 'w') as f:
    f.write(content)
