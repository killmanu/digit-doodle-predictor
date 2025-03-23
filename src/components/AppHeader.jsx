
import React from 'react';
import { Github } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="bg-white/70 backdrop-blur-sm border-b border-indigo-100 py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <h1 className="text-xl font-semibold text-gray-800">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Digit Doodle Predictor
              </span>
            </h1>
          </div>
          
          <a 
            href="https://github.com/yourusername/digit-doodle-predictor" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
