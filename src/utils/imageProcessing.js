
// Image processing utilities

// Convert file to data URL
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

// Resize image to MNIST format (28x28px grayscale)
export const resizeImageToMnistFormat = (imageData) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        canvas.width = 28;
        canvas.height = 28;
        const ctx = canvas.getContext('2d');
        
        // Draw the image in grayscale (for demonstration purposes)
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 28, 28);
        ctx.drawImage(img, 0, 0, 28, 28);
        
        // For a real application, you would also convert to grayscale
        // and potentially normalize the pixel values
        
        // Return the processed image
        const processedImage = canvas.toDataURL('image/png');
        resolve(processedImage);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageData;
  });
};
