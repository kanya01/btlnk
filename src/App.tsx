import { useGameStore } from './store';
import { Brain, Play, RotateCcw, Volume2, VolumeX, Check, Palette, HelpCircle } from 'lucide-react';
import { LightbulbToggle } from './components/LightbulbToggle';
import { PresentationStage } from './components/PresentationStage';
import { RecallStage } from './components/RecallStage';
import { DeliverySlider } from './components/DeliverySlider';
import { SpeedSlider } from './components/SpeedSlider';
import { HistoryChart } from './components/HistoryChart';
import { AboutStage } from './components/AboutStage';
import { motion, AnimatePresence } from 'framer-motion';

const IntroStage = () => {
  const { startGame, deliveryMode, setDeliveryMode, speed, setSpeed, easyMode, toggleEasyMode } = useGameStore();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center h-full overflow-y-auto py-8 px-4 scrollbar-hide"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <Brain className="w-14 h-14 mx-auto mb-5 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Bottleneck</h1>
        <p className="text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Test your working memory. You'll see a sequence of coloured shapes — remember them, then recall the exact order. Each correct round adds one more item. If you miss, you'll get a second chance with text instead of shapes!
        </p>
      </div>

      {/* How it works */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="w-full max-w-md mb-6"
      >
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">How it works</h2>
          <div className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <div className="flex gap-3 items-start">
              <span className="text-base mt-0.5 shrink-0">👀</span>
              <span><strong className="text-slate-700 dark:text-slate-300">Watch</strong> — shapes appear on screen. Memorise their colour, shape, and order.</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-base mt-0.5 shrink-0">🧠</span>
              <span><strong className="text-slate-700 dark:text-slate-300">Recall</strong> — tap the shapes back in the exact sequence you saw.</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-base mt-0.5 shrink-0">📈</span>
              <span><strong className="text-slate-700 dark:text-slate-300">Progress</strong> — get it right and the next round adds one more item.</span>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-base mt-0.5 shrink-0">🔄</span>
              <span><strong className="text-slate-700 dark:text-slate-300">Second Chance</strong> — if you slip up, you'll get a retry using a different modality (like text instead of shapes) to see how your brain adapts!</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recall Quotient */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.4 }}
        className="w-full max-w-md mb-6"
      >
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Recall Quotient (RQ)</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            This measures your brain's "RAM" — how much information you can juggle in your mind at once. You get a much higher score for remembering more items, recalling them quickly, and playing on harder settings.
          </p>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="w-full max-w-md space-y-4 mb-8"
      >
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider px-1">Preferences</h2>

        {/* Delivery Mode */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Delivery Mode</span>
            <span className="text-xs font-mono text-primary tabular-nums">{deliveryMode.toFixed(1)}</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            Controls how items are shown to you. <strong className="text-slate-500 dark:text-slate-400">All at once</strong> flashes every item simultaneously. <strong className="text-slate-500 dark:text-slate-400">Bit by bit</strong> reveals them one at a time. The total study time stays the same — only the grouping changes.
          </p>
          <div className="flex justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500">
            <span>All at once</span>
            <span>Bit by bit</span>
          </div>
          <input 
            type="range" 
            min="0" max="1" step="0.01"
            value={deliveryMode}
            onChange={(e) => setDeliveryMode(parseFloat(e.target.value))}
            className="liquid-slider"
            aria-label="Delivery Mode"
          />
        </div>

        {/* Speed */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Speed</span>
            <span className="text-xs font-mono text-primary tabular-nums">{speed.toFixed(2)}×</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            How fast the items flash. Higher speed means less time to study each item. Start slow if you're new.
          </p>
          <div className="flex justify-between text-[11px] font-medium text-slate-400 dark:text-slate-500">
            <span>Slow (0.5×)</span>
            <span>Fast (2.0×)</span>
          </div>
          <input 
            type="range" 
            min="0.5" max="2.0" step="0.01"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="liquid-slider"
            aria-label="Speed"
          />
        </div>

        {/* Easy Mode Toggle */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Easy Mode</span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed pr-4">
                Colour only — all shapes become circles so you only need to remember colours.
              </p>
            </div>
            <button
              onClick={toggleEasyMode}
              className={`relative w-12 h-7 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ${
                easyMode 
                  ? 'bg-primary shadow-md shadow-primary/25' 
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
              aria-label="Toggle Easy Mode"
            >
              <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                easyMode ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Start Button */}
      <motion.button 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        onClick={startGame}
        className="liquid-glass-primary flex items-center gap-2.5 px-10 py-4 rounded-2xl font-medium text-lg text-white mb-8"
      >
        <Play className="w-5 h-5" />
        Begin
      </motion.button>
    </motion.div>
  );
};

const ResultStage = () => {
  const lastResult = useGameStore((state) => state.lastResult);
  const secondaryModeActive = useGameStore((state) => state.secondaryModeActive);
  const secondaryLives = useGameStore((state) => state.secondaryLives);
  
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center h-full"
    >
      {lastResult ? (
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-500/10 blur-3xl rounded-full w-64 h-64 animate-pulse" />
          <div className="relative bg-emerald-500 text-white p-8 rounded-full shadow-lg shadow-emerald-500/25">
            <Check className="w-24 h-24" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">nope!</h2>
          {secondaryModeActive && secondaryLives > 0 && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-primary font-medium mt-4"
            >
              Second Chance! Switching modality...
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  );
};

const SummaryStage = () => {
  const { bestSpan, resetToStart, startGame, history, sessionId, goToAbout } = useGameStore();
  
  const currentSessionRuns = history.filter(h => h.sessionId === sessionId);
  const currentRun = currentSessionRuns.length > 0 ? currentSessionRuns[currentSessionRuns.length - 1] : undefined;
  const previousRun = currentSessionRuns.length > 1 ? currentSessionRuns[currentSessionRuns.length - 2] : undefined;
  const currentSpan = currentRun ? currentRun.span : 0;
  const score = currentRun?.score || 0;

  let emoji = currentSpan < 3 ? "😭" : "🎉";
  let message = currentSpan < 3 ? "Lock in, don't go out like that" : "Good job👌🏿";
  let dataFeedback = "";

  if (currentRun && currentRun.avgReactionTime !== undefined) {
    const rTime = currentRun.avgReactionTime;
    const hes = currentRun.avgHesitation || 0;
    
    const isFast = rTime < 1500 && hes < 800;
    const isSlow = rTime > 2500 || hes > 1200;
    const isAccurate = currentSpan >= 4;

    if (isAccurate && isSlow) {
      emoji = "🧘🏿";
      message = "Methodical and accurate. You found your cognitive limit!";
    } else if (isAccurate && isFast) {
      emoji = "⚡";
      message = "Lightning fast and razor sharp. Incredible run!";
    } else if (!isAccurate && isFast) {
      emoji = "🏃🏿💨";
      message = "You rushed it! Take your time to process the sequence.";
    } else if (!isAccurate && isSlow) {
      emoji = "🐌";
      message = "Hesitated and still missed. Let's focus on the patterns.";
    }

    if (currentSessionRuns.length >= 3) {
      const recentFails = currentSessionRuns.slice(-3).every(run => run.span < 3);
      if (recentFails) {
        emoji = "🌱";
        message = "There's no single 'right' way. Take your time, experiment with different settings, and find what works for you. Think about how you think!";
      }
    }
  }

  if (previousRun && currentRun) {
    if (previousRun.deliveryMode !== currentRun.deliveryMode) {
      const prevMode = previousRun.deliveryMode > 0.5 ? "Bit by bit" : "All at once";
      const currMode = currentRun.deliveryMode > 0.5 ? "Bit by bit" : "All at once";
      
      if (prevMode !== currMode) {
        const spanDiff = currentRun.span - previousRun.span;
        if (spanDiff > 0) {
          const improvement = Math.round((spanDiff / Math.max(1, previousRun.span)) * 100);
          dataFeedback = `Switching your strategy from '${prevMode}' to '${currMode}' expanded your memory span by ${spanDiff} items—a massive ${improvement}% boost in retention!`;
        } else if (spanDiff < 0) {
          dataFeedback = `Switching to '${currMode}' dropped your span by ${Math.abs(spanDiff)} items. Maybe '${prevMode}' works better for your brain!`;
        }
      }
    } else if (previousRun.speed !== currentRun.speed) {
      const spanDiff = currentRun.span - previousRun.span;
      if (spanDiff > 0) {
        dataFeedback = `Changing your speed helped you remember ${spanDiff} more items!`;
      }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full space-y-8 max-w-md mx-auto text-center px-4 overflow-y-auto py-8 scrollbar-hide"
    >
      <div className="space-y-2 mt-8">
        <span className="text-4xl mb-4 block">
          {emoji}
        </span>
        <h2 className="text-2xl font-medium text-slate-800 dark:text-slate-200 px-4">
          {message}
        </h2>
        {dataFeedback && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 px-4 py-3 bg-primary/10 dark:bg-primary/20 rounded-2xl border border-primary/20"
          >
            <p className="text-sm font-medium text-primary leading-relaxed">
              💡 {dataFeedback}
            </p>
          </motion.div>
        )}
        <div className="py-4">
          <span className="text-7xl font-bold text-primary mb-2 block">{currentSpan}</span>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Items remembered</p>
        </div>

        {score > 0 && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="bg-primary/10 dark:bg-primary/20 text-primary px-6 py-3 rounded-2xl inline-block mb-4"
          >
            <span className="text-2xl font-bold block">+{score.toLocaleString()}</span>
            <div className="flex items-center justify-center gap-1 opacity-80 mt-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Recall Quotient (RQ)</span>
              <div className="group relative flex items-center justify-center cursor-help">
                <HelpCircle className="w-3.5 h-3.5" />
                <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2.5 bg-slate-800 text-white text-[11px] rounded-lg shadow-xl z-10 font-normal normal-case tracking-normal text-left pointer-events-none">
                  This measures how much information your brain can juggle at once. You score higher for remembering more items, doing it quickly, and using harder settings.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {bestSpan > currentSpan && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Your all-time best is {bestSpan}</p>
        )}

        <div className="pt-2 pb-2">
          <button
            onClick={goToAbout}
            className="group flex items-center justify-center gap-2 mx-auto text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all duration-300 ease-out bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-5 py-2.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
          >
            <span className="relative flex h-2.5 w-2.5 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary/60"></span>
            </span>
            What does this actually mean?
          </button>
        </div>
      </div>

      <div className="w-full space-y-6 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <DeliverySlider />
        <SpeedSlider />
      </div>
      
      <HistoryChart />

      <div className="space-y-4 w-full pt-4 pb-8">
        <p className="text-slate-600 dark:text-slate-300 font-medium">Would you like to try again?</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={startGame}
            className="liquid-glass-primary flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-medium flex-1 text-white"
          >
            <Play className="w-5 h-5" />
            Try Again
          </button>
          <button 
            onClick={resetToStart}
            className="liquid-glass flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium text-slate-600 dark:text-slate-300"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

function App() {
  const phase = useGameStore((state) => state.phase);
  const { soundEnabled, toggleSound, darkMode, easyMode, toggleEasyMode } = useGameStore();

  return (
    <div className={`min-h-screen font-sans selection:bg-primary/20 overflow-hidden ${darkMode ? 'dark bg-[#0e0e0e] text-slate-100' : 'bg-[#faf8f6] text-slate-900'}`}>
      <main className="container mx-auto h-screen p-4 sm:p-8 flex flex-col relative">
        <header className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 flex gap-3">
          <button 
            onClick={toggleEasyMode}
            className={`liquid-glass p-3 rounded-full text-slate-600 dark:text-slate-300 ${easyMode ? 'liquid-glass-active' : ''}`}
            title={easyMode ? "Disable easy mode (color only)" : "Enable easy mode (color only)"}
          >
            <Palette className="w-5 h-5" />
          </button>
          <LightbulbToggle />
          <button 
            onClick={toggleSound}
            className="liquid-glass p-3 rounded-full text-slate-600 dark:text-slate-300"
            title={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </header>
        
        <div className="flex-1 relative mt-16 sm:mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              {phase === 'intro' && <IntroStage />}
              {phase === 'presentation' && <PresentationStage />}
              {phase === 'recall' && <RecallStage />}
              {phase === 'result' && <ResultStage />}
              {phase === 'summary' && <SummaryStage />}
              {phase === 'about' && <AboutStage />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
