const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStrClose = `      )}
    </div>
  );
});

const HPBar`;

const replacementClose = `      )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

const HPBar`;

code = code.replace(targetStrClose, replacementClose);
fs.writeFileSync('src/App.tsx', code, 'utf8');
