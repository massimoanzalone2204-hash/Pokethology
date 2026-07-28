import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio } from 'lucide-react';
import { sounds } from '../lib/sounds';

interface AudioSettingsProps {
  mode?: 'full' | 'simple';
}

export function AudioSettings({ mode = 'full' }: AudioSettingsProps) {
  const [bgmPlaying, setBgmPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<'route1' | 'battle' | 'forest' | 'champion'>('route1');
  const [bgmVolume, setBgmVolume] = useState(sounds.getBGMVolume());
  const [sfxVolume, setSfxVolume] = useState(sounds.getSFXVolume());

  useEffect(() => {
    // Sync internal state with sounds volume
    setBgmVolume(sounds.getBGMVolume());
    setSfxVolume(sounds.getSFXVolume());
  }, []);

  const handleToggleBgm = () => {
    if (bgmPlaying) {
      sounds.stopBGM();
      setBgmPlaying(false);
    } else {
      sounds.playBGM(selectedTrack);
      setBgmPlaying(true);
    }
  };

  const handleTrackChange = (track: 'route1' | 'battle' | 'forest' | 'champion') => {
    setSelectedTrack(track);
    if (bgmPlaying) {
      sounds.playBGM(track);
    }
  };

  const handleBgmVolumeChange = (val: number) => {
    setBgmVolume(val);
    sounds.setBGMVolume(val);
  };

  const handleSfxVolumeChange = (val: number) => {
    setSfxVolume(val);
    sounds.setSFXVolume(val);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {mode === 'full' && (
        <>
          <div className="flex items-center gap-2 justify-center">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-hud uppercase text-[11px] font-bold tracking-widest text-center">Sophisticated Pokéthology BGM</span>
          </div>

          <p className="text-[10px] text-slate-400 text-center leading-tight">
            Immersive multi-layered melodic soundscapes.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'route1', name: 'Pokéthology BGM 1' },
              { id: 'battle', name: 'Pokéthology BGM 2' },
              { id: 'forest', name: 'Pokéthology BGM 3' },
              { id: 'champion', name: 'Pokéthology BGM 4' },
            ].map((track) => (
              <button
                key={track.id}
                onClick={() => handleTrackChange(track.id as any)}
                className={`p-2 rounded-xl border flex flex-col items-center gap-0.5 transition-all text-center ${
                  selectedTrack === track.id
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 shadow-lg shadow-emerald-950/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-hud uppercase text-[9px] font-bold tracking-wider">{track.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
            <button
              onClick={handleToggleBgm}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-hud uppercase text-[10px] font-bold tracking-wider transition-all ${
                bgmPlaying
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md shadow-emerald-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {bgmPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              {bgmPlaying ? 'Pause BGM' : 'Play BGM'}
            </button>
            <span className="text-[10px] font-mono text-emerald-400">{bgmPlaying ? '● Active' : '○ Standby'}</span>
          </div>
        </>
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
