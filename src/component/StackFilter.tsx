import React, { useState } from 'react';
  
export const StackFilter: React.FC<{ onFilter: (stack: string) => void }> = ({ onFilter }) => {
  const stacks = ['Frontend', 'Backend', 'AI/ML', 'Java', 'Full Stack', 'DevOps'];
  
  return (
    <div className="flex flex-wrap gap-3 mb-8 justify-center">
      {stacks.map((stack) => (
        <button
          key={stack}
          onClick={() => onFilter(stack)}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 
                    text-white hover:from-blue-600 hover:to-purple-700 
                    transition-all duration-300 transform hover:scale-105"
        >
          {stack}
        </button>
      ))}
    </div>
  );
};