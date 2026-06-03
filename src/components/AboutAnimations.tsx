import { motion } from 'framer-motion';

export const OffloadAnim = () => (
  <div className="flex items-center justify-center h-28 mb-4 gap-12 pointer-events-none">
    <div className="relative w-16 h-16 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1, 1],
          opacity: [1, 1, 0, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.15, 0.4, 1] }}
        className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
      />
      <motion.div 
        animate={{ 
          x: [0, 0, 75, 75], 
          y: [0, -25, -25, -10],
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 1, 0.5]
        }}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.15, 0.5, 0.7] }}
        className="absolute w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
      />
    </div>
    <div className="w-14 h-16 rounded-xl border-2 border-slate-200 dark:border-slate-700 relative flex flex-col items-center justify-end pb-3 gap-1.5 overflow-hidden bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-800/50">
      <motion.div 
        animate={{ width: ["0%", "0%", "65%", "65%"], opacity: [0, 0, 1, 1] }}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.6, 0.8, 1] }}
        className="h-1.5 bg-blue-400 dark:bg-blue-500 rounded-full self-start ml-2"
      />
      <motion.div 
        animate={{ width: ["0%", "0%", "45%", "45%"], opacity: [0, 0, 1, 1] }}
        transition={{ duration: 3, repeat: Infinity, times: [0, 0.7, 0.9, 1] }}
        className="h-1.5 bg-blue-400 dark:bg-blue-500 rounded-full self-start ml-2"
      />
    </div>
  </div>
);

export const ChunkingAnim = () => {
  return (
    <div className="flex items-center justify-center h-28 mb-4 relative w-full max-w-[240px] mx-auto pointer-events-none">
      {[...Array(9)].map((_, i) => {
        const startX = (i % 3) * 35 - 35 + (Math.random() * 15 - 7.5);
        const startY = Math.floor(i / 3) * 20 - 20 + (Math.random() * 15 - 7.5);
        
        const group = Math.floor(i / 3);
        const endX = (group - 1) * 55 + (i % 3) * 10 - 10;
        const endY = Math.floor((i % 3) / 2) * 10 - 5; 

        return (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-amber-500 absolute top-1/2 left-1/2 -mt-1.5 -ml-1.5 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
            animate={{
              x: [startX, startX, endX, endX, startX],
              y: [startY, startY, endY, endY, startY],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.15, 0.45, 0.85, 1]
            }}
          />
        );
      })}
      
      {[-1, 0, 1].map((pos, i) => (
        <motion.div
          key={`box-${i}`}
          className="absolute top-1/2 left-1/2 w-12 h-12 border border-amber-400/40 dark:border-amber-500/30 rounded-xl bg-amber-400/10 dark:bg-amber-500/10"
          style={{ x: pos * 55 - 24, y: -24 }}
          animate={{
            opacity: [0, 0, 1, 1, 0],
            scale: [0.8, 0.8, 1, 1, 0.8]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.35, 0.5, 0.8, 1]
          }}
        />
      ))}
    </div>
  );
};

export const FocusAnim = () => (
  <div className="flex items-center justify-center h-28 mb-4 relative w-full max-w-[240px] mx-auto overflow-hidden pointer-events-none">
    <motion.div 
      className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center z-10"
      animate={{ 
        boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 25px rgba(16,185,129,0.3)", "0 0 0px rgba(16,185,129,0)"]
      }}
      transition={{ duration: 2.5, repeat: Infinity }}
    >
      <div className="w-5 h-5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]" />
    </motion.div>
    
    <motion.div 
      className="absolute top-1/2 left-1/2 w-20 h-20 -ml-10 -mt-10 rounded-full border border-emerald-400/80"
      animate={{ 
        scale: [1, 1.6, 1.6],
        opacity: [1, 0, 0]
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
    />

    <motion.div
      className="w-3 h-3 rounded-full bg-rose-400 absolute top-1/2 left-4 -mt-1.5 shadow-[0_0_10px_rgba(251,113,133,0.6)]"
      animate={{ 
        x: [0, 50, -10, -20], 
        y: [0, 0, -20, 0],
        opacity: [0, 1, 0, 0] 
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
    />
    <motion.div
      className="w-2.5 h-2.5 rounded-full bg-rose-400 absolute top-1/2 right-4 -mt-1 shadow-[0_0_10px_rgba(251,113,133,0.6)]"
      animate={{ 
        x: [0, -45, 15, 20], 
        y: [20, 10, 30, 0],
        opacity: [0, 1, 0, 0] 
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
    />
    <motion.div
      className="w-3.5 h-3.5 rounded-full bg-rose-400 absolute top-0 left-1/2 -ml-1.5 shadow-[0_0_10px_rgba(251,113,133,0.6)]"
      animate={{ 
        y: [0, 45, -10, -20], 
        x: [-20, -10, -30, 0],
        opacity: [0, 1, 0, 0] 
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1.6 }}
    />
  </div>
);
