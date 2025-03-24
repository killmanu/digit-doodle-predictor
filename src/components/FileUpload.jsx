
import React, { useRef } from 'react';
import { Upload, X, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

const FileUpload = ({ onImageSelect, selectedImage, isProcessing, onPredict }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect({ size: 0 });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-indigo-700 mb-2">Upload an Image</h2>
      <p className="text-gray-600 mb-4">Upload a clear image of a single handwritten digit (0-9)</p>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${selectedImage ? 'border-indigo-300 bg-indigo-50/50' : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/30'}`}
        onClick={!selectedImage ? handleClick : undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!selectedImage ? (
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-indigo-500 mb-2" />
            <p className="text-indigo-600 font-medium">Drop your image here or click to browse</p>
            <p className="text-gray-500 text-sm mt-1">PNG, JPG, or JPEG</p>
          </div>
        ) : (
          <div className="relative group">
            <img 
              src={selectedImage} 
              alt="Selected digit" 
              className="mx-auto max-h-64 rounded"
            />
            <button 
              onClick={handleClear}
              className="absolute top-2 right-2 bg-white/80 text-gray-700 rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/png, image/jpeg, image/jpg"
          className="hidden" 
        />
      </div>
      
      <Button 
        className="self-center mt-4"
        onClick={onPredict}
        disabled={!selectedImage || isProcessing}
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
  );
};

export default FileUpload;
