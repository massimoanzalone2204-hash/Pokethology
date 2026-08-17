const fs = require('fs');
let content = fs.readFileSync('src/lib/utils.ts', 'utf8');

const newVariants = `
  variant === 'bronze' ? (
    active 
      ? "bg-orange-600 border-orange-400 text-white shadow-[0_4px_15px_rgba(234,88,12,0.3)]" 
      : "bg-slate-900/40 border-slate-800 text-orange-500 hover:border-orange-500/50 hover:bg-slate-900/70 hover:text-orange-400"
  ) :
  variant === 'silver' ? (
    active 
      ? "bg-slate-300 border-slate-100 text-slate-950 shadow-[0_4px_15px_rgba(203,213,225,0.3)]" 
      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-400/50 hover:bg-slate-900/70 hover:text-slate-300"
  ) :
  variant === 'gold' ? (
    active 
      ? "bg-yellow-500 border-yellow-300 text-black shadow-[0_4px_15px_rgba(234,179,8,0.3)]" 
      : "bg-slate-900/40 border-slate-800 text-yellow-500 hover:border-yellow-500/50 hover:bg-slate-900/70 hover:text-yellow-400"
  ) :
`;

content = content.replace("variant === 'mustard' ? (", newVariants + "\n  variant === 'mustard' ? (");

fs.writeFileSync('src/lib/utils.ts', content);
