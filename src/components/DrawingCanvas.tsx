
import React, { useRef, useState, useEffect } from 'react';
import { PenLine, Trash2, RotateCcw } from 'lucide-react';

interface DrawingCanvasProps {
  onImageGenerated: (imageData: string) => void;
  isProcessing: boolean;
  onPredict: () => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  onImageGenerated, 
  isProcessing,
  onPredict 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 15;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    setIsDrawing(true);
    setHasDrawn(true);
    
    context.beginPath();
    
    // Get coordinates
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Get coordinates
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevent scrolling on touch devices
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      
      const canvas = canvasRef.current;
      if (canvas) {
        // Generate image data and pass it up
        const imageData = canvas.toDataURL('image/png');
        onImageGenerated(imageData);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
        onImageGenerated('');
      }
    }
  };

  const undoLastStroke = () => {
    // This is a simplified undo that just clears the canvas
    // For a proper undo, you would need to track each stroke
    clearCanvas();
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className="bg-white rounded-xl p-4 shadow-md mb-4 w-full border border-indigo-100">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="drawing-canvas w-full touch-none border-2 border-indigo-100/50 rounded-lg"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex justify-center gap-3">
        <button
          className="px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 shadow hover:shadow-md transition-all flex items-center gap-2"
          onClick={clearCanvas}
          type="button"
          disabled={isProcessing || !hasDrawn}
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
        <button
          className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow hover:shadow-md transition-all flex items-center gap-2"
          onClick={onPredict}
          type="button"
          disabled={isProcessing || !hasDrawn}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              Processing...
            </div>
          ) : (
            'Predict'
          )}
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
