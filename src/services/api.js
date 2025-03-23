
// API service for digit prediction

// Mock API call for digit prediction
export const predictDigit = async (imageData) => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real application, send the image to your backend
  // const response = await fetch('/api/predict', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ image: imageData }),
  // });
  // 
  // if (!response.ok) {
  //   throw new Error('Failed to predict digit');
  // }
  // 
  // return await response.json();
  
  // For this demo, we'll return a random digit and confidence
  const randomDigit = Math.floor(Math.random() * 10);
  const randomConfidence = 0.7 + Math.random() * 0.3; // Random value between 0.7 and 1.0
  
  return {
    prediction: randomDigit,
    confidence: randomConfidence,
  };
};
