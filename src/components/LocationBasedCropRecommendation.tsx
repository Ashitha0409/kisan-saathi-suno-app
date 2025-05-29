import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Volume2, Cloud, Droplets, Thermometer, Beaker } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

// Define the OpenWeatherMap API key
// In a real app, this would be in an environment variable
const OPENWEATHER_API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key or use env variable

// Define the crop data interface
interface CropData {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  label: string;
}

// Define the weather data interface
interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  location: string;
}

// Define the soil data interface
interface SoilData {
  N: number;
  P: number;
  K: number;
  ph: number;
}

// Define the crop recommendation result interface
interface CropRecommendation {
  label: string;
  scientificName: string;
  score: number;
  conditions: {
    temperature: number;
    humidity: number;
    rainfall: number;
    N: number;
    P: number;
    K: number;
    ph: number;
  };
}

// Mock scientific names for crops
const scientificNames: Record<string, string> = {
  rice: 'Oryza sativa',
  maize: 'Zea mays',
  jute: 'Corchorus olitorius',
  cotton: 'Gossypium hirsutum',
  coconut: 'Cocos nucifera',
  papaya: 'Carica papaya',
  orange: 'Citrus sinensis',
  apple: 'Malus domestica',
  grapes: 'Vitis vinifera',
  watermelon: 'Citrullus lanatus',
  muskmelon: 'Cucumis melo',
  wheat: 'Triticum aestivum',
  mungbean: 'Vigna radiata',
  blackgram: 'Vigna mungo',
  lentil: 'Lens culinaris',
  pomegranate: 'Punica granatum',
  banana: 'Musa acuminata',
  mango: 'Mangifera indica',
  chickpea: 'Cicer arietinum',
  kidneybeans: 'Phaseolus vulgaris',
  pigeonpeas: 'Cajanus cajan',
  mothbeans: 'Vigna aconitifolia',
  coffee: 'Coffea arabica'
};

// Mock soil data based on location
const mockSoilData: Record<string, SoilData> = {
  // North India
  'delhi': { N: 80, P: 40, K: 40, ph: 6.8 },
  'chandigarh': { N: 75, P: 35, K: 45, ph: 7.0 },
  'jaipur': { N: 65, P: 30, K: 35, ph: 7.2 },
  'lucknow': { N: 70, P: 45, K: 40, ph: 6.9 },
  
  // South India
  'bangalore': { N: 60, P: 50, K: 30, ph: 6.5 },
  'chennai': { N: 55, P: 40, K: 35, ph: 6.7 },
  'hyderabad': { N: 65, P: 45, K: 40, ph: 6.8 },
  'kochi': { N: 70, P: 55, K: 45, ph: 6.3 },
  
  // East India
  'kolkata': { N: 85, P: 40, K: 45, ph: 6.2 },
  'bhubaneswar': { N: 80, P: 45, K: 40, ph: 6.4 },
  'patna': { N: 75, P: 35, K: 35, ph: 6.7 },
  'guwahati': { N: 90, P: 50, K: 50, ph: 6.0 },
  
  // West India
  'mumbai': { N: 60, P: 40, K: 35, ph: 6.8 },
  'ahmedabad': { N: 55, P: 35, K: 30, ph: 7.1 },
  'pune': { N: 65, P: 45, K: 40, ph: 6.9 },
  'surat': { N: 60, P: 40, K: 35, ph: 7.0 },
  
  // Central India
  'bhopal': { N: 70, P: 40, K: 35, ph: 7.0 },
  'indore': { N: 65, P: 35, K: 30, ph: 7.2 },
  'nagpur': { N: 75, P: 45, K: 40, ph: 6.8 },
  'raipur': { N: 80, P: 50, K: 45, ph: 6.6 },
  
  // Default
  'default': { N: 70, P: 40, K: 40, ph: 6.8 }
};

// Hindi translations for crop names
const hindiNames: Record<string, string> = {
  rice: 'चावल',
  maize: 'मक्का',
  jute: 'जूट',
  cotton: 'कपास',
  coconut: 'नारियल',
  papaya: 'पपीता',
  orange: 'संतरा',
  apple: 'सेब',
  grapes: 'अंगूर',
  watermelon: 'तरबूज',
  muskmelon: 'खरबूजा',
  wheat: 'गेहूं',
  mungbean: 'मूंग',
  blackgram: 'उड़द',
  lentil: 'मसूर',
  pomegranate: 'अनार',
  banana: 'केला',
  mango: 'आम',
  chickpea: 'चना',
  kidneybeans: 'राजमा',
  pigeonpeas: 'अरहर',
  mothbeans: 'मोठ',
  coffee: 'कॉफी'
};

const LocationBasedCropRecommendation = () => {
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const { toast } = useToast();

  // Load CSV data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/crops.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setCropData(results.data as CropData[]);
            setDataLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setDataLoading(false);
            toast({
              title: "Error loading crop data",
              description: "Could not load crop recommendation data. Please try again later.",
              variant: "destructive"
            });
          }
        });
      } catch (error) {
        console.error('Error fetching CSV:', error);
        setDataLoading(false);
        toast({
          title: "Error loading crop data",
          description: "Could not load crop recommendation data. Please try again later.",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, [toast]);

  // Fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async (location: string): Promise<WeatherData> => {
    try {
      // In a real application, you would use the actual API
      // For now, we'll mock the data to avoid API key requirements
      
      // Uncomment this code when you have an API key
      /*
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      
      const data = await response.json();
      
      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain ? (data.rain['1h'] || 0) * 30 * 24 : 50, // Estimate monthly rainfall
        location: data.name
      };
      */
      
      // Mock weather data based on location
      // This is just for demonstration purposes
      const mockWeatherData: Record<string, WeatherData> = {
        'delhi': { temperature: 28, humidity: 65, rainfall: 120, location: 'Delhi' },
        'mumbai': { temperature: 30, humidity: 80, rainfall: 200, location: 'Mumbai' },
        'bangalore': { temperature: 24, humidity: 70, rainfall: 150, location: 'Bangalore' },
        'chennai': { temperature: 32, humidity: 75, rainfall: 180, location: 'Chennai' },
        'kolkata': { temperature: 30, humidity: 85, rainfall: 220, location: 'Kolkata' },
        'hyderabad': { temperature: 29, humidity: 60, rainfall: 140, location: 'Hyderabad' },
        'pune': { temperature: 26, humidity: 65, rainfall: 130, location: 'Pune' },
        'jaipur': { temperature: 27, humidity: 55, rainfall: 90, location: 'Jaipur' },
        'lucknow': { temperature: 29, humidity: 70, rainfall: 150, location: 'Lucknow' },
        'chandigarh': { temperature: 25, humidity: 60, rainfall: 110, location: 'Chandigarh' },
        'bhopal': { temperature: 27, humidity: 65, rainfall: 130, location: 'Bhopal' },
        'patna': { temperature: 28, humidity: 75, rainfall: 160, location: 'Patna' },
        'ahmedabad': { temperature: 31, humidity: 60, rainfall: 100, location: 'Ahmedabad' },
        'surat': { temperature: 30, humidity: 70, rainfall: 120, location: 'Surat' },
        'kochi': { temperature: 29, humidity: 85, rainfall: 250, location: 'Kochi' },
        'guwahati': { temperature: 26, humidity: 80, rainfall: 230, location: 'Guwahati' },
        'bhubaneswar': { temperature: 30, humidity: 75, rainfall: 190, location: 'Bhubaneswar' },
        'indore': { temperature: 28, humidity: 60, rainfall: 110, location: 'Indore' },
        'nagpur': { temperature: 29, humidity: 65, rainfall: 120, location: 'Nagpur' },
        'raipur': { temperature: 30, humidity: 70, rainfall: 140, location: 'Raipur' }
      };
      
      // Normalize location to lowercase for matching
      const normalizedLocation = location.toLowerCase();
      
      // Find the closest match or use default
      const matchedLocation = Object.keys(mockWeatherData).find(
        city => normalizedLocation.includes(city)
      ) || 'delhi'; // Default to Delhi if no match
      
      return mockWeatherData[matchedLocation];
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  };

  // Get soil data based on location
  const getSoilData = (location: string): SoilData => {
    // Normalize location to lowercase for matching
    const normalizedLocation = location.toLowerCase();
    
    // Find the closest match or use default
    const matchedLocation = Object.keys(mockSoilData).find(
      city => normalizedLocation.includes(city)
    ) || 'default';
    
    return mockSoilData[matchedLocation];
  };

  // Calculate Euclidean distance between two points
  const calculateDistance = (point1: any, point2: any) => {
    const keys = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
    return Math.sqrt(
      keys.reduce((sum, key) => {
        const diff = point1[key] - point2[key];
        return sum + diff * diff;
      }, 0)
    );
  };

  // Find the top matching crops
  const findTopCrops = (weatherData: WeatherData, soilData: SoilData, cropData: CropData[], topN: number = 5) => {
    if (cropData.length === 0) return [];

    // Combine weather and soil data
    const inputData = {
      temperature: weatherData.temperature,
      humidity: weatherData.humidity,
      rainfall: weatherData.rainfall,
      N: soilData.N,
      P: soilData.P,
      K: soilData.K,
      ph: soilData.ph
    };

    // Calculate distances for all crops
    const distances = cropData.map(crop => ({
      crop,
      distance: calculateDistance(inputData, crop)
    }));

    // Sort by distance (ascending) and take top N
    distances.sort((a, b) => a.distance - b.distance);
    const topCrops = distances.slice(0, topN);

    // Calculate confidence score (inverse of normalized distance)
    const maxDistance = Math.max(...distances.map(d => d.distance));
    
    // Convert to recommendation format
    return topCrops.map(({ crop, distance }) => {
      const normalizedScore = 100 - (distance / maxDistance * 100);
      return {
        label: crop.label,
        scientificName: scientificNames[crop.label.toLowerCase()] || 'Unknown',
        score: Math.round(normalizedScore),
        conditions: {
          temperature: inputData.temperature,
          humidity: inputData.humidity,
          rainfall: inputData.rainfall,
          N: inputData.N,
          P: inputData.P,
          K: inputData.K,
          ph: inputData.ph
        }
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a location to get crop recommendations",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setRecommendations([]);
    
    try {
      // Fetch weather data
      const weather = await fetchWeatherData(location);
      setWeatherData(weather);
      
      // Get soil data
      const soil = getSoilData(location);
      setSoilData(soil);
      
      // Find top crops
      const topCrops = findTopCrops(weather, soil, cropData);
      
      // Set recommendations
      setRecommendations(topCrops);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Error",
        description: "Could not get recommendations for this location. Please try another location.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Speak Hindi text using browser's SpeechSynthesis API
  const speakHindi = (cropName: string) => {
    if (!hindiNames[cropName.toLowerCase()]) return;
    
    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    const text = `${hindiNames[cropName.toLowerCase()]} आपके क्षेत्र के लिए अनुशंसित फसल है।`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    
    // Set speaking state
    setSpeaking(cropName);
    
    // Add event listener for when speech ends
    utterance.onend = () => {
      setSpeaking(null);
    };
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  };

  // Get crop emoji based on crop name
  const getCropEmoji = (cropName: string) => {
    const emojiMap: Record<string, string> = {
      rice: '🌾',
      maize: '🌽',
      jute: '🧶',
      cotton: '👕',
      coconut: '🥥',
      papaya: '🍈',
      orange: '🍊',
      apple: '🍎',
      grapes: '🍇',
      watermelon: '🍉',
      muskmelon: '🍈',
      wheat: '🌾',
      mungbean: '🌱',
      blackgram: '🌱',
      lentil: '🌱',
      pomegranate: '🍎',
      banana: '🍌',
      mango: '🥭',
      chickpea: '🌱',
      kidneybeans: '🌱',
      pigeonpeas: '🌱',
      mothbeans: '🌱',
      coffee: '☕'
    };

    return emojiMap[cropName.toLowerCase()] || '🌱';
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Location-based Crop Recommendation
          </CardTitle>
          <CardDescription>
            Enter your location to get crop recommendations based on local weather and soil conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {dataLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading crop data...</span>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Enter Location (City, Town, or Pincode)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Delhi, Mumbai, Bangalore"
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Get Recommendations'
                      )}
                    </Button>
                  </div>
                </div>
              </form>

              {weatherData && soilData && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Conditions for {weatherData.location}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      <span className="text-sm text-gray-700">
                        Temperature: {weatherData.temperature}°C
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <span className="text-sm text-gray-700">
                        Humidity: {weatherData.humidity}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cloud className="h-5 w-5 text-cyan-500" />
                      <span className="text-sm text-gray-700">
                        Rainfall: {weatherData.rainfall} mm
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Beaker className="h-5 w-5 text-purple-500" />
                      <span className="text-sm text-gray-700">
                        Soil pH: {soilData.ph}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="mt-8 space-y-4">
                  <Skeleton className="h-[150px] w-full rounded-lg" />
                  <Skeleton className="h-[150px] w-full rounded-lg" />
                  <Skeleton className="h-[150px] w-full rounded-lg" />
                </div>
              )}

              {recommendations.length > 0 && (
                <motion.div 
                  className="mt-8 space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-xl font-bold text-green-800">Top Recommended Crops</h3>
                  {recommendations.map((recommendation, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <Card className="overflow-hidden">
                        <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-blue-50">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className="text-3xl">{getCropEmoji(recommendation.label)}</span>
                              <div>
                                <CardTitle className="text-lg font-bold capitalize">
                                  {recommendation.label}
                                </CardTitle>
                                <CardDescription className="text-sm italic">
                                  {recommendation.scientificName}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge className={`bg-green-${Math.min(Math.floor(recommendation.score / 10) * 100, 900)} text-white`}>
                              {recommendation.score}% Match
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="text-sm text-gray-700">
                            <p>This crop is well-suited for the soil and climate conditions in {weatherData?.location}.</p>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-1">
                                <Thermometer className="h-4 w-4 text-orange-500" />
                                <span>Prefers: ~{Math.round(recommendation.conditions.temperature)}°C</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Droplets className="h-4 w-4 text-blue-500" />
                                <span>Humidity: ~{recommendation.conditions.humidity}%</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Cloud className="h-4 w-4 text-cyan-500" />
                                <span>Rainfall: ~{recommendation.conditions.rainfall} mm</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Beaker className="h-4 w-4 text-purple-500" />
                                <span>Soil pH: ~{recommendation.conditions.ph}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`flex items-center gap-2 ${speaking === recommendation.label ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
                            onClick={() => speakHindi(recommendation.label)}
                            disabled={speaking !== null && speaking !== recommendation.label}
                          >
                            <Volume2 className="h-4 w-4" />
                            {speaking === recommendation.label ? 'Speaking...' : 'Listen in Hindi'}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 text-sm text-gray-500">
          This recommendation is based on local weather conditions and estimated soil data. 
          For best results, consider getting your soil tested for accurate nutrient levels.
        </CardFooter>
      </Card>
    </div>
  );
};

export default LocationBasedCropRecommendation;
