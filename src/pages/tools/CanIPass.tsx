import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

type CalculationMode = 'points' | 'weighted';

export const CanIPass = () => {
  const [mode, setMode] = useState<CalculationMode>('points');

  // Points mode state
  const [currentMarks, setCurrentMarks] = useState<string>('');
  const [totalCourseworkMarks, setTotalCourseworkMarks] = useState<string>('50');
  const [finalExamMarks, setFinalExamMarks] = useState<string>('50');
  const [passTargetPercent, setPassTargetPercent] = useState<string>('40');

  // Weighted mode state
  const [currentWeightedGrade, setCurrentWeightedGrade] = useState<string>('');
  const [finalWeight, setFinalWeight] = useState<string>('40');
  const [targetWeightedGrade, setTargetWeightedGrade] = useState<string>('50');

  // Result state
  const [result, setResult] = useState<{
    neededScore: number;
    neededPercent: number;
    maxPossible: number;
    status: 'passed' | 'achievable' | 'tough' | 'impossible' | 'error';
    headline: string;
    message: string;
  } | null>(null);

  const calculate = () => {
    if (mode === 'points') {
      const scored = parseFloat(currentMarks);
      const totalCoursework = parseFloat(totalCourseworkMarks);
      const finalMax = parseFloat(finalExamMarks);
      const passPercent = parseFloat(passTargetPercent);

      if (isNaN(scored) || isNaN(totalCoursework) || isNaN(finalMax) || isNaN(passPercent)) {
        return;
      }

      if (scored < 0 || totalCoursework <= 0 || finalMax <= 0 || passPercent <= 0 || passPercent > 100) {
        setResult({
          neededScore: 0,
          neededPercent: 0,
          maxPossible: 0,
          status: 'error',
          headline: 'Invalid Input',
          message: 'Please check your values. Marks and percentages must be positive numbers.'
        });
        return;
      }

      if (scored > totalCoursework) {
        setResult({
          neededScore: 0,
          neededPercent: 0,
          maxPossible: 0,
          status: 'error',
          headline: 'Too High!',
          message: "You can't score more coursework marks than the maximum available!"
        });
        return;
      }

      const totalCourseMarks = totalCoursework + finalMax;
      const totalPassMarksNeeded = (passPercent / 100) * totalCourseMarks;
      const neededOnFinal = totalPassMarksNeeded - scored;
      const maxPossibleFinalMarks = scored + finalMax;
      const maxPossiblePercent = (maxPossibleFinalMarks / totalCourseMarks) * 100;

      if (neededOnFinal <= 0) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        setResult({
          neededScore: 0,
          neededPercent: 0,
          maxPossible: maxPossiblePercent,
          status: 'passed',
          headline: 'You Already Passed! 🎉',
          message: `Your current ${scored} marks are already higher than the passing requirement (${totalPassMarksNeeded.toFixed(1)} marks). Even if you get 0 on the final, you have passed!`
        });
      } else if (neededOnFinal > finalMax) {
        setResult({
          neededScore: neededOnFinal,
          neededPercent: (neededOnFinal / finalMax) * 100,
          maxPossible: maxPossiblePercent,
          status: 'impossible',
          headline: 'Mathematically Impossible 🚨',
          message: `You need ${neededOnFinal.toFixed(1)} marks out of ${finalMax}, but the final exam is only worth ${finalMax}. Even with 100% on the final, your max score is ${maxPossiblePercent.toFixed(1)}% (needed ${passPercent}%). Consult your instructor about bonus marks or retakes.`
        });
      } else {
        const percentOnFinal = (neededOnFinal / finalMax) * 100;
        const isTough = percentOnFinal >= 75;
        if (!isTough) {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
        }
        setResult({
          neededScore: Math.ceil(neededOnFinal * 10) / 10,
          neededPercent: percentOnFinal,
          maxPossible: maxPossiblePercent,
          status: isTough ? 'tough' : 'achievable',
          headline: isTough ? 'Study Hard! ⚡' : 'Totally Achievable! 🎯',
          message: `You need at least ${neededOnFinal.toFixed(1)} marks out of ${finalMax} (${percentOnFinal.toFixed(1)}%) on your final exam to pass with ${passPercent}%.`
        });
      }
    } else {
      // Weighted Mode
      const currentGrade = parseFloat(currentWeightedGrade);
      const finalW = parseFloat(finalWeight);
      const targetGrade = parseFloat(targetWeightedGrade);

      if (isNaN(currentGrade) || isNaN(finalW) || isNaN(targetGrade)) {
        return;
      }

      if (finalW <= 0 || finalW >= 100) {
        setResult({
          neededScore: 0,
          neededPercent: 0,
          maxPossible: 0,
          status: 'error',
          headline: 'Invalid Weight',
          message: 'Final exam weight must be between 1% and 99%.'
        });
        return;
      }

      const currentWeight = 100 - finalW;
      // Target = (Current * (100 - FinalWeight) + FinalScore * FinalWeight) / 100
      // Target * 100 = Current * (100 - FinalWeight) + FinalScore * FinalWeight
      // FinalScore * FinalWeight = Target * 100 - Current * (100 - FinalWeight)
      const neededOnFinal = ((targetGrade * 100) - (currentGrade * currentWeight)) / finalW;
      const maxPossibleGrade = ((currentGrade * currentWeight) + (100 * finalW)) / 100;

      if (neededOnFinal <= 0) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        setResult({
          neededScore: 0,
          neededPercent: 0,
          maxPossible: maxPossibleGrade,
          status: 'passed',
          headline: 'You Already Passed! 🎉',
          message: `Your current standing of ${currentGrade}% across ${currentWeight}% of the course is already enough to achieve your passing goal of ${targetGrade}%.`
        });
      } else if (neededOnFinal > 100) {
        setResult({
          neededScore: neededOnFinal,
          neededPercent: neededOnFinal,
          maxPossible: maxPossibleGrade,
          status: 'impossible',
          headline: 'Mathematically Impossible 🚨',
          message: `You would need ${neededOnFinal.toFixed(1)}% on the final exam. Scoring a perfect 100% on the final gives you a maximum overall grade of ${maxPossibleGrade.toFixed(1)}% (target was ${targetGrade}%).`
        });
      } else {
        const isTough = neededOnFinal >= 75;
        if (!isTough) {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
        }
        setResult({
          neededScore: Math.ceil(neededOnFinal * 10) / 10,
          neededPercent: neededOnFinal,
          maxPossible: maxPossibleGrade,
          status: isTough ? 'tough' : 'achievable',
          headline: isTough ? 'High Stakes! ⚡' : 'You Got This! 🎯',
          message: `You need a score of ${neededOnFinal.toFixed(1)}% on the final exam to pass the class with a ${targetGrade}% final grade.`
        });
      }
    }
  };

  return (
    <ToolLayout
      toolId="can-i-pass"
      howItWorks={
        <div className="space-y-3">
          <p>
            The <strong>Can I Pass?</strong> calculator compares your pre-final marks or current grade against the minimum score required to pass the course.
          </p>
          <p>
            <strong>Points Method:</strong><br />
            <code>Required Final Marks = (Passing % × Total Course Marks) - Coursework Marks Scored</code>
          </p>
          <p>
            <strong>Weighted Grade Method:</strong><br />
            <code>Final Exam Grade % = (Target % × 100 - Current Grade % × Current Weight) / Final Weight</code>
          </p>
        </div>
      }
      example={
        <div className="space-y-2">
          <p>
            <strong>Example:</strong> Suppose your class has 40 marks for midterms/assignments and a 60-mark final exam (total 100). The passing mark is 50%.
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>You scored <strong>26 marks</strong> in coursework.</li>
            <li>You need 50 marks total to pass.</li>
            <li>You only need <code>50 - 26 = 24 marks</code> out of 60 on the final exam (just 40%) to pass!</li>
          </ul>
        </div>
      }
      faq={
        <div className="space-y-4">
          <div>
            <h3 className="font-display text-xl mb-1">What is the difference between Points and Weighted?</h3>
            <p className="font-bold text-gray-600">
              Use <strong>Points / Marks</strong> if your professor grades on raw scores (e.g., 30/50 on midterms, final out of 50). Use <strong>Weighted %</strong> if your syllabus specifies percentages like <em>"Midterm 60%, Final 40%"</em>.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl mb-1">What if my school requires a separate final exam cutoff?</h3>
            <p className="font-bold text-gray-600">
              Some universities require both an overall pass and an independent minimum (like 35% on the final exam itself). Be sure to check your course syllabus for any separate sub-minimums!
            </p>
          </div>
        </div>
      }
    >
      <div className="comic-card p-6 md:p-8 bg-white max-w-xl mx-auto">
        {/* Mode Selector */}
        <div className="flex rounded-2xl border-[3px] border-comic-dark overflow-hidden mb-6 bg-comic-light p-1">
          <button
            type="button"
            onClick={() => { setMode('points'); setResult(null); }}
            className={`flex-1 py-2.5 font-display text-lg rounded-xl transition-all ${
              mode === 'points'
                ? 'bg-comic-yellow text-comic-dark border-2 border-comic-dark shadow-[2px_2px_0px_#1E1E24]'
                : 'text-gray-600 hover:text-comic-dark'
            }`}
          >
            Marks & Points
          </button>
          <button
            type="button"
            onClick={() => { setMode('weighted'); setResult(null); }}
            className={`flex-1 py-2.5 font-display text-lg rounded-xl transition-all ${
              mode === 'weighted'
                ? 'bg-comic-blue text-white border-2 border-comic-dark shadow-[2px_2px_0px_#1E1E24]'
                : 'text-gray-600 hover:text-comic-dark'
            }`}
          >
            Weighted %
          </button>
        </div>

        {mode === 'points' ? (
          <div className="space-y-5">
            <div>
              <label className="block font-bold mb-1.5 text-sm text-gray-700">
                Coursework Marks Scored So Far (Midterms / Assignments)
              </label>
              <input
                type="number"
                step="any"
                className="comic-input w-full"
                placeholder="e.g. 28"
                value={currentMarks}
                onChange={(e) => setCurrentMarks(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1.5 text-sm text-gray-700">
                  Total Coursework Marks
                </label>
                <input
                  type="number"
                  step="any"
                  className="comic-input w-full"
                  placeholder="e.g. 50"
                  value={totalCourseworkMarks}
                  onChange={(e) => setTotalCourseworkMarks(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-sm text-gray-700">
                  Final Exam Marks
                </label>
                <input
                  type="number"
                  step="any"
                  className="comic-input w-full"
                  placeholder="e.g. 50"
                  value={finalExamMarks}
                  onChange={(e) => setFinalExamMarks(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1.5 text-sm text-gray-700">
                Minimum Passing Target (%)
              </label>
              <input
                type="number"
                step="any"
                className="comic-input w-full"
                placeholder="e.g. 40 or 50"
                value={passTargetPercent}
                onChange={(e) => setPassTargetPercent(e.target.value)}
              />
              <span className="text-xs font-bold text-gray-500 mt-1 block">
                Usually 40% or 50% depending on your school
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block font-bold mb-1.5 text-sm text-gray-700">
                Current Average Grade (%)
              </label>
              <input
                type="number"
                step="any"
                className="comic-input w-full"
                placeholder="e.g. 68"
                value={currentWeightedGrade}
                onChange={(e) => setCurrentWeightedGrade(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1.5 text-sm text-gray-700">
                  Final Exam Weight (%)
                </label>
                <input
                  type="number"
                  step="any"
                  className="comic-input w-full"
                  placeholder="e.g. 40"
                  value={finalWeight}
                  onChange={(e) => setFinalWeight(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-bold mb-1.5 text-sm text-gray-700">
                  Passing Target (%)
                </label>
                <input
                  type="number"
                  step="any"
                  className="comic-input w-full"
                  placeholder="e.g. 50"
                  value={targetWeightedGrade}
                  onChange={(e) => setTargetWeightedGrade(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={calculate}
          className="comic-btn comic-btn-primary w-full py-4 text-xl mt-6 flex items-center justify-center gap-2"
        >
          <Sparkles size={22} /> Can I Pass?
        </button>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-6 p-6 rounded-2xl border-[3px] border-comic-dark text-center ${
                result.status === 'passed'
                  ? 'bg-comic-green text-comic-dark'
                  : result.status === 'achievable'
                  ? 'bg-comic-yellow text-comic-dark'
                  : result.status === 'tough'
                  ? 'bg-comic-blue text-white'
                  : result.status === 'impossible'
                  ? 'bg-comic-red text-white'
                  : 'bg-red-100 text-red-900'
              }`}
            >
              <h3 className="font-display text-3xl mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
                {result.headline}
              </h3>

              {result.status !== 'error' && result.status !== 'passed' && (
                <div className="my-3">
                  <div className="font-display text-6xl drop-shadow-[3px_3px_0px_#1E1E24]">
                    {result.neededScore > 0 ? result.neededScore : 0}
                    {mode === 'weighted' ? '%' : ''}
                  </div>
                  {mode === 'points' && (
                    <div className="font-display text-xl opacity-90">
                      ({result.neededPercent.toFixed(1)}% on the final)
                    </div>
                  )}
                </div>
              )}

              <p className="font-bold text-base md:text-lg leading-relaxed mt-2 max-w-md mx-auto">
                {result.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolLayout>
  );
};
