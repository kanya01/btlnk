import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store';
import { TokenView } from './TokenView';
import type { Shape, Color, Token } from '../gameEngine';
import { motion } from 'framer-motion';
import { Delete, Check } from 'lucide-react';

const SHAPES: Shape[] = ['circle', 'square', 'triangle', 'star'];
const COLORS: Color[] = ['red', 'blue', 'green', 'yellow'];

// Generate a static palette for the input keyboard
const palette: Pick<Token, 'shape' | 'color'>[] = [];
SHAPES.forEach((s) => {
  COLORS.forEach((c) => {
    palette.push({ shape: s, color: c });
  });
});

export const RecallStage = () => {
  const { sequence, input, addInputToken, removeLastInput, submitRecall } = useGameStore();

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Backspace') {
      removeLastInput();
    } else if (e.key === 'Enter') {
      if (input.length === sequence.length) {
        submitRecall();
      }
    } else {
      // Map keys to tokens for desktop users. 
      // E.g., '1' to '4' for shape, 'q' to 'r' for color could work, but a 16-key layout is complex.
      // Let's rely primarily on tap, but allow basic key mapping if needed.
      // For now, simple backspace and enter support is good.
    }
  }, [removeLastInput, submitRecall, input.length, sequence.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="flex flex-col items-center h-full max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reproduce the sequence</h2>
        <p className="text-slate-500 dark:text-slate-400">
          {input.length} / {sequence.length} items entered
        </p>
      </div>

      {/* Input Display Area – content container, no glass */}
      <div className="flex gap-2 p-4 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 min-h-[100px] w-full justify-center items-center overflow-x-auto mb-8">
        {input.length === 0 ? (
          <span className="text-slate-300 dark:text-slate-500">Tap tokens below to build the sequence</span>
        ) : (
          input.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              layoutId={`input-${i}`}
            >
              <TokenView token={t} size="sm" />
            </motion.div>
          ))
        )}
        
        {/* Placeholder for next input */}
        {input.length < sequence.length && (
          <div className="w-10 h-10 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl animate-pulse" />
        )}
      </div>

      {/* Actions – these are actionable, so they get liquid glass */}
      <div className="flex justify-between w-full mb-8">
        <button
          onClick={removeLastInput}
          disabled={input.length === 0}
          className="liquid-glass flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-slate-600 dark:text-slate-300"
        >
          <Delete className="w-5 h-5" />
          Delete
        </button>
        
        <button
          onClick={submitRecall}
          disabled={input.length !== sequence.length}
          className="liquid-glass-primary flex items-center gap-2 px-8 py-3 rounded-2xl font-medium text-white"
        >
          <Check className="w-5 h-5" />
          Submit
        </button>
      </div>

      {/* Token Keyboard – content container, no glass */}
      <div className="grid grid-cols-4 gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 w-full">
        {palette.map((t, i) => (
          <div key={i} className="flex justify-center">
             <TokenView 
               token={t} 
               size="md" 
               interactive 
               onClick={() => addInputToken(t)} 
             />
          </div>
        ))}
      </div>
    </div>
  );
};
