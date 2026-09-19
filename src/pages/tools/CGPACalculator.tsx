import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { motion } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';

interface Semester {
  id: string;
  sgpa: string;
  credits: string;
}

export const CGPACalculator = () => {
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: '1', sgpa: '', credits: '' },
    { id: '2', sgpa: '', credits: '' }
  ]);
  const [cgpa, setCgpa] = useState<number | null>(null);

  const addSemester = () => {
    setSemesters([...semesters, { id: Math.random().toString(), sgpa: '', credits: '' }]);
  };

  const removeSemester = (id: string) => {
    if (semesters.length > 1) {
      setSemesters(semesters.filter(s => s.id !== id));
    }
  };

  const updateSemester = (id: string, field: 'sgpa' | 'credits', value: string) => {
    setSemesters(semesters.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const calculate = () => {
    let totalCredits = 0;
    let totalPoints = 0;
    let isValid = true;

    semesters.forEach(s => {
      const sgpaVal = parseFloat(s.sgpa);
      const creditsVal = parseFloat(s.credits);
      if (s.sgpa && s.credits && !isNaN(sgpaVal) && !isNaN(creditsVal)) {
        totalCredits += creditsVal;
        totalPoints += (sgpaVal * creditsVal);
      } else if (s.sgpa || s.credits) {
        // partial row filled
        isValid = false;
      }
    });

    if (totalCredits > 0 && isValid) {
      setCgpa(totalPoints / totalCredits);
    } else {
      setCgpa(null);
    }
  };

  return (
    <ToolLayout 
      toolId="cgpa-calculator"
      howItWorks={
        <p>Your CGPA (Cumulative Grade Point Average) is calculated by multiplying each semester's GPA by its credit hours, summing those up, and dividing by the total credit hours across all semesters.</p>
      }
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="comic-card p-6 w-full md:w-2/3 bg-white">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-4 mb-4 text-sm font-bold text-gray-500 uppercase">
            <div>Semester GPA</div>
            <div>Credits</div>
            <div className="w-10"></div>
          </div>
          
          {semesters.map((sem, index) => (
            <motion.div 
              key={sem.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-[1fr_1fr_auto] gap-4 mb-3 items-center"
            >
              <input 
                type="number" 
                placeholder={`Sem ${index + 1} GPA`}
                className="comic-input w-full"
                value={sem.sgpa}
                onChange={(e) => updateSemester(sem.id, 'sgpa', e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Credits"
                className="comic-input w-full"
                value={sem.credits}
                onChange={(e) => updateSemester(sem.id, 'credits', e.target.value)}
              />
              <button 
                onClick={() => removeSemester(sem.id)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                disabled={semesters.length <= 1}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}

          <div className="flex gap-4 mt-6">
            <button 
              onClick={addSemester}
              className="flex-1 comic-btn comic-btn-secondary py-3 flex justify-center items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Add Semester
            </button>
            <button 
              onClick={calculate}
              className="flex-1 comic-btn comic-btn-primary py-3"
            >
              Calculate
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/3">
          <div className={`comic-card p-6 text-center ${cgpa !== null ? 'bg-comic-blue text-white' : 'bg-gray-50 text-gray-400 border-gray-300'}`}>
            <h3 className="font-display text-2xl mb-2 text-inherit drop-shadow-none">Your CGPA</h3>
            {cgpa !== null ? (
              <div className="font-display text-6xl drop-shadow-[3px_3px_0px_#1E1E24] text-[#dfb50f] bg-[#fff9f9]">
                {cgpa.toFixed(2)}
              </div>
            ) : (
              <div className="text-xl font-bold py-8 text-[#dfb50f] bg-[#fff9f9]">Fill the details to see result</div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
