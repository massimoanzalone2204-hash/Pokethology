export const strategies: Record<string, Function> = {
  it: (pName: string, oName: string, pHp: number, oHp: number) => {
    const pU = pName.toUpperCase();
    const oU = oName.toUpperCase();
    if (pHp < 35) {
      return `🛑 **ALLERTA CRITICA:** ${pU} ha solo il ${pHp}% di HP!\n\n⚔️ **DIRETTIVA BIOLOGICA:** Sferra immediatamente un attacco rapido di priorità o attiva uno scudo protettivo per rubare l'ultimo KO possibile prima dell'impatto! ⚡`;
    } else if (oHp < 35) {
      return `🔥 **FASE DI DEMOLIZIONE:** Avversario ${oU} vulnerabile al ${oHp}% di HP!\n\n💀 **DIRETTIVA BIOLOGICA:** Anticipa uno scudo difensivo o una mossa di priorità nemica e lancia il tuo colpo finale devastante senza alcuna esitazione! 💥`;
    } else {
      return `🔮 **ANALISI GRANDMASTER:** Duello tattico attivo tra ${pU} e ${oU}.\n\n🛡️ **DIRETTIVA BIOLOGICA:** Sfrutta le debolezze elementari del nemico! Priorità totale a mosse STAB offensive per massimizzare la pressione cinetica! 🌀`;
    }
  },
  es: (pName: string, oName: string, pHp: number, oHp: number) => {
    const pU = pName.toUpperCase();
    const oU = oName.toUpperCase();
    if (pHp < 35) {
      return `🛑 **ALERTA CRÍTICA:** ¡${pU} tiene solo el ${pHp}% de HP!\n\n⚔️ **DIRECTIVA TÁCTICA:** ¡Lanza un ataque de prioridad inmediata o activa una cobertura defensiva para asegurar el último daño crítico antes de caer! ⚡`;
    } else if (oHp < 35) {
      return `🔥 **FASE DE EJECUCIÓN:** ¡El enemigo ${oU} está al ${oHp}% de HP!\n\n💀 **DIRECTIVA TÁCTICA:** Anticipa un movimiento de recuperación o de prioridad alta y asesta el golpe de gracia para sellar la victoria en el asalto! 💥`;
    } else {
      return `🔮 **ANÁLISIS GRANDMASTER:** Combate directo entre ${pU} y ${oU}.\n\n🛡️ **DIRECTIVA TÁCTICA:** ¡Prioriza la cobertura de daño súper efectivo y el bono de tipo STAB para debilitar la armadura del oponente desde el inicio! 🌀`;
    }
  },
  fr: (pName: string, oName: string, pHp: number, oHp: number) => {
    const pU = pName.toUpperCase();
    const oU = oName.toUpperCase();
    if (pHp < 35) {
      return `🛑 **ALERTE CRITIQUE:** ${pU} n'a plus que ${pHp}% de PV!\n\n⚔️ **DIRECTIVE TECHNIQUE:** Utilisez immédiatement une capacité de priorité rapide ou lancez un Abri protecteur pour optimiser votre dernier tour d'action ! ⚡`;
    } else if (oHp < 35) {
      return `🔥 **PHASE DE K.O. FINAL:** L'adversaire ${oU} est vulnérable à ${oHp}% de PV!\n\n💀 **DIRECTIVE TECHNIQUE:** Anticipez son action de secours ou sa moustiquaire défensive, puis déclenchez le coup fatal sans la moindre hésitation ! 💥`;
    } else {
      return `🔮 **ANALYSE GRANDMASTER:** Face-à-face cruel entre ${pU} and ${oU}.\n\n🛡️ **DIRECTIVE TECHNIQUE:** Maximisez l'avantage élémentaire et concentrez vos forces sur des offensives STAB pour percer le rempart adverse ! 🌀`;
    }
  },
  de: (pName: string, oName: string, pHp: number, oHp: number) => {
    const pU = pName.toUpperCase();
    const oU = oName.toUpperCase();
    if (pHp < 35) {
      return `🛑 **KRITISCHER ALARM:** ${pU} hat nur noch ${pHp}% KP!\n\n⚔️ **DIREKTE WEISUNG:** Setze sofort eine schnelle Prioritätsattacke ein oder nutze Schutzschild, um den letzten massiven Treffer herauszuholen! ⚡`;
    } else if (oHp < 35) {
      return `🔥 **SCHLUSSPHASE AKTIV:** Gegner ${oU} ist extrem geschwächt bei ${oHp}% KP!\n\n💀 **DIREKTE WEISUNG:** Rechne mit einem gegnerischen Rettungsversuch und führe den finalen Vernichtungsschlag kompromisslos aus! 💥`;
    } else {
      return `🔮 **GRANDMASTER-ANALYSE:** Taktischer Schlagabtausch zwischen ${pU} und ${oU}.\n\n🛡️ **DIREKTE WEISUNG:** Konzentriere dich auf sehr effektive Typenschwächen und STAB-Druck, um die Oberhand im Duell zu behalten! 🌀`;
    }
  },
  en: (pName: string, oName: string, pHp: number, oHp: number) => {
    const pU = pName.toUpperCase();
    const oU = oName.toUpperCase();
    if (pHp < 35) {
      return `🛑 **CRITICAL STATUS:** ${pU} is down to ${pHp}% HP!\n\n⚔️ **TACTICAL COMMAND:** Unleash an immediate fast priority move or deploy a barrier shield to extract the last possible value before faint-lock! ⚡`;
    } else if (oHp < 35) {
      return `🔥 **EXECUTION PHASE:** Enemy ${oU} is vulnerable at ${oHp}% HP!\n\n💀 **TACTICAL COMMAND:** Anticipate a desperate priority strike or recovery bait, then execute the final visual blow with extreme prejudice! 💥`;
    } else {
      return `🔮 **GRANDMASTER COGNITION:** High-tactile active simulation: ${pU} vs ${oU}.\n\n🛡️ **TACTICAL COMMAND:** Exploit immediate elemental vulnerabilities and maximize STAB kinetic scaling to dominate the turn sequence! 🌀`;
    }
  }
};
