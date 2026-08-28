import { EvolutionNode } from '../types';

export const OFFLINE_QUIZ_FALLBACK = {
  date: new Date().toISOString().split('T')[0],
  isFallback: true,
  questions: [
    {
      question: "Who is considered the 'Renegade Pokemon' in Sinnoh cosmology, banished due to its violent nature?",
      options: ["Kyurem", "Giratina", "Necrozma", "Darkrai"],
      answerIndex: 1,
      explanation: "Giratina was created alongside Dialga and Palkia but was banished to the Distortion World by Arceus due to its exceptionally violent and destructive nature. It represents antimatter and gravity."
    },
    {
      question: "According to ancient legends, Mew is the genetic ancestor of all Pokemon, but why does Arceus precede Mew in mythology?",
      options: [
        "Mew was created by human scientists to clone Arceus",
        "Arceus is the creator deity who hatched from an egg in nothingness, and Mew represents the ancestor of all common mortal species",
        "Mew and Arceus fought in a primordial war, and Mew lost",
        "Arceus is actually an evolved form of Mew"
      ],
      answerIndex: 1,
      explanation: "Arceus is the divine prime creator who hatched from the cosmic egg in a void of nothingness, whereas Mew acts as the biological stem-ancestor containing the DNA of all non-deity Pokemon."
    },
    {
      question: "The Lake Guardians (Uxie, Mesprit, and Azelf) were birthed from a single egg. What core philosophical aspects of the human spirit do they govern?",
      options: ["Body, Mind, and Soul", "Time, Space, and Matter", "Knowledge, Emotion, and Willpower", "Truth, Ideals, and Void"],
      answerIndex: 2,
      explanation: "Created by Arceus, Uxie governs Knowledge (giving humans mind), Mesprit governs Emotion (giving humans heart), and Azelf governs Willpower (giving humans resolve)."
    }
  ]
};

let globalPrefetchedQuiz: any = null;

if (typeof window !== 'undefined') {
  fetch('/api/quiz')
    .then(r => {
      if (r.ok) return r.json();
      throw new Error();
    })
    .then(d => {
      globalPrefetchedQuiz = d;
    })
    .catch(() => {});
}

// PokethologyQuizWidget is imported from ./components/PokethologyQuizWidget




export const statNameMap: Record<string, string> = {
  'hp': 'HP',
  'attack': 'Attack',
  'defense': 'Defense',
  'special-attack': 'Special Attack',
  'special-defense': 'Special Defense',
  'speed': 'Speed'
};

export const getEvolutionLineInfo = (node: any): { names: string[], stagesCount: number } => {
  if (!node) return { names: [], stagesCount: 0 };
  const names: string[] = [];
  
  const traverse = (n: any) => {
    if (n && n.name) {
      names.push(n.name);
    }
    if (n && n.evolves_to && n.evolves_to.length > 0) {
      n.evolves_to.forEach(traverse);
    }
  };
  
  traverse(node);
  
  const getDepth = (n: any): number => {
    if (!n || !n.evolves_to || n.evolves_to.length === 0) return 1;
    return 1 + Math.max(...n.evolves_to.map((child: any) => getDepth(child)));
  };
  
  const stagesCount = getDepth(node);
  return { names, stagesCount };
};


