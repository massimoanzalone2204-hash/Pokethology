import html2canvas from "html2canvas";
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
export async function exportPokemonDetailPDF(
  pokemon: any,
  options?: { selectedEntryText?: string; selectedGameVersion?: string; selectedMoves?: any[] }
) {
  try {
    const el = document.getElementById('pokemon-stats-capture-zone');
    if (el) {
      const isLightMode = document.documentElement.classList.contains('light');
      
      const originalMaxHeight = el.style.maxHeight;
      const originalOverflow = el.style.overflow;
      el.style.maxHeight = 'none';
      el.style.overflow = 'visible';

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: isLightMode ? '#ffffff' : '#020617',
        useCORS: true,
        logging: false
      });
      
      el.style.maxHeight = originalMaxHeight;
      el.style.overflow = originalOverflow;

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const name = (pokemon.name || 'Unknown').toUpperCase();
      pdf.save(`Pokethology_Stats_Analysis_${name.replace(/\s+/g, '_')}.pdf`);
      return;
    } else {
      console.warn("Stats capture zone not found, cannot capture PDF.");
    }
  } catch (err) {
    console.error('Failed to generate Pokémon detail PDF report:', err);
  }
}