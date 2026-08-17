import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  Clock, 
  CloudSun, 
  Sparkles, 
  Sun, 
  CloudRain, 
  Snowflake, 
  Zap, 
  Wind, 
  Moon,
  CalendarDays,
  Activity
} from 'lucide-react';

export interface ScheduleInfo {
  themeColor: string;
  borderColor: string;
  glowColor: string;
  cycleType: string;
  activeHoursText: string;
  startHour: number;
  endHour: number;
  optimalWeather: string;
  optimalWeatherName: string;
  optimalTerrain: string;
  peakDays: string[];
  spawnRate: string;
}

export const getPokemonSchedule = (name: string, types: string[]): ScheduleInfo => {
  const normName = name.toLowerCase();
  
  // Default values
  let cycleType = 'Diurnal';
  let activeHoursText = '06:00 - 18:00';
  let startHour = 6;
  let endHour = 18;
  let optimalWeather = 'Sunny';
  let optimalWeatherName = 'Sunny / Clear';
  let optimalTerrain = 'Grassy Plains';
  let peakDays = ['Monday', 'Tuesday', 'Wednesday'];
  let spawnRate = '2.4%';
  let themeColor = 'text-cyan-400';
  let borderColor = 'border-cyan-500/15';
  let glowColor = 'rgba(34,211,238,0.15)';

  if (normName.includes('-mega')) {
    cycleType = 'Spacetime Rift';
    activeHoursText = '12:00-13:00 / 18:00-19:00';
    startHour = 12; 
    endHour = 19;
    optimalWeather = 'Fog';
    optimalWeatherName = 'Temporal Distortion Fog';
    optimalTerrain = 'System Vortex Rift';
    peakDays = ['Wednesday', 'Saturday'];
    spawnRate = '0.4%';
    themeColor = 'text-amber-400';
    borderColor = 'border-amber-500/25';
    glowColor = 'rgba(245,158,11,0.2)';
  } else if (normName.includes('-gmax')) {
    cycleType = 'Dynamax Celestial';
    activeHoursText = '20:00 - 02:00';
    startHour = 20;
    endHour = 2; 
    optimalWeather = 'Thunderstorm';
    optimalWeatherName = 'Electric Ionized Storm';
    optimalTerrain = 'Power Spot Nexus';
    peakDays = ['Friday', 'Saturday', 'Sunday'];
    spawnRate = '0.2%';
    themeColor = 'text-red-400';
    borderColor = 'border-red-500/25';
    glowColor = 'rgba(239,68,68,0.2)';
  } else if (normName.includes('-alola')) {
    cycleType = 'Tropical Diurnal';
    activeHoursText = '09:00 - 17:00';
    startHour = 9;
    endHour = 17;
    optimalWeather = 'Sunny';
    optimalWeatherName = 'Alola Solar High UV';
    optimalTerrain = 'Island Coral Coast';
    peakDays = ['Thursday', 'Sunday'];
    spawnRate = '1.8%';
    themeColor = 'text-teal-400';
    borderColor = 'border-teal-500/25';
    glowColor = 'rgba(45,212,191,0.2)';
  } else if (normName.includes('-galar')) {
    cycleType = 'Industrial Overcast';
    activeHoursText = '14:00 - 20:00';
    startHour = 14;
    endHour = 20;
    optimalWeather = 'Fog';
    optimalWeatherName = 'Smoggy Heavy Mist';
    optimalTerrain = 'Industrial Marshlands';
    peakDays = ['Tuesday', 'Thursday'];
    spawnRate = '1.5%';
    themeColor = 'text-slate-400';
    borderColor = 'border-slate-500/25';
    glowColor = 'rgba(148,163,184,0.15)';
  } else if (normName.includes('-hisui')) {
    cycleType = 'Primeval Dusk';
    activeHoursText = '04:00-08:00 / 17:00-21:00';
    startHour = 4;
    endHour = 21;
    optimalWeather = 'Fog';
    optimalWeatherName = 'Ancient Alpine Mist';
    optimalTerrain = 'Wild Hisuian Highlands';
    peakDays = ['Monday', 'Friday'];
    spawnRate = '0.9%';
    themeColor = 'text-indigo-400';
    borderColor = 'border-indigo-500/25';
    glowColor = 'rgba(129,140,248,0.2)';
  } else if (normName.includes('-shadow')) {
    cycleType = 'Nocturnal Void';
    activeHoursText = '00:00 - 03:00';
    startHour = 0;
    endHour = 3;
    optimalWeather = 'Clear Night';
    optimalWeatherName = 'Umbral Shadow Eclipse';
    optimalTerrain = 'Abyssal Void Rifts';
    peakDays = ['Tuesday', 'Friday'];
    spawnRate = '0.5%';
    themeColor = 'text-purple-400';
    borderColor = 'border-purple-500/30';
    glowColor = 'rgba(192,132,252,0.25)';
  } else if (normName.includes('midnight')) {
    cycleType = 'Lunar Peak';
    activeHoursText = '22:00 - 04:00';
    startHour = 22;
    endHour = 4;
    optimalWeather = 'Clear Night';
    optimalWeatherName = 'Full Midnight Moonlight';
    optimalTerrain = 'Craggy Mountain Peaks';
    peakDays = ['Wednesday', 'Friday', 'Saturday'];
    spawnRate = '1.1%';
    themeColor = 'text-rose-400';
    borderColor = 'border-rose-500/25';
    glowColor = 'rgba(251,113,133,0.2)';
  } else if (normName.includes('dusk')) {
    cycleType = 'Amber Crepuscular';
    activeHoursText = '17:00 - 18:30';
    startHour = 17;
    endHour = 18;
    optimalWeather = 'Sunny';
    optimalWeatherName = 'Golden Hour Decline';
    optimalTerrain = 'Ravine Lookout';
    peakDays = ['Tuesday', 'Friday'];
    spawnRate = '0.8%';
    themeColor = 'text-orange-400';
    borderColor = 'border-orange-500/25';
    glowColor = 'rgba(251,146,60,0.2)';
  } else {
    // Determine schedule based on type
    const primaryType = types[0] || 'normal';
    
    if (primaryType === 'ghost' || primaryType === 'dark') {
      cycleType = 'Nocturnal';
      activeHoursText = '21:00 - 05:00';
      startHour = 21;
      endHour = 5;
      optimalWeather = 'Fog';
      optimalWeatherName = 'Damp Shadow Fog';
      optimalTerrain = 'Cemetery Graves';
      peakDays = ['Monday', 'Wednesday', 'Friday'];
      spawnRate = '2.1%';
      themeColor = 'text-purple-400/90';
      borderColor = 'border-purple-900/40';
      glowColor = 'rgba(168,85,247,0.15)';
    } else if (primaryType === 'fire') {
      cycleType = 'Diurnal Solar';
      activeHoursText = '08:00 - 16:00';
      startHour = 8;
      endHour = 16;
      optimalWeather = 'Sunny';
      optimalWeatherName = 'Blazing Daylight Solar';
      optimalTerrain = 'Volcanic Ravines';
      peakDays = ['Wednesday', 'Sunday'];
      spawnRate = '2.5%';
      themeColor = 'text-red-400';
      borderColor = 'border-red-900/40';
      glowColor = 'rgba(239,68,68,0.15)';
    } else if (primaryType === 'water') {
      cycleType = 'Marine Wave';
      activeHoursText = '06:00-10:00 / 18:00-22:00';
      startHour = 6;
      endHour = 22;
      optimalWeather = 'Rain';
      optimalWeatherName = 'Heavy Monsoon Downpour';
      optimalTerrain = 'Submerged Reefs';
      peakDays = ['Thursday', 'Saturday'];
      spawnRate = '3.5%';
      themeColor = 'text-blue-400';
      borderColor = 'border-blue-900/40';
      glowColor = 'rgba(59,130,246,0.15)';
    } else if (primaryType === 'ice') {
      cycleType = 'Frozen Dawn';
      activeHoursText = '01:00 - 08:00';
      startHour = 1;
      endHour = 8;
      optimalWeather = 'Snow';
      optimalWeatherName = 'Subzero Cryo Snow';
      optimalTerrain = 'Glacier Canyons';
      peakDays = ['Friday', 'Saturday'];
      spawnRate = '1.4%';
      themeColor = 'text-cyan-300';
      borderColor = 'border-cyan-900/40';
      glowColor = 'rgba(34,211,238,0.15)';
    } else if (primaryType === 'grass' || primaryType === 'bug') {
      cycleType = 'Diurnal Canopy';
      activeHoursText = '07:00 - 15:00';
      startHour = 7;
      endHour = 15;
      optimalWeather = 'Sunny';
      optimalWeatherName = 'Intense UV Synthesis';
      optimalTerrain = 'Forest Canopies';
      peakDays = ['Tuesday', 'Thursday', 'Sunday'];
      spawnRate = '4.2%';
      themeColor = 'text-emerald-400';
      borderColor = 'border-emerald-950';
      glowColor = 'rgba(16,185,129,0.15)';
    } else if (primaryType === 'electric') {
      cycleType = 'Storm Charge';
      activeHoursText = '22:00 - 04:00';
      startHour = 22;
      endHour = 4;
      optimalWeather = 'Thunderstorm';
      optimalWeatherName = 'Voltage Lightning Burst';
      optimalTerrain = 'Power Grid Substations';
      peakDays = ['Wednesday', 'Saturday'];
      spawnRate = '2.3%';
      themeColor = 'text-yellow-400';
      borderColor = 'border-yellow-950/40';
      glowColor = 'rgba(234,179,8,0.15)';
    } else if (primaryType === 'fairy' || primaryType === 'psychic') {
      cycleType = 'Astral Alignment';
      activeHoursText = '19:00 - 01:00';
      startHour = 19;
      endHour = 1;
      optimalWeather = 'Clear Night';
      optimalWeatherName = 'Astral Starlight Eclipse';
      optimalTerrain = 'Mystic Leylines';
      peakDays = ['Friday', 'Saturday', 'Sunday'];
      spawnRate = '1.9%';
      themeColor = 'text-pink-400';
      borderColor = 'border-pink-950/45';
      glowColor = 'rgba(236,72,153,0.15)';
    } else {
      cycleType = 'Standard Diurnal';
      activeHoursText = '06:00 - 18:00';
      startHour = 6;
      endHour = 18;
      optimalWeather = 'Sunny';
      optimalWeatherName = 'Light Atmospheric Breeze';
      optimalTerrain = 'Temperate Meadows';
      peakDays = ['Monday', 'Wednesday', 'Friday'];
      spawnRate = '2.8%';
      themeColor = 'text-cyan-400';
      borderColor = 'border-cyan-800/20';
      glowColor = 'rgba(34,211,238,0.15)';
    }
  }

  return {
    themeColor,
    borderColor,
    glowColor,
    cycleType,
    activeHoursText,
    startHour,
    endHour,
    optimalWeather,
    optimalWeatherName,
    optimalTerrain,
    peakDays,
    spawnRate
  };
};

const getWeatherIcon = (weather: string) => {
  const norm = weather.toLowerCase();
  if (norm.includes('sun') || norm.includes('solar')) return Sun;
  if (norm.includes('rain') || norm.includes('water')) return CloudRain;
  if (norm.includes('snow') || norm.includes('cryo')) return Snowflake;
  if (norm.includes('storm') || norm.includes('lightning')) return Zap;
  if (norm.includes('fog') || norm.includes('mist')) return Wind;
  if (norm.includes('moon') || norm.includes('night') || norm.includes('star')) return Moon;
  return CloudSun;
};

// ... (I'll need to rewrite the component return)

export const PokemonEncounterGame: React.FC<{
  pokemon: any;
  onPlaySound?: () => void;
}> = ({ pokemon, onPlaySound }) => {
  const schedule = useMemo(() => getPokemonSchedule(pokemon.name, pokemon.types.map((t: any) => t.type.name)), [pokemon.name, pokemon.types]);
  
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'found' | 'missed'>('idle');
  const [deviceTime] = useState(() => new Date());

  const currentHour = deviceTime.getHours();
  const isCurrentlyActive = useMemo(() => {
    const { startHour, endHour } = schedule;
    if (startHour <= endHour) {
      return currentHour >= startHour && currentHour <= endHour;
    } else {
      return currentHour >= startHour || currentHour <= endHour;
    }
  }, [currentHour, schedule]);

  const handleScan = () => {
    if (onPlaySound) onPlaySound();
    setScanStatus('scanning');
    setTimeout(() => {
      // Simulate finding (higher chance if active)
      const isLucky = Math.random() < (isCurrentlyActive ? 0.7 : 0.2);
      setScanStatus(isLucky ? 'found' : 'missed');
    }, 2000);
  };

  return (
    <div className="w-full bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 flex flex-col items-center gap-3">
      <h3 className="font-hud text-xs text-slate-300 uppercase tracking-widest">Encounter Detector: {pokemon.name.toUpperCase()}</h3>
      
      {scanStatus === 'idle' && (
        <button 
          onClick={handleScan}
          className="px-4 py-2 bg-cyan-900 border border-cyan-500 rounded-md font-hud text-xs font-black text-cyan-100 hover:bg-cyan-800"
        >
          START SCAN
        </button>
      )}
      
      {scanStatus === 'scanning' && (
        <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono animate-pulse">
          <Activity className="w-4 h-4 animate-spin" /> SCANNING...
        </div>
      )}
      
      {scanStatus === 'found' && (
        <div className="text-xs text-emerald-400 font-bold font-hud uppercase">Success! Found {pokemon.name}!</div>
      )}
      
      {scanStatus === 'missed' && (
        <div className="text-xs text-rose-400 font-bold font-hud uppercase">Not found. Try {schedule.activeHoursText}.</div>
      )}

      {/* Official Game Appearances List */}
      <div className="w-full mt-2 pt-2 border-t border-slate-700/50">
        <h4 className="font-hud text-[10px] text-slate-500 uppercase tracking-widest mb-1.5">Official Game Appearances:</h4>
        <div className="flex flex-wrap gap-1">
          {pokemon.game_indices && pokemon.game_indices.slice(0, 8).map((gi: any, i: number) => (
            <span key={`${gi.version.name}-${i}`} className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[9px] font-mono capitalize">
              {gi.version.name}
            </span>
          ))}
          {(!pokemon.game_indices || pokemon.game_indices.length === 0) && <span className="text-slate-600 text-[9px] font-mono">No data found</span>}
        </div>
      </div>
    </div>
  );
};
