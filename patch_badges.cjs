const fs = require('fs');

let content = fs.readFileSync('src/components/PokethologyCombatMissionWidget.tsx', 'utf8');

const badgeFunction = `
  const renderCompletedBadge = (tierName: string) => {
    let colorClass = "text-emerald-400";
    let bgClass = "bg-emerald-500/10";
    let borderClass = "border-emerald-500/40";
    let wrapperBorder = "border-emerald-500/20";
    let shadowClass = "shadow-[0_0_40px_rgba(52,211,153,0.2)]";

    if (tierName === 'Bronze') {
      colorClass = "text-orange-400";
      bgClass = "bg-orange-500/10";
      borderClass = "border-orange-500/40";
      wrapperBorder = "border-orange-500/20";
      shadowClass = "shadow-[0_0_40px_rgba(234,88,12,0.2)]";
    } else if (tierName === 'Silver') {
      colorClass = "text-slate-300";
      bgClass = "bg-slate-500/10";
      borderClass = "border-slate-500/40";
      wrapperBorder = "border-slate-500/20";
      shadowClass = "shadow-[0_0_40px_rgba(148,163,184,0.2)]";
    } else if (tierName === 'Gold') {
      colorClass = "text-yellow-400";
      bgClass = "bg-yellow-500/10";
      borderClass = "border-yellow-500/40";
      wrapperBorder = "border-yellow-500/20";
      shadowClass = "shadow-[0_0_40px_rgba(234,179,8,0.2)]";
    }

    return (
      <div className={\`col-span-1 md:col-span-2 py-16 flex flex-col items-center justify-center gap-4 bg-slate-950/60 rounded-2xl border \${wrapperBorder}\`}>
        <div className={\`w-24 h-24 rounded-full \${bgClass} border-2 \${borderClass} flex items-center justify-center \${shadowClass}\`}>
          <Award className={\`w-12 h-12 \${colorClass}\`} />
        </div>
        <h3 className={\`text-2xl font-hud font-black \${colorClass} tracking-widest uppercase\`}>{tierName} Tier Cleared</h3>
        <p className="text-sm text-slate-400 font-mono text-center max-w-sm px-4">
          All activities in this tier have been successfully completed. Check back tomorrow for new challenges!
        </p>
      </div>
    );
  };
`;

content = content.replace(/const renderCompletedBadge = \(tierName: string\) => \([\s\S]*?\n  \);/m, badgeFunction.trim());

fs.writeFileSync('src/components/PokethologyCombatMissionWidget.tsx', content);
