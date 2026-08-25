import re

with open("src/App.tsx", "r") as f:
    text = f.read()

# Update getBattleSpriteAnimation
old_anim_func = """  const getBattleSpriteAnimation = (animation: string | null, status: string | null) => {
    switch (animation) {
      case 'faint': return { opacity: 0.5, scale: 0.5 };
      case 'attack_physical': return { scale: 1.05 };
      case 'attack_special': return { scale: 1.05 };
      case 'hit': return { scale: 0.95 };
      case 'hit_critical': return { scale: 1.1 };
      case 'hit_status': return { scale: 1.02 };
      default: return { scale: 1, opacity: 1, rotate: 0 };
    }
  };"""

new_anim_func = """  const getBattleSpriteAnimation = (animation: string | null, status: string | null) => {
    switch (animation) {
      case 'faint': return { opacity: 0.5, scale: 0.5, filter: 'brightness(0.3) grayscale(100%)' };
      case 'attack_physical': return { scale: 1.05 };
      case 'attack_special': return { scale: 1.05 };
      case 'hit': return { scale: [1, 0.95, 1], filter: ['brightness(1)', 'brightness(2) invert(1)', 'brightness(1)'], x: [0, -15, 15, -10, 10, -5, 5, 0] };
      case 'hit_critical': return { scale: [1, 1.1, 1], filter: ['brightness(1)', 'brightness(2.5) sepia(1) hue-rotate(-50deg) saturate(3)', 'brightness(1)'], x: [0, -25, 25, -20, 20, -10, 10, 0] };
      case 'hit_status': return { scale: 1.02 };
      case 'boost': return { scale: [1, 1.15, 1], filter: ['brightness(1) drop-shadow(0 0 0 rgba(16,185,129,0))', 'brightness(1.5) sepia(1) hue-rotate(90deg) saturate(3) drop-shadow(0 0 40px rgba(16,185,129,1))', 'brightness(1)'] };
      case 'drop': return { scale: [1, 0.9, 1], filter: ['brightness(1) drop-shadow(0 0 0 rgba(239,68,68,0))', 'brightness(0.7) sepia(1) hue-rotate(-50deg) saturate(5) drop-shadow(0 0 40px rgba(239,68,68,1))', 'brightness(1)'] };
      default: return { scale: 1, opacity: 1, rotate: 0, x: 0, filter: 'brightness(1)' };
    }
  };"""

text = text.replace(old_anim_func, new_anim_func)

# Update state types
old_attacker_state = "const [attackerAnimation, setAttackerAnimation] = useState<'none' | 'attack_physical' | 'attack_special' | 'hit' | 'hit_critical' | 'hit_status' | 'faint'>('none');"
new_attacker_state = "const [attackerAnimation, setAttackerAnimation] = useState<'none' | 'attack_physical' | 'attack_special' | 'hit' | 'hit_critical' | 'hit_status' | 'faint' | 'boost' | 'drop'>('none');"

old_defender_state = "const [defenderAnimation, setDefenderAnimation] = useState<'none' | 'attack_physical' | 'attack_special' | 'hit' | 'hit_critical' | 'hit_status' | 'faint'>('none');"
new_defender_state = "const [defenderAnimation, setDefenderAnimation] = useState<'none' | 'attack_physical' | 'attack_special' | 'hit' | 'hit_critical' | 'hit_status' | 'faint' | 'boost' | 'drop'>('none');"

text = text.replace(old_attacker_state, new_attacker_state)
text = text.replace(old_defender_state, new_defender_state)


with open("src/App.tsx", "w") as f:
    f.write(text)
