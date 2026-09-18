import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

export const CanIPass = () => {
  const [internalMarks, setInternalMarks] = useState<string>('');
  const [maxInternalMarks, setMaxInternalMarks] = useState<string>('');
  const [finalExamMax, setFinalExamMax] = useState<string>('');
  const [passingMarks, setPassingMarks] = useState<string>('');
  const [result, setResult] = useState<{message: string, isSuccess: boolean} | null>(null);

  const calculate = () => {
    const internal = parseFloat(internalMarks);
    const maxInternal = parseFloat(maxInternalMarks);
    const finalMax = parseFloat(finalExamMax);
    const pass = parseFloat(passingMarks);

    if (isNaN(internal) || isNaN(maxInternal) || isNaN(finalMax) || isNaN(pass)) {
      setResult({ message: 'Please fill in all fields with valid numbers.', isSuccess: false });
      return;
    }

    if (internal > maxInternal) {
      setResult({ message: 'Internal marks cannot be greater than maximum internal marks!', isSuccess: false });
      return;
    }

    const marksNeededInFinal = pass - internal;

    if (marksNeededInFinal <= 0) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setResult({ message: '🎉 You have already passed based on your internal marks alone!', isSuccess: true });
    } else if (marksNeededInFinal > finalMax) {
      setResult({ message: `⚠️ Even with full marks (${finalMax}) in the final, you would reach ${internal + finalMax}, which is below the required ${pass}.`, isSuccess: false });
    } else {
      setResult({ message: `📝 You need at least ${marksNeededInFinal.toFixed(1)} / ${finalMax} in the final exam to pass.`, isSuccess: true });
    }
  };

  return (
    <ToolLayout 
      toolId="can-i-pass"
      howItWorks={
        <p>This calculator subtracts your current internal or continuous assessment marks from the total passing marks required for the course. It then compares the difference to the maximum marks available in your final exam to tell you exactly what you need to score.</p>
      }
      example={
        <>
          <p>If your course requires <strong>50 marks</strong> to pass out of 100:</p>
          <ul>
            <li>Your internals are out of 40. You scored 32.</li>
            <li>Your final exam is out of 60.</li>
            <li><strong>Calculation:</strong> 50 (passing) - 32 (your internals) = 18 marks needed.</li>
            <li><strong>Result:</strong> You need 18/60 in the final exam to pass.</li>
          </ul>
        </>
      }
    >
      <div className="comic-card p-6 md:p-8 bg-white max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold mb-2">Your Internal Marks</label>
              <input 
                type="number" 
                className="comic-input w-full"
                placeholder="e.g. 32"
                value={internalMarks}
                onChange={(e) => setInternalMarks(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Max Internal Marks</label>
              <input 
                type="number" 
                className="comic-input w-full"
                placeholder="e.g. 40"
                value={maxInternalMarks}
                onChange={(e) => setMaxInternalMarks(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Final Exam Max Marks</label>
              <input 
                type="number" 
                className="comic-input w-full"
                placeholder="e.g. 60"
                value={finalExamMax}
                onChange={(e) => setFinalExamMax(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-bold mb-2">Required Total to Pass</label>
              <input 
                type="number" 
                className="comic-input w-full"
                placeholder="e.g. 50"
                value={passingMarks}
                onChange={(e) => setPassingMarks(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            onClick={calculate}
            className="comic-btn comic-btn-primary w-full py-4 text-xl"
          >
            Calculate Magic Number
          </button>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-6 p-6 rounded-2xl border-[3px] border-comic-dark font-bold text-xl text-center ${result.isSuccess ? 'bg-comic-green text-comic-dark' : 'bg-red-100 text-red-900'}`}
              >
                {result.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ToolLayout>
  );
};
