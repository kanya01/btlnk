import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Token } from "./gameEngine";
import { generateSequence, validateRecall } from './gameEngine';
import { playSound } from './audio';

export type GamePhase = 'intro' | 'presentation' | 'recall' | 'result' | 'summary';

export interface RunRecord {
  id: string;
  sessionId: string;
  timestamp: number;
  span: number;
  deliveryMode: number;
  speed: number;
}

interface GameState {
  sessionId: string;
  phase: GamePhase;
  round: number;
  sequence: Token[];
  input: Token[];
  deliveryMode: number;
  bestSpan: number;
  history: RunRecord[];
  soundEnabled: boolean;
  speed: number;
  darkMode: boolean;

  setDeliveryMode: (mode: number) => void;
  setSpeed: (speed: number) => void;
  toggleSound: () => void;
  toggleDarkMode: () => void;
  startGame: () => void;
  startRound: () => void;
  addInputToken: (token: Omit<Token, 'id'>) => void;
  removeLastInput: () => void;
  clearInput: () => void;
  submitRecall: () => void;
  goToSummary: () => void;
  resetToStart: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      sessionId: `session-${Date.now()}`,
      phase: 'intro',
      round: 3,
      sequence: [],
      input: [],
      deliveryMode: 0.5,
      bestSpan: 0,
      history: [],
      soundEnabled: false,
      speed: 1.0,
      darkMode: false,

      setDeliveryMode: (mode) => set({ deliveryMode: mode }),
      setSpeed: (speed) => set({ speed }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleDarkMode: () => set((state) => {
        const newDarkMode = !state.darkMode;
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { darkMode: newDarkMode };
      }),

      startGame: () => {
        set({ phase: 'presentation', round: 3, bestSpan: 0 });
        get().startRound();
      },

      startRound: () => {
        const { round } = get();
        const newSequence = generateSequence(round);
        set({
          phase: 'presentation',
          sequence: newSequence,
          input: [],
        });
      },

      addInputToken: (tokenData) => {
        const { input, sequence, soundEnabled } = get();
        if (input.length >= sequence.length) return;
        
        if (soundEnabled) playSound('tap');

        set({
          input: [...input, { ...tokenData, id: `input-${input.length}-${Date.now()}` }],
        });
      },

      removeLastInput: () => {
        const { input } = get();
        set({ input: input.slice(0, -1) });
      },

      clearInput: () => {
        set({ input: [] });
      },

      submitRecall: () => {
        const { sequence, input, round, bestSpan, sessionId, deliveryMode, speed, history, soundEnabled } = get();
        const isCorrect = validateRecall(sequence, input);

        if (isCorrect) {
          if (soundEnabled) playSound('correct');
          set({ phase: 'result', bestSpan: Math.max(bestSpan, round) });
          
          set({ round: round + 1 });
          setTimeout(() => {
            get().startRound();
          }, 1000);
        } else {
          if (soundEnabled) playSound('wrong');
          const currentSpan = Math.max(0, round - 1);
          const newRecord: RunRecord = {
            id: `run-${Date.now()}`,
            sessionId,
            timestamp: Date.now(),
            span: currentSpan,
            deliveryMode,
            speed,
          };

          set({
            phase: 'result',
            bestSpan: Math.max(bestSpan, currentSpan),
            history: [...history, newRecord]
          });

          setTimeout(() => {
            get().goToSummary();
          }, 1500);
        }
      },

      goToSummary: () => set({ phase: 'summary' }),
      
      resetToStart: () => set({ phase: 'intro', round: 3, input: [], sequence: [] })
    }),
    {
      name: 'bottleneck-storage',
      // Only persist the history, sessionId, and sound pref
      partialize: (state) => ({ 
        history: state.history,
        sessionId: state.sessionId,
        soundEnabled: state.soundEnabled,
        darkMode: state.darkMode
      }),
    }
  )
);
