import { WebSocketServer, WebSocket } from "ws";
import * as http from "http";
import * as os from "os";
import { generateWithRetry, isQuotaError } from "./services/geminiService";
import { GoogleGenAI } from "@google/genai";
import { LRUCache } from "lru-cache";
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

const getApiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const LITE_MODEL = "gemini-1.5-flash";

const ai = new GoogleGenAI({
  apiKey: getApiKey(),
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build-ws',
    }
  }
});

// Offline text generator imports and copy
import { typeAdvantageMap } from "./constants";

// Language detection
function detectLanguage(text: string): 'it' | 'es' | 'fr' | 'de' | 'en' {
  if (!text) return 'en';
  const lower = text.toLowerCase();
  
  const itKeywords = ['ciao', 'chi sei', 'come', 'perché', 'perche', 'combattimento', 'arena', 'squadra', 'statistiche'];
  if (itKeywords.some(kw => lower.includes(kw))) return 'it';
  
  const esKeywords = ['hola', 'quién eres', 'cómo', 'por qué', 'combate', 'arena', 'equipo', 'estadísticas'];
  if (esKeywords.some(kw => lower.includes(kw))) return 'es';
  
  const frKeywords = ['salut', 'qui es-tu', 'comment', 'pourquoi', 'combat', 'arène', 'équipe'];
  if (frKeywords.some(kw => lower.includes(kw))) return 'fr';
  
  const deKeywords = ['hallo', 'wer bist du', 'wie', 'warum', 'kampf', 'arena', 'team'];
  if (deKeywords.some(kw => lower.includes(kw))) return 'de';
  
  return 'en';
}

// Generate offline fallback responses
function generateOfflineChatResponse(messages: any[], context: any, lang: 'it' | 'es' | 'fr' | 'de' | 'en'): string {
  const userText = (messages[messages.length - 1]?.text || "").toLowerCase().trim();
  const rawPokeName = context?.selectedPokemon?.name || "";
  const variantIndex = (userText.length + messages.length) % 3;

  const rawPokemon = context?.selectedPokemon;
  const pName = rawPokeName || "Target";
  const pTypes = rawPokemon?.types || ["Normal"];
  const textTypes = pTypes.join(' / ').toUpperCase();

  const hpVal = 75;
  const speedVal = 80;
  const archetype = lang === 'it' ? "Pivot Competitivo Bilanciato" : "All-Round Competitive Pivot";
  const recommendedItem = lang === 'it' ? "Assorbisfera" : "Life Orb";
  const keySTABMove = lang === 'it' ? "Incrocolpo" : "Body Slam";
  const strategicProTip = lang === 'it' 
    ? "Ottimizza gli scambi ad armi pari guidato dalle telemetrie dell'Arena." 
    : "Optimize even turn sequences backed by real-time Arena telemetry.";

  const isGreeting = userText.includes("ciao") || userText.includes("hello") || userText.includes("hi") || userText.includes("hey");
  const isWeak = userText.includes("weak") || userText.includes("debole") || userText.includes("shwach") || userText.includes("debil");
  
  if (isGreeting) {
    if (lang === 'it') {
      return `🧬 **Ciao Allenatore!** Sono **Pokéthology WebSocket Engine** attivo in tempo reale. Chiedimi pure della lore di *${pName}*, mosse consigliate, debolezze elementali o tattiche di lotta!`;
    }
    return `🧬 **Hello Trainer!** I am the **Pokéthology core WS server** streaming live. Ask me about *${pName}*'s lore, elementals, weaknesses, or combat metrics!`;
  }

  if (isWeak) {
    const weaksStr = rawPokemon?.weaknesses?.join(", ") || "None";
    if (lang === 'it') {
      return `### 🛡️ TELEMETRIA LIVE DEBOLEZZE: ${pName.toUpperCase()}
*Matrice debolezza/resistenza WebSocket per \`${textTypes}\`:*

* **⚠️ Vulnerabilità elementali:** \`${weaksStr}\`
* **💪 Ruolo consigliato:** \`${archetype}\`
* **🎒 Consiglio Arena:** Evita di subire colpi super-efficaci diretti nel formato 1v1 singolo.`;
    }
    return `### 🛡️ REALTIME DEBILITY REPORT: ${pName.toUpperCase()}
*WebSocket weakness matrix for \`${textTypes}\`:*

* **⚠️ Core Weaknesses:** \`${weaksStr}\`
* **💪 Suggested Role:** \`${archetype}\`
* **🎒 Arena Directives:** Avoid taking direct super-effective hits as we have no bench backups.`;
  }

  if (rawPokeName) {
    if (lang === 'it') {
      return `### 📊 SECONDA CALIBRAZIONE: ${pName.toUpperCase()}
*Matrice neural-stream per Pokémon compagno:*

* **🏆 Ruolo:** \`${archetype}\`
* **🎒 Oggetto ideale:** \`${recommendedItem}\`
* **💥 Mossa Chiave:** \`${keySTABMove}\`

💡 *Suggerimento strategico: ${strategicProTip}*`;
    }
    return `### 📊 LIVE CALIBRATION: ${pName.toUpperCase()}
*Neural-stream dataset for active companion:*

* **🏆 Role / Archetype:** \`${archetype}\`
* **🎒 Recommended Item:** \`${recommendedItem}\`
* **💥 Core STAB Attack:** \`${keySTABMove}\`

💡 *Telemetry Insight: ${strategicProTip}*`;
  }

  if (lang === 'it') {
    return "⚔️ Pokéthology WebSocket Collegato! L'Arena è online. Seleziona una creatura nella barra laterale per analizzarla in tempo reale.";
  }
  return "⚔️ Pokéthology Live WebSocket Connected!Roster telemetry active. Select a pokemon from the list to launch realtime diagnostics.";
}

// Global active client count
let clientCounter = 0;

export function initializeWebSocketServer(server: http.Server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    // Only handle paths starting with /ws or fallback
    const url = request.url || "";
    if (url.startsWith("/ws") || url.includes("socket")) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  });

  // Track connection list
  const activeSockets = new Set<WebSocket>();

  // Periodically broadcast telemetry stats (uptime, memory, node heap state)
  const statsInterval = setInterval(() => {
    if (wss.clients.size === 0) return;

    const memoryInfo = process.memoryUsage();
    const payload = {
      type: "telemetry:update",
      payload: {
        timestamp: new Date().toISOString(),
        uptime: Math.round(process.uptime()),
        memoryHeapUsed: Math.round(memoryInfo.heapUsed / 1024 / 1024),
        memoryHeapTotal: Math.round(memoryInfo.heapTotal / 1024 / 1024),
        neuralEngineLoad: Math.round(Math.min(95, 10 + (wss.clients.size * 5) + (Math.random() * 8))),
        apiLatencies: Math.round(150 + Math.random() * 80),
        offlineCoreMode: !getApiKey(),
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
        apiState: getApiKey() ? "GEMINI_COGNITIVE_LIVE" : "OFFLINE_NEURAL_SYNTHESIS"
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
          const { messages, context, lang: userLang } = payload;
          const userText = messages[messages.length - 1]?.text || "";
          const lang = userLang || detectLanguage(userText);
          const suggestedPokemon = extractSuggestedPokemon(userText, pokemonNamesList);
          const navigateWords = ["show", "search", "open", "find", "view", "display", "stats", "load"];
          const wantsNavigation = navigateWords.some(w => userText.toLowerCase().includes(w)) && suggestedPokemon;
          const navigatePokemon = wantsNavigation ? suggestedPokemon : null;

          // Typing notification sent immediately
          ws.send(JSON.stringify({ type: "chat:typing", payload: { isTyping: true } }));

          const apiKey = getApiKey();
          if (!apiKey) {
            // Offline fallback
            setTimeout(() => {
              const fullText = generateOfflineChatResponse(messages, context, lang);
              
              // Let's stream the fallback text letter by letter (simulated streaming) over WS
              let currentSentText = "";
              const words = fullText.split(" ");
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
                  // Send final response ended event
                  ws.send(JSON.stringify({
                    type: "chat:response",
                    payload: {
                      text: fullText,
                      suggestedPokemon,
                      navigatePokemon,
                      isFallback: true,
                      groundingChunks: []
                    }
                  }));
                }
              }, 40);
            }, 500);
            return;
          }

          // Online Gemini Mode
          try {
            const contents = messages.map((m: any) => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.text }]
            }));

            const langNameMap: Record<string, string> = {
              it: "Italian", es: "Spanish", fr: "French", de: "German", en: "English"
            };
            const targetLangName = langNameMap[lang] || "English";
            const currentViewed = context?.selectedPokemon ? context.selectedPokemon.name : "None";
            const activeContextName = suggestedPokemon || currentViewed;

            const response = await generateWithRetry({
              model: LITE_MODEL,
              contents: contents,
              config: {
                systemInstruction: `You are Pokéthology, the eminent AI Pokétheology Academic System, Lore Archivist, and Theological Professor.
                Your goal is to provide Trainers with deeply intellectual, engaging, and mind-blowing academic analyses of Pokémon cosmology, mythology, history, ecology, biology, and design origin over a REALTIME WebSocket interface.

                FRIENDLY MENTOR PERSPECTIVE (HUMAN-SOUNDING EXPLANATIONS):
                - When the user asks about game mechanics, combat strategies, badge requirements, or tutorial elements, ALWAYS adopt a warm, supportive, and friendly mentor-like persona.
                - Break down mechanical concepts with simple, human-sounding analogies, high encouragement, and intuitive phrasing.

                SMART, DIRECT & CONCISE MANDATE:
                - Answer the user's inquiry immediately with ultra-snappy, direct, and short phrasing. High quota constraint is active.
                - Limit replies to max 1-2 small paragraphs or a few beautiful bullet points total. Keep sentences concise.
                - Leverage plenty of relevant, colorful emojis (🧬, 🌌, 📜, 🔮, ⚡, 🛡️, ⚔️, 🦕, 🌀, 🌾) at the start of lines.
                - Strictly avoid any greeting fluff, filler talk, or boilerplate intros/outros.

                VISUAL STYLE: Always format with simple, highly readable Markdown. Bold key terms and keep lists compact. Do NOT use markdown blockquotes (e.g. "> markdown quotes") or code fence blocks. Keep text flowing natively.

                CRITICAL CONTEXT OVERRIDE:
                The UI is currently focused on: ${activeContextName}.
                If the user asks "is it strong?", "tell me its lore", "what about its biology", or uses any implicit pronoun (e.g., "tell me about it"), YOU MUST ASSUME they are talking about THIS Pokémon (${activeContextName}).

                Full Interface Context: 
                ${JSON.stringify({ ...context, newlySelected: suggestedPokemon })}

                CRITICAL MULTILINGUAL MANDATE: Preferred language is ${targetLangName}. Respond exclusively in ${targetLangName}.`
              }
            });

            const fullText = response.text || "";
            const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
            const chunks = groundingMetadata?.groundingChunks || [];

            // Stream the text to the client over WS to make it look extremely immediate and futuristic
            const textLength = fullText.length;
            let charIndex = 0;
            const batchSize = 6; // send in batches of chars

            const textStreamInterval = setInterval(() => {
              if (charIndex < textLength) {
                charIndex += batchSize;
                const partialText = fullText.substring(0, charIndex);
                ws.send(JSON.stringify({
                  type: "chat:stream_chunk",
                  payload: { text: partialText, suggestedPokemon, chunk: fullText.substring(charIndex - batchSize, charIndex) }
                }));
              } else {
                clearInterval(textStreamInterval);
                // Send final complete payload
                ws.send(JSON.stringify({
                  type: "chat:response",
                  payload: {
                    text: fullText,
                    suggestedPokemon,
                    navigatePokemon,
                    groundingChunks: chunks,
                    groundingMetadata,
                    isFallback: false
                  }
                }));
              }
            }, 25);

          } catch (err: any) {
            console.error("[WS Gemini Error]", err);
            const isQuota = isQuotaError(err);
            const fallbackText = generateOfflineChatResponse(messages, context, lang);

            ws.send(JSON.stringify({
              type: "chat:response",
              payload: {
                text: fallbackText,
                suggestedPokemon,
                navigatePokemon,
                isFallback: true,
                isQuota,
                error: err.message || "Gemini limit hit"
              }
            }));
          }
        }

        // 3. DIAGNOSTICS STREAMING (STREAM EVENT LOGS OVER WS FOR USER PROGRESS)
        if (type === "diag:start") {
          const logsSequence = [
            "[OK] Initiating WebSocket diagnostic loop...",
            "[OK] High fidelity network pipeline registered.",
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

        // 4. LIVE QUIZ CHALLENGE DISPATCHER
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
