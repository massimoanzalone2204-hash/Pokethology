
export function getEditDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array.from(Array(a.length + 1), () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

export function extractSuggestedPokemon(text: string, pokemonNamesList: string[]): string | null {
  if (!pokemonNamesList || !pokemonNamesList.length) return null;
  
  const rawText = text.toLowerCase().trim();
  if (!rawText) return null;

  // Form detection patterns & mapping
  let formSuffix: string | null = null;

  if (/\bmega[- ]?x\b|\bmegax\b/.test(rawText)) {
    formSuffix = '-mega-x';
  } else if (/\bmega[- ]?y\b|\bmegay\b/.test(rawText)) {
    formSuffix = '-mega-y';
  } else if (/\bmega[- ]?z\b|\bmegaz\b/.test(rawText)) {
    formSuffix = '-mega-z';
  } else if (/\bmega\b|\bmega[-]/i.test(rawText) || rawText.startsWith('mega')) {
    formSuffix = '-mega';
  } else if (/\bgmax\b|\bg-max\b|\bgigantamax\b/.test(rawText) || rawText.startsWith('gmax')) {
    formSuffix = '-gmax';
  } else if (/\balolan\b|\balola\b/.test(rawText) || rawText.startsWith('alolan') || rawText.startsWith('alola')) {
    formSuffix = '-alola';
  } else if (/\bgalarian\b|\bgalar\b/.test(rawText) || rawText.startsWith('galarian') || rawText.startsWith('galar')) {
    formSuffix = '-galar';
  } else if (/\bhisuian\b|\bhisui\b/.test(rawText) || rawText.startsWith('hisuian') || rawText.startsWith('hisui')) {
    formSuffix = '-hisui';
  } else if (/\bpaldean\b|\bpaldea\b/.test(rawText) || rawText.startsWith('paldean') || rawText.startsWith('paldea')) {
    formSuffix = '-paldea';
  } else if (/\bprimal\b/.test(rawText) || rawText.startsWith('primal')) {
    formSuffix = '-primal';
  } else if (/\borigin\b/.test(rawText)) {
    formSuffix = '-origin';
  } else if (/\btherian\b/.test(rawText)) {
    formSuffix = '-therian';
  } else if (/\bsky\b/.test(rawText)) {
    formSuffix = '-sky';
  } else if (/\bdusk\b|\bduskmane\b|\bdusk-mane\b/.test(rawText)) {
    formSuffix = '-dusk';
  } else if (/\bdawn\b|\bdawnwings\b|\bdawn-wings\b/.test(rawText)) {
    formSuffix = '-dawn';
  } else if (/\bultra\b/.test(rawText)) {
    formSuffix = '-ultra';
  } else if (/\bcrowned\b/.test(rawText)) {
    formSuffix = '-crowned';
  } else if (/\bunbound\b/.test(rawText)) {
    formSuffix = '-unbound';
  }

  // Pre-clean text: split concatenated form words if present e.g. "megacharizardx" -> "mega charizard x"
  let cleanedText = rawText
    .replace(/\bmega([a-z]+)x\b/g, 'mega $1 x')
    .replace(/\bmega([a-z]+)y\b/g, 'mega $1 y')
    .replace(/\bmega([a-z]+)\b/g, 'mega $1')
    .replace(/\bgmax([a-z]+)\b/g, 'gmax $1')
    .replace(/\bgigantamax([a-z]+)\b/g, 'gigantamax $1')
    .replace(/\balolan([a-z]+)\b/g, 'alolan $1')
    .replace(/\bgalarian([a-z]+)\b/g, 'galarian $1')
    .replace(/\bhisuian([a-z]+)\b/g, 'hisuian $1')
    .replace(/\bpaldean([a-z]+)\b/g, 'paldean $1')
    .replace(/\bprimal([a-z]+)\b/g, 'primal $1');

  const words = cleanedText
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  const ignoredWords = new Set([
    "lore", "stats", "moves", "what", "how", "who", "when", "why", "tell", "show", "best", "weak",
    "strong", "counter", "usage", "moveset", "pokemon", "the", "and", "for", "with", "against", "about",
    "me", "of", "please", "can", "you", "find", "search", "get", "view", "display", "page", "schedule",
    "mega", "gmax", "gigantamax", "alolan", "alola", "galarian", "galar", "hisuian", "hisui", "paldean",
    "paldea", "primal", "origin", "therian", "sky", "dusk", "dawn", "ultra", "crowned", "unbound", "form",
    "forme", "variant", "evolution", "mode", "see", "open", "load", "bring", "check", "info", "pokedex",
    "look", "at", "where", "is", "a", "an", "x", "y", "z"
  ]);

  let bestBaseMatch: string | null = null;
  let highestScore = 0;

  for (const word of words) {
    if (word.length < 3 || ignoredWords.has(word)) continue;

    for (const pName of pokemonNamesList) {
      const cleanPName = pName.toLowerCase();
      let score = 0;

      if (word === cleanPName) {
        score = 100;
      } else if (word.length >= 4 && cleanPName.length >= 4 && (cleanPName.startsWith(word) || word.startsWith(cleanPName))) {
        score = 85;
      } else if (word.length >= 4 && cleanPName.length >= 4 && (cleanPName.includes(word) || word.includes(cleanPName))) {
        score = 75;
      } else {
        const dist = getEditDistance(word, cleanPName);
        let allowedDist = 0;
        if (cleanPName.length <= 3) {
          allowedDist = 0;
        } else if (cleanPName.length <= 5) {
          allowedDist = 1;
        } else if (cleanPName.length <= 8) {
          allowedDist = 2;
        } else {
          allowedDist = 3;
        }

        if (dist <= allowedDist) {
          score = Math.max(15, 70 - dist * 15);
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestBaseMatch = pName;
      }
    }
  }

  if (highestScore < 35) {
    for (const pName of pokemonNamesList) {
      if (pName.length >= 4 && cleanedText.includes(pName)) {
        bestBaseMatch = pName;
        highestScore = 80;
        break;
      }
    }
  }

  if (!bestBaseMatch || highestScore < 30) return null;

  if (formSuffix) {
    if (bestBaseMatch === 'charizard' && formSuffix === '-mega') {
      if (rawText.includes('y')) return 'charizard-mega-y';
      return 'charizard-mega-x';
    }
    if (bestBaseMatch === 'mewtwo' && formSuffix === '-mega') {
      if (rawText.includes('y')) return 'mewtwo-mega-y';
      return 'mewtwo-mega-x';
    }
    return `${bestBaseMatch}${formSuffix}`;
  }

  return bestBaseMatch;
}
