
// This service will handle communication with the backend API for digit predictions

// For demonstration, this function simulates a prediction 
// In a real app, this would make a fetch call to your backend
export const predictDigit = async (imageData) => {
  console.log('Sending image for prediction');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock response - in a real app, this would be the response from your backend
  // Random digit between 0-9 with random confidence for demo purposes
  const mockPrediction = Math.floor(Math.random() * 10);
  const mockConfidence = 0.7 + (Math.random() * 0.3); // Between 0.7 and 1.0
  
  console.log(`Predicted: ${mockPrediction} with confidence ${mockConfidence}`);
  
  return {
    prediction: mockPrediction,
    confidence: mockConfidence
  };
};
