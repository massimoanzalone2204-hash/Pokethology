import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Orbit, 
  Ruler, 
  Weight, 
  Radio, 
  BarChart, 
  Info, 
  BrainCircuit 
} from 'lucide-react';
import { HUDCorners } from './HUDCorners';
import { TypeBadge } from './TypeBadge';
import { cn } from '../lib/utils';
import { sounds } from '../lib/sounds';

interface DailyScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyPokemon: any;
  dailyFemalePokemon?: any;
  dailyGender: 'male' | 'female';
  setDailyGender: (gender: 'male' | 'female') => void;
  isShiny: boolean;
  setIsShiny: (shiny: boolean | ((prev: boolean) => boolean)) => void;
  todayStr: string;
  onViewSpecimen: (name: string) => void;
  playHaptic?: (type: any) => void;
}

export const DailyScanModal: React.FC<DailyScanModalProps> = ({
  isOpen,
  onClose,
  dailyPokemon,
  dailyFemalePokemon,
  dailyGender,
  setDailyGender,
  isShiny,
  setIsShiny,
  todayStr,
  onViewSpecimen,
  playHaptic,
}) => {
  if (!isOpen || !dailyPokemon) return null;

  const activePokemonData = (dailyGender === 'female' && dailyFemalePokemon) ? dailyFemalePokemon : dailyPokemon;
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

  const preferHome = activePokemonData?.id >= 10000 || activePokemonData?.name?.includes('mega') || activePokemonData?.name?.includes('tatsugiri');
  const artworkUrl = (isShiny ? (activePokemonData?.sprites?.other?.['official-artwork']?.front_shiny || activePokemonData?.sprites?.other?.home?.front_shiny) : null)
    || (preferHome ? (activePokemonData?.sprites?.other?.home?.front_default || activePokemonData?.sprites?.other?.['official-artwork']?.front_default) : activePokemonData?.sprites?.other?.['official-artwork']?.front_default)
    || activePokemonData?.sprites?.other?.['official-artwork']?.front_default 
    || activePokemonData?.sprites?.other?.home?.front_default 
    || activePokemonData?.sprites?.front_default 
    || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${isShiny ? 'shiny/' : ''}${activePokemonData?.id}.png`;

  const getStatPercent = (val: number) => Math.min(100, Math.round((val / 160) * 100));

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
              <Orbit className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-base font-hud font-black uppercase text-amber-300 tracking-wider">
                  DAILY COSMIC SPECIMEN
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[9px] font-bold border border-amber-400/30">
                  {todayStr}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-sans">
                Deep neural scan & complete biological metrics for specimen #{String(activePokemonData.id).padStart(3, '0')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              try { sounds.scan(); if (playHaptic) playHaptic('light'); } catch (_) {}
            }}
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm shrink-0"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">CLOSE</span>
          </button>
        </div>

        {/* Modal Main Scrollable Canvas */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 sm:p-6 md:p-8 max-w-5xl mx-auto w-full flex flex-col gap-6 relative z-10">
          {/* Header Card with Specimen Artwork and Core Details */}
          <div className="bg-slate-900/90 border-2 border-amber-500/30 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-2xl">
            <HUDCorners />
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Artwork Container */}
              <div className="relative shrink-0 flex flex-col items-center justify-center">
                <div className="w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 relative flex items-center justify-center bg-slate-950/60 rounded-2xl border border-slate-800 p-4">
                  {isShiny && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full text-[9px] font-hud font-bold uppercase tracking-wider animate-pulse z-20">
                      <Sparkles className="w-3 h-3 text-amber-300" /> SHINY
                    </div>
                  )}
                  <img
                    src={artworkUrl}
                    alt={activePokemonData.name}
                    className="w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(245,158,11,0.25)] select-none"
                    loading="lazy"
                  />
                </div>

                {/* Shiny & Gender toggles */}
                <div className="flex items-center gap-2 mt-3 w-full justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsShiny((prev: boolean) => !prev);
                      try { sounds.scan(); if (playHaptic) playHaptic('selection'); } catch (_) {}
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-[10px] font-hud font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer",
                      isShiny 
                        ? "bg-amber-500/30 text-amber-300 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]" 
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
                    )}
                  >
                    <Sparkles className="w-3 h-3" /> {isShiny ? "Shiny Mode: ON" : "Toggle Shiny"}
                  </button>

                  {dailyFemalePokemon && (
                    <button
                      type="button"
                      onClick={() => {
                        setDailyGender(dailyGender === 'male' ? 'female' : 'male');
                        try { sounds.scan(); if (playHaptic) playHaptic('selection'); } catch (_) {}
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border text-[10px] font-hud font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer",
                        dailyGender === 'female'
                          ? "bg-pink-500/30 text-pink-300 border-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.4)]"
                          : "bg-blue-500/30 text-blue-300 border-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.4)]"
                      )}
                    >
                      {dailyGender === 'female' ? "♀ Female" : "♂ Male"}
                    </button>
                  )}
                </div>
              </div>

              {/* Specimen Info & Stats Summary */}
              <div className="flex-1 flex flex-col gap-4 text-left w-full">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs sm:text-sm font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-md">
                      #{String(activePokemonData.id).padStart(3, '0')}
                    </span>
                    <span className="text-[10px] sm:text-xs font-hud font-bold uppercase text-slate-400">
                      CLASSIFIED SPECIMEN
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-hud font-black uppercase text-white tracking-wider">
                    {activePokemonData.name.replace(/-/g, ' ')}
                  </h1>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {activePokemonData.types?.map((t: any) => (
                      <TypeBadge key={t.type?.name || t} type={t.type?.name || t} size="sm" />
                    ))}
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 bg-slate-950/60 p-3.5 sm:p-4 rounded-2xl border border-slate-800">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-hud font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Ruler className="w-3 h-3 text-cyan-400" /> Height
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-200">
                      {heightM} m ({heightFeet}'{heightInches}")
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-hud font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Weight className="w-3 h-3 text-emerald-400" /> Weight
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-slate-200">
                      {weightKg} kg ({weightLbs} lbs)
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5 col-span-2 sm:col-span-1">
                    <span className="text-[9px] font-hud font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Radio className="w-3 h-3 text-amber-400" /> Abilities
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-amber-300 truncate" title={abilitiesStr}>
                      {abilitiesStr}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Stats visual indicator segment */}
          <div className="bg-slate-900/95 border-2 border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 relative shadow-xl text-left max-w-full">
            <HUDCorners />
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
            <HUDCorners />
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
                onViewSpecimen(activePokemonData.name);
                onClose();
              }}
              className="w-full font-hud font-black px-6 py-4 text-xs uppercase tracking-widest flex items-center justify-center gap-2 relative shadow-xl cursor-pointer group overflow-hidden rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent pointer-events-none z-10 animate-scan-shimmer" />
              <HUDCorners />
              <BrainCircuit className="w-4 h-4 shrink-0 text-slate-950 relative z-10" />
              <span className="relative z-10 font-bold">VIEW FULL SPECIMEN ARCHIVE</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
