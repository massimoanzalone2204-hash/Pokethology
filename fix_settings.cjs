const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

let replacement = `                    {/* Music Volume Selector */}
                    <div className="flex flex-col gap-1.5 text-center">
                      <div className="flex justify-between items-center gap-1 w-full">
                        <span className="text-cyan-300 font-hud uppercase text-[10px] font-bold tracking-widest text-center">Music Volume</span>
                        <span className="text-[9px] font-mono text-cyan-400 font-bold">{Math.round(musicVolumeState * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={musicVolumeState} 
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setMusicVolumeState(v);
                          setMusicVolume(v);
                        }}
                        className="hud-slider"
                      />
                    </div>`;

// insert the replacement at line 9161 (0-indexed 9160)
// replacing lines 9161, 9162 (className="hud-slider"), 9163 (/>) and 9164 (</div>)
lines.splice(9161, 4, replacement);
fs.writeFileSync('src/App.tsx', lines.join('\n'));
