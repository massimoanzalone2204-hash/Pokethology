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
  Award
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
                Pokéthology tutorial
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
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-350"
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
                {/* Banner */}
                <div className="p-4 bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl space-y-1.5 text-left relative overflow-hidden group">
                  <h3 className="font-hud font-black text-emerald-400 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2">
                    <Map className="w-4 h-4 animate-pulse" /> Pokédex Registry
                  </h3>
                  <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                    Embark on a comprehensive journey through all 9 official Generations of the Pokémon universe, mapping species spanning from Kanto (Gen I) through Paldea (Gen IX). Leverage our advanced query matching and granular regional filters to explore base stats distributions, dynamic type matchup vulnerabilities, and official audio cries, with the ability to switch dynamically between high-definition official media assets and classic retro sprites.
                  </p>
                </div>
                
                {/* Direct Card Star Feature */}
                <div className="p-4 rounded-xl border border-yellow-500/30 bg-slate-900/60 flex items-start gap-4 group text-left">
                  <div className="p-3 bg-yellow-950 rounded-full border border-yellow-500/50 shrink-0 group-hover:scale-110 transition-transform">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/30 animate-pulse" />
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <span className="font-hud font-black text-yellow-300 text-xs sm:text-sm uppercase tracking-wider block">
                      Favorites Star
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Tap the star icon on any card or detail page to instantly add or remove Pokémon from your Favorites vault.
                    </p>
                  </div>
                </div>

                {/* Complete Stats Diagnostics */}
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-slate-900/60 flex items-start gap-4 group text-left">
                  <div className="p-3 bg-emerald-950 rounded-full border border-emerald-500/50 shrink-0 group-hover:rotate-12 transition-transform">
                    <Radar className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <span className="font-hud font-black text-emerald-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Stats & Radar Charts
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      View Base Stat Totals (BST), individual stat distributions (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed), type matchups, and sound cries.
                    </p>
                  </div>
                </div>

                {/* Stat Comparator */}
                <div className="p-4 rounded-xl border border-cyan-500/30 bg-slate-900/60 flex items-start gap-4 group text-left">
                  <div className="p-3 bg-cyan-950 rounded-full border border-cyan-500/50 shrink-0 group-hover:rotate-12 transition-transform">
                    <Swords className="w-5 h-5 text-cyan-400 animate-pulse" />
                  </div>
                  <div className="space-y-1 w-full min-w-0">
                    <span className="font-hud font-black text-cyan-400 text-xs sm:text-sm uppercase tracking-wider block">
                      Stat Comparison
                    </span>
                    <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans pt-0.5">
                      Compare two Pokémon side-by-side in a full-screen view. Compare forms, stats, and advantages directly.
                    </p>
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
                {/* Banner */}
                <div className="p-4 bg-purple-950/20 border-l-4 border-purple-500 rounded-r-xl space-y-1.5 text-left relative overflow-hidden">
                  <h3 className="font-hud font-black text-purple-400 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2">
                    <Brain className="w-4 h-4 animate-pulse" /> Pokéthology AI Assistant
                  </h3>
                  <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                    Connect with our context-aware Pokéthology AI Assistant, powered by advanced language models designed specifically for competitive Pokémon analysis, deep biology studies, and franchise lore. Ask anything from optimal EV/IV spreads, nature synergy, and custom competitive movesets for official VGC tournaments, to complex evolutionary pathways, regional folklore, and the ecological habitats of rare species.
                  </p>
                </div>

                {/* HUD Feature Cards */}
                <div className="grid grid-cols-1 gap-3 text-left">
                  <div className="p-4 rounded-xl border border-purple-500/30 bg-slate-900/60 flex items-center gap-4 group">
                    <div className="p-3 bg-purple-950 rounded-full border border-purple-500/50 group-hover:rotate-12 transition-transform shrink-0">
                      <Crosshair className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <span className="font-hud font-black text-purple-400 text-xs sm:text-sm uppercase tracking-wider">Tactics & Strategy</span>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans mt-0.5">
                        Get advice on competitive movesets, EV spreads, team synergies, and matchup counters.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-purple-500/30 bg-slate-900/60 flex items-center gap-4 group">
                    <div className="p-3 bg-purple-950 rounded-full border border-purple-500/50 group-hover:-rotate-12 transition-transform shrink-0">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <span className="font-hud font-black text-purple-400 text-xs sm:text-sm uppercase tracking-wider">Lore & Biology</span>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans mt-0.5">
                        Discover species evolution paths, regional mythologies, and ecological lore.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-purple-500/30 bg-slate-900/60 flex items-center gap-4 group">
                    <div className="p-3 bg-purple-950 rounded-full border border-purple-500/50 group-hover:scale-110 transition-transform shrink-0">
                      <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <span className="font-hud font-black text-purple-400 text-xs sm:text-sm uppercase tracking-wider">General Knowledge</span>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans mt-0.5">
                        Chat about game mechanics, trivia, and franchise details with context-aware responses.
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
                {/* Banner */}
                <div className="p-4 bg-red-950/20 border-l-4 border-red-500 rounded-r-xl space-y-1.5 text-left relative overflow-hidden">
                  <h3 className="font-hud font-black text-red-400 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2">
                    <Swords className="w-4 h-4 text-red-500 animate-pulse" /> Combat Simulator
                  </h3>
                  <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                    Step into the virtual arena and run real-time battle simulations between any two Pokémon across any generation. Our custom combat engine calculates move damage classes, type-effectiveness multipliers (from complete immunities up to 4x super-effective damage), STAB bonuses, and base stat distributions, displaying active health point bars and rich turn-by-turn combat logs. Test competitive matchups or activate Chaos Mode to completely randomize participants and movesets.
                  </p>
                </div>

                {/* HUD Feature Cards */}
                <div className="grid grid-cols-1 gap-3 text-left">
                  <div className="p-4 rounded-xl border border-red-500/30 bg-slate-900/60 flex items-center gap-4 group">
                    <div className="p-3 bg-red-950 rounded-full border border-red-500/50 group-hover:rotate-12 transition-transform shrink-0">
                      <Crosshair className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <span className="font-hud font-black text-red-400 text-xs sm:text-sm uppercase tracking-wider">Select Opponent</span>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans mt-0.5">
                        Click the <span className="text-red-400 font-bold font-hud">SELECT TARGET</span> button to pick any specific rival Pokémon.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-red-500/30 bg-slate-900/60 flex items-center gap-4 group">
                    <div className="p-3 bg-red-950 rounded-full border border-red-500/50 group-hover:animate-pulse transition-transform shrink-0">
                      <Sparkles className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <span className="font-hud font-black text-red-400 text-xs sm:text-sm uppercase tracking-wider">Chaos Mode</span>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans mt-0.5">
                        Completely randomizes the combatants and movesets, allowing you to battle under fully unpredictable conditions.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-cyan-500/30 bg-slate-900/60 flex items-center gap-4 group">
                    <div className="p-3 bg-cyan-950 rounded-full border border-cyan-500/50 group-hover:rotate-12 transition-transform shrink-0 flex items-center gap-1">
                      <Image className="w-4 h-4 text-cyan-400" />
                      <Gamepad2 className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <span className="font-hud font-black text-cyan-400 text-xs sm:text-sm uppercase tracking-wider">Art & Sprite Toggle</span>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans mt-0.5">
                        Switch between official artwork and classic pixel sprites via the header toggle.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-red-500/30 bg-slate-900/60 flex items-center gap-4 group">
                    <div className="p-3 bg-red-950 rounded-full border border-red-500/50 group-hover:rotate-12 transition-transform shrink-0">
                      <Volume2 className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <span className="font-hud font-black text-red-400 text-xs sm:text-sm uppercase tracking-wider">Sound Cries</span>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans mt-0.5">
                        Click on Pokémon in the arena to play their official sound cries.
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
                <div className="p-4 bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl space-y-1.5 text-left relative overflow-hidden">
                  <h3 className="font-hud font-black text-amber-400 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 animate-bounce" /> Daily Activities & Settings
                  </h3>
                  <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                    Challenge your wisdom and level up your Trainer Rank by checking in daily. Solve the competitive Theory Exam, scan the daily featured Pokémon, and complete tasks to earn experience points. Configure your user preferences directly, manage your personal persistent Favorites Vault—designed for rapid tracking of Mega, Gigantamax, and Regional forms—and toggle audio settings for game sounds and cries.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3.5 text-left">
                  {/* SEARCH BAR */}
                  <div className="p-4 rounded-xl border border-cyan-500/40 bg-slate-900/70 flex items-start gap-4 group">
                    <div className="p-3 bg-cyan-950 rounded-full border border-cyan-500/60 group-hover:scale-110 transition-transform shrink-0">
                      <Search className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-hud font-black text-cyan-300 text-xs sm:text-sm uppercase tracking-wider block">
                        Search Bar
                      </span>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans">
                        Search by Pokémon number (e.g. <span className="font-mono text-cyan-400">#006</span>), species name, or alternate forms with live filtering.
                      </p>
                    </div>
                  </div>

                  {/* FAVORITE FEATURE */}
                  <div className="p-4 rounded-xl border border-yellow-500/40 bg-slate-900/70 flex items-start gap-4 group">
                    <div className="p-3 bg-yellow-950 rounded-full border border-yellow-500/60 group-hover:rotate-12 transition-transform shrink-0">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/40" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-hud font-black text-yellow-300 text-xs sm:text-sm uppercase tracking-wider block">
                        Favorites Vault
                      </span>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans">
                        Save favorite Pokémon and alternate forms (Mega, Gigantamax, Regional) into your persistent vault.
                      </p>
                    </div>
                  </div>

                  {/* DAILY HUB SECTION */}
                  <div className="p-4 rounded-xl border border-amber-500/40 bg-slate-900/70 flex items-start gap-4 group">
                    <div className="p-3 bg-amber-950 rounded-full border border-amber-500/60 group-hover:scale-110 transition-transform shrink-0">
                      <Award className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-hud font-black text-amber-300 text-xs sm:text-sm uppercase tracking-wider block">
                        Daily Hub & Theory Exam
                      </span>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans">
                        Complete daily featured scans, solve Theory Exam questions, and finish daily challenges to unlock rank tiers.
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
                        Settings
                      </span>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-300 leading-relaxed font-sans">
                        Toggle theme mode, adjust audio sound effects and cries, or configure app settings.
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
                <div className="p-4 bg-pink-950/20 border-l-4 border-pink-500 rounded-r-xl space-y-1.5 text-left relative overflow-hidden">
                  <h3 className="font-hud font-black text-pink-400 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2">
                    <Share2 className="w-4 h-4 animate-pulse" /> Community & Social
                  </h3>
                  <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                    Join the global community of competitive Pokémon theorists and Pokéthology enthusiasts. Expand your trainer horizons by checking out our official Instagram hub for deep lore infographics, trivia, and competitive meta breakdowns, or explore our active GitHub repository to see the behind-the-scenes engine, submit code issues, contribute features, and star our project.
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
                        <span className="font-hud font-black text-cyan-400 text-xs sm:text-sm uppercase tracking-wider">GitHub Repository</span>
                        <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 truncate">massimoanzalone2204-hash/Pokethology</span>
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
                        <span className="font-hud font-black text-pink-400 text-xs sm:text-sm uppercase tracking-wider">Instagram</span>
                        <span className="text-[9px] sm:text-[10px] font-mono text-pink-300/80 truncate">@__.pokethology.__</span>
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
                <div className="p-4 bg-cyan-950/20 border-l-4 border-cyan-500 rounded-r-xl space-y-1.5 text-left relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-cyan-500/25 pb-2">
                    <h3 className="font-hud font-black text-cyan-400 uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400 animate-spin-slow" /> Pokémon News & Updates
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
                    Stay fully updated with real-time global news feeds spanning the entire franchise. Get live details on official video game updates (such as VGC championship balance patches and active Scarlet & Violet tera raid events), physical and digital Trading Card Game (TCG & Pokémon TCG Pocket) expansion releases, community tournaments, mobile updates from Pokémon GO, and official media launches.
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
                        Explore official Trading Card Game cards, deck strategy, and tournaments.
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
              POKÉTHOLOGY TUTORIAL
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
