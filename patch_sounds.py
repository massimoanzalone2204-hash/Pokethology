import re

with open("src/lib/sounds.ts", "r") as f:
    text = f.read()

# 1. Modify stopBGM to pauseBGM for the toggle
text = text.replace("toggleBGM: () => {\n    if (sounds.isBGMPlaying()) {\n      sounds.stopBGM();\n      return false;\n    } else {\n      sounds.playBGM(currentTheme || 'route1');\n      return true;\n    }", "toggleBGM: () => {\n    if (sounds.isBGMPlaying()) {\n      sounds.pauseBGM();\n      return false;\n    } else {\n      sounds.playBGM(currentTheme || 'route1');\n      return true;\n    }")

# 2. Add pauseBGM
pause_bgm_code = """  pauseBGM: () => {
    const w = window as any;
    if (w.soundsYTPlayer && typeof w.soundsYTPlayer.pauseVideo === 'function') {
      w.soundsYTPlayer.pauseVideo();
    }
  },
  stopBGM"""
text = text.replace("  stopBGM", pause_bgm_code)

# 3. Add toggleLoop and isLoopEnabled near toggleShuffle
loop_code = """  toggleShuffle: () => {
    const w = window as any;
    w.soundsYTShuffle = !w.soundsYTShuffle;
    return w.soundsYTShuffle;
  },
  toggleLoop: () => {
    const w = window as any;
    w.soundsYTLoop = !w.soundsYTLoop;
    return w.soundsYTLoop;
  },
  isShuffleEnabled: () => {
    const w = window as any;
    return !!w.soundsYTShuffle;
  },
  isLoopEnabled: () => {
    const w = window as any;
    return !!w.soundsYTLoop;
  },"""
text = text.replace("  toggleShuffle: () => {\n    const w = window as any;\n    w.soundsYTShuffle = !w.soundsYTShuffle;\n    return w.soundsYTShuffle;\n  },\n  isShuffleEnabled: () => {\n    const w = window as any;\n    return !!w.soundsYTShuffle;\n  },", loop_code)

# 4. Modify onStateChange
on_state_change_old = """          'onStateChange': (event: any) => {
            if (event.data === 0) { // ENDED
              sounds.playNextBGM();
            }
          }"""
on_state_change_new = """          'onStateChange': (event: any) => {
            if (event.data === 0) { // ENDED
              const w = window as any;
              if (w.soundsYTLoop) {
                w.soundsYTPlayer.seekTo(0);
                w.soundsYTPlayer.playVideo();
              } else {
                sounds.playNextBGM();
              }
            }
          }"""
text = text.replace(on_state_change_old, on_state_change_new)

# 5. In getBGMState, include isLoop
get_bgm_state_old = """         isPlaying: w.soundsYTPlayer.getPlayerState() === 1,
         isShuffle: !!w.soundsYTShuffle
      };"""
get_bgm_state_new = """         isPlaying: w.soundsYTPlayer.getPlayerState() === 1,
         isShuffle: !!w.soundsYTShuffle,
         isLoop: !!w.soundsYTLoop
      };"""
text = text.replace(get_bgm_state_old, get_bgm_state_new)


with open("src/lib/sounds.ts", "w") as f:
    f.write(text)

