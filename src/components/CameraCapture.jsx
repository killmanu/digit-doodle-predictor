
import React, { useRef, useState, useEffect } from 'react';
import { Camera, StopCircle, RotateCcw } from 'lucide-react';

const CameraCapture = ({ onImageCapture, isProcessing, onPredict }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [stream, setStream] = useState(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);
  
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };
  
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsActive(false);
  };
  
  const captureImage = () => {
    if (!videoRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL and send it up
      const imageData = canvas.toDataURL('image/png');
      onImageCapture(imageData);
      setHasImage(true);
      
      // Stop the camera after capturing
      stopCamera();
    }
  };
  
  const resetCamera = () => {
    setHasImage(false);
    onImageCapture('');
    startCamera();
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-white rounded-xl p-4 shadow-md mb-4 w-full border border-indigo-100">
        {isActive ? (
          <div className="relative w-full">
            <video 
              ref={videoRef} 
              className="w-full h-full rounded-lg border-2 border-indigo-100/50"
              autoPlay 
              playsInline
            />
            <button
              onClick={captureImage}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white w-14 h-14 rounded-full border-4 border-indigo-500 shadow-lg"
            />
          </div>
        ) : hasImage ? (
          <div className="relative w-full pt-[75%]">
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full object-contain rounded-lg border-2 border-indigo-100/50"
            />
          </div>
        ) : (
          <div 
            className="w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 border-indigo-200"
            onClick={startCamera}
          >
            <Camera className="h-10 w-10 text-indigo-500 mb-4" />
            <p className="text-center text-indigo-600/70 mb-4">
              Click to activate camera
            </p>
            <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-all">
              Start Camera
            </button>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-3">
        {isActive && (
          <button
            className="px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 shadow hover:shadow-md transition-all flex items-center gap-2"
            onClick={stopCamera}
          >
            <StopCircle className="w-4 h-4" />
            Cancel
          </button>
        )}
        
        {hasImage && (
          <>
            <button
              className="px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 shadow hover:shadow-md transition-all flex items-center gap-2"
              onClick={resetCamera}
            >
              <RotateCcw className="w-4 h-4" />
              New Photo
            </button>
            <button
              className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow hover:shadow-md transition-all flex items-center gap-2"
              onClick={onPredict}
              disabled={isProcessing}
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
          </>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
