import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

export const WordCounter = () => {
  const [text, setText] = useState('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const charNoSpaces = text.replace(/\s/g, '').length;
  const readingTime = Math.ceil(wordCount / 200); // avg reading speed 200wpm

  return (
    <ToolLayout toolId="word-counter">
      <div className="space-y-6">
        <textarea 
          className="comic-card w-full p-4 h-64 font-sans resize-y focus:outline-none focus:ring-4 focus:ring-comic-yellow"
          placeholder="Type or paste your essay here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Words" value={wordCount} color="bg-comic-blue" />
          <StatBox label="Characters" value={charCount} color="bg-comic-green" />
          <StatBox label="No Spaces" value={charNoSpaces} color="bg-comic-yellow" />
          <StatBox label="Read Time" value={`${readingTime} min`} color="bg-comic-purple" textWhite />
        </div>
      </div>
    </ToolLayout>
  );
};

const StatBox = ({ label, value, color, textWhite = false }: { label: string, value: string | number, color: string, textWhite?: boolean }) => (
  <div className={`comic-card p-4 text-center ${color} ${textWhite ? 'text-white' : 'text-comic-dark'}`}>
    <div className="font-display text-4xl mb-1 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.2)]">{value}</div>
    <div className="font-bold text-sm uppercase opacity-90">{label}</div>
  </div>
);
