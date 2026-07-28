const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `"px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg font-bold tracking-normal font-sans leading-relaxed max-w-[90%] hardware-shadow bezel-glow overflow-hidden",`;
const replacementStr = `"px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-medium tracking-normal font-sans leading-relaxed max-w-[90%] shadow-sm",`;

const targetStr2 = `? (isLightMode ? "bg-cyan-50 text-cyan-950 border border-cyan-200" : "bg-cyan-900/30 text-cyan-100 border border-cyan-500/25")`;
const replacementStr2 = `? (isLightMode ? "bg-cyan-50 text-cyan-950 border border-cyan-200" : "bg-cyan-950/50 text-cyan-100 border border-cyan-500/30")`;

const targetStr3 = `: (isLightMode ? "bg-slate-100/90 text-slate-800 border border-slate-200" : "bg-slate-800/50 text-slate-200 border border-slate-700/25")`;
const replacementStr3 = `: (isLightMode ? "bg-slate-100/90 text-slate-800 border border-slate-200" : "bg-slate-900/60 text-slate-200 border border-slate-700/50")`;

const targetStr4 = `text-[10px] leading-relaxed break-words`;
const replacementStr4 = `text-[11px] sm:text-[11.5px] leading-relaxed break-words`;


if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  code = code.replace(targetStr2, replacementStr2);
  code = code.replace(targetStr3, replacementStr3);
  code = code.replace(targetStr4, replacementStr4);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Chat styles replaced!");
} else {
  console.log("Could not find chat target strings");
  process.exit(1);
}
