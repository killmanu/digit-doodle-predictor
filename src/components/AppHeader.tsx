
import React from 'react';

const AppHeader = () => {
  return (
    <header className="w-full py-6 animate-slide-down">
      <div className="container">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
            Handwritten
          </div>
          <h1 className="text-3xl font-medium tracking-tight">Digit Recognition</h1>
          <p className="text-muted-foreground max-w-md mt-1">
            Upload an image or draw a digit to see the neural network prediction
          </p>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
