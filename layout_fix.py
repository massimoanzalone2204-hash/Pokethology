with open('src/App.tsx', 'r') as f:
    text = f.read()

target = """                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-cyan-900/50 bg-slate-900/80 shrink-0">
                  <div className="flex items-center gap-4">
                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                    <h2 className="font-hud text-xl sm:text-2xl lg:text-3xl font-black text-cyan-300 tracking-widest">SELECT AVATAR</h2>
                  </div>
                  <button
                    onClick={() => { setIsAvatarModalOpen(false); try { sounds.scan(); playHaptic('light'); } catch(e){} }}
                    className="p-3 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full transition-colors group"
                  >
                    <X className="w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
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

                    <button
                      onClick={() => {
                        try {
                          localStorage.setItem('pokethology_user_avatar', currentAvatar.id);
                          sounds.scan(); playHaptic('light');
                          setIsAvatarModalOpen(false);
                        } catch(e) {}
                      }}
                      className="w-full py-4 sm:py-5 px-6 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 rounded-xl sm:rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-1 text-sm sm:text-base lg:text-lg"
                    >
                      <Bookmark className="w-5 h-5 sm:w-6 sm:h-6" />
                      Set as Default
                    </button>
                  </div>"""

replacement = """                <div className="flex items-center justify-between p-3 sm:p-5 lg:p-6 border-b border-cyan-900/50 bg-slate-900/80 shrink-0">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <User className="w-5 h-5 sm:w-8 sm:h-8 text-cyan-400" />
                    <h2 className="font-hud text-lg sm:text-2xl lg:text-3xl font-black text-cyan-300 tracking-widest">SELECT AVATAR</h2>
                  </div>
                  <button
                    onClick={() => { setIsAvatarModalOpen(false); try { sounds.scan(); playHaptic('light'); } catch(e){} }}
                    className="p-2 sm:p-3 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full transition-colors group"
                  >
                    <X className="w-5 h-5 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                  {/* Left Side: Avatar Details & Default Save */}
                  <div className="w-full lg:w-[400px] xl:w-[450px] bg-slate-950/80 p-3 sm:p-5 lg:p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-cyan-900/50 shrink-0 z-10 shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none" />
                    
                    <div className="flex flex-row lg:flex-col items-center lg:items-stretch gap-3 lg:gap-0 h-full mb-3 lg:mb-0">
                      {/* Avatar Image */}
                      <div className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-56 lg:h-56 mx-auto mb-0 lg:mb-6 bg-slate-900/50 rounded-full flex items-center justify-center border-4 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.15)] group shrink-0">
                        <div className="absolute inset-0 rounded-full bg-cyan-400/5 animate-pulse" />
                        <img 
                          src={`https://play.pokemonshowdown.com/sprites/trainers/${currentAvatar.id}.png`} 
                          alt={currentAvatar.name}
                          className="w-16 h-16 sm:w-24 sm:h-24 lg:w-48 lg:h-48 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Avatar Details */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 lg:pr-4 flex flex-col max-h-[22vh] lg:max-h-none">
                        <h3 className="text-base sm:text-2xl lg:text-5xl font-hud font-black text-left lg:text-center text-cyan-300 uppercase tracking-[0.2em] mb-1 sm:mb-2 drop-shadow-lg shrink-0">
                          {currentAvatar.name}
                        </h3>
                        <div className="text-[9px] sm:text-xs lg:text-lg text-emerald-400 font-bold uppercase tracking-widest text-center mb-1.5 sm:mb-6 py-0.5 sm:py-1 px-2 sm:px-4 border border-emerald-500/30 bg-emerald-950/30 rounded-full self-start lg:self-center shrink-0">
                          {currentAvatar.role}
                        </div>

                        <p className="text-[11px] sm:text-sm lg:text-xl font-serif italic text-slate-300 leading-relaxed opacity-90 text-left lg:text-center lg:text-left mb-1 sm:mb-6">
                          "{currentAvatar.lore}"
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        try {
                          localStorage.setItem('pokethology_user_avatar', currentAvatar.id);
                          sounds.scan(); playHaptic('light');
                          setIsAvatarModalOpen(false);
                        } catch(e) {}
                      }}
                      className="w-full mt-1 lg:mt-auto py-2.5 sm:py-4 lg:py-5 px-4 sm:px-6 bg-emerald-600 hover:bg-emerald-500 text-emerald-50 rounded-lg sm:rounded-xl lg:rounded-2xl font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 lg:hover:-translate-y-1 text-xs sm:text-sm lg:text-lg shrink-0"
                    >
                      <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                      Set as Default
                    </button>
                  </div>"""

text = text.replace(target, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(text)
print("Updated successfully")
