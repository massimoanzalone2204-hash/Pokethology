import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

old_block = """                    {isInstallable && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleInstallPWA();
                          sounds.scan(); playHaptic('light');
                        }}
                        className="flex items-center justify-between p-3.5 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/50 hover:border-cyan-400 rounded-xl transition-all group w-full text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Download className="w-4 h-4 shrink-0 text-cyan-400 group-hover:scale-110 transition-transform animate-bounce" />
                          <div className="flex flex-col text-left">
                            <span className="font-hud text-[9px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Install App (PWA)</span>
                            <span className="text-[8px] sm:text-[9px] font-mono text-cyan-400/80 leading-none mt-0.5">Install Pokéthology locally on your device</span>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono text-cyan-300 group-hover:text-white uppercase tracking-widest bg-cyan-900/60 px-2.5 py-1 rounded border border-cyan-500/40">
                          Install
                        </span>
                      </motion.button>
                    )}"""

new_block = """                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleInstallPWA();
                          sounds.scan(); playHaptic('light');
                        }}
                        className="flex items-center justify-between p-3.5 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/50 hover:border-cyan-400 rounded-xl transition-all group w-full text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Download className="w-4 h-4 shrink-0 text-cyan-400 group-hover:scale-110 transition-transform animate-bounce" />
                          <div className="flex flex-col text-left">
                            <span className="font-hud text-[9px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Install App (PWA)</span>
                            <span className="text-[8px] sm:text-[9px] font-mono text-cyan-400/80 leading-none mt-0.5">Install Pokéthology locally on your device</span>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono text-cyan-300 group-hover:text-white uppercase tracking-widest bg-cyan-900/60 px-2.5 py-1 rounded border border-cyan-500/40">
                          {isInstallable ? 'Install' : 'View'}
                        </span>
                      </motion.button>"""

if old_block in text:
    text = text.replace(old_block, new_block)
    with open('src/App.tsx', 'w') as f:
        f.write(text)
    print("Patched App.tsx")
else:
    print("Could not find block in App.tsx")
