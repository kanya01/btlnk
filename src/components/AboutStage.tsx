import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Lightbulb, Zap, Anchor } from 'lucide-react';
import { useGameStore } from '../store';
import { ScrambleText } from './ScrambleText';
export const AboutStage = () => {
  const goToSummary = useGameStore((state) => state.goToSummary);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full overflow-y-auto px-6 py-12 scrollbar-hide max-w-2xl mx-auto"
    >
      <button 
        onClick={goToSummary}
        className="self-start mb-8 p-3 -ml-3 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors text-slate-500 dark:text-slate-400"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="space-y-14 pb-16">
        <header className="space-y-5">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 mb-6">
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            The Bottleneck <br/><span className="text-slate-400 dark:text-slate-500">of the Mind</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
            Why you just struggled to remember a few simple shapes, and why that's perfectly normal.
          </p>
        </header>

        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Anchor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">The Exercise</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[17px]">
            This game measures your <strong className="text-slate-800 dark:text-slate-200">working memory</strong>—the mental workspace where you hold and manipulate information in real-time. Unlike long-term memory, which stores your childhood pet's name forever, working memory is fragile, fleeting, and strictly limited in capacity.
          </p>
        </section>

        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">The Reality</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[17px]">
            Most human beings can only hold about <strong className="text-slate-800 dark:text-slate-200">4 to 7 items</strong> in their working memory at once. When you try to cram in more, old information falls out to make room for the new. If you find yourself dropping things or losing the thread during a complex task, it isn't a failing—it's an architectural limit of the human brain.
          </p>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
              <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
              <ScrambleText text="Navigating the Noise" />
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[17px]">
            If you frequently struggle to keep things in mind, here is how you can manage the bottleneck:
          </p>
          
          <div className="grid gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md p-7 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">1. Offload It</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                Your brain is for having ideas, not storing them. Write things down immediately. Use notes, lists, or voice memos. Free up your working memory for active thought rather than pure storage.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md p-7 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">2. Chunk Information</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                Instead of trying to remember 10 distinct items, group them into 3 logical categories. "Chunking" reduces the cognitive load, allowing you to bypass the strict limits of your mental RAM.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md p-7 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">3. Defend Your Focus</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                Task-switching clears your working memory completely. Every time you check a notification, you have to spend energy reloading your previous thoughts. Protect uninterrupted blocks of time for cognitive-heavy tasks.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
