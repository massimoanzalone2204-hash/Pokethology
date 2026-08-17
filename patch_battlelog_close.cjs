const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `      {isBattling && turn === 'opponent' && (
        <div className="text-red-500 font-hud animate-pulse py-1.5 px-2 tracking-widest flex items-center gap-2 text-[8px] sm:text-[10px]">
          <Loader2 className="w-3 h-3 animate-spin" /> Opponent is thinking...
        </div>
      )}
    </div>
  );
});`;

const replacement = `      {isBattling && turn === 'opponent' && (
        <div className="text-red-500 font-hud animate-pulse py-1.5 px-2 tracking-widest flex items-center gap-2 text-[8px] sm:text-[10px]">
          <Loader2 className="w-3 h-3 animate-spin" /> Opponent is thinking...
        </div>
      )}
    </motion.div>
  );
});`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/App.tsx', code, 'utf8');
