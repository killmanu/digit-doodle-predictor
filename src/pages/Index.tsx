
import React, { useState } from 'react';
import AppHeader from '../components/AppHeader';
import FileUpload from '../components/FileUpload';
import DrawingCanvas from '../components/DrawingCanvas';
import PredictionDisplay from '../components/PredictionDisplay';
import { predictDigit } from '../services/api';
import { resizeImageToMnistFormat, fileToDataUrl } from '../utils/imageProcessing';
import { PenLine, Upload, Github } from 'lucide-react';
import { toast } from 'sonner';

enum InputMode {
  NONE = 'none',
  UPLOAD = 'upload',
  DRAW = 'draw',
}

const Index = () => {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.NONE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [drawnImage, setDrawnImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | undefined>(undefined);

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

  const handlePredict = async () => {
    let imageToPredict = inputMode === InputMode.UPLOAD ? selectedImage : drawnImage;
    
    if (!imageToPredict) {
      toast.warning('Please upload or draw an image first');
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

  const switchToUpload = () => {
    setInputMode(inputMode === InputMode.UPLOAD ? InputMode.NONE : InputMode.UPLOAD);
    setPrediction(null);
  };

  const switchToDraw = () => {
    setInputMode(inputMode === InputMode.DRAW ? InputMode.NONE : InputMode.DRAW);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50">
      <AppHeader />
      
      <main className="flex-1 container py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-10 animate-fade-in">
            <div className="inline-flex rounded-full p-1.5 bg-white/80 shadow-lg backdrop-blur-sm border border-indigo-100">
              <button
                className={`px-6 py-2.5 rounded-full flex items-center gap-2 transition-all ${
                  inputMode === InputMode.UPLOAD 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                    : 'hover:bg-indigo-100 text-indigo-700'
                }`}
                onClick={switchToUpload}
              >
                <Upload className="w-4 h-4" />
                {inputMode === InputMode.UPLOAD ? 'Hide Upload' : 'Upload'}
              </button>
              <button
                className={`px-6 py-2.5 rounded-full flex items-center gap-2 transition-all ${
                  inputMode === InputMode.DRAW 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' 
                    : 'hover:bg-indigo-100 text-indigo-700'
                }`}
                onClick={switchToDraw}
              >
                <PenLine className="w-4 h-4" />
                {inputMode === InputMode.DRAW ? 'Hide Canvas' : 'Draw'}
              </button>
            </div>
          </div>
          
          {inputMode !== InputMode.NONE ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="animate-slide-up backdrop-blur-sm bg-white/70 rounded-2xl p-7 shadow-xl border border-white/80 hover:shadow-2xl transition-all duration-300">
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
              </div>
              
              <div className="animate-slide-up backdrop-blur-sm bg-white/70 rounded-2xl p-7 shadow-xl border border-white/80 hover:shadow-2xl transition-all duration-300" style={{ animationDelay: '100ms' }}>
                <PredictionDisplay 
                  prediction={prediction}
                  confidence={confidence}
                  isProcessing={isProcessing} 
                />
              </div>
            </div>
          ) : (
            <div className="animate-fade-in flex flex-col items-center justify-center p-10 backdrop-blur-sm bg-white/60 rounded-2xl shadow-xl border border-white/80 max-w-2xl mx-auto">
              <div className="mb-8 p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-indigo-100/50">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center mb-6 shadow-md mx-auto">
                  <span className="text-5xl font-medium text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text">?</span>
                </div>
                <p className="text-indigo-700/80 text-center text-lg">
                  Select <span className="font-semibold">"Upload"</span> or <span className="font-semibold">"Draw"</span> to get started
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                <button
                  onClick={switchToUpload}
                  className="py-4 px-6 rounded-xl bg-white border border-indigo-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <Upload className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="font-medium text-indigo-700">Upload Image</span>
                </button>
                
                <button
                  onClick={switchToDraw}
                  className="py-4 px-6 rounded-xl bg-white border border-indigo-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <PenLine className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="font-medium text-purple-700">Draw Digit</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-6 border-t border-indigo-100/50 bg-white/50 backdrop-blur-sm">
        <div className="container text-center text-sm text-indigo-500">
          <div className="flex items-center justify-center gap-2">
            <span>Handwritten Digit Recognition</span>
            <span className="text-indigo-300">•</span>
            <a href="https://github.com" className="text-indigo-700 hover:underline flex items-center gap-1" target="_blank" rel="noreferrer">
              <Github className="w-3.5 h-3.5" />
              View Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
