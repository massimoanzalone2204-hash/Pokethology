const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace basic app.use(cors()) with a comprehensive one
code = code.replace('app.use(cors());', `app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));`);

fs.writeFileSync('server.ts', code, 'utf8');
console.log("CORS updated");
