import type { Shape, Color, Token } from '../gameEngine';
import { motion } from 'framer-motion';
import { useGameStore } from '../store';

interface TokenViewProps {
  token: Pick<Token, 'shape' | 'color'>;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  selected?: boolean;
}

const colorMap: Record<Color, string> = {
  red: 'text-red-500 fill-red-500/20 stroke-red-500',
  blue: 'text-blue-500 fill-blue-500/20 stroke-blue-500',
  green: 'text-green-500 fill-green-500/20 stroke-green-500',
  yellow: 'text-yellow-500 fill-yellow-500/20 stroke-yellow-500',
};

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
};

const textModalitySizeMap = {
  sm: 'w-auto h-10 px-3 text-xs',
  md: 'w-auto h-16 px-4 text-sm',
  lg: 'w-auto h-24 px-6 text-xl',
};

const textColorMap: Record<Color, string> = {
  red: 'text-red-500 dark:text-red-400',
  blue: 'text-blue-500 dark:text-blue-400',
  green: 'text-green-500 dark:text-green-400',
  yellow: 'text-yellow-600 dark:text-yellow-400',
};

const ShapeSVG = ({ shape, className }: { shape: Shape; className: string }) => {
  switch (shape) {
    case 'circle':
      return (
        <svg viewBox="0 0 24 24" className={className} strokeWidth="2" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case 'square':
      return (
        <svg viewBox="0 0 24 24" className={className} strokeWidth="2" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
        </svg>
      );
    case 'triangle':
      return (
        <svg viewBox="0 0 24 24" className={className} strokeWidth="2" strokeLinejoin="round">
          <polygon points="12,3 21,19 3,19" />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 24 24" className={className} strokeWidth="2" strokeLinejoin="round">
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
        </svg>
      );
  }
};

export const TokenView: React.FC<TokenViewProps> = ({ 
  token, 
  size = 'md', 
  interactive = false, 
  onClick,
  className = '',
  selected = false
}) => {
  const modality = useGameStore((state) => state.modality);
  const isText = modality === 'text';

  const baseClasses = `relative shrink-0 flex items-center justify-center transition-all duration-200 rounded-xl ${
    isText ? textModalitySizeMap[size] : sizeMap[size]
  }`;
  
  const interactiveClasses = interactive 
    ? 'cursor-pointer hover:scale-105 active:scale-95 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700' 
    : isText ? 'bg-white/80 dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-slate-700' : '';
    
  const selectedClasses = selected ? 'ring-4 ring-primary ring-offset-2' : '';

  return (
    <motion.button
      whileHover={interactive ? { scale: 1.05 } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
      onClick={interactive ? onClick : undefined}
      className={`${baseClasses} ${interactiveClasses} ${selectedClasses} ${className}`}
      disabled={!interactive}
      aria-label={`${token.color} ${token.shape}`}
      title={`${token.color} ${token.shape}`}
    >
      {isText ? (
        <span className={`font-bold uppercase tracking-wider whitespace-nowrap ${textColorMap[token.color]}`}>
          {token.color} {token.shape}
        </span>
      ) : (
        <ShapeSVG shape={token.shape} className={`w-full h-full drop-shadow-sm ${colorMap[token.color]}`} />
      )}
    </motion.button>
  );
};
