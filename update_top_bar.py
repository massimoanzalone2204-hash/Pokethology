import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

old_code = """                          {/* Top Bar */}
                          <div className="flex justify-between items-center mb-4 mt-4 sm:mt-6 border-b border-white/5 pb-3 px-1 shrink-0 z-10 relative">
                            <div className="flex items-center gap-3">
                              <div className="w-2.5 h-2.5 rounded bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]"></div>
                              <span className="font-hud text-[10px] font-black sm:text-xs text-slate-300 uppercase tracking-[0.3em]">Analysis Mode</span>
                            </div>"""

new_code = """                          {/* Top Bar */}
                          <div className="flex justify-between items-center mb-4 mt-4 sm:mt-6 border-b border-white/5 pb-3 px-1 shrink-0 z-10 relative">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-cyan-500/40 bg-slate-900/60 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                <img 
                                  src={`https://play.pokemonshowdown.com/sprites/trainers/${currentAvatar.id}.png`} 
                                  alt={currentAvatar.name}
                                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain [image-rendering:pixelated] mt-2"
                                />
                              </div>
                              <span className="font-hud text-xs font-black sm:text-sm text-cyan-300 uppercase tracking-[0.2em]">{currentAvatar.name}</span>
                            </div>"""

if old_code in text:
    text = text.replace(old_code, new_code)
    with open('src/App.tsx', 'w') as f:
        f.write(text)
    print("Replaced successfully.")
else:
    print("Could not find the target code in src/App.tsx.")
