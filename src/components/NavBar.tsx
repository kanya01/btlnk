import { motion } from 'framer-motion';
import { Play, FlaskConical, LineChart } from 'lucide-react';
import { useGameStore } from '../store';
import type { GamePhase } from '../store';

type TabId = 'play' | 'science' | 'stats';

const TABS: { id: TabId; label: string; icon: typeof Play }[] = [
  { id: 'play', label: 'Play', icon: Play },
  { id: 'science', label: 'Science', icon: FlaskConical },
  { id: 'stats', label: 'Stats', icon: LineChart },
];

// Phases where the dock is visible — hidden mid-game so nothing competes
// with the memorise/recall loop.
const DOCK_PHASES: GamePhase[] = ['intro', 'summary', 'about', 'stats'];

const activeTabFor = (phase: GamePhase): TabId | null => {
  if (phase === 'intro') return 'play';
  if (phase === 'about') return 'science';
  if (phase === 'stats' || phase === 'summary') return 'stats';
  return null;
};

export const NavBar = () => {
  const phase = useGameStore((state) => state.phase);
  const { resetToStart, goToAbout, goToStats } = useGameStore();

  if (!DOCK_PHASES.includes(phase)) return null;

  const active = activeTabFor(phase);

  const navigate = (tab: TabId) => {
    if (tab === active && phase !== 'summary') return;
    if (tab === 'play') resetToStart();
    else if (tab === 'science') goToAbout();
    else goToStats();
  };

  return (
    <>
      <div className="dock-fade" aria-hidden />
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.8, delay: 0.15 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40"
        aria-label="Main navigation"
      >
        <div className="nav-dock flex items-center gap-1 p-1.5 rounded-full">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => navigate(id)}
                className={`relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: 'spring', bounce: 0.22, duration: 0.55 }}
                    className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/30"
                  />
                )}
                <Icon className="relative z-10 w-4 h-4" />
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
};
