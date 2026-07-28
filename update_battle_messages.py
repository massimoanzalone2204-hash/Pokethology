import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Remove addFloatingText for non-damage strings in executeTurn
content = re.sub(r'addFloatingText\("HURT SELF!", \'status\', !isPlayer\);\n', '', content)
content = re.sub(r'addFloatingText\("MISSED!", \'status\', isPlayer\);\n', '', content)
content = re.sub(r'addFloatingText\("TRANSFORMED!", \'status\', !isPlayer\);\n', '', content)
content = re.sub(r'addFloatingText\("PROTECTED!", \'boost\', isPlayer\);\n', '', content)
content = re.sub(r'addFloatingText\("BLOCKED!", \'not-effective\', !isPlayer\);\n', '', content)
content = re.sub(r'addFloatingText\("SUBSTITUTE", \'boost\', isPlayer\);\n', '', content)
content = re.sub(r'addFloatingText\("MISSED!", \'not-effective\', isPlayer\);\n', '', content)
content = re.sub(r'addFloatingText\("CRITICAL!", \'damage\', isPlayer\);\n', '', content)
content = re.sub(r'addFloatingText\("SUPER EFFECTIVE!", \'effective\', isPlayer\);\n', '', content)
content = re.sub(r'addFloatingText\("NOT EFFECTIVE", \'not-effective\', isPlayer\);\n', '', content)
content = re.sub(r'addFloatingText\("NO EFFECT", \'not-effective\', isPlayer\);\n', '', content)
content = re.sub(r'addFloatingText\("BROKEN!", \'damage\', !isPlayer\);\n', '', content)

# Now, we also want to remove the setBattleMessage calls for CRITICAL and EFFECTIVE
# and replace them with a single combined message block.

# First, remove existing setBattleMessage calls and delays for CRITICAL, SUPER EFFECTIVE, NOT EFFECTIVE, NO EFFECT
# CRITICAL block
content = re.sub(r'setBattleMessage\({ text: "CRITICAL!", type: \'critical\' }\);\n\s*', '', content)

# SUPER EFFECTIVE block
content = re.sub(r'setBattleMessage\({ text: "SUPER EFFECTIVE!", type: \'effective\' }\);\n\s*', '', content)

# NOT EFFECTIVE block
content = re.sub(r'setBattleMessage\({ text: "NOT EFFECTIVE", type: \'status\' }\);\n\s*', '', content)

# NO EFFECT block
content = re.sub(r'setBattleMessage\({ text: "NO EFFECT", type: \'status\' }\);\n\s*', '', content)

# Let's write the combined block right after the effectiveness checks:
# We'll find `if (effectiveness === 0) {\n        log("It had no effect...", 'not-effective');\n      }`
# and append the combined message logic.

replacement = """      }
      
      // Unified aesthetic battle message for hits
      let hitMsg = "";
      let hitType = 'default';
      
      if (isCrit && effectiveness > 1) {
          hitMsg = "CRITICAL & EFFECTIVE!";
          hitType = 'critical';
      } else if (isCrit && effectiveness < 1 && effectiveness > 0) {
          hitMsg = "CRITICAL (RESISTED)";
          hitType = 'critical';
      } else if (isCrit) {
          hitMsg = "CRITICAL HIT!";
          hitType = 'critical';
      } else if (effectiveness > 1) {
          hitMsg = "SUPER EFFECTIVE!";
          hitType = 'effective';
      } else if (effectiveness < 1 && effectiveness > 0) {
          hitMsg = "NOT VERY EFFECTIVE...";
          hitType = 'status';
      } else if (effectiveness === 0) {
          hitMsg = "NO EFFECT!";
          hitType = 'status';
      }
      
      if (hitMsg) {
          setBattleMessage({ text: hitMsg, type: hitType as any });
          await battleDelay(1000);
          setBattleMessage(null);
      }
"""

content = re.sub(r'\}\n\s*let hpDamageRemaining = totalDamage;', replacement + '\n      let hpDamageRemaining = totalDamage;', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
