const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');

let replacement = `                    <SpotifyPlayer />
                    <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-900/80">
                      <span className="text-cyan-300 font-hud uppercase text-[10px] font-bold tracking-widest text-center">BGM Pack</span>
                      <div className="grid grid-cols-2 gap-1.5 w-full">
                        {sounds.getAllPacks().map(pack => (
                          <button
                            key={pack.name}
                            onClick={() => { setBgmPack(pack.name as any); sounds.setBgmPack(pack.name as any); }}`;

lines.splice(9659, 1, replacement);
fs.writeFileSync('src/App.tsx', lines.join('\n'));
