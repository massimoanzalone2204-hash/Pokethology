import re

with open('src/components/Tutorial.tsx', 'r') as f:
    text = f.read()

# Replace DAILY & UTILITIES with DAILY
text = text.replace("daily: 'DAILY & UTILITIES'", "daily: 'DAILY'")

# Extract the pokethology section to replace it
new_pokethology_content = """          {/* TAB: POKÉTHOLOGY CHATBOT */}
          {activeTab === 'pokethology' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 max-w-2xl mx-auto"
            >
              {/* Banner Incipit */}
              <div className="p-4 bg-purple-950/25 border-l-4 border-purple-500 rounded-r-xl space-y-2 text-left relative overflow-hidden">
                <h3 className="font-hud font-black text-purple-400 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400 animate-pulse" /> Pokéthology AI Assistant
                </h3>
                <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                  The Pokéthology AI Assistant is a specialized, open-domain neural assistant powered by Gemini AI. While deeply knowledgeable about competitive formats, it is fully equipped to answer any query spanning the entire Pokémon universe.
                </p>
              </div>

              {/* HUD Feature Cards */}              
              <div className="grid grid-cols-1 gap-3 text-left">
                {/* Omniscient Conversational Engine */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-purple-950 rounded-full border border-purple-500/50 group-hover:rotate-12 transition-transform shrink-0">
                    <Globe className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-purple-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Universal Pokémon Knowledge Base
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Ask anything. From identifying obscure anime episodes and detailing manga arcs, to explaining core game mechanics and breeding algorithms, the assistant handles unrestricted franchise queries.
                    </p>
                  </div>
                </div>

                {/* Tactical & Competitive */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-purple-950 rounded-full border border-purple-500/50 group-hover:scale-110 transition-transform shrink-0">
                    <Crosshair className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-purple-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Dynamic Team Structuring & Synergy
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Request bespoke team compositions, theoretical strategy breakdowns, optimal EV/IV spreads, counter-picks against specific metagame threats, or full VGC rule analysis.
                    </p>
                  </div>
                </div>

                {/* Lore, Ecology & Mythology */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-purple-950 rounded-full border border-purple-500/50 group-hover:-rotate-12 transition-transform shrink-0">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-purple-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Deep Lore, Mythology & Ecology
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Explore the rich narrative of the Pokémon world. Discover detailed physiological adaptations, historical mythologies surrounding Legendary Pokémon, and canonical regional phenomena.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}"""

# regex to replace the old pokethology tab
# We know it starts with `          {/* TAB: POKÉTHOLOGY CHATBOT */}`
# and ends right before `          {/* TAB: COMBAT */}`

text = re.sub(r'          \{\/\* TAB: POKÉTHOLOGY CHATBOT \*\/}.*?(?=          \{\/\* TAB: COMBAT \*\/})', new_pokethology_content + '\n', text, flags=re.DOTALL)

with open('src/components/Tutorial.tsx', 'w') as f:
    f.write(text)
