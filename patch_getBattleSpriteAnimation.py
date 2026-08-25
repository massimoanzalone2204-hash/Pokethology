import re

with open("src/App.tsx", "r") as f:
    text = f.read()

old_func = """  const getBattleSpriteAnimation = (animation: string | null, status: string | null) => {
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

new_func = """  const getBattleSpriteAnimation = (animation: string | null, status: string | null, statAnimation?: string | null) => {
    if (statAnimation === 'boost') {
        return { scale: [1, 1.15, 1], filter: ['brightness(1) drop-shadow(0 0 0 rgba(16,185,129,0))', 'brightness(1.5) sepia(1) hue-rotate(90deg) saturate(3) drop-shadow(0 0 40px rgba(16,185,129,1))', 'brightness(1)'] };
    }
    if (statAnimation === 'lower') {
        return { scale: [1, 0.9, 1], filter: ['brightness(1) drop-shadow(0 0 0 rgba(239,68,68,0))', 'brightness(0.7) sepia(1) hue-rotate(-50deg) saturate(5) drop-shadow(0 0 40px rgba(239,68,68,1))', 'brightness(1)'] };
    }

    switch (animation) {
      case 'faint': return { opacity: 0.5, scale: 0.5, filter: 'brightness(0.3) grayscale(100%)' };
      case 'attack_physical': return { scale: 1.05 };
      case 'attack_special': return { scale: 1.05 };
      case 'hit': return { scale: [1, 0.95, 1], filter: ['brightness(1)', 'brightness(2) invert(1)', 'brightness(1)'], x: [0, -15, 15, -10, 10, -5, 5, 0] };
      case 'hit_critical': return { scale: [1, 1.1, 1], filter: ['brightness(1)', 'brightness(2.5) sepia(1) hue-rotate(-50deg) saturate(3)', 'brightness(1)'], x: [0, -25, 25, -20, 20, -10, 10, 0] };
      case 'hit_status': return { scale: 1.02 };
      default: return { scale: 1, opacity: 1, rotate: 0, x: 0, filter: 'brightness(1)' };
    }
  };"""

text = text.replace(old_func, new_func)

old_opp_call = "animate={getBattleSpriteAnimation(defenderAnimation, opponentStatus)}"
new_opp_call = "animate={getBattleSpriteAnimation(defenderAnimation, opponentStatus, opponentStatAnimation)}"
text = text.replace(old_opp_call, new_opp_call)

old_player_call = "animate={getBattleSpriteAnimation(attackerAnimation, pokemonStatus)}"
new_player_call = "animate={getBattleSpriteAnimation(attackerAnimation, pokemonStatus, playerStatAnimation)}"
text = text.replace(old_player_call, new_player_call)


with open("src/App.tsx", "w") as f:
    f.write(text)
