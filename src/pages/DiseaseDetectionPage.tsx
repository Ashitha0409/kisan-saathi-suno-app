
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { ImageUploader } from '@/components/disease/ImageUploader';
import { DiseaseCard } from '@/components/disease/DiseaseCard';
import { useDiseaseDetection } from '@/hooks/useDiseaseDetection';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, RotateCw, Upload as UploadIcon } from 'lucide-react';

export default function DiseaseDetectionPage() {
  const { 
    result, 
    isLoading, 
    error, 
    imageFile, 
    isSpeaking,
    detectDisease, 
    reset,
    toggleSpeech 
  } = useDiseaseDetection();
  
  const formRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      await detectDisease(file);
    } catch (err) {
      console.error('Error detecting disease:', err);
    }
  };

  // Handle form submission from the ImageUploader button
  useEffect(() => {
    const handleSubmit = (e: Event) => {
      e.preventDefault();
      if (imageFile && !isLoading) {
        detectDisease(imageFile);
      }
    };

    document.addEventListener('submit-disease-detection', handleSubmit);
    return () => {
      document.removeEventListener('submit-disease-detection', handleSubmit);
    };
  }, [imageFile, isLoading, detectDisease]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Crop Disease Detection</h1>
          <p className="text-gray-600">
            Upload a photo of your crop to identify diseases and get treatment recommendations
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={result ? 'result' : 'upload'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
                ref={formRef}
              >
                {!result ? (
                  <>
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-3">
                        <UploadIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Crop Image</h2>
                      <p className="text-gray-500 text-sm max-w-md mx-auto">
                        Take a clear photo of the affected plant part for accurate disease detection and treatment recommendations
                      </p>
                    </div>
                    
                    <ImageUploader 
                      onImageUpload={handleImageUpload} 
                      isLoading={isLoading}
                    />
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-4 bg-red-50 text-red-700 rounded-md text-sm"
                      >
                        {error}
                      </motion.div>
                    )}
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            For best results, ensure the affected area is well-lit and clearly visible in the photo.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-800">Detection Results</h2>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={toggleSpeech}
                          disabled={isLoading}
                        >
                          {isSpeaking ? (
                            <div>
                              <VolumeX className="h-4 w-4 mr-2" />
                              Stop
                            </div>
                          ) : (
                            <div>
                              <Volume2 className="h-4 w-4 mr-2" />
                              Listen
                            </div>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={reset}
                          disabled={isLoading}
                        >
                          <RotateCw className="h-4 w-4 mr-2" />
                          New Scan
                        </Button>
                      </div>
                    </div>
                    
                    <DiseaseCard 
                      disease={result.disease} 
                      confidence={result.confidence} 
                      treatments={result.treatments} 
                      isLoading={isLoading} 
                      error={error} 
                    />
                    
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            For additional help, consult with an agricultural expert for a comprehensive diagnosis and treatment plan.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>For best results, take photos in good lighting and focus on the affected area.</p>
        </div>
      </div>
    </div>
  );
}
