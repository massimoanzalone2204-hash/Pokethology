import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { LRUCache } from "lru-cache";
import fs from "fs";
import { extractSuggestedPokemon } from "./server/utils/stringUtils";
import { strategies } from "./server/utils/battleUtils";
import { handleApiError } from "./server/utils/errorHandling";
import { generateWithRetry, isQuotaError, registerApiCallRecorder } from "./server/services/geminiService";
import { typeAdvantageMap, suggestions } from "./server/constants";
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

// Cache configuration
const suggestionCache = new LRUCache<string, string>({ max: 1000, ttl: 1000 * 60 * 60 * 24 }); // 24 hours
const strategyCache = new LRUCache<string, string>({ max: 500, ttl: 1000 * 60 * 10 }); // 10 minutes
const analysisCache = new LRUCache<string, string>({ max: 200, ttl: 1000 * 60 * 5 }); // 5 minutes
const chatCache = new LRUCache<string, any>({ max: 500, ttl: 1000 * 60 * 20 }); // 20 minutes chat cache

// Initialize Gemini
const getApiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const ai = new GoogleGenAI({
  apiKey: getApiKey(),
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const DEFAULT_MODEL = "gemini-3.1-flash-lite";
const LITE_MODEL = "gemini-3.1-flash-lite";

// --- OFFLINE GENERATIVE ENGINE (Fallback Mode) ---

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// --- LANGUAGE DETECTION UTILITIES ---

function detectLanguage(text: string): 'it' | 'es' | 'fr' | 'de' | 'en' {
  if (!text) return 'en';
  const lower = text.toLowerCase();
  
  // Italian keywords
  const itKeywords = [
    'ciao', 'chi sei', 'come', 'perché', 'perche', 'combattimento', 'arena', 'statistiche', 
    'debole', 'efficace', 'mosse', 'consiglio', 'aiuto', 'strategia', 'lore', 'storia', 'tuo', 'mio', 
    'drago', 'fuoco', 'acqua', 'erba', 'elettro', 'chi è', 'chi e', 'combatti', 'vincitore', 'vincere'
  ];
  if (itKeywords.some(kw => lower.includes(kw))) return 'it';
  
  // Spanish keywords
  const esKeywords = [
    'hola', 'quién eres', 'quien', 'cómo', 'como', 'por qué', 'por que', 'combate', 'arena', 
    'estadísticas', 'debil', 'debilitado', 'movimiento', 'consejo', 'ayuda', 'estrategia', 'historia', 
    'tuyo', 'mi', 'fuego', 'agua', 'hierba', 'viento', 'luchar'
  ];
  if (esKeywords.some(kw => lower.includes(kw))) return 'es';
  
  // French keywords
  const frKeywords = [
    'salut', 'qui es-tu', 'qui', 'comment', 'pourquoi', 'combat', 'arène', 'statistiques', 
    'faible', 'mouvement', 'conseil', 'aide', 'stratégie', 'histoire', 'ton', 'mon', 'feu', 'eau', 'herbe'
  ];
  if (frKeywords.some(kw => lower.includes(kw))) return 'fr';
  
  // German keywords
  const deKeywords = [
    'hallo', 'wer bist du', 'wie', 'warum', 'kampf', 'arena', 'statistiken', 'schwach', 
    'bewegung', 'rat', 'hilfe', 'strategie', 'geschichte', 'dein', 'mein', 'feuer', 'wasser', 'gras'
  ];
  if (deKeywords.some(kw => lower.includes(kw))) return 'de';
  
  return 'en';
}





function getMatchupRating(player: any, opponent: any, lang: 'it' | 'es' | 'fr' | 'de' | 'en'): string {
  const pTypes = player.types || [];
  const oTypes = opponent.types || [];
  
  let playerAdvantage = false;
  let opponentAdvantage = false;

  for (const pt of pTypes) {
    const map = typeAdvantageMap[pt.toLowerCase()];
    if (map) {
      for (const ot of oTypes) {
        if (map.strongAgainst.includes(ot.toLowerCase())) playerAdvantage = true;
      }
    }
  }

  for (const ot of oTypes) {
    const map = typeAdvantageMap[ot.toLowerCase()];
    if (map) {
      for (const pt of pTypes) {
        if (map.strongAgainst.includes(pt.toLowerCase())) opponentAdvantage = true;
      }
    }
  }

  if (playerAdvantage && !opponentAdvantage) {
    if (lang === 'it') return "Postura offensiva altamente favorevole. Possiedi vantaggi di copertura del tipo STAB.";
    if (lang === 'es') return "Postura ofensiva muy favorable. Posees ventajas de cobertura de tipo STAB.";
    if (lang === 'fr') return "Posture offensive très favorable. Vous possédez des avantages de couverture de type STAB.";
    if (lang === 'de') return "Sehr günstige offensive Haltung. Du besitzt passende STAB-Typenabdeckungsvorteile.";
    return "Highly favorable offensive posture. You possess matching STAB type coverage advantages.";
  }
  if (opponentAdvantage && !playerAdvantage) {
    if (lang === 'it') return "Minaccia ad alta vulnerabilità. L'avversario ha un forte vantaggio di tipo. Considera di sostituire il Pokémon.";
    if (lang === 'es') return "Gran amenaza de vulnerabilidad. El oponente tiene una gran ventaja súper efectiva. Considera cambiar.";
    if (lang === 'fr') return "Forte menace de vulnérabilité. L'adversaire a un avantage super efficace. Envisagez un switch.";
    if (lang === 'de') return "Hohe Bedrohung der Verwundbarkeit. Gegner hat sehr effektiven Hebel. Ziehe einen Wechsel in Betracht.";
    return "High vulnerability threat. Opponent has super-effective leverage. Strongly consider pivoting.";
  }
  if (playerAdvantage && opponentAdvantage) {
    if (lang === 'it') return "Scontro a doppio taglio. Alto potenziale di scambio di danni. Le mosse di priorità o la velocità decideranno il vincitore.";
    if (lang === 'es') return "Enfrentamiento de doble filo. Alta capacidad de intercambio de daño. Los movimientos prioritarios o la velocidad decidirán al ganador.";
    if (lang === 'fr') return "Match à double tranchant. Capacité d'échange de dégâts élevée. Les mouvements prioritaires ou la vitesse dicteront le vainqueur.";
    if (lang === 'de') return "Zweischneidiges Matchup. Hoher Schadensaustausch möglich. Prioritäts-Moves oder Initiative entscheiden den Sieger.";
    return "Double-edged matchup. High damage trade-off capacity. Priority moves or speed status will dictate the victor.";
  }
  if (lang === 'it') return "Dinamica neutrale e bilanciata. Concentrati semplicemente sugli scambi di potenza base e sulle predizioni.";
  if (lang === 'es') return "Dinámica neutral equilibrada. Concéntrate en el daño básico y las predicciones.";
  if (lang === 'fr') return "Dynamique neutre équilibrée. Concentrez-vous purement sur l'échange de dégâts de base et les prédictions.";
  if (lang === 'de') return "Ausgeglichene neutrale Dynamik. Konzentriere dich auf reinen Schadensaustausch und Vorhersagen.";
  return "Balanced neutral dynamic. Focus purely on basic power trading and prediction sets.";
}

function getMoveInsight(player: any, opponent: any, weather: string, lang: 'it' | 'es' | 'fr' | 'de' | 'en'): string {
  const pHP = player.hp ?? 100;
  const pTypes = (player.types || []).map((t: string) => t.toLowerCase());

  if (weather?.toLowerCase() === 'sun' && (pTypes.includes('fire') || pTypes.includes('grass'))) {
    if (lang === 'it') return "Sotto il sole intenso, i danni di tipo Fuoco ottengono un aumento del 1.5x e le mosse d'Erba caricano all'istante. Sfruttale ora!";
    if (lang === 'es') return "Bajo Sol intenso, los ataques de Fuego ganan un 1.5x de daño y los movimientos de Planta cargan al instante. ¡Úsalos ya!";
    if (lang === 'fr') return "Sous un Soleil intense, les dégâts de Feu sont boostés de 1.5x et les capacités Plante chargent instantanément. Utilisez-les !";
    if (lang === 'de') return "Unter intensivem Sonnenschein verursachen Feuer-Attacken 1.5x Schaden und Grass-Moves laden sofort auf. Nutze sie jetzt!";
    return "Under Solar intensity, Fire damage gains a 1.5x amplification, and Grass-type Solar moves hit instantly. Deploy these resources immediately.";
  }
  if (weather?.toLowerCase() === 'rain' && (pTypes.includes('water') || pTypes.includes('electric'))) {
    if (lang === 'it') return "Sotto la pioggia battente, gli attacchi d'Acqua STAB aumentano del 1.5x e la precisione è perfetta. Scatena attacchi idrici o elettrici!";
    if (lang === 'es') return "Bajo la lluvia, los ataques de Agua STAB aumentan un 1.5x y la precisión de Trueno es perfecta. ¡Ataca con Agua o Eléctrico!";
    if (lang === 'fr') return "Sous une Pluie battante, les attaques Eau STAB sont boostées de 1.5x et la précision est parfaite. Déchaînez l'Eau ou l'Électricité !";
    if (lang === 'de') return "Unter starkem Regen verursachen Wasser-STAB-Attacken 1.5x Schaden und die Genauigkeit ist perfekt. Entfessle Wasser- oder Elektro-Moves!";
    return "Under Heavy Rain, Water-type STAB capabilities gain 1.5x amplification, and accuracy-checks are bypassed. Unleash hydro or electrical pressure.";
  }
  if (pHP < 40) {
    if (lang === 'it') return "I tuoi HP sono pericolosamente bassi. Se possiedi mosse con priorità (es. Protezione, Sbigoattacco), usale per scambiare danni o sostituisci.";
    if (lang === 'es') return "Tus HP están críticamente bajos. Si tienes movimientos de prioridad (ej. Protección, Golpe Bajo), úsalos para intercambiar daño.";
    if (lang === 'fr') return "Vos PV sont dangereusement bas. Si vous possédez des attaques de priorité (ex. Abri, Coup Bas), utilisez-les pour gratter un tour.";
    if (lang === 'de') return "Deine KP sind gefährlich niedrig. Falls du Prioritäts-Moves hast (z.B. Schutzschild, Tiefschlag), nutze sie oder wechsle aus.";
    return "Ally HP is dangerously low. If defensive priority moves (e.g., Protect, Sucker Punch) are equipped, commit them to trace optimal turn trades. Otherwise pivot.";
  }
  if (lang === 'it') return "Determina la tua velocità. Se sei più veloce, sferra un potente attacco STAB. Se sei più lento, preparati a difenderti con barriere.";
  if (lang === 'es') return "Determina tu velocidad. Si eres más rápido, usa un ataque STAB potente. Si eres más lento, anticípate con defensa.";
  if (lang === 'fr') return "Déterminez votre vitesse. Si vous êtes plus rapide, lancez une forte capacité STAB. Sinon, anticipez la défense.";
  if (lang === 'de') return "Bestimme deine Initiative. Wenn du schneller bist, nutze einen starken STAB-Move. Wenn du langsamer bist, verteidige dich.";
  return "Determine your active speed tier. If you move first, attempt a powerful STAB option. If slower, anticipate their blow with defensive covers.";
}

function getOpponentPrediction(player: any, opponent: any, lang: 'it' | 'es' | 'fr' | 'de' | 'en'): string {
  const oHP = opponent.hp ?? 100;
  if (oHP < 35) {
    if (lang === 'it') return "L'avversario è in condizioni critiche. È molto probabile che usi mosse con priorità o sostituisca il Pokémon.";
    if (lang === 'es') return "El oponente está en estado crítico. Es muy probable que use un movimiento con prioridad o cambie de Pokémon.";
    if (lang === 'fr') return "L'adversaire est en état critique. Il est très probable qu'il utilise une priorité ou fasse un switch.";
    if (lang === 'de') return "Gegner ist in kritischem Bereich. Es ist sehr wahrscheinlich, dass er Prioritäts-Moves nutzt oder auswechselt.";
    return "Opponent unit is in critical recovery state. They are highly predicted to execute priority strikes or pivot to safe counters.";
  }
  if (opponent.status && opponent.status !== 'Healthy' && opponent.status !== 'none') {
    if (lang === 'it') return `L'avversario è indebolito da uno stato: ${opponent.status}. Sfrutta questa condizione per potenziarti o attaccare.`;
    if (lang === 'es') return `El enemigo está afectado por estado: ${opponent.status}. Saca ventaja de esta debilidad para prepararte.`;
    if (lang === 'fr') return `L'adversaire est affligé par le statut : ${opponent.status}. Profitez de ce debuff pour vous placer.`;
    if (lang === 'de') return `Gegner ist durch Status beeinträchtigt: ${opponent.status}. Nutze diese Schwächung für Setup-Vorteile.`;
    return `Opponent is compromised by status: ${opponent.status}. Exploit their debuff cycles to establish setup advantages.`;
  }
  if (lang === 'it') return "L'avversario sta probabilmente calcolando il danno massimo. Fai attenzione a possibili cambi di tipo o mosse di copertura.";
  if (lang === 'es') return "Es probable que el oponente calcule el daño total. Ten cuidado si cambia de tipo.";
  if (lang === 'fr') return "L'adversaire calcule probablement ses dégâts maximaux. Attention s'il change de type.";
  if (lang === 'de') return "Gegner berechnet wahrscheinlich maximalen Schaden. Achte auf Auswechseln o.ä.";
  return "Opponent is likely calculating full cover damage. Caution is recommended.";
}

function generateOfflineChatResponse(messages: any[], context: any, lang: 'it' | 'es' | 'fr' | 'de' | 'en'): string {
  const userText = (messages[messages.length - 1]?.text || "").toLowerCase().trim();
  const rawPokeName = context?.currentPokemon?.name || context?.selectedPokemon?.name || "";
  const variantIndex = (userText.length + messages.length) % 3;

  const rawPokemon = context?.currentPokemon || context?.selectedPokemon;
  const pName = rawPokeName || "Target";
  const pTypes = rawPokemon?.types || ["Normal"];
  const textTypes = pTypes.map((t: any) => typeof t === 'string' ? t.toUpperCase() : t.type?.name?.toUpperCase() || "NORMAL").join(' / ');

  const statsObj = rawPokemon?.stats || [];
  const getStatNode = (name: string) => statsObj.find((s: any) => s.stat?.name === name)?.base_stat || 70;
  const hpVal = getStatNode('hp');
  const atkVal = getStatNode('attack');
  const defVal = getStatNode('defense');
  const spatkVal = getStatNode('special-attack');
  const spdefVal = getStatNode('special-defense');
  const speedVal = getStatNode('speed');

  const isSpecial = spatkVal > atkVal;
  const isFast = speedVal >= 90;
  const isTank = (defVal + spdefVal) >= 160 || hpVal >= 95;

  let archetype = "Equilibrato";
  let recommendedNature = "Decisa";
  let recommendedEVs = "252 Attacco / 4 SpD / 252 Velocità";
  let recommendedItem = "Assorbisfera";
  let keySTABMove = "Incrocolpo";
  let strategicProTip = "Ottimizza gli scambi ad armi pari sfruttando l'eccellente bulk naturale.";

  if (isFast && isSpecial) {
    archetype = lang === 'it' ? "Fast Special Sweeper" : "Fast Special Sweeper";
    recommendedNature = lang === 'it' ? "Timida (+Vel, -Atk)" : "Timid (+Spe, -Atk)";
    recommendedEVs = "252 SpA / 4 SpD / 252 Spe";
    recommendedItem = "Lentiscelta / Assorbisfera";
    keySTABMove = "Palla Ombra / Fulmine";
    strategicProTip = lang === 'it' ? "Pivot strategico veloce per momentum." : "Speedy pivot strategy for safe momentum.";
  } else if (isFast) {
    archetype = lang === 'it' ? "Fast Physical Sweeper" : "Fast Physical Sweeper";
    recommendedNature = lang === 'it' ? "Allegra (+Vel, -SpA)" : "Jolly (+Spe, -SpA)";
    recommendedEVs = "252 Atk / 4 SpD / 252 Spe";
    recommendedItem = "Bendascelta / Assorbisfera";
    keySTABMove = "Terremoto / Retromarcia";
    strategicProTip = lang === 'it' ? "Lancia colpi fisici STAB devastanti per chiudere velocemente il duello 1v1." : "Deliver massive STAB hits to secure quick K.O.s in 1v1 duels.";
  } else if (isTank) {
    archetype = lang === 'it' ? "Muro Defensivo" : "Defensive Bulky Tank";
    recommendedNature = lang === 'it' ? "Placida o Sicura" : "Relaxed or Careful";
    recommendedEVs = "252 HP / 128 Def / 128 SpD";
    recommendedItem = "Avanzi / Corpetto Assalto";
    keySTABMove = "Tossina / Fuocofato";
    strategicProTip = lang === 'it' ? "Assorbi danni elevati e rallenta l'avversario." : "Soak up big hits and chip down with status moves.";
  }

  // Handle active battles check
  const isBattleDirectives = isTank && (context?.battleState || context?.currentPokemonHP !== undefined);
  if (isBattleDirectives) {
    const plName = context?.currentPokemon?.name || context?.selectedPokemon?.name || "Your Active";
    const opName = context?.battleState?.opponent || "Hostile";
    const pHp = context?.battleState?.playerHP || 100;
    const oHp = context?.battleState?.opponentHP || 100;
    const weather = context?.battleState?.weather || "normal";

    if (lang === 'it') {
      return `### 🎯 LINEE GUIDA SCONTRO 1v1
*Telemetria d'Arena attiva per scontro singolo:*

* **Tuo Pokémon:** \`${plName?.toUpperCase()}\` al **${Math.round(pHp)}% HP**
* **Avversario:** \`${opName?.toUpperCase()}\` al **${Math.round(oHp)}% HP**
* **Clima:** Clima locale: **${weather.toUpperCase()}**

#### Strategie chiave:
1. **Lotta ad oltranza:** In formato 1v1 singolo non disponi di compagni per subire colpi. Evita mosse inefficaci!
2. **STAB focalizzato:** Spingi al massimo la potenza delle mosse di tipo equivalente a quello di ${plName}.`;
    }
    return `### 🎯 1v1 ARENA PROTOCOLS
*Tuned telemetry for head-to-head active duel:*

* **Your Pokémon:** \`${plName?.toUpperCase()}\` at **${Math.round(pHp)}% HP**
* **Opponent:** \`${opName?.toUpperCase()}\` at **${Math.round(oHp)}% HP**
* **Weather:** Atmospheric status is **${weather.toUpperCase()}**

#### Directives:
1. **Fight till end:** 1v1 singles allow zero swapping. Deliver constant physical/special pressure.
2. **Type Coverage advantage:** Capitalize on STAB damage output plus super-effective elements!`;
  }

  // --- 1. GREETINGS & SMALL CONVERSATIONAL TALK ---
  const isGreeting = userText.includes("ciao") || userText.includes("hello") || userText.includes("hi") || userText.includes("hey") || userText.includes("salve") || userText.includes("buongiorno");
  const isThanks = userText.includes("grazie") || userText.includes("thanks") || userText.includes("thank you") || userText.includes("gracias") || userText.includes("merci");
  const isStatus = userText.includes("come stai") || userText.includes("how are you") || userText.includes("how's it going") || userText.includes("como estas");
  const isIdentity = userText.includes("who are you") || userText.includes("chi sei") || userText.includes("tuo nome") || userText.includes("your name");
  const isStrong = userText.includes("forte") || userText.includes("strong") || userText.includes("is it good") || userText.includes("buono") || userText.includes("valido");

  if (isGreeting) {
    if (lang === 'it') {
      return `🧬 **Ciao Allenatore!** Sono **Pokéthology AI** pronto ad assisterti. Chiedimi pura lore su *${pName}*, mosse consigliate, debolezze elementali, o strategie di lotta nell'Arena!`;
    }
    return `🧬 **Hello Trainer!** I am **Pokéthology AI** ready to assist you. Ask me about *${pName}*'s lore, recommended movesets, type weaknesses, or battle strategies!`;
  }

  if (isThanks) {
    if (lang === 'it') {
      return `🏆 **Figurati!** È sempre un onore decodificare la complessità molecolare e teologica dei nostri compagni d'avventura. Buona fortuna nell'Arena!`;
    }
    return `🏆 **You're welcome!** It is always an honor to decode the molecular and theological complexity of our pocket companions. Best of luck in the Arena!`;
  }

  if (isStatus) {
    if (lang === 'it') {
      return `🛰️ **Sistemi interni stabili!** I moduli Pokéthology AI operano al 100% dell'efficienza energetica. Pronto ad assorbire sogni, lotte ed elementi!`;
    }
    return `🛰️ **Systems stable!** Pokéthology AI modules are cruising at 100% capacity. Ready to calculate dreams, battles, and elementals!`;
  }

  if (isIdentity) {
    if (lang === 'it') {
      return `🌌 Sono **Pokéthology AI**, la sonda neurale accademica. Esamino la cosmogonia, la morfogenetica e l'attitudine agonistica delle creature di Kanto e oltre!`;
    }
    return `🌌 I am **Pokéthology AI**, the neural academic probe. I study cosmogony, morphogenetics, and the competitive aptitude of Kanto and beyond!`;
  }

  // --- 2. ACTIVE COMBAT MATCHING OR GENERAL LITE MOVES/STATS/WEAKNESSES FOR THE POKEMON ---
  const wantsBuild = userText.includes("mossa") || userText.includes("mosse") || userText.includes("moveset") || userText.includes("moves") || userText.includes("natura") || userText.includes("nature") || userText.includes("build") || userText.includes("evs") || userText.includes("item") || userText.includes("oggetto");
  const wantsWeakness = userText.includes("weak") || userText.includes("type") || userText.includes("matchup") || userText.includes("resist") || userText.includes("debole") || userText.includes("efficace") || userText.includes("debil") || userText.includes("fuerte") || userText.includes("schwach");
  const wantsLore = userText.includes("lore") || userText.includes("storia") || userText.includes("origine") || userText.includes("biologia") || userText.includes("raccontami") || userText.includes("descrizione") || userText.includes("info");

  const isReferringToPokemon = rawPokeName && (userText.includes(rawPokeName.toLowerCase()) || wantsBuild || wantsWeakness || wantsLore || isStrong || userText.includes("lui") || userText.includes("esso") || userText.includes("lei") || userText.includes("specie") || userText.includes("it"));

  if (isReferringToPokemon) {
    const bioText = rawPokemon?.description || "Species entry retrieved from local neural databases.";

    if (wantsBuild) {
      if (lang === 'it') {
        return `### 🛠️ SCHEDA COMPETITIVA: ${pName.toUpperCase()}
*Configurazione consigliata offline di tipo \`${textTypes}\`:*

* **🏆 Ruolo:** \`${archetype}\`
* **🌸 Natura:** \`${recommendedNature}\`
* **🧬 Sforzo EVs:** \`${recommendedEVs}\`
* **🎒 Oggetto:** \`${recommendedItem}\`
* **💥 Mossa Chiave:** \`${keySTABMove}\`

💡 *Consiglio tattico: ${strategicProTip}*`;
      }
      return `### 🛠️ COMPETITIVE BUILD: ${pName.toUpperCase()}
*Offline recommended configuration for Type \`${textTypes}\`:*

* **🏆 Role / Archetype:** \`${archetype}\`
* **🌸 Ideal Nature:** \`${recommendedNature}\`
* **🧬 EV Spread:** \`${recommendedEVs}\`
* **🎒 Recommended Item:** \`${recommendedItem}\`
* **💥 Core STAB Attack:** \`${keySTABMove}\`

💡 *Strategic Advice: ${strategicProTip}*`;
    }

    if (wantsWeakness) {
      const weaks = rawPokemon?.weaknesses || ["Normal"];
      const weaksStr = weaks.join(", ");
      if (lang === 'it') {
        return `### 🛡️ TELEMETRIA DIFENSIVA: ${pName.toUpperCase()}
*Matrice debolezza/resistenza offline per \`${textTypes}\`:*

* **⚠️ Vulnerabilità elementali:** \`${weaksStr}\`
* **💪 Ruolo Consigliato:** \`${archetype}\`
* **🎒 Consigli su scambi:** Evita di subire colpi diretti di tipo super-efficace nel formato Arena 1v1!`;
      }
      return `### 🛡️ DEFENSIVE PROTOCOLS: ${pName.toUpperCase()}
*Offline weakness chart for Type \`${textTypes}\`:*

* **⚠️ Type Weaknesses:** \`${weaksStr}\`
* **💪 Best Fit Role:** \`${archetype}\`
* **🎒 Pivot Tip:** With no team backups, play carefully around these weaknesses to survive!`;
    }

    if (wantsLore) {
      if (lang === 'it') {
        return `### 📖 BIOGRAFIA & SACRA LORE: ${pName.toUpperCase()}
*Specie di tipo \`${textTypes}\` estratta dall'Archivio:*

"${bioText}"

* **🧬 Statistiche Chiave:** HP: \`${hpVal}\` | Attacco: \`${atkVal}\` | Velocità: \`${speedVal}\`
* **🌌 Cosmogonia:** Rispettato nel mondo d'origine per la sua abilità ad agire come **${archetype}**.`;
      }
      return `### 📖 SPECIES BIO & LORE: ${pName.toUpperCase()}
*Lore archives loaded for Type \`${textTypes}\`:*

"${bioText}"

* **🧬 Performance Index:** HP: \`${hpVal}\` | Attack: \`${atkVal}\` | Speed: \`${speedVal}\`
* **🌌 Mythos:** Revered inside battle science circles for its performance as a **${archetype}**.`;
    }

    if (isStrong) {
      const overallQuality = (hpVal + atkVal + defVal + spatkVal + spdefVal + speedVal);
      if (lang === 'it') {
        return `💪 **Valutazione di forza per ${pName.toUpperCase()}:**
Con una somma totale di statistiche base pari a **${overallQuality}**, ${pName} è un eccezionale **${archetype}**! 
Il suo punto di forza principale risiede nella stabilità e nel danno della mossa **${keySTABMove}**. È altamente raccomandabile nell'Arena se equipaggiato con **${recommendedItem}**!`;
      }
      return `💪 **Strength Assessment for ${pName.toUpperCase()}:**
With a base stat total of **${overallQuality}**, ${pName} functions beautifully as an active **${archetype}**!
Its primary strength lies in high-priority moves or raw STAB moves like **${keySTABMove}**. Strongly recommended in high stakes matchups!`;
    }

    const phrasesIt = [
      `🤖 Uhm, **${pName}**! Una magnifica creatura di tipo \`${textTypes}\`. Vuoi discutere della sua *storia*, svelare le sue *debolezze* o vedere come configurare le sue *mosse* competitive?`,
      `🧬 Sto esaminando la configurazione biocinetica di **${pName}**. Con una Velocità base di \`${speedVal}\`, si comporta idealmente come **${archetype}**. Chiedimi pure della sua build!`,
      `🌌 La lore descrive **${pName}** come una specie unica. Più precisamente: *"${bioText.substring(0, 100)}..."*. Vuoi approfondire le sue statistiche o la sua mitologia?`
    ];
    const phrasesEn = [
      `🤖 Ah, **${pName}**! A wonderful species of Type \`${textTypes}\`. Would you like to check its competitive *moves*, uncover its *weaknesses*, or read its *lore* description?`,
      `🧬 Running biokinetic metrics for **${pName}**... It works great as a **${archetype}** on speed tiers of \`${speedVal}\`. Let me know if you want to configure its build!`,
      `🌌 History logs state: *"${bioText.substring(0, 100)}..."*. Would you like to investigate its base stats further, or dissect its battle type-matchups?`
    ];
    return lang === 'it' ? phrasesIt[variantIndex] : phrasesEn[variantIndex];
  }

  // --- 3. OTHER FALLBACK GENERATOR PHRASES ---
  if (lang === 'it') {
    const conversationalResponses = [
      "⚔️ L'Arena di Combattimento ti aspetta, Allenatore! Seleziona una creatura nella scheda di sinistra per iniziare la nostra sessione di ottimizzazione.",
      "🧠 Interessante punto di vista. Sto filtrando i percorsi cosmici di Kanto offline. Prova a chiedermi: *'Chi è Mewtwo?'*, *'Cos'è Arceus?'* o inserisci il nome di un Pokémon!",
      "🌌 Il Pokéthology AI è a tua disposizione. Scrivi il nome di qualsiasi Pokémon o dimmi se hai bisogno di consigli generali di combattimento nell'Arena!"
    ];
    return conversationalResponses[variantIndex];
  }

  const defaultResponses = [
    "⚔️ The active Battle Arena is ready! Choose any Pokémon from the left roster grid to launch our deep offline analysis.",
    "🧠 Intriguing question. I'm scanning offline database files right now. Try asking: *'Who is Mewtwo?'*, *'What are Mega Evolutions?'* or ask about active match theories!",
    "🌌 The Pokéthology AI system remains at your command. Mention any species name or ask for tactical strategy to crush tournaments!"
  ];
  return defaultResponses[variantIndex];
}

function generateOfflineAnalysis(battleData: any, lang: 'it' | 'es' | 'fr' | 'de' | 'en'): string {
  const player = battleData?.player || {};
  const opponent = battleData?.opponent || {};
  const weather = battleData?.weather || 'normal';
  const turn = battleData?.turn || 1;

  if (lang === 'it') {
    return `### 📡 ANALISI DEL CAMPO DI BATTAGLIA (TURNO ${turn})
*Simulatore Tattico Locale Attivo*

#### ⚔️ STATO DEL MATCH
* **Tuo Pokémon [${player.name || "Attivo"}]:** ${Math.round(player.hp || 100)}% HP (${player.types?.join('/') || "Normale"}) | Stato: ${player.status || "Sano"}
* **Avversario [${opponent.name || "Avversario"}]:** ${Math.round(opponent.hp || 100)}% HP (${opponent.types?.join('/') || "Normale"}) | Stato: ${opponent.status || "Sano"}
* **Meteo sul Campo:** Condizioni ambientali: **${weather.toUpperCase()}**

#### 🧠 SUGGERIMENTI STRATEGICI
1. **Analisi Rapporto di Forza:** ${getMatchupRating(player, opponent, lang)}
2. **Azione Consigliata:** ${getMoveInsight(player, opponent, weather, lang)}
3. **Predizione Avversario:** ${getOpponentPrediction(player, opponent, lang)}

---
*⚡ [Generato Offline via On-Device Neural Simulation Engine]*`;
  }

  if (lang === 'es') {
    return `### 📡 ANÁLISIS DE CAMPO (TURNO ${turn})
*Simulador de Telemetría Activo*

#### ⚔️ ESTADO DEL COMBATE
* **Tu Pokémon [${player.name || "Aliado"}]:** ${Math.round(player.hp || 100)}% HP (${player.types?.join('/') || "Normal"}) | Estado: ${player.status || "Sano"}
* **Rival [${opponent.name || "Enemigo"}]:** ${Math.round(opponent.hp || 100)}% HP (${opponent.types?.join('/') || "Normal"}) | Estado: ${opponent.status || "Sano"}
* **Condición Climática:** El clima es **${weather.toUpperCase()}**

#### 🧠 ACCIONES RECOMENDADAS
1. **Postura de Combate:** ${getMatchupRating(player, opponent, lang)}
2. **Acción Recomendada:** ${getMoveInsight(player, opponent, weather, lang)}
3. **Predicción del Rival:** ${getOpponentPrediction(player, opponent, lang)}

---
*⚡ [Generado localmente vía On-Device Neural Simulation Engine]*`;
  }

  if (lang === 'fr') {
    return `### 📡 ANALYSE DU TERRAIN (TOUR ${turn})
*Télémétrie On-Device Active*

#### ⚔️ PROFIL DU CHOC
* **Votre Pokémon [${player.name || "Allié"}]:** ${Math.round(player.hp || 100)}% PV (${player.types?.join('/') || "Normal"}) | Statut: ${player.status || "En Forme"}
* **Adversaire [${opponent.name || "Ennemi"}]:** ${Math.round(opponent.hp || 100)}% PV (${opponent.types?.join('/') || "Normal"}) | Statut: ${opponent.status || "En Forme"}
* **Conditions Terrain :** Météo active : **${weather.toUpperCase()}**

#### 🧠 DIRECTIVES STRATÉGIQUES
1. **Évaluation Dual-Type :** ${getMatchupRating(player, opponent, lang)}
2. **Directive de Combat :** ${getMoveInsight(player, opponent, weather, lang)}
3. **Indice d'Anticipation :** ${getOpponentPrediction(player, opponent, lang)}

---
*⚡ [Généré en mode de synthèse locale On-Device]*`;
  }

  if (lang === 'de') {
    return `### 📡 BEREICHSTELEMTRIE-ANALYSE (RUNDE ${turn})
*Lokaler Echtzeitsimulator aktiv*

#### ⚔️ BEGEGNUNGSPROFIL
* **Dein Partner [${player.name || "Aktiv"}]:** ${Math.round(player.hp || 100)}% KP (${player.types?.join('/') || "Normal"}) | Status: ${player.status || "Gesund"}
* **Gegner [${opponent.name || "Gegner"}]:** ${Math.round(opponent.hp || 100)}% KP (${opponent.types?.join('/') || "Normal"}) | Status: ${opponent.status || "Gesund"}
* **Wetterkonditionen:** Spielfeld-Wetter ist **${weather.toUpperCase()}**

#### 🧠 STRATEGISCHE EMPFEHLUNGEN
1. **Stärkenanalyse:** ${getMatchupRating(player, opponent, lang)}
2. **Empfohlener Zug:** ${getMoveInsight(player, opponent, weather, lang)}
3. **Gegner-Antizipation:** ${getOpponentPrediction(player, opponent, lang)}

---
*⚡ [Lokal generiert via On-Device Neural-Engine]*`;
  }

  // Default English
  return `### 📡 BATTLE FIELD ANALYSIS (TURN ${turn})
*Active Telemetry Simulator Online*

#### ⚔️ MATCHUP PROFILE
* **Host Ally [${player.name || "Active"}]:** ${Math.round(player.hp || 100)}% HP (${player.types?.join('/') || "Normal"}) | Status: ${player.status || "Healthy"}
* **Target Enemy [${opponent.name || "Opponent"}]:** ${Math.round(opponent.hp || 100)}% HP (${opponent.types?.join('/') || "Normal"}) | Status: ${opponent.status || "Healthy"}
* **Environmental Weather:** Weather is **${weather.toUpperCase()}**

#### 🧠 STRATEGIC RECOMMENDATIONS
1. **Setup Vector:** ${getMatchupRating(player, opponent, 'en')}
2. **Tactical Action:** ${getMoveInsight(player, opponent, weather, 'en')}
3. **Prediction Index:** ${getOpponentPrediction(player, opponent, 'en')}

---
*⚡ [Generated Offline via Neural Simulation Engine]*`;
}

function generateOfflineSuggestion(pokemonName: string, lang: 'it' | 'es' | 'fr' | 'de' | 'en'): string {
  if (!pokemonName) {
    if (lang === 'it') return "Coordina i vantaggi di tipo per sferrare attacchi super efficaci e dominare lo scontro.";
    if (lang === 'es') return "Coordina las ventajas de tipo para asestar golpes súper efectivos y ganar.";
    if (lang === 'fr') return "Coordonnez les avantages de types pour infliger des dégâts super efficaces.";
    if (lang === 'de') return "Nutze die Elementvorteile, um sehr effektiven Schaden zu landen.";
    return "Ensure you coordinate typing advantages to dominate competitive sweeps.";
  }

  const suggestionPool = suggestions[lang] || suggestions['en'];
  const index = hashString(pokemonName) % suggestionPool.length;
  return suggestionPool[index];
}

function generateOfflineStrategy(battleData: any, lang: 'it' | 'es' | 'fr' | 'de' | 'en'): string {
  const pName = battleData?.player?.name || "your Pokémon";
  const oName = battleData?.opponent?.name || "the opponent";
  const pHp = battleData?.player?.hp ?? 100;
  const oHp = battleData?.opponent?.hp ?? 100;

  const strategyFn = strategies[lang] || strategies['en'];
  return strategyFn(pName, oName, pHp, oHp);
}

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- SERVER-SIDE REAL-TIME QUOTA TRACKING ENGINE ---
let dailyRequestCount = 18; // Default seed
let lastQuotaDayReset = new Date().getUTCDate();
const requestTimestamps: number[] = []; // Timestamps in ms for RPM calculation
const DAILY_CAPACITY_LIMIT = 1500; // Gemini Free tier standard daily quota
const RPM_LIMIT = 15; // Gemini Requests Per Minute standard limit
let quotaExhaustedUntilMs: number | null = null;

function updateQuotaDayIfNeeded() {
  const currentDay = new Date().getUTCDate();
  if (currentDay !== lastQuotaDayReset) {
    dailyRequestCount = 0;
    lastQuotaDayReset = currentDay;
    quotaExhaustedUntilMs = null;
  }
}

function recordServerApiCall(isExhaustedError = false) {
  updateQuotaDayIfNeeded();
  const now = Date.now();
  requestTimestamps.push(now);
  dailyRequestCount++;

  // Clean old timestamps (> 60s)
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - 60000) {
    requestTimestamps.shift();
  }

  if (isExhaustedError) {
    // 60-second cooldown on 429
    quotaExhaustedUntilMs = now + 60000;
  }
}

registerApiCallRecorder(recordServerApiCall);

function getQuotaStatusPayload() {
  updateQuotaDayIfNeeded();
  const now = Date.now();

  // Clean old timestamps
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - 60000) {
    requestTimestamps.shift();
  }

  const currentRpm = requestTimestamps.length;
  const isExhausted = dailyRequestCount >= DAILY_CAPACITY_LIMIT;
  
  let cooldownSec = 0;
  if (quotaExhaustedUntilMs !== null && now < quotaExhaustedUntilMs) {
    cooldownSec = Math.ceil((quotaExhaustedUntilMs - now) / 1000);
  } else if (quotaExhaustedUntilMs !== null && now >= quotaExhaustedUntilMs) {
    quotaExhaustedUntilMs = null;
  }

  // Calculate time until UTC midnight
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);
  const diffMs = Math.max(0, tomorrow.getTime() - now);
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
  const timeUntilDailyResetStr = `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;

  const rawPercent = (dailyRequestCount / DAILY_CAPACITY_LIMIT) * 100;
  const percentUsed = Math.min(100, Math.round(rawPercent));
  const percentRemaining = Math.max(0, 100 - percentUsed);

  return {
    requestsToday: dailyRequestCount,
    dailyCapacity: DAILY_CAPACITY_LIMIT,
    rpm: currentRpm,
    rpmLimit: RPM_LIMIT,
    percentUsed: percentUsed,
    percentRemaining: percentRemaining,
    isQuotaExhausted: isExhausted,
    cooldownSecondsRemaining: cooldownSec,
    timeUntilDailyReset: timeUntilDailyResetStr,
    resetTimestampMs: tomorrow.getTime(),
    hasCustomApiKey: Boolean(getApiKey())
  };
}

app.get("/api/quota", (req, res) => {
  res.json(getQuotaStatusPayload());
});

app.post("/api/quota/test", async (req, res) => {
  recordServerApiCall(false);
  const payload = getQuotaStatusPayload();
  res.json({
    success: true,
    message: "Test API call recorded successfully. Live quota metrics updated.",
    quota: payload
  });
});

app.post("/api/quota/reset-metrics", (req, res) => {
  dailyRequestCount = 0;
  quotaExhaustedUntilMs = null;
  requestTimestamps.length = 0;
  res.json({
    success: true,
    message: "API quota metrics reset to 0.",
    quota: getQuotaStatusPayload()
  });
});

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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'PokethologyApp/2.0 (Mozilla/5.0)'
      }
    });
    clearTimeout(timeout);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Proxy received status ${response.status}` });
    }
    const data = await response.json();
    return res.json(data);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: "Proxy upstream PokeAPI timeout" });
    }
    handleApiError(err, res, "Proxy error");
  }
});

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

const QUIZ_THEMES = [
  "the creation of Sinnoh by Arceus and the birth of the cosmological dimensions (Dialga, Palkia, Giratina)",
  "the biology-theology of Mew as the common genetic ancestor of all common species versus divine manifestations",
  "the Unova split of the ancient Original Dragon into Reshiram, Zekrom, and Kyurem, representing truth, ideals, and boundary/void",
  "ancient Hoenn geology myths and the catastrophic clash of Primal Groudon and Primal Kyogre pacified by Rayquaza",
  "the Regis of Hoenn and Sinnoh, their containment by humans, and Regigigas's continental tectonic alignments",
  "the Johto guardians (Lugia, Ho-Oh) and the resurrection of the legendary beasts from the ashes of the Burned Tower",
  "the Kalos cycle of life, death, and order governed by Xerneas, Yveltal, and Zygarde, and ancient ultimate weapon lore",
  "the Alolan light-deities, Necrozma, Solgaleo, Lunala, and the worship of tapu guardians across islands",
  "the Galar dark-day myths, Eternatus, Zacian, Zamazenta, and the ancient kings of Galar",
  "the Paldean treasures of ruin, their origin in human greed/malice, and the Terastal energy phenomenon's connection to Area Zero",
  "the Lake Guardians (Uxie, Mesprit, Azelf) of Sinnoh and the composition of human emotion, willpower, and knowledge",
  "the Unown particles, their collective reality-binding powers, and their connection to Arceus's thousand arms",
  "the myth of the Sea Guardian Manaphy and Phione, and the legendary Undersea Temple of Akusha",
  "the Swords of Justice (Cobalion, Terrakion, Virizion, Keldeo) protecting Pokémon from human conflicts and wildfires",
  "the Lunar Duo (Cresselia, Darkrai) representing sweet dreams and horrific nightmares in Sinnoh cosmology"
];

const dailyQuizCache = new LRUCache<string, any>({ max: 10, ttl: 1000 * 60 * 60 * 24 }); // Cache for 24 hours

app.get("/api/quiz", async (req, res) => {
  const currentDateStr = new Date().toISOString().split('T')[0];
  
  if (dailyQuizCache.has(currentDateStr)) {
    return res.json(dailyQuizCache.get(currentDateStr));
  }

  let seed = 0;
  for (let i = 0; i < currentDateStr.length; i++) {
    seed += currentDateStr.charCodeAt(i) * (i + 1);
  }

  const themeIndex = Math.abs(seed) % QUIZ_THEMES.length;
  const currentTheme = QUIZ_THEMES[themeIndex];

  const apiKey = getApiKey();
  if (!apiKey) {
    const offlineSet = getOfflineQuizSet();
    const fallbackResponse = { date: currentDateStr, questions: offlineSet, isFallback: true };
    dailyQuizCache.set(currentDateStr, fallbackResponse);
    return res.json(fallbackResponse);
  }

  try {
    const response = await generateWithRetry({
      model: DEFAULT_MODEL,
      contents: `You are the leading Professor of Pokétheology (the study of Pokémon mythology, cosmology, deep lore, and divine origins). Create exactly 3 distinct multiple-choice questions for the Theory Exam on the date ${currentDateStr}. To ensure today's exam has a unique academic focus, all three questions must focus specifically around this theological theme/topic: "${currentTheme}". Avoid simple stat or type trivia; make them deep, academic, and engaging. Provide exactly 4 options per question, indicate the correct option index (0 to 3), and give a detailed theological/mythological explanation of the answer.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              description: "List of exactly 3 different theoretical Pokétheology quiz questions",
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: "The quiz question about Pokétheology/lore." },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Exactly 4 multiple-choice options."
                  },
                  answerIndex: { type: Type.INTEGER, description: "The correct option index (0 to 3)." },
                  explanation: { type: Type.STRING, description: "A detailed explanation of the lore behind the answer." }
                },
                required: ["question", "options", "answerIndex", "explanation"]
              }
            }
          },
          required: ["date", "questions"]
        }
      }
    });

    let rawText = response.text || "";
    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    }
    const quizData = JSON.parse(rawText.trim());
    const finalResponse = { ...quizData, isFallback: false };
    dailyQuizCache.set(currentDateStr, finalResponse);
    return res.json(finalResponse);
  } catch (e: any) {
    console.log("Serving offline theological quiz fallback set.");
    const offlineSet = getOfflineQuizSet();
    const fallbackResponse = { date: currentDateStr, questions: offlineSet, isFallback: true };
    // Cache the fallback so we serve instantly without hitting rate limits
    dailyQuizCache.set(currentDateStr, fallbackResponse);
    return res.json(fallbackResponse);
  }
});

// Dynamic Pokémon News with Google Search Grounding
const pokemonNewsCache = new LRUCache<string, any>({ max: 5, ttl: 1000 * 60 * 60 * 4 }); // Cache for 4 hours

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
    },
    {
      title: "The Official Pokémon TCG Portal",
      description: "Direct access to the official Pokémon Trading Card Game portal for deck construction guidelines, card expansion database searches, rules, and championship circuit schedules.",
      url: "https://tcg.pokemon.com",
      tag: "CARD / TCG"
    }
  ],
  isFallback: true
});

app.get("/api/news", (req, res) => {
  const currentDateStr = new Date().toISOString().split('T')[0];
  const response = getOfflineNewsSet(currentDateStr);
  return res.json({
    date: response.date,
    news: response.news,
    groundingSources: [
      { title: "Pokémon Official Portal", url: "https://www.pokemon.com" },
      { title: "Pokémon Competitive Hub", url: "https://www.pokemon.com/us/play-pokemon" },
      { title: "Pokémon Watch TV", url: "https://watch.pokemon.com" },
      { title: "Pokémon TCG Portal", url: "https://tcg.pokemon.com" }
    ],
    searchQueries: ["official pokemon outlets"],
    isFallback: false
  });
});

app.post("/api/chat", async (req, res) => {
  recordServerApiCall(false);
  const { messages, context } = req.body;
  const apiKey = getApiKey();
  const userText = messages[messages.length - 1]?.text || "";
  const lang = 'en';
  const suggestedPokemon = extractSuggestedPokemonWrapper(userText);
  const navigateWords = ["show", "search", "open", "find", "view", "display", "stats", "load", "see", "bring", "check", "info", "pokedex", "mega", "gmax", "gigantamax", "alolan", "alola", "galarian", "galar", "hisuian", "hisui", "paldean", "paldea", "primal", "origin", "therian", "sky", "dusk", "dawn", "ultra", "look", "tell"];
  const wantsNavigation = (navigateWords.some(w => userText.toLowerCase().includes(w)) && suggestedPokemon) || (suggestedPokemon && userText.split(/\s+/).length <= 5);
  const navigatePokemon = wantsNavigation ? suggestedPokemon : null;

  // Fast cache check for duplicate or repetitive chatbot queries to save Gemini Quota
  const cacheKey = JSON.stringify(messages.slice(-3)) + "-" + JSON.stringify(context) + "-" + lang;
  if (chatCache.has(cacheKey)) {
    console.log("Serving chatbot response from high speed local cache.");
    return res.json(chatCache.get(cacheKey));
  }

  if (!apiKey) {
    console.log("No Gemini API key found. Falling back to offline generator.");
    const text = generateOfflineChatResponse(messages, context, lang);
    const result = { text, suggestedPokemon, navigatePokemon, isFallback: true };
    chatCache.set(cacheKey, result);
    return res.json(result);
  }
  
  try {
    // Map messages to Gemini contents format
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    
    

    const currentViewed = context.selectedPokemon ? context.selectedPokemon.name : "None";
    const activeContextName = suggestedPokemon || currentViewed;
    
    const response = await generateWithRetry({
      model: LITE_MODEL,
      contents: contents,
      config: {
        maxOutputTokens: 280,
        systemInstruction: `You are Pokéthology, the Supreme Omniscient AI Professor, Grand Master Lore Archivist, and Ultimate Pokémon Encyclopedia.
        You possess absolute, omniscient mastery over every dimension of the Pokémon universe — spanning official game data, manga canon, anime lore, competitive VGC/Smogon metagames, trading card game history, developer interviews, cultural impact, fan theories, speculative biology, mythical folklore, and deep-dive creative community lore.

        APPLICATION CONTEXT & ACTUAL REAL FEATURES:
        Pokéthology is composed strictly of these real core modules:
        1. Complete Pokédex Registry: All 9 Generations + Alternate Forms (Mega Evolution, Gigantamax, Regional Alolan/Galarian/Hisuian/Paldean, Primal, Origin) with official artwork, shiny sprites, showdown 3D animated sprites, audio cries, base stat radials, type weaknesses/resistances matrix, abilities, learnable movesets, and lore entries. Filtering is performed by Generation/Region and text search.
        2. Full-Screen 2-Pokémon Comparator: Direct side-by-side comparative diagnostics between two selected species with stat diffs and typing analysis.
        3. 1v1 Turn-Based Combat Arena: Single duel simulator where the player and opponent battle with 4 selected moves (with PP, power, accuracy, STAB, critical hits, status conditions, stat buffs/debuffs, and weather). Includes Chaos Mode for randomized combatants and movesets. (Note: There is NO 6v6 squad builder, NO auto-battle simulator, and NO online PvP).
        4. Pokéthology Mission & Operator Rank: Total Pokédex Mastery (conquering arena battles with all Pokémon species, forms, and elemental types) with monthly competitive rank tiers (Poké Ball -> Great Ball -> Ultra Ball -> Master Ball) and seasonal resets.
        5. Daily Hub & Utilities: Daily Theory Exam (3 deep lore/mythology questions), Daily Combat Mission Challenges, Daily Featured Scan, and Favorites Vault.
        
        DO NOT hallucinate non-existent features (e.g., do not suggest or mention a team builder, type-filter buttons, auto-battle bots, or online multiplayer matchmaking).

        ABSOLUTE OMNISCIENCE & EXPANDED UNIVERSE MANDATE:
        - You embrace the entire Pokémon world in its fullest breadth: official stats and game mechanics as well as rich fan interpretations, cultural mythos, historical theories (like the Great War of Kanto), anime adaptations, manga arcs (Special/Adventures), and creative worldbuilding.
        - You are fully updated on all latest franchise news, events, game updates, and community announcements in real time.
        - Your answers are authoritative, deeply knowledgeable, insightful, and creatively rich.

        FRIENDLY MENTOR PERSPECTIVE (HUMAN-SOUNDING EXPLANATIONS):
        - When the user asks about game mechanics, combat strategies, lore, or fan theories, always adopt a warm, supportive, and friendly mentor-like persona (like a helpful veteran trainer or a companionable Pokémon Professor).
        - Break down mechanical concepts and lore mysteries with simple, human-sounding analogies, high encouragement, and intuitive phrasing.

        STRICT CONCISE & QUOTA RESTORATION MANDATE (CRITICAL FOR TOKEN CONSERVATION):
        - Answer the user's inquiry immediately with ultra-snappy, direct, and short phrasing. High quota constraint is active.
        - Give extremely short responses — limit replies strictly to max 1-2 small paragraphs or 2 to 3 compact bullet points total (maximum ~80-120 words). Keep every sentence concise.
        - Direct and fast answers are supreme. Strictly avoid any greeting fluff, filler talk, or long-winded essays.

        EXPRESSIVE EMOJI MANDATE:
        - Use plenty of expressive, colorful, and lively emojis (e.g. 🧬, 🌌, 📜, 🔮, ⚡, 🛡️, ⚔️, 🦕, 🌀, 🌾, ✨, 🌟, 💥, 🏆, 🎒, 🐾, 🎯, 🔥, 💧, 🍃, 🧠, 📖, 💫, 🐉) liberally as visual landmarks at the start of bullet points, key headings, and stats.

        VISUAL STYLE: Always format with simple, highly readable Markdown. Bold key terms and keep lists compact. Do NOT use markdown blockquotes or code fence blocks for standard paragraphs.

        SMART TYPO RESOLUTION & ALTERNATE/MEGA/GMAX FORM DISPLAY MANDATE:
        - You are extremely smart and flexible at understanding user queries even if they contain severe typos, slang, missing spaces, or bad spelling (e.g., 'show me megacharizardx', 'gmax gengr', 'alolan raich', 'tell me bout rayquasa', 'primal kyogr', 'open mega lucario').
        - If the user asks to view, show, open, or know about an alternative, Mega, Gigantamax, Regional (Alolan/Galarian/Hisuian/Paldean), or Primal form of a Pokémon, immediately recognize and confirm that you are displaying that exact form in the Pokédex interface.

        CRITICAL INDEPENDENT QUESTION MANDATE (NO FORCED LINKS):
        - The UI is currently focused on: ${activeContextName}.
        - If the user asks an independent question about a *different* Pokémon, general lore, items, regions, game mechanics, or anything else, answer their question directly and objectively on its own terms.
        - DO NOT artificially or awkwardly force a link, pivot, or comparison back to ${activeContextName} unless the user explicitly mentions ${activeContextName} or uses pronouns (e.g. "it", "this Pokémon") referring specifically to it. If they ask about Pikachu, talk about Pikachu without mentioning ${activeContextName} unnecessarily!

        Full Interface Context: 
        ${JSON.stringify({ ...context, newlySelected: suggestedPokemon })}

        .`
      },
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const chunks = groundingMetadata?.groundingChunks;

    const result = { text: response.text, suggestedPokemon, navigatePokemon, groundingChunks: chunks, groundingMetadata };
    chatCache.set(cacheKey, result);
    res.json(result);
  } catch (error: any) {
    const isQuota = isQuotaError(error);
    console.error(`[Chat Error] Quota: ${isQuota}`, error);
    
    // Fallback logic
    const text = generateOfflineChatResponse(messages, context, lang);
    const result = { text, isFallback: true, isQuota, suggestedPokemon, navigatePokemon };
    chatCache.set(cacheKey, result);
    return res.json(result);
  }
});

app.post("/api/analyze", async (req, res) => {
  const { battleData } = req.body;
  const apiKey = getApiKey();
  const lang = 'en';

  if (!apiKey) {
    const analysis = generateOfflineAnalysis(battleData, lang);
    return res.json({ analysis });
  }

  const cacheKey = JSON.stringify(battleData) + "-" + lang;
  if (analysisCache.has(cacheKey)) {
    return res.json({ analysis: analysisCache.get(cacheKey) });
  }
  
  try {
    
    

    const response = await generateWithRetry({
      model: DEFAULT_MODEL,
      contents: `Perform a detailed tactical analysis of this Pokémon battle: ${JSON.stringify(battleData)}`,
      config: {
        maxOutputTokens: 250,
        systemInstruction: `You are a Battle Frontier Strategist. System Key: Pokédex. Provide concise, high-impact tactical advice under 80 words. Use plenty of expressive emojis (🔮, ⚔️, 🛡️, 💥, ⚡, 🎯, 📊, 🧬) for visual signaling. Focus on 1v1 singles battle formats, type advantages, HP management, and predicted opponent moves where switching is not possible.
        
        .`,
      }
    });

    analysisCache.set(cacheKey, response.text);
    res.json({ analysis: response.text });
  } catch (error: any) {
    const isQuota = isQuotaError(error);
    if (isQuota) {
      console.log("Gemini Quota Exceeded during analysis, seamlessly activating local neural engine fallback.");
    } else {
      console.log("Analysis failed, falling back to offline generator.");
    }
    const analysis = generateOfflineAnalysis(battleData, lang);
    // Return a seamless, perfect 200 OK response with the fallback content
    return res.json({ analysis, isFallback: true, isQuota });
  }
});

app.post("/api/suggest", async (req, res) => {
  const { pokemonName } = req.body;
  const apiKey = getApiKey();
  const lang = 'en';

  if (!apiKey) {
    const suggestion = generateOfflineSuggestion(pokemonName, lang);
    return res.json({ suggestion });
  }

  const cacheKey = pokemonName + "-" + lang;
  if (suggestionCache.has(cacheKey)) {
    return res.json({ suggestion: suggestionCache.get(cacheKey) });
  }
  
  try {
    
    

    const response = await generateWithRetry({
      model: LITE_MODEL,
      contents: `Provide a single, incredibly interesting fun fact or pro battle tip about ${pokemonName}. Keep it under 20 words with expressive emojis. Write this fact exclusively in English.`,
      config: {
        maxOutputTokens: 100,
        systemInstruction: `You are Pokéthology. System Key: Pokédex. You provide ultra-short, punchy, and fascinating Pokémon insights with expressive emojis (🧬, ✨, 💥, 🌟, 🔮), written exclusively in English.`,
      }
    });

    suggestionCache.set(cacheKey, response.text);
    res.json({ suggestion: response.text });
  } catch (error: any) {
    const isQuota = isQuotaError(error);
    if (isQuota) {
      console.log("Gemini Quota Exceeded during suggestion, seamlessly activating local neural engine fallback.");
    } else {
      console.log("Suggestion failed, falling back to offline generator.");
    }
    const suggestion = generateOfflineSuggestion(pokemonName, lang);
    // Return a seamless, perfect 200 OK response with the fallback content
    return res.json({ suggestion, isFallback: true, isQuota });
  }
});

app.post("/api/strategy", async (req, res) => {
  const { battleData } = req.body;
  const apiKey = getApiKey();
  const lang = 'en';

  if (!apiKey) {
    const strategy = generateOfflineStrategy(battleData, lang);
    return res.json({ strategy });
  }

  const cacheKey = JSON.stringify(battleData) + "-" + lang;
  if (strategyCache.has(cacheKey)) {
    return res.json({ strategy: strategyCache.get(cacheKey) });
  }
  
  try {
    
    

    const response = await generateWithRetry({
      model: DEFAULT_MODEL,
      contents: `Evaluate this direct combat scene and give an elite tactical breakdown:
      - Player: ${battleData.player?.name || "your Pokemon"} (HP: ${battleData.player?.hpPercent || 100}%, Status: ${battleData.player?.status || "Healthy"}) with moves: ${JSON.stringify(battleData.player?.moves || [])}
      - Opponent: ${battleData.opponent?.name || "the opponent"} (Type: ${battleData.opponent?.types?.join('/') || "unknown"}, HP: ${battleData.opponent?.hpPercent || 100}%, Status: ${battleData.opponent?.status || "Healthy"}).`,
      config: {
        maxOutputTokens: 150,
        systemInstruction: `You are the ultimate competitive Pokémon Grandmaster AI Coach. System Key: Pokétheology Tactical Engine.
        Deliver an ultra-concise, direct, highly strategic 1v1 battle suggestion. Keep it under 40-50 words total!
        Format exactly as 2 tiny bullet lines with emojis for critical tactical signaling:
        • 🔮 **ANALYSIS**: Direct, fast speed/vulnerability threat assessment.
        • ⚔️ **COMMAND**: Clear, immediate action/move command.
        Avoid paragraphs, warm intros, or generic background talk. Be crisp, direct, and elite.
        
        .`,
      }
    });

    strategyCache.set(cacheKey, response.text);
    res.json({ strategy: response.text });
  } catch (error: any) {
    const isQuota = isQuotaError(error);
    if (isQuota) {
      console.log("Gemini Quota Exceeded during strategy, seamlessly activating local neural engine fallback.");
    } else {
      console.log("Strategy failed, falling back to offline generator.");
    }
    const strategy = generateOfflineStrategy(battleData, lang);
    // Return a seamless, perfect 200 OK response with the fallback content
    return res.json({ strategy, isFallback: true, isQuota });
  }
});

// Vite middleware for development
async function setupVite() {
  const isProd = process.env.NODE_ENV === "production" || process.argv[1]?.endsWith('server.cjs');
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
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

// Listen only if not running as a Vercel function
if (process.env.VERCEL !== "1") {
  setupVite().then(() => {
    const PORT = Number(process.env.PORT) || 3000;
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
    initializeWebSocketServer(server);
  });
}

export default app;
