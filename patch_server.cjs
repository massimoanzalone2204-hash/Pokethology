const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
if (!code.includes("import cors from 'cors'")) {
    code = code.replace('import express from "express";', 'import express from "express";\nimport cors from "cors";');
    code = code.replace('const app = express();', 'const app = express();\napp.use(cors());');
    fs.writeFileSync('server.ts', code, 'utf8');
    console.log("CORS added to server.ts");
} else {
    console.log("CORS already in server.ts");
}
