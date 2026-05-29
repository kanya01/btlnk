import { useGameStore } from '../store';

export const DeliverySlider = () => {
  const { deliveryMode, setDeliveryMode } = useGameStore();

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
      <div className="flex justify-between items-end">
        <div className="text-left">
          <span className="block text-sm font-bold text-slate-700">All at once</span>
          <span className="block text-xs text-slate-400">Low delivery</span>
        </div>
        <div className="text-right">
          <span className="block text-sm font-bold text-slate-700">Bit by bit</span>
          <span className="block text-xs text-slate-400">High delivery</span>
        </div>
      </div>
      
      <div className="relative pt-2 pb-4">
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1"
          value={deliveryMode}
          onChange={(e) => setDeliveryMode(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
          aria-label="Delivery Mode Slider"
        />
        <div className="flex justify-between text-[10px] text-slate-300 mt-2 px-1">
          <span>0.0</span>
          <span>0.5</span>
          <span>1.0</span>
        </div>
      </div>
    </div>
  );
};
