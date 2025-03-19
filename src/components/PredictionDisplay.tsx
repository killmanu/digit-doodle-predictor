
import React from 'react';

interface PredictionDisplayProps {
  prediction: number | null;
  confidence?: number;
  isProcessing: boolean;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ 
  prediction, 
  confidence, 
  isProcessing 
}) => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="digit-container w-full max-w-sm h-full min-h-[280px] flex flex-col items-center justify-center">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-6"></div>
            <p className="text-muted-foreground">Processing digit...</p>
          </div>
        ) : prediction !== null ? (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="result-display">{prediction}</div>
            {confidence !== undefined && (
              <div className="mt-2 text-sm text-muted-foreground">
                Confidence: {(confidence * 100).toFixed(2)}%
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center px-4">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
              <span className="text-4xl font-light text-muted-foreground">?</span>
            </div>
            <p className="text-muted-foreground">Upload an image or draw a digit to see the prediction</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionDisplay;
