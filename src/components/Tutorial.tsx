import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Sparkles, Swords, Cpu, Newspaper, Info, Globe, ExternalLink, Calendar, Link, MessageSquare, ArrowUp, Activity, Database, Radar, Brain, Shield, Crosshair, Map, Volume2, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { HUDCorners } from './HUDCorners';

export const Tutorial = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'pokedex' | 'pokethology' | 'combat' | 'daily' | 'news'>('pokedex');
  const [pokemonNews, setPokemonNews] = useState<any[]>([]);
  const [groundingSources, setGroundingSources] = useState<any[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
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
            setGroundingSources(data.groundingSources || []);
            setSearchQueries(data.searchQueries || []);
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
        className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-6"
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="bg-slate-950/95 border border-cyan-500/35 w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl relative shadow-[0_0_60px_rgba(6,182,212,0.22)]"
        >
          <HUDCorners />
          
          {/* Header */}
          <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-cyan-500/20 shrink-0 w-full bg-slate-900/10">
            <div className="w-8 shrink-0 sm:block hidden" />
            <div className="flex items-center justify-center gap-3 flex-grow text-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="p-1.5 bg-cyan-950/60 border border-cyan-500/35 rounded-lg text-cyan-300 relative"
              >
                <BookOpen className="w-5 h-5 text-cyan-400 shrink-0" />
              </motion.div>
              <div className="text-center">
                <h2 className="text-xs sm:text-base font-hud font-black text-cyan-400 uppercase tracking-widest leading-none">
                  Pokéthology Academy Guide
                </h2>
                <p className="text-[7.5px] sm:text-[8.5px] font-mono text-slate-500 uppercase tracking-wider mt-1.5">
                  Master the Registry, AI Coach, and Arena Mechanics
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 p-1.5 rounded-lg border border-slate-800 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Selection Row */}
          <div className="flex gap-1.5 overflow-x-auto custom-scrollbar no-scrollbar px-3 py-2.5 border-b border-slate-900 bg-slate-900/40 shrink-0 select-none justify-start sm:justify-center">
            {(['pokedex', 'pokethology', 'combat', 'daily', 'news'] as const).map(tab => {
              const icons = {
                pokedex: <Database className="w-3 h-3 text-emerald-400" />,
                pokethology: <Brain className="w-3 h-3 text-purple-400" />,
                combat: <Swords className="w-3 h-3 text-red-400" />,
                daily: <Calendar className="w-3 h-3 text-amber-400" />,
                news: <Newspaper className="w-3 h-3 text-cyan-400" />
              };
              const titles = {
                pokedex: 'POKÉDEX',
                pokethology: 'POKÉTHOLOGY',
                combat: 'COMBAT',
                daily: 'DAILY',
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
                className="space-y-6 max-w-2xl mx-auto"
              >
                <div className="p-4 bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl space-y-2 text-left relative overflow-hidden group">
                  <motion.div 
                    animate={{ x: [-100, 400], opacity: [0, 0.5, 0] }} 
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-y-0 w-32 bg-emerald-500/10 skew-x-12"
                  />
                  <h3 className="font-hud font-black text-emerald-400 uppercase text-sm flex items-center gap-2">
                    <Map className="w-4 h-4 animate-pulse" /> Multigenerational Pokédex Exploration
                  </h3>
                  <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                    The core registry acts as your definitive database. Seamlessly navigate across all Generations of Pokémon right from the home dashboard. Use advanced filtering to quickly find exact species matches across regions and types.
                  </p>
                </div>
                
                <h4 className="font-hud text-[9px] text-emerald-500 uppercase tracking-[0.2em] border-b border-emerald-500/20 pb-1.5 mt-6 text-left flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> THE STATS SCHEDULE
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col gap-1.5">
                    <span className="font-bold text-emerald-400 text-[11px] sm:text-xs flex items-center gap-1.5">
                      <Radar className="w-3.5 h-3.5 animate-spin-slow" /> Comprehensive Diagnostics
                    </span>
                    <p className="text-[10.5px] text-slate-400 leading-normal font-sans">
                      Upon selecting a Pokémon, dive deep into its core metrics. View base stats, type advantages, weaknesses, and height/weight attributes dynamically generated on the fly.
                    </p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col gap-1.5">
                    <span className="font-bold text-emerald-400 text-[11px] sm:text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Advanced Visuals
                    </span>
                    <p className="text-[10.5px] text-slate-400 leading-normal font-sans">
                      Experience immersive retro radar charts mapping exact stat distributions and dynamic 3D-style sprites bridging the gap between generations.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* TAB: POKÉTHOLOGY CHATBOT */}
            {activeTab === 'pokethology' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 max-w-2xl mx-auto"
              >
                <div className="p-4 bg-purple-950/20 border-r-4 border-purple-500 rounded-l-xl space-y-2 text-left relative overflow-hidden">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-10 -top-10 w-48 h-48 bg-purple-500 rounded-full blur-3xl pointer-events-none" 
                  />
                  <h3 className="font-hud font-black text-purple-400 uppercase text-sm flex items-center gap-2">
                    <Brain className="w-4 h-4 animate-pulse" /> The Pokéthology AI Mind
                  </h3>
                  <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                    Your personal, highly-advanced, server-side AI Coach. Powered by Gemini, the Pokéthology Chatbot isn't just an encyclopedia—it's a tactical advisor, lore master, and biological researcher all in one interface.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mt-6">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-purple-500/20 flex flex-col items-center text-center gap-2 hover:bg-purple-900/10 transition-colors">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Crosshair className="w-6 h-6 text-purple-400" />
                    </motion.div>
                    <span className="font-bold text-white text-[11px] sm:text-xs">Tactical Coaching</span>
                    <p className="text-[10px] text-slate-400 font-sans">Ask for real-time movesets, competitive strategies, and counter-picks against tough gym leaders.</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-purple-500/20 flex flex-col items-center text-center gap-2 hover:bg-purple-900/10 transition-colors">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                      <BookOpen className="w-6 h-6 text-purple-400" />
                    </motion.div>
                    <span className="font-bold text-white text-[11px] sm:text-xs">Deep Lore & Mythos</span>
                    <p className="text-[10px] text-slate-400 font-sans">Explore the philosophical origins, historical mythology, and biological traits of any discovered species.</p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-purple-500/20 flex flex-col items-center text-center gap-2 hover:bg-purple-900/10 transition-colors">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <Activity className="w-6 h-6 text-purple-400" />
                    </motion.div>
                    <span className="font-bold text-white text-[11px] sm:text-xs">Data Integration</span>
                    <p className="text-[10px] text-slate-400 font-sans">The AI interprets live stats and types, offering contextual analysis based on the exact current meta.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: COMBAT */}
            {activeTab === 'combat' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-6 max-w-2xl mx-auto"
              >
                <div className="p-4 bg-red-950/20 border-b-4 border-red-500 rounded-t-xl space-y-2 text-center relative overflow-hidden">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"
                  />
                  <h3 className="font-hud font-black text-red-400 uppercase text-lg flex items-center justify-center gap-2">
                    <Swords className="w-6 h-6 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" /> Combat Simulation Arena
                  </h3>
                  <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10 max-w-lg mx-auto">
                    Put theory into practice. The tactical simulation arena allows you to pit two Pokémon against each other, fully testing stats, movesets, and types in extreme algorithmic scenarios.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <motion.div whileHover={{ scale: 1.01 }} className="bg-slate-900/50 p-4 rounded-xl border border-red-500/20 flex gap-3 relative overflow-hidden group">
                    <Shield className="w-6 h-6 text-red-400 shrink-0 group-hover:text-red-300 transition-colors" />
                    <div>
                      <span className="font-bold text-red-400 text-[11px] sm:text-xs uppercase font-hud tracking-wider">Dual Matchup Preview</span>
                      <p className="text-[10px] sm:text-[10.5px] text-slate-400 leading-normal font-sans mt-1">
                        Select two combatants and analyze their matchup side-by-side before the fight. View raw stat advantages instantly.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01 }} className="bg-slate-900/50 p-4 rounded-xl border border-red-500/20 flex gap-3 relative overflow-hidden group">
                    <Activity className="w-6 h-6 text-red-400 shrink-0 group-hover:animate-pulse transition-colors" />
                    <div>
                      <span className="font-bold text-red-400 text-[11px] sm:text-xs uppercase font-hud tracking-wider">Algorithmic Chaos</span>
                      <p className="text-[10px] sm:text-[10.5px] text-slate-400 leading-normal font-sans mt-1">
                        Turn on auto-battling to instantly roll randomized moves based on STAB logic, tracking HP and stat degradation dynamically.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Interactive Artwork Arena Note */}
                <motion.div 
                  whileHover={{ scale: 1.01 }} 
                  className="bg-red-950/20 p-2 rounded-lg border border-red-500/30 flex items-start gap-2 relative overflow-hidden group shadow-[0_0_10px_rgba(239,68,68,0.1)] text-left"
                >
                  <div className="p-1.5 bg-red-900/30 rounded-md border border-red-500/25 text-red-400 shrink-0">
                    <Volume2 className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-red-400 text-[9px] sm:text-[10px] uppercase font-hud tracking-wider flex items-center gap-1">
                        <RotateCcw className="w-2.5 h-2.5 text-red-300" /> Interactive Arena Artwork
                      </span>
                      <span className="px-1 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[6px] font-mono uppercase tracking-widest font-extrabold">
                        PRO TIP
                      </span>
                    </div>
                    <p className="text-[9px] sm:text-[9.5px] text-slate-300 leading-tight font-sans">
                      Touch or click directly on any Pokémon's artwork inside the combat arena to rotate its battle stance facing position and play its official species cry in real-time!
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* TAB: DAILY ACTIVITIES */}
            {activeTab === 'daily' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6 max-w-2xl mx-auto"
              >
                <div className="p-4 bg-amber-950/20 border-l-4 border-amber-500 rounded-r-xl space-y-2 text-left relative overflow-hidden">
                  <h3 className="font-hud font-black text-amber-400 uppercase text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 animate-bounce" /> Daily Hub & Activities
                  </h3>
                  <p className="text-slate-300 font-sans leading-relaxed text-[11px] sm:text-xs relative z-10">
                    Return every 24 hours to claim rewards, expand your theological knowledge, and view the featured cosmic scans. The Daily Hub tracks your streaks and integrates deeply into your progression.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 text-left">
                  <div className="p-4 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent flex items-center gap-4 group">
                    <div className="p-3 bg-amber-950 rounded-full border border-amber-500/50 group-hover:rotate-12 transition-transform">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <span className="font-bold text-amber-400 text-[11px] sm:text-xs uppercase font-hud tracking-wider">Daily Cosmic Scan</span>
                      <p className="text-[10px] sm:text-[10.5px] text-slate-300 leading-relaxed font-sans mt-0.5">
                        A unique, randomly featured Pokémon every single day, complete with exclusive AI-generated theological and academic lore you won't find anywhere else.
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-transparent flex items-center gap-4 group">
                    <div className="p-3 bg-orange-950 rounded-full border border-orange-500/50 group-hover:-rotate-12 transition-transform">
                      <Cpu className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <span className="font-bold text-orange-400 text-[11px] sm:text-xs uppercase font-hud tracking-wider">Theological Exam (Quiz)</span>
                      <p className="text-[10px] sm:text-[10.5px] text-slate-300 leading-relaxed font-sans mt-0.5">
                        Test your intellect. The AI dynamically generates 3 rigorous questions based on biology, stats, and lore. Pass the exam to boost your daily streak.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: NEWS */}
            {activeTab === 'news' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-xl mx-auto text-left">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-cyan-500/25 pb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                      <h4 className="text-[10px] sm:text-[11px] font-hud font-black text-cyan-400 uppercase tracking-widest">
                        REAL-WORLD POKÉMON GROUNDED BRIEFINGS
                      </h4>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "inline-block w-2 h-2 rounded-full animate-pulse mr-1",
                        isFallback ? "bg-amber-500" : "bg-emerald-500"
                      )} />
                      <span className="text-[7px] font-mono text-slate-400 uppercase tracking-widest">
                        {isFallback ? 'LOCAL ARCHIVE BACKUP' : 'LIVE ACCELERATED INTERFACE'}
                      </span>
                    </div>
                  </div>

                  {loadingNews ? (
                    <div className="flex flex-col items-center justify-center p-10 bg-slate-900/30 border border-slate-800/80 rounded-xl space-y-3">
                      <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <div className="text-center space-y-1">
                        <span className="text-[9px] font-mono text-cyan-400/80 uppercase tracking-wider block font-bold">
                          Establishing connection with intelligence grids...
                        </span>
                      </div>
                    </div>
                  ) : newsError ? (
                    <div className="p-4 bg-red-950/20 border border-red-500/25 rounded-xl text-center space-y-1">
                      <span className="text-red-400 text-[10px] font-black uppercase tracking-wider">Interface Anomaly Detected</span>
                      <p className="text-[9.5px] font-mono text-slate-400 leading-relaxed">{newsError}</p>
                    </div>
                  ) : pokemonNews.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3.5">
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
                            className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 hover:border-cyan-500/20 transition-all duration-300 flex flex-col gap-2.5"
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className={cn("text-[7.5px] font-mono font-black border px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1", tagColor)}>
                                <TagIcon className="w-2.5 h-2.5 shrink-0" />
                                {item.tag || 'GLOBAL'}
                              </span>
                              <div className="flex items-center gap-1 text-[7.5px] font-mono text-slate-400 font-bold">
                                <span className="uppercase">{isFallback ? "ARCHIVED NEWS" : "TODAY"}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <h5 className="text-[11px] sm:text-xs font-hud font-black text-slate-100 uppercase tracking-wide leading-snug">
                                {item.title}
                              </h5>
                              <p className="text-[10px] sm:text-[10.5px] text-slate-400 leading-relaxed font-sans mt-1">
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
                                  <span>SOURCE DIRECT</span>
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
                      <span className="text-[9.5px] font-mono text-slate-500 uppercase">Grounded news channel temporarily offline. Try switching tabs.</span>
                    </div>
                  )}

                  {!isFallback && groundingSources && groundingSources.length > 0 && (
                    <div className="pt-2.5 border-t border-slate-800/60 space-y-1.5 text-left">
                       <span className="text-[8px] font-hud font-black text-cyan-500/70 uppercase tracking-widest block">
                         INTELLIGENCE CITATIONS (REAL-WORLD RETRIEVED SOURCES)
                       </span>
                       <div className="flex flex-wrap gap-1.5">
                         {groundingSources.slice(0, 4).map((src, sidx) => (
                           <a
                             key={`sources-${sidx}`}
                             href={src.url}
                             target="_blank"
                             rel="noopener noreferrer"
                             referrerPolicy="no-referrer"
                             className="inline-flex items-center gap-1 px-2 py-0.5 border border-slate-800 text-[8.5px] font-mono text-slate-400 hover:text-cyan-400 transition-all cursor-pointer hover:border-cyan-500/30 group"
                             title={src.title}
                           >
                             <Link className="w-2.5 h-2.5 text-cyan-500 shrink-0 group-hover:rotate-12 transition-transform" />
                             <span className="truncate max-w-[120px]">{src.title}</span>
                           </a>
                         ))}
                       </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

          </div>

          {/* Footer Controls */}
          <div className="px-5 py-3.5 border-t border-cyan-500/15 shrink-0 flex justify-between items-center bg-slate-950 rounded-b-2xl w-full">
            <span className="text-[8.5px] sm:text-[9.5px] font-mono text-slate-500 font-bold uppercase tracking-wider">
              POKÉTHOLOGY ACADEMY v3.0.0
            </span>
            <button
              onClick={onClose}
              className="py-1.5 px-5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-xl font-hud text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-cyan-500/40 transition-all active:scale-95 cursor-pointer"
            >
              CLOSE HANDBOOK
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

