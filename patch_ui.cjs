const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove hole
const holeStr = `      {arenaMode && (
        <div className="absolute -bottom-3 sm:-bottom-5 flex flex-col items-center justify-center pointer-events-none z-0">
          {/* Main Shadow */}
          <div className="w-24 h-4 sm:w-36 sm:h-6 bg-black/80 rounded-[100%] blur-xs"></div>
          {/* Neon Active Ring */}
          <div className={cn(
            "absolute w-20 h-3 sm:w-32 sm:h-5 rounded-[100%] border border-cyan-500/30 opacity-60 blur-[1px] animate-pulse shadow-[0_0_12px_rgba(34,211,238,0.2)]",
            isPlayer 
              ? "border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.35)]" 
              : "border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.35)]"
          )}></div>
        </div>
      )}`;
code = code.replace(holeStr, '');

// 2. Remove "Click Anywhere to Skip"
const skipText = `            {/* Skip Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-[0.3em] text-cyan-400/70 animate-pulse uppercase select-none z-50 bg-slate-950/80 px-4 py-1.5 rounded-full border border-cyan-500/10 backdrop-blur-sm pointer-events-none">
              [ Click Anywhere to Skip ]
            </div>`;
code = code.replace(skipText, '');

// 3. Remove recommended move yellow tip
const recMoveTarget1 = `                                                    (move.name === recommendedMove) && "ring-1 ring-yellow-400 ring-offset-1 ring-offset-slate-950 shadow-[0_0_10px_rgba(250,204,21,0.25)]",`;
const recMoveTarget2 = `                                                  {move.name === recommendedMove && (
                                                    <div className="absolute top-0 right-0 bg-yellow-400 text-slate-950 text-[6px] font-hud font-black px-1.5 py-0.5 rounded-bl uppercase tracking-widest shadow">
                                                      ★ REC
                                                    </div>
                                                  )}`;
code = code.replace(recMoveTarget1, '');
code = code.replace(recMoveTarget2, '');

// 4. Remove WebSocket Insight
const wsInsightTarget = `                                     {/* WebSocket Live Telemetry Insight Box */}
                                     {isBattling && wsBattleInsight && (
                                       <motion.div
                                         initial={{ opacity: 0, scale: 0.98, y: 5 }}
                                         animate={{ opacity: 1, scale: 1, y: 0 }}
                                         className="bg-slate-950/90 rounded-xl border border-cyan-500/40 p-3 sm:p-4 text-[10px] sm:text-[11px] leading-relaxed relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.15)] select-text my-2"
                                       >
                                         <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
                                         <div className="flex justify-between items-center mb-1.5 border-b border-cyan-900/30 pb-1">
                                           <div className="flex items-center gap-1.5">
                                             <span className="relative flex h-1.5 w-1.5">
                                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                               <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                                             </span>
                                             <span className="text-cyan-400 font-hud tracking-[0.2em] font-black uppercase">Live Analytics</span>
                                           </div>
                                         </div>
                                         <div className="text-cyan-100/90 text-[10px] sm:text-[11.5px] font-mono leading-relaxed space-y-1">
                                            {wsBattleInsight}
                                         </div>
                                       </motion.div>
                                     )}`;
code = code.replace(wsInsightTarget, '');

fs.writeFileSync('src/App.tsx', code, 'utf8');
