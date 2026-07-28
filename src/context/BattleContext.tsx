import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Pokemon, Move, LogEntry } from '../types';

type BattleState = {
  pokemonHP: number;
  opponentHP: number;
  battleLog: (LogEntry & { turn?: number })[];
  turn: 'player' | 'opponent' | null;
  isBattling: boolean;
  // ... add other battle state
};

type BattleAction = 
  | { type: 'SET_HP'; target: 'player' | 'opponent'; value: number }
  | { type: 'ADD_LOG'; entry: LogEntry & { turn?: number } }
  | { type: 'SET_TURN'; turn: 'player' | 'opponent' | null }
  | { type: 'SET_BATTLING'; isBattling: boolean };

const initialState: BattleState = {
  pokemonHP: 100,
  opponentHP: 100,
  battleLog: [],
  turn: null,
  isBattling: false,
};

function battleReducer(state: BattleState, action: BattleAction): BattleState {
  switch (action.type) {
    case 'SET_HP':
      return { ...state, [action.target === 'player' ? 'pokemonHP' : 'opponentHP']: action.value };
    case 'ADD_LOG':
      return { ...state, battleLog: [...state.battleLog, action.entry].slice(-50) };
    case 'SET_TURN':
      return { ...state, turn: action.turn };
    case 'SET_BATTLING':
      return { ...state, isBattling: action.isBattling };
    default:
      return state;
  }
}

const BattleContext = createContext<{ state: BattleState; dispatch: React.Dispatch<BattleAction> } | undefined>(undefined);

export function BattleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(battleReducer, initialState);
  return <BattleContext.Provider value={{ state, dispatch }}>{children}</BattleContext.Provider>;
}

export function useBattle() {
  const context = useContext(BattleContext);
  if (!context) throw new Error('useBattle must be used within a BattleProvider');
  return context;
}
