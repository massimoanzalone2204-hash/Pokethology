const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/import {([^}]+)} from 'lucide-react';/, "import { Download,$1} from 'lucide-react';");
fs.writeFileSync('src/App.tsx', code, 'utf8');
