const fs = require('fs');
let code = fs.readFileSync('src/components/AboutModal.tsx', 'utf8');

const githubBanner = `              {/* Quick Bug Report / GitHub Banner */}
              <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-700 flex flex-col items-center text-center gap-3">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-slate-300" />
                  <span className="text-[11px] font-mono text-slate-300">
                    Found an anomaly, glitch, or have questions?
                  </span>
                </div>
                <a
                  href="https://github.com/MassimoAnzalone2204/Pokethology"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.scan()}
                  className="w-full px-3 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-hud uppercase text-[10px] font-black tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Bug className="w-3.5 h-3.5" />
                  Visit GitHub Repository
                </a>
              </div>`;

code = code.replace(/\{\/\* Copyright Footnote \*\/\}/, `${githubBanner}\n\n              {/* Copyright Footnote */}`);

fs.writeFileSync('src/components/AboutModal.tsx', code);
