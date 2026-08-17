const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace container opening
code = code.replace(
  `                                    <div className={cn(
                                      "flex-1 rounded-xl border overflow-hidden flex flex-col relative",
                                      isLightMode ? "bg-white border-slate-200" : "bg-slate-950/80 border-cyan-900/30"
                                    )}>`,
  `                                    <div className={cn(
                                      "flex-1 rounded-xl border overflow-hidden flex flex-col relative",
                                      isLightMode ? "bg-white border-slate-200" : "bg-slate-950/95 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                                    )}>
                                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />`
);

// Replace header
code = code.replace(
  `                                      <div className={cn(
                                        "px-3 py-2 border-b flex justify-between items-center",
                                        isLightMode ? "bg-slate-50 border-slate-200" : "bg-slate-900/50 border-cyan-900/30"
                                      )}>
                                        <div className="flex items-center gap-2">
                                          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", quotaLimitReached ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]")}></div>
                                          <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                              <span className={cn("text-[8px] font-bold tracking-wider font-hud uppercase tracking-widest leading-tight", quotaLimitReached ? "text-red-500" : "text-cyan-500")}>
                                                {quotaLimitReached ? "AI OFFLINE (Quota reached)" : "Pokéthology Core"}
                                              </span>
                                              <span className="text-[5px] text-slate-600 font-mono">Sign: {(import.meta as any).env.VITE_POKETHOLOGY || "Pokédex"}</span>
                                            </div>
                                            <span className="text-[6px] text-slate-500 font-mono uppercase tracking-tighter">
                                              Status: {quotaLimitReached ? "Waiting for cooldown..." : "Ready"}
                                            </span>
                                          </div>
                                        </div>`,
  `                                      <div className={cn(
                                        "px-3 py-2 border-b flex justify-between items-center relative z-10",
                                        isLightMode ? "bg-slate-50 border-slate-200" : "bg-cyan-950/30 border-cyan-900/40"
                                      )}>
                                        <div className="flex items-center gap-2">
                                          <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", quotaLimitReached ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]")}></div>
                                          <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                              <span className={cn("text-[9px] font-black tracking-wider font-hud uppercase tracking-[0.15em] leading-tight", quotaLimitReached ? "text-red-500" : "text-cyan-300")}>
                                                {quotaLimitReached ? "AI OFFLINE" : "Pokéthology Core"}
                                              </span>
                                              {/* <span className="text-[5px] text-slate-600 font-mono">Sign: {(import.meta as any).env.VITE_POKETHOLOGY || "Pokédex"}</span> */}
                                            </div>
                                            <span className={cn("text-[6px] font-hud font-bold uppercase tracking-widest", quotaLimitReached ? "text-red-400/80" : "text-cyan-500/60")}>
                                              STATUS: {quotaLimitReached ? "WAITING FOR COOLDOWN..." : "ACTIVE"} // SIGN: {(import.meta as any).env.VITE_POKETHOLOGY || "POKEDEX"}
                                            </span>
                                          </div>
                                        </div>`
);

// Replace chat scroll container background
code = code.replace(
  `                                      <div 
                                        ref={chatScrollRef}
                                        className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar"
                                      >`,
  `                                      <div 
                                        ref={chatScrollRef}
                                        className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar relative bg-slate-950/20"
                                      >
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
`
);

// Replace the map function
code = code.replace(
  `                                        {chatMessages.map((msg, i) => (
                                          <div key={i} className={cn("flex w-full gap-2.5", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                                            <div className={cn("shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border shadow-sm mt-1", msg.role === 'user' ? (isLightMode ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700') : (isLightMode ? 'bg-cyan-50 border-cyan-200' : 'bg-cyan-950/80 border-cyan-500/40'))}>
                                              {msg.role === 'user' ? <User className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isLightMode ? "text-slate-500" : "text-slate-400")} /> : <BrainCircuit className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isLightMode ? "text-cyan-600" : "text-cyan-400")} /> }
                                            </div>
                                            <div className={cn(
                                              "px-3 py-2 sm:px-4 sm:py-2.5 font-medium tracking-normal font-sans leading-relaxed max-w-[85%] shadow-sm",
                                              msg.role === 'user' 
                                                ? (isLightMode ? "bg-slate-800 text-white border-transparent rounded-2xl rounded-tr-sm" : "bg-cyan-900/60 text-white border border-cyan-500/40 rounded-2xl rounded-tr-sm")
                                                : (isLightMode ? "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-sm" : "bg-slate-900/80 text-slate-200 border border-slate-700/60 rounded-2xl rounded-tl-sm")
                                            )}>
                                              <div className={cn("markdown-body select-text text-xs sm:text-sm leading-relaxed break-words", msg.role === 'user' && "text-white")}>
                                                <Markdown`,
  `                                        {chatMessages.map((msg, i) => (
                                          <div key={i} className="flex w-full gap-2.5 flex-row py-2 relative z-10 border-b border-cyan-900/20 last:border-0">
                                            <div className={cn("shrink-0 mt-1", msg.role === 'user' ? (isLightMode ? 'text-slate-500' : 'text-slate-400') : (isLightMode ? 'text-cyan-600' : 'text-cyan-400'))}>
                                              {msg.role === 'user' ? '»' : '●'}
                                            </div>
                                            <div className="flex flex-col w-full min-w-0">
                                              <span className={cn("text-[7px] font-hud font-bold uppercase tracking-widest mb-1", msg.role === 'user' ? "text-slate-500" : "text-cyan-500/70")}>{msg.role === 'user' ? 'Operator' : 'Pokéthology Core'}</span>
                                              <div className={cn("markdown-body select-text text-[11px] sm:text-[12px] font-sans leading-relaxed break-words", msg.role === 'user' ? (isLightMode ? "text-slate-700" : "text-slate-300") : (isLightMode ? "text-cyan-900" : "text-cyan-100"))}>
                                                <Markdown`
);

code = code.replace(
  `                                      <div className={cn(
                                        "px-2 py-1 flex gap-1 overflow-x-auto custom-scrollbar whitespace-nowrap border-t",
                                        isLightMode ? "bg-slate-50 border-slate-200" : "bg-slate-900/80 border-cyan-900/20"
                                      )}>`,
  `                                      <div className={cn(
                                        "px-2 py-1 flex gap-1 overflow-x-auto custom-scrollbar whitespace-nowrap border-t relative z-10",
                                        isLightMode ? "bg-slate-50 border-slate-200" : "bg-slate-900/90 border-cyan-900/40 backdrop-blur-md"
                                      )}>`
);

code = code.replace(
  `                                      <form onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage(chatInput);
                                      }} className={cn(
                                        "p-2 border-t flex gap-2",
                                        isLightMode ? "bg-slate-100 border-slate-200" : "bg-slate-900 border-cyan-900/30"
                                      )}>
                                        <input
                                          type="text"
                                          value={chatInput}
                                          onChange={(e) => setChatInput(e.target.value)}
                                          placeholder={selectedLang === 'it' ? "CHIEDI AL POKÉTHEOLOGY CORE..." : "ASK POKÉTHEOLOGY CORE..."}
                                          className={cn(
                                            "flex-1 border rounded px-2 py-1.5 text-[10px] font-bold tracking-wider uppercase tracking-widest focus:outline-none",
                                            isLightMode 
                                              ? "bg-white border-slate-300 text-slate-800 placeholder-slate-400" 
                                              : "bg-slate-950 border-cyan-900/50 text-cyan-400"
                                          )}
                                        />`,
  `                                      <form onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage(chatInput);
                                      }} className={cn(
                                        "p-2 border-t flex gap-2 relative z-10",
                                        isLightMode ? "bg-slate-100 border-slate-200" : "bg-slate-950/90 border-cyan-900/40 backdrop-blur-md"
                                      )}>
                                        <input
                                          type="text"
                                          value={chatInput}
                                          onChange={(e) => setChatInput(e.target.value)}
                                          placeholder={selectedLang === 'it' ? "CHIEDI AL POKÉTHEOLOGY CORE..." : "ASK POKÉTHEOLOGY CORE..."}
                                          className={cn(
                                            "flex-1 border rounded px-2 py-1.5 text-[10px] font-bold tracking-wider uppercase tracking-widest focus:outline-none transition-colors",
                                            isLightMode 
                                              ? "bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-cyan-400" 
                                              : "bg-transparent border-cyan-900/30 text-cyan-300 placeholder-cyan-900/50 focus:border-cyan-500/50 focus:bg-cyan-950/20"
                                          )}
                                        />`
);

fs.writeFileSync('src/App.tsx', code, 'utf8');
