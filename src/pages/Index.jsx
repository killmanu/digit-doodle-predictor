
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AppHeader from '@/components/AppHeader';
import FileUpload from '@/components/FileUpload';
import DrawingCanvas from '@/components/DrawingCanvas';
import PredictionDisplay from '@/components/PredictionDisplay';
import CameraCapture from '@/components/CameraCapture';
import { resizeImageToMnistFormat, fileToDataUrl } from '@/utils/imageProcessing';
import { predictDigit } from '@/services/api';

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  const [processedImage, setProcessedImage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const handleImageSelect = async (file) => {
    if (!file || file.size === 0) {
      setSelectedImage(null);
      setProcessedImage('');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setSelectedImage(dataUrl);
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDrawingGenerated = (imageData) => {
    setSelectedImage(imageData);
  };

  const handleCameraCapture = (imageData) => {
    setSelectedImage(imageData);
  };

  const handlePredict = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload or draw an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setPrediction(null);
    setConfidence(null);

    try {
      // Process the image to MNIST format
      const processedImage = await resizeImageToMnistFormat(selectedImage);
      setProcessedImage(processedImage);
      
      // Send to model for prediction
      const result = await predictDigit(processedImage);
      
      // Update state with prediction
      setPrediction(result.prediction);
      setConfidence(result.confidence);
      
      toast({
        title: "Prediction successful",
        description: `Predicted digit: ${result.prediction}`,
      });
    } catch (error) {
      console.error("Error during prediction:", error);
      toast({
        title: "Prediction failed",
        description: "An error occurred while analyzing the image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <AppHeader />
      
      <section className="py-10 px-4 md:py-16">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-indigo-100">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="draw">Draw</TabsTrigger>
                  <TabsTrigger value="camera">Camera</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-0">
                  <FileUpload 
                    onImageSelect={handleImageSelect}
                    selectedImage={selectedImage}
                    isProcessing={isProcessing}
                    onPredict={handlePredict}
                  />
                </TabsContent>
                
                <TabsContent value="draw" className="mt-0">
                  <DrawingCanvas 
                    onImageGenerated={handleDrawingGenerated}
                    isProcessing={isProcessing}
                    onPredict={handlePredict}
                  />
                </TabsContent>
                
                <TabsContent value="camera" className="mt-0">
                  <CameraCapture 
                    onImageCapture={handleCameraCapture}
                    isProcessing={isProcessing}
                    onPredict={handlePredict}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md border border-indigo-100 flex flex-col">
              <h2 className="text-xl font-semibold mb-4 text-indigo-800">Prediction Result</h2>
              <PredictionDisplay 
                prediction={prediction} 
                confidence={confidence}
                isProcessing={isProcessing}
              />
              
              {processedImage && (
                <div className="mt-auto pt-4 border-t border-indigo-100">
                  <p className="text-xs text-indigo-500 mb-2">Processed MNIST format:</p>
                  <div className="bg-gray-800 p-2 rounded-md w-20 h-20 mx-auto">
                    <img 
                      src={processedImage} 
                      alt="Processed" 
                      className="w-full h-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
