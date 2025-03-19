
import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onImageSelect: (imageFile: File) => void;
  selectedImage: string | null;
  isProcessing: boolean;
  onPredict: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onImageSelect, 
  selectedImage, 
  isProcessing,
  onPredict 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type.match('image.*')) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {!selectedImage ? (
        <div 
          className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all duration-300 ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-indigo-200'
          }`}
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="h-10 w-10 text-indigo-500 mb-4" />
          <p className="text-center text-indigo-600/70 mb-4">
            Drag & drop an image or browse
          </p>
          <label className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md hover:shadow-lg transition-all cursor-pointer">
            Browse Files
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            />
          </label>
        </div>
      ) : (
        <div className="w-full animate-fade-in">
          <div className="bg-white/70 rounded-xl p-4 shadow-md mb-4 border border-indigo-100">
            <div className="relative w-full pt-[100%] rounded-lg overflow-hidden">
              <img
                src={selectedImage}
                alt="Selected"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <button
              className="px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 shadow hover:shadow-md transition-all flex items-center gap-2"
              onClick={() => onImageSelect(new File([], ''))}
            >
              <ImageIcon className="w-4 h-4" />
              New Image
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
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
