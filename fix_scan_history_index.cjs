const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startIdx = code.indexOf('{scanHistory.length > 0 && (');
const endIdx = code.indexOf(')}', code.indexOf('</AnimatePresence>', startIdx)) + 2;

if (startIdx === -1 || endIdx === -1) {
    console.log("Not found");
    process.exit(1);
}

const replacement = `{scanHistory.length > 0 && (
                          <div className="flex flex-col mt-6 w-full max-w-sm mx-auto justify-center z-20 relative">
                            <div className="border border-slate-800/85 bg-slate-950/45 rounded-xl overflow-hidden transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowScanHistory(!showScanHistory);
                                  sounds.scan();
                                }}
                                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900/45 hover:bg-slate-900/75 transition-all font-hud text-[10px] tracking-[0.2em] text-slate-400 hover:text-cyan-400 font-bold uppercase cursor-pointer"
                              >
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                                  <span>RECENT SCANS ({scanHistory.length})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[8px] opacity-65 font-mono">
                                    {showScanHistory ? "COLLAPSE" : "EXPAND"}
                                  </span>
                                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", showScanHistory ? "rotate-180" : "rotate-0")} />
                                </div>
                              </button>

                              <AnimatePresence>
                                {showScanHistory && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t border-slate-800/60 flex flex-col"
                                  >
                                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/40 bg-slate-950">
                                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">History</span>
                                      {showClearScanConfirm ? (
                                        <div className="flex items-center gap-1.5 bg-slate-900 border border-rose-500/30 px-1.5 py-0.5 rounded">
                                          <span className="text-[7px] font-mono font-bold text-rose-400 uppercase">Wipe?</span>
                                          <button
                                            onClick={() => {
                                              setScanHistory([]);
                                              localStorage.removeItem('pokethology_scan_history');
                                              setShowClearScanConfirm(false);
                                              try { sounds.scan(); } catch(_) {}
                                            }}
                                            className="px-1.5 py-0.5 text-[7px] font-hud font-black uppercase rounded bg-rose-950 border border-rose-500/40 text-rose-400 hover:bg-rose-900 transition-all cursor-pointer"
                                          >YES</button>
                                          <button
                                            onClick={() => setShowClearScanConfirm(false)}
                                            className="px-1.5 py-0.5 text-[7px] font-hud font-black uppercase rounded bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 transition-all cursor-pointer"
                                          >NO</button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => setShowClearScanConfirm(true)}
                                          className="flex items-center gap-1 px-1.5 py-0.5 text-[7px] font-mono font-bold uppercase rounded border border-rose-900/40 bg-rose-950/20 text-rose-400 hover:bg-rose-900/30 hover:text-rose-300 transition-all cursor-pointer"
                                        >
                                          <Trash2 className="w-2.5 h-2.5 text-rose-500" /> Clear
                                        </button>
                                      )}
                                    </div>
                                    <div className="max-h-[180px] overflow-y-auto custom-scrollbar p-2 grid grid-cols-2 gap-2">
                                      {scanHistory.map((hist) => (
                                        <button
                                          key={hist.name}
                                          onClick={() => {
                                            sounds.scan();
                                            performSearch(hist.name);
                                          }}
                                          className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:border-slate-600 transition-all text-left"
                                        >
                                          <div className="w-6 h-6 rounded-md bg-slate-950 flex items-center justify-center shrink-0 border border-slate-800">
                                            <img
                                              src={\`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/\${hist.id}.png\`}
                                              alt={hist.name}
                                              referrerPolicy="no-referrer"
                                              className="w-5 h-5 object-contain"
                                              onError={(e) => {
                                                e.currentTarget.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
                                              }}
                                            />
                                          </div>
                                          <div className="min-w-0">
                                            <p className="text-[9px] font-sans font-bold uppercase text-slate-300 truncate leading-tight tracking-wider">{hist.name.replace(/-/g, ' ')}</p>
                                            <p className="text-[7px] font-mono text-slate-500 uppercase truncate">#{String(hist.id).padStart(4, '0')}</p>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        )}`;

code = code.substring(0, startIdx) + replacement + code.substring(endIdx);
fs.writeFileSync('src/App.tsx', code);
console.log("Replaced scan history!");
