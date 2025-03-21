
import React, { useState, useEffect } from 'react';
import AppHeader from '../components/AppHeader';
import FileUpload from '../components/FileUpload';
import DrawingCanvas from '../components/DrawingCanvas';
import PredictionDisplay from '../components/PredictionDisplay';
import CameraCapture from '../components/CameraCapture';
import { predictDigit } from '../services/api';
import { resizeImageToMnistFormat, fileToDataUrl } from '../utils/imageProcessing';
import { PenLine, Upload, Github, Camera, Home } from 'lucide-react';
import { toast } from 'sonner';

enum InputMode {
  NONE = 'none',
  UPLOAD = 'upload',
  DRAW = 'draw',
  CAMERA = 'camera',
}

const Index = () => {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.NONE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [drawnImage, setDrawnImage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | undefined>(undefined);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleImageSelect = async (file: File) => {
    if (!file.size) {
      setSelectedImage(null);
      setPrediction(null);
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setSelectedImage(dataUrl);
      setPrediction(null);
    } catch (error) {
      console.error('Error loading image:', error);
      toast.error('Failed to load image');
    }
  };

  const handleDrawingGenerated = (imageData: string) => {
    setDrawnImage(imageData);
    if (!imageData) {
      setPrediction(null);
    }
  };

  const handleCameraCapture = (imageData: string) => {
    setCapturedImage(imageData);
    if (!imageData) {
      setPrediction(null);
    }
  };

  const handlePredict = async () => {
    let imageToPredict;
    
    switch(inputMode) {
      case InputMode.UPLOAD:
        imageToPredict = selectedImage;
        break;
      case InputMode.DRAW:
        imageToPredict = drawnImage;
        break;
      case InputMode.CAMERA:
        imageToPredict = capturedImage;
        break;
      default:
        imageToPredict = null;
    }
    
    if (!imageToPredict) {
      toast.warning('Please upload, draw, or capture an image first');
      return;
    }

    setIsProcessing(true);
    setPrediction(null);

    try {
      const processedImage = await resizeImageToMnistFormat(imageToPredict);
      
      const result = await predictDigit(processedImage);
      
      setPrediction(result.prediction);
      setConfidence(result.confidence);
      
      toast.success('Prediction complete!');
    } catch (error) {
      console.error('Error predicting digit:', error);
      toast.error('Failed to process the image');
    } finally {
      setIsProcessing(false);
    }
  };

  const setMode = (mode: InputMode) => {
    // If same mode is clicked, don't clear it
    if (inputMode === mode && mode !== InputMode.NONE) {
      return;
    }
    
    setInputMode(mode);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      <AppHeader />
      
      <div className="bg-white/40 backdrop-blur-sm border-b border-indigo-100 py-2 sticky top-0 z-10 animate-fade-in">
        <div className="container">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button 
              onClick={() => setMode(InputMode.NONE)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${inputMode === InputMode.NONE 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'hover:bg-white/60 text-indigo-600'}`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => setMode(InputMode.UPLOAD)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${inputMode === InputMode.UPLOAD 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'hover:bg-white/60 text-indigo-600'}`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </button>
            
            <button
              onClick={() => setMode(InputMode.DRAW)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${inputMode === InputMode.DRAW 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'hover:bg-white/60 text-purple-600'}`}
            >
              <PenLine className="w-4 h-4" />
              <span>Draw</span>
            </button>
            
            <button
              onClick={() => setMode(InputMode.CAMERA)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${inputMode === InputMode.CAMERA 
                  ? 'bg-pink-100 text-pink-700' 
                  : 'hover:bg-white/60 text-pink-600'}`}
            >
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </button>
          </div>
        </div>
      </div>
      
      <main className={`flex-1 container py-10 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-5xl mx-auto">
          
          {inputMode !== InputMode.NONE ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-fade-in" style={{ animationDelay: '800ms' }}>
              <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-7 shadow-xl border border-white/80 hover:shadow-2xl transition-all duration-300">
                {inputMode === InputMode.UPLOAD && (
                  <FileUpload 
                    onImageSelect={handleImageSelect}
                    selectedImage={selectedImage}
                    isProcessing={isProcessing}
                    onPredict={handlePredict}
                  />
                )}
                
                {inputMode === InputMode.DRAW && (
                  <DrawingCanvas 
                    onImageGenerated={handleDrawingGenerated}
                    isProcessing={isProcessing}
                    onPredict={handlePredict}
                  />
                )}

                {inputMode === InputMode.CAMERA && (
                  <CameraCapture 
                    onImageCaptured={handleCameraCapture}
                    capturedImage={capturedImage}
                    isProcessing={isProcessing}
                    onPredict={handlePredict}
                  />
                )}
              </div>
              
              <div className="backdrop-blur-sm bg-white/70 rounded-2xl p-7 shadow-xl border border-white/80 hover:shadow-2xl transition-all duration-300">
                <PredictionDisplay 
                  prediction={prediction}
                  confidence={confidence}
                  isProcessing={isProcessing} 
                />
              </div>
            </div>
          ) : (
            <div className="animate-fade-in flex flex-col items-center justify-center p-10 backdrop-blur-sm bg-white/60 rounded-2xl shadow-xl border border-white/80 max-w-2xl mx-auto" style={{ animationDelay: '700ms' }}>
              <div className="mb-8 p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-indigo-100/50">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center mb-6 shadow-md mx-auto">
                  <span className="text-5xl font-medium text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text">?</span>
                </div>
                <p className="text-indigo-700/80 text-center text-lg">
                  Select an option below to get started
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
                <button
                  onClick={() => setMode(InputMode.UPLOAD)}
                  className="py-4 px-6 rounded-xl bg-white border border-indigo-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <Upload className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="font-medium text-indigo-700">Upload</span>
                </button>
                
                <button
                  onClick={() => setMode(InputMode.DRAW)}
                  className="py-4 px-6 rounded-xl bg-white border border-indigo-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <PenLine className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="font-medium text-purple-700">Draw</span>
                </button>

                <button
                  onClick={() => setMode(InputMode.CAMERA)}
                  className="py-4 px-6 rounded-xl bg-white border border-indigo-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                    <Camera className="w-6 h-6 text-pink-600" />
                  </div>
                  <span className="font-medium text-pink-700">Camera</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
