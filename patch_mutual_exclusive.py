import re

with open("src/lib/sounds.ts", "r") as f:
    text = f.read()

old_shuffle = """  toggleShuffle: () => {
    const w = window as any;
    w.soundsYTShuffle = !w.soundsYTShuffle;
    return w.soundsYTShuffle;
  },"""

new_shuffle = """  toggleShuffle: () => {
    const w = window as any;
    w.soundsYTShuffle = !w.soundsYTShuffle;
    if (w.soundsYTShuffle) w.soundsYTLoop = false;
    return w.soundsYTShuffle;
  },"""

old_loop = """  toggleLoop: () => {
    const w = window as any;
    w.soundsYTLoop = !w.soundsYTLoop;
    return w.soundsYTLoop;
  },"""

new_loop = """  toggleLoop: () => {
    const w = window as any;
    w.soundsYTLoop = !w.soundsYTLoop;
    if (w.soundsYTLoop) w.soundsYTShuffle = false;
    return w.soundsYTLoop;
  },"""

text = text.replace(old_shuffle, new_shuffle)
text = text.replace(old_loop, new_loop)

with open("src/lib/sounds.ts", "w") as f:
    f.write(text)
