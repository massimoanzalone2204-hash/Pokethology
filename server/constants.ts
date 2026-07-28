export const typeAdvantageMap: Record<string, { strongAgainst: string[], weakTo: string[] }> = {
  normal: { strongAgainst: [], weakTo: ['ghost', 'rock', 'steel'] },
  fire: { strongAgainst: ['grass', 'ice', 'bug', 'steel'], weakTo: ['water', 'ground', 'rock', 'dragon', 'fire'] },
  water: { strongAgainst: ['fire', 'ground', 'rock'], weakTo: ['water', 'grass', 'dragon', 'electric'] },
  grass: { strongAgainst: ['water', 'ground', 'rock'], weakTo: ['fire', 'ice', 'poison', 'flying', 'bug', 'dragon', 'steel'] },
  electric: { strongAgainst: ['water', 'flying'], weakTo: ['ground', 'electric', 'grass', 'dragon'] },
  ice: { strongAgainst: ['grass', 'ground', 'flying', 'dragon'], weakTo: ['fire', 'water', 'ice', 'steel'] },
  fighting: { strongAgainst: ['normal', 'ice', 'rock', 'dark', 'steel'], weakTo: ['poison', 'flying', 'psychic', 'bug', 'fairy', 'ghost'] },
  poison: { strongAgainst: ['grass', 'fairy'], weakTo: ['poison', 'ground', 'rock', 'ghost', 'steel'] },
  ground: { strongAgainst: ['fire', 'electric', 'poison', 'rock', 'steel'], weakTo: ['grass', 'bug', 'flying'] },
  flying: { strongAgainst: ['grass', 'fighting', 'bug'], weakTo: ['electric', 'rock', 'steel'] },
  psychic: { strongAgainst: ['fighting', 'poison'], weakTo: ['psychic', 'steel', 'dark'] },
  bug: { strongAgainst: ['grass', 'psychic', 'dark'], weakTo: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'] },
  rock: { strongAgainst: ['fire', 'ice', 'flying', 'bug'], weakTo: ['fighting', 'ground', 'steel'] },
  ghost: { strongAgainst: ['psychic', 'ghost'], weakTo: ['dark', 'normal'] },
  dragon: { strongAgainst: ['dragon'], weakTo: ['steel', 'fairy'] },
  dark: { strongAgainst: ['psychic', 'ghost'], weakTo: ['fighting', 'dark', 'fairy'] },
  steel: { strongAgainst: ['ice', 'rock', 'fairy'], weakTo: ['fire', 'water', 'electric', 'steel'] },
  fairy: { strongAgainst: ['fighting', 'dragon', 'dark'], weakTo: ['fire', 'poison', 'steel'] }
};

export const suggestions = {
  it: [
    `In un duello 1v1 singolo, controlla la velocità dell'avversario tramite alterazioni di stato (Paralisi, Sonno) per assicurarti sempre il primo colpo.`,
    `Usa strumenti focalizzati sul danno immediato (come Assorbisfera o Bendascelta) per sopraffare il bersaglio prima che possa potenziarsi.`,
    `In formato 1v1 le trappole (Levitoroccia) non hanno effetto poichè non ci sono sostituzioni; focalizzati invece su mosse offensive o scudi fisici diretti.`,
    `Una Teracristal inattesa con un tipo elemento a sorpresa può invertire le debolezze in 1v1 e darti un instantaneo KO a sorpresa.`,
    `La sinergia e la previsione delle mosse sono tutto: usa mosse di autoguarigione o protezione (Protezione) per logorare l'avversario singolo.`
  ],
  es: [
    `En un duelo individual 1v1, controla la velocidad del rival con efectos de estado (Parálisis, Sueño) para asegurarte el primer golpe siempre.`,
    `Usa objetos enfocados en daño inmediato (como Vidasfera o Cinta Elección) para derribar al objetivo antes de que se aumente estadísticas.`,
    `En el formato 1v1, las trampas de entrada (Trampa Rocas) son inútiles ya que no hay cambios; prioriza ataques directos o coberturas efectivas.`,
    `Una Teracristalización sorpresa con un tipo inesperado puede revertir tus debilidades en 1v1 y darte la victoria inmediata.`,
    `La predicción del clima y del movimiento rival lo es todo: usa movimientos de recuperación de salud o Protección para desgastar al enemigo.`
  ],
  fr: [
    `Dans un duel singulier 1v1, contrôlez la vitesse adverse avec des altérations de statut (Paralysie, Sommeil) pour garantir le premier coup.`,
    `Utilisez des objets de dégâts immédiats (comme l'Orbe Vie ou le Bandeau Choix) pour terrasser la cible avant qu'elle ne se place.`,
    `En format 1v1, les pièges (Piège de Roc) sont inutiles car aucun switch n'est possible ; concentrez-vous sur l'attaque brute ou le soin rapide.`,
    `Une Téracristallisation surprise peut inverser vos faiblesses en plein duel 1v1 et vous assurer un K.O. décisif inattendu.`,
    `L'anticipation est la clé absolue : combinez des capacités d'auto-soin ou Abri pour épuiser méthodiquement votre unique adversaire.`
  ],
  de: [
    `In einem 1v1-Einzelduell kontrollierst du die gegnerische Initiative am besten mit Statusveränderungen (Paralyse, Schlaf), um immer zuerst anzugreifen.`,
    `Nutze Items für sofortigen Schaden (wie Leben-Orb oder Wahlband), um den Gegner auszuschalten, bevor er sich aufbauen kann.`,
    `Im 1v1-Einzelkampf sind Tarnsteine nutzlos, da kein Wechsel stattfindet; konzentriere dich voll auf direkte Angriffe oder Schutzschild-Taktiken.`,
    `Eine überraschende Terakristallisierung kann deine Typschwächen im 1v1 umkehren und dir einen sofortigen psychologischen Vorteil verschaffen.`,
    `Vorausplanung ist alles: Verwende zuverlässige Heilungs- oder Schutz-Moves (z. B. Schutzschild), um deinen einzigen Gegner strategisch zu zermürben.`
  ],
  en: [
    `In a strict 1v1 singles match, manipulate the speed tier through status conditions (Paralysis, Sleep) to guarantee moving first every turn.`,
    `Use raw immediate offensive tools (like Life Orb or Choice Band) to overpower your target before they can set up defensive stat gains.`,
    `In active 1v1 combat, hazards (like Stealth Rock) are entirely useless because there are no switches. Prioritize heavy direct damage instead.`,
    `An unexpected Terastallization to a surprise defensive type can reverse element matches instantly and turn a lose into a winning KO.`,
    `Strategy in active 1v1 is about pure prediction: use recovery mechanics or Protect tricks to safely outlast your singular opponent.`
  ]
};
