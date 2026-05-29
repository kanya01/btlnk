import { useGameStore } from './store';
import { Brain, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { PresentationStage } from './components/PresentationStage';
import { RecallStage } from './components/RecallStage';
import { DeliverySlider } from './components/DeliverySlider';
import { HistoryChart } from './components/HistoryChart';
import { motion, AnimatePresence } from 'framer-motion';

const IntroStage = () => {
  const startGame = useGameStore((state) => state.startGame);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full space-y-8"
    >
      <div className="text-center">
        <Brain className="w-16 h-16 mx-auto mb-6 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Bottleneck</h1>
        <p className="text-lg text-slate-500 max-w-sm">
          A demonstration of how delivery changes memory.
        </p>
      </div>
      <button 
        onClick={startGame}
        className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-medium text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
      >
        <Play className="w-5 h-5" />
        Start Experience
      </button>
    </motion.div>
  );
};

const ResultStage = () => {
  const bestSpan = useGameStore((state) => state.bestSpan);
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center h-full"
    >
      <h2 className="text-4xl font-bold text-slate-900 mb-4">Run Finished</h2>
      <p className="text-xl text-slate-500">Span: {bestSpan}</p>
    </motion.div>
  );
};

const SummaryStage = () => {
  const { bestSpan, resetToStart, startGame } = useGameStore();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full space-y-8 max-w-md mx-auto text-center"
    >
      <div>
        <h2 className="text-6xl font-bold text-slate-900 mb-2">{bestSpan}</h2>
        <p className="text-lg text-slate-500 font-medium">Items remembered</p>
      </div>

      <DeliverySlider />
      
      <HistoryChart />

      <div className="flex gap-4">
        <button 
          onClick={startGame}
          className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-medium text-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
        >
          <Play className="w-5 h-5" />
          Try Again
        </button>
        <button 
          onClick={resetToStart}
          className="flex items-center gap-2 bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-medium hover:bg-slate-200 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <p className="text-sm text-slate-400 mt-8 max-w-xs">
        Delivery, not effort alone, changes performance on the same underlying task.
      </p>
    </motion.div>
  );
};

function App() {
  const phase = useGameStore((state) => state.phase);
  const { soundEnabled, toggleSound } = useGameStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-primary/20 overflow-hidden">
      <main className="container mx-auto h-screen p-4 sm:p-8 flex flex-col relative">
        <header className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10">
          <button 
            onClick={toggleSound}
            className="p-3 bg-white rounded-full text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100 transition-colors"
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
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
