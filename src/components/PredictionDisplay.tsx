
import React from 'react';
import { Brain, AlertCircle } from 'lucide-react';

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
            <div className="text-[140px] font-bold text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text leading-none">
              {prediction}
            </div>
            {confidence !== undefined && (
              <div className="mt-3 text-sm flex items-center gap-2 text-indigo-600/80 bg-white/70 px-5 py-2 rounded-full shadow-sm">
                <Brain className="w-4 h-4" />
                Confidence: {(confidence * 100).toFixed(2)}%
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center px-4">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center mb-6 shadow-md">
              <span className="text-5xl font-medium text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text">?</span>
            </div>
            <p className="text-indigo-600/70 bg-white/70 px-5 py-2.5 rounded-full shadow-sm flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-indigo-500" />
              Select "Upload" or "Draw" to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionDisplay;
