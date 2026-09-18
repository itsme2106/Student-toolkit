import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import confetti from 'canvas-confetti';

const studyQuotes = [
  "Focus on the step in front of you, not the whole staircase.",
  "The secret of getting ahead is getting started.",
  "Starve your distractions, feed your focus.",
  "Small disciplines repeated with consistency lead to great achievements.",
  "Your future is created by what you do today, not tomorrow."
];

const breakQuotes = [
  "Great job! Now step away and rest your eyes.",
  "You earned this break. Stretch and hydrate!",
  "Rest is not a waste of time, it's an investment in your focus.",
  "Breathe in, breathe out. You're doing great."
];

const playSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playNote(440, now, 0.2);
    playNote(554.37, now + 0.15, 0.2);
    playNote(659.25, now + 0.3, 0.4);
    playNote(880, now + 0.45, 0.6);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

const fireFireworks = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
  }, 250);
};

export const PomodoroTimer = () => {
  const [studyDuration, setStudyDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [quote, setQuote] = useState(studyQuotes[0]);
  const [showSettings, setShowSettings] = useState(false);

  const durations = useRef({ study: 25, break: 5 });
  
  useEffect(() => {
    durations.current = { study: studyDuration, break: breakDuration };
  }, [studyDuration, breakDuration]);

  const switchMode = useCallback((newMode: 'study' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'study' ? durations.current.study * 60 : durations.current.break * 60);
    setQuote(newMode === 'study' 
      ? studyQuotes[Math.floor(Math.random() * studyQuotes.length)] 
      : breakQuotes[Math.floor(Math.random() * breakQuotes.length)]
    );
  }, []);

  const handleStudyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newStudy = parseInt(e.target.value);
    if (isNaN(newStudy)) return;
    newStudy = Math.max(1, newStudy);
    
    setStudyDuration(newStudy);
    
    // Dynamically adjust break time (20% of study time)
    const newBreak = Math.max(1, Math.round(newStudy / 5));
    setBreakDuration(newBreak);
    
    if (mode === 'study' && !isActive) {
      setTimeLeft(newStudy * 60);
    }
  };

  const handleBreakChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newBreak = parseInt(e.target.value);
    if (isNaN(newBreak)) return;
    newBreak = Math.max(1, newBreak);
    
    setBreakDuration(newBreak);
    if (mode === 'break' && !isActive) {
      setTimeLeft(newBreak * 60);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      
      playSuccessSound();
      fireFireworks();
      
      setTimeout(() => {
        if (mode === 'study') {
          switchMode('break');
        } else {
          switchMode('study');
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, switchMode]);

  const toggle = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setTimeLeft(mode === 'study' ? studyDuration * 60 : breakDuration * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <ToolLayout 
      toolId="pomodoro-timer"
      howItWorks={<p>Work for your target duration, then take a proportional break. The timer dynamically calculates standard break intervals to keep your mind fresh and focused!</p>}
    >
      <div className="comic-card p-8 bg-white max-w-md mx-auto text-center relative overflow-hidden">
        
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-comic-dark hover:bg-gray-100 rounded-full transition-colors"
          title="Timer Settings"
        >
          <Settings size={24} />
        </button>

        {showSettings && (
          <div className="mb-6 p-4 border-2 border-comic-dark rounded-xl bg-gray-50 flex justify-center gap-6 animate-in slide-in-from-top-2">
            <div className="flex flex-col items-center">
              <label className="font-bold text-sm mb-1">Study (min)</label>
              <input 
                type="number" 
                value={studyDuration} 
                onChange={handleStudyChange} 
                disabled={isActive}
                min="1" max="120"
                className="comic-input w-20 text-center py-1 px-2" 
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="font-bold text-sm mb-1">Break (min)</label>
              <input 
                type="number" 
                value={breakDuration} 
                onChange={handleBreakChange} 
                disabled={isActive}
                min="1" max="60"
                className="comic-input w-20 text-center py-1 px-2" 
              />
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 mb-8 mt-4">
          <button 
            onClick={() => switchMode('study')}
            className={`px-4 py-2 font-bold rounded-xl border-[3px] border-comic-dark ${mode === 'study' ? 'bg-comic-red text-white' : 'bg-white'}`}
          >
            Study ({studyDuration}m)
          </button>
          <button 
            onClick={() => switchMode('break')}
            className={`px-4 py-2 font-bold rounded-xl border-[3px] border-comic-dark ${mode === 'break' ? 'bg-comic-green text-comic-dark' : 'bg-white'}`}
          >
            Break ({breakDuration}m)
          </button>
        </div>

        <div className="font-display text-8xl md:text-9xl mb-6 tracking-wider text-comic-dark">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="min-h-[4rem] flex items-center justify-center mb-6">
          <p className="font-bold text-gray-500 italic px-4">"{quote}"</p>
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={toggle}
            className={`p-6 rounded-full border-[3px] border-comic-dark shadow-[4px_4px_0px_#1E1E24] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1E1E24] active:shadow-[0px_0px_0px_#1E1E24] active:translate-x-[4px] active:translate-y-[4px] transition-all ${isActive ? 'bg-comic-yellow' : 'bg-comic-blue text-white'}`}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-2" />}
          </button>
          <button 
            onClick={reset}
            className="p-6 rounded-full border-[3px] border-comic-dark bg-white shadow-[4px_4px_0px_#1E1E24] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1E1E24] active:shadow-[0px_0px_0px_#1E1E24] active:translate-x-[4px] active:translate-y-[4px] transition-all"
          >
            <RotateCcw size={32} />
          </button>
        </div>
      </div>
    </ToolLayout>
  );
};
