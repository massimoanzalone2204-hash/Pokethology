import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# Add isTabTransitioning state
state_target = "const [activeTab, setActiveTab] = useState<'data' | 'chat' | 'battle'>('data');"
state_replacement = state_target + "\n  const [isTabTransitioning, setIsTabTransitioning] = useState(false);"

text = text.replace(state_target, state_replacement)

# Update handleTabChange
old_func = """  const handleTabChange = useCallback((tab: 'data' | 'chat' | 'battle') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setChatSpeakingIndex(null);
    setActiveTab(tab);
    setShowDetailsScrollTop(false);

    if (tab === 'battle') {
      setInspectingOpponent(false);
      setAttackerAnimation('none');
      setDefenderAnimation('none');

      if (basePlayerPokemonRef.current) {
        setPokemon(basePlayerPokemonRef.current);
      }

      const currentPoke = basePlayerPokemonRef.current || pokemon;
      const pBase = currentPoke?.stats?.find((s: any) => s.stat.name === 'hp')?.base_stat || 50;
      const oBase = battleOpponent?.stats?.find((s: any) => s.stat.name === 'hp')?.base_stat || 50;
      const pMax = Math.floor(pBase * 2 + 110);
      const oMax = Math.floor(oBase * 2 + 110);

      setPokemonMaxHP(pMax);
      setOpponentMaxHP(oMax);
      setPokemonHP(pMax);
      setOpponentHP(oMax);

      setPokemonStatus(null);
      setOpponentStatus(null);
      setPokemonFlinched(false);
      setOpponentFlinched(false);
      setPlayerSubstitute(0);
      setOpponentSubstitute(0);
      setPlayerProtected(false);
      setOpponentProtected(false);
      setPlayerStatStages({ attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0, evasion: 0, accuracy: 0 });
      setOpponentStatStages({ attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0, evasion: 0, accuracy: 0 });
      setBattleState('setup');
      setIsBattling(false);
      setBattleResult(null);
      setBattleLog([]);
      setIsBattleHistoryExpanded(false);
    }

    setTimeout(() => {
      if (detailsContainerRef.current) {
        detailsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (battleScrollRef.current) {
        battleScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
    try { sounds.scan(); playHaptic('light'); } catch (_) {}
  }, [pokemon, battleOpponent]);"""


new_func = """  const handleTabChange = useCallback((tab: 'data' | 'chat' | 'battle') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setChatSpeakingIndex(null);
    setIsTabTransitioning(true);

    setTimeout(() => {
      setActiveTab(tab);
      setShowDetailsScrollTop(false);

      if (tab === 'battle') {
        setInspectingOpponent(false);
        setAttackerAnimation('none');
        setDefenderAnimation('none');

        if (basePlayerPokemonRef.current) {
          setPokemon(basePlayerPokemonRef.current);
        }

        const currentPoke = basePlayerPokemonRef.current || pokemon;
        const pBase = currentPoke?.stats?.find((s: any) => s.stat.name === 'hp')?.base_stat || 50;
        const oBase = battleOpponent?.stats?.find((s: any) => s.stat.name === 'hp')?.base_stat || 50;
        const pMax = Math.floor(pBase * 2 + 110);
        const oMax = Math.floor(oBase * 2 + 110);

        setPokemonMaxHP(pMax);
        setOpponentMaxHP(oMax);
        setPokemonHP(pMax);
        setOpponentHP(oMax);

        setPokemonStatus(null);
        setOpponentStatus(null);
        setPokemonFlinched(false);
        setOpponentFlinched(false);
        setPlayerSubstitute(0);
        setOpponentSubstitute(0);
        setPlayerProtected(false);
        setOpponentProtected(false);
        setPlayerStatStages({ attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0, evasion: 0, accuracy: 0 });
        setOpponentStatStages({ attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0, evasion: 0, accuracy: 0 });
        setBattleState('setup');
        setIsBattling(false);
        setBattleResult(null);
        setBattleLog([]);
        setIsBattleHistoryExpanded(false);
      }

      setTimeout(() => {
        if (detailsContainerRef.current) {
          detailsContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
        if (battleScrollRef.current) {
          battleScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
      }, 10);
    }, 150);

    setTimeout(() => {
      setIsTabTransitioning(false);
    }, 300);

    try { sounds.scan(); playHaptic('light'); } catch (_) {}
  }, [pokemon, battleOpponent]);"""

if old_func in text:
    text = text.replace(old_func, new_func)
else:
    print("Could not find handleTabChange")

with open('src/App.tsx', 'w') as f:
    f.write(text)
