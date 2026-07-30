const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const advancedSettingsStr = `                  {/* AI & Chat Engine Settings */}
                  <div className="flex flex-col pt-3 border-t border-slate-900/80 gap-3">
                    <span className="text-cyan-300 font-hud uppercase text-[9px] font-bold tracking-widest text-left">Advanced Engine Settings</span>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="flex flex-col text-left">
                        <span className="text-slate-300 text-[10px] font-bold">Chat Engine</span>
                        <span className="text-[8px] text-slate-500">Gemini AI (smart) vs Local Pokédex (free)</span>
                      </div>
                      <select 
                        value={getChatEngine()}
                        onChange={(e) => {
                           setChatEngine(e.target.value as 'gemini' | 'local');
                           sounds.scan();
                           // force re-render, a simple trick is just state toggling, but we can do it later
                        }}
                        className="bg-slate-900 text-[10px] font-bold text-cyan-400 p-1.5 rounded border border-cyan-900 focus:outline-none"
                      >
                        <option value="gemini">Gemini AI</option>
                        <option value="local">Local Pokédex</option>
                      </select>
                    </div>

                    <div className="flex flex-col text-left gap-1 mt-1">
                      <span className="text-slate-300 text-[10px] font-bold">Custom Gemini API Key</span>
                      <span className="text-[8px] text-slate-500 mb-1">Bypass global quota limits with your own key. (Stored locally)</span>
                      <input 
                        type="password" 
                        placeholder="AIzaSy..." 
                        defaultValue={getCustomApiKey()}
                        onChange={(e) => setCustomApiKey(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-[10px] font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
`;

code = code.replace(/<ApiQuotaMonitor[\s\S]*?\/>/, match => match + '\n\n' + advancedSettingsStr);

fs.writeFileSync(file, code);
