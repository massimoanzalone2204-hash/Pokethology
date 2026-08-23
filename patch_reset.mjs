import fs from 'fs';

// App.tsx Daily Hub
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
const hubTarget = `let stats = JSON.parse(localStorage.getItem('Pokethology_MissionStats') || '{"pokemonWins":{}, "typeWins":{}, "hubCompletions":0, "examCompletions":0}');`;
const hubReplacement = `let stats = JSON.parse(localStorage.getItem('Pokethology_MissionStats') || '{"pokemonWins":{}, "typeWins":{}, "hubCompletions":0, "examCompletions":0}');
                        const currentMonth = new Date().toISOString().slice(0, 7);
                        if (stats.lastResetMonth !== currentMonth) {
                          stats = { pokemonWins: {}, typeWins: {}, hubCompletions: 0, examCompletions: 0, lastResetMonth: currentMonth };
                        }`;
appContent = appContent.replace(hubTarget, hubReplacement);
fs.writeFileSync('src/App.tsx', appContent);

// Quiz
let quizContent = fs.readFileSync('src/components/PokethologyQuizWidget.tsx', 'utf-8');
quizContent = quizContent.replace(hubTarget, hubReplacement);
fs.writeFileSync('src/components/PokethologyQuizWidget.tsx', quizContent);

