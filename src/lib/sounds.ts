// Web Audio API based sound synthesizer for UI feedback and retro atmosphere
let audioCtx: AudioContext | null = null;
let bgmInterval: number | null = null;
let currentTheme: string | null = null;
let sfxVolume = parseFloat(localStorage.getItem('pokethology_sfx_volume') || '0.5');
let bgmVolume = parseFloat(localStorage.getItem('pokethology_bgm_volume') || '0.55');
let bgmPack = localStorage.getItem('pokethology_bgm_pack') || '8-bit Retro';
let bgmFadeMultiplier = 1.0;
let fadeIntervalId: number | null = null;
let lastHoverTime = 0;
let lastTypingTime = 0;
let tempoMultiplier = 1.0;

function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) throw new Error("AudioContext not supported");
    audioCtx = new AudioCtx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(e => console.warn("AudioContext resume failed:", e));
  }
  return audioCtx;
}

// Global master out with soft limit threshold
function playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    
    // Lowpass filter to avoid raw piercing beeps and emulate vintage audio hardware
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'square' || type === 'sawtooth' ? 1200 : 2500, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol * sfxVolume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
}

let lastScanSoundTime = 0;

export const sounds = {
  setTempoMultiplier: (mult: number) => {
    tempoMultiplier = mult;
    if (currentTheme) {
      sounds.playBGM(currentTheme);
    }
  },
  setSFXVolume: (vol: number) => { 
    sfxVolume = vol;
    try { localStorage.setItem('pokethology_sfx_volume', vol.toString()); } catch (_) {}
  },
  setBGMVolume: (vol: number) => { 
    bgmVolume = vol; 
    try { localStorage.setItem('pokethology_bgm_volume', vol.toString()); } catch (_) {}
    if (currentTheme) {
      sounds.playBGM(currentTheme);
    }
  },
  setBGMPack: (pack: string) => {
    bgmPack = pack;
    try { localStorage.setItem('pokethology_bgm_pack', pack); } catch (_) {}
    if (currentTheme) {
      sounds.playBGM(currentTheme);
    }
  },
  getBGMPack: () => bgmPack,
  getSFXVolume: () => sfxVolume,
  getBGMVolume: () => bgmVolume,
  boot: () => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      // Beautiful layered major arpeggio sweep representing a vintage computing OS loading sequence
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C4 E4 G4 C5 E5 G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + i * 0.06 + 0.4);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now + i * 0.06);
        filter.frequency.exponentialRampToValueAtTime(450, now + i * 0.06 + 0.4);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.045 * sfxVolume, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.42);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.42);
      });
    } catch {
      playTone(523.25, 'triangle', 0.15, 0.05);
      setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.05), 100);
    }
  },
  scan: () => {
    const nowTime = Date.now();
    if (nowTime - lastScanSoundTime < 35) return;
    lastScanSoundTime = nowTime;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Dual-component highly responsive click: crisp high-end and deep tech focus
      const oscSub = ctx.createOscillator();
      const oscClick = ctx.createOscillator();
      const gainSub = ctx.createGain();
      const gainClick = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Punchy sub-tone (pure solid core)
      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(380, now);
      oscSub.frequency.exponentialRampToValueAtTime(220, now + 0.07);

      gainSub.gain.setValueAtTime(0, now);
      gainSub.gain.linearRampToValueAtTime(0.045 * sfxVolume, now + 0.003);
      gainSub.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      // Crisp digital transients sweep-click (delivers immediate visual/tactile response)
      oscClick.type = 'triangle';
      oscClick.frequency.setValueAtTime(1200, now);
      oscClick.frequency.exponentialRampToValueAtTime(3200, now + 0.06);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1600, now);
      
      gainClick.gain.setValueAtTime(0, now);
      gainClick.gain.linearRampToValueAtTime(0.02 * sfxVolume, now + 0.004);
      gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      oscSub.connect(gainSub);
      gainSub.connect(ctx.destination);

      oscClick.connect(filter);
      filter.connect(gainClick);
      gainClick.connect(ctx.destination);

      oscSub.start(now);
      oscSub.stop(now + 0.07);
      oscClick.start(now);
      oscClick.stop(now + 0.06);
    } catch {
      playTone(850, 'sine', 0.04, 0.05);
    }
  },
  typing: () => {
    const nowMs = performance.now();
    if (nowMs - lastTypingTime < 55) return;
    lastTypingTime = nowMs;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 0.018);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3000 + Math.random() * 800, now);
      filter.Q.setValueAtTime(12, now);

      gain.gain.setValueAtTime(0.012 * sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.018);
    } catch {
      playTone(1800, 'sine', 0.01, 0.01);
    }
  },
  error: () => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sawtooth';
      
      osc1.frequency.setValueAtTime(180, now);
      osc1.frequency.linearRampToValueAtTime(90, now + 0.3);
      
      osc2.frequency.setValueAtTime(183, now);
      osc2.frequency.linearRampToValueAtTime(92, now + 0.3);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.14 * sfxVolume, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } catch {
      playTone(180, 'sawtooth', 0.25, 0.12);
    }
  },
  success: () => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      // Luxurious major arpeggio with retro-digital shimmer
      const notes = [261.63, 311.13, 392.00, 523.25, 622.25, 783.99, 1046.50]; // Beautiful harmonic arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.045);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.035 * sfxVolume, now + idx * 0.045 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.28);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + 0.28);
      });
    } catch {
      playTone(523.25, 'triangle', 0.1, 0.05);
      setTimeout(() => playTone(659.25, 'triangle', 0.1, 0.05), 50);
      setTimeout(() => playTone(783.99, 'triangle', 0.2, 0.05), 100);
    }
  },
  shiny: () => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      // High frequency sparkling fairy glitter sweep
      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const pfilter = ctx.createBiquadFilter();
          const pgain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1500 + i * 400 + Math.random() * 200, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 0.15);
          
          pfilter.type = 'highpass';
          pfilter.frequency.setValueAtTime(1000, ctx.currentTime);
          
          pgain.gain.setValueAtTime(0, ctx.currentTime);
          pgain.gain.linearRampToValueAtTime(0.03 * sfxVolume, ctx.currentTime + 0.02);
          pgain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          
          osc.connect(pfilter);
          pfilter.connect(pgain);
          pgain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        }, i * 45);
      }
    } catch {
      playTone(2000, 'sine', 0.2, 0.03);
    }
  },
  hover: () => {
    const nowMs = performance.now();
    if (nowMs - lastHoverTime < 45) return; // Super fast responsive cooldown for fluid high-speed navigation
    lastHoverTime = nowMs;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Luxurious double-sine resonant micro-tonal tap for tactile hover presence
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      osc1.type = 'sine';
      osc2.type = 'sine';
      
      // Muted high-tech organic chime frequencies
      osc1.frequency.setValueAtTime(1200, now);
      osc1.frequency.exponentialRampToValueAtTime(1600, now + 0.025);
      
      osc2.frequency.setValueAtTime(1800, now);
      osc2.frequency.exponentialRampToValueAtTime(2400, now + 0.025);
      
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.Q.setValueAtTime(2, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.015 * sfxVolume, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.025);
      osc2.stop(now + 0.025);
    } catch {
      playTone(600, 'sine', 0.012, 0.01);
    }
  },
  _currentCry: null as HTMLAudioElement | null,
  playCry: async (pokemonName: string, pokeApiUrl?: string, isGmax: boolean = false, allowOverlap: boolean = false): Promise<number> => {
    try {
      if (!allowOverlap && sounds._currentCry) {
        try {
          sounds._currentCry.pause();
          sounds._currentCry.src = ""; 
        } catch (_) {}
        sounds._currentCry = null;
      }

      const audio = new Audio();
      if (!allowOverlap) {
        sounds._currentCry = audio;
      }
      audio.volume = 0.5 * sfxVolume;

      const cleanName = pokemonName.toLowerCase().replace(/[^a-z0-9-]/g, '');
      const noHyphens = cleanName.replace(/-/g, '');
      const parts = pokemonName.toLowerCase().split('-');
      const baseName = parts[0];

      const urlPool = new Set<string>();
      urlPool.add(`https://play.pokemonshowdown.com/audio/cries/${cleanName}.ogg`);
      urlPool.add(`https://play.pokemonshowdown.com/audio/cries/${noHyphens}.ogg`);
      if (baseName && baseName !== cleanName && baseName !== noHyphens) {
        urlPool.add(`https://play.pokemonshowdown.com/audio/cries/${baseName}.ogg`);
      }
      if (pokeApiUrl) urlPool.add(pokeApiUrl);

      const urls = Array.from(urlPool);

      const applyEffects = () => {
        const lowerName = pokemonName.toLowerCase();
        if (isGmax || lowerName.includes('eternamax')) {
          audio.playbackRate = lowerName.includes('eternamax') ? 0.75 : 0.42;
          audio.preservesPitch = false;
        } else if (lowerName.includes('mega')) {
          audio.playbackRate = 0.8;
          audio.preservesPitch = false;
        } else {
          audio.playbackRate = 1.05;
          audio.preservesPitch = true;
        }
      };

      for (const url of urls) {
        if (!allowOverlap && sounds._currentCry !== audio) return 0;

        try {
          audio.src = url;
          applyEffects();
          
          await new Promise((resolve, reject) => {
            const onCanPlay = () => {
              cleanup();
              resolve(null);
            };
            const onError = (e: any) => {
              cleanup();
              reject(e);
            };
            const cleanup = () => {
              audio.removeEventListener('canplaythrough', onCanPlay);
              audio.removeEventListener('error', onError);
            };
            audio.addEventListener('canplaythrough', onCanPlay);
            audio.addEventListener('error', onError);
            setTimeout(() => { cleanup(); reject(new Error("Timeout")); }, 2000);
          });

          if (!allowOverlap && sounds._currentCry !== audio) return 0;

          const lowerName = pokemonName.toLowerCase();
          if (isGmax || lowerName.includes('eternamax')) {
            playTone(35, 'sawtooth', 1.2, 0.12);
            playTone(55, 'triangle', 1.2, 0.08);
          } else if (lowerName.includes('mega')) {
            playTone(90, 'sine', 0.6, 0.08);
          }

          await audio.play();

          const rawDur = (audio.duration && !isNaN(audio.duration) && audio.duration > 0) ? audio.duration : 1.2;
          const rate = audio.playbackRate || 1;
          const playTimeMs = (rawDur / rate) * 1000;

          await new Promise<void>((resolve) => {
            let doneCalled = false;
            const done = () => {
              if (doneCalled) return;
              doneCalled = true;
              audio.removeEventListener('ended', done);
              audio.removeEventListener('error', done);
              resolve();
            };
            audio.addEventListener('ended', done);
            audio.addEventListener('error', done);
            setTimeout(done, Math.max(800, playTimeMs + 400));
          });

          return playTimeMs;
        } catch (e) {
          if (!allowOverlap && sounds._currentCry !== audio) return 0;
        }
      }
      
      if (allowOverlap || sounds._currentCry === audio) {
        console.warn(`All cry sources failed, generating procedural retro synth cry for: ${pokemonName}`);
        // Beautiful fallback procedural cry
        const hash = pokemonName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const freqBase = 200 + (hash % 600);
        const duration = 0.3 + ((hash % 10) / 20);
        playTone(freqBase, 'sawtooth', duration, 0.08);
        setTimeout(() => playTone(freqBase * 1.3, 'triangle', duration * 0.7, 0.05), 50);
        const synthMs = (duration + 0.15) * 1000;
        await new Promise(r => setTimeout(r, synthMs));
        return synthMs;
      }
      return 1000;
    } catch (e) {
      console.error("Audio playback failed", e);
      return 1000;
    }
  },
  attack: () => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12 * sfxVolume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
    
    playTone(280, 'triangle', 0.15, 0.06);
  },
  hit: () => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.setValueAtTime(60, now + 0.04);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25 * sfxVolume, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
    
    playTone(1800, 'sine', 0.025, 0.08);
    playTone(45, 'triangle', 0.12, 0.15);
  },
  faint: () => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.95);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.14 * sfxVolume, now + 0.02);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.95);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.95);
  },
  victory: () => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      if (bgmPack === 'Symphonic') {
        // Wide brass-like major chords rising majestically
        const chordProgressions = [
          [261.63, 329.63, 392.00, 523.25], // C Major
          [293.66, 349.23, 440.00, 587.33], // D Minor (passing)
          [349.23, 440.00, 523.25, 698.46], // F Major
          [392.00, 493.88, 587.33, 783.99], // G Major
          [523.25, 659.25, 783.99, 1046.50] // C Major Octave climax
        ];
        
        chordProgressions.forEach((chord, stepIdx) => {
          chord.forEach((freq, noteIdx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            // Soft sine/triangle blend for symphonic warmth
            osc.type = noteIdx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now + stepIdx * 0.18);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, now);
            
            gain.gain.setValueAtTime(0, now + stepIdx * 0.18);
            gain.gain.linearRampToValueAtTime(0.045 * sfxVolume, now + stepIdx * 0.18 + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + stepIdx * 0.18 + 0.6);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now + stepIdx * 0.18);
            osc.stop(now + stepIdx * 0.18 + 0.6);
          });
        });
      } else if (bgmPack === 'Cyber-Synth') {
        // High energy futuristic electronic rise with pitch sweeps
        const synthNotes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
        synthNotes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + idx * 0.06 + 0.15);
          
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1500, now + idx * 0.06);
          filter.frequency.exponentialRampToValueAtTime(300, now + idx * 0.06 + 0.15);
          
          gain.gain.setValueAtTime(0, now + idx * 0.06);
          gain.gain.linearRampToValueAtTime(0.04 * sfxVolume, now + idx * 0.06 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);
          
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.15);
        });
      } else {
        // Classic 8-bit retro arpeggio fanfare
        const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          setTimeout(() => playTone(freq, i % 2 === 0 ? 'sine' : 'square', 0.12, 0.06), i * 115);
        });
        setTimeout(() => playTone(1318.51, 'square', 0.8, 0.06), notes.length * 115);
      }
    } catch {
      // Basic fallback
      playTone(523.25, 'triangle', 0.1, 0.05);
      setTimeout(() => playTone(659.25, 'triangle', 0.1, 0.05), 100);
      setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.05), 200);
    }
  },
  defeat: () => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      
      // Solemn Church/Cathedral Bell Toll Effect (Defeat Toll)
      const playBellToll = (timeOffset: number, baseFreq: number) => {
        // detuned low oscillators for the deep hum
        const frequencies = [
          baseFreq,          // Strike tone
          baseFreq * 1.005,  // Detuned strike tone
          baseFreq * 0.5,    // Sub hum
          baseFreq * 1.19,   // Minor third overtone
          baseFreq * 1.5,    // Fifth overtone
          baseFreq * 2.0     // Octave overtone
        ];
        
        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          
          osc.type = idx < 3 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now + timeOffset);
          
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(idx < 3 ? 350 : 800, now + timeOffset);
          
          gain.gain.setValueAtTime(0, now + timeOffset);
          // Fast attack, extremely slow decay for natural bell resonance
          gain.gain.linearRampToValueAtTime(0.06 * sfxVolume, now + timeOffset + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + (idx < 3 ? 1.8 : 0.9));
          
          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(now + timeOffset);
          osc.stop(now + timeOffset + (idx < 3 ? 1.8 : 0.9));
        });
      };
      
      if (bgmPack === 'Symphonic') {
        // Low, heavy cathedral tolls (A minor feel)
        playBellToll(0, 110.00); // Low A hum
        playBellToll(0.8, 98.00); // Low G hum
        playBellToll(1.6, 87.31); // Low F hum
      } else if (bgmPack === 'Cyber-Synth') {
        // High-tech dark glitch toll
        playTone(180, 'sawtooth', 0.4, 0.12);
        setTimeout(() => playTone(120, 'sawtooth', 0.5, 0.12), 300);
        setTimeout(() => playTone(75, 'square', 0.8, 0.15), 600);
        
        // Add a cyber resonant sweep
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 1.2);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(400, ctx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 1.2);
          gain.gain.setValueAtTime(0.08 * sfxVolume, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
          osc.start(); osc.stop(ctx.currentTime + 1.2);
        }, 900);
      } else {
        // Classic 8-bit retro solemn descending minor toll
        const retroNotes = [196.00, 174.61, 146.83, 110.00];
        retroNotes.forEach((freq, i) => {
          setTimeout(() => playTone(freq, 'sawtooth', 0.45, 0.08), i * 320);
        });
      }
    } catch {
      playTone(392.00, 'sawtooth', 0.25, 0.08);
      setTimeout(() => playTone(349.23, 'sawtooth', 0.25, 0.08), 220);
      setTimeout(() => playTone(293.66, 'sawtooth', 0.55, 0.08), 440);
    }
  },
  status: () => {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          playTone(600 + (i * 300), 'sine', 0.07, 0.04);
          playTone(1000 - (i * 150), 'triangle', 0.05, 0.03);
        }, i * 65);
    }
  },
  battleStart: () => {
    playTone(350, 'sawtooth', 0.1, 0.08);
    setTimeout(() => playTone(500, 'sawtooth', 0.1, 0.08), 85);
    setTimeout(() => playTone(700, 'sawtooth', 0.12, 0.08), 170);
    setTimeout(() => playTone(1000, 'square', 0.35, 0.06), 255);
  },
  flee: () => {
    playTone(400, 'triangle', 0.08, 0.06);
    setTimeout(() => playTone(250, 'triangle', 0.08, 0.06), 45);
    setTimeout(() => playTone(120, 'triangle', 0.25, 0.06), 90);
  },
  physicalMove: () => {
    playTone(120, 'sawtooth', 0.12, 0.12);
    playTone(85, 'square', 0.12, 0.1);
  },
  specialMove: () => {
    playTone(550, 'sine', 0.22, 0.08);
    playTone(750, 'sine', 0.22, 0.08);
    playTone(950, 'sine', 0.22, 0.08);
  },
  superEffective: () => {
    playTone(900, 'square', 0.15, 0.1);
    setTimeout(() => playTone(1300, 'square', 0.28, 0.1), 150);
  },
  notVeryEffective: () => {
    playTone(280, 'sine', 0.18, 0.1);
    setTimeout(() => playTone(180, 'sine', 0.25, 0.1), 150);
  },
  criticalHit: () => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(1400, now);
    osc1.frequency.exponentialRampToValueAtTime(3800, now + 0.12);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.35 * sfxVolume, now + 0.005);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc1.connect(gain1); gain1.connect(ctx.destination);
    osc1.start(now); osc1.stop(now + 0.22);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(110, now);
    osc2.frequency.exponentialRampToValueAtTime(35, now + 0.18);
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.45 * sfxVolume, now + 0.005);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc2.connect(gain2); gain2.connect(ctx.destination);
    osc2.start(now); osc2.stop(now + 0.22);

    playTone(2200, 'sawtooth', 0.06, 0.22);
  },
  statBoost: () => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.22);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18 * sfxVolume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.22);
  },
  statLower: () => {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.22);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18 * sfxVolume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.22);
  },
  statusBurn: () => {
    playTone(90, 'sawtooth', 0.1, 0.12);
    setTimeout(() => playTone(130, 'sawtooth', 0.1, 0.12), 40);
    setTimeout(() => playTone(45, 'sawtooth', 0.18, 0.12), 80);
  },
  statusPoison: () => {
    playTone(320, 'sine', 0.08, 0.1);
    setTimeout(() => playTone(270, 'sine', 0.08, 0.1), 80);
    setTimeout(() => playTone(220, 'sine', 0.08, 0.1), 160);
  },
  statusParalysis: () => {
    playTone(1600, 'square', 0.04, 0.1);
    setTimeout(() => playTone(2100, 'square', 0.04, 0.1), 40);
    setTimeout(() => playTone(900, 'square', 0.04, 0.1), 80);
  },
  statusFreeze: () => {
    playTone(1300, 'sine', 0.04, 0.1);
    setTimeout(() => playTone(1600, 'triangle', 0.12, 0.1), 40);
  },
  statusSleep: () => {
    playTone(380, 'sine', 0.28, 0.1);
    setTimeout(() => playTone(280, 'sine', 0.28, 0.1), 280);
  },
  playBGM: (theme: string) => {
    try {
      sounds.stopBGM();
      const ctx = getAudioContext();
      currentTheme = theme;
      
      let step = 0;
      
      // 4 Sophisticated, complicated, non-fastidious melodic tracks with rich multi-octave sequences & polyphony
      const trackSequences: Record<string, { bass: number[]; lead: number[]; speed: number }> = {
        route1: {
          bass: [130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63, 220.00, 196.00, 174.61, 164.81, 146.83, 130.81, 110.00, 123.47],
          lead: [261.63, 329.63, 392.00, 523.25, 493.88, 392.00, 329.63, 293.66, 349.23, 440.00, 523.25, 659.25, 587.33, 523.25, 440.00, 392.00],
          speed: 300
        },
        battle: {
          bass: [110.00, 110.00, 130.81, 123.47, 98.00, 98.00, 110.00, 130.81, 146.83, 130.81, 123.47, 110.00, 98.00, 92.50, 98.00, 110.00],
          lead: [220.00, 261.63, 329.63, 349.23, 440.00, 523.25, 440.00, 349.23, 329.63, 293.66, 261.63, 220.00, 196.00, 220.00, 261.63, 329.63],
          speed: 220
        },
        forest: {
          bass: [174.61, 174.61, 220.00, 220.00, 196.00, 196.00, 164.81, 164.81, 146.83, 146.83, 174.61, 174.61, 130.81, 130.81, 164.81, 196.00],
          lead: [349.23, 440.00, 523.25, 659.25, 587.33, 523.25, 440.00, 392.00, 329.63, 392.00, 440.00, 523.25, 493.88, 440.00, 392.00, 349.23],
          speed: 380
        },
        champion: {
          bass: [98.00, 110.00, 123.47, 130.81, 146.83, 164.81, 174.61, 196.00, 196.00, 174.61, 164.81, 146.83, 130.81, 123.47, 110.00, 98.00],
          lead: [392.00, 493.88, 587.33, 783.99, 659.25, 587.33, 493.88, 392.00, 440.00, 523.25, 659.25, 880.00, 783.99, 659.25, 523.25, 440.00],
          speed: 200
        }
      };

      const currentTrack = trackSequences[theme] || trackSequences.route1;
      let stepSpeed = currentTrack.speed / tempoMultiplier;

      bgmInterval = window.setInterval(() => {
        if (bgmVolume * bgmFadeMultiplier <= 0.01) return;
        const now = ctx.currentTime;
        const bassFreq = currentTrack.bass[step % currentTrack.bass.length];
        const leadFreq = currentTrack.lead[step % currentTrack.lead.length];

        // Layer 1: Sophisticated Bass / Rhythm Pulse
        const bassOsc = ctx.createOscillator();
        const bassFilter = ctx.createBiquadFilter();
        const bassGain = ctx.createGain();

        bassOsc.type = theme === 'battle' || theme === 'champion' ? 'sawtooth' : 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(theme === 'battle' ? 1400 : 600, now);
        bassFilter.frequency.exponentialRampToValueAtTime(200, now + 0.2);

        bassGain.gain.setValueAtTime(0, now);
        bassGain.gain.linearRampToValueAtTime(0.09 * bgmVolume * bgmFadeMultiplier, now + 0.02);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(ctx.destination);

        bassOsc.start(now);
        bassOsc.stop(now + 0.28);

        // Layer 2: Evolving Lead Melody / Harmony Arpeggio
        if (step % 2 === 0 || theme === 'champion') {
          const leadOsc = ctx.createOscillator();
          const leadFilter = ctx.createBiquadFilter();
          const leadGain = ctx.createGain();

          leadOsc.type = theme === 'forest' ? 'sine' : 'square';
          leadOsc.frequency.setValueAtTime(leadFreq, now);

          leadFilter.type = 'bandpass';
          leadFilter.frequency.setValueAtTime(2200, now);
          leadFilter.Q.setValueAtTime(8, now);

          leadGain.gain.setValueAtTime(0, now);
          leadGain.gain.linearRampToValueAtTime(0.05 * bgmVolume * bgmFadeMultiplier, now + 0.015);
          leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

          leadOsc.connect(leadFilter);
          leadFilter.connect(leadGain);
          leadGain.connect(ctx.destination);

          leadOsc.start(now);
          leadOsc.stop(now + 0.22);
        }

        step++;
      }, stepSpeed);
    } catch (e) {
      console.warn("BGM initialization failed:", e);
    }
  },
  fadeOutBGM: (onComplete?: () => void, duration: number = 2000) => {
    if (fadeIntervalId !== null) {
      window.clearInterval(fadeIntervalId);
      fadeIntervalId = null;
    }
    
    // If not playing BGM, complete immediately
    if (bgmInterval === null) {
      if (onComplete) onComplete();
      return;
    }

    const startVal = bgmFadeMultiplier;
    const stepTime = 50; // ms
    let elapsed = 0;
    
    fadeIntervalId = window.setInterval(() => {
      elapsed += stepTime;
      const progress = elapsed / duration;
      if (progress >= 1) {
        bgmFadeMultiplier = 0.0;
        sounds.stopBGM();
        if (onComplete) onComplete();
      } else {
        bgmFadeMultiplier = startVal * (1.0 - progress);
      }
    }, stepTime);
  },
  fadeInBGM: (theme: string, duration: number = 1500) => {
    if (fadeIntervalId !== null) {
      window.clearInterval(fadeIntervalId);
      fadeIntervalId = null;
    }
    
    bgmFadeMultiplier = 0.0;
    sounds.playBGM(theme);
    
    // playBGM clears BGM and resets multiplier, so override to start at 0
    bgmFadeMultiplier = 0.0;
    
    const stepTime = 50; // ms
    let elapsed = 0;
    
    fadeIntervalId = window.setInterval(() => {
      elapsed += stepTime;
      const progress = elapsed / duration;
      if (progress >= 1) {
        bgmFadeMultiplier = 1.0;
        if (fadeIntervalId !== null) {
          window.clearInterval(fadeIntervalId);
          fadeIntervalId = null;
        }
      } else {
        bgmFadeMultiplier = progress;
      }
    }, stepTime);
  },
  fadeOutAndTransition: (nextTheme: string | 'None', fadeOutDuration: number = 2000, fadeInDuration: number = 1500) => {
    sounds.fadeOutBGM(() => {
      if (nextTheme && nextTheme !== 'None') {
        sounds.fadeInBGM(nextTheme, fadeInDuration);
      }
    }, fadeOutDuration);
  },
  stopBGM: () => {
    if (fadeIntervalId !== null) {
      window.clearInterval(fadeIntervalId);
      fadeIntervalId = null;
    }
    bgmFadeMultiplier = 1.0;
    if (bgmInterval !== null) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
    currentTheme = null;
  },
  playMoveSound: (type: string, isSpecial: boolean) => {
    const ctx = getAudioContext();
    switch (type) {
      case 'fire':
        playTone(130, 'sawtooth', 0.35, 0.12);
        setTimeout(() => playTone(80, 'square', 0.25, 0.12), 80);
        break;
      case 'water':
        playTone(380, 'sine', 0.12, 0.1);
        setTimeout(() => playTone(540, 'sine', 0.12, 0.1), 40);
        setTimeout(() => playTone(250, 'sine', 0.22, 0.1), 80);
        break;
      case 'electric':
        playTone(1800, 'sawtooth', 0.06, 0.1);
        setTimeout(() => playTone(1300, 'square', 0.06, 0.1), 40);
        setTimeout(() => playTone(2200, 'sawtooth', 0.06, 0.1), 80);
        setTimeout(() => playTone(850, 'square', 0.12, 0.1), 120);
        break;
      case 'grass':
        playTone(280, 'triangle', 0.12, 0.1);
        setTimeout(() => playTone(360, 'triangle', 0.12, 0.1), 40);
        setTimeout(() => playTone(180, 'triangle', 0.22, 0.1), 80);
        break;
      case 'ice':
        playTone(1100, 'sine', 0.06, 0.1);
        setTimeout(() => playTone(1400, 'sine', 0.06, 0.1), 40);
        setTimeout(() => playTone(1700, 'sine', 0.12, 0.1), 80);
        break;
      case 'psychic':
        playTone(750, 'sine', 0.35, 0.1);
        setTimeout(() => playTone(1150, 'sine', 0.35, 0.1), 80);
        break;
      case 'fighting':
      case 'rock':
      case 'ground':
        playTone(90, 'square', 0.12, 0.22);
        setTimeout(() => playTone(45, 'sawtooth', 0.22, 0.22), 40);
        break;
      case 'poison':
      case 'bug':
        playTone(180, 'sawtooth', 0.12, 0.12);
        setTimeout(() => playTone(220, 'sawtooth', 0.12, 0.12), 40);
        setTimeout(() => playTone(130, 'sawtooth', 0.22, 0.12), 80);
        break;
      case 'flying':
        playTone(550, 'sine', 0.22, 0.1);
        setTimeout(() => playTone(350, 'sine', 0.32, 0.1), 80);
        break;
      case 'ghost':
      case 'dark':
        playTone(280, 'sine', 0.45, 0.1);
        setTimeout(() => playTone(220, 'sine', 0.45, 0.1), 80);
        break;
      case 'dragon':
        playTone(140, 'sawtooth', 0.35, 0.15);
        setTimeout(() => playTone(180, 'square', 0.35, 0.15), 80);
        break;
      case 'steel':
        playTone(750, 'square', 0.12, 0.1);
        setTimeout(() => playTone(550, 'square', 0.22, 0.1), 40);
        break;
      case 'fairy':
        playTone(1450, 'sine', 0.12, 0.1);
        setTimeout(() => playTone(1750, 'sine', 0.12, 0.1), 80);
        setTimeout(() => playTone(2050, 'sine', 0.22, 0.1), 160);
        break;
      default:
        if (isSpecial) {
          sounds.specialMove();
        } else {
          sounds.physicalMove();
        }
        break;
    }
  }
};
