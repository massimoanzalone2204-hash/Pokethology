const fs = require('fs');

const content = fs.readFileSync('src/components/PokethologyCombatMissionWidget.tsx', 'utf8');

const lines = content.split('\n');
const splitIndex = lines.findIndex(l => l.startsWith('export const PokethologyCombatMissionWidget'));
let preamble = lines.slice(0, splitIndex).join('\n');

if (!preamble.includes('getDailyHubCombatChallenges')) {
  preamble = preamble.replace("import { cn, hudButtonClass, playHaptic } from '../lib/utils';", "import { cn, hudButtonClass, playHaptic } from '../lib/utils';\nimport { getDailyHubCombatChallenges } from '../utils/dailyHubChallenges';");
}

const newWidget = `
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      // Ignore
    }
  }, [key, state]);

  return [state, setState];
}

export const PokethologyCombatMissionWidget: React.FC<PokethologyCombatMissionWidgetProps> = memo(({ todayStr, isCompleted, missionProgressCount, missionRequiredCount }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'bronze' | 'silver' | 'gold'>('bronze');

  const hash = useMemo(() => todayStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0), [todayStr]);

  const easyTriviaQuestion = EASY_TRIVIA_QUESTIONS[hash % EASY_TRIVIA_QUESTIONS.length];
  const easyTriviaQuestionB = EASY_TRIVIA_QUESTIONS[(hash + 1) % EASY_TRIVIA_QUESTIONS.length];
  
  const medTriviaQuestion = MEDIUM_TRIVIA_QUESTIONS[(hash + 3) % MEDIUM_TRIVIA_QUESTIONS.length];
  const medTriviaQuestionB = MEDIUM_TRIVIA_QUESTIONS[(hash + 5) % MEDIUM_TRIVIA_QUESTIONS.length];
  
  const hardTriviaQuestion = HARD_TRIVIA_QUESTIONS[Math.abs(hash) % HARD_TRIVIA_QUESTIONS.length];
  const hardTriviaQuestionB = HARD_TRIVIA_QUESTIONS[(hash + 1) % HARD_TRIVIA_QUESTIONS.length];

  const combatChallenges = useMemo(() => getDailyHubCombatChallenges(todayStr), [todayStr]);

  // Persistent States
  const [easyStatusA, setEasyStatusA] = usePersistentState<'unanswered'|'correct'|'incorrect'>(\`pokethology_hub_easy_a_\${todayStr}\`, 'unanswered');
  const [easyOptA, setEasyOptA] = usePersistentState<number|null>(\`pokethology_hub_easy_opta_\${todayStr}\`, null);
  
  const [easyStatusB, setEasyStatusB] = usePersistentState<'unanswered'|'correct'|'incorrect'>(\`pokethology_hub_easy_b_\${todayStr}\`, 'unanswered');
  const [easyOptB, setEasyOptB] = usePersistentState<number|null>(\`pokethology_hub_easy_optb_\${todayStr}\`, null);
  
  const [medStatusA, setMedStatusA] = usePersistentState<'unanswered'|'correct'|'incorrect'>(\`pokethology_hub_med_a_\${todayStr}\`, 'unanswered');
  const [medOptA, setMedOptA] = usePersistentState<number|null>(\`pokethology_hub_med_opta_\${todayStr}\`, null);
  
  const [medStatusB, setMedStatusB] = usePersistentState<'unanswered'|'correct'|'incorrect'>(\`pokethology_hub_med_b_\${todayStr}\`, 'unanswered');
  const [medOptB, setMedOptB] = usePersistentState<number|null>(\`pokethology_hub_med_optb_\${todayStr}\`, null);
  
  const [hardStatusA, setHardStatusA] = usePersistentState<'unanswered'|'correct'|'incorrect'>(\`pokethology_hub_hard_a_\${todayStr}\`, 'unanswered');
  const [hardOptA, setHardOptA] = usePersistentState<number|null>(\`pokethology_hub_hard_opta_\${todayStr}\`, null);
  
  const [hardStatusB, setHardStatusB] = usePersistentState<'unanswered'|'correct'|'incorrect'>(\`pokethology_hub_hard_b_\${todayStr}\`, 'unanswered');
  const [hardOptB, setHardOptB] = usePersistentState<number|null>(\`pokethology_hub_hard_optb_\${todayStr}\`, null);

  // Poll local storage for combat progress periodically or when tab changes
  const [combatProgress, setCombatProgress] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const updateCombatProgress = () => {
      const newProgress: Record<string, number> = {};
      combatChallenges.forEach(c => {
        newProgress[c.id] = parseInt(localStorage.getItem(\`pokethology_hub_combat_\${todayStr}_\${c.id}\`) || '0', 10);
      });
      setCombatProgress(newProgress);
    };
    updateCombatProgress();
    
    // Listen for storage events (if updated from another window, though mainly for same window we use interval)
    const interval = setInterval(updateCombatProgress, 2000);
    return () => clearInterval(interval);
  }, [todayStr, combatChallenges]);

  const bronzeCompleted = easyStatusA === 'correct' && easyStatusB === 'correct' && 
                          (combatProgress['bronze_3'] || 0) >= combatChallenges[0].required && 
                          (combatProgress['bronze_4'] || 0) >= combatChallenges[1].required;
                          
  const silverCompleted = medStatusA === 'correct' && medStatusB === 'correct' && 
                          (combatProgress['silver_3'] || 0) >= combatChallenges[2].required && 
                          (combatProgress['silver_4'] || 0) >= combatChallenges[3].required;

  const goldCompleted = hardStatusA === 'correct' && hardStatusB === 'correct' && 
                        (combatProgress['gold_3'] || 0) >= combatChallenges[4].required && 
                        (combatProgress['gold_4'] || 0) >= combatChallenges[5].required;

  const totalCompletedCount = (bronzeCompleted ? 4 : 0) + (silverCompleted ? 4 : 0) + (goldCompleted ? 4 : 0);

  const operatorRank = useMemo(() => {
    if (goldCompleted) return { title: 'Expert', color: 'text-amber-400 border-amber-500/30' };
    if (silverCompleted) return { title: 'Intermediate', color: 'text-purple-400 border-purple-500/30' };
    if (bronzeCompleted) return { title: 'Beginner', color: 'text-emerald-400 border-emerald-500/30' };
    return { title: 'Novice', color: 'text-slate-400 border-slate-700/50' };
  }, [bronzeCompleted, silverCompleted, goldCompleted]);

  const handleAnswer = (tier: string, questionId: string, idx: number, isCorrect: boolean) => {
    try { sounds.scan(); } catch (_) {}
    if (isCorrect) {
      try { sounds.success?.(); } catch (_) {}
    } else {
      try { sounds.error(); } catch (_) {}
    }
    
    if (tier === 'bronze' && questionId === 'A') {
      setEasyOptA(idx); setEasyStatusA(isCorrect ? 'correct' : 'incorrect');
    } else if (tier === 'bronze' && questionId === 'B') {
      setEasyOptB(idx); setEasyStatusB(isCorrect ? 'correct' : 'incorrect');
    } else if (tier === 'silver' && questionId === 'A') {
      setMedOptA(idx); setMedStatusA(isCorrect ? 'correct' : 'incorrect');
    } else if (tier === 'silver' && questionId === 'B') {
      setMedOptB(idx); setMedStatusB(isCorrect ? 'correct' : 'incorrect');
    } else if (tier === 'gold' && questionId === 'A') {
      setHardOptA(idx); setHardStatusA(isCorrect ? 'correct' : 'incorrect');
    } else if (tier === 'gold' && questionId === 'B') {
      setHardOptB(idx); setHardStatusB(isCorrect ? 'correct' : 'incorrect');
    }
  };

  const renderTrivia = (q: any, tier: string, qId: string, status: string, opt: number | null, num: number) => {
    return (
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden shadow-lg text-left">
        <HUDCorners />
        <div className="flex justify-between items-center">
          <h4 className="text-xs sm:text-sm font-hud text-amber-400 uppercase font-bold tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Activity {num} • Theory Question
          </h4>
          {status === 'correct' && <CheckCircle className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
        </div>
        
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{q.question}</p>
        
        <div className="flex flex-col gap-2 mt-2">
          {q.options.map((option: string, i: number) => {
            let isSelected = opt === i;
            let isOptionCorrect = i === q.correctAnswer;
            
            let btnClass = "bg-slate-900 border border-slate-700 text-slate-400";
            if (status !== 'unanswered') {
              if (isOptionCorrect) btnClass = "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400";
              else if (isSelected) btnClass = "bg-red-500/20 border border-red-500/50 text-red-400";
            } else {
              btnClass = "bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer transition-colors";
            }
            
            return (
              <button
                key={i}
                disabled={status !== 'unanswered'}
                onClick={() => handleAnswer(tier, qId, i, isOptionCorrect)}
                className={\`w-full text-left p-3 rounded-lg text-xs sm:text-sm transition-all \${btnClass}\`}
              >
                {option}
              </button>
            );
          })}
        </div>
        {status !== 'unanswered' && q.explanation && (
          <div className="mt-2 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <p className="text-[10.5px] text-slate-400 font-sans italic">{q.explanation}</p>
          </div>
        )}
      </div>
    );
  };

  const renderCombatChallenge = (challenge: any, num: number) => {
    const prog = combatProgress[challenge.id] || 0;
    const isDone = prog >= challenge.required;
    return (
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden shadow-lg text-left">
        <HUDCorners />
        <div className="flex justify-between items-center">
          <h4 className="text-xs sm:text-sm font-hud text-red-400 uppercase font-bold tracking-wider flex items-center gap-2">
            <Swords className="w-4 h-4 text-red-400" />
            Activity {num} • Arena Combat
          </h4>
          {isDone && <CheckCircle className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
        </div>
        
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{challenge.title}</p>
        
        <div className="mt-2 p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-2">
          <div className="text-2xl font-hud font-black text-white">{prog} <span className="text-sm text-slate-400">/ {challenge.required}</span></div>
          {isDone ? (
            <span className="text-xs font-hud text-emerald-400 uppercase tracking-widest font-bold">Challenge Complete</span>
          ) : (
            <span className="text-xs font-hud text-amber-400 uppercase tracking-widest font-bold animate-pulse">Awaiting Combat...</span>
          )}
        </div>
      </div>
    );
  };

  const renderCompletedBadge = (tierName: string) => (
    <div className="col-span-1 md:col-span-2 py-16 flex flex-col items-center justify-center gap-4 bg-slate-950/60 rounded-2xl border border-emerald-500/20">
      <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(52,211,153,0.2)]">
        <Award className="w-12 h-12 text-emerald-400" />
      </div>
      <h3 className="text-2xl font-hud font-black text-emerald-400 tracking-widest uppercase">{tierName} Tier Cleared</h3>
      <p className="text-sm text-slate-400 font-mono text-center max-w-sm px-4">
        All activities in this tier have been successfully completed. Check back tomorrow for new challenges!
      </p>
    </div>
  );

  return (
    <div id="combat-mission-dashboard" className="relative w-full flex flex-col gap-4 text-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 p-4.5 rounded-2xl border border-cyan-500/10 text-left shadow-lg">
        <div className="space-y-1.5 border-b sm:border-b-0 sm:border-r border-slate-900 pb-3 sm:pb-0 sm:pr-4">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] sm:text-xs font-hud font-black text-cyan-400 uppercase tracking-widest">Rank</span>
          </div>
          <p className="text-lg sm:text-xl mt-1 font-hud uppercase font-black">
            <span className={cn("tracking-wider drop-shadow-md", operatorRank.color)}>
              {operatorRank.title}
            </span>
          </p>
        </div>
        <div className="space-y-1 sm:pl-4 flex flex-col justify-center">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-hud font-extrabold text-slate-400 uppercase tracking-wider">Daily Progress</span>
            <span className="text-xs font-hud font-black text-white">{totalCompletedCount} / 12</span>
          </div>
          <div className="w-full bg-slate-900 h-2 sm:h-2.5 rounded-full overflow-hidden border border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: \`\${(totalCompletedCount / 12) * 100}%\` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-2">
        {[
          { id: 'bronze', label: 'Bronze', completed: bronzeCompleted, color: 'amber' },
          { id: 'silver', label: 'Silver', completed: silverCompleted, color: 'slate' },
          { id: 'gold', label: 'Gold', completed: goldCompleted, color: 'yellow' }
        ].map((tier) => (
          <button
            key={tier.id}
            onClick={() => setSelectedDifficulty(tier.id as any)}
            className={cn(
              hudButtonClass(selectedDifficulty === tier.id, tier.color as any),
              "px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-hud font-bold uppercase tracking-wider !rounded-xl transition-all relative overflow-hidden group flex items-center gap-2",
              tier.completed && selectedDifficulty !== tier.id && "opacity-80"
            )}
          >
            {tier.label} Tier
            {tier.completed && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.8)]" />}
          </button>
        ))}
      </div>

      <div className="w-full relative mt-2">
        <AnimatePresence mode="wait">
          {selectedDifficulty === 'bronze' && (
            <motion.div key="bronze" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bronzeCompleted ? renderCompletedBadge('Bronze') : (
                <>
                  {renderTrivia(easyTriviaQuestion, 'bronze', 'A', easyStatusA, easyOptA, 1)}
                  {renderTrivia(easyTriviaQuestionB, 'bronze', 'B', easyStatusB, easyOptB, 2)}
                  {renderCombatChallenge(combatChallenges[0], 3)}
                  {renderCombatChallenge(combatChallenges[1], 4)}
                </>
              )}
            </motion.div>
          )}

          {selectedDifficulty === 'silver' && (
            <motion.div key="silver" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {silverCompleted ? renderCompletedBadge('Silver') : (
                <>
                  {renderTrivia(medTriviaQuestion, 'silver', 'A', medStatusA, medOptA, 5)}
                  {renderTrivia(medTriviaQuestionB, 'silver', 'B', medStatusB, medOptB, 6)}
                  {renderCombatChallenge(combatChallenges[2], 7)}
                  {renderCombatChallenge(combatChallenges[3], 8)}
                </>
              )}
            </motion.div>
          )}

          {selectedDifficulty === 'gold' && (
            <motion.div key="gold" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goldCompleted ? renderCompletedBadge('Gold') : (
                <>
                  {renderTrivia(hardTriviaQuestion, 'gold', 'A', hardStatusA, hardOptA, 9)}
                  {renderTrivia(hardTriviaQuestionB, 'gold', 'B', hardStatusB, hardOptB, 10)}
                  {renderCombatChallenge(combatChallenges[4], 11)}
                  {renderCombatChallenge(combatChallenges[5], 12)}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
PokethologyCombatMissionWidget.displayName = 'PokethologyCombatMissionWidget';
`;

fs.writeFileSync('src/components/PokethologyCombatMissionWidget.tsx', preamble + '\n' + newWidget);
