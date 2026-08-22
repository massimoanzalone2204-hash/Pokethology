import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

target = """                                <button
                                  onClick={() => { setIsAvatarModalOpen(true); try { sounds.boot() } catch(e){} }}
                                  className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-cyan-500/50 hover:border-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/60 transition-all flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] group"
                                  title="Change Avatar"
                                >
                                  <img 
                                    src={`https://play.pokemonshowdown.com/sprites/trainers/${currentAvatar.id}.png`} 
                                    alt={currentAvatar.name}
                                    className="w-10 h-10 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform [image-rendering:pixelated]"
                                  />
                                  <div className="absolute -bottom-1 sm:-bottom-1.5 -right-1 sm:-right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full border-2 border-[#020617] flex items-center justify-center shadow-[0_0_6px_rgba(16,185,129,0.8)]">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                                  </div>
                                </button>"""

replacement = """                                <button
                                  onClick={() => { setIsAvatarModalOpen(true); try { sounds.boot() } catch(e){} }}
                                  className="relative flex items-center justify-center shrink-0 group hover:scale-105 active:scale-95 transition-transform"
                                  title="Change Avatar"
                                >
                                  <img 
                                    src={`https://play.pokemonshowdown.com/sprites/trainers/${currentAvatar.id}.png`} 
                                    alt={currentAvatar.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_5px_15px_rgba(34,211,238,0.5)] [image-rendering:pixelated]"
                                  />
                                </button>"""

if target in text:
    text = text.replace(target, replacement)
    with open('src/App.tsx', 'w') as f:
        f.write(text)
    print("Replaced!")
else:
    print("Target not found.")

