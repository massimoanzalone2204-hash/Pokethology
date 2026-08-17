const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\{chatMessages\.map\(\(msg, i\) => \(\s*<div key=\{i\} className=\{cn\("flex w-full gap-2\.5", msg\.role === 'user' \? "flex-row-reverse" : "flex-row"\)\}>\s*<div className=\{cn\("shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border shadow-sm mt-1", msg\.role === 'user' \? \(isLightMode \? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'\) : \(isLightMode \? 'bg-cyan-50 border-cyan-200' : 'bg-cyan-950\/80 border-cyan-500\/40'\)\)\}>\s*\{msg\.role === 'user' \? <User className=\{cn\("w-3\.5 h-3\.5 sm:w-4 sm:h-4", isLightMode \? "text-slate-500" : "text-slate-400"\)\} \/> : <BrainCircuit className=\{cn\("w-3\.5 h-3\.5 sm:w-4 sm:h-4", isLightMode \? "text-cyan-600" : "text-cyan-400"\)\} \/> \}\s*<\/div>\s*<div className=\{cn\(\s*"px-3 py-2 sm:px-4 sm:py-2\.5 font-medium tracking-normal font-sans leading-relaxed max-w-\[85%\] shadow-sm",\s*msg\.role === 'user'\s*\? \(isLightMode \? "bg-slate-800 text-white border-transparent rounded-2xl rounded-tr-sm" : "bg-cyan-900\/60 text-white border border-cyan-500\/40 rounded-2xl rounded-tr-sm"\)\s*: \(isLightMode \? "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-sm" : "bg-slate-900\/80 text-slate-200 border border-slate-700\/60 rounded-2xl rounded-tl-sm"\)\s*\)\}>\s*<div className=\{cn\("markdown-body select-text text-xs sm:text-sm leading-relaxed break-words", msg\.role === 'user' && "text-white"\)\}>\s*<Markdown/g;

code = code.replace(regex, `{chatMessages.map((msg, i) => (
                                          <div key={i} className="flex w-full gap-2.5 flex-row py-2 relative z-10 border-b border-cyan-900/20 last:border-0">
                                            <div className={cn("shrink-0 mt-1", msg.role === 'user' ? (isLightMode ? 'text-slate-500' : 'text-slate-400') : (isLightMode ? 'text-cyan-600' : 'text-cyan-400'))}>
                                              {msg.role === 'user' ? '»' : '●'}
                                            </div>
                                            <div className="flex flex-col w-full min-w-0">
                                              <span className={cn("text-[7px] font-hud font-bold uppercase tracking-widest mb-1", msg.role === 'user' ? "text-slate-500" : "text-cyan-500/70")}>{msg.role === 'user' ? 'Operator' : 'Pokéthology Core'}</span>
                                              <div className={cn("markdown-body select-text text-[11px] sm:text-[12px] font-sans leading-relaxed break-words", msg.role === 'user' ? (isLightMode ? "text-slate-700" : "text-slate-300") : (isLightMode ? "text-cyan-900" : "text-cyan-100"))}>
                                                <Markdown`);

fs.writeFileSync('src/App.tsx', code, 'utf8');
