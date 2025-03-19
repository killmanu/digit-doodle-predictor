
import React from 'react';

const AppHeader = () => {
  return (
    <header className="w-full py-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border-b border-white/20 animate-slide-down">
      <div className="container">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="text-sm uppercase tracking-wider text-indigo-600 font-semibold bg-white/50 px-4 py-1 rounded-full shadow-sm">
            Handwritten
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
            Digit Recognition
          </h1>
          <p className="text-indigo-900/70 max-w-md mt-2 bg-white/50 px-6 py-3 rounded-full shadow-sm">
            Upload an image or draw a digit to see the neural network prediction
          </p>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
