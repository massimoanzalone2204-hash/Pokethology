import React, { useState, useEffect, useRef } from 'react';
import { Pokemon } from '../types';
import { cn } from '../lib/utils';
import { Database, Volume2, VolumeX, Copy, Check, Radio, Ruler, Scale, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TypeBadge } from './TypeBadge';

interface PokedexEntrySectionProps {
  pokemon: Pokemon;
  selectedGameDescIndex: number;
  setSelectedGameDescIndex: (index: number) => void;
  isLightMode: boolean;
  sounds?: any;
  TypewriterText: React.ComponentType<{ text: string; delay?: number; onComplete?: () => void }>;
}

const getVersionStyle = (version: string, isActive: boolean, isLightMode: boolean) => {
  const v = version.toLowerCase().replace(/\s+/g, '-');

  let baseGradient = "from-cyan-500 to-blue-600";
  let borderGlow = "border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]";

  if (v.includes('red') || v.includes('ruby') || v.includes('scarlet')) {
    baseGradient = "from-red-600 via-rose-500 to-amber-600";
    borderGlow = "border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]";
  } else if (v.includes('blue') || v.includes('sapphire') || v.includes('violet')) {
    baseGradient = "from-indigo-600 via-purple-600 to-violet-600";
    borderGlow = "border-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.5)]";
  } else if (v.includes('yellow') || v.includes('gold') || v.includes('sun')) {
    baseGradient = "from-amber-500 via-yellow-500 to-orange-600";
    borderGlow = "border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]";
  } else if (v.includes('emerald') || v.includes('green') || v.includes('leaf')) {
    baseGradient = "from-emerald-600 via-teal-500 to-green-600";
    borderGlow = "border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]";
  } else if (v.includes('silver') || v.includes('moon') || v.includes('pearl') || v.includes('white')) {
    baseGradient = "from-slate-400 via-sky-300 to-indigo-400";
    borderGlow = "border-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.5)]";
  } else if (v.includes('crystal') || v.includes('diamond') || v.includes('x') || v.includes('y')) {
    baseGradient = "from-cyan-500 via-teal-400 to-sky-600";
    borderGlow = "border-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.5)]";
  }

  if (isActive) {
    return cn("bg-gradient-to-r text-white font-black scale-[1.02]", baseGradient, borderGlow);
  }

  return isLightMode
    ? "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/80 hover:text-slate-900"
    : "bg-slate-900/70 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-100";
};

export const PokedexEntrySection: React.FC<PokedexEntrySectionProps> = ({
  pokemon,
  selectedGameDescIndex,
  setSelectedGameDescIndex,
  isLightMode,
  sounds,
  TypewriterText
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlayingCry, setIsPlayingCry] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentEntry = pokemon.gameDescriptions && pokemon.gameDescriptions[selectedGameDescIndex]
    ? pokemon.gameDescriptions[selectedGameDescIndex]
    : { version: 'standard', flavor_text: pokemon.description || "No entry available." };

  const formattedVersionName = currentEntry.version === 'legends-z-a'
    ? 'Legends Z-A'
    : currentEntry.version.replace(/-/g, ' ').toUpperCase();

  const handleTTS = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanEntryText = (currentEntry.flavor_text || "")
      .replace(/[\f\n\r]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanEntryText) return;

    const utterance = new SpeechSynthesisUtterance(cleanEntryText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen')));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    try { sounds?.button?.(); } catch (_) {}
  };

  const handlePlayCry = () => {
    const cryUrl = pokemon.cries?.latest || pokemon.cries?.legacy;
    if (!cryUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(cryUrl);
    audioRef.current = audio;
    setIsPlayingCry(true);

    audio.play().then(() => {
      audio.onended = () => setIsPlayingCry(false);
    }).catch(() => {
      setIsPlayingCry(false);
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${pokemon.name.toUpperCase()} (#${(pokemon.baseId || pokemon.id).toString().padStart(4, '0')}) - ${formattedVersionName}:\n${currentEntry.flavor_text}`);
    setCopied(true);
    try { sounds?.scan?.(); } catch (_) {}
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [selectedGameDescIndex, pokemon.id]);

  const weightKg = pokemon.weight / 10;
  const weightLbs = weightKg * 2.20462;
  const heightM = pokemon.height / 10;
  const heightInchesTotal = heightM * 39.3701;
  const heightFeet = Math.floor(heightInchesTotal / 12);
  const heightInches = Math.round(heightInchesTotal % 12);

  const cryUrl = pokemon.cries?.latest || pokemon.cries?.legacy;

  return (
    <div className="w-full">
      <div className={cn(
        "backdrop-blur-xl rounded-2xl p-5 sm:p-6 border shadow-xl relative transition-all overflow-hidden",
        isLightMode
          ? "bg-white/95 border-slate-200"
          : "bg-slate-900/70 border-cyan-900/40"
      )}>
        {/* Simple Section Header */}
        <div className={cn(
          "font-hud text-[13px] uppercase tracking-wider mb-4 flex items-center justify-between pb-3 border-b gap-2",
          isLightMode ? "text-cyan-900 border-slate-200" : "text-cyan-400 border-cyan-900/40"
        )}>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">Pokédex Entry</span>
          </div>

          <div className="flex items-center gap-2">
            {cryUrl && (
              <button
                type="button"
                onClick={handlePlayCry}
                onMouseEnter={() => sounds?.hover?.()}
                title="Play Pokémon Cry"
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-hud uppercase tracking-wider border transition-all cursor-pointer font-bold",
                  isPlayingCry
                    ? "bg-amber-500 text-slate-950 border-amber-300"
                    : isLightMode
                      ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                      : "bg-slate-800/80 text-cyan-300 border-slate-700 hover:bg-slate-700"
                )}
              >
                <Radio className="w-3 h-3 text-amber-400" />
                <span>Cry</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleTTS}
              onMouseEnter={() => sounds?.hover?.()}
              title={isSpeaking ? "Stop Voice" : "Read Entry"}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-hud uppercase tracking-wider border transition-all cursor-pointer font-bold",
                isSpeaking
                  ? "bg-cyan-500 text-slate-950 border-cyan-300"
                  : isLightMode
                    ? "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                    : "bg-slate-800/80 text-cyan-300 border-slate-700 hover:bg-slate-700"
              )}
            >
              {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-cyan-400" />}
              <span>{isSpeaking ? "Stop" : "Voice"}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              onMouseEnter={() => sounds?.hover?.()}
              title="Copy Entry"
              className={cn(
                "p-1.5 rounded-lg border transition-all cursor-pointer",
                copied
                  ? "bg-emerald-500 text-white border-emerald-400"
                  : isLightMode
                    ? "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                    : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
              )}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Version Selector */}
        {pokemon.gameDescriptions && pokemon.gameDescriptions.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto custom-scrollbar pb-1">
              {pokemon.gameDescriptions.map((desc, idx) => {
                const isActive = selectedGameDescIndex === idx;
                const styleClass = getVersionStyle(desc.version, isActive, isLightMode);

                return (
                  <button
                    key={`${desc.version}-${idx}`}
                    type="button"
                    onClick={() => {
                      setSelectedGameDescIndex(idx);
                      try { sounds?.scan?.(); } catch (_) {}
                    }}
                    onMouseEnter={() => sounds?.hover?.()}
                    className={cn(
                      "px-2.5 py-1 text-[9.5px] font-sans rounded-md border transition-all cursor-pointer uppercase font-bold tracking-wide shrink-0",
                      styleClass
                    )}
                  >
                    {desc.version === 'legends-z-a' ? 'Legends Z-A' : desc.version.replace(/-/g, ' ')}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Entry Text Box */}
        <div className={cn(
          "p-4 rounded-xl border relative overflow-hidden transition-all",
          isLightMode
            ? "bg-slate-50 border-slate-200 text-slate-800"
            : "bg-slate-950/80 border-cyan-900/50 text-cyan-100"
        )}>
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-cyan-900/20 text-[10px] font-hud uppercase tracking-wider text-cyan-500/90 font-bold">
            <span>Version: {formattedVersionName}</span>
          </div>

          <div className="min-h-[50px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`flavor-${selectedGameDescIndex}-${pokemon?.name}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "text-[13.5px] font-sans italic leading-relaxed w-full",
                  isLightMode ? "text-slate-800" : "text-cyan-100"
                )}
              >
                <TypewriterText text={currentEntry.flavor_text} delay={10} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Height, Weight, Type Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
          <div className={cn("p-2.5 rounded-xl border", isLightMode ? "bg-slate-50 border-slate-200" : "bg-slate-950/60 border-cyan-900/40")}>
            <span className="text-[9px] font-hud uppercase font-bold text-slate-400 block mb-0.5">Height</span>
            <p className={cn("text-[14px] font-black font-hud leading-none", isLightMode ? "text-slate-900" : "text-cyan-200")}>{heightM.toFixed(1)} m</p>
            <p className="text-[9.5px] font-mono text-slate-500 mt-0.5">{heightFeet}'{heightInches}"</p>
          </div>

          <div className={cn("p-2.5 rounded-xl border", isLightMode ? "bg-slate-50 border-slate-200" : "bg-slate-950/60 border-cyan-900/40")}>
            <span className="text-[9px] font-hud uppercase font-bold text-slate-400 block mb-0.5">Weight</span>
            <p className={cn("text-[14px] font-black font-hud leading-none", isLightMode ? "text-slate-900" : "text-cyan-200")}>{weightKg.toFixed(1)} kg</p>
            <p className="text-[9.5px] font-mono text-slate-500 mt-0.5">{weightLbs.toFixed(1)} lbs</p>
          </div>

          <div className={cn("p-2.5 rounded-xl border flex flex-col justify-center items-center", isLightMode ? "bg-slate-50 border-slate-200" : "bg-slate-950/60 border-cyan-900/40")}>
            <span className="text-[9px] font-hud uppercase font-bold text-slate-400 block mb-1">Type</span>
            <div className="flex flex-wrap gap-1 justify-center">
              {pokemon.types.map((t, idx) => (
                <TypeBadge key={`${t.type.name}-${idx}`} type={t.type.name} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
