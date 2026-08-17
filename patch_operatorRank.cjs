const fs = require('fs');

let content = fs.readFileSync('src/components/PokethologyCombatMissionWidget.tsx', 'utf8');

const rankFunction = `
  const operatorRank = useMemo(() => {
    if (goldCompleted) return { title: 'Expert', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.3)]' };
    if (silverCompleted) return { title: 'Intermediate', color: 'text-slate-200 bg-slate-300/10 border-slate-400/40 shadow-[0_0_15px_rgba(148,163,184,0.3)]' };
    if (bronzeCompleted) return { title: 'Beginner', color: 'text-orange-400 bg-orange-500/10 border-orange-500/40 shadow-[0_0_15px_rgba(234,88,12,0.3)]' };
    return { title: 'Novice', color: 'text-slate-400 bg-slate-600/10 border-slate-600/40' };
  }, [bronzeCompleted, silverCompleted, goldCompleted]);
`;

content = content.replace(/const operatorRank = useMemo\(\(\) => \{[\s\S]*?\}, \[bronzeCompleted, silverCompleted, goldCompleted\]\);/m, rankFunction.trim());

fs.writeFileSync('src/components/PokethologyCombatMissionWidget.tsx', content);
