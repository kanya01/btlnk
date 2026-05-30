import { useGameStore } from '../store';

export const SpeedSlider = () => {
  const { speed, setSpeed } = useGameStore();

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6 mt-4">
      <div className="flex justify-between items-end">
        <div className="text-left">
          <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">Slow</span>
        </div>
        <div className="text-center">
          <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">Speed: {speed}x</span>
        </div>
        <div className="text-right">
          <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">Fast</span>
        </div>
      </div>
      
      <div className="relative pt-2 pb-4">
        <input 
          type="range" 
          min="0.5" 
          max="2.0" 
          step="0.01"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="liquid-slider"
          aria-label="Speed Slider"
        />
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2 px-1">
          <span>0.5x</span>
          <span>1.0x</span>
          <span>2.0x</span>
        </div>
      </div>
    </div>
  );
};
