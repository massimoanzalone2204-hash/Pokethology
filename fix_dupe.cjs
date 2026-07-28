const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const dupeStr = `  const streamQueueRef = useRef<string[]>([]);
  const streamTimerRef = useRef<any>(null);
  const streamQueueRef = useRef<string[]>([]);
  const streamTimerRef = useRef<any>(null);`;

const cleanStr = `  const streamQueueRef = useRef<string[]>([]);
  const streamTimerRef = useRef<any>(null);`;

code = code.replace(dupeStr, cleanStr);

fs.writeFileSync('src/App.tsx', code, 'utf8');
