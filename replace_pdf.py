with open('src/utils/exportPdf.ts', 'r') as f:
    content = f.read()

split_str = "export function exportPokemonDetailPDF("
part1 = content.split(split_str)[0]

new_func = """export async function exportPokemonDetailPDF(
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
      pdf.save(`Pokethology_Stats_Analysis_${name.replace(/\\s+/g, '_')}.pdf`);
      return;
    } else {
      console.warn("Stats capture zone not found, cannot capture PDF.");
    }
  } catch (err) {
    console.error('Failed to generate Pokémon detail PDF report:', err);
  }
}"""

with open('src/utils/exportPdf.ts', 'w') as f:
    f.write(part1 + new_func)
