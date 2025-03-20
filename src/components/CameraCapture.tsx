
import React, { useRef, useState, useEffect } from 'react';
import { Camera, XCircle, Redo } from 'lucide-react';

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

  useEffect(() => {
    // Cleanup function to stop camera stream when component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraStream(stream);
      setIsCameraActive(true);
      setHasPermission(true);
      // Clear any previously captured image
      onImageCaptured('');
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
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
  };

  const retakePhoto = () => {
    onImageCaptured('');
    startCamera();
  };

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
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                {hasPermission === false ? (
                  <div className="text-center p-4">
                    <p className="text-red-500 mb-2">Camera access denied</p>
                    <p className="text-gray-600 text-sm">Please allow camera access in your browser settings and try again.</p>
                  </div>
                ) : (
                  <>
                    <Camera className="w-16 h-16 text-pink-400" />
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
