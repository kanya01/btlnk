import { useGameStore } from '../store';

export const HistoryChart = () => {
  const history = useGameStore((state) => state.history);
  const sessionId = useGameStore((state) => state.sessionId);

  // Focus only on the current session for the default view
  const sessionRuns = history.filter(h => h.sessionId === sessionId);
  
  if (sessionRuns.length < 2) {
    return (
      <div className="h-32 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
        Complete more runs to see your pattern.
      </div>
    );
  }

  // Group by deliveryMode and take the max span to avoid a jumbled chart
  const aggregatedMap = new Map();
  sessionRuns.forEach(run => {
    const existing = aggregatedMap.get(run.deliveryMode);
    if (!existing || run.span > existing.span) {
      aggregatedMap.set(run.deliveryMode, run);
    }
  });

  const sortedRuns = Array.from(aggregatedMap.values()).sort((a: any, b: any) => a.deliveryMode - b.deliveryMode);

  if (sortedRuns.length < 2) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 h-32 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm text-center">
        Try different delivery modes to see your pattern emerge.
      </div>
    );
  }

  const maxSpan = Math.max(...sortedRuns.map((r: any) => r.span), 5); // At least 5 for scale
  
  // SVG Dimensions
  const width = 300;
  const height = 120;
  const paddingX = 20;
  const paddingY = 20;

  const points = sortedRuns.map((run) => {
    // Map delivery mode (0 to 1) to X coordinate
    // Actually, maybe better to just space them evenly, or use deliveryMode strictly
    // Using deliveryMode strictly
    const x = paddingX + (run.deliveryMode * (width - 2 * paddingX));
    const y = height - paddingY - ((run.span / maxSpan) * (height - 2 * paddingY));
    return `${x},${y}`;
  });

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Your Session Pattern</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Axes */}
        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="2" />
        
        {/* Line */}
        <polyline
          fill="none"
          stroke="#d4775c"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points.join(' ')}
        />
        
        {/* Points */}
        {sortedRuns.map((run) => {
          const x = paddingX + (run.deliveryMode * (width - 2 * paddingX));
          const y = height - paddingY - ((run.span / maxSpan) * (height - 2 * paddingY));
          return (
            <g key={run.id}>
              <circle cx={x} cy={y} r="4" className="fill-white dark:fill-slate-800 stroke-primary stroke-2" />
              <text x={x} y={y - 10} textAnchor="middle" className="text-[10px] fill-slate-500 dark:fill-slate-400 font-medium">
                {run.span}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between mt-2 text-[10px] text-slate-400 dark:text-slate-500">
        <span>All at once</span>
        <span>Bit by bit</span>
      </div>
    </div>
  );
};
