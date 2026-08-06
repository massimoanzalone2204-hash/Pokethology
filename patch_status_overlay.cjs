const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `const StatusOverlay = memo(({ status }: { status: string | null }) => {
  if (!status) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center -m-4 overflow-visible backdrop-blur-[2px] bg-slate-900/10 rounded-full border border-white/5 shadow-[inset_0_4px_30px_rgba(255,255,255,0.1)]">`;

const replacement = `const StatusOverlay = memo(({ status }: { status: string | null }) => {
  return (
    <AnimatePresence>
      {status && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center -m-4 overflow-visible backdrop-blur-[2px] bg-slate-900/10 rounded-full border border-white/5 shadow-[inset_0_4px_30px_rgba(255,255,255,0.1)]"
        >`;

code = code.replace(targetStr, replacement);

const targetStrClose = `      )}
    </div>
  );
});`;

const replacementClose = `      )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});`;

code = code.replace(targetStrClose, replacementClose);

fs.writeFileSync('src/App.tsx', code, 'utf8');
