import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export const ClassesICanMiss = () => {
  const [conducted, setConducted] = useState<string>('');
  const [attended, setAttended] = useState<string>('');
  const [target, setTarget] = useState<string>('75');
  const [result, setResult] = useState<{miss: number, message: string, isError: boolean} | null>(null);

  const calculate = () => {
    const total = parseFloat(conducted);
    const present = parseFloat(attended);
    const targetPercent = parseFloat(target);

    if (isNaN(total) || isNaN(present) || isNaN(targetPercent)) return;
    if (present > total) {
      setResult({ miss: 0, message: "You can't attend more classes than conducted!", isError: true });
      return;
    }
    if (targetPercent <= 0 || targetPercent > 100) {
      setResult({ miss: 0, message: "Target percentage must be between 1 and 100.", isError: true });
      return;
    }

    const currentPercent = (present / total) * 100;
    if (currentPercent < targetPercent) {
      setResult({ miss: 0, message: `Your current attendance (${currentPercent.toFixed(1)}%) is already below your target (${targetPercent}%). You need to attend classes, not miss them!`, isError: true });
      return;
    }

    // Equation: (present) / (total + x) = targetPercent / 100
    // (present * 100) = targetPercent * (total + x)
    // (present * 100) / targetPercent = total + x
    // x = ((present * 100) / targetPercent) - total
    const maxMissable = Math.floor(((present * 100) / targetPercent) - total);

    if (maxMissable > 0) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setResult({ 
        miss: maxMissable, 
        message: `You can miss the next ${maxMissable} class${maxMissable === 1 ? '' : 'es'} and still maintain ${targetPercent}%! 🏖️`, 
        isError: false 
      });
    } else {
      setResult({ 
        miss: 0, 
        message: `You can't miss any more classes if you want to keep ${targetPercent}%.`, 
        isError: false 
      });
    }
  };

  return (
    <ToolLayout 
      toolId="classes-i-can-miss"
      howItWorks={
        <p>This tool solves for <i>x</i> in the equation: <br/><code>Present / (Total + x) = Target / 100</code> <br/>It tells you exactly how many consecutive future classes you can skip without your attendance falling below the target.</p>
      }
    >
      <div className="comic-card p-6 md:p-8 bg-white max-w-lg mx-auto">
        <div className="space-y-6">
          <div>
            <label className="block font-bold mb-2">Total Classes Conducted So Far</label>
            <input 
              type="number" 
              className="comic-input w-full"
              value={conducted}
              onChange={(e) => setConducted(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Classes You Attended</label>
            <input 
              type="number" 
              className="comic-input w-full"
              value={attended}
              onChange={(e) => setAttended(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Target Attendance (%)</label>
            <input 
              type="number" 
              className="comic-input w-full"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>
          
          <button 
            onClick={calculate}
            className="comic-btn comic-btn-primary w-full py-4 text-xl"
          >
            Can I Bunk?
          </button>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-6 rounded-2xl border-[3px] border-comic-dark text-center ${result.isError ? 'bg-red-100 text-red-900' : 'bg-comic-purple text-white'}`}
              >
                {!result.isError && result.miss > 0 && (
                  <div className="font-display text-7xl mb-2 drop-shadow-[3px_3px_0px_#1E1E24]">
                    {result.miss}
                  </div>
                )}
                <p className="font-bold text-lg">{result.message}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ToolLayout>
  );
};
