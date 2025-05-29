/**
 * Types and utilities for disease detection
 */

// Types for disease detection results
export interface DiseaseDetectionResult {
  disease: string;
  confidence: number;
  treatments: string[];
  severity?: 'low' | 'medium' | 'high';
  description?: string;
  preventionTips?: string[];
}

// Mock disease database - in a real app, this would come from an API
export const DISEASE_DATABASE: Record<string, DiseaseDetectionResult> = {
  'tomato_early_blight': {
    disease: 'Tomato Early Blight',
    confidence: 0,
    severity: 'medium',
    treatments: [
      'Remove and destroy infected leaves',
      'Apply copper-based fungicides',
      'Improve air circulation around plants',
      'Water at the base of plants to keep foliage dry'
    ],
    description: 'Early blight is a common tomato disease caused by the fungus Alternaria solani. It appears as small, dark spots on lower leaves that gradually enlarge and develop concentric rings.',
    preventionTips: [
      'Rotate crops every 2-3 years',
      'Use disease-free seeds and transplants',
      'Space plants properly for good air circulation',
      'Avoid overhead watering'
    ]
  },
  'potato_late_blight': {
    disease: 'Potato Late Blight',
    confidence: 0,
    severity: 'high',
    treatments: [
      'Remove and destroy infected plants immediately',
      'Apply fungicides containing chlorothalonil or mancozeb',
      'Avoid overhead watering',
      'Harvest potatoes only after vines are completely dead'
    ],
    description: 'Late blight is a serious disease caused by the oomycete Phytophthora infestans. It can destroy entire crops quickly under cool, wet conditions.',
    preventionTips: [
      'Plant certified disease-free seed potatoes',
      'Destroy volunteer potato and tomato plants',
      'Avoid working in fields when plants are wet',
      'Use drip irrigation instead of overhead watering'
    ]
  },
  'healthy': {
    disease: 'Healthy Plant',
    confidence: 0,
    severity: 'low',
    treatments: [
      'Continue current care practices',
      'Monitor for signs of disease',
      'Maintain good plant spacing',
      'Water appropriately for the plant type'
    ],
    description: 'No signs of disease detected. The plant appears to be healthy and thriving.',
    preventionTips: [
      'Practice crop rotation',
      'Keep garden clean of plant debris',
      'Monitor plants regularly for early signs of problems',
      'Maintain proper soil health'
    ]
  },
  'apple_scab': {
    disease: 'Apple Scab',
    confidence: 0,
    severity: 'medium',
    treatments: [
      'Rake and destroy fallen leaves in autumn',
      'Apply fungicides in early spring',
      'Prune to improve air circulation',
      'Plant resistant varieties'
    ],
    description: 'Apple scab is caused by the fungus Venturia inaequalis. It causes dark, scaly lesions on leaves and fruit, leading to premature leaf drop and reduced fruit quality.',
    preventionTips: [
      'Plant resistant apple varieties',
      'Prune trees to improve air circulation',
      'Remove and destroy fallen leaves in autumn',
      'Apply appropriate fungicides at bud break'
    ]
  },
  'grape_powdery_mildew': {
    disease: 'Grape Powdery Mildew',
    confidence: 0,
    severity: 'medium',
    treatments: [
      'Apply sulfur or potassium bicarbonate',
      'Prune to improve air circulation',
      'Remove and destroy infected plant parts',
      'Apply fungicides at the first sign of disease'
    ],
    description: 'Powdery mildew on grapes is caused by the fungus Erysiphe necator. It appears as white, powdery spots on leaves, stems, and fruit, reducing fruit quality and yield.',
    preventionTips: [
      'Plant in full sun with good air circulation',
      'Prune to open up the canopy',
      'Avoid overhead watering',
      'Apply preventative fungicides before symptoms appear'
    ]
  }
};

/**
 * Simulates disease detection from an image
 * In a real app, this would call your ML model API
 */
export async function detectDiseaseFromImage(
  imageFile: File
): Promise<DiseaseDetectionResult> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, you would send the image to your ML model API
  // const formData = new FormData();
  // formData.append('image', imageFile);
  // const response = await fetch('/api/detect-disease', {
  //   method: 'POST',
  //   body: formData,
  // });
  // if (!response.ok) throw new Error('Failed to detect disease');
  // return await response.json();
  
  // For demo purposes, return a random disease from our mock database
  const diseases = Object.values(DISEASE_DATABASE);
  const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
  
  // Add random confidence between 85-98%
  const confidence = 0.85 + Math.random() * 0.13;
  
  return {
    ...randomDisease,
    confidence: parseFloat(confidence.toFixed(2))
  };
}

/**
 * Speaks text using the Web Speech API
 * @param text The text to speak
 * @param lang The language code (default: 'en-US')
 */
export function speakText(text: string, lang = 'en-US') {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Translates text to Hindi (mock implementation)
 * In a real app, this would call a translation API
 */
export async function translateToHindi(text: string): Promise<string> {
  // Mock translation - in a real app, use a translation API
  const translations: Record<string, string> = {
    'Tomato Early Blight': 'टमाटर अर्ली ब्लाइट',
    'Potato Late Blight': 'आलू लेट ब्लाइट',
    'Healthy Plant': 'स्वस्थ पौधा',
    'Remove and destroy infected leaves': 'संक्रमित पत्तियों को हटाकर नष्ट कर दें',
    'Apply copper-based fungicides': 'कॉपर आधारित कवकनाशी लगाएं',
    'Improve air circulation around plants': 'पौधों के आसपास हवा का संचार बेहतर बनाएं',
    'Water at the base of plants to keep foliage dry': 'पत्तियों को सूखा रखने के लिए पौधों के आधार पर पानी दें'
  };
  
  // Return translation if available, otherwise return original text
  return translations[text] || text;
}
