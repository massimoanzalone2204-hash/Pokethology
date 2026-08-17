const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                                          )}
                                        </div>
                                        <AnimatePresence mode="wait">`;
const replacement = `                                          )}
                                        </div>
                                        )}
                                        <AnimatePresence mode="wait">`;
code = code.replace(target, replacement);

fs.writeFileSync('src/App.tsx', code, 'utf8');
