import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

/* ── Animated counter that runs once when scrolled into view ── */

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedNumber = ({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.6,
  className = '',
}: AnimatedNumberProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
};

/* ── Miller's 7±2 collapsing to Cowan's ~4 ── */

export const CapacityDots = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });

  return (
    <div ref={ref} className="flex flex-col items-center gap-5 py-6">
      <div className="flex items-center gap-3">
        {[...Array(7)].map((_, i) => {
          const survives = i < 4;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={inView ? {
                scale: survives ? 1 : [0, 1, 1, 0.7],
                opacity: survives ? 1 : [0, 1, 1, 0.18],
              } : {}}
              transition={survives
                ? { delay: 0.1 + i * 0.08, type: 'spring', bounce: 0.5 }
                : { delay: 0.1 + i * 0.08, duration: 2.2, times: [0, 0.2, 0.55, 1], ease: 'easeInOut' }}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${
                survives
                  ? 'bg-primary shadow-lg shadow-primary/30'
                  : 'bg-slate-400 dark:bg-slate-500'
              }`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-3 text-sm font-medium">
        <motion.span
          initial={{ opacity: 1 }}
          animate={inView ? { opacity: 0.4 } : {}}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="text-slate-500 dark:text-slate-400 line-through decoration-rose-400/70 decoration-2"
        >
          7 ± 2 &nbsp;<span className="text-xs no-underline">Miller, 1956</span>
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="text-primary font-bold"
        >
          ~4 chunks &nbsp;<span className="text-xs font-semibold opacity-70">Cowan, 2001</span>
        </motion.span>
      </div>
    </div>
  );
};

/* ── The bottleneck itself: information squeezing through a narrow channel ── */

const PASS_COLORS = ['#d4775c', '#6366f1', '#22c55e', '#eab308'];

export const BottleneckFunnel = () => (
  <div className="w-full max-w-md mx-auto pointer-events-none select-none">
    <svg viewBox="0 0 340 150" className="w-full h-auto overflow-visible">
      {/* funnel walls */}
      <path
        d="M 8 26 C 100 30, 120 58, 162 58 L 178 58 C 220 58, 240 30, 332 26"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="stroke-slate-300 dark:stroke-slate-600"
      />
      <path
        d="M 8 124 C 100 120, 120 92, 162 92 L 178 92 C 220 92, 240 120, 332 124"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="stroke-slate-300 dark:stroke-slate-600"
      />
      {/* soft glow in the neck */}
      <ellipse cx="170" cy="75" rx="26" ry="20" className="fill-primary/10">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
      </ellipse>

      {/* items that make it through the channel */}
      {PASS_COLORS.map((color, i) => (
        <motion.circle
          key={`pass-${i}`}
          r="7"
          fill={color}
          initial={{ cx: -12, cy: 75, opacity: 0 }}
          animate={{
            cx: [-12, 80, 170, 260, 352],
            cy: [75 + (i % 2 === 0 ? -18 : 18), 75 + (i % 2 === 0 ? -6 : 6), 75, 75 + (i % 2 === 0 ? 8 : -8), 75 + (i % 2 === 0 ? 22 : -22)],
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: i * 1.25, ease: 'linear' }}
        />
      ))}

      {/* items that don't fit — they queue at the neck and fade */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={`block-${i}`}
          r="6"
          className="fill-slate-400 dark:fill-slate-500"
          initial={{ cx: -12, opacity: 0 }}
          animate={{
            cx: [-12, 70, 122, 126],
            cy: [75 + (i - 1) * 34, 75 + (i - 1) * 28, 75 + (i - 1) * 22, 75 + (i - 1) * 22],
            opacity: [0, 0.85, 0.85, 0],
            scale: [1, 1, 1, 0.6],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 0.6 + i * 1.55, ease: 'easeOut' }}
        />
      ))}
    </svg>
    <p className="text-center text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mt-1">
      Everything you learn squeezes through here
    </p>
  </div>
);

/* ── The headline quantitative finding: near vs far transfer ── */

const CHART_MAX = 0.5; // g-scale ceiling for the bars

const BARS = [
  {
    label: 'Near transfer',
    sub: 'Tasks like the training',
    g: 0.43,
    barClass: 'bg-gradient-to-t from-primary to-[#e8957a] shadow-lg shadow-primary/30',
    textClass: 'text-primary',
  },
  {
    label: 'Far transfer',
    sub: 'Reasoning · reading · maths',
    g: 0.06,
    barClass: 'bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-600 dark:to-slate-500',
    textClass: 'text-slate-500 dark:text-slate-400',
  },
];

export const TransferChart = () => (
  <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6 sm:p-8">
    <div className="flex items-baseline justify-between mb-6">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
        Does training transfer?
      </h3>
      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        Effect size (Hedges' g)
      </span>
    </div>

    <div className="relative h-52 mb-2">
      {/* gridlines */}
      {[0, 0.2, 0.4].map((g) => (
        <div
          key={g}
          className="absolute left-0 right-0 flex items-center gap-2"
          style={{ bottom: `${(g / CHART_MAX) * 100}%` }}
        >
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 w-7 text-right tabular-nums">
            {g.toFixed(1)}
          </span>
          <div className={`flex-1 border-t ${g === 0 ? 'border-slate-300 dark:border-slate-600' : 'border-dashed border-slate-200 dark:border-slate-700/60'}`} />
        </div>
      ))}

      {/* bars */}
      <div className="absolute inset-0 pl-9 flex items-end justify-center gap-14 sm:gap-20">
        {BARS.map(({ label, g, barClass, textClass }, i) => (
          <div key={label} className="flex flex-col items-center justify-end h-full w-24">
            <AnimatedNumber
              value={g}
              decimals={2}
              prefix="g = "
              className={`text-lg font-bold tabular-nums mb-2 ${textClass}`}
            />
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${(g / CHART_MAX) * 100}%` }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 1.4, delay: 0.15 + i * 0.2 }}
              className={`w-16 sm:w-20 rounded-t-2xl ${barClass}`}
            />
          </div>
        ))}
      </div>
    </div>

    {/* x labels */}
    <div className="pl-9 flex justify-center gap-14 sm:gap-20 mb-6">
      {BARS.map(({ label, sub }) => (
        <div key={label} className="w-24 text-center">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">{sub}</p>
        </div>
      ))}
    </div>

    {/* stat strip */}
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 pt-4 border-t border-slate-100 dark:border-slate-700/50 text-[11px] font-mono text-slate-400 dark:text-slate-500 tabular-nums">
      <span><AnimatedNumber value={637} duration={1.2} className="font-bold text-slate-500 dark:text-slate-400" /> effect sizes</span>
      <span>·</span>
      <span><AnimatedNumber value={48} duration={1.2} className="font-bold text-slate-500 dark:text-slate-400" /> studies</span>
      <span>·</span>
      <span>t(604) = 11.35</span>
      <span>·</span>
      <span>p &lt; .001</span>
      <span>·</span>
      <span className="text-primary font-bold">d = 0.87 (large)</span>
    </div>
  </div>
);
