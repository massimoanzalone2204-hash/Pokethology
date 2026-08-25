import re

with open("src/App.tsx", "r") as f:
    text = f.read()

old_func = """  const getBattleSpriteTransition = (animation: string | null): any => ({
    type: 'tween',
    duration: (enableAnimations && animation !== 'none' && animation !== null) ? 0.2 : 0, 
  });"""

new_func = """  const getBattleSpriteTransition = (animation: string | null, statAnimation?: string | null): any => ({
    type: 'tween',
    duration: (enableAnimations && ((animation !== 'none' && animation !== null) || (statAnimation !== 'none' && statAnimation !== null))) ? 0.6 : 0, 
  });"""

text = text.replace(old_func, new_func)

old_opp_call = "transition={getBattleSpriteTransition(defenderAnimation)}"
new_opp_call = "transition={getBattleSpriteTransition(defenderAnimation, opponentStatAnimation)}"
text = text.replace(old_opp_call, new_opp_call)

old_player_call = "transition={getBattleSpriteTransition(attackerAnimation)}"
new_player_call = "transition={getBattleSpriteTransition(attackerAnimation, playerStatAnimation)}"
text = text.replace(old_player_call, new_player_call)

with open("src/App.tsx", "w") as f:
    f.write(text)
