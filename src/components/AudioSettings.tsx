import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, SkipBack, SkipForward, Disc, Shuffle, Repeat } from 'lucide-react';
import { sounds, POKE_CHILL_TRACKS } from '../lib/sounds';

interface AudioSettingsProps {
  mode?: 'full' | 'simple';
}

export function AudioSettings({ mode = 'simple' }: AudioSettingsProps) {
  const [bgmState, setBgmState] = useState<any>(null);
  const [bgmVolume, setBgmVolume] = useState(sounds.getBGMVolume());
  const [sfxVolume, setSfxVolume] = useState(sounds.getSFXVolume());

  useEffect(() => {
    // Sync internal state with sounds volume
    setBgmVolume(sounds.getBGMVolume());
    setSfxVolume(sounds.getSFXVolume());
    
    const interval = setInterval(() => {
      setBgmState(sounds.getBGMState());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleToggleBgm = () => {
    sounds.toggleBGM();
    setBgmState(sounds.getBGMState());
  };

  const handleToggleShuffle = () => {
    sounds.toggleShuffle();
    setBgmState(sounds.getBGMState());
  };

  const handleToggleLoop = () => {
    sounds.toggleLoop();
    setBgmState(sounds.getBGMState());
  };

  const handleTrackChange = (trackId: string) => {
    sounds.playBGM(trackId);
  };

  const handleBgmVolumeChange = (val: number) => {
    setBgmVolume(val);
    sounds.setBGMVolume(val);
  };

  const handleSfxVolumeChange = (val: number) => {
    setSfxVolume(val);
    sounds.setSFXVolume(val);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = bgmState ? (bgmState.currentTime / bgmState.duration) * 100 : 0;
  const isPlaying = bgmState?.isPlaying;
  const currentTrackId = bgmState?.trackId;

  return (
    <div className="flex flex-col gap-3 w-full">
      {(mode === 'full' || mode === 'simple') && (
        <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col shadow-xl shadow-black/50 mb-2">
          {/* Banner / Cover Art Header */}
          <div className="relative p-4 sm:p-5 flex flex-row items-end gap-4 overflow-hidden min-h-[140px] sm:min-h-[160px]">
            {/* Background blurred cover */}
            <div 
              className="absolute inset-0 z-0 opacity-20 blur-2xl scale-125 saturate-150"
              style={{ backgroundImage: 'url(https://f4.bcbits.com/img/a2187607759_10.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent z-10" />
            
            {/* Foreground Album Cover */}
            <div className="relative z-20 shrink-0 shadow-2xl shadow-black/60 rounded-xl overflow-hidden border border-white/10 w-24 h-24 sm:w-28 sm:h-28">
              <img 
                src="https://f4.bcbits.com/img/a2187607759_10.jpg" 
                alt="Poké & Chill Album Cover" 
                className="w-full h-full object-cover"
                
              />
            </div>
            
            {/* Album Info */}
            <div className="relative z-20 flex-1 flex flex-col justify-end pb-0.5 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold rounded border border-emerald-500/30 whitespace-nowrap">OFFICIAL BGM</span>
                <Music className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0 hidden sm:block" />
              </div>
              <h3 className="font-hud text-base sm:text-xl font-black uppercase tracking-widest text-white truncate drop-shadow-md">
                Poké & Chill
              </h3>
              <p className="text-[10px] sm:text-[11px] text-emerald-400/90 font-mono mt-1 truncate drop-shadow-sm font-bold">
                by Mikel & GameChops
              </p>
            </div>
          </div>

          {/* Player Controls Header */}
          <div className="p-3 bg-slate-900/80 border-y border-slate-800/80 flex items-center justify-between backdrop-blur-sm z-20 relative">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => sounds.playPrevBGM()}
                className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleToggleBgm}
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all ${
                  isPlaying
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-1" />}
              </button>
              <button
                onClick={() => sounds.playNextBGM()}
                className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleToggleShuffle}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ml-1 sm:ml-2 ${bgmState?.isShuffle ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400'}`}
              >
                <Shuffle className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleToggleLoop}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ml-0.5 sm:ml-1 ${bgmState?.isLoop ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400'}`}
              >
                <Repeat className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
            <div className="flex flex-col items-end min-w-0 flex-1 ml-4">
              <span className="text-[9px] sm:text-[10px] font-hud uppercase font-black text-emerald-400 tracking-wider truncate w-full text-right">
                {bgmState?.trackName || 'Loading...'}
              </span>
              <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                {formatTime(bgmState?.currentTime || 0)} / {formatTime(bgmState?.duration || 0)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 sm:h-1.5 bg-slate-800 w-full relative z-20">
            <div 
              className="absolute top-0 left-0 h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)] transition-all duration-300 ease-linear" 
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>

          {/* Tracklist (Scrollable) */}
          <div className="max-h-40 sm:max-h-48 overflow-y-auto custom-scrollbar bg-slate-950/90 p-2 flex flex-col gap-1 z-20 relative">
            {POKE_CHILL_TRACKS.map((track) => {
              const isActive = currentTrackId === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackChange(track.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left group ${
                    isActive
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 shadow-sm'
                      : 'bg-transparent border border-transparent hover:bg-slate-800/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Disc className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-emerald-400 animate-[spin_3s_linear_infinite]' : 'text-slate-600 group-hover:text-slate-400'}`} />
                    <span className="font-hud uppercase text-[9px] sm:text-[10px] font-bold tracking-wider">{track.name}</span>
                  </div>
                  {isActive && <div className="flex gap-0.5 items-end h-3">
                    <div className="w-1 bg-emerald-400 rounded-full animate-[music-bar_1s_ease-in-out_infinite]" style={{ height: '100%' }} />
                    <div className="w-1 bg-emerald-400 rounded-full animate-[music-bar_1.2s_ease-in-out_infinite_0.2s]" style={{ height: '60%' }} />
                    <div className="w-1 bg-emerald-400 rounded-full animate-[music-bar_0.8s_ease-in-out_infinite_0.4s]" style={{ height: '80%' }} />
                  </div>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Clean Volume Sliders Block: SFX Volume first, BGM Volume directly under actual SFX */}
      <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex flex-col gap-3.5 text-left w-full">
        {/* SFX Volume Bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-300">
            <span className="font-hud uppercase font-bold text-cyan-400 tracking-wider">SFX Volume</span>
            <span className="text-cyan-400 font-bold">{Math.round(sfxVolume * 100)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <VolumeX className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={sfxVolume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                handleSfxVolumeChange(val);
                sounds.success();
              }}
              className="hud-slider flex-1 accent-cyan-500 cursor-pointer"
            />
            <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* BGM Volume Bar — Directly under actual SFX */}
        <div className="flex flex-col gap-1.5 pt-2.5 border-t border-slate-800/60">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-300">
            <span className="font-hud uppercase font-bold text-emerald-400 tracking-wider">BGM Volume</span>
            <span className="text-emerald-400 font-bold">{Math.round(bgmVolume * 100)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <VolumeX className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={bgmVolume}
              onChange={(e) => handleBgmVolumeChange(parseFloat(e.target.value))}
              className="hud-slider flex-1 accent-emerald-500 cursor-pointer"
            />
            <Volume2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
