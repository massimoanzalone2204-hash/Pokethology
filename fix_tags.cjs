const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

let lines = code.split('\n');
// Let's replace the whole section between runBattle and battleState
let runBattleStart = -1;
let falseStart = -1;
for(let i=7700; i<7750; i++) {
  if (lines[i] && lines[i].includes('onClick={runBattle}')) { runBattleStart = i; }
  if (lines[i] && lines[i].includes(') : false ? (')) { falseStart = i; }
}
if (runBattleStart !== -1 && falseStart !== -1) {
    let newSection = [
    '                                          <button ',
    '                                             onClick={runBattle}',
    '                                            disabled={selectedMoves.length === 0 || !battleOpponent}',
    '                                            className={cn(',
    '                                              "w-full py-3 bg-red-900/60 hover:bg-red-800/80 text-red-200 font-hud rounded shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all text-xs uppercase tracking-widest border border-red-500/60 font-black animate-btn-entrance btn-breathe-red",',
    '                                              (selectedMoves.length === 0 || !battleOpponent) && "opacity-50 cursor-not-allowed bg-slate-900 border-slate-700 text-slate-300 font-medium shadow-none hover:bg-slate-900"',
    '                                            )}',
    '                                          >',
    '                                            {!battleOpponent ? "SELECT OPPONENT FIRST" : selectedMoves.length === 0 ? `SELECT AT LEAST 1 MOVE` : "INITIATE BATTLE"}',
    '                                          </button>',
    '                                        </motion.div>',
    '                                      ) : battleState === "finished" ? (',
    '                                        null',
    '                                      ) : false ? ('
    ];
    lines.splice(runBattleStart - 1, falseStart - runBattleStart + 2, ...newSection);
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
