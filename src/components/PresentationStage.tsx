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
  const speed = useGameStore((state) => state.speed);
  const darkMode = useGameStore((state) => state.darkMode);

  const [activeTokens, setActiveTokens] = useState<Token[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let mounted = true;
    const schedule = getDeliverySchedule(sequence, deliveryMode, speed);
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
  }, [sequence, deliveryMode, speed]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-12">
      <div className="h-8">
        {!isFinished && (
          <h2 className="text-xl font-medium text-slate-400 dark:text-slate-500 animate-pulse">
            Level {round - 2} (Sequence length: {round})
          </h2>
        )}
      </div>

      <div className="relative h-32 w-full flex items-center justify-center gap-4">
        {/* Background hue focus effect */}
        <AnimatePresence>
          {darkMode && activeTokens.length > 0 && (
            <motion.div
              // This transition controls how fast the entire background fades in/out when tokens appear/disappear
              // duration: 0.3 means it takes 0.3 seconds to show up or hide
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed inset-0 pointer-events-none z-[-1]"
            >
              <motion.div
                className="absolute inset-0 mix-blend-screen"
                // opacity array [min, max, min] controls the pulsing intensity
                // 0 means fully invisible, 1 means fully visible. 
                // Changing to [0.1, 0.9, 0.1] would make the pulse more extreme
                animate={{ opacity: [0.3, 0.9, 0.3] }}
                // duration: 3 means one full pulse cycle (0.3 -> 0.6 -> 0.3) takes 3 seconds
                // Lower duration (e.g., 1) = faster pulsing. Higher duration = slower pulsing.
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background: activeTokens.length > 0
                    // radial-gradient variables:
                    // 'transparent 25%' means the center 25% is completely clear (where the token sits)
                    // '150%' at the end controls how far out the color stretches (higher = wider spread)
                    ? `radial-gradient(circle at center, transparent 25%, ${activeTokens[0].color === 'red' ? '#ef4444' :
                      activeTokens[0].color === 'blue' ? '#3b82f6' :
                        activeTokens[0].color === 'green' ? '#22c55e' :
                          '#eab308'
                    } 150%)`
                    : 'transparent'
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {activeTokens.map((t) => (
            <motion.div
              key={t.id}
              initial={{ scale: 0.5, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative z-10"
            >
              <TokenView token={t} size="lg" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
