
import React from 'react';
import { Sparkles } from 'lucide-react';

const AppHeader = () => {
  return (
    <header className="w-full py-14 bg-gradient-to-r from-indigo-600/10 via-purple-500/15 to-pink-500/10 backdrop-blur-sm border-b border-white/20 animate-slide-down">
      <div className="container">
        <div className="flex flex-col items-center text-center space-y-5">
          <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-indigo-600 font-semibold bg-white/60 px-4 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI Powered</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Digit Recognition
          </h1>
          <p className="text-indigo-900/70 max-w-lg mt-2 bg-white/60 px-6 py-3 rounded-full shadow-sm">
            Upload an image or draw a digit to see the neural network prediction
          </p>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
