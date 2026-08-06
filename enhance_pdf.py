import re

with open('src/utils/exportPdf.ts', 'r') as f:
    content = f.read()

# I will rewrite the entire exportPdf.ts with enhanced styling

new_content = """import jsPDF from 'jspdf';

export function exportPokedexPDF(pokemonList: any[], genTitle: string = 'All Generations') {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const code = `POKEDEX-ARCHIVE-${Date.now().toString().slice(-6)}`;
    const todayDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Dark Header Banner - Full Width
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 50, 'F');
    
    // Glowing Cyan Top Stripe
    doc.setFillColor(6, 182, 212); // cyan-500
    doc.rect(0, 0, 210, 3, 'F');
    
    // Abstract Circuit/Data lines in header
    doc.setDrawColor(34, 211, 238);
    doc.setLineWidth(0.2);
    doc.line(15, 42, 195, 42);
    doc.line(15, 43, 60, 43);
    doc.line(150, 43, 195, 43);

    // Title text
    doc.setTextColor(34, 211, 238); // cyan-400
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('POKÉTHOLOGY CORE', 15, 20);

    doc.setTextColor(245, 158, 11); // amber-400
    doc.setFontSize(12);
    doc.text(`DATABASE EXPORT: ${genTitle.toUpperCase()}`, 15, 28);

    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFontSize(8.5);
    doc.setFont('Helvetica', 'normal');
    doc.text(`DATE: ${todayDate}  |  ARCHIVE ID: ${code}`, 15, 36);

    // Status Badge
    doc.setFillColor(6, 182, 212); // cyan-500
    doc.roundedRect(142, 15, 53, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('OFFICIAL RECORD EXPORT', 145, 22.5);

    let y = 58;

    // Table Header Box
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(15, y, 180, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    
    const colX = { id: 18, name: 35, type: 85, hp: 130, atk: 145, def: 160, spd: 175 };
    
    doc.text('ID', colX.id, y + 6.5);
    doc.text('NAME', colX.name, y + 6.5);
    doc.text('TYPE(S)', colX.type, y + 6.5);
    doc.text('HP', colX.hp, y + 6.5);
    doc.text('ATK', colX.atk, y + 6.5);
    doc.text('DEF', colX.def, y + 6.5);
    doc.text('SPD', colX.spd, y + 6.5);

    y += 10;
    const pageHeight = 280;
    const items = pokemonList.slice(0, 150);

    items.forEach((p, idx) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;

        // Repeat header on new page
        doc.setFillColor(30, 41, 59);
        doc.rect(15, y, 180, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('ID', colX.id, y + 6.5);
        doc.text('NAME', colX.name, y + 6.5);
        doc.text('TYPE(S)', colX.type, y + 6.5);
        doc.text('HP', colX.hp, y + 6.5);
        doc.text('ATK', colX.atk, y + 6.5);
        doc.text('DEF', colX.def, y + 6.5);
        doc.text('SPD', colX.spd, y + 6.5);
        y += 10;
      }

      // Alternating row background
      if (idx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
      } else {
        doc.setFillColor(241, 245, 249);
      }
      doc.rect(15, y, 180, 8, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      
      const formattedId = `#${String(p.id || idx + 1).padStart(3, '0')}`;
      doc.text(formattedId, colX.id, y + 5.5);
      
      const nameStr = (p.name || 'Unknown').toUpperCase().replace(/-/g, ' ');
      doc.text(nameStr, colX.name, y + 5.5);
      
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      
      const typesStr = Array.isArray(p.types)
        ? p.types.map((t: any) => (typeof t === 'string' ? t : t.type?.name || '')).filter(Boolean).join(' / ').toUpperCase()
        : 'NORMAL';
      doc.text(typesStr, colX.type, y + 5.5);
      
      // Stats
      const hp = p.stats?.hp ?? (Array.isArray(p.stats) ? p.stats[0]?.base_stat : '-');
      const atk = p.stats?.attack ?? (Array.isArray(p.stats) ? p.stats[1]?.base_stat : '-');
      const def = p.stats?.defense ?? (Array.isArray(p.stats) ? p.stats[2]?.base_stat : '-');
      const spd = p.stats?.speed ?? (Array.isArray(p.stats) ? p.stats[5]?.base_stat : '-');
      
      doc.setFont('Courier', 'bold');
      doc.text(String(hp ?? '-'), colX.hp, y + 5.5);
      doc.text(String(atk ?? '-'), colX.atk, y + 5.5);
      doc.text(String(def ?? '-'), colX.def, y + 5.5);
      doc.text(String(spd ?? '-'), colX.spd, y + 5.5);
      
      y += 8;
    });

    // Footer
    if (y + 25 > pageHeight) {
      doc.addPage();
      y = 20;
    } else {
      y += 6;
    }

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(15, y, 180, 20, 2, 2, 'F');
    doc.setTextColor(245, 158, 11);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('OFFICIAL POKÉTHOLOGY RESEARCH ARCHIVE TRANSCRIPT', 20, y + 8);
    
    doc.setTextColor(148, 163, 184);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Generated by Pokéthology Core | ${items.length} units catalogued. Total filtered count: ${pokemonList.length}.`, 20, y + 14);

    doc.save(`Pokethology_Pokedex_${code}.pdf`);
  } catch (err) {
    console.error('Failed to generate Pokédex PDF report:', err);
  }
}

export function exportMissionPDF(
  mission: { title?: string; target?: string; description?: string; rewardPoints?: number },
  progressCount: number = 1,
  requiredCount: number = 1,
  recentBattles: any[] = []
) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const code = `MISSION-${Date.now().toString().slice(-6)}`;
    const todayDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Dark Header Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 55, 'F');
    
    // Glowing Cyan Top Stripe
    doc.setFillColor(6, 182, 212); // cyan-500
    doc.rect(0, 0, 210, 3, 'F');

    // Abstract Circuit/Data lines in header
    doc.setDrawColor(34, 211, 238);
    doc.setLineWidth(0.2);
    doc.line(15, 48, 195, 48);
    doc.line(15, 49, 60, 49);
    doc.line(150, 49, 195, 49);

    // Title text
    doc.setTextColor(34, 211, 238); // cyan-400
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('POKÉTHOLOGY CORE', 15, 20);

    doc.setTextColor(245, 158, 11); // amber-400
    doc.setFontSize(12);
    doc.text('DAILY COMBAT MISSION ACCREDITATION REPORT', 15, 28);

    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFontSize(8.5);
    doc.setFont('Helvetica', 'normal');
    doc.text(`DATE: ${todayDate}  |  ACCREDITATION ID: ${code}`, 15, 36);

    // Status Badge
    doc.setFillColor(16, 185, 129); // emerald-500
    doc.roundedRect(148, 16, 47, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text('MISSION COMPLETED', 151, 23.5);

    let y = 65;

    // Box 1: Mission Objectives
    doc.setLineWidth(0.4);
    doc.setDrawColor(148, 163, 184);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, y, 180, 56, 3, 3, 'FD');
    
    // Header for Box 1
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(15, y, 180, 14, 3, 3, 'F');
    doc.rect(15, y + 10, 180, 4, 'F'); // Square bottom corners for header

    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('1. MISSION SPECIFICATIONS & TARGET OBJECTIVES', 20, y + 9);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(217, 119, 6); // amber-600
    doc.text(mission.title ? mission.title.toUpperCase() : 'DAILY TACTICAL COMBAT DIRECTIVE', 20, y + 25);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const splitDesc = doc.splitTextToSize(
      mission.description || 'Complete combat targets in the tactical simulation arena.',
      170
    );
    doc.text(splitDesc, 20, y + 33);

    doc.setFillColor(20, 184, 166);
    doc.rect(20, y + 46, 170, 7, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(
      `OBJECTIVE STATUS: ${progressCount} / ${requiredCount} TARGETS VALIDATED (100% COMPLETE)`,
      23,
      y + 51
    );

    y += 66;

    // Box 2: Combat Summaries & Tactical Logs
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(148, 163, 184);
    doc.roundedRect(15, y, 180, 85, 3, 3, 'FD');

    // Header for Box 2
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(15, y, 180, 14, 3, 3, 'F');
    doc.rect(15, y + 10, 180, 4, 'F'); // Square bottom corners for header

    doc.setTextColor(15, 23, 42);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('2. COMBAT PERFORMANCE SUMMARIES', 20, y + 9);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text('• Simulation Arena: Tactical Pokéthology Battle Module', 20, y + 22);
    doc.text('• Operational Combat Rating: S-TIER ACCREDITED', 20, y + 29);
    doc.text(`• Reward Bounty Unlocked: +${mission.rewardPoints || 180} GRID PTS`, 20, y + 36);

    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Recent Arena Engagement Log:', 20, y + 46);

    doc.setFont('Courier', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    if (recentBattles && recentBattles.length > 0) {
      recentBattles.slice(0, 4).forEach((b: any, idx: number) => {
        const resultText = b.winner === 'player' ? 'VICTORY' : 'DEFEAT / LOGGED';
        const oppName = (b.opponentName || 'Opponent Unit').toUpperCase();
        doc.text(`  > [LOG ${idx + 1}] ${resultText} vs ${oppName} - ${b.turns || 1} Turns (${b.date || todayDate})`, 20, y + 54 + (idx * 7));
      });
    } else {
      doc.text('  > [LOG 1] VICTORY vs TARGET SIMULATION UNIT - 3 TURNS (ACCREDITED)', 20, y + 54);
      doc.text('  > [LOG 2] VICTORY vs ELITE CHALLENGER UNIT - 5 TURNS (ACCREDITED)', 20, y + 61);
    }

    y += 95;

    // Official Seal & Footer Box
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(15, y, 180, 26, 3, 3, 'F');
    doc.setTextColor(245, 158, 11);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text('OFFICIAL POKÉTHOLOGY RESEARCH & TACTICAL BOARD', 20, y + 10);
    
    doc.setTextColor(148, 163, 184);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Certified digital transcript. Validated by Pokéthology Core Neural Subsystem.', 20, y + 18);

    doc.save(`Pokethology_Combat_Mission_${code}.pdf`);
  } catch (err) {
    console.error('Failed to generate mission PDF report:', err);
  }
}
"""

with open('src/utils/exportPdf.ts', 'w') as f:
    f.write(new_content)

