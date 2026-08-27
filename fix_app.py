import os

with open("src/App.tsx", "rb") as f:
    raw = f.read()

# Byte 523850 corresponds to the end of <span className="text-[8px] font-bold tracking-wider text-cyan-700 uppercase font-hud">Effect Chance</s
# Actually, let's just use the line approach.
prefix = raw[:523850].decode("utf-8", errors="ignore")
lines = prefix.splitlines()

# We will drop the last line and rebuild it.
valid_lines = lines[:-1]

# Rebuild the rest
appended_lines = [
    '                        <span className="text-[8px] font-bold tracking-wider text-cyan-700 uppercase font-hud">Effect Chance</span>',
    '                        <span className="text-xl font-mono text-cyan-400">{selectedMoveDetail.effect_chance ? `${selectedMoveDetail.effect_chance}%` : \'--\'}</span>',
    '                      </div>',
    '                    </div>',
    '                  </div>',
    '                </div>',
    '              </motion.div>',
    '            </motion.div>',
    '          )}',
    '        </AnimatePresence>',
    '',
    '        {/* Other Modals missing from corruption */}',
    '        <WelcomeModal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} onOpenTutorial={() => { setIsWelcomeOpen(false); setIsTutorialOpen(true); }} />',
    '        <Tutorial isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />',
    '        <PokethologyMissionModal isOpen={isMissionModalOpen} onClose={() => setIsMissionModalOpen(false)} />',
    '        <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} isLightMode={isLightMode} />',
    '        <DisclaimerModal isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />',
    '        <PwaInstallModal isOpen={isPwaModalOpen} onClose={() => setIsPwaModalOpen(false)} />',
    '        <OfflineManagerModal isOpen={isOfflineManagerOpen} onClose={() => setIsOfflineManagerOpen(false)} onPlaySound={(soundType) => { try { if (soundType === \'scan\') { sounds.scan(); } else if (soundType === \'success\') { sounds.success(); } else if (soundType === \'flee\') { sounds.flee(); } } catch(e){} }} />',
    '        <PokemonComparisonSidebar isOpen={isComparisonOpen} onClose={() => setIsComparisonOpen(false)} pinnedPokemon={pokemon} onSelectMainPokemon={(p) => performSearch(p.name, false)} isLightMode={isLightMode} />',
    '        <FavoritesVaultModal',
    '          isOpen={isFavoritesModalOpen}',
    '          onClose={() => setIsFavoritesModalOpen(false)}',
    '          favorites={favorites}',
    '          toggleFavorite={toggleFavorite}',
    '          onSelectPokemon={(name) => performSearch(name, false)}',
    '          onStartBattleWithPokemon={(name) => {',
    '            setIsSelectingOpponent(true);',
    '            performSearch(name, false);',
    '          }}',
    '          isLightMode={isLightMode}',
    '          sounds={sounds}',
    '        />',
    '',
    '        <AnimatePresence>',
    '          {isDailyQuizOpen && (',
    '            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80">',
    '              <PokethologyQuizWidget />',
    '              <button onClick={() => setIsDailyQuizOpen(false)} className="absolute top-4 right-4 z-[160] p-3 text-white bg-black/40 hover:bg-black/60 rounded-full">',
    '                <X className="w-6 h-6 text-white" />',
    '              </button>',
    '            </motion.div>',
    '          )}',
    '        </AnimatePresence>',
    '',
    '        <AnimatePresence>',
    '          {isDailyScanOpen && (',
    '            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80">',
    '              <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 p-6 rounded-xl relative overflow-hidden h-[80vh] overflow-y-auto">',
    '                 <PokethologyCombatMissionWidget todayStr={new Date().toISOString().split("T")[0]} isCompleted={false} missionProgressCount={0} missionRequiredCount={5} dailyStreak={1} />',
    '              </div>',
    '              <button onClick={() => setIsDailyScanOpen(false)} className="absolute top-4 right-4 z-[160] p-3 text-white bg-black/40 hover:bg-black/60 rounded-full">',
    '                <X className="w-6 h-6 text-white" />',
    '              </button>',
    '            </motion.div>',
    '          )}',
    '        </AnimatePresence>',
    '',
    '        <BattleResultScreen',
    '          isOpen={battleResult !== null}',
    '          battleResult={battleResult}',
    '          pokemon={pokemon}',
    '          battleOpponent={battleOpponent}',
    '          battleLog={battleLog}',
    '          turnNumber={turnNumber}',
    '          pokemonHP={pokemonHP}',
    '          opponentHP={opponentHP}',
    '          pokemonMaxHP={pokemonMaxHP}',
    '          opponentMaxHP={opponentMaxHP}',
    '          pokemonStatus={pokemonStatus}',
    '          opponentStatus={opponentStatus}',
    '          onRematch={() => handlePostBattleAction("rematch")}',
    '          onInspect={() => setInspectingOpponent(true)}',
    '          onNewBattle={() => handlePostBattleAction("new_battle")}',
    '          isLightMode={isLightMode}',
    '        />',
    '      </div>',
    '      </Suspense>',
    '    </ErrorBoundary>',
    '  );',
    '}'
]

with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write("\n".join(valid_lines + appended_lines) + "\n")
print("Fixed App.tsx")
