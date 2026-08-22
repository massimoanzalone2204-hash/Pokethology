const TRAINER_SPRITES = [
  {
    "name": "Brock",
    "id": "brock",
    "role": "Gym Leader",
    "lore": "The Rock-Solid Pok\u00e9mon Trainer. As the Pewter City Gym Leader, he acts as a wall of defense for challengers, believing in the unbreakable spirit of Rock-type Pok\u00e9mon and their enduring fortitude against any storm."
  },
  {
    "name": "Misty",
    "id": "misty",
    "role": "Gym Leader",
    "lore": "The Tomboyish Mermaid of Cerulean City. A fierce Water-type specialist whose tactics flow like a raging river. She balances grace and power, demanding absolute respect for the depths of water strategy."
  },
  {
    "name": "Lt. Surge",
    "id": "ltsurge",
    "role": "Gym Leader",
    "lore": "The Lightning American. A veteran of a vague, historic Pok\u00e9mon war, he uses his military discipline to command Electric-type Pok\u00e9mon with shocking precision and explosive speed from his Vermilion City Gym."
  },
  {
    "name": "Erika",
    "id": "erika",
    "role": "Gym Leader",
    "lore": "The Nature-Loving Princess. A practitioner of traditional flower arrangement in Celadon City. She finds true elegance in Grass-type Pok\u00e9mon, preferring battles that bloom with natural beauty and tranquility."
  },
  {
    "name": "Koga",
    "id": "koga",
    "role": "Gym Leader",
    "lore": "The Poisonous Ninja Master. Relying on confusion, toxins, and shadows, this Fuchsia City Gym Leader treats Pok\u00e9mon battling as an extension of the ancient ninja arts, striking when his foes are least prepared."
  },
  {
    "name": "Sabrina",
    "id": "sabrina",
    "role": "Gym Leader",
    "lore": "The Master of Psychic Pok\u00e9mon. A psychic prodigy from Saffron City who communicates telepathically with her Pok\u00e9mon. She foresaw your arrival and believes that true power lies in the untethered mind."
  },
  {
    "name": "Blaine",
    "id": "blaine",
    "role": "Gym Leader",
    "lore": "The Hotheaded Quiz Master. Living on the volcanic Cinnabar Island, this eccentric Fire-type specialist combines his passion for riddles with the searing heat of his beloved fiery companions."
  },
  {
    "name": "Giovanni",
    "id": "giovanni",
    "role": "Gym Leader",
    "lore": "The enigmatic boss of Team Rocket and the former Viridian City Gym Leader. A ruthless mastermind who views Pok\u00e9mon primarily as tools for absolute domination and financial conquest."
  },
  {
    "name": "Lorelei",
    "id": "lorelei",
    "role": "Elite Four",
    "lore": "An elite master of Ice-type Pok\u00e9mon. Hailing from the Sevii Islands, her analytical combat style is as cold and calculating as a glacier, freezing challengers in their tracks at the Indigo Plateau."
  },
  {
    "name": "Bruno",
    "id": "bruno",
    "role": "Elite Four",
    "lore": "A dedicated martial artist who trains his own body alongside his Fighting-type Pok\u00e9mon. He believes that pushing the physical limits is the only path to discovering true inner strength."
  },
  {
    "name": "Agatha",
    "id": "agatha",
    "role": "Elite Four",
    "lore": "An elderly but deeply formidable former rival to Professor Oak. She relies on the terrifying, deceptive nature of Ghost-type Pok\u00e9mon to remind younger generations that age only sharpens one's venom."
  },
  {
    "name": "Lance",
    "id": "lance",
    "role": "Champion",
    "lore": "The venerable Dragon Master of Blackthorn City. As a member of the Elite Four and later a Champion, he unleashes the mythical, untamed fury of Dragon-type Pok\u00e9mon to uphold justice across the regions."
  },
  {
    "name": "Falkner",
    "id": "falkner",
    "role": "Gym Leader",
    "lore": "The Elegant Master of Flying Pok\u00e9mon. Inheriting the Violet City Gym from his father, he commands the skies and fiercely defends the honor of Flying-types against those who underestimate them."
  },
  {
    "name": "Bugsy",
    "id": "bugsy",
    "role": "Gym Leader",
    "lore": "The Walking Bug Pok\u00e9mon Encyclopedia. Despite his youth, this Azalea Town prodigy has dedicated his life to researching the hidden potential and evolutionary wonders of Bug-type Pok\u00e9mon."
  },
  {
    "name": "Whitney",
    "id": "whitney",
    "role": "Gym Leader",
    "lore": "The Incredibly Pretty Girl of Goldenrod City! Don't let her tears fool you\u2014her Normal-type Pok\u00e9mon are notoriously resilient, utilizing relentless tactics like Rollout to crush unsuspecting challengers."
  },
  {
    "name": "Morty",
    "id": "morty",
    "role": "Gym Leader",
    "lore": "The Mystic Seer of the Future. Stationed in Ecruteak City, he has dedicated his life to studying the legends of Ho-Oh, communicating with Ghost-types to pierce the veil between the physical and spiritual realms."
  },
  {
    "name": "Chuck",
    "id": "chuck",
    "role": "Gym Leader",
    "lore": "His Roaring Fists Do the Talking. Training endlessly under the crashing waterfalls of Cianwood City, this Fighting-type Gym Leader channels the raw, unyielding power of nature into his Pok\u00e9mon's strikes."
  },
  {
    "name": "Jasmine",
    "id": "jasmine",
    "role": "Gym Leader",
    "lore": "The Steel-Clad Defense Girl. Initially timid and caring, she hardens her resolve in battle, directing her defensively impenetrable Steel-type Pok\u00e9mon to stand firm as the lighthouse of Olivine City."
  },
  {
    "name": "Pryce",
    "id": "pryce",
    "role": "Gym Leader",
    "lore": "The Teacher of Winter's Harshness. A veteran who has seen many bitter winters, this Mahogany Town Gym Leader uses Ice-types to test the inner warmth and unyielding willpower of the younger generations."
  },
  {
    "name": "Clair",
    "id": "clair",
    "role": "Gym Leader",
    "lore": "The Blessed User of Dragon Pok\u00e9mon. Proud, fiercely competitive, and demanding, she expects perfection from her challengers, reigning over the Blackthorn Gym with the overwhelming might of her dragons."
  },
  {
    "name": "Roxanne",
    "id": "roxanne",
    "role": "Gym Leader",
    "lore": "The Rock-Loving Scholar. A top graduate of the Pok\u00e9mon Trainer's School, she approaches battles with academic rigor, testing her textbook strategies through her sturdy Rock-type Pok\u00e9mon."
  },
  {
    "name": "Brawly",
    "id": "brawly",
    "role": "Gym Leader",
    "lore": "A big wave in motion! Surfing the tides of Dewford Town, he applies the fluidity of the ocean to his martial arts, instructing his Fighting-type Pok\u00e9mon to absorb impact and counterattack."
  },
  {
    "name": "Wattson",
    "id": "wattson",
    "role": "Gym Leader",
    "lore": "The cheerfully electrifying man! A jovial inventor who revolutionized Mauville City, he greets every battle with a hearty laugh, sparking joy and high-voltage tactics with his Electric-type Pok\u00e9mon."
  },
  {
    "name": "Flannery",
    "id": "flannery",
    "role": "Gym Leader",
    "lore": "One with a fiery passion that burns! Recently inheriting the Lavaridge Gym, her inexperience is masked by her explosive enthusiasm and the intense heat radiating from her Fire-type companions."
  },
  {
    "name": "Norman",
    "id": "norman",
    "role": "Gym Leader",
    "lore": "A man in pursuit of ultimate power. The protagonist's strict but loving father, he commands the Petalburg Gym with disciplined Normal-type strategies, offering the ultimate test of his child's growth."
  },
  {
    "name": "Winona",
    "id": "winona",
    "role": "Gym Leader",
    "lore": "The bird user taking flight into the world. Graceful and deeply attuned to the winds of Fortree City, she dances with her Flying-type Pok\u00e9mon, performing aerial acrobatics that dazzle her opponents."
  },
  {
    "name": "Tate & Liza",
    "id": "tateandliza",
    "role": "Gym Leader",
    "lore": "The mystic combination! These Mossdeep City twins share a telepathic bond, coordinating their Psychic-type Pok\u00e9mon in flawless double battles that overwhelm solitary challengers."
  },
  {
    "name": "Wallace",
    "id": "wallace",
    "role": "Champion",
    "lore": "Artist, and lover of water. An elegant coordinator and powerful trainer from Sootopolis City, he intertwines beauty and strength, commanding Water-type Pok\u00e9mon with the grace of a master illusionist."
  },
  {
    "name": "Juan",
    "id": "juan",
    "role": "Gym Leader",
    "lore": "The Gym Leader with the beauty of pure water. Wallace's sophisticated mentor, he delights in creating dazzling, aquatic spectacles, proving that true power can be a breathtaking work of art."
  },
  {
    "name": "Steven",
    "id": "steven",
    "role": "Champion",
    "lore": "The wandering stone collector. An heir to the Devon Corporation and the Champion of Hoenn, he traverses the globe in search of rare minerals, battling with an unshakeable, Steel-clad resolve."
  },
  {
    "name": "Roark",
    "id": "roark",
    "role": "Gym Leader",
    "lore": "Call him Roark the Rock! The dedicated foreman of the Oreburgh Mine, he follows in his father's footsteps, polishing the rugged potential of Rock-type Pok\u00e9mon into shining gems of strength."
  },
  {
    "name": "Gardenia",
    "id": "gardenia",
    "role": "Gym Leader",
    "lore": "Master of Vivid Plant Pok\u00e9mon! A deeply enthusiastic Grass-type specialist in Eterna City, she loves her botanical companions fiercely\u2014though she remains famously terrified of Ghost-types."
  },
  {
    "name": "Maylene",
    "id": "maylene",
    "role": "Gym Leader",
    "lore": "The Barefoot Fighting Genius! A humble prodigy from Veilstone City who sometimes doubts her own strength, yet commands her Fighting-type Pok\u00e9mon with astonishing, instinctual precision."
  },
  {
    "name": "Crasher Wake",
    "id": "crasherwake",
    "role": "Gym Leader",
    "lore": "The Torrential Masked Master! A larger-than-life pro wrestler from Pastoria City who loves entertaining the crowds, washing away the competition with the brute force of his Water-type Pok\u00e9mon."
  },
  {
    "name": "Fantina",
    "id": "fantina",
    "role": "Gym Leader",
    "lore": "The Alluring Soul Dancer! A flamboyant contest coordinator and Hearthome Gym Leader, she speaks with a foreign flair, utilizing Ghost-type Pok\u00e9mon to weave mesmerizing, unpredictable illusions."
  },
  {
    "name": "Byron",
    "id": "byron",
    "role": "Gym Leader",
    "lore": "The Man with the Steel Body! Roark's boisterous father and the Canalave City Gym Leader, he forged his unyielding defensive strategies deep within the Iron Island mines."
  },
  {
    "name": "Candice",
    "id": "candice",
    "role": "Gym Leader",
    "lore": "The Diamond Dust Girl! Despite Snowpoint City's freezing climate, her fierce, passionate spirit burns brightly, inspiring her Ice-type Pok\u00e9mon to strike with the focus of a blizzard."
  },
  {
    "name": "Volkner",
    "id": "volkner",
    "role": "Gym Leader",
    "lore": "The Shining, Shocking Star! Bored by weak challengers, this brilliant but melancholic Sunyshore City Gym Leader revitalizes the local technology to spark the ultimate Electric-type battle."
  },
  {
    "name": "Cynthia",
    "id": "cynthia",
    "role": "Champion",
    "lore": "The beloved Champion of the Sinnoh region. Deeply fascinated by Pok\u00e9mon mythology and the creation of the universe, she battles with an unparalleled, terrifyingly diverse team led by her Garchomp."
  },
  {
    "name": "Cilan",
    "id": "cilan",
    "role": "Gym Leader",
    "lore": "A sophisticated connoisseur of Grass-type Pok\u00e9mon. Alongside his brothers in Striaton City, he carefully analyzes the flavor of a challenger's battling style, aiming for a perfectly balanced encounter."
  },
  {
    "name": "Lenora",
    "id": "lenora",
    "role": "Gym Leader",
    "lore": "The Archeologist with a Backbone! Directing the Nacrene City Museum, she applies her rigorous scientific deduction to battling, using Normal-type Pok\u00e9mon to unearth her opponents' weaknesses."
  },
  {
    "name": "Burgh",
    "id": "burgh",
    "role": "Gym Leader",
    "lore": "The Premiere Insect Artist! A wandering bohemian soul in Castelia City, he finds profound artistic inspiration in the pure, unadulterated nature of Bug-type Pok\u00e9mon."
  },
  {
    "name": "Elesa",
    "id": "elesa",
    "role": "Gym Leader",
    "lore": "The Shining Beauty! A world-famous supermodel in Nimbasa City, she dazzles the runway and the battlefield alike, electrifying her audiences with a flashy, high-voltage combat style."
  },
  {
    "name": "Clay",
    "id": "clay",
    "role": "Gym Leader",
    "lore": "The Underground Boss! A gruff, hard-working magnate who built Driftveil City through sheer willpower, he crushes obstacles using the raw, unrefined power of his Ground-type Pok\u00e9mon."
  },
  {
    "name": "Skyla",
    "id": "skyla",
    "role": "Gym Leader",
    "lore": "The Highflying Girl! A cheerful cargo pilot in Mistralton City, she loves soaring through the open skies and subjects her challengers to dizzying, wind-blown aerial trials."
  },
  {
    "name": "Brycen",
    "id": "brycen",
    "role": "Gym Leader",
    "lore": "The legendary Ice Mask! Once a celebrated movie star, he retreated to Icirrus City to hone his martial arts in the freezing cold, mastering the silent, crystalline precision of Ice-type Pok\u00e9mon."
  },
  {
    "name": "Drayden",
    "id": "drayden",
    "role": "Gym Leader",
    "lore": "The Spartan Mayor! An imposing, physically powerful leader in Opelucid City, he governs with wisdom and battles with the ancient, devastating ferocity of Dragon-type Pok\u00e9mon."
  },
  {
    "name": "Iris",
    "id": "iris",
    "role": "Champion",
    "lore": "The Girl Who Knows the Hearts of Dragons! A wild, energetic prodigy deeply connected to nature, she embraces the untamed spirit of Dragon-types to ascend as the Champion of Unova."
  },
  {
    "name": "Alder",
    "id": "alder",
    "role": "Champion",
    "lore": "The wandering Champion of Unova. Carrying a heavy burden of loss, he travels the region teaching others that the bond between humans and Pok\u00e9mon is far more important than the pursuit of raw power."
  },
  {
    "name": "Red",
    "id": "red",
    "role": "Protagonist",
    "lore": "The legendary silent prodigy from Pallet Town. He conquered the Kanto region and retreated to Mt. Silver to await a challenger worthy of his ultimate team."
  },
  {
    "name": "Blue",
    "id": "blue",
    "role": "Rival",
    "lore": "Red's arrogant but brilliant rival and the former Kanto Champion. Smell ya later!"
  },
  {
    "name": "Ethan",
    "id": "ethan",
    "role": "Protagonist",
    "lore": "The heroic boy from New Bark Town who toppled Team Rocket and conquered two entire regions."
  },
  {
    "name": "Lyra",
    "id": "lyra",
    "role": "Protagonist",
    "lore": "A cheerful and energetic trainer from Johto, always ready for an adventure with her Marill."
  },
  {
    "name": "Brendan",
    "id": "brendan",
    "role": "Protagonist",
    "lore": "The confident son of Professor Birch, constantly exploring the vibrant, tropical Hoenn region."
  },
  {
    "name": "May",
    "id": "may",
    "role": "Protagonist",
    "lore": "Daughter of the Petalburg Gym Leader Norman, balancing her love for battles and Pok\u00e9mon Contests."
  },
  {
    "name": "Lucas",
    "id": "lucas",
    "role": "Protagonist",
    "lore": "A dedicated assistant to Professor Rowan in Sinnoh, eager to uncover the secrets of evolution."
  },
  {
    "name": "Dawn",
    "id": "dawn",
    "role": "Protagonist",
    "lore": "A spirited trainer from Twinleaf Town, aiming to conquer the Sinnoh league and contests alike."
  },
  {
    "name": "Hilbert",
    "id": "hilbert",
    "role": "Protagonist",
    "lore": "The hero of truth or ideals from Nuvema Town, destined to awaken a legendary dragon."
  },
  {
    "name": "Hilda",
    "id": "hilda",
    "role": "Protagonist",
    "lore": "A fierce and determined Unovan trainer, ready to take on Team Plasma and save the region."
  },
  {
    "name": "Nate",
    "id": "nate",
    "role": "Protagonist",
    "lore": "A rising star from Aspertia City, fighting alongside Hugh to liberate Unova from Neo Team Plasma."
  },
  {
    "name": "Rosa",
    "id": "rosa",
    "role": "Protagonist",
    "lore": "An energetic and talented trainer, exploring the evolving landscape of the Unova region."
  },
  {
    "name": "Ace Trainer",
    "id": "acetrainer",
    "role": "Trainer",
    "lore": "Elite, highly skilled trainers who use diverse and fully-evolved teams to crush unprepared opponents."
  },
  {
    "name": "Bug Catcher",
    "id": "bugcatcher",
    "role": "Trainer",
    "lore": "Enthusiastic kids wielding nets, constantly searching the forests for rare and fascinating Bug-type Pok\u00e9mon."
  },
  {
    "name": "Lass",
    "id": "lass",
    "role": "Trainer",
    "lore": "Young girls beginning their journeys, typically preferring cute Normal and Fairy-type companions."
  },
  {
    "name": "Youngster",
    "id": "youngster",
    "role": "Trainer",
    "lore": "Energetic boys obsessed with battling. They really like shorts because they are comfy and easy to wear!"
  },
  {
    "name": "Hiker",
    "id": "hiker",
    "role": "Trainer",
    "lore": "Jovial mountaineers scaling the highest peaks, relying on sturdy Rock and Ground-type Pok\u00e9mon."
  },
  {
    "name": "Scientist",
    "id": "scientist",
    "role": "Trainer",
    "lore": "Analytical minds experimenting with Pok\u00e9mon genetics, artificial items, and strategic battle calculations."
  },
  {
    "name": "Black Belt",
    "id": "blackbelt",
    "role": "Trainer",
    "lore": "Disciplined martial artists who train their bodies in tandem with their powerful Fighting-type Pok\u00e9mon."
  },
  {
    "name": "Beauty",
    "id": "beauty",
    "role": "Trainer",
    "lore": "Elegant trainers who believe true strength lies in a Pok\u00e9mon's grace, charm, and immaculate grooming."
  },
  {
    "name": "Psychic",
    "id": "psychic",
    "role": "Trainer",
    "lore": "Mystics capable of bending spoons and minds, harmonizing their brainwaves with Psychic-type Pok\u00e9mon."
  },
  {
    "name": "Hex Maniac",
    "id": "hexmaniac",
    "role": "Trainer",
    "lore": "Eerie, unsettling individuals who frequent graveyards, communicating with Ghost-types from the beyond."
  },
  {
    "name": "Dragon Tamer",
    "id": "dragontamer",
    "role": "Trainer",
    "lore": "Specialized experts who brave extreme conditions to tame the mythical and devastating Dragon-type Pok\u00e9mon."
  },
  {
    "name": "Veteran",
    "id": "veteran",
    "role": "Trainer",
    "lore": "Seasoned masters with decades of combat experience and profoundly powerful, diverse teams."
  },
  {
    "name": "Rocket Grunt",
    "id": "rocketgrunt",
    "role": "Villain",
    "lore": "Foot soldiers of the notorious Team Rocket, stealing Pok\u00e9mon for profit and absolute domination."
  },
  {
    "name": "Magma Grunt",
    "id": "magmagrunt",
    "role": "Villain",
    "lore": "Fanatical members of Team Magma, seeking to expand the landmass by awakening ancient primal forces."
  },
  {
    "name": "Aqua Grunt",
    "id": "aquagrunt",
    "role": "Villain",
    "lore": "Pirates of Team Aqua, fighting to flood the earth and return it to a prehistoric oceanic state."
  },
  {
    "name": "Galactic Grunt",
    "id": "galacticgrunt",
    "role": "Villain",
    "lore": "Emotionless operatives of Team Galactic, aiming to destroy the universe and rebuild it for their leader."
  },
  {
    "name": "Plasma Grunt",
    "id": "plasmagrunt",
    "role": "Villain",
    "lore": "Knights of Team Plasma, hypocritically \"liberating\" Pok\u00e9mon while seeking total control of the Unova region."
  }
];