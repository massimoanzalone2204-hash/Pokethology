import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Swords, 
  Cpu, 
  Newspaper, 
  Globe, 
  ExternalLink, 
  Calendar, 
  Activity, 
  Database, 
  Radar, 
  Brain, 
  Shield, 
  Crosshair, 
  Map, 
  Volume2, 
  Share2, 
  Github, 
  Instagram, 
  Image, 
  Gamepad2,
  Search,
  Star,
  Settings as SettingsIcon,
  Sliders,
  Layers,
  Award,
  Zap,
  GitBranch,
  BarChart3,
  Dna,
  Mic,
  MessageSquare,
  Flame,
  Target,
  CheckCircle2,
  TrendingUp,
  Compass
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Tutorial = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'pokedex' | 'pokethology' | 'combat' | 'daily' | 'social' | 'news'>('pokedex');
  const [pokemonNews, setPokemonNews] = useState<any[]>([]);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [loadingNews, setLoadingNews] = useState<boolean>(false);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('pokedex');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === 'news') {
      let isMounted = true;
      const fetchNews = async () => {
        setLoadingNews(true);
        setNewsError(null);
        try {
          const res = await fetch('/api/news');
          if (!res.ok) throw new Error('Failed to load Pokémon news');
          const data = await res.json();
          if (isMounted) {
            setPokemonNews(data.news || []);
            setIsFallback(data.isFallback ?? false);
          }
        } catch (err: any) {
          if (isMounted) {
            setNewsError(err.message || 'Error loading news');
          }
        } finally {
          if (isMounted) {
            setLoadingNews(false);
          }
        }
      };
      fetchNews();
      return () => {
        isMounted = false;
      };
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex flex-col bg-slate-950/98 backdrop-blur-2xl overflow-hidden text-slate-100"
      >
        {/* Header */}
        <div className="shrink-0 flex justify-between items-center px-4 sm:px-8 py-3.5 border-b border-cyan-500/30 w-full bg-slate-900/90 z-20 shadow-lg">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-cyan-950/80 border border-cyan-500/50 rounded-xl text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
            >
              <BookOpen className="w-5 h-5 text-cyan-400 shrink-0" />
            </motion.div>
            <div>
              <h2 className="text-sm sm:text-lg font-hud font-black text-cyan-300 uppercase tracking-widest leading-none">
                Pokéthology Tutorial
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-hud font-bold uppercase tracking-wider group shadow-sm"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span className="hidden sm:inline">CLOSE</span>
          </button>
        </div>

        {/* Tab Selection Row */}
        <div className="shrink-0 flex gap-1.5 overflow-x-auto custom-scrollbar no-scrollbar px-4 sm:px-8 py-2.5 border-b border-slate-800 bg-slate-900/60 select-none z-10">
          {(['pokedex', 'pokethology', 'combat', 'daily', 'social', 'news'] as const).map(tab => {
            const icons = {
              pokedex: <Database className="w-3 h-3 text-emerald-400" />,
              pokethology: <Brain className="w-3 h-3 text-purple-400" />,
              combat: <Swords className="w-3 h-3 text-red-400" />,
              daily: <Calendar className="w-3 h-3 text-amber-400" />,
              social: <Share2 className="w-3 h-3 text-pink-400" />,
              news: <Newspaper className="w-3 h-3 text-cyan-400" />
            };
            const titles = {
              pokedex: 'POKÉDEX',
              pokethology: 'POKÉTHOLOGY',
              combat: 'COMBAT',
              daily: 'DAILY & UTILITIES',
              social: 'SOCIAL',
              news: 'NEWS'
            };

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[8px] sm:text-[10px] font-hud font-black uppercase tracking-wider transition-all border shrink-0 cursor-pointer flex items-center gap-1.5 group",
                  activeTab === tab
                    ? "bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.22)] scale-102"
                    : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-300"
                )}
              >
                <motion.div 
                  animate={activeTab === tab ? { scale: [1, 1.2, 1] } : {}} 
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {icons[tab]}
                </motion.div>
                {titles[tab]}
              </button>
            );
          })}
        </div>

        {/* Main Scroller Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar text-[11.5px] sm:text-[12.5px] leading-relaxed text-slate-300 select-text">
          
          {/* TAB: POKÉDEX & EXPLORATION */}
          {activeTab === 'pokedex' && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 max-w-2xl mx-auto"
            >
              {/* Banner Incipit */}
              <div className="p-4 bg-emerald-950/25 border-l-4 border-emerald-500 rounded-r-xl space-y-2 text-left relative overflow-hidden group">
                <h3 className="font-hud font-black text-emerald-400 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2">
                  <Map className="w-4 h-4 text-emerald-400 animate-pulse" /> Pokédex Registry & Diagnostic Matrix
                </h3>
                <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                  Pokéthology provides a complete index spanning all 9 Generations of Pokémon (from Kanto #001 Bulbasaur to Paldea #1025 Pecharunt), including full support for Alternative Forms: Mega Evolutions, Gigantamax (G-Max) variants, Alolan, Galarian, Hisuian, and Paldean regional forms, as well as Legends Z-A custom additions (such as Mega Zygarde, Mega Garchomp-Z, and Stretchy Tatsugiri).
                </p>
                <p className="text-slate-400 font-sans leading-relaxed text-[10.5px] sm:text-[11px] relative z-10 pt-1 border-t border-emerald-500/20">
                  Filter by 18 Elemental Types with dual-type combinations, jump across Generation selectors (Gen I–IX), and sort instantly by National Dex ID, Base Stat Total (BST), Kinetic Speed, Attack, Defense, or Alphabetical name.
                </p>
              </div>
              
              {/* Feature Cards */}
              <div className="grid grid-cols-1 gap-3 text-left">
                {/* Stats & Radar Charts */}
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-emerald-950 rounded-full border border-emerald-500/50 shrink-0 group-hover:rotate-12 transition-transform">
                    <Radar className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <span className="font-hud font-black text-emerald-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Base Stats & Radar Diagnostics
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Inspect complete Base Stat Totals (BST) with an interactive hexagonal radar diagram mapping HP, Attack, Defense, Special Attack, Special Defense, and Kinetic Speed. Compare individual stat bars against benchmark maximums (up to 255).
                    </p>
                  </div>
                </div>

                {/* Type Weaknesses & Resistances */}
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-emerald-950 rounded-full border border-emerald-500/50 shrink-0 group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <span className="font-hud font-black text-emerald-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Type Matchup Matrix (18 Types)
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      View real-time defensive matchup multipliers for the selected Pokémon: 4x critical weaknesses, 2x super effective vulnerabilities, 0.5x & 0.25x resistances, and 0x total type immunities calculated accurately from dual typing.
                    </p>
                  </div>
                </div>

                {/* Evolution Trees & Moveset Engine */}
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-emerald-950 rounded-full border border-emerald-500/50 shrink-0 group-hover:rotate-12 transition-transform">
                    <GitBranch className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <span className="font-hud font-black text-emerald-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Evolution Nodes & Moveset Pool
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Explore multi-branch evolution chains with explicit trigger conditions (level thresholds, evolution stones, friendship, trade requirements). Browse categorized movesets (Level-up, TM/HM, Egg Moves, Move Tutor) with Power, Accuracy, PP, and damage classes (Physical, Special, Status).
                    </p>
                  </div>
                </div>

                {/* Artwork & Sprite Presentation Modes */}
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-cyan-950 rounded-full border border-cyan-500/50 shrink-0 group-hover:scale-110 transition-transform">
                    <Image className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <span className="font-hud font-black text-cyan-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Artwork, Sprites & Shiny Toggle
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Toggle seamlessly between High-Definition Official Pokémon Artwork, classic 2D Gen 5 Showdown pixel sprites, and animated battle models. Click the Sparkles/Shiny button to preview rare Shiny colorations for any species or alternative form.
                    </p>
                  </div>
                </div>

                {/* Stat Comparator Tool */}
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-cyan-950 rounded-full border border-cyan-500/50 shrink-0 group-hover:rotate-12 transition-transform">
                    <Swords className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <span className="font-hud font-black text-cyan-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Side-by-Side Stat Comparator
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Compare two Pokémon or alternative forms side-by-side in a full-screen HUD. Displays overlapping hexagonal radar charts, stat differential bars (+/- BST), type advantages, and physical dimensions comparison.
                    </p>
                  </div>
                </div>

                {/* Favorites Vault Integration */}
                <div className="p-4 rounded-xl border border-yellow-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-yellow-950 rounded-full border border-yellow-500/50 shrink-0 group-hover:scale-110 transition-transform">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/30" />
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <span className="font-hud font-black text-yellow-300 text-xs sm:text-sm uppercase tracking-wider block">
                      Favorites Star & Persistent Vault
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Click the star icon on any Pokédex card or detail sheet to bookmark species or specific alternate forms into your persistent IndexedDB storage. Favorited forms preserve their distinct form artwork and can be launched directly into Combat.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: POKÉTHOLOGY CHATBOT */}
          {activeTab === 'pokethology' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 max-w-2xl mx-auto"
            >
              {/* Banner Incipit */}
              <div className="p-4 bg-purple-950/25 border-l-4 border-purple-500 rounded-r-xl space-y-2 text-left relative overflow-hidden">
                <h3 className="font-hud font-black text-purple-400 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400 animate-pulse" /> Pokéthology AI Assistant & Tactical Cognition
                </h3>
                <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                  The Pokéthology AI Assistant is a specialized neural assistant powered by Gemini AI, engineered to provide expert analysis across competitive metagame strategies, Smogon tiers, species biology, canonical lore, and matchup calculations.
                </p>
                <p className="text-slate-400 font-sans leading-relaxed text-[10.5px] sm:text-[11px] relative z-10 pt-1 border-t border-purple-500/20">
                  The assistant is context-aware: it automatically synchronizes with the Pokémon currently inspected in your Pokédex, offering custom prompt shortcuts for quick tactical assessments, moveset optimization, and team synergies.
                </p>
              </div>

              {/* HUD Feature Cards */}
              <div className="grid grid-cols-1 gap-3 text-left">
                {/* Tactics & Metagame Strategy */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-purple-950 rounded-full border border-purple-500/50 group-hover:rotate-12 transition-transform shrink-0">
                    <Crosshair className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-purple-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Competitive Metagame & Smogon Builds
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Get complete competitive setups including 4-move synergies, optimal Held Items (Choice Specs, Choice Band, Focus Sash, Heavy-Duty Boots, Life Orb, Leftovers), EV/IV spreads, optimal Natures, and hazard/pivot strategies.
                    </p>
                  </div>
                </div>

                {/* Lore, Ecology & Morphology */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-purple-950 rounded-full border border-purple-500/50 group-hover:-rotate-12 transition-transform shrink-0">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-purple-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Species Biology, Ecology & Lore
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Discover evolutionary adaptations, anatomical physiology, habitat behaviors, and canonical Pokédex descriptions from Red & Blue to Scarlet & Violet and Legends Z-A.
                    </p>
                  </div>
                </div>

                {/* Voice Input & TTS Playback */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-purple-950 rounded-full border border-purple-500/50 group-hover:scale-110 transition-transform shrink-0">
                    <Mic className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-purple-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Voice Transcription & Text-to-Speech (TTS)
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Ask questions hands-free using the built-in microphone speech-to-text input, or listen to the AI assistant read its tactical analysis aloud using integrated Text-to-Speech synthesis.
                    </p>
                  </div>
                </div>

                {/* Contextual Quick Prompts */}
                <div className="p-4 rounded-xl border border-purple-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-purple-950 rounded-full border border-purple-500/50 group-hover:rotate-12 transition-transform shrink-0">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-purple-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Context-Aware Quick Prompts
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Tap one-touch prompt chips to instantly generate best counter-picks, Gym Leader / Elite Four battle tactics, type coverage analysis, and complementary team recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: COMBAT */}
          {activeTab === 'combat' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-4 max-w-2xl mx-auto"
            >
              {/* Banner Incipit */}
              <div className="p-4 bg-red-950/25 border-l-4 border-red-500 rounded-r-xl space-y-2 text-left relative overflow-hidden">
                <h3 className="font-hud font-black text-red-400 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2">
                  <Swords className="w-4 h-4 text-red-500 animate-pulse" /> Combat Arena & Battle Simulator
                </h3>
                <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                  Pokéthology features a turn-based real-time Combat Arena that pits your selected Pokémon (including Mega Evolutions and Gigantamax forms) against customizable or randomly generated opponents.
                </p>
                <p className="text-slate-400 font-sans leading-relaxed text-[10.5px] sm:text-[11px] relative z-10 pt-1 border-t border-red-500/20">
                  The battle engine utilizes authentic competitive damage formulas: factoring in Level 50 scaled stats, Same Type Attack Bonus (STAB 1.5x), 18-Type effectiveness multipliers (0x, 0.25x, 0.5x, 1x, 2x, 4x), Critical Hit chances, and randomized damage rolls (0.85–1.0x).
                </p>
              </div>

              {/* HUD Feature Cards */}
              <div className="grid grid-cols-1 gap-3 text-left">
                {/* Select Target Opponent */}
                <div className="p-4 rounded-xl border border-red-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-red-950 rounded-full border border-red-500/50 group-hover:rotate-12 transition-transform shrink-0">
                    <Crosshair className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-red-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Target Selection & Custom Movesets
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Click the <span className="text-red-400 font-bold font-hud">SELECT TARGET</span> button to pick any specific rival Pokémon or alternate form from the 9-generation registry. Configure your 4 active combat moves or generate an automated competitive moveset.
                    </p>
                  </div>
                </div>

                {/* Chaos Mode */}
                <div className="p-4 rounded-xl border border-red-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-red-950 rounded-full border border-red-500/50 group-hover:scale-110 transition-transform shrink-0">
                    <Sparkles className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-red-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Chaos Mode Randomizer
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Engage Chaos Mode to randomly pick both combatants and randomized move pools across all generations, challenging your type knowledge and adaptation under unpredictable battle conditions.
                    </p>
                  </div>
                </div>

                {/* Dynamic Health Bars & Status Conditions */}
                <div className="p-4 rounded-xl border border-red-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-red-950 rounded-full border border-red-500/50 group-hover:rotate-12 transition-transform shrink-0">
                    <Activity className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-red-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Dynamic Health Gauges & Status Feed
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Monitor live HP meters with dynamic color transitions (Green &gt; Yellow &gt; Red), active status condition badges (Burn, Poison, Paralyze, Freeze, Sleep), and stat stage modifier boosts and drops.
                    </p>
                  </div>
                </div>

                {/* Battle Logs & Post-Match Summary */}
                <div className="p-4 rounded-xl border border-red-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-red-950 rounded-full border border-red-500/50 group-hover:scale-110 transition-transform shrink-0">
                    <BarChart3 className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-red-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Turn-by-Turn Combat Log & Victory Summary
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Review a real-time combat feed detailing each action, move accuracy checks, damage numbers, and effectiveness notes. The post-battle modal calculates the Victor, MVP performer, Total Turns, and Total Damage dealt.
                    </p>
                  </div>
                </div>

                {/* Sound Cries & Audio Pack */}
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-slate-900/60 flex items-start gap-4 group">
                  <div className="p-3 bg-cyan-950 rounded-full border border-cyan-500/50 group-hover:rotate-12 transition-transform shrink-0">
                    <Volume2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-cyan-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Official Audio Cries & Combat SFX
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Tap combatants in the arena to play their official sound cries. High-impact sound effects play during attack execution, super-effective strikes, critical hits, and victory conclusions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: DAILY ACTIVITIES & UTILITIES */}
          {activeTab === 'daily' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 max-w-2xl mx-auto"
            >
              {/* Banner Incipit */}
              <div className="p-4 bg-amber-950/25 border-l-4 border-amber-500 rounded-r-xl space-y-2 text-left relative overflow-hidden">
                <h3 className="font-hud font-black text-amber-400 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400 animate-bounce" /> Daily Hub, Quests & Utilities
                </h3>
                <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                  The Daily Hub is Pokéthology's operational command center for daily training routines, knowledge evaluation, progress milestones, and persistent local storage management.
                </p>
                <p className="text-slate-400 font-sans leading-relaxed text-[10.5px] sm:text-[11px] relative z-10 pt-1 border-t border-amber-500/20">
                  Complete daily featured Pokémon scans, test your competitive acumen in the Theory Exam, finish combat missions to advance Operator Rank tiers, and manage your Favorites Vault directly in your browser.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3.5 text-left">
                {/* DAILY FEATURED SCAN */}
                <div className="p-4 rounded-xl border border-amber-500/40 bg-slate-900/70 flex items-start gap-4 group">
                  <div className="p-3 bg-amber-950 rounded-full border border-amber-500/60 group-hover:scale-110 transition-transform shrink-0">
                    <Compass className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-amber-300 text-xs sm:text-sm uppercase tracking-wider block">
                      Daily Featured Pokémon Scan
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Generates a unique date-stamped Featured Pokémon every 24 hours with full diagnostic stats, historical scan streak tracking, and a one-click shortcut to inspect the specimen in the Pokédex.
                    </p>
                  </div>
                </div>

                {/* THEORY EXAM */}
                <div className="p-4 rounded-xl border border-amber-500/40 bg-slate-900/70 flex items-start gap-4 group">
                  <div className="p-3 bg-amber-950 rounded-full border border-amber-500/60 group-hover:rotate-12 transition-transform shrink-0">
                    <Brain className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-amber-300 text-xs sm:text-sm uppercase tracking-wider block">
                      Pokéthology Theory Exam & Trivia
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Daily multiple-choice knowledge evaluation challenging you on type matchups, passive ability mechanics, base stat distributions, and battle trivia to earn Operator XP and accreditation certification.
                    </p>
                  </div>
                </div>

                {/* COMBAT MISSIONS & OPERATOR RANKS */}
                <div className="p-4 rounded-xl border border-amber-500/40 bg-slate-900/70 flex items-start gap-4 group">
                  <div className="p-3 bg-amber-950 rounded-full border border-amber-500/60 group-hover:scale-110 transition-transform shrink-0">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-amber-300 text-xs sm:text-sm uppercase tracking-wider block">
                      Daily Combat Missions & Trainer Rank Progression
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Complete daily combat challenges (such as winning with specific elemental types, executing Super Effective strikes, or winning within 5 turns) to unlock achievement badges and level up your Trainer Rank from Rookie to Champion / Master.
                    </p>
                  </div>
                </div>

                {/* FAVORITES VAULT */}
                <div className="p-4 rounded-xl border border-yellow-500/40 bg-slate-900/70 flex items-start gap-4 group">
                  <div className="p-3 bg-yellow-950 rounded-full border border-yellow-500/60 group-hover:rotate-12 transition-transform shrink-0">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/40" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-yellow-300 text-xs sm:text-sm uppercase tracking-wider block">
                      Favorites Vault (IndexedDB Storage)
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Locally and privately stored in your browser using IndexedDB. Save any base Pokémon or specific alternate form (Mega, Gigantamax, Regional), filter by type within the vault, and launch any favorited Pokémon directly into combat.
                    </p>
                  </div>
                </div>

                {/* SEARCH BAR */}
                <div className="p-4 rounded-xl border border-cyan-500/40 bg-slate-900/70 flex items-start gap-4 group">
                  <div className="p-3 bg-cyan-950 rounded-full border border-cyan-500/60 group-hover:scale-110 transition-transform shrink-0">
                    <Search className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-cyan-300 text-xs sm:text-sm uppercase tracking-wider block">
                      Real-Time Search & Alias Filtering
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Rapid debounced search query engine supporting species names (e.g. "Charizard"), National Pokédex numbers (e.g. <span className="font-mono text-cyan-400">#006</span>), or alternate form aliases (e.g. "Mega Mewtwo", "Alolan Raichu").
                    </p>
                  </div>
                </div>

                {/* SETTINGS SECTION */}
                <div className="p-4 rounded-xl border border-purple-500/40 bg-slate-900/70 flex items-start gap-4 group">
                  <div className="p-3 bg-purple-950 rounded-full border border-purple-500/60 group-hover:rotate-45 transition-transform shrink-0">
                    <SettingsIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-hud font-black text-purple-300 text-xs sm:text-sm uppercase tracking-wider block">
                      System Settings & HUD Customization
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Toggle between Cyberpunk Dark Mode and Clean Light Mode themes, customize Web Audio Synthesizer BGM / SFX / Pokémon Cry volume sliders, switch interface languages (EN / IT / ES / FR / DE), and manage local application caches.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: SOCIAL & COMMUNITY */}
          {activeTab === 'social' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="space-y-4 max-w-2xl mx-auto text-left"
            >
              {/* Banner Incipit */}
              <div className="p-4 bg-pink-950/25 border-l-4 border-pink-500 rounded-r-xl space-y-2 text-left relative overflow-hidden">
                <h3 className="font-hud font-black text-pink-400 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-pink-400 animate-pulse" /> Community Channels & Source Repositories
                </h3>
                <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                  Pokéthology is an active open-source project and competitive Pokémon platform. Connect with the developer channels to explore source code, review version release notes, contribute suggestions, or follow competitive content showcases.
                </p>
                <p className="text-slate-400 font-sans leading-relaxed text-[10.5px] sm:text-[11px] relative z-10 pt-1 border-t border-pink-500/20">
                  Direct access to our verified GitHub repository and official Instagram channel:
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-1">
                {/* GitHub Button Card */}
                <a
                  href="https://github.com/massimoanzalone2204-hash/Pokethology"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-cyan-500/30 bg-slate-900/60 flex items-center justify-between gap-4 group hover:border-cyan-400 transition-all shadow-md cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-3 bg-cyan-950 rounded-full border border-cyan-500/50 group-hover:scale-110 transition-transform shrink-0">
                      <Github className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="font-hud font-black text-cyan-400 text-xs sm:text-sm uppercase tracking-wider">GitHub Source Repository</span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 truncate">massimoanzalone2204-hash/Pokethology</span>
                      <span className="text-[9.5px] text-slate-400 font-sans mt-0.5">Explore source code, submit issues, and track release changelogs.</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors shrink-0" />
                </a>

                {/* Instagram Button Card */}
                <a
                  href="https://www.instagram.com/__.pokethology.__?igsh=YjZrejluMDd5dHoz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl border border-pink-500/30 bg-slate-900/60 flex items-center justify-between gap-4 group hover:border-pink-400 transition-all shadow-md cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-3 bg-pink-950 rounded-full border border-pink-500/50 group-hover:scale-110 transition-transform shrink-0">
                      <Instagram className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <span className="font-hud font-black text-pink-400 text-xs sm:text-sm uppercase tracking-wider">Official Instagram Channel</span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-pink-300/80 truncate">@__.pokethology.__</span>
                      <span className="text-[9.5px] text-slate-400 font-sans mt-0.5">Follow feature announcements, UI previews, and competitive breakdowns.</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-pink-400 group-hover:text-pink-300 transition-colors shrink-0" />
                </a>
              </div>
            </motion.div>
          )}

          {/* TAB: NEWS */}
          {activeTab === 'news' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-2xl mx-auto text-left">
              {/* Banner Incipit */}
              <div className="p-4 bg-cyan-950/25 border-l-4 border-cyan-500 rounded-r-xl space-y-2 text-left relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-cyan-500/25 pb-2">
                  <h3 className="font-hud font-black text-cyan-400 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400 animate-spin-slow" /> Pokémon Global News & Competitive Feed
                  </h3>
                  {isFallback && (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full animate-pulse mr-1 bg-amber-500" />
                      <span className="text-[7px] font-mono text-slate-400 uppercase tracking-widest">
                        ARCHIVE BACKUP
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs">
                  Stay synchronized with official franchise developments via our live news aggregation pipeline (/api/news), delivering verified updates on video game balance patches (Scarlet & Violet / Legends), VGC Championship tournament standings, Pokémon TCG & Pocket expansions, and mobile events.
                </p>
                <p className="text-slate-400 font-sans leading-relaxed text-[10.5px] sm:text-[11px] pt-1 border-t border-cyan-500/20">
                  Each news entry provides direct external source links for verified reading, backed by automated archive resilience when offline.
                </p>
              </div>

              <div className="space-y-3.5">
                {loadingNews ? (
                  <div className="flex flex-col items-center justify-center p-10 bg-slate-900/30 border border-slate-800/80 rounded-xl space-y-3">
                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <div className="text-center space-y-1">
                      <span className="text-[9px] font-mono text-cyan-400/80 uppercase tracking-wider block font-bold">
                        Loading news feed...
                      </span>
                    </div>
                  </div>
                ) : newsError ? (
                  <div className="p-4 bg-red-950/20 border border-red-500/25 rounded-xl text-center space-y-1">
                    <span className="text-red-400 text-[10px] font-black uppercase tracking-wider font-hud">News Feed Error</span>
                    <p className="text-[9.5px] font-mono text-slate-400 leading-relaxed">{newsError}</p>
                  </div>
                ) : pokemonNews.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {pokemonNews.map((item, idx) => {
                      let TagIcon = Newspaper;
                      let tagColor = "border-slate-800 text-slate-400";
                      const tagLower = (item.tag || "").toLowerCase();
                      if (tagLower.includes("update") || tagLower.includes("patch") || tagLower.includes("game")) {
                        TagIcon = Cpu;
                        tagColor = "border-cyan-500/35 text-cyan-400";
                      } else if (tagLower.includes("tournament") || tagLower.includes("championship") || tagLower.includes("vgc")) {
                        TagIcon = Swords;
                        tagColor = "border-red-500/35 text-red-400";
                      } else if (tagLower.includes("card") || tagLower.includes("tcg") || tagLower.includes("pocket")) {
                        TagIcon = Sparkles;
                        tagColor = "border-amber-500/35 text-amber-400";
                      } else if (tagLower.includes("go") || tagLower.includes("mobile") || tagLower.includes("niantic")) {
                        TagIcon = Globe;
                        tagColor = "border-indigo-500/35 text-indigo-400";
                      } else if (tagLower.includes("anime") || tagLower.includes("series") || tagLower.includes("movie")) {
                        TagIcon = BookOpen;
                        tagColor = "border-purple-500/35 text-purple-400";
                      }

                      return (
                        <motion.div 
                          key={`news-${idx}`} 
                          whileHover={{ scale: 1.01 }}
                          className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className={cn("text-[7.5px] font-mono font-black border px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1", tagColor)}>
                              <TagIcon className="w-2.5 h-2.5 shrink-0" />
                              {item.tag || 'GLOBAL'}
                            </span>
                            <div className="flex items-center gap-1 text-[7.5px] font-mono text-slate-400 font-bold">
                              <span className="uppercase">{isFallback ? "ARCHIVE" : "TODAY"}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <h5 className="text-[11px] sm:text-xs font-hud font-black text-cyan-400 uppercase tracking-wide leading-snug">
                              {item.title}
                            </h5>
                            <p className="text-[10px] sm:text-[10.5px] text-slate-300 leading-relaxed font-sans mt-1">
                              {item.description}
                            </p>
                          </div>

                          {item.url && item.url.startsWith("http") && (
                            <div className="flex justify-end pt-1">
                              <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                referrerPolicy="no-referrer"
                                className="flex items-center gap-1 px-2 py-1 bg-transparent hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/20 rounded text-[8px] font-mono text-cyan-400 uppercase tracking-widest transition-all cursor-pointer group"
                              >
                                <span>SOURCE</span>
                                <ExternalLink className="w-2.5 h-2.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                              </a>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-900/20 border border-slate-800 rounded-xl text-center">
                    <span className="text-[9.5px] font-mono text-slate-500 uppercase">News feed offline. Try switching tabs.</span>
                  </div>
                )}

                {/* Official Pokémon TCG Portal Section Card */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 flex flex-col gap-2 text-left"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[7.5px] font-mono font-black border border-amber-500/35 text-amber-400 px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 shrink-0" />
                      CARD / TCG
                    </span>
                    <div className="flex items-center gap-1 text-[7.5px] font-mono text-slate-400 font-bold">
                      <span className="uppercase">PORTAL</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h5 className="text-[11px] sm:text-xs font-hud font-black text-cyan-400 uppercase tracking-wide leading-snug">
                      POKÉMON TCG PORTAL
                    </h5>
                    <p className="text-[10px] sm:text-[10.5px] text-slate-300 leading-relaxed font-sans mt-1">
                      Direct access to the official Pokémon Trading Card Game portal for deck construction guidelines, card expansion database searches, rules, and championship circuit schedules.
                    </p>
                  </div>

                  <div className="flex justify-end pt-1">
                    <a 
                      href="https://tcg.pokemon.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      referrerPolicy="no-referrer"
                      className="flex items-center gap-1 px-2 py-1 bg-transparent hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/20 rounded text-[8px] font-mono text-cyan-400 uppercase tracking-widest transition-all cursor-pointer group"
                    >
                      <span>VISIT SITE</span>
                      <ExternalLink className="w-2.5 h-2.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="px-5 py-3.5 border-t border-cyan-500/15 shrink-0 flex justify-between items-center bg-slate-950 w-full">
          <span className="text-[8.5px] sm:text-[9.5px] font-mono text-slate-500 font-bold uppercase tracking-wider">
            POKÉTHOLOGY TUTORIAL & SPECIFICATIONS
          </span>
          <button
            onClick={onClose}
            className="py-1.5 px-5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-xl font-hud text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-cyan-500/40 transition-all active:scale-95 cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
