
import React, { useRef, useState, useEffect } from 'react';
import { Camera, XCircle, Redo } from 'lucide-react';
import { toast } from 'sonner';

interface CameraCaptureProps {
  onImageCaptured: (imageData: string) => void;
  capturedImage: string | null;
  isProcessing: boolean;
  onPredict: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onImageCaptured, 
  capturedImage, 
  isProcessing,
  onPredict 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup function to stop camera stream when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setStreamError(null);
      
      // Stop any existing streams first
      stopCamera();
      
      // Try to get the camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 640 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => {
            console.error('Error playing video:', e);
            setStreamError('Could not play video stream');
            toast.error('Failed to start video stream');
          });
        };
      }
      
      setCameraStream(stream);
      setIsCameraActive(true);
      setHasPermission(true);
      
      // Clear any previously captured image
      onImageCaptured('');
      
      console.log('Camera started successfully');
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      
      // Provide more specific error messages
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          setStreamError('Camera access denied. Please allow camera access in your browser settings.');
          toast.error('Camera access denied');
        } else if (error.name === 'NotFoundError') {
          setStreamError('No camera found on this device.');
          toast.error('No camera found');
        } else if (error.name === 'NotReadableError') {
          setStreamError('Camera is already in use by another application.');
          toast.error('Camera is in use by another app');
        } else {
          setStreamError(`Camera error: ${error.message}`);
          toast.error('Camera error occurred');
        }
      } else {
        setStreamError('Failed to access camera');
        toast.error('Failed to access camera');
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        track.stop();
      });
      setCameraStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      toast.error('Failed to capture image');
      return;
    }
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) {
      toast.error('Failed to get canvas context');
      return;
    }
    
    try {
      // Set canvas dimensions to create a square crop from the center
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = size;
      canvas.height = size;
      
      // Calculate the cropping position (center of the video)
      const x = (video.videoWidth - size) / 2;
      const y = (video.videoHeight - size) / 2;
      
      // Draw the video frame to the canvas, cropping to a square
      context.drawImage(
        video, 
        x, y, size, size,
        0, 0, size, size
      );
      
      // Get the image data
      const imageData = canvas.toDataURL('image/png');
      onImageCaptured(imageData);
      
      // Stop the camera after capturing
      stopCamera();
      
      toast.success('Image captured');
    } catch (error) {
      console.error('Error capturing image:', error);
      toast.error('Failed to capture image');
    }
  };

  const retakePhoto = () => {
    onImageCaptured('');
    startCamera();
  };

  // Automatically start camera when component mounts
  useEffect(() => {
    if (!capturedImage && !isCameraActive) {
      startCamera();
    }
  }, [capturedImage]);

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className="bg-white rounded-xl p-4 shadow-md mb-4 w-full border border-indigo-100">
        {!capturedImage ? (
          <div className="relative w-full pt-[100%] rounded-lg overflow-hidden bg-gray-100">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {hasPermission === false ? (
                  <div className="text-center p-4">
                    <p className="text-red-500 mb-2">Camera access issue</p>
                    <p className="text-gray-600 text-sm">{streamError || 'Please allow camera access in your browser settings and try again.'}</p>
                    <button
                      className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                      onClick={startCamera}
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    <Camera className="w-16 h-16 text-pink-400" />
                    <p className="text-gray-500">Loading camera...</p>
                    <button
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
                      onClick={startCamera}
                    >
                      Start Camera
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full pt-[100%] rounded-lg overflow-hidden">
            <img
              src={capturedImage}
              alt="Captured"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        )}
        
        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="flex justify-center gap-3">
        {isCameraActive ? (
          <button
            className="px-5 py-2 rounded-full bg-pink-500 text-white shadow hover:shadow-md transition-all flex items-center gap-2"
            onClick={captureImage}
            disabled={isProcessing}
          >
            <Camera className="w-4 h-4" />
            Capture
          </button>
        ) : capturedImage ? (
          <>
            <button
              className="px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 shadow hover:shadow-md transition-all flex items-center gap-2"
              onClick={retakePhoto}
              disabled={isProcessing}
            >
              <Redo className="w-4 h-4" />
              Retake
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
        ) : null}
      </div>
    </div>
  );
};

export default CameraCapture;
