
import React, { useRef, useState, useEffect } from 'react';
import { Eraser, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '../hooks/use-mobile';

const DrawingCanvas = ({ onImageGenerated, isProcessing, onPredict }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const isMobile = useIsMobile();
  
  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas to white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set drawing style
    ctx.lineWidth = 25;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'black';
  }, []);
  
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Get cursor position
    const x = ((e.clientX || e.touches[0].clientX) - rect.left) * (canvas.width / rect.width);
    const y = ((e.clientY || e.touches[0].clientY) - rect.top) * (canvas.height / rect.height);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };
  
  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Get cursor position
    const x = ((e.clientX || e.touches[0].clientX) - rect.left) * (canvas.width / rect.width);
    const y = ((e.clientY || e.touches[0].clientY) - rect.top) * (canvas.height / rect.height);
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawing(true);
  };
  
  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.closePath();
      setIsDrawing(false);
      
      if (hasDrawing) {
        const imageData = canvas.toDataURL('image/png');
        onImageGenerated(imageData);
      }
    }
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setHasDrawing(false);
    onImageGenerated(null);
  };
  
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-purple-700 mb-2">Draw a Digit</h2>
      <p className="text-gray-600 mb-4">Draw a single digit (0-9) in the box below</p>
      
      <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="touch-none cursor-crosshair w-full h-auto"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <div className="flex gap-3 justify-center mt-2">
        <Button
          variant="outline"
          onClick={clearCanvas}
          className="flex items-center gap-2"
        >
          <Eraser className="w-4 h-4" />
          <span>Clear</span>
        </Button>
        
        <Button
          onClick={onPredict}
          disabled={!hasDrawing || isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> 
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Predict Digit</span> 
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
