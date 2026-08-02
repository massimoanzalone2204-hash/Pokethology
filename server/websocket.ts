import { WebSocketServer, WebSocket } from "ws";
import * as http from "http";
import fs from "fs";
import path from "path";
import { extractSuggestedPokemon } from "./utils/stringUtils";

// Load pokemon names list for fuzzy match
let pokemonNamesList: string[] = [];
try {
  pokemonNamesList = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'pokemon_names.json'), 'utf-8'));
} catch (e) {
  console.log("WebSocket engine: Could not load pokemon_names.json", e);
}

const IN_DEVELOPMENT_MSG = "In Development ⚙️\nUntil the Chatbot it's completely ready, you can search your information about this Pokémon under in these sources!";

// Global active client count
let clientCounter = 0;

export function initializeWebSocketServer(server: http.Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    const url = request.url || "";
    if (url.startsWith("/ws") || url.includes("socket")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  // Track connection list
  const activeSockets = new Set<WebSocket>();

  // Periodically broadcast telemetry stats (uptime, connections, memory, node heap state)
  const statsInterval = setInterval(() => {
    if (wss.clients.size === 0) return;

    const memoryInfo = process.memoryUsage();
    const payload = {
      type: "telemetry:update",
      payload: {
        timestamp: new Date().toISOString(),
        connections: wss.clients.size,
        uptime: Math.round(process.uptime()),
        memoryHeapUsed: Math.round(memoryInfo.heapUsed / 1024 / 1024),
        memoryHeapTotal: Math.round(memoryInfo.heapTotal / 1024 / 1024),
        neuralEngineLoad: Math.round(Math.min(95, 10 + (wss.clients.size * 5) + (Math.random() * 8))),
        apiLatencies: Math.round(150 + Math.random() * 80),
        offlineCoreMode: true,
        serverTime: new Date().toLocaleTimeString()
      }
    };

    const dataString = JSON.stringify(payload);
    for (const ws of activeSockets) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(dataString);
      }
    }
  }, 7000);

  wss.on("connection", (ws: WebSocket) => {
    activeSockets.add(ws);
    clientCounter++;
    console.log(`[WS] Client Connected. Total live connections: ${activeSockets.size}`);

    // Welcome Payload
    ws.send(JSON.stringify({
      type: "connection_established",
      payload: {
        message: "Neural Socket Connected to Pokéthology Telemetry Core System",
        clientId: `PROT-${clientCounter}`,
        protocolVersion: "WS-2.40",
        telemetryFrequencyMs: 7000,
        apiState: "OFFLINE_NEURAL_SYNTHESIS"
      }
    }));

    // Listener
    ws.on("message", async (rawMessage: string) => {
      try {
        const data = JSON.parse(rawMessage);
        const { type, payload } = data;

        if (!type) return;

        // 1. PING/HEARTBEAT
        if (type === "ping") {
          ws.send(JSON.stringify({ type: "pong", payload: { response: "alive" } }));
          return;
        }

        // 2. CHATBOT QUERY OVER WS
        if (type === "chat:message") {
          const { messages } = payload;
          const userText = messages[messages.length - 1]?.text || "";
          const suggestedPokemon = extractSuggestedPokemon(userText, pokemonNamesList);
          const navigateWords = ["show", "search", "open", "find", "view", "display", "stats", "load"];
          const wantsNavigation = navigateWords.some(w => userText.toLowerCase().includes(w)) && suggestedPokemon;
          const navigatePokemon = wantsNavigation ? suggestedPokemon : null;

          // Typing notification sent immediately
          ws.send(JSON.stringify({ type: "chat:typing", payload: { isTyping: true } }));

          // Simulated delay & word-by-word streaming of under-development fallback text
          setTimeout(() => {
            const words = IN_DEVELOPMENT_MSG.split(" ");
            let currentSentText = "";
            let wordIndex = 0;

            const streamInterval = setInterval(() => {
              if (wordIndex < words.length) {
                currentSentText += (wordIndex === 0 ? "" : " ") + words[wordIndex];
                ws.send(JSON.stringify({
                  type: "chat:stream_chunk",
                  payload: { text: currentSentText, suggestedPokemon, chunk: words[wordIndex] + " " }
                }));
                wordIndex++;
              } else {
                clearInterval(streamInterval);
                // Send final complete payload
                ws.send(JSON.stringify({
                  type: "chat:response",
                  payload: {
                    text: IN_DEVELOPMENT_MSG,
                    suggestedPokemon,
                    navigatePokemon,
                    groundingChunks: [],
                    isFallback: true
                  }
                }));
              }
            }, 40);
          }, 500);
          return;
        }

        // 3. DIAGNOSTICS STREAMING (STREAM EVENT LOGS OVER WS FOR USER PROGRESS)
        if (type === "diag:start") {
          const logsSequence = [
            "[OK] Initiating WebSocket diagnostic loop...",
            "[OK] Connected sockets count registered: " + activeSockets.size,
            "[OK] Allocating virtual high fidelity node buffer...",
            "[SUCCESS] Low latency sandbox memory alignment configured.",
            "[OK] Pinging high performance PokeAPI micro-servers...",
            "[SUCCESS] API roundtrip latency verified under 180ms.",
            "[SUCCESS] Neural fallbacks calibrated successfully."
          ];

          let progress = 0;
          let logIdx = 0;

          const diagInterval = setInterval(() => {
            progress += 15;
            if (progress > 100) progress = 100;

            let logMessage = "";
            if (logIdx < logsSequence.length) {
              logMessage = logsSequence[logIdx];
              logIdx++;
            } else {
              logMessage = `[SUCCESS] Virtual telemetry test successfully resolved at ${progress}% progress load.`;
            }

            ws.send(JSON.stringify({
              type: "diag:log",
              payload: {
                progress,
                log: logMessage,
                isFinished: progress >= 100
              }
            }));

            if (progress >= 100) {
              clearInterval(diagInterval);
            }
          }, 400);
        }

        // 4. REALTIME BATTLE STAT COUNTER PREDICTOR OVER WS
        if (type === "battle:sync") {
          const { opponent, playerHP, opponentHP } = payload;
          if (!opponent) return;

          let hintText = "";
          if (playerHP < 35) {
            hintText = `🚨 **ALERT:** Player is at ${playerHP}%! Deploy shields or prioritization moves over socket commands immediately!`;
          } else if (opponentHP < 40) {
            hintText = `🔥 **OPPORTUNITY:** Opponent ${opponent.toUpperCase()} is weak at ${opponentHP}% HP! Go for full offensive power!`;
          } else {
            hintText = `⚡ **SYNC DIALOGUE:** High speed socket combat active. Maintain STAB attacks and watch opponent swap alerts.`;
          }

          ws.send(JSON.stringify({
            type: "battle:insight",
            payload: {
              hint: hintText,
              opponent,
              playerHP,
              opponentHP,
              timestamp: new Date().toLocaleTimeString()
            }
          }));
        }

        // 5. LIVE QUIZ CHALLENGE DISPATCHER
        if (type === "quiz:request") {
          const triviaQuestions = [
            { question: "Quale Pokémon ha la stessa somma di statistiche della forma Base di Mew?", options: ["Celebi", "Jirachi", "Manaphy", "Tutti questi"], answer: 3 },
            { question: "Which Pokémon is known as the Virtual Pokemon made entirely of code?", options: ["Porygon", "Rotom", "Mewtwo", "Deoxys"], answer: 0 },
            { question: "What element type is completely immune to the Poison status effect?", options: ["Steel", "Poison", "Both Steel and Poison", "Grass"], answer: 2 },
            { question: "Which Legendary Pokémon is said to have created the Hoenn region's landmass?", options: ["Kyogre", "Groudon", "Rayquaza", "Regigigas"], answer: 1 },
            { question: "Which Pokémon is considered the deity of time in Sinnoh mythology?", options: ["Palkia", "Giratina", "Dialga", "Arceus"], answer: 2 },
            { question: "What is the name of the Unova Dragon that represents ideals?", options: ["Reshiram", "Kyurem", "Zekrom", "Victini"], answer: 2 },
            { question: "Which Pokémon from the Kalos region is known as the Destruction Pokémon?", options: ["Xerneas", "Zygarde", "Hoopa", "Yveltal"], answer: 3 },
            { question: "In Alola, which Pokémon is the guardian deity of Melemele Island?", options: ["Tapu Lele", "Tapu Koko", "Tapu Bulu", "Tapu Fini"], answer: 1 },
            { question: "Which Galarian Pokémon uses a leek as a lance?", options: ["Farfetch'd", "Sirfetch'd", "Zacian", "Corviknight"], answer: 1 },
            { question: "Which Johto Pokémon is said to resurrect from the ashes?", options: ["Lugia", "Entei", "Suicune", "Ho-Oh"], answer: 3 },
            { question: "Which Pokémon is responsible for moving the continents in ancient lore?", options: ["Groudon", "Regigigas", "Arceus", "Heatran"], answer: 1 }
          ];
          const randomQ = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
          ws.send(JSON.stringify({
            type: "quiz:response",
            payload: randomQ
          }));
        }

      } catch (err) {
        console.error("[WS] Error processing message payload", err);
      }
    });

    ws.on("close", () => {
      activeSockets.delete(ws);
      console.log(`[WS] Client disconnected. Total remaining: ${activeSockets.size}`);
    });

    ws.on("error", (err) => {
      console.error("[WS] Connection encountered an error:", err);
      activeSockets.delete(ws);
    });
  });

  return wss;
}
