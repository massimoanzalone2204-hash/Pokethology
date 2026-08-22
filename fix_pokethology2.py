import re

with open('src/components/Tutorial.tsx', 'r') as f:
    text = f.read()

pokethology_cards = """              <div className="grid grid-cols-1 gap-3 text-left">
                {/* Tactics & Metagame Strategy */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-purple-950 rounded-full border border-purple-500/50 group-hover:rotate-12 transition-transform shrink-0">
                    <Crosshair className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-purple-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Competitive Metagame & Smogon Builds
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Get complete competitive setups including 4-move synergies, optimal Held Items (Choice Specs, Choice Band, Focus Sash, Heavy-Duty Boots, Life Orb, Leftovers), EV/IV spreads, optimal Natures, and hazard/pivot strategies.
                    </p>
                  </div>
                </div>
                {/* Lore, Ecology & Morphology */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-purple-950 rounded-full border border-purple-500/50 group-hover:-rotate-12 transition-transform shrink-0">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-purple-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Species Biology, Ecology & Lore
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Discover evolutionary adaptations, anatomical physiology, habitat behaviors, and canonical Pokédex descriptions from Red & Blue to Scarlet & Violet and Legends Z-A.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>"""

# Replace the broken closing
text = re.sub(r'              <div className="grid grid-cols-1 gap-3 text-left"><\/motion\.div>', pokethology_cards, text)

# ALSO fix the other issue: `Unexpected closing "div" tag does not match opening "motion.div" tag`
# Wait, let's see what's on line 666 before fixing it.

with open('src/components/Tutorial.tsx', 'w') as f:
    f.write(text)

