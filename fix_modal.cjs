const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

// Add state
text = text.replace('const [showExitConfirmation, setShowExitConfirmation] = useState(false);', 
  'const [showExitConfirmation, setShowExitConfirmation] = useState(false);\n  const [showBattleResult, setShowBattleResult] = useState(false);');

// When battle finishes, open modal
let effect = `  useEffect(() => {
    if (battleState === 'finished') {
      setShowBattleResult(true);
    } else {
      setShowBattleResult(false);
    }
  }, [battleState]);`;

let target = '  useEffect(() => {\n    const saveLogs = async () => {';
text = text.replace(target, effect + '\n\n' + target);

// Add modal JSX at the very end of AnimatePresence for modals
let modalJSX = `
        {/* Battle Result Modal */}
        <AnimatePresence>
          {showBattleResult && (
            <motion.div
              className={cn("fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-sm", isLightMode ? "bg-slate-200/50" : "bg-slate-950/80")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                 className={cn("w-full max-w-sm rounded-2xl border-2 p-6 shadow-2xl relative overflow-hidden", 
                   battleResult === 'victory' 
                    ? (isLightMode ? "bg-green-50 border-green-400 shadow-green-500/20" : "bg-green-950/90 border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)]")
                    : (isLightMode ? "bg-red-50 border-red-400 shadow-red-500/20" : "bg-red-950/90 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]")
                 )}
                 initial={{ scale: 0.9, y: 20 }}
                 animate={{ scale: 1, y: 0 }}
                 exit={{ scale: 0.9, y: 20 }}
              >
                <div className="text-center space-y-4 relative z-10">
                  <h2 className={cn("font-hud font-black text-2xl uppercase tracking-widest", 
                    battleResult === 'victory' ? "text-green-500" : "text-red-500"
                  )}>
                    {battleResult === 'victory' ? "Victory" : "Defeat"}
                  </h2>
                  <p className={cn("font-mono text-sm uppercase tracking-wider", isLightMode ? "text-slate-600" : "text-slate-300")}>
                    {battleResult === 'victory' 
                      ? \`\${pokemon?.name?.toUpperCase()} fainted the opponent!\` 
                      : \`\${pokemon?.name?.toUpperCase()} has fainted.\`}
                  </p>
                  
                  <div className="pt-4 flex justify-center">
                    <button
                      onClick={() => { setShowBattleResult(false); setBattleState('none'); }}
                      className={cn("px-6 py-2 rounded font-hud font-black uppercase tracking-widest text-sm transition-all",
                         battleResult === 'victory' 
                          ? "bg-green-500 text-white hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                          : "bg-red-500 text-white hover:bg-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                      )}
                    >
                      Return to Arena
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
`;

text = text.replace('{/* Settings Modal */}', modalJSX + '\n        {/* Settings Modal */}');

fs.writeFileSync('src/App.tsx', text);
console.log("Added BattleResultModal");
