import { useEffect, useState } from 'react';
import { useGameStore } from '../store';
import { getDeliverySchedule } from "../gameEngine";
import type { Token } from '../gameEngine';
import { TokenView } from './TokenView';
import { motion, AnimatePresence } from 'framer-motion';

export const PresentationStage = () => {
  const sequence = useGameStore((state) => state.sequence);
  const deliveryMode = useGameStore((state) => state.deliveryMode);
  const round = useGameStore((state) => state.round);
  
  const [activeTokens, setActiveTokens] = useState<Token[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let mounted = true;
    const schedule = getDeliverySchedule(sequence, deliveryMode);
    let currentChunk = 0;

    const runSchedule = async () => {
      // Small pause before starting
      await new Promise(r => setTimeout(r, 500));
      if (!mounted) return;

      while (currentChunk < schedule.chunks.length) {
        setActiveTokens(schedule.chunks[currentChunk]);
        await new Promise(r => setTimeout(r, schedule.exposureMs));
        if (!mounted) return;

        setActiveTokens([]);
        if (schedule.intervalMs > 0 && currentChunk < schedule.chunks.length - 1) {
          await new Promise(r => setTimeout(r, schedule.intervalMs));
          if (!mounted) return;
        }

        currentChunk++;
      }

      setIsFinished(true);
      // Wait a moment then auto-advance to recall
      setTimeout(() => {
        if (mounted) {
          useGameStore.setState({ phase: 'recall' });
        }
      }, 300);
    };

    runSchedule();

    return () => {
      mounted = false;
    };
  }, [sequence, deliveryMode]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-12">
      <div className="h-8">
        {!isFinished && (
          <h2 className="text-xl font-medium text-slate-400 animate-pulse">
            Observe the sequence (N={round})
          </h2>
        )}
      </div>

      <div className="h-32 flex items-center justify-center gap-4">
        <AnimatePresence mode="popLayout">
          {activeTokens.map((t) => (
            <motion.div
              key={t.id}
              initial={{ scale: 0.5, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <TokenView token={t} size="lg" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
