import re

with open('src/components/BattleResultScreen.tsx', 'r') as f:
    text = f.read()

# I want to extract the three buttons and reorder them.
rematch_btn = """            <button
              onClick={onRematch}
              className={cn(
                "flex-1 sm:flex-initial min-w-[95px] sm:min-w-[120px] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl font-hud font-black uppercase tracking-wider text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg active:scale-95 cursor-pointer whitespace-nowrap",
                isVictory 
                  ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/30"
                  : "bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/30"
              )}
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Rematch
            </button>"""

inspect_btn = """            <button
              onClick={onInspect}
              className={cn(
                "flex-1 sm:flex-initial min-w-[95px] sm:min-w-[120px] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl font-hud font-black uppercase tracking-wider text-xs sm:text-sm transition-all border flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-black/10 active:scale-95 cursor-pointer font-bold whitespace-nowrap",
                isLightMode ? "border-slate-400 bg-white text-slate-800 hover:bg-slate-50" : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
              )}
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Inspect Data
            </button>"""

new_inspect_btn = """            <button
              onClick={onInspect}
              className={cn(
                "flex-1 sm:flex-initial min-w-[95px] sm:min-w-[120px] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl font-hud font-black uppercase tracking-wider text-xs sm:text-sm transition-all border flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-black/10 active:scale-95 cursor-pointer font-bold whitespace-nowrap",
                isLightMode ? "border-slate-400 bg-white text-slate-800 hover:bg-slate-50" : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
              )}
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Inspect
            </button>"""

arena_btn = """            <button
              onClick={onNewBattle}
              className={cn(
                "flex-1 sm:flex-initial min-w-[95px] sm:min-w-[120px] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl font-hud font-black uppercase tracking-wider text-xs sm:text-sm transition-all border flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-black/10 active:scale-95 cursor-pointer font-bold whitespace-nowrap",
                isLightMode ? "border-slate-400 bg-white text-slate-800 hover:bg-slate-50" : "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
              )}
            >
              Arena <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>"""

# Find the block
start_idx = text.find(rematch_btn)
if start_idx == -1:
    print("Could not find rematch btn")
end_idx = text.find(arena_btn) + len(arena_btn)

# replace the block with the reordered version
new_block = new_inspect_btn + "\n\n" + rematch_btn + "\n\n" + arena_btn
text = text[:start_idx] + new_block + text[end_idx:]

with open('src/components/BattleResultScreen.tsx', 'w') as f:
    f.write(text)

print("Buttons reordered successfully!")
