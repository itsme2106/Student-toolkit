import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { motion, AnimatePresence } from 'motion/react';

export const AttendanceCalculator = () => {
  const [conducted, setConducted] = useState<string>('');
  const [attended, setAttended] = useState<string>('');
  const [result, setResult] = useState<{percentage: number, message: string} | null>(null);

  const calculate = () => {
    const total = parseFloat(conducted);
    const present = parseFloat(attended);

    if (isNaN(total) || isNaN(present)) {
      setResult(null);
      return;
    }

    if (present > total) {
      setResult({ percentage: 0, message: "You can't attend more classes than were conducted!" });
      return;
    }

    if (total === 0) {
      setResult({ percentage: 0, message: "Total classes cannot be zero." });
      return;
    }

    const percentage = (present / total) * 100;
    
    let message = '';
    if (percentage >= 75) message = 'Looking good! Keep it up. 🚀';
    else if (percentage >= 60) message = 'You are in the danger zone. Attend next classes! ⚠️';
    else message = 'Critical! You need to attend regularly. 🚨';

    setResult({ percentage, message });
  };

  return (
    <ToolLayout 
      toolId="attendance-calculator"
      howItWorks={
        <p>Simple math: <code>(Classes Attended / Classes Conducted) × 100</code>. This gives you your current attendance percentage.</p>
      }
    >
      <div className="comic-card p-6 md:p-8 bg-white max-w-lg mx-auto">
        <div className="space-y-6">
          <div>
            <label className="block font-bold mb-2">Total Classes Conducted</label>
            <input 
              type="number" 
              className="comic-input w-full"
              placeholder="e.g. 50"
              value={conducted}
              onChange={(e) => setConducted(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Classes You Attended</label>
            <input 
              type="number" 
              className="comic-input w-full"
              placeholder="e.g. 43"
              value={attended}
              onChange={(e) => setAttended(e.target.value)}
            />
          </div>
          
          <button 
            onClick={calculate}
            className="comic-btn comic-btn-primary w-full py-4 text-xl"
          >
            Calculate Attendance
          </button>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-6 rounded-2xl border-[3px] border-comic-dark text-center bg-comic-light"
              >
                {result.message.includes('can\'t') || result.message.includes('zero') ? (
                  <p className="font-bold text-red-600">{result.message}</p>
                ) : (
                  <>
                    <div className="font-display text-6xl text-comic-blue mb-2 drop-shadow-[2px_2px_0px_#1E1E24]">
                      {result.percentage.toFixed(2)}%
                    </div>
                    <p className="font-bold">{result.message}</p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ToolLayout>
  );
};
