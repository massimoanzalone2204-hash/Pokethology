const fs = require('fs');
let content = fs.readFileSync('src/components/PokethologyCombatMissionWidget.tsx', 'utf8');

// Update renderTrivia
const newRenderTrivia = `
  const renderTrivia = (q: any, tier: string, qId: string, status: string, opt: number | null, num: number) => {
    let tierColor = "text-amber-400";
    if (tier === 'bronze') tierColor = "text-orange-400";
    if (tier === 'silver') tierColor = "text-slate-300";
    if (tier === 'gold') tierColor = "text-yellow-400";

    return (
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden shadow-lg text-left">
        <HUDCorners />
        <div className="flex justify-between items-center">
          <h4 className={\`text-xs sm:text-sm font-hud \${tierColor} uppercase font-bold tracking-wider flex items-center gap-2\`}>
            <HelpCircle className={\`w-4 h-4 \${tierColor}\`} />
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
              if (isOptionCorrect) {
                btnClass = "bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]";
              } else if (isSelected) {
                btnClass = "bg-rose-950/80 border border-rose-500 text-rose-300 line-through opacity-80 shadow-[0_0_15px_rgba(244,63,94,0.3)]";
              } else {
                btnClass = "bg-slate-950/40 border border-slate-900 text-slate-500 opacity-60";
              }
            } else {
              btnClass = "bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-cyan-500/50 hover:text-white cursor-pointer transition-colors";
            }
            
            return (
              <button
                key={i}
                disabled={status !== 'unanswered'}
                onClick={() => handleAnswer(tier, qId, i, isOptionCorrect)}
                className={\`p-3 rounded-lg text-left text-xs sm:text-sm transition-all duration-300 flex items-center justify-between gap-2 \${btnClass}\`}
              >
                <span className="font-medium break-words leading-tight">{option}</span>
                {status !== 'unanswered' && isOptionCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  };
`;

content = content.replace(/const renderTrivia = \(q: any, tier: string, qId: string, status: string, opt: number \| null, num: number\) => \{[\s\S]*?\n  \};/m, newRenderTrivia.trim());

// Update renderCombatChallenge
const newRenderCombatChallenge = `
  const renderCombatChallenge = (challenge: any, tier: string, num: number) => {
    const prog = combatProgress[challenge.id] || 0;
    const isDone = prog >= challenge.required;

    let tierColor = "text-red-400";
    if (tier === 'bronze') tierColor = "text-orange-400";
    if (tier === 'silver') tierColor = "text-slate-300";
    if (tier === 'gold') tierColor = "text-yellow-400";

    return (
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 relative overflow-hidden shadow-lg text-left">
        <HUDCorners />
        <div className="flex justify-between items-center">
          <h4 className={\`text-xs sm:text-sm font-hud \${tierColor} uppercase font-bold tracking-wider flex items-center gap-2\`}>
            <Swords className={\`w-4 h-4 \${tierColor}\`} />
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
            <span className={\`text-xs font-hud \${tierColor} uppercase tracking-widest font-bold animate-pulse\`}>Awaiting Combat...</span>
          )}
        </div>
      </div>
    );
  };
`;

content = content.replace(/const renderCombatChallenge = \(challenge: any, num: number\) => \{[\s\S]*?\n  \};/m, newRenderCombatChallenge.trim());

// Fix combatChallenge calls
content = content.replace(/renderCombatChallenge\(combatChallenges\[0\], 3\)/g, "renderCombatChallenge(combatChallenges[0], 'bronze', 3)");
content = content.replace(/renderCombatChallenge\(combatChallenges\[1\], 4\)/g, "renderCombatChallenge(combatChallenges[1], 'bronze', 4)");
content = content.replace(/renderCombatChallenge\(combatChallenges\[2\], 7\)/g, "renderCombatChallenge(combatChallenges[2], 'silver', 7)");
content = content.replace(/renderCombatChallenge\(combatChallenges\[3\], 8\)/g, "renderCombatChallenge(combatChallenges[3], 'silver', 8)");
content = content.replace(/renderCombatChallenge\(combatChallenges\[4\], 11\)/g, "renderCombatChallenge(combatChallenges[4], 'gold', 11)");
content = content.replace(/renderCombatChallenge\(combatChallenges\[5\], 12\)/g, "renderCombatChallenge(combatChallenges[5], 'gold', 12)");

fs.writeFileSync('src/components/PokethologyCombatMissionWidget.tsx', content);
