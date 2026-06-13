import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Play, Scissors, Dumbbell, SlidersHorizontal, Gauge, Shuffle, TrendingUp } from 'lucide-react';
import { useGameStore } from '../store';
import { ScrambleText } from './ScrambleText';
import { OffloadAnim, ChunkingAnim, FocusAnim } from './AboutAnimations';
import { CapacityDots, BottleneckFunnel, TransferChart, AnimatedNumber } from './ScienceVisuals';

const sectionReveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -8% 0px' },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
};

const Kicker = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-3">{children}</p>
);

const THEMES = [
  {
    n: '01',
    title: 'The pause is not the magic',
    body: 'Segmenting is largely inert on its own. Learners who watched chunked videos passively gained nothing — the benefit appeared only when they drew, explained, or summarised at the break. The pause is an occasion for thinking, not a cause of learning.',
  },
  {
    n: '02',
    title: 'It helps when you are drowning',
    body: "The effect shows up when material is genuinely complex and you're a novice. For manageable content — or for experts whose schemas already chunk the material — it fades, and can even reverse.",
  },
  {
    n: '03',
    title: '"Works" depends on the measure',
    body: 'Retention or transfer? Immediate or delayed? Studies that split these reach different verdicts — the outcome you choose to measure shapes the conclusion you get.',
  },
  {
    n: '04',
    title: 'Hype outruns the evidence',
    body: 'The principle is being ported into VR, 3D worlds and new audiences faster than the studies accumulate. The mechanism may be stable; its demonstrated reach is not.',
  },
];

const GAME_MAPPINGS = [
  {
    icon: SlidersHorizontal,
    title: 'The delivery slider is the segmenting principle',
    body: '"All at once" vs "bit by bit" is the exact manipulation the literature tests — same total study time, different chunking.',
  },
  {
    icon: Gauge,
    title: 'Speed is pacing',
    body: 'Less exposure per item pushes your momentary load closer to the ceiling — the condition where segmenting should matter most.',
  },
  {
    icon: Shuffle,
    title: 'The second chance is a transfer test',
    body: 'When you slip, the game switches modality — shapes become words. If your skill survives the switch, that is near transfer happening live.',
  },
  {
    icon: TrendingUp,
    title: 'Your learning curve is the data',
    body: 'Improving at this game is exactly what the meta-analysis predicts: reliable gains on the trained task. The question is what travels beyond it.',
  },
];

export const AboutStage = () => {
  const goBackFromAbout = useGameStore((state) => state.goBackFromAbout);
  const startGame = useGameStore((state) => state.startGame);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 36, mass: 0.6 });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full relative"
    >
      {/* reading progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="absolute top-0 left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-primary to-[#e8957a] z-20 rounded-full"
      />

      <div ref={scrollRef} className="h-full overflow-y-auto px-6 pt-10 pb-36 scrollbar-hide">
        <div className="max-w-2xl mx-auto">
          <motion.button
            onClick={goBackFromAbout}
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
            className="self-start mb-10 p-3 -ml-3 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors text-slate-500 dark:text-slate-400"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>

          <div className="space-y-24">
            {/* ── Hero ── */}
            <header>
              <motion.div {...sectionReveal}>
                <Kicker>The science behind the game</Kicker>
                <h1 className="font-science text-5xl sm:text-[3.75rem] text-slate-900 dark:text-white leading-[1.05] mb-7">
                  The Working-Memory{' '}
                  <span className="italic text-primary">Bottleneck</span>
                </h1>
                <blockquote className="border-l-2 border-primary/40 pl-5 text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  When learning is constrained by the limits of working memory, is it better to{' '}
                  <em className="font-science not-italic italic text-slate-900 dark:text-white">design around</em>{' '}
                  those limits — or to try to{' '}
                  <em className="font-science not-italic italic text-slate-900 dark:text-white">expand</em> them?
                </blockquote>
              </motion.div>
            </header>

            {/* ── 1 · The tiny workspace ── */}
            <motion.section {...sectionReveal} className="space-y-6">
              <Kicker>01 · The constraint</Kicker>
              <h2 className="font-science text-3xl sm:text-4xl text-slate-900 dark:text-white">
                Your mental workspace is <span className="italic text-primary">tiny</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[17px]">
                Working memory is where you hold and manipulate information while you think. For decades the
                folklore said seven items, plus or minus two. The modern estimate is harsher:{' '}
                <strong className="text-slate-800 dark:text-slate-200">about four chunks</strong>. Everything you
                just tried to memorise had to fit through that gap.
              </p>
              <CapacityDots />
              <BottleneckFunnel />
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[17px]">
                When a task demands more than the workspace holds, understanding doesn't degrade gracefully — it
                breaks. That's the wall you hit in the game, and it's the same wall every lecture, textbook and
                tutorial is designed against.
              </p>
            </motion.section>

            {/* ── 2 · Two opposite answers ── */}
            <motion.section {...sectionReveal} className="space-y-6">
              <Kicker>02 · The fork in the road</Kicker>
              <h2 className="font-science text-3xl sm:text-4xl text-slate-900 dark:text-white">
                Two opposite answers
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="relative overflow-hidden bg-white/70 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-emerald-200/60 dark:border-emerald-500/20 shadow-sm">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Scissors className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Accommodate it</h3>
                  <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    Design around the limit. Cut material into learner-paced chunks so the workspace never
                    overflows — the <strong className="text-slate-700 dark:text-slate-300">segmenting principle</strong>.
                  </p>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    Modest, reliable evidence
                  </span>
                </div>
                <div className="relative overflow-hidden bg-white/70 dark:bg-slate-800/50 backdrop-blur-md p-6 rounded-3xl border border-rose-200/60 dark:border-rose-500/20 shadow-sm">
                  <div className="w-11 h-11 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-4">
                    <Dumbbell className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Expand it</h3>
                  <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    Train working memory itself — the promise behind Cogmed, Lumosity and the brain-training
                    industry.
                  </p>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full">
                    Big claims, weak transfer
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm rounded-3xl border border-slate-100 dark:border-slate-700/50 px-6 py-5 text-center">
                <div>
                  <AnimatedNumber value={1.3} decimals={1} prefix="$" suffix="B+" className="block text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums" />
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">brain-training market by 2013</span>
                </div>
                <div>
                  <AnimatedNumber value={2} prefix="$" suffix="M" className="block text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums" />
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Lumosity's FTC settlement, 2016</span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[17px]">
                The better-funded, harder-marketed answer rests on the{' '}
                <strong className="text-slate-800 dark:text-slate-200">weaker evidence</strong> — and learners
                carry the cost of getting that choice wrong.
              </p>
            </motion.section>

            {/* ── 3 · The data ── */}
            <motion.section {...sectionReveal} className="space-y-6">
              <Kicker>03 · Follow the data</Kicker>
              <h2 className="font-science text-3xl sm:text-4xl text-slate-900 dark:text-white">
                Training works… <span className="italic text-primary">on the training</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[17px]">
                Across <strong className="text-slate-800 dark:text-slate-200">637 effect sizes from 48 Cogmed studies</strong>{' '}
                (Aksayli, Sala &amp; Gobet, 2019), gains on tasks resembling the training are solid. Gains on the
                things you'd actually buy training for — reasoning, reading, maths — sit almost exactly at zero.
              </p>
              <TransferChart />
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[17px]">
                The likely mechanism is mundane: trainees get better at the specific routines being drilled, not a
                bigger general-purpose workspace. <strong className="text-slate-800 dark:text-slate-200">You get
                better at the game — you don't get a bigger brain.</strong>
              </p>
            </motion.section>

            {/* ── 4 · Boundary conditions ── */}
            <motion.section {...sectionReveal} className="space-y-6">
              <Kicker>04 · The fine print</Kicker>
              <h2 className="font-science text-3xl sm:text-4xl text-slate-900 dark:text-white">
                So design around it — <span className="italic text-primary">carefully</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[17px]">
                A thematic analysis of ten recent segmenting studies shows the accommodation side wins, but only
                under conditions. Four patterns run through the literature:
              </p>
              <div className="grid gap-4">
                {THEMES.map(({ n, title, body }, i) => (
                  <motion.div
                    key={n}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '0px 0px -5% 0px' }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-5 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm"
                  >
                    <span className="font-science italic text-3xl text-primary/50 leading-none mt-0.5 shrink-0">{n}</span>
                    <div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1.5">{title}</h3>
                      <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">{body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── 5 · The game is the experiment ── */}
            <motion.section {...sectionReveal} className="space-y-6">
              <Kicker>05 · Back to the game</Kicker>
              <h2 className="font-science text-3xl sm:text-4xl text-slate-900 dark:text-white">
                You just ran the <span className="italic text-primary">experiment</span>
              </h2>
              <div className="space-y-3">
                {GAME_MAPPINGS.map(({ icon: Icon, title, body }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '0px 0px -5% 0px' }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-4 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md px-5 py-4 rounded-2xl border border-slate-100 dark:border-slate-700/50"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* ── 6 · Practical tips ── */}
            <motion.section {...sectionReveal} className="space-y-8">
              <Kicker>06 · Take it with you</Kicker>
              <h2 className="font-science text-3xl sm:text-4xl text-slate-900 dark:text-white">
                <ScrambleText text="Work with your bottleneck" />
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[17px]">
                You can't meaningfully expand the workspace — but you can stop wasting it:
              </p>
              <div className="grid gap-6">
                <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md p-7 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                  <OffloadAnim />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Offload it</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                    Your brain is for having ideas, not storing them. Write things down immediately and spend the
                    freed capacity on actual thinking.
                  </p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md p-7 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                  <ChunkingAnim />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Chunk it</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                    Four slots is the rule — but a chunk can be as rich as you make it. Group ten items into three
                    meaningful clusters and the bottleneck never notices.
                  </p>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md p-7 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                  <FocusAnim />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Defend it</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                    Task-switching flushes the workspace, and reloading it costs real time and energy. Protect
                    uninterrupted blocks for anything cognitively heavy.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* ── Verdict ── */}
            <motion.section {...sectionReveal} className="text-center space-y-8 pb-4">
              <blockquote className="font-science text-2xl sm:text-3xl text-slate-800 dark:text-slate-100 leading-snug max-w-lg mx-auto">
                "Don't buy a bigger workspace.{' '}
                <span className="italic text-primary">Design for the one you have</span> — and fill every pause
                with thought."
              </blockquote>
              <button
                onClick={startGame}
                className="liquid-glass-primary inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl font-medium text-lg text-white"
              >
                <Play className="w-5 h-5" />
                Run the experiment again
              </button>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-md mx-auto">
                Drawn from an M4003 mixed-methods study: thematic analysis of ten segmenting papers (2018–2026) and
                statistical analysis of the Aksayli, Sala &amp; Gobet (2019) Cogmed meta-analytic dataset. Key
                sources: Cowan (2001) · Miller (1956) · Sweller et al. (2019) · Mayer (2021) · Rey et al. (2019) ·
                Simons et al. (2016).
              </p>
            </motion.section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
