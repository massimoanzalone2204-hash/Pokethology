const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const wsCodeOld = `  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: any = null;
    let isCleanup = false;

    function connect() {
      if (isCleanup) return;
      setWsStatus('connecting');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = \`\${protocol}//\${window.location.host}/ws\`;
      console.log("[WS] Connecting to:", wsUrl);
      
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        if (isCleanup) return;
        console.log("[WS] Connected successfully.");
        setWsStatus('connected');
      };`;

const wsCodeNew = `  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimer: any = null;
    let isCleanup = false;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 7;

    function connect() {
      if (isCleanup) return;
      setWsStatus('connecting');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = \`\${protocol}//\${window.location.host}/ws\`;
      console.log("[WS] Connecting to:", wsUrl);
      
      try {
        socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          if (isCleanup) return;
          console.log("[WS] Connected successfully.");
          setWsStatus('connected');
          reconnectAttempts = 0; // reset on successful connection
        };`;

code = code.replace(wsCodeOld, wsCodeNew);

const onCloseOld = `      socket.onclose = (event) => {
        if (isCleanup) return;
        console.log("[WS] Connection closed:", event.reason);
        setWsStatus('disconnected');
        reconnectTimer = setTimeout(connect, 5000);
      };

      socket.onerror = (err) => {
        if (isCleanup) return;
        console.log("[WS] Socket error (expected in iframe if cookies blocked):", err);
        socket?.close();
      };
    }`;

const onCloseNew = `      socket.onclose = (event) => {
          if (isCleanup) return;
          console.log("[WS] Connection closed:", event.reason);
          setWsStatus('disconnected');
          
          if (reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            reconnectAttempts++;
            console.log(\`[WS] Reconnecting in \${delay}ms (Attempt \${reconnectAttempts})\`);
            reconnectTimer = setTimeout(connect, delay);
          } else {
            console.log("[WS] Max reconnect attempts reached.");
          }
        };

        socket.onerror = (err) => {
          if (isCleanup) return;
          console.log("[WS] Socket error (expected in iframe if cookies blocked):", err);
          socket?.close();
        };
      } catch (err) {
        console.error("[WS] WebSocket instantiation failed. Possibly blocked by extensions or CSP.", err);
        setWsStatus('disconnected');
        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          reconnectAttempts++;
          reconnectTimer = setTimeout(connect, delay);
        }
      }
    }`;

code = code.replace(onCloseOld, onCloseNew);

fs.writeFileSync('src/App.tsx', code, 'utf8');
