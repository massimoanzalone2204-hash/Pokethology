const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// BattleLog patch
const battleLogOld = `<div 
      ref={logRef} 
      className="bg-slate-950/80 rounded-xl border border-cyan-900/30 p-3 sm:p-4 h-32 sm:h-40 md:h-48 overflow-y-auto custom-scrollbar font-mono text-[10px] sm:text-[11px] sm:leading-relaxed font-bold tracking-wider space-y-1 sm:space-y-1.5 shadow-inner shrink-0 pointer-events-auto scroll-smooth"`;

const battleLogNew = `<div 
      ref={logRef} 
      className="bg-slate-900/30 backdrop-blur-md rounded-xl border border-white/10 p-3 sm:p-4 h-32 sm:h-40 md:h-48 overflow-y-auto custom-scrollbar font-mono text-[10px] sm:text-[11px] sm:leading-relaxed font-bold tracking-wider space-y-1 sm:space-y-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] shrink-0 pointer-events-auto scroll-smooth"`;

code = code.replace(battleLogOld, battleLogNew);

// StatusOverlay patch
const statusOverlayOld = `const StatusOverlay = memo(({ status }: { status: string | null }) => {
  if (!status) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center -m-4 overflow-visible">`;

const statusOverlayNew = `const StatusOverlay = memo(({ status }: { status: string | null }) => {
  if (!status) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center -m-4 overflow-visible backdrop-blur-[2px] bg-slate-900/10 rounded-full border border-white/5 shadow-[inset_0_4px_30px_rgba(255,255,255,0.1)]">`;

code = code.replace(statusOverlayOld, statusOverlayNew);

fs.writeFileSync('src/App.tsx', code, 'utf8');
