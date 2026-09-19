import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { motion } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';

interface Course {
  id: string;
  grade: string;
  credits: string;
}

const gradeScale: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0
};

export const GPACalculator = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', grade: 'A', credits: '3' },
    { id: '2', grade: 'B', credits: '3' },
    { id: '3', grade: '', credits: '' }
  ]);
  const [gpa, setGpa] = useState<number | null>(null);

  const addCourse = () => {
    setCourses([...courses, { id: Math.random().toString(), grade: '', credits: '' }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: 'grade' | 'credits', value: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value.toUpperCase() } : c));
  };

  const calculate = () => {
    let totalCredits = 0;
    let totalPoints = 0;
    let isValid = true;

    courses.forEach(c => {
      const gradeVal = gradeScale[c.grade];
      const creditsVal = parseFloat(c.credits);
      
      if (c.grade && c.credits && gradeVal !== undefined && !isNaN(creditsVal)) {
        totalCredits += creditsVal;
        totalPoints += (gradeVal * creditsVal);
      } else if (c.grade || c.credits) {
        isValid = false;
      }
    });

    if (totalCredits > 0 && isValid) {
      setGpa(totalPoints / totalCredits);
    } else {
      setGpa(null);
    }
  };

  return (
    <ToolLayout 
      toolId="gpa-calculator"
      howItWorks={<p>Enter your letter grade (A, B+, C, etc.) and the credits for each course. We use the standard 4.0 scale to calculate your Grade Point Average.</p>}
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="comic-card p-6 w-full md:w-2/3 bg-white">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-4 mb-4 text-sm font-bold text-gray-500 uppercase">
            <div>Letter Grade</div>
            <div>Credits</div>
            <div className="w-10"></div>
          </div>
          
          {courses.map((course, index) => (
            <motion.div 
              key={course.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid grid-cols-[1fr_1fr_auto] gap-4 mb-3 items-center"
            >
              <input 
                type="text" 
                placeholder="e.g. A, B+"
                className="comic-input w-full uppercase"
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
              />
              <input 
                type="number" 
                placeholder="Credits"
                className="comic-input w-full"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
              />
              <button 
                onClick={() => removeCourse(course.id)}
                className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                disabled={courses.length <= 1}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}

          <div className="flex gap-4 mt-6">
            <button 
              onClick={addCourse}
              className="flex-1 comic-btn comic-btn-secondary py-3 flex justify-center items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Add Course
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
          <div className={`comic-card p-6 text-center ${gpa !== null ? 'bg-comic-red text-white' : 'bg-gray-50 text-gray-400 border-gray-300'}`}>
            <h3 className="font-display text-2xl mb-2 text-inherit drop-shadow-none">Your GPA</h3>
            {gpa !== null ? (
              <div className="font-display text-6xl drop-shadow-[3px_3px_0px_#1E1E24] text-[#dfb50f] bg-[#fff9f9]">
                {gpa.toFixed(2)}
              </div>
            ) : (
              <div className="text-xl font-bold py-8 text-[#dfb50f] bg-[#fff9f9]">Fill the details</div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};
