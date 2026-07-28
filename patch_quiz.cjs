const fs = require('fs');
let code = fs.readFileSync('server/websocket.ts', 'utf8');

const newQuestions = `[
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
          ]`;

code = code.replace(/const triviaQuestions = \[[\s\S]*?\];/, "const triviaQuestions = " + newQuestions + ";");
fs.writeFileSync('server/websocket.ts', code, 'utf8');
