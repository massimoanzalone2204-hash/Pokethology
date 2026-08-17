import React, { useState } from 'react';
import { Move } from '../types';
import { MoveModal } from './MoveModal';
import { playHaptic } from '../lib/utils';

interface CombatMoveActionProps {
  selectedMoves: Move[];
  handlePlayerMove: (move: Move) => void;
  isLightMode: boolean;
  typeColors: Record<string, string>;
}

export const CombatMoveAction: React.FC<CombatMoveActionProps> = ({ selectedMoves, handlePlayerMove, isLightMode, typeColors }) => {
  const [isCombatMoveModalOpen, setIsCombatMoveModalOpen] = useState(false);
  return (
    <div className="relative z-10">
      <button 
        onClick={() => {
          playHaptic('selection');
          setIsCombatMoveModalOpen(true);
        }}
        className="w-full py-4 bg-slate-900 border border-cyan-500/50 text-cyan-300 rounded-xl font-hud text-sm uppercase hover:bg-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
      >
        Select Move ({selectedMoves.length})
      </button>
      <MoveModal 
        isOpen={isCombatMoveModalOpen} 
        onClose={() => setIsCombatMoveModalOpen(false)} 
        moves={selectedMoves} 
        onMoveClick={(move) => {
          playHaptic('medium');
          handlePlayerMove(move);
          setIsCombatMoveModalOpen(false);
        }}
        isLightMode={isLightMode}
        typeColors={typeColors}
      />
    </div>
  );
};
