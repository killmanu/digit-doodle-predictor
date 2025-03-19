
// This utility processes images to the format needed for the digit recognition model

// Resize an image to 28x28 pixels (MNIST format)
export const resizeImageToMnistFormat = async (imageDataUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Create a canvas for resizing
      const canvas = document.createElement('canvas');
      canvas.width = 28;
      canvas.height = 28;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Fill with white background (for transparent images)
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 28, 28);
      
      // Draw and resize the image
      ctx.drawImage(img, 0, 0, 28, 28);
      
      // Convert to grayscale
      const imageData = ctx.getImageData(0, 0, 28, 28);
      const data = imageData.data;
      
      // For each pixel, convert RGB to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = 255 - gray; // Invert for MNIST format (white on black)
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Return the processed image
      resolve(canvas.toDataURL());
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageDataUrl;
  });
};

// Process a file to get a data URL
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('FileReader did not return a string'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};
