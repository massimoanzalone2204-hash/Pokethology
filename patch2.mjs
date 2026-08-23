import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Undo first one
content = content.replace(
  '<AudioSettings mode="simple" />\n\n                    <div className="pt-4 border-t border-cyan-500/20">\n                      <div className="flex items-center justify-between">\n                        <div className="flex flex-col gap-1">\n                          <span className="text-amber-400 font-hud uppercase text-[10px] font-bold tracking-widest flex items-center gap-1.5">\n                            <Trophy className="w-3.5 h-3.5" />\n                            Pokéthology Mission\n                          </span>\n                          <span className="text-slate-400 text-[9px] max-w-[200px]">Track your overall combat mastery progress.</span>\n                        </div>\n                        <button\n                          onClick={() => {\n                            setIsMusicOpen(false);\n                            setIsMissionModalOpen(true);\n                          }}\n                          className="px-4 py-2 rounded-xl font-hud uppercase text-[10px] font-bold tracking-widest transition-all bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"\n                        >\n                          Personalize\n                        </button>\n                      </div>\n                    </div>',
  '<AudioSettings mode="simple" />'
);

// Apply to second one
content = content.replace(
  '<AudioSettings mode="simple" />',
  `<AudioSettings mode="simple" />\n\n                    <div className="pt-4 border-t border-cyan-500/20">\n                      <div className="flex items-center justify-between">\n                        <div className="flex flex-col gap-1">\n                          <span className="text-amber-400 font-hud uppercase text-[10px] font-bold tracking-widest flex items-center gap-1.5">\n                            <Trophy className="w-3.5 h-3.5" />\n                            Pokéthology Mission\n                          </span>\n                          <span className="text-slate-400 text-[9px] max-w-[200px]">Track your overall combat mastery progress.</span>\n                        </div>\n                        <button\n                          onClick={() => {\n                            setIsMusicOpen(false);\n                            setIsMissionModalOpen(true);\n                          }}\n                          className="px-4 py-2 rounded-xl font-hud uppercase text-[10px] font-bold tracking-widest transition-all bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"\n                        >\n                          Personalize\n                        </button>\n                      </div>\n                    </div>`
); // The replace function replaces the first occurrence, which is now the second one since the first was restored.

fs.writeFileSync('src/App.tsx', content);
