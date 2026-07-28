import jsPDF from 'jspdf';

const COPYRIGHT_DISCLAIMER_LINE1 = 'Pokémon © 2002-2026 Pokémon. © 1995-2026 Nintendo/Creatures Inc./GAME FREAK inc. TM, ® and Pokémon character names are trademarks of Nintendo.';
const COPYRIGHT_DISCLAIMER_LINE2 = 'No copyright or trademark infringement is intended in using Pokémon content on Pokéthology.';

const SYSTEM_VERSION = 'Pokéthology OS v2.5.0-CORE';
const SECURITY_LEVEL = 'SECURITY LEVEL-4 CLEARED';

/**
 * Draws the official Pokéthology vector logo mark directly on the PDF
 */
function drawPokethologyHeaderLogo(doc: jsPDF, x: number, y: number) {
  doc.saveGraphicsState();
  
  // Outer glowing ring
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.circle(x, y, 11, 'F');

  // Dark slate ring
  doc.setFillColor(15, 23, 42); // slate-900
  doc.circle(x, y, 9.5, 'F');

  // Top half (Crimson / Coral Red)
  doc.setFillColor(225, 29, 72); // rose-600
  doc.circle(x, y, 8.5, 'F');

  // Bottom half (White / Light Slate)
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(x - 8.5, y, 17, 8.5, 'F');

  // Re-draw outer boundary to keep bottom rounded
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.8);
  doc.circle(x, y, 8.5, 'S');

  // Center division belt
  doc.setFillColor(15, 23, 42);
  doc.rect(x - 8.5, y - 1.2, 17, 2.4, 'F');

  // Outer button bezel
  doc.setFillColor(255, 255, 255);
  doc.circle(x, y, 3.2, 'F');

  // Inner button core
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.circle(x, y, 1.8, 'F');

  // Center pulse dot
  doc.setFillColor(255, 255, 255);
  doc.circle(x, y, 0.6, 'F');

  doc.restoreGraphicsState();
}

/**
 * Generates formatted header metadata block with branding artwork
 */
function drawHeaderBanner(doc: jsPDF, title: string, subtitle: string, code: string, dateStr: string) {
  // Dark Header Banner - Full Width
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 52, 'F');

  // Glowing Cyan Top Stripe
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 0, 210, 3.5, 'F');

  // High-tech vector circuit lines
  doc.setDrawColor(34, 211, 238); // cyan-400
  doc.setLineWidth(0.25);
  doc.line(15, 45, 195, 45);
  doc.line(15, 46.5, 65, 46.5);
  doc.line(145, 46.5, 195, 46.5);

  // Draw vector logo artwork on top right
  drawPokethologyHeaderLogo(doc, 182, 25);

  // Title & Subtitle text
  doc.setTextColor(34, 211, 238); // cyan-400
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('POKÉTHOLOGY CORE SYSTEM', 15, 18);

  doc.setTextColor(245, 158, 11); // amber-400
  doc.setFontSize(10);
  doc.text(title.toUpperCase(), 15, 26);

  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(8);
  doc.setFont('Helvetica', 'normal');
  doc.text(`DATE: ${dateStr}  |  REF: ${code}  |  ${SYSTEM_VERSION}`, 15, 34);
  doc.text(`${SECURITY_LEVEL}  |  CHECKSUM: ${code.replace(/[^0-9]/g, '')}-SHA256`, 15, 40);

  // Status Badge
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.roundedRect(125, 12, 42, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(subtitle.toUpperCase(), 127.5, 18.5);
}

/**
 * Standardized document footers with copyright and page numbers
 */
function drawDocumentFooters(doc: jsPDF, docTitle: string) {
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer divider
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(15, 280, 195, 280);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`${docTitle} | Page ${i} of ${totalPages}`, 15, 284);
    doc.text(`CONFIDENTIAL RESEARCH DOCUMENT — ${SYSTEM_VERSION}`, 195, 284, { align: 'right' });

    doc.setFontSize(5.5);
    doc.setTextColor(148, 163, 184);
    doc.text(COPYRIGHT_DISCLAIMER_LINE1, 105, 289, { align: 'center' });
    doc.text(COPYRIGHT_DISCLAIMER_LINE2, 105, 292, { align: 'center' });
  }
}

/**
 * Export single Pokémon research dossier report including selected Pokédex entry & full stats
 */
export function exportPokemonDetailPDF(
  pokemon: any,
  options?: {
    selectedEntryText?: string;
    selectedGameVersion?: string;
    selectedMoves?: any[];
  }
) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const code = `DOSSIER-${Date.now().toString().slice(-8)}`;
    const todayDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const name = (pokemon.name || 'UNKNOWN').toUpperCase().replace(/-/g, ' ');
    const idFormatted = `#${String(pokemon.baseId || pokemon.id || 1).padStart(3, '0')}`;
    const types = Array.isArray(pokemon.types)
      ? pokemon.types.map((t: any) => (typeof t === 'string' ? t : t.type?.name || '')).filter(Boolean).join(' / ').toUpperCase()
      : 'NORMAL';

    drawHeaderBanner(doc, `SPECIMEN DOSSIER: ${idFormatted} ${name}`, 'FIELD DOSSIER', code, todayDate);

    let y = 58;

    // SECTION 1: SPECIMEN IDENTITY & CURRENTLY SELECTED POKEDEX ENTRY
    doc.setLineWidth(0.4);
    doc.setDrawColor(148, 163, 184);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, y, 180, 50, 3, 3, 'FD');

    // Section 1 Header
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(15, y, 180, 11, 3, 3, 'F');
    doc.rect(15, y + 8, 180, 3, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('1. SPECIMEN IDENTITY & SELECTED POKÉDEX ENTRY', 20, y + 7.5);

    // Version Badge
    const gameVer = (options?.selectedGameVersion || 'Core Registry').toUpperCase().replace(/-/g, ' ');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(14, 116, 144); // cyan-700
    doc.text(`SELECTED VERSION ENTRY: [ ${gameVer} ]`, 20, y + 18);

    // Entry Description
    const entryText = options?.selectedEntryText || pokemon.description || 'No lore description recorded for this specimen unit.';
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitText = doc.splitTextToSize(`"${entryText}"`, 170);
    doc.text(splitText, 20, y + 25);

    // Types & Category info row
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`PRIMARY TYPE MATRIX: ${types}`, 20, y + 44);

    y += 56;

    // SECTION 2: FULL BASE STATS BREAKDOWN & COMBAT HUD
    doc.setLineWidth(0.4);
    doc.setDrawColor(148, 163, 184);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, y, 180, 84, 3, 3, 'FD');

    doc.setFillColor(226, 232, 240);
    doc.roundedRect(15, y, 180, 11, 3, 3, 'F');
    doc.rect(15, y + 8, 180, 3, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('2. COMPLETE BASE STATS MATRIX & COMBAT HUD', 20, y + 7.5);

    // Robust stat extractor
    const extractStat = (stats: any, key: string, fallbackIdx: number): number => {
      if (!stats) return 50;
      if (Array.isArray(stats)) {
        const found = stats.find((s: any) => 
          s?.stat?.name === key || 
          s?.name === key ||
          s?.statName === key
        );
        if (found && typeof found.base_stat === 'number') return found.base_stat;
        if (found && typeof found.val === 'number') return found.val;
        if (stats[fallbackIdx] && typeof stats[fallbackIdx].base_stat === 'number') return stats[fallbackIdx].base_stat;
      } else if (typeof stats === 'object') {
        const val = stats[key] ?? stats[key.replace('-', '')];
        if (typeof val === 'number') return val;
      }
      return 50;
    };

    const hp = extractStat(pokemon.stats, 'hp', 0);
    const atk = extractStat(pokemon.stats, 'attack', 1);
    const def = extractStat(pokemon.stats, 'defense', 2);
    const spAtk = extractStat(pokemon.stats, 'special-attack', 3);
    const spDef = extractStat(pokemon.stats, 'special-defense', 4);
    const spd = extractStat(pokemon.stats, 'speed', 5);
    const totalStat = Number(hp) + Number(atk) + Number(def) + Number(spAtk) + Number(spDef) + Number(spd);

    const ratingGrade = totalStat >= 600 ? 'S-TIER (LEGENDARY CLASS)' : totalStat >= 500 ? 'A-TIER (ELITE CLASS)' : totalStat >= 400 ? 'B-TIER (STANDARD HIGH)' : 'C-TIER (STANDARD)';

    const statRows = [
      { name: 'HP (Hit Points)', val: hp, max: 255, color: [239, 68, 68], lv50: Math.floor(hp * 2 + 110), lv100: Math.floor(hp * 2 + 204) },
      { name: 'Attack', val: atk, max: 190, color: [249, 115, 22], lv50: Math.floor((atk * 2 + 99) * 0.5 + 5), lv100: Math.floor(atk * 2 + 104) },
      { name: 'Defense', val: def, max: 230, color: [234, 179, 8], lv50: Math.floor((def * 2 + 99) * 0.5 + 5), lv100: Math.floor(def * 2 + 104) },
      { name: 'Special Attack', val: spAtk, max: 194, color: [59, 130, 246], lv50: Math.floor((spAtk * 2 + 99) * 0.5 + 5), lv100: Math.floor(spAtk * 2 + 104) },
      { name: 'Special Defense', val: spDef, max: 230, color: [34, 197, 94], lv50: Math.floor((spDef * 2 + 99) * 0.5 + 5), lv100: Math.floor(spDef * 2 + 104) },
      { name: 'Speed', val: spd, max: 200, color: [168, 85, 247], lv50: Math.floor((spd * 2 + 99) * 0.5 + 5), lv100: Math.floor(spd * 2 + 104) },
    ];

    // Table Subheader
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('STAT PARAMETER', 22, y + 17);
    doc.text('BASE', 65, y + 17);
    doc.text('PROGRESS BAR', 80, y + 17);
    doc.text('LV.50 MAX', 142, y + 17);
    doc.text('LV.100 MAX', 168, y + 17);

    statRows.forEach((st, idx) => {
      const rowY = y + 24 + idx * 8.5;
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(st.name, 22, rowY);

      doc.setFont('Courier', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(String(st.val), 65, rowY);

      // Stat visual bar background
      doc.setFillColor(226, 232, 240);
      doc.rect(80, rowY - 3, 56, 3.8, 'F');
      const barW = Math.min(56, Math.max(2, (st.val / st.max) * 56));
      doc.setFillColor(st.color[0], st.color[1], st.color[2]);
      doc.rect(80, rowY - 3, barW, 3.8, 'F');

      doc.setFont('Courier', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`${st.lv50}`, 142, rowY);
      doc.text(`${st.lv100}`, 168, rowY);
    });

    // Total Stats line & Rating Badge
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(14, 116, 144);
    doc.text(`BASE STAT TOTAL (BST): ${totalStat}   |   CLASSIFICATION: ${ratingGrade}`, 22, y + 78);

    y += 86;

    // SECTION 3: PHYSICAL METRICS & ARTWORK SPECIFICATIONS
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(148, 163, 184);
    doc.roundedRect(15, y, 180, 42, 3, 3, 'FD');

    doc.setFillColor(226, 232, 240);
    doc.roundedRect(15, y, 180, 11, 3, 3, 'F');
    doc.rect(15, y + 8, 180, 3, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('3. PHYSICAL METRICS & ARTWORK SPECIFICATIONS', 20, y + 7.5);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    const heightM = pokemon.height ? (pokemon.height / 10).toFixed(1) + ' m (' + ((pokemon.height / 10) * 3.28084).toFixed(1) + ' ft)' : 'N/A';
    const weightKg = pokemon.weight ? (pokemon.weight / 10).toFixed(1) + ' kg (' + ((pokemon.weight / 10) * 2.20462).toFixed(1) + ' lbs)' : 'N/A';
    const baseExp = pokemon.baseExperience || pokemon.base_experience || 'N/A';
    const abilitiesStr = Array.isArray(pokemon.abilities)
      ? pokemon.abilities.map((a: any) => (typeof a === 'string' ? a : a.ability?.name || '')).filter(Boolean).join(', ').toUpperCase()
      : 'N/A';

    doc.text(`• Height: ${heightM}   |   Weight: ${weightKg}`, 22, y + 18);
    doc.text(`• Base Experience Yield: ${baseExp} EXP`, 22, y + 25);
    doc.text(`• Registered Abilities: ${abilitiesStr}`, 22, y + 32);

    y += 48;

    // SECTION 4: COMBAT HUD LOADOUT & EQUIPPED MOVES
    const movesList = options?.selectedMoves && options.selectedMoves.length > 0 
      ? options.selectedMoves 
      : (Array.isArray(pokemon.moves) ? pokemon.moves.slice(0, 4) : []);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(148, 163, 184);
    doc.roundedRect(15, y, 180, 38, 3, 3, 'FD');

    doc.setFillColor(226, 232, 240);
    doc.roundedRect(15, y, 180, 11, 3, 3, 'F');
    doc.rect(15, y + 8, 180, 3, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('4. COMBAT HUD LOADOUT & EQUIPPED MOVESET', 20, y + 7.5);

    if (movesList.length > 0) {
      movesList.slice(0, 4).forEach((m: any, idx: number) => {
        const moveY = y + 18 + idx * 4.5;
        const moveName = (typeof m === 'string' ? m : m.name || 'MOVE').toUpperCase().replace(/-/g, ' ');
        const moveType = (m.type || 'NORMAL').toUpperCase();
        const pwr = m.power || '--';
        const acc = m.accuracy || '--';
        const pp = m.pp || '15';

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(14, 116, 144);
        doc.text(`SLOT ${idx + 1}: ${moveName}`, 22, moveY);

        doc.setFont('Courier', 'normal');
        doc.setTextColor(51, 65, 85);
        doc.text(`[TYPE: ${moveType} | PWR: ${pwr} | ACC: ${acc} | PP: ${pp}]`, 95, moveY);
      });
    } else {
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Standard tactical moveset automatically assigned by Core Combat Engine.', 22, y + 20);
    }

    drawDocumentFooters(doc, `Pokéthology Specimen Dossier — ${name}`);
    doc.save(`Pokethology_Dossier_${name.replace(/\s+/g, '_')}_${code}.pdf`);
  } catch (err) {
    console.error('Failed to generate Pokémon detail PDF report:', err);
  }
}
