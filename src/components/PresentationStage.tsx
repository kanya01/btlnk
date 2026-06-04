import { useEffect, useState } from 'react';
import { useGameStore } from '../store';
import { getDeliverySchedule } from "../gameEngine";
import type { Token } from '../gameEngine';
import { TokenView } from './TokenView';
import { motion, AnimatePresence } from 'framer-motion';

// Maps a token's color to the glow hue used by the pulsing background effect.
const TOKEN_GLOW: Record<Token['color'], string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
};

export const PresentationStage = () => {
  const sequence = useGameStore((state) => state.sequence);
  const deliveryMode = useGameStore((state) => state.deliveryMode);
  const round = useGameStore((state) => state.round);
  const speed = useGameStore((state) => state.speed);
  const darkMode = useGameStore((state) => state.darkMode);

  const [activeTokens, setActiveTokens] = useState<Token[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  // The glow keeps the last shown token's hue so it stays steady through the
  // brief gaps between chunks instead of blinking on/off (which looked choppy).
  const [glowColor, setGlowColor] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const schedule = getDeliverySchedule(sequence, deliveryMode, speed);
    let currentChunk = 0;

    const runSchedule = async () => {
      // Small pause before starting
      await new Promise(r => setTimeout(r, 500));
      if (!mounted) return;

      while (currentChunk < schedule.chunks.length) {
        const chunk = schedule.chunks[currentChunk];
        setActiveTokens(chunk);
        if (chunk[0]) setGlowColor(TOKEN_GLOW[chunk[0].color]);
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
          useGameStore.getState().markPresentationEnd();
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
    <div className="flex flex-col items-center justify-center h-full space-y-10 px-2">
      <div className="h-8">
        {!isFinished && (
          <h2 className="text-xl font-medium text-slate-400 dark:text-slate-500 animate-pulse">
            Level {round - 2} (Sequence length: {round})
          </h2>
        )}
      </div>

      <div className="relative min-h-32 w-full flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {/* Ambient hue: a soft, slow glow behind the tokens that picks up the
            current token's color. Kept deliberately subtle so it reads as background.
            It sits behind the tokens (z-10) but in front of the page background.
            NOTE: must NOT use a negative z-index or `fixed` here — a negative z-index
            renders it underneath the opaque page background, and `fixed` gets trapped by
            framer-motion's transformed ancestor. Both made the effect invisible. */}
        <AnimatePresence>
          {glowColor && !isFinished && (
            <motion.div
              // One steady layer for the whole presentation; the inner div just
              // breathes opacity. Fades gently in at the start and out at the end.
              initial={{ opacity: 0 }}
              // Gentle pulse, low max so it stays in the background and isn't distracting.
              // Light mode goes a touch lighter since `multiply` reads stronger on white.
              animate={{ opacity: darkMode ? [0.1, 0.28, 0.1] : [0.06, 0.16, 0.06] }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              }}
              // Large soft layer centered on the token row.
              // On dark backgrounds `screen` lightens into a glow; on light backgrounds
              // `multiply` lays down a soft tint (screen would be invisible on white).
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] pointer-events-none z-0 ${
                darkMode ? 'mix-blend-screen' : 'mix-blend-multiply'
              }`}
              style={{
                // Color at the center (around the tokens) fading out by ~50% of the
                // radius. Raise the 50% to spread wider, lower it to tighten the glow.
                background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 50%)`,
              }}
            />
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
