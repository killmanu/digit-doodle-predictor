
import React from 'react';

const AppHeader = () => {
  return (
    <header className="w-full py-14 bg-gradient-to-r from-indigo-600/10 via-purple-500/15 to-pink-500/10 backdrop-blur-sm border-b border-white/20 animate-slide-down">
      <div className="container">
        <div className="flex flex-col items-center text-center space-y-5">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
            Digit Recognition
          </h1>
          <p className="text-indigo-900/70 max-w-lg mt-2 bg-white/60 px-6 py-3 rounded-full shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
            Upload an image or draw a digit to see the neural network prediction
          </p>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
