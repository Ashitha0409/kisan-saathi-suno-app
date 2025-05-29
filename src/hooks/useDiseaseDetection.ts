import { useState, useCallback, useRef, useEffect } from 'react';
import { detectDiseaseFromImage, speakText, translateToHindi, type DiseaseDetectionResult } from '@/lib/diseaseDetection';

export function useDiseaseDetection() {
  const [result, setResult] = useState<DiseaseDetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  
  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesis.current = window.speechSynthesis;
    }
    
    return () => {
      // Clean up any ongoing speech when component unmounts
      if (speechSynthesis.current?.speaking) {
        speechSynthesis.current.cancel();
      }
    };
  }, []);

  const detectDisease = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setImageFile(file);
    setResult(null);

    try {
      // Call our disease detection function
      const detectionResult = await detectDiseaseFromImage(file);
      
      // Update the result with confidence as percentage
      const resultWithPercentage = {
        ...detectionResult,
        confidence: Math.round(detectionResult.confidence * 100)
      };
      
      setResult(resultWithPercentage);
      
      // Speak the result in English
      const message = `Detected ${detectionResult.disease} with ${Math.round(detectionResult.confidence * 100)}% confidence. ${detectionResult.treatments[0]}`;
      speakText(message);
      
      // Speak the result in Hindi after a delay
      setTimeout(async () => {
        const hindiDisease = await translateToHindi(detectionResult.disease);
        const hindiTreatment = await translateToHindi(detectionResult.treatments[0]);
        const hindiMessage = `पता चला ${hindiDisease}। ${hindiTreatment}`;
        speakText(hindiMessage, 'hi-IN');
      }, 3000);
      
      return resultWithPercentage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to detect disease';
      setError(errorMessage);
      
      // Speak the error message
      speakText(`Error: ${errorMessage}`);
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    // Cancel any ongoing speech
    if (speechSynthesis.current?.speaking) {
      speechSynthesis.current.cancel();
    }
    
    setResult(null);
    setError(null);
    setImageFile(null);
    setIsSpeaking(false);
  }, []);

  const toggleSpeech = useCallback(() => {
    if (!result) return;
    
    if (speechSynthesis.current?.speaking) {
      speechSynthesis.current.cancel();
      setIsSpeaking(false);
      return;
    }
    
    setIsSpeaking(true);
    const message = `Detected ${result.disease} with ${result.confidence}% confidence. ${result.treatments[0]}`;
    
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speakText(message);
    
    // Also speak in Hindi after English
    setTimeout(async () => {
      const hindiDisease = await translateToHindi(result.disease);
      const hindiTreatment = await translateToHindi(result.treatments[0]);
      const hindiMessage = `पता चला ${hindiDisease}। ${hindiTreatment}`;
      
      const hindiUtterance = new SpeechSynthesisUtterance(hindiMessage);
      hindiUtterance.lang = 'hi-IN';
      hindiUtterance.onend = () => setIsSpeaking(false);
      hindiUtterance.onerror = () => setIsSpeaking(false);
      
      speakText(hindiMessage, 'hi-IN');
    }, 3000);
  }, [result]);

  return {
    result,
    isLoading,
    error,
    imageFile,
    isSpeaking,
    detectDisease,
    reset,
    toggleSpeech,
  };
}
