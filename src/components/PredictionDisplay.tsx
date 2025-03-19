
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
      <div className="w-full h-full min-h-[280px] flex flex-col items-center justify-center">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-300 border-t-indigo-600 animate-spin mb-6"></div>
            <p className="text-indigo-600/70">Processing digit...</p>
          </div>
        ) : prediction !== null ? (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="text-[120px] font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text leading-none">
              {prediction}
            </div>
            {confidence !== undefined && (
              <div className="mt-2 text-sm text-indigo-600/70 bg-white/50 px-4 py-1 rounded-full shadow-sm">
                Confidence: {(confidence * 100).toFixed(2)}%
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center px-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6 shadow-md">
              <span className="text-4xl font-medium text-indigo-500">?</span>
            </div>
            <p className="text-indigo-600/70 bg-white/50 px-4 py-2 rounded-full shadow-sm">
              Upload an image or draw a digit to see the prediction
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionDisplay;
