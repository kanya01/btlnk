import { useGameStore } from '../store';
import { motion } from 'framer-motion';

export const HistoryChart = () => {
  const history = useGameStore((state) => state.history);
  const sessionId = useGameStore((state) => state.sessionId);

  const sessionRuns = history.filter(h => h.sessionId === sessionId);
  
  if (sessionRuns.length < 2) {
    return (
      <div className="h-32 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
        Complete more runs to see your pattern.
      </div>
    );
  }

  const shapesRuns = sessionRuns.filter(r => r.modality === 'shapes' || !r.modality);
  const textRuns = sessionRuns.filter(r => r.modality === 'text');

  const maxSpan = Math.max(...sessionRuns.map(r => r.span), 5);
  
  // SVG Dimensions
  const width = 340;
  const height = 160;
  const paddingX = 20;
  const paddingY = 30;

  const getPoints = (runs: typeof sessionRuns) => {
    if (runs.length === 0) return '';
    if (runs.length === 1) {
      // If only one point, draw a small line so it's visible, or just a point
      const x = paddingX + (width - 2 * paddingX) / 2;
      const y = height - paddingY - ((runs[0].span / maxSpan) * (height - 2 * paddingY));
      return `${x},${y}`;
    }
    return runs.map((run, i) => {
      const x = paddingX + (i / (runs.length - 1)) * (width - 2 * paddingX);
      const y = height - paddingY - ((run.span / maxSpan) * (height - 2 * paddingY));
      return `${x},${y}`;
    }).join(' ');
  };

  const shapesPoints = getPoints(shapesRuns);
  const textPoints = getPoints(textRuns);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Learning Curve</h3>
        <div className="flex gap-3 text-[10px] font-medium">
          {shapesRuns.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d4775c] shadow-[0_0_8px_#d4775c]"></span>
              <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">Shapes</span>
            </div>
          )}
          {textRuns.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6366f1] shadow-[0_0_8px_#6366f1]"></span>
              <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">Text</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="shapesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4775c" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#d4775c" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.5, 1].map((ratio) => {
            const y = height - paddingY - (ratio * (height - 2 * paddingY));
            return (
              <g key={ratio}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} className="stroke-slate-100 dark:stroke-slate-700/50" strokeWidth="1" strokeDasharray="4 4" />
                <text x={paddingX - 10} y={y + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">
                  {Math.round(ratio * maxSpan)}
                </text>
              </g>
            );
          })}
          
          {/* Shapes Line */}
          {shapesRuns.length > 1 && (
            <>
              <polygon
                points={`${paddingX},${height - paddingY} ${shapesPoints} ${width - paddingX},${height - paddingY}`}
                fill="url(#shapesGradient)"
              />
              <motion.polyline
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                fill="none"
                stroke="#d4775c"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={shapesPoints}
                className="drop-shadow-[0_4px_6px_rgba(212,119,92,0.3)]"
              />
            </>
          )}

          {/* Text Line */}
          {textRuns.length > 1 && (
            <>
              <polygon
                points={`${paddingX},${height - paddingY} ${textPoints} ${width - paddingX},${height - paddingY}`}
                fill="url(#textGradient)"
              />
              <motion.polyline
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={textPoints}
                className="drop-shadow-[0_4px_6px_rgba(99,102,241,0.3)]"
              />
            </>
          )}

          {/* Shapes Points */}
          {shapesRuns.map((run, i) => {
            const isSingle = shapesRuns.length === 1;
            const x = isSingle ? paddingX + (width - 2 * paddingX) / 2 : paddingX + (i / (shapesRuns.length - 1)) * (width - 2 * paddingX);
            const y = height - paddingY - ((run.span / maxSpan) * (height - 2 * paddingY));
            return (
              <motion.g 
                key={`shape-${run.id}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <circle cx={x} cy={y} r="5" className="fill-white dark:fill-slate-800 stroke-[#d4775c] stroke-[3px]" />
                {i === shapesRuns.length - 1 && (
                  <text x={x} y={y - 12} textAnchor="middle" className="text-[10px] fill-slate-600 dark:fill-slate-300 font-bold">
                    {run.span}
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* Text Points */}
          {textRuns.map((run, i) => {
            const isSingle = textRuns.length === 1;
            const x = isSingle ? paddingX + (width - 2 * paddingX) / 2 : paddingX + (i / (textRuns.length - 1)) * (width - 2 * paddingX);
            const y = height - paddingY - ((run.span / maxSpan) * (height - 2 * paddingY));
            return (
              <motion.g 
                key={`text-${run.id}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <circle cx={x} cy={y} r="5" className="fill-white dark:fill-slate-800 stroke-[#6366f1] stroke-[3px]" />
                {i === textRuns.length - 1 && (
                  <text x={x} y={y - 12} textAnchor="middle" className="text-[10px] fill-slate-600 dark:fill-slate-300 font-bold">
                    {run.span}
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>
      <div className="flex justify-between mt-3 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium px-4">
        <span>First Attempt</span>
        <span>Latest</span>
      </div>
    </motion.div>
  );
};
