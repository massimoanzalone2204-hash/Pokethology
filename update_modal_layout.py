import re
with open('src/App.tsx', 'r') as f:
    text = f.read()

target = """                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                  {/* Left Side: Avatar Details & Default Save */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] bg-slate-950/80 p-6 sm:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-cyan-900/50 shrink-0 z-10 shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
                    
                    <div className="relative w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56 mx-auto mb-6 bg-slate-900/50 rounded-full flex items-center justify-center border-4 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] group">
                      <div className="absolute inset-0 rounded-full bg-cyan-400/5 animate-pulse" />
                      <img 
                        src={`https://play.pokemonshowdown.com/sprites/trainers/${currentAvatar.id}.png`} 
                        alt={currentAvatar.name}
                        className="w-28 h-28 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-hud font-black text-center text-cyan-300 uppercase tracking-[0.2em] mb-2 drop-shadow-lg">
                      {currentAvatar.name}
                    </h3>
                    <div className="text-sm sm:text-base lg:text-lg text-emerald-400 font-bold uppercase tracking-widest text-center mb-6 py-1 px-4 border border-emerald-500/30 bg-emerald-950/30 rounded-full self-center">
                      {currentAvatar.role}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 mb-6">
                      <p className="text-base sm:text-lg lg:text-xl font-serif italic text-slate-300 leading-relaxed opacity-90 text-center lg:text-left">
                        "{currentAvatar.lore}"
                      </p>
                    </div>

                    <button"""

replacement = """                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                  {/* Left Side: Avatar Details & Default Save */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] max-h-[45vh] lg:max-h-none bg-slate-950/80 p-4 sm:p-6 lg:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-cyan-900/50 shrink-0 z-10 shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
                    
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-56 lg:h-56 mx-auto mb-3 sm:mb-6 bg-slate-900/50 rounded-full flex items-center justify-center border-4 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] group shrink-0">
                      <div className="absolute inset-0 rounded-full bg-cyan-400/5 animate-pulse" />
                      <img 
                        src={`https://play.pokemonshowdown.com/sprites/trainers/${currentAvatar.id}.png`} 
                        alt={currentAvatar.name}
                        className="w-20 h-20 sm:w-28 sm:h-28 lg:w-48 lg:h-48 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 sm:pr-4 flex flex-col">
                      <h3 className="text-xl sm:text-3xl lg:text-5xl font-hud font-black text-center text-cyan-300 uppercase tracking-[0.2em] mb-1.5 sm:mb-2 drop-shadow-lg shrink-0">
                        {currentAvatar.name}
                      </h3>
                      <div className="text-xs sm:text-sm lg:text-lg text-emerald-400 font-bold uppercase tracking-widest text-center mb-3 sm:mb-6 py-0.5 sm:py-1 px-3 sm:px-4 border border-emerald-500/30 bg-emerald-950/30 rounded-full self-center shrink-0">
                        {currentAvatar.role}
                      </div>

                      <p className="text-sm sm:text-base lg:text-xl font-serif italic text-slate-300 leading-relaxed opacity-90 text-center lg:text-left mb-4 sm:mb-6">
                        "{currentAvatar.lore}"
                      </p>
                    </div>

                    <button"""

text = text.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(text)
