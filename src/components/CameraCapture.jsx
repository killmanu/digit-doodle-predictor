
import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCcw, Check, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const CameraCapture = ({ onImageCaptured, capturedImage, isProcessing, onPredict }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [error, setError] = useState(null);
  
  // Start camera stream
  const startCamera = async () => {
    try {
      setError(null);
      // Stop any existing stream first
      stopCamera();
      
      console.log('Attempting to start camera...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.error('Error playing video:', err);
              setError('Could not play video stream');
            });
          }
        };
        setStream(mediaStream);
        setCameraActive(true);
        setHasPermission(true);
        console.log('Camera started successfully');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      
      if (err.name === 'NotAllowedError') {
        setHasPermission(false);
        toast.error('Camera access denied. Please allow camera access.');
      } else {
        setError(`Could not access the camera: ${err.message}`);
        toast.error('Could not access the camera');
      }
    }
  };
  
  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Automatically start camera when component mounts if no image is captured
  useEffect(() => {
    if (!capturedImage && !cameraActive && !error) {
      console.log('Auto-starting camera...');
      startCamera();
    }
  }, [capturedImage, cameraActive]);
  
  // Capture image from camera
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref is not available');
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) {
      console.error('Could not get canvas context');
      return;
    }
    
    try {
      // Get video dimensions
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      
      if (!videoWidth || !videoHeight) {
        console.error('Video dimensions not available');
        return;
      }
      
      console.log(`Video dimensions: ${videoWidth}x${videoHeight}`);
      
      // Use the smaller dimension to make a square
      const size = Math.min(videoWidth, videoHeight);
      
      // Calculate cropping position (center of the video)
      const xStart = (videoWidth - size) / 2;
      const yStart = (videoHeight - size) / 2;
      
      // Set canvas size to match the square crop
      canvas.width = canvas.height = size;
      
      // Draw the cropped square to the canvas
      context.drawImage(
        video,
        xStart, yStart, size, size,  // Source rectangle
        0, 0, size, size             // Destination rectangle
      );
      
      // Convert to data URL and send to parent
      const imageData = canvas.toDataURL('image/png');
      onImageCaptured(imageData);
      
      // Stop the camera
      stopCamera();
      
      console.log('Image captured successfully');
    } catch (err) {
      console.error('Error capturing image:', err);
      toast.error('Failed to capture image');
    }
  };
  
  const resetCapture = () => {
    onImageCaptured(null);
    startCamera();
  };
  
  const handleRetakeClick = () => {
    resetCapture();
  };
  
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-pink-700 mb-2">Capture a Digit</h2>
      <p className="text-gray-600 mb-4">Take a picture of a handwritten digit (0-9)</p>
      
      <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-300 relative">
        {/* Camera Display or Captured Image */}
        {capturedImage ? (
          <div className="relative">
            <img 
              src={capturedImage} 
              alt="Captured digit" 
              className="w-full h-auto"
            />
            <button 
              onClick={handleRetakeClick}
              className="absolute top-3 right-3 bg-white/80 text-gray-700 rounded-full p-1.5 opacity-80 hover:opacity-100 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            {cameraActive ? (
              <div className="relative aspect-square">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-white/70 pointer-events-none"></div>
              </div>
            ) : (
              <div className="aspect-square flex flex-col items-center justify-center p-4">
                {error ? (
                  <div className="text-center">
                    <div className="bg-red-100 text-red-500 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="text-red-500 font-medium">{error}</p>
                    <button
                      onClick={startCamera}
                      className="mt-4 text-pink-600 hover:text-pink-700 underline text-sm"
                    >
                      Try again
                    </button>
                  </div>
                ) : hasPermission === false ? (
                  <div className="text-center">
                    <div className="bg-orange-100 text-orange-500 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-3">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="text-gray-700 font-medium">Camera permission denied</p>
                    <p className="text-gray-500 text-sm mt-1 mb-3">
                      Please enable camera access in your browser settings
                    </p>
                    <button
                      onClick={startCamera}
                      className="text-pink-600 hover:text-pink-700 underline text-sm"
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startCamera}
                    className="bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors rounded-full w-20 h-20 flex items-center justify-center"
                  >
                    <Camera className="w-10 h-10" />
                  </button>
                )}
              </div>
            )}
          </>
        )}
        
        {/* Hidden canvas for capturing images */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      
      <div className="flex justify-center gap-3 mt-2">
        {capturedImage ? (
          <>
            <Button
              variant="outline"
              onClick={handleRetakeClick}
              className="flex items-center gap-2"
              disabled={isProcessing}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake</span>
            </Button>
            
            <Button
              onClick={onPredict}
              disabled={isProcessing}
              className="flex items-center gap-2"
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
          </>
        ) : cameraActive && (
          <Button
            onClick={captureImage}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Capture</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
