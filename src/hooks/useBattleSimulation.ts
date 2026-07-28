import { useReducer } from 'react';
import { Pokemon, Move, LogEntry } from '../types';

type BattleState = {
  pokemonHP: number;
  opponentHP: number;
  battleLog: (LogEntry & { turn?: number })[];
  turn: 'player' | 'opponent' | null;
  isBattling: boolean;
  pokemonMaxHP: number;
  opponentMaxHP: number;
  pokemonStatus: string | null;
  opponentStatus: string | null;
  pokemonFlinched: boolean;
  opponentFlinched: boolean;
  playerStatStages: Record<string, number>;
  opponentStatStages: Record<string, number>;
};

type BattleAction = 
  | { type: 'SET_HP'; target: 'player' | 'opponent'; value: number }
  | { type: 'ADD_LOG'; entry: LogEntry & { turn?: number } }
  | { type: 'SET_TURN'; turn: 'player' | 'opponent' | null }
  | { type: 'SET_BATTLING'; isBattling: boolean }
  | { type: 'RESET'; pokemonMaxHP: number; opponentMaxHP: number };

const initialState: BattleState = {
  pokemonHP: 100,
  opponentHP: 100,
  battleLog: [],
  turn: 'player',
  isBattling: false,
  pokemonMaxHP: 100,
  opponentMaxHP: 100,
  pokemonStatus: null,
  opponentStatus: null,
  pokemonFlinched: false,
  opponentFlinched: false,
  playerStatStages: {},
  opponentStatStages: {},
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
    case 'RESET':
      return { ...initialState, pokemonHP: action.pokemonMaxHP, opponentHP: action.opponentMaxHP, pokemonMaxHP: action.pokemonMaxHP, opponentMaxHP: action.opponentMaxHP };
    default:
      return state;
  }
}

export function useBattleSimulation() {
  const [state, dispatch] = useReducer(battleReducer, initialState);
  return { state, dispatch };
}
