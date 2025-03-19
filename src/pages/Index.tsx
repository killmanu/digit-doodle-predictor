
import React, { useState } from 'react';
import AppHeader from '../components/AppHeader';
import FileUpload from '../components/FileUpload';
import DrawingCanvas from '../components/DrawingCanvas';
import PredictionDisplay from '../components/PredictionDisplay';
import { predictDigit } from '../services/api';
import { resizeImageToMnistFormat, fileToDataUrl } from '../utils/imageProcessing';
import { PenLine, Upload } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

enum InputMode {
  UPLOAD = 'upload',
  DRAW = 'draw',
}

const Index = () => {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.UPLOAD);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [drawnImage, setDrawnImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | undefined>(undefined);

  const handleImageSelect = async (file: File) => {
    if (!file.size) {
      // User clicked "New Image" which sends an empty file
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
      // Resize the image to MNIST format (28x28 grayscale)
      const processedImage = await resizeImageToMnistFormat(imageToPredict);
      
      // Send to backend API for prediction
      const result = await predictDigit(processedImage);
      
      // Update the UI
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

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-1 container py-8">
        <div className="max-w-5xl mx-auto">
          {/* Mode Selector */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full p-1 bg-secondary">
              <button
                className={`px-5 py-2 rounded-full flex items-center gap-2 transition-all ${
                  inputMode === InputMode.UPLOAD 
                    ? 'bg-white shadow-sm' 
                    : 'hover:bg-white/50'
                }`}
                onClick={switchToUpload}
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <button
                className={`px-5 py-2 rounded-full flex items-center gap-2 transition-all ${
                  inputMode === InputMode.DRAW 
                    ? 'bg-white shadow-sm' 
                    : 'hover:bg-white/50'
                }`}
                onClick={switchToDraw}
              >
                <PenLine className="w-4 h-4" />
                Draw
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column - Input */}
            <div className="animate-slide-up">
              {inputMode === InputMode.UPLOAD ? (
                <FileUpload 
                  onImageSelect={handleImageSelect}
                  selectedImage={selectedImage}
                  isProcessing={isProcessing}
                  onPredict={handlePredict}
                />
              ) : (
                <DrawingCanvas 
                  onImageGenerated={handleDrawingGenerated}
                  isProcessing={isProcessing}
                  onPredict={handlePredict}
                />
              )}
            </div>
            
            {/* Right Column - Prediction */}
            <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <PredictionDisplay 
                prediction={prediction}
                confidence={confidence}
                isProcessing={isProcessing} 
              />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          Handwritten Digit Recognition • 
          <a href="https://github.com" className="text-primary hover:underline ml-1" target="_blank" rel="noreferrer">
            View Source
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
