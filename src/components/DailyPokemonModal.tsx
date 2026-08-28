import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Volume2, 
  Sparkle, 
  Info, 
  BrainCircuit, 
  BarChart, 
  Layers, 
  Dna, 
  Ruler, 
  Weight 
} from 'lucide-react';
import { Pokemon } from '../types';
import { cn, hudButtonClass } from '../lib/utils';
import { TypeBadge } from './TypeBadge';
import { sounds } from '../lib/sounds';

interface DailyPokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyPokemon: Pokemon | null;
  dailyFemalePokemon?: Pokemon | null;
  dailyGender?: 'male' | 'female';
  setDailyGender?: (gender: 'male' | 'female') => void;
  isShiny: boolean;
  setIsShiny: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectPokemon: (name: string) => void;
}

export const DailyPokemonModal: React.FC<DailyPokemonModalProps> = ({
  isOpen,
  onClose,
  dailyPokemon,
  dailyFemalePokemon,
  dailyGender = 'male',
  setDailyGender,
  isShiny,
  setIsShiny,
  onSelectPokemon,
}) => {
  if (!isOpen || !dailyPokemon) return null;

  const activePokemonData: any = (dailyGender === 'female' && dailyFemalePokemon) ? dailyFemalePokemon : dailyPokemon;
  const hp = activePokemonData.stats?.find((s: any) => s.stat?.name === 'hp')?.base_stat || 50;
  const attack = activePokemonData.stats?.find((s: any) => s.stat?.name === 'attack')?.base_stat || 50;
  const defense = activePokemonData.stats?.find((s: any) => s.stat?.name === 'defense')?.base_stat || 50;
  const spAtk = activePokemonData.stats?.find((s: any) => s.stat?.name === 'special-attack')?.base_stat || 50;
  const spDef = activePokemonData.stats?.find((s: any) => s.stat?.name === 'special-defense')?.base_stat || 50;
  const speed = activePokemonData.stats?.find((s: any) => s.stat?.name === 'speed')?.base_stat || 50;

  const heightM = ((activePokemonData.height || 10) / 10).toFixed(1);
  const heightFeet = Math.floor(((activePokemonData.height || 10) / 10) * 3.28084);
  const heightInches = Math.round((((activePokemonData.height || 10) / 10) * 3.28084 - heightFeet) * 12);
  const weightKg = ((activePokemonData.weight || 100) / 10).toFixed(1);
  const weightLbs = (((activePokemonData.weight || 100) / 10) * 2.20462).toFixed(1);
  const abilitiesStr = activePokemonData.abilities?.map((a: any) => (a.ability?.name || a.name || '').replace(/-/g, ' ')).join(', ') || 'None';

  const preferHome = (activePokemonData?.id || 0) >= 10000 || activePokemonData?.name?.includes('mega') || activePokemonData?.name?.includes('tatsugiri');
  const artworkUrl = (isShiny ? (activePokemonData?.sprites?.other?.['official-artwork']?.front_shiny || activePokemonData?.sprites?.other?.home?.front_shiny) : null)
    || (preferHome ? (activePokemonData?.sprites?.other?.home?.front_default || activePokemonData?.sprites?.other?.['official-artwork']?.front_default) : activePokemonData?.sprites?.other?.['official-artwork']?.front_default)
    || activePokemonData?.sprites?.other?.['official-artwork']?.front_default 
    || activePokemonData?.sprites?.other?.home?.front_default 
    || activePokemonData?.sprites?.front_default 
    || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${isShiny ? 'shiny/' : ''}${activePokemonData?.id}.png`;

  const getStatPercent = (val: number) => Math.min(100, Math.round((val / 160) * 100));

  const handlePlayCry = () => {
    if (sounds?.playCry) {
      sounds.playCry(activePokemonData.name, activePokemonData.cries?.latest, activePokemonData.id);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="daily-scan-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 250 }}
        className="fixed inset-0 z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden"
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top System bar with high contrast banner */}
        <div className="shrink-0 border-b border-amber-500/30 bg-slate-900/90 px-4 sm:px-8 py-3 flex items-center justify-between gap-3 z-20 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="font-hud font-black text-base sm:text-xl text-amber-300 uppercase tracking-widest leading-none">
                DAILY SCAN
              </h2>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => {
              sounds.hover();
              onClose();
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800/80 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/50 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all cursor-pointer shadow-md group"
            title="Exit Deep Scan"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-6xl mx-auto w-full flex flex-col gap-6 relative z-10 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Hologram Specimen Presentation */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-3xl p-6 relative flex flex-col items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.15)] group min-h-[380px]">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
                
                {/* Holographic Radar Circle */}
                <div className="absolute w-64 h-64 border border-amber-500/20 rounded-full pointer-events-none animate-spin-slow" />
                <div className="absolute w-48 h-48 border border-dashed border-amber-500/30 rounded-full pointer-events-none animate-reverse-spin" />

                {/* Badges / Header details inside card */}
                <div className="w-full flex justify-between items-center z-10 mb-2">
                  <span className="font-hud font-black text-xs text-amber-400 tracking-wider bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full uppercase">
                    #{String(activePokemonData.id || 0).padStart(4, '0')}
                  </span>
                  <div className="flex gap-1.5">
                    {activePokemonData.types?.map((t: any) => (
                      <TypeBadge key={t.type?.name || t} type={t.type?.name || t} size="sm" />
                    ))}
                  </div>
                </div>

                {/* Pokemon Sprite Presentation */}
                <div className="relative z-10 my-4 flex items-center justify-center min-h-[220px]">
                  <img 
                    src={artworkUrl} 
                    alt={activePokemonData.name} 
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] filter transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Title & Genus */}
                <div className="text-center z-10 w-full">
                  <h3 className="font-hud font-black text-2xl sm:text-3xl text-white uppercase tracking-widest">
                    {String(activePokemonData.name || '').replace(/-/g, ' ')}
                  </h3>
                  <p className="text-xs text-amber-300/80 font-sans tracking-wide mt-0.5">
                    {activePokemonData.genus || 'Species Classified'}
                  </p>
                </div>

                {/* Sub Controls: Shiny, Cry & Gender */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4 z-10 w-full pt-3 border-t border-slate-800/80">
                  <button 
                    type="button"
                    onClick={() => {
                      sounds.hover();
                      setIsShiny(!isShiny);
                    }}
                    className={cn(
                      hudButtonClass(isShiny, 'amber'),
                      "!py-1.5 !px-3 !text-[10px] font-hud font-bold tracking-wider uppercase flex items-center gap-1.5 rounded-lg transition-all cursor-pointer"
                    )}
                  >
                    <Sparkle className={cn("w-3.5 h-3.5", isShiny ? "text-amber-300 fill-amber-300" : "text-slate-400")} />
                    <span>{isShiny ? 'Shiny Form' : 'Regular'}</span>
                  </button>

                  <button 
                    type="button"
                    onClick={handlePlayCry}
                    className={cn(
                      hudButtonClass(false, 'cyan'),
                      "!py-1.5 !px-3 !text-[10px] font-hud font-bold tracking-wider uppercase flex items-center gap-1.5 rounded-lg transition-all cursor-pointer"
                    )}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Acoustic Cry</span>
                  </button>

                  {dailyFemalePokemon && setDailyGender && (
                    <button 
                      type="button"
                      onClick={() => {
                        sounds.hover();
                        setDailyGender(dailyGender === 'female' ? 'male' : 'female');
                      }}
                      className={cn(
                        hudButtonClass(dailyGender === 'female', 'purple'),
                        "!py-1.5 !px-3 !text-[10px] font-hud font-bold tracking-wider uppercase flex items-center gap-1.5 rounded-lg transition-all cursor-pointer"
                      )}
                    >
                      <span>{dailyGender === 'female' ? '♀ Female' : '♂ Male'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Analytical Specs & Base Stats Presentation */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Biological Specs Bar */}
              <div className="bg-slate-900/90 border-2 border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 relative shadow-xl text-left max-w-full">
                <div className="flex items-center gap-1.5 text-xs font-hud font-black text-amber-400 tracking-wider border-b border-slate-800/80 pb-2 uppercase">
                  <Layers className="w-4 h-4 shrink-0 text-amber-400" /> Physical & Bio Metrics
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-xl flex flex-col gap-1">
                    <span className="text-[9px] font-hud font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Ruler className="w-3 h-3 text-cyan-400" /> Height
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-200">
                      {heightM}m <span className="text-[10px] text-slate-400 font-normal">({heightFeet}'{heightInches}")</span>
                    </span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-xl flex flex-col gap-1">
                    <span className="text-[9px] font-hud font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Weight className="w-3 h-3 text-cyan-400" /> Weight
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-200">
                      {weightKg}kg <span className="text-[10px] text-slate-400 font-normal">({weightLbs}lbs)</span>
                    </span>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-xl flex flex-col gap-1 col-span-2 sm:col-span-1">
                    <span className="text-[9px] font-hud font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Dna className="w-3 h-3 text-cyan-400" /> Habitat
                    </span>
                    <span className="font-sans text-xs font-bold text-slate-200 capitalize truncate">
                      {activePokemonData.habitat || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800/80 p-2.5 rounded-xl flex flex-col gap-1">
                  <span className="text-[9px] font-hud font-bold text-slate-400 uppercase tracking-widest">
                    Recognized Abilities
                  </span>
                  <span className="font-sans text-xs text-amber-300/90 font-medium capitalize">
                    {abilitiesStr}
                  </span>
                </div>
              </div>

              {/* Base Stats Real indicator segment */}
              <div className="bg-slate-900/95 border-2 border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 relative shadow-xl text-left max-w-full">
                <div className="flex items-center gap-1.5 border-b border-slate-800/80 pb-2 mb-0.5 justify-between">
                  <div className="flex items-center gap-1.5">
                    <BarChart className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs font-hud font-black text-amber-400 tracking-wider uppercase">BASE STATS ANALYTICS</span>
                  </div>
                </div>

                {/* Stat Bars Grid */}
                <div className="flex flex-col gap-2.5 text-left w-full">
                  {/* HP */}
                  <div className="flex flex-col gap-0.5 w-full text-left">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-slate-300">
                      <span>HEALTH POINTS (HP)</span>
                      <span className="text-cyan-400 font-bold">{hp}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${getStatPercent(hp)}%` }} />
                    </div>
                  </div>
                  
                  {/* Atk */}
                  <div className="flex flex-col gap-0.5 w-full text-left">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-slate-300">
                      <span>PHYSICAL ATTACK</span>
                      <span className="text-amber-400 font-bold">{attack}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-1000" style={{ width: `${getStatPercent(attack)}%` }} />
                    </div>
                  </div>

                  {/* Def */}
                  <div className="flex flex-col gap-0.5 w-full text-left">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-slate-300">
                      <span>PHYSICAL DEFENSE</span>
                      <span className="text-blue-400 font-bold">{defense}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${getStatPercent(defense)}%` }} />
                    </div>
                  </div>

                  {/* Sp Atk */}
                  <div className="flex flex-col gap-0.5 w-full text-left">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-slate-300">
                      <span>SPECIAL ATTACK</span>
                      <span className="text-pink-400 font-bold">{spAtk}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-500 to-purple-400 rounded-full transition-all duration-1000" style={{ width: `${getStatPercent(spAtk)}%` }} />
                    </div>
                  </div>

                  {/* Sp Def */}
                  <div className="flex flex-col gap-0.5 w-full text-left">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-slate-300">
                      <span>SPECIAL DEFENSE</span>
                      <span className="text-purple-400 font-bold">{spDef}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-1000" style={{ width: `${getStatPercent(spDef)}%` }} />
                    </div>
                  </div>

                  {/* Speed */}
                  <div className="flex flex-col gap-0.5 w-full text-left">
                    <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold text-slate-300">
                      <span>KINETIC SPEED</span>
                      <span className="text-emerald-400 font-bold">{speed}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000" style={{ width: `${getStatPercent(speed)}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic lore analyzer segment */}
              <div className="bg-slate-900/95 border-2 border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 relative shadow-xl text-left max-w-full">
                <div className="flex items-center gap-1.5 text-xs font-hud font-black text-amber-400 tracking-wider border-b border-slate-800/80 pb-2 uppercase">
                  <Info className="w-4 h-4 shrink-0 animate-pulse text-amber-400" /> Lore Analysis
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                  <strong className="text-cyan-300 block mb-1 font-hud uppercase tracking-widest text-[9px] sm:text-[10px]">Pokédex Entry</strong>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium break-words whitespace-pre-line" style={{ overflowWrap: 'anywhere' }}>
                    {activePokemonData.description}
                  </p>
                </div>
              </div>

              {/* Action Desk buttons */}
              <div className="flex justify-end items-center gap-3 w-full mt-2">
                <button 
                  type="button"
                  onClick={() => {
                    onSelectPokemon(activePokemonData.name);
                    onClose();
                  }}
                  className={cn(hudButtonClass(false, 'amber'), "w-full font-hud font-black px-6 py-4 !text-xs uppercase tracking-widest flex items-center justify-center gap-2 relative shadow-xl cursor-pointer group overflow-hidden rounded-xl")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent pointer-events-none z-10 animate-scan-shimmer" />
                  <BrainCircuit className="w-4 h-4 shrink-0 text-amber-300 relative z-10" />
                  <span className="relative z-10">VIEW FULL SPECIMEN ARCHIVE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
