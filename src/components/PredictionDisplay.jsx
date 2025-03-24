
import React from 'react';
import { Lightbulb, Sigma } from 'lucide-react';

const PredictionDisplay = ({ prediction, confidence, isProcessing }) => {
  const renderConfidenceBar = (confidence) => {
    // Convert confidence value to percentage for visualization
    const percentage = confidence ? Math.round(confidence * 100) : 0;
    
    return (
      <div className="mt-3">
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-gray-600">Confidence:</span>
          <span className="font-medium text-indigo-600">{percentage}%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Prediction Result</h2>
      
      {isProcessing ? (
        <div className="py-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <p className="text-indigo-700 font-medium">Analyzing image...</p>
        </div>
      ) : prediction ? (
        <div className="flex flex-col items-center py-6">
          <div className="mb-6 w-28 h-28 rounded-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center shadow-md">
            <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              {prediction}
            </span>
          </div>
          
          {confidence !== undefined && renderConfidenceBar(confidence)}
          
          <div className="mt-6 bg-indigo-50 text-indigo-700 rounded-lg p-4 flex items-start max-w-xs">
            <Lightbulb className="w-5 h-5 mr-2 text-indigo-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              This is the model's best guess based on the provided image. Try another image if it's incorrect!
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 px-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Sigma className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Prediction Yet</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            Upload an image or draw a digit, then click "Predict Digit" to see the result.
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionDisplay;
