const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const wsStateOld = `  const [wsBattleInsight, setWsBattleInsight] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);`;

const wsStateNew = `  const [wsBattleInsight, setWsBattleInsight] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamQueueRef = useRef<string[]>([]);
  const streamTimerRef = useRef<any>(null);`;

code = code.replace(wsStateOld, wsStateNew);

const wsStreamChunkOld = `          } else if (type === "chat:stream_chunk") {
            setChatMessages(prev => {
              const updated = [...prev];
              const lastIdx = updated.length - 1;
              if (lastIdx >= 0 && updated[lastIdx].role === "model") {
                updated[lastIdx] = { 
                  ...updated[lastIdx], 
                  text: payload.text, 
                  groundingChunks: payload.groundingChunks || updated[lastIdx].groundingChunks 
                };
              } else {
                updated.push({ 
                  role: "model", 
                  text: payload.text, 
                  groundingChunks: payload.groundingChunks 
                });
              }
              return updated;
            });
          } else if (type === "chat:response") {
            const finalMsg = {`;

const wsStreamChunkNew = `          } else if (type === "chat:stream_chunk") {
            if (payload.chunk) {
              const chars = payload.chunk.split('');
              streamQueueRef.current.push(...chars);
              
              if (!streamTimerRef.current) {
                setChatMessages(prev => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  if (lastIdx < 0 || updated[lastIdx].role !== "model") {
                    updated.push({ role: "model", text: "", groundingChunks: payload.groundingChunks });
                  } else if (payload.groundingChunks) {
                    updated[lastIdx].groundingChunks = payload.groundingChunks || updated[lastIdx].groundingChunks;
                  }
                  return updated;
                });
                
                streamTimerRef.current = setInterval(() => {
                  if (streamQueueRef.current.length > 0) {
                    const char = streamQueueRef.current.shift();
                    setChatMessages(prev => {
                      const updated = [...prev];
                      const lastIdx = updated.length - 1;
                      if (lastIdx >= 0 && updated[lastIdx].role === "model") {
                        updated[lastIdx] = {
                          ...updated[lastIdx],
                          text: updated[lastIdx].text + char
                        };
                      }
                      return updated;
                    });
                  } else {
                    clearInterval(streamTimerRef.current);
                    streamTimerRef.current = null;
                  }
                }, 15);
              }
            }
          } else if (type === "chat:response") {
            streamQueueRef.current = [];
            if (streamTimerRef.current) {
              clearInterval(streamTimerRef.current);
              streamTimerRef.current = null;
            }
            const finalMsg = {`;

code = code.replace(wsStreamChunkOld, wsStreamChunkNew);

const wsCleanupOld = `    return () => {
      isCleanup = true;
      clearTimeout(reconnectTimer);
      if (socket) {
        socket.close();
      }
    };`;

const wsCleanupNew = `    return () => {
      isCleanup = true;
      clearTimeout(reconnectTimer);
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
      }
      if (socket) {
        socket.close();
      }
    };`;

code = code.replace(wsCleanupOld, wsCleanupNew);

fs.writeFileSync('src/App.tsx', code, 'utf8');
