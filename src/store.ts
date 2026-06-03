import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Token, Modality } from "./gameEngine";
import { generateSequence, validateRecall, calculateSynapseXP } from './gameEngine';
import { playSound } from './audio';

export type GamePhase = 'intro' | 'presentation' | 'recall' | 'result' | 'summary';

export interface RunRecord {
  id: string;
  sessionId: string;
  timestamp: number;
  span: number;
  deliveryMode: number;
  speed: number;
  avgReactionTime?: number;
  avgHesitation?: number;
  score?: number;
  modality?: Modality;
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
  easyMode: boolean;
  lastResult: boolean | null;
  presentationEndTime: number | null;
  inputTimestamps: number[];
  runMetrics: { reactionTimes: number[]; hesitations: number[] };
  modality: Modality;
  secondaryModeActive: boolean;
  secondaryLives: number;

  setDeliveryMode: (mode: number) => void;
  setSpeed: (speed: number) => void;
  toggleSound: () => void;
  toggleDarkMode: () => void;
  toggleEasyMode: () => void;
  startGame: () => void;
  startRound: () => void;
  markPresentationEnd: () => void;
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
      easyMode: false,
      lastResult: null,
      presentationEndTime: null,
      inputTimestamps: [],
      runMetrics: { reactionTimes: [], hesitations: [] },
      modality: 'shapes',
      secondaryModeActive: false,
      secondaryLives: 0,

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
      toggleEasyMode: () => set((state) => ({ easyMode: !state.easyMode })),

      startGame: () => {
        set({ phase: 'presentation', round: 3, bestSpan: 0, runMetrics: { reactionTimes: [], hesitations: [] }, modality: 'shapes', secondaryModeActive: false, secondaryLives: 0 });
        get().startRound();
      },

      startRound: () => {
        const { round, easyMode } = get();
        const newSequence = generateSequence(round, easyMode);
        set({
          phase: 'presentation',
          sequence: newSequence,
          input: [],
          presentationEndTime: null,
          inputTimestamps: [],
        });
      },

      markPresentationEnd: () => {
        set({ presentationEndTime: Date.now() });
      },

      addInputToken: (tokenData) => {
        const { input, sequence, soundEnabled, inputTimestamps } = get();
        if (input.length >= sequence.length) return;
        
        if (soundEnabled) playSound('tap');

        set({
          input: [...input, { ...tokenData, id: `input-${input.length}-${Date.now()}` }],
          inputTimestamps: [...inputTimestamps, Date.now()],
        });
      },

      removeLastInput: () => {
        const { input, inputTimestamps } = get();
        set({ 
          input: input.slice(0, -1),
          inputTimestamps: inputTimestamps.slice(0, -1)
        });
      },

      clearInput: () => {
        set({ input: [], inputTimestamps: [] });
      },

      submitRecall: () => {
        const { sequence, input, round, bestSpan, sessionId, deliveryMode, speed, history, soundEnabled, presentationEndTime, inputTimestamps, runMetrics, modality, secondaryModeActive, secondaryLives } = get();
        const isCorrect = validateRecall(sequence, input);

        let roundReactionTime: number | undefined;
        let roundHesitations: number[] = [];

        if (presentationEndTime && inputTimestamps.length > 0) {
          roundReactionTime = inputTimestamps[0] - presentationEndTime;
          for (let i = 1; i < inputTimestamps.length; i++) {
            roundHesitations.push(inputTimestamps[i] - inputTimestamps[i - 1]);
          }
        }

        const newRunMetrics = {
          reactionTimes: roundReactionTime !== undefined ? [...runMetrics.reactionTimes, roundReactionTime] : runMetrics.reactionTimes,
          hesitations: [...runMetrics.hesitations, ...roundHesitations]
        };

        if (isCorrect) {
          if (soundEnabled) playSound('correct');
          set({ 
            phase: 'result', 
            bestSpan: Math.max(bestSpan, round), 
            lastResult: true,
            runMetrics: newRunMetrics
          });
          
          set({ round: round + 1 });
          setTimeout(() => {
            get().startRound();
          }, 1000);
        } else {
          if (soundEnabled) playSound('wrong');
          const currentSpan = round > 3 ? round - 1 : 0;
          
          let avgReactionTime = 0;
          if (newRunMetrics.reactionTimes.length > 0) {
            avgReactionTime = newRunMetrics.reactionTimes.reduce((a, b) => a + b, 0) / newRunMetrics.reactionTimes.length;
          }

          let avgHesitation = 0;
          if (newRunMetrics.hesitations.length > 0) {
            avgHesitation = newRunMetrics.hesitations.reduce((a, b) => a + b, 0) / newRunMetrics.hesitations.length;
          }

          const score = calculateSynapseXP(
            currentSpan,
            speed,
            get().easyMode,
            deliveryMode,
            avgReactionTime,
            avgHesitation
          );

          const newRecord: RunRecord = {
            id: `run-${Date.now()}`,
            sessionId,
            timestamp: Date.now(),
            span: currentSpan,
            deliveryMode,
            speed,
            avgReactionTime,
            avgHesitation,
            score,
            modality
          };

          // Fire-and-forget telemetry push
          fetch('/api/telemetry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              span: currentSpan,
              deliveryMode,
              speed,
              easyMode: get().easyMode,
              avgReactionTime,
              avgHesitation,
              score,
              modality
            })
          }).catch(err => console.error("Telemetry error:", err));

          if (!secondaryModeActive) {
            // Switch modality for a second chance
            set({
              phase: 'result',
              bestSpan: Math.max(bestSpan, currentSpan),
              history: [...history, newRecord],
              lastResult: false,
              runMetrics: newRunMetrics,
              modality: modality === 'shapes' ? 'text' : 'shapes',
              secondaryModeActive: true,
              secondaryLives: 2,
              round: 3
            });

            setTimeout(() => {
              get().startRound();
            }, 2000);
          } else if (secondaryLives > 1) {
            // Try again in secondary modality
            set({
              phase: 'result',
              history: [...history, newRecord],
              lastResult: false,
              runMetrics: newRunMetrics,
              secondaryLives: secondaryLives - 1
            });

            setTimeout(() => {
              get().startRound();
            }, 2000);
          } else {
            // Final failure
            set({
              phase: 'result',
              bestSpan: Math.max(bestSpan, currentSpan),
              history: [...history, newRecord],
              lastResult: false,
              runMetrics: newRunMetrics
            });

            setTimeout(() => {
              get().goToSummary();
            }, 1500);
          }
        }
      },


      goToSummary: () => set({ phase: 'summary' }),
      
      resetToStart: () => set({ phase: 'intro', round: 3, input: [], sequence: [], runMetrics: { reactionTimes: [], hesitations: [] }, modality: 'shapes', secondaryModeActive: false, secondaryLives: 0 })
    }),
    {
      name: 'bottleneck-storage',
      // Only persist the history, sessionId, and sound pref
      partialize: (state) => ({ 
        history: state.history,
        sessionId: state.sessionId,
        soundEnabled: state.soundEnabled,
        darkMode: state.darkMode,
        easyMode: state.easyMode
      }),
    }
  )
);
