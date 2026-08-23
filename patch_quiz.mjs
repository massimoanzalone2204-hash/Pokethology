import fs from 'fs';
let content = fs.readFileSync('src/components/PokethologyQuizWidget.tsx', 'utf-8');

const target = `    if (isCorrect) {
      try { sounds.success(); } catch (_) {}
    } else {`;

const replacement = `    if (isCorrect) {
      try { sounds.success(); } catch (_) {}
      try {
        let stats = JSON.parse(localStorage.getItem('Pokethology_MissionStats') || '{"pokemonWins":{}, "typeWins":{}, "hubCompletions":0, "examCompletions":0}');
        stats.examCompletions = (stats.examCompletions || 0) + 1;
        localStorage.setItem('Pokethology_MissionStats', JSON.stringify(stats));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error("Error updating exam stats", e);
      }
    } else {`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/PokethologyQuizWidget.tsx', content);
