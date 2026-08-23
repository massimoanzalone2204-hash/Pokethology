import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `                  const isFinished = newProgress >= challenge.required;
                  
                  if (isFinished) {`;

const replacement = `                  const isFinished = newProgress >= challenge.required;
                  const wasFinished = currentProgress >= challenge.required;
                  
                  if (isFinished) {
                    if (!wasFinished) {
                      try {
                        let stats = JSON.parse(localStorage.getItem('Pokethology_MissionStats') || '{"pokemonWins":{}, "typeWins":{}, "hubCompletions":0, "examCompletions":0}');
                        stats.hubCompletions = (stats.hubCompletions || 0) + 1;
                        localStorage.setItem('Pokethology_MissionStats', JSON.stringify(stats));
                        window.dispatchEvent(new Event('storage'));
                      } catch (e) {
                        console.error("Error updating hub stats", e);
                      }
                    }`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
