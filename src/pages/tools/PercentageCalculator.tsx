import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

export const PercentageCalculator = () => {
  const [marksObtained, setMarksObtained] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const obtained = parseFloat(marksObtained);
    const total = parseFloat(totalMarks);
    if (!isNaN(obtained) && !isNaN(total) && total > 0) {
      setResult((obtained / total) * 100);
    } else {
      setResult(null);
    }
  };

  return (
    <ToolLayout toolId="percentage-calculator">
      <div className="comic-card p-6 md:p-8 bg-white max-w-lg mx-auto text-center space-y-6">
        <div>
          <label className="block font-bold mb-2 text-left">Marks Obtained</label>
          <input 
            type="number" 
            className="comic-input w-full"
            value={marksObtained}
            onChange={(e) => setMarksObtained(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-bold mb-2 text-left">Total Marks</label>
          <input 
            type="number" 
            className="comic-input w-full"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
          />
        </div>
        <button 
          onClick={calculate}
          className="comic-btn comic-btn-primary w-full py-4 text-xl"
        >
          Calculate
        </button>

        {result !== null && (
          <div className="mt-6 p-6 rounded-2xl border-[3px] border-comic-dark bg-comic-red text-white">
             <div className="font-display text-6xl drop-shadow-[2px_2px_0px_#1E1E24]">
                {result.toFixed(2)}%
             </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
