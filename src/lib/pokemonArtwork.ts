// Master form ID mapping and artwork resolver for Pokemon and alternative forms
export const POKEMON_FORM_IDS: Record<string, number> = {
  "nidoran-f": 29,
  "nidoran-m": 32,
  "mr-mime": 122,
  "ho-oh": 250,
  "deoxys-normal": 386,
  "wormadam-plant": 413,
  "mime-jr": 439,
  "porygon-z": 474,
  "giratina-altered": 487,
  "shaymin-land": 492,
  "basculin-red-striped": 550,
  "darmanitan-standard": 555,
  "frillish-male": 592,
  "jellicent-male": 593,
  "tornadus-incarnate": 641,
  "thundurus-incarnate": 642,
  "landorus-incarnate": 645,
  "keldeo-ordinary": 647,
  "meloetta-aria": 648,
  "pyroar-male": 668,
  "meowstic-male": 678,
  "aegislash-shield": 681,
  "pumpkaboo-average": 710,
  "gourgeist-average": 711,
  "zygarde-50": 718,
  "oricorio-baile": 741,
  "lycanroc-midday": 745,
  "wishiwashi-solo": 746,
  "type-null": 772,
  "minior-red-meteor": 774,
  "mimikyu-disguised": 778,
  "jangmo-o": 782,
  "hakamo-o": 783,
  "kommo-o": 784,
  "tapu-koko": 785,
  "tapu-lele": 786,
  "tapu-bulu": 787,
  "tapu-fini": 788,
  "toxtricity-amped": 849,
  "mr-rime": 866,
  "eiscue-ice": 875,
  "indeedee-male": 876,
  "morpeko-full-belly": 877,
  "urshifu-single-strike": 892,
  "basculegion-male": 902,
  "enamorus-incarnate": 905,
  "oinkologne-male": 916,
  "maushold-family-of-four": 925,
  "squawkabilly-green-plumage": 931,
  "palafin-zero": 964,
  "tatsugiri-curly": 978,
  "dudunsparce-two-segment": 982,
  "great-tusk": 984,
  "scream-tail": 985,
  "brute-bonnet": 986,
  "flutter-mane": 987,
  "slither-wing": 988,
  "sandy-shocks": 989,
  "iron-treads": 990,
  "iron-bundle": 991,
  "iron-hands": 992,
  "iron-jugulis": 993,
  "iron-moth": 994,
  "iron-thorns": 995,
  "wo-chien": 1001,
  "chien-pao": 1002,
  "ting-lu": 1003,
  "chi-yu": 1004,
  "roaring-moon": 1005,
  "iron-valiant": 1006,
  "walking-wake": 1009,
  "iron-leaves": 1010,
  "gouging-fire": 1020,
  "raging-bolt": 1021,
  "iron-boulder": 1022,
  "iron-crown": 1023,
  "deoxys-attack": 10001,
  "deoxys-defense": 10002,
  "deoxys-speed": 10003,
  "wormadam-sandy": 10004,
  "wormadam-trash": 10005,
  "shaymin-sky": 10006,
  "giratina-origin": 10007,
  "rotom-heat": 10008,
  "rotom-wash": 10009,
  "rotom-frost": 10010,
  "rotom-fan": 10011,
  "rotom-mow": 10012,
  "castform-sunny": 10013,
  "castform-rainy": 10014,
  "castform-snowy": 10015,
  "basculin-blue-striped": 10016,
  "darmanitan-zen": 10017,
  "meloetta-pirouette": 10018,
  "tornadus-therian": 10019,
  "thundurus-therian": 10020,
  "landorus-therian": 10021,
  "kyurem-black": 10022,
  "kyurem-white": 10023,
  "keldeo-resolute": 10024,
  "meowstic-female": 10025,
  "aegislash-blade": 10026,
  "pumpkaboo-small": 10027,
  "pumpkaboo-large": 10028,
  "pumpkaboo-super": 10029,
  "gourgeist-small": 10030,
  "gourgeist-large": 10031,
  "gourgeist-super": 10032,
  "venusaur-mega": 10033,
  "charizard-mega-x": 10034,
  "charizard-mega-y": 10035,
  "blastoise-mega": 10036,
  "alakazam-mega": 10037,
  "gengar-mega": 10038,
  "kangaskhan-mega": 10039,
  "pinsir-mega": 10040,
  "gyarados-mega": 10041,
  "aerodactyl-mega": 10042,
  "mewtwo-mega-x": 10043,
  "mewtwo-mega-y": 10044,
  "ampharos-mega": 10045,
  "scizor-mega": 10046,
  "heracross-mega": 10047,
  "houndoom-mega": 10048,
  "tyranitar-mega": 10049,
  "blaziken-mega": 10050,
  "gardevoir-mega": 10051,
  "mawile-mega": 10052,
  "aggron-mega": 10053,
  "medicham-mega": 10054,
  "manectric-mega": 10055,
  "banette-mega": 10056,
  "absol-mega": 10057,
  "garchomp-mega": 10058,
  "lucario-mega": 10059,
  "abomasnow-mega": 10060,
  "floette-eternal": 10061,
  "latias-mega": 10062,
  "latios-mega": 10063,
  "swampert-mega": 10064,
  "sceptile-mega": 10065,
  "sableye-mega": 10066,
  "altaria-mega": 10067,
  "gallade-mega": 10068,
  "audino-mega": 10069,
  "sharpedo-mega": 10070,
  "slowbro-mega": 10071,
  "steelix-mega": 10072,
  "pidgeot-mega": 10073,
  "glalie-mega": 10074,
  "diancie-mega": 10075,
  "metagross-mega": 10076,
  "kyogre-primal": 10077,
  "groudon-primal": 10078,
  "rayquaza-mega": 10079,
  "pikachu-rock-star": 10080,
  "pikachu-belle": 10081,
  "pikachu-pop-star": 10082,
  "pikachu-phd": 10083,
  "pikachu-libre": 10084,
  "pikachu-cosplay": 10085,
  "hoopa-unbound": 10086,
  "camerupt-mega": 10087,
  "lopunny-mega": 10088,
  "salamence-mega": 10089,
  "beedrill-mega": 10090,
  "rattata-alola": 10091,
  "raticate-alola": 10092,
  "raticate-totem-alola": 10093,
  "pikachu-original-cap": 10094,
  "pikachu-hoenn-cap": 10095,
  "pikachu-sinnoh-cap": 10096,
  "pikachu-unova-cap": 10097,
  "pikachu-kalos-cap": 10098,
  "pikachu-alola-cap": 10099,
  "raichu-alola": 10100,
  "sandshrew-alola": 10101,
  "sandslash-alola": 10102,
  "vulpix-alola": 10103,
  "ninetales-alola": 10104,
  "diglett-alola": 10105,
  "dugtrio-alola": 10106,
  "meowth-alola": 10107,
  "persian-alola": 10108,
  "geodude-alola": 10109,
  "graveler-alola": 10110,
  "golem-alola": 10111,
  "grimer-alola": 10112,
  "muk-alola": 10113,
  "exeggutor-alola": 10114,
  "marowak-alola": 10115,
  "greninja-battle-bond": 10116,
  "greninja-ash": 10117,
  "zygarde-10-power-construct": 10118,
  "zygarde-50-power-construct": 10119,
  "zygarde-complete": 10120,
  "gumshoos-totem": 10121,
  "vikavolt-totem": 10122,
  "oricorio-pom-pom": 10123,
  "oricorio-pau": 10124,
  "oricorio-sensu": 10125,
  "lycanroc-midnight": 10126,
  "wishiwashi-school": 10127,
  "lurantis-totem": 10128,
  "salazzle-totem": 10129,
  "minior-orange-meteor": 10130,
  "minior-yellow-meteor": 10131,
  "minior-green-meteor": 10132,
  "minior-blue-meteor": 10133,
  "minior-indigo-meteor": 10134,
  "minior-violet-meteor": 10135,
  "minior-red": 10136,
  "minior-orange": 10137,
  "minior-yellow": 10138,
  "minior-green": 10139,
  "minior-blue": 10140,
  "minior-indigo": 10141,
  "minior-violet": 10142,
  "mimikyu-busted": 10143,
  "mimikyu-totem-disguised": 10144,
  "mimikyu-totem-busted": 10145,
  "kommo-o-totem": 10146,
  "magearna-original": 10147,
  "pikachu-partner-cap": 10148,
  "marowak-totem": 10149,
  "ribombee-totem": 10150,
  "rockruff-own-tempo": 10151,
  "lycanroc-dusk": 10152,
  "araquanid-totem": 10153,
  "togedemaru-totem": 10154,
  "necrozma-dusk": 10155,
  "necrozma-dawn": 10156,
  "necrozma-ultra": 10157,
  "pikachu-starter": 10158,
  "eevee-starter": 10159,
  "pikachu-world-cap": 10160,
  "meowth-galar": 10161,
  "ponyta-galar": 10162,
  "rapidash-galar": 10163,
  "slowpoke-galar": 10164,
  "slowbro-galar": 10165,
  "farfetchd-galar": 10166,
  "weezing-galar": 10167,
  "mr-mime-galar": 10168,
  "articuno-galar": 10169,
  "zapdos-galar": 10170,
  "moltres-galar": 10171,
  "slowking-galar": 10172,
  "corsola-galar": 10173,
  "zigzagoon-galar": 10174,
  "linoone-galar": 10175,
  "darumaka-galar": 10176,
  "darmanitan-galar-standard": 10177,
  "darmanitan-galar-zen": 10178,
  "yamask-galar": 10179,
  "stunfisk-galar": 10180,
  "zygarde-10": 10181,
  "cramorant-gulping": 10182,
  "cramorant-gorging": 10183,
  "toxtricity-low-key": 10184,
  "eiscue-noice": 10185,
  "indeedee-female": 10186,
  "morpeko-hangry": 10187,
  "zacian-crowned": 10188,
  "zamazenta-crowned": 10189,
  "eternatus-eternamax": 10190,
  "urshifu-rapid-strike": 10191,
  "zarude-dada": 10192,
  "calyrex-ice": 10193,
  "calyrex-shadow": 10194,
  "venusaur-gmax": 10195,
  "charizard-gmax": 10196,
  "blastoise-gmax": 10197,
  "butterfree-gmax": 10198,
  "pikachu-gmax": 10199,
  "meowth-gmax": 10200,
  "machamp-gmax": 10201,
  "gengar-gmax": 10202,
  "kingler-gmax": 10203,
  "lapras-gmax": 10204,
  "eevee-gmax": 10205,
  "snorlax-gmax": 10206,
  "garbodor-gmax": 10207,
  "melmetal-gmax": 10208,
  "rillaboom-gmax": 10209,
  "cinderace-gmax": 10210,
  "inteleon-gmax": 10211,
  "corviknight-gmax": 10212,
  "orbeetle-gmax": 10213,
  "drednaw-gmax": 10214,
  "coalossal-gmax": 10215,
  "flapple-gmax": 10216,
  "appletun-gmax": 10217,
  "sandaconda-gmax": 10218,
  "toxtricity-amped-gmax": 10219,
  "centiskorch-gmax": 10220,
  "hatterene-gmax": 10221,
  "grimmsnarl-gmax": 10222,
  "alcremie-gmax": 10223,
  "copperajah-gmax": 10224,
  "duraludon-gmax": 10225,
  "urshifu-single-strike-gmax": 10226,
  "urshifu-rapid-strike-gmax": 10227,
  "toxtricity-low-key-gmax": 10228,
  "growlithe-hisui": 10229,
  "arcanine-hisui": 10230,
  "voltorb-hisui": 10231,
  "electrode-hisui": 10232,
  "typhlosion-hisui": 10233,
  "qwilfish-hisui": 10234,
  "sneasel-hisui": 10235,
  "samurott-hisui": 10236,
  "lilligant-hisui": 10237,
  "zorua-hisui": 10238,
  "zoroark-hisui": 10239,
  "braviary-hisui": 10240,
  "sliggoo-hisui": 10241,
  "goodra-hisui": 10242,
  "avalugg-hisui": 10243,
  "decidueye-hisui": 10244,
  "dialga-origin": 10245,
  "palkia-origin": 10246,
  "basculin-white-striped": 10247,
  "basculegion-female": 10248,
  "enamorus-therian": 10249,
  "tauros-paldea-combat-breed": 10250,
  "tauros-paldea-blaze-breed": 10251,
  "tauros-paldea-aqua-breed": 10252,
  "wooper-paldea": 10253,
  "oinkologne-female": 10254,
  "dudunsparce-three-segment": 10255,
  "palafin-hero": 10256,
  "maushold-family-of-three": 10257,
  "tatsugiri-droopy": 10258,
  "tatsugiri-stretchy": 10259,
  "squawkabilly-blue-plumage": 10260,
  "squawkabilly-yellow-plumage": 10261,
  "squawkabilly-white-plumage": 10262,
  "gimmighoul-roaming": 10263,
  "koraidon-limited-build": 10264,
  "koraidon-sprinting-build": 10265,
  "koraidon-swimming-build": 10266,
  "koraidon-gliding-build": 10267,
  "miraidon-low-power-mode": 10268,
  "miraidon-drive-mode": 10269,
  "miraidon-aquatic-mode": 10270,
  "miraidon-glide-mode": 10271,
  "ursaluna-bloodmoon": 10272,
  "ogerpon-wellspring-mask": 10273,
  "ogerpon-hearthflame-mask": 10274,
  "ogerpon-cornerstone-mask": 10275,
  "terapagos-terastal": 10276,
  "terapagos-stellar": 10277,
  "clefable-mega": 10278,
  "victreebel-mega": 10279,
  "starmie-mega": 10280,
  "dragonite-mega": 10281,
  "meganium-mega": 10282,
  "feraligatr-mega": 10283,
  "skarmory-mega": 10284,
  "froslass-mega": 10285,
  "emboar-mega": 10286,
  "excadrill-mega": 10287,
  "scolipede-mega": 10288,
  "scrafty-mega": 10289,
  "eelektross-mega": 10290,
  "chandelure-mega": 10291,
  "chesnaught-mega": 10292,
  "delphox-mega": 10293,
  "greninja-mega": 10294,
  "pyroar-mega": 10295,
  "floette-mega": 10296,
  "malamar-mega": 10297,
  "barbaracle-mega": 10298,
  "dragalge-mega": 10299,
  "hawlucha-mega": 10300,
  "zygarde-mega": 10301,
  "drampa-mega": 10302,
  "falinks-mega": 10303,
  "raichu-mega-x": 10304,
  "raichu-mega-y": 10305,
  "chimecho-mega": 10306,
  "absol-mega-z": 10307,
  "staraptor-mega": 10308,
  "garchomp-mega-z": 10309,
  "lucario-mega-z": 10310,
  "heatran-mega": 10311,
  "darkrai-mega": 10312,
  "golurk-mega": 10313,
  "meowstic-male-mega": 10314,
  "crabominable-mega": 10315,
  "golisopod-mega": 10316,
  "magearna-mega": 10317,
  "magearna-original-mega": 10318,
  "zeraora-mega": 10319,
  "scovillain-mega": 10320,
  "glimmora-mega": 10321,
  "tatsugiri-curly-mega": 10322,
  "tatsugiri-droopy-mega": 10323,
  "tatsugiri-stretchy-mega": 10324,
  "baxcalibur-mega": 10325,
  "meowstic-female-mega": 10326
};

export function getShowdownName(name: string): string {
  if (!name) return '';
  let clean = name.toLowerCase().replace(/[\s_]/g, '-');
  
  if (clean === 'nidoran-m') return 'nidoranm';
  if (clean === 'nidoran-f') return 'nidoranf';
  if (clean.startsWith('farfetchd')) return clean.replace('farfetchd', 'farfetchd');
  if (clean.startsWith('sirfetchd')) return clean.replace('sirfetchd', 'sirfetchd');
  if (clean.startsWith('mr-mime')) return clean.replace('mr-mime', 'mrmime');
  if (clean.startsWith('mr-rime')) return clean.replace('mr-rime', 'mrrime');
  if (clean.startsWith('mime-jr')) return clean.replace('mime-jr', 'mimejr');
  if (clean.startsWith('type-null')) return clean.replace('type-null', 'typenull');
  if (clean.startsWith('jangmo-o')) return clean.replace('jangmo-o', 'jangmoo');
  if (clean.startsWith('hakamo-o')) return clean.replace('hakamo-o', 'hakamoo');
  if (clean.startsWith('kommo-o')) return clean.replace('kommo-o', 'kommoo');
  if (clean.startsWith('tapu-')) return clean.replace('tapu-', 'tapu');
  if (clean.startsWith('wo-chien')) return 'wochien';
  if (clean.startsWith('chien-pao')) return 'chienpao';
  if (clean.startsWith('ting-lu')) return 'tinglu';
  if (clean.startsWith('chi-yu')) return 'chiyu';
  if (clean.startsWith('great-tusk')) return 'greattusk';
  if (clean.startsWith('scream-tail')) return 'screamtail';
  if (clean.startsWith('brute-bonnet')) return 'brutebonnet';
  if (clean.startsWith('flutter-mane')) return 'fluttermane';
  if (clean.startsWith('slither-wing')) return 'slitherwing';
  if (clean.startsWith('sandy-shocks')) return 'sandyshocks';
  if (clean.startsWith('iron-treads')) return 'irontreads';
  if (clean.startsWith('iron-bundle')) return 'ironbundle';
  if (clean.startsWith('iron-hands')) return 'ironhands';
  if (clean.startsWith('iron-jugulis')) return 'ironjugulis';
  if (clean.startsWith('iron-moth')) return 'ironmoth';
  if (clean.startsWith('iron-thorns')) return 'ironthorns';
  if (clean.startsWith('roaring-moon')) return 'roaringmoon';
  if (clean.startsWith('iron-valiant')) return 'ironvaliant';
  if (clean.startsWith('walking-wake')) return 'walkingwake';
  if (clean.startsWith('iron-leaves')) return 'ironleaves';
  if (clean.startsWith('gouging-fire')) return 'gougingfire';
  if (clean.startsWith('raging-bolt')) return 'ragingbolt';
  if (clean.startsWith('iron-boulder')) return 'ironboulder';
  if (clean.startsWith('iron-crown')) return 'ironcrown';

  return clean.replace(/-/g, '');
}

export interface PokemonArtworkSource {
  name: string;
  url?: string;
  displayId?: number;
  formId?: number;
  baseId?: number;
  artwork?: string;
  sprites?: any;
}

export function getPokemonArtworkUrl(
  item: PokemonArtworkSource | null | undefined,
  options?: { isShiny?: boolean }
): string {
  if (!item || !item.name) {
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
  }

  const isShiny = !!options?.isShiny;
  const shinyPath = isShiny ? 'shiny/' : '';
  const normName = item.name.toLowerCase().trim();

  // 1. If explicit artwork was provided (and not shiny override or matching shiny)
  if (item.artwork && typeof item.artwork === 'string') {
    if (item.artwork.startsWith('http') || item.artwork.startsWith('data:')) {
      if (isShiny) {
        if (item.artwork.includes('/official-artwork/') && !item.artwork.includes('/shiny/')) {
          return item.artwork.replace('/official-artwork/', '/official-artwork/shiny/');
        }
      }
      return item.artwork;
    }
  }

  // 2. If item has sprites object with official-artwork
  if (item.sprites?.other?.['official-artwork']) {
    const offArt = item.sprites.other['official-artwork'];
    if (isShiny && offArt.front_shiny) return offArt.front_shiny;
    if (offArt.front_default) return offArt.front_default;
  }

  // 3. Special handling for Z-A custom megas
  if (normName === 'garchomp-mega-z' || item.formId === 10309) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}10058.png`;
  }

  // 4. If explicit formId is present (> 1025 or known form ID)
  if (item.formId && typeof item.formId === 'number' && item.formId > 0) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${item.formId}.png`;
  }

  // 5. Look up form name in POKEMON_FORM_IDS
  if (POKEMON_FORM_IDS[normName]) {
    const formId = POKEMON_FORM_IDS[normName];
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${formId}.png`;
  }

  // 6. If item.url is a PokeAPI endpoint ending in a numeric ID (e.g. /pokemon/10034/)
  if (item.url && typeof item.url === 'string') {
    if (item.url.includes('/pokemon/') && !item.url.includes('.png') && !item.url.includes('.jpg')) {
      const parts = item.url.split('/').filter(Boolean);
      const lastPart = parts[parts.length - 1];
      const parsedId = parseInt(lastPart, 10);
      if (!isNaN(parsedId) && parsedId > 0) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${parsedId}.png`;
      }
    } else if (item.url.includes('.png') || item.url.includes('.jpg') || item.url.includes('.webp')) {
      if (isShiny && item.url.includes('/official-artwork/') && !item.url.includes('/shiny/')) {
        return item.url.replace('/official-artwork/', '/official-artwork/shiny/');
      }
      return item.url;
    }
  }

  // 7. Base species ID fallback
  const fallbackId = item.displayId || item.baseId || 25;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shinyPath}${fallbackId}.png`;
}

export function getPokemonSpriteUrl(
  item: PokemonArtworkSource | null | undefined,
  options?: { isShiny?: boolean; use2d?: boolean }
): string {
  if (!item || !item.name) {
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
  }

  const isShiny = !!options?.isShiny;
  const shinyPath = isShiny ? 'shiny/' : '';
  const normName = item.name.toLowerCase().trim();

  // Check form ID first
  const formId = item.formId || POKEMON_FORM_IDS[normName];
  if (formId) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${formId}.png`;
  }

  // Showdown fallback
  const cleanName = getShowdownName(normName);
  if (options?.use2d) {
    return `https://play.pokemonshowdown.com/sprites/gen5${isShiny ? '-shiny' : ''}/${cleanName}.png`;
  }

  const fallbackId = item.displayId || item.baseId || 25;
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${shinyPath}${fallbackId}.png`;
}
