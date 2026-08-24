import re

with open("src/components/AudioSettings.tsx", "r") as f:
    text = f.read()

# 1. Add Repeat to lucide-react imports if not there
if "Repeat" not in text:
    text = text.replace("import { Volume2, VolumeX, SkipForward, SkipBack, Pause, Play, Shuffle, Music, Disc } from 'lucide-react';", "import { Volume2, VolumeX, SkipForward, SkipBack, Pause, Play, Shuffle, Music, Disc, Repeat } from 'lucide-react';")

# 2. Add handleToggleLoop
loop_handler = """  const handleToggleShuffle = () => {
    sounds.toggleShuffle();
    setBgmState(sounds.getBGMState());
  };

  const handleToggleLoop = () => {
    sounds.toggleLoop();
    setBgmState(sounds.getBGMState());
  };"""
text = text.replace("  const handleToggleShuffle = () => {\n    sounds.toggleShuffle();\n    setBgmState(sounds.getBGMState());\n  };", loop_handler)

# 3. Add Repeat button
repeat_button = """              <button
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
              </button>"""
text = text.replace("""              <button
                onClick={handleToggleShuffle}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ml-1 sm:ml-2 ${bgmState?.isShuffle ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400'}`}
              >
                <Shuffle className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>""", repeat_button)

with open("src/components/AudioSettings.tsx", "w") as f:
    f.write(text)

