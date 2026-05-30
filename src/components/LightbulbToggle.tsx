import { useGameStore } from '../store';
import { motion, useReducedMotion } from 'framer-motion';

// Shared easing curve – a slow, organic ease
const smooth = { duration: 0.6, ease: [0.4, 0, 0.1, 1] as const };
const smoothSlow = { duration: 0.8, ease: [0.4, 0, 0.1, 1] as const };

export const LightbulbToggle = () => {
  const { darkMode, toggleDarkMode } = useGameStore();
  const prefersReduced = useReducedMotion();
  const isOn = !darkMode; // light mode = bulb is ON

  return (
    <button
      onClick={toggleDarkMode}
      className="lightbulb-toggle"
      title={darkMode ? 'Turn the light on' : 'Turn the light off'}
      aria-label={darkMode ? 'Enable light mode' : 'Enable dark mode'}
    >
      <motion.div
        className="lightbulb-wrapper"
        animate={{
          scale: isOn ? 1 : 0.94,
          rotate: isOn ? 0 : -4,
        }}
        transition={{
          type: 'spring',
          stiffness: 180,
          damping: 18,
          mass: 0.8,
        }}
      >
        {/* Glow layer behind the bulb */}
        <motion.div
          className="lightbulb-glow"
          animate={{
            opacity: isOn ? 0.85 : 0,
            scale: isOn ? 1 : 0.3,
          }}
          transition={smoothSlow}
        />

        {/* The bulb SVG */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="lightbulb-svg"
        >
          {/* Bulb glass */}
          <motion.path
            d="M12 3a6 6 0 0 0-4 10.5V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3.5A6 6 0 0 0 12 3Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              stroke: isOn ? 'var(--color-primary)' : 'var(--color-text-muted)',
              fill: isOn ? 'rgba(212, 119, 92, 0.18)' : 'rgba(138, 126, 118, 0.05)',
              fillOpacity: isOn ? 1 : 0.4,
            }}
            transition={smooth}
          />

          {/* Base line */}
          <motion.path
            d="M9 21h6"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{
              stroke: isOn ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}
            transition={smooth}
          />

          {/* Filament bands */}
          <motion.path
            d="M10 17h4"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{
              stroke: isOn ? 'var(--color-primary)' : 'var(--color-text-muted)',
              opacity: isOn ? 1 : 0.5,
            }}
            transition={smooth}
          />
          <motion.path
            d="M10 19h4"
            strokeWidth="1.5"
            strokeLinecap="round"
            animate={{
              stroke: isOn ? 'var(--color-primary)' : 'var(--color-text-muted)',
              opacity: isOn ? 1 : 0.5,
            }}
            transition={smooth}
          />

          {/* Light rays – stagger in smoothly when on */}
          {[
            { x1: 12, y1: 1, x2: 12, y2: 0 },
            { x1: 4.22, y1: 4.22, x2: 3.51, y2: 3.51 },
            { x1: 1, y1: 12, x2: 0, y2: 12 },
            { x1: 19.78, y1: 4.22, x2: 20.49, y2: 3.51 },
            { x1: 23, y1: 12, x2: 24, y2: 12 },
          ].map((ray, i) => (
            <motion.line
              key={i}
              x1={ray.x1}
              y1={ray.y1}
              x2={ray.x2}
              y2={ray.y2}
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{
                stroke: isOn ? 'var(--color-primary)' : 'var(--color-text-muted)',
                opacity: isOn ? 0.9 : 0,
                pathLength: isOn ? 1 : 0,
              }}
              transition={{
                duration: prefersReduced ? 0 : 0.5,
                ease: [0.4, 0, 0.1, 1] as const,
                delay: isOn ? 0.1 + i * 0.06 : 0,
                opacity: {
                  duration: prefersReduced ? 0 : 0.4,
                  delay: isOn ? 0.08 + i * 0.06 : 0,
                },
              }}
            />
          ))}
        </svg>
      </motion.div>
    </button>
  );
};
