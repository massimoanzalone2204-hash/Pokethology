import { Move } from '../types';

export const getMoveEffect = (move: Move) => {
  // Use real data from the move object
  const effect: any = {
    type: move.damage_class,
    power: move.power || 0,
    accuracy: move.accuracy || 100,
    pp: move.pp
  };

  if (move.stat_changes && move.stat_changes.length > 0) {
    effect.statChanges = move.stat_changes.map(sc => ({
      stat: sc.stat.name,
      stage: sc.change
    }));
  }

  if (move.meta && move.meta.ailment && move.meta.ailment.name !== 'none') {
    effect.statusEffect = move.meta.ailment.name.toUpperCase();
    effect.statusChance = (move.meta.ailment_chance || 100) / 100;
  }

  return effect;
};
