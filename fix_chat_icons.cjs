const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  `                                            <div className={cn("shrink-0 mt-1", msg.role === 'user' ? (isLightMode ? 'text-slate-500' : 'text-slate-400') : (isLightMode ? 'text-cyan-600' : 'text-cyan-400'))}>
                                              {msg.role === 'user' ? '»' : '●'}
                                            </div>`,
  `                                            <div className={cn("shrink-0 mt-1 flex items-center justify-center", msg.role === 'user' ? (isLightMode ? 'text-slate-500' : 'text-slate-400') : (isLightMode ? 'text-cyan-600' : 'text-cyan-400'))}>
                                              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <BrainCircuit className="w-3.5 h-3.5" />}
                                            </div>`
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
