import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { extractSuggestedPokemon } from "./server/utils/stringUtils";
import { handleApiError } from "./server/utils/errorHandling";
import { initializeWebSocketServer } from "./server/websocket";

dotenv.config();

// Load pokemon names
let pokemonNamesList: string[] = [];
try {
  pokemonNamesList = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'pokemon_names.json'), 'utf-8'));
} catch (e) {
  console.log("Could not load pokemon_names.json", e);
}

// Helper wrapper to keep the signature expected by logic below
const extractSuggestedPokemonWrapper = (text: string) => extractSuggestedPokemon(text, pokemonNamesList);

const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// --- OFFLINE/DEVELOPMENT CONSTANTS ---
const IN_DEVELOPMENT_MSG = "In Development ⚙️\nUntil the Chatbot it's completely ready, you can search your information about this Pokémon under in these sources!";

// --- HEALTH ENDPOINT ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- REAL-TIME QUOTA MONITOR (Simplified Mock Data) ---
app.get("/api/quota", (req, res) => {
  res.json({
    requestsToday: 0,
    dailyCapacity: 1500,
    rpm: 0,
    rpmLimit: 15,
    percentUsed: 0,
    percentRemaining: 100,
    isQuotaExhausted: false,
    cooldownSecondsRemaining: 0,
    timeUntilDailyReset: "24h 00m 00s",
    resetTimestampMs: Date.now() + 86400000,
    hasCustomApiKey: false
  });
});

app.post("/api/quota/test", (req, res) => {
  res.json({
    success: true,
    message: "Test API call recorded. Quota metrics simulated.",
    quota: {
      requestsToday: 1,
      dailyCapacity: 1500,
      rpm: 1,
      rpmLimit: 15,
      percentUsed: 0,
      percentRemaining: 100,
      isQuotaExhausted: false,
      cooldownSecondsRemaining: 0,
      timeUntilDailyReset: "23h 59m 59s",
      resetTimestampMs: Date.now() + 86400000,
      hasCustomApiKey: false
    }
  });
});

app.post("/api/quota/reset-metrics", (req, res) => {
  res.json({
    success: true,
    message: "API quota metrics reset.",
    quota: {
      requestsToday: 0,
      dailyCapacity: 1500,
      rpm: 0,
      rpmLimit: 15,
      percentUsed: 0,
      percentRemaining: 100,
      isQuotaExhausted: false,
      cooldownSecondsRemaining: 0,
      timeUntilDailyReset: "24h 00m 00s",
      resetTimestampMs: Date.now() + 86400000,
      hasCustomApiKey: false
    }
  });
});

// --- POKEAPI PROXY ---
app.get("/api/proxy", async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  // Validate the target URL to ensure it is only for PokeAPI to avoid open-proxy vulnerability
  if (!targetUrl.startsWith("https://pokeapi.co/")) {
    return res.status(400).json({ error: "Invalid proxy target" });
  }

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Proxy received status ${response.status}` });
    }
    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    handleApiError(err, res, "Proxy error");
  }
});

// --- OFFLINE THEOLOGICAL QUIZ ENGINE (Deterministic Date-Seeded) ---
function getOfflineQuizSet() {
  const sets = [
    [
      {
        question: "Who is considered the 'Renegade Pokémon' in Sinnoh cosmology, banished due to its violent nature?",
        options: ["Kyurem", "Giratina", "Necrozma", "Darkrai"],
        answerIndex: 1,
        explanation: "Giratina was created alongside Dialga and Palkia but was banished to the Distortion World by Arceus due to its exceptionally violent and destructive nature. It represents antimatter and gravity."
      },
      {
        question: "According to ancient legends, Mew is the genetic ancestor of all Pokémon, but why does Arceus precede Mew in mythology?",
        options: [
          "Mew was created by human scientists to clone Arceus",
          "Arceus is the creator deity who hatched from an egg in nothingness, and Mew represents the ancestor of all common mortal species",
          "Mew and Arceus fought in a primordial war, and Mew lost",
          "Arceus is actually an evolved form of Mew"
        ],
        answerIndex: 1,
        explanation: "Pokétheology structures cosmology hierarchically: Arceus is the divine prime creator (hatching from the cosmic egg in a void of nothingness), while Mew acts as the biological stem-ancestor containing the DNA of all non-deity Pokémon."
      },
      {
        question: "The Lake Guardians (Uxie, Mesprit, and Azelf) were birthed from a single egg. What core philosophical aspects of the human spirit do they govern?",
        options: ["Body, Mind, and Soul", "Time, Space, and Matter", "Knowledge, Emotion, and Willpower", "Truth, Ideals, and Void"],
        answerIndex: 2,
        explanation: "Created by Arceus, Uxie governs Knowledge (giving humans mind), Mesprit governs Emotion (giving humans heart), and Azelf governs Willpower (giving humans resolve). Together, they keep the balance of the mind and are capable of neutralizing Dialga and Palkia."
      }
    ],
    [
      {
        question: "According to Unown-theology, what is the correlation between Unown particles and the power of Arceus?",
        options: [
          "Unown are parasites that drain Arceus's energy",
          "Unown represent the physical literalization of Arceus's thousand arms, behaving as cosmic building blocks of reality",
          "Unown are fallen angels banished from Arceus's celestial realm",
          "Unown are artificial Pokémon created from ancient alphabets"
        ],
        answerIndex: 1,
        explanation: "In the Third Pokémon Movie and Arceus lore, Unown are depicted as ancient celestial particles that form the fabric of space and reality. Mythological texts hint they represent the 'thousand arms' Arceus used to shape the universe."
      },
      {
        question: "What are the two contrasting concepts championed by Reshiram and Zekrom, which split from the complete Original Dragon?",
        options: ["Dreams and Reality", "Order and Chaos", "Truth and Ideals", "Creation and Destruction"],
        answerIndex: 2,
        explanation: "The ancient Original Dragon of Unova split into Reshiram (representing Truth/White) and Zekrom (representing Ideals/Black) because the twin heroes of Unova could not agree on which concept was more fundamental."
      },
      {
        question: "What catastrophic mythological conflict is said to have formed the geography of the Hoenn region?",
        options: [
          "The rebellion of the Regis against Regigigas",
          "The primordial clash of Groudon and Kyogre creating and drowning landmasses",
          "A meteor impact containing Deoxys",
          "The division of the Sinnoh region due to space tears"
        ],
        answerIndex: 1,
        explanation: "Primordial Groudon (representing land/lithosphere) and Primal Kyogre (representing ocean/hydrosphere) fought bitterly in ancient times, endlessly expanding land and sea until Primal Rayquaza descended from the stratosphere to pacify them."
      }
    ],
    [
      {
        question: "Which Colossal Pokémon is credited in Sinnoh theology with pulling the very land continents into place using ropes?",
        options: ["Regigigas", "Groudon", "Landorus", "Regirock"],
        answerIndex: 0,
        explanation: "According to Sinnoh legends and Canalave Library logs, Regigigas pulled the continents across the ocean with ropes, shaping the modern geographical layout of the world before entering a deep slumber."
      },
      {
        question: "What is the theological significance of the Jewel of Life created by Arceus in Michina Town legends?",
        options: [
          "It is a stone that evolves any mythical Pokémon",
          "It is a crystallization of five of Arceus's elemental plates, lent to humans to bring fertility to desolate land",
          "It is the core heart of Dialga and Palkia combined",
          "It is the source of all human souls in the Pokémon world"
        ],
        answerIndex: 1,
        explanation: "In 'Arceus and the Jewel of Life', Arceus fused five of its vital life plates (Water, Grass, Ground, Thunder, and Dragon) to create the Jewel of Life, lending it to Marcus to irrigate and fertilize the wasteland of Michina."
      },
      {
        question: "The Burned Tower in Ecruteak City is of immense mythological significance. What theological event occurred when Ho-Oh resurrected three unnamed Pokémon who perished there?",
        options: [
          "It triggered the creation of the Johto region",
          "They became the legendary beasts Raikou, Entei, and Suicune, embodying the lightning, the fire, and the rain of that event",
          "It created the first Master Ball",
          "They evolved into Mewtwo"
        ],
        answerIndex: 1,
        explanation: "When the Brass Tower (now Burned Tower) burned down, three Pokémon perished. Ho-Oh descended and revived them into Raikou (representing the lightning that struck), Entei (representing the fire that burned), and Suicune (representing the rain that extinguished the flames)."
      }
    ]
  ];
  const day = new Date().getUTCDate();
  return sets[day % sets.length];
}

app.get("/api/quiz", (req, res) => {
  const currentDateStr = new Date().toISOString().split('T')[0];
  const offlineSet = getOfflineQuizSet();
  res.json({ date: currentDateStr, questions: offlineSet, isFallback: true });
});

// --- OFFLINE NEWS ENGINE ---
const getOfflineNewsSet = (dateStr: string) => ({
  date: dateStr,
  news: [
    {
      title: "The Official Pokémon Website",
      description: "The universal hub for the Pokémon universe. Explore the official Pokédex, play games, find community events, discover cards, and catch up with all franchise announcements.",
      url: "https://www.pokemon.com",
      tag: "GAME UPDATE"
    },
    {
      title: "The Official Pokémon Competitive Strategy Hub",
      description: "Explore the official home of Pokémon battle formats, competitive rulings, regional tournaments, and battle strategy guides.",
      url: "https://www.pokemon.com/us/play-pokemon",
      tag: "COMPETITIVE"
    },
    {
      title: "The Official Pokémon Animation Series Portal",
      description: "Watch free full-length Pokémon series episodes, feature films, and animated movies. Follow Ash, Pikachu, Liko, Roy, and more trainers on their journeys across different generations.",
      url: "https://watch.pokemon.com",
      tag: "ANIME"
    }
  ]
});

app.get("/api/news", (req, res) => {
  const currentDateStr = new Date().toISOString().split('T')[0];
  const response = getOfflineNewsSet(currentDateStr);
  res.json({
    date: response.date,
    news: response.news,
    groundingSources: [
      { title: "Pokémon Official Portal", url: "https://www.pokemon.com" },
      { title: "Pokémon Competitive Hub", url: "https://www.pokemon.com/us/play-pokemon" },
      { title: "Pokémon Watch TV", url: "https://watch.pokemon.com" }
    ],
    searchQueries: ["official pokemon outlets"],
    isFallback: true
  });
});

// --- COMPACT CHATBOT ENGINE (In Development / Cleaned Offline Version) ---
app.post("/api/chat", (req, res) => {
  const { messages } = req.body;
  const userText = messages[messages.length - 1]?.text || "";
  const suggestedPokemon = extractSuggestedPokemonWrapper(userText);
  const navigateWords = ["show", "search", "open", "find", "view", "display", "stats", "load", "see", "bring", "check", "info", "pokedex", "mega", "gmax", "gigantamax", "alolan", "alola", "galarian", "galar", "hisuian", "hisui", "paldean", "paldea", "primal", "origin", "therian", "sky", "dusk", "dawn", "ultra", "look", "tell"];
  const wantsNavigation = (navigateWords.some(w => userText.toLowerCase().includes(w)) && suggestedPokemon) || (suggestedPokemon && userText.split(/\s+/).length <= 5);
  const navigatePokemon = wantsNavigation ? suggestedPokemon : null;

  res.json({
    text: IN_DEVELOPMENT_MSG,
    suggestedPokemon,
    navigatePokemon,
    isFallback: true
  });
});

// --- SIMULATED BATTLE ANALYSIS ---
app.post("/api/analyze", (req, res) => {
  res.json({
    analysis: IN_DEVELOPMENT_MSG,
    isFallback: true
  });
});

// --- POKEMON TRIVIA/FACT SUGGESTION ---
app.post("/api/suggest", (req, res) => {
  res.json({
    suggestion: IN_DEVELOPMENT_MSG,
    isFallback: true
  });
});

// --- COMBAT STRATEGY ---
app.post("/api/strategy", (req, res) => {
  res.json({
    strategy: IN_DEVELOPMENT_MSG,
    isFallback: true
  });
});

// --- VITE MIDDLEWARE SETUP ---
async function setupVite() {
  const isProd = process.env.NODE_ENV === "production" || process.argv[1]?.endsWith('server.cjs');
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

// --- SERVER INITIALIZATION ---
if (process.env.VERCEL !== "1") {
  setupVite().then(() => {
    const PORT = 3000;
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
    initializeWebSocketServer(server);
  });
}

export default app;
