import React, { useState } from 'react';
import AppHeader from '../components/AppHeader';
import FileUpload from '../components/FileUpload';
import DrawingCanvas from '../components/DrawingCanvas';
import PredictionDisplay from '../components/PredictionDisplay';
import { predictDigit } from '../services/api';
import { resizeImageToMnistFormat, fileToDataUrl } from '../utils/imageProcessing';
import { PenLine, Upload } from 'lucide-react';
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
    setInputMode(InputMode.UPLOAD);
    setPrediction(null);
  };

  const switchToDraw = () => {
    setInputMode(InputMode.DRAW);
    setPrediction(null);
  };

  const closeInput = () => {
    setInputMode(InputMode.NONE);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-indigo-50">
      <AppHeader />
      
      <main className="flex-1 container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="inline-flex rounded-full p-1 bg-white/80 shadow-lg backdrop-blur-sm border border-indigo-100">
              <button
                className={`px-5 py-2 rounded-full flex items-center gap-2 transition-all ${
                  inputMode === InputMode.UPLOAD 
                    ? 'bg-indigo-500 text-white shadow-md' 
                    : 'hover:bg-indigo-100 text-indigo-700'
                }`}
                onClick={inputMode === InputMode.UPLOAD ? closeInput : switchToUpload}
              >
                <Upload className="w-4 h-4" />
                {inputMode === InputMode.UPLOAD ? 'Hide Upload' : 'Upload'}
              </button>
              <button
                className={`px-5 py-2 rounded-full flex items-center gap-2 transition-all ${
                  inputMode === InputMode.DRAW 
                    ? 'bg-indigo-500 text-white shadow-md' 
                    : 'hover:bg-indigo-100 text-indigo-700'
                }`}
                onClick={inputMode === InputMode.DRAW ? closeInput : switchToDraw}
              >
                <PenLine className="w-4 h-4" />
                {inputMode === InputMode.DRAW ? 'Hide Canvas' : 'Draw'}
              </button>
            </div>
          </div>
          
          {inputMode !== InputMode.NONE ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="animate-slide-up backdrop-blur-sm bg-white/60 rounded-2xl p-6 shadow-xl border border-white/80">
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
              
              <div className="animate-slide-up backdrop-blur-sm bg-white/60 rounded-2xl p-6 shadow-xl border border-white/80" style={{ animationDelay: '100ms' }}>
                <PredictionDisplay 
                  prediction={prediction}
                  confidence={confidence}
                  isProcessing={isProcessing} 
                />
              </div>
            </div>
          ) : null}
        </div>
      </main>
      
      <footer className="py-6 border-t border-indigo-100/50 bg-white/50 backdrop-blur-sm">
        <div className="container text-center text-sm text-indigo-500">
          Handwritten Digit Recognition • 
          <a href="https://github.com" className="text-indigo-700 hover:underline ml-1" target="_blank" rel="noreferrer">
            View Source
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
