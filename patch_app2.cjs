const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{ OfflineManagerModal \} from '\.\/components\/OfflineManagerModal';\n?/g, '');
code = code.replace(/const \[isOfflineManagerOpen, setIsOfflineManagerOpen\] = useState\(false\);\n?/g, '');
code = code.replace(/<OfflineManagerModal.*?onClose=\{\(\) => setIsOfflineManagerOpen\(false\)\}.*?\/>\n?/g, '');

fs.writeFileSync('src/App.tsx', code);
