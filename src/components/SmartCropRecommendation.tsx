import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Loader2, Sprout } from 'lucide-react';

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

const SmartCropRecommendation = () => {
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    N: 50,
    P: 30,
    K: 30,
    temperature: 25,
    humidity: 70,
    ph: 6.5,
    rainfall: 150
  });

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
          }
        });
      } catch (error) {
        console.error('Error fetching CSV:', error);
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0
    });
  };

  // Handle slider changes
  const handleSliderChange = (name: string, value: number[]) => {
    setFormData({
      ...formData,
      [name]: value[0]
    });
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

  // Find the closest crop match
  const findClosestCrop = () => {
    if (cropData.length === 0) return null;

    let minDistance = Infinity;
    let closestCrop = null;
    let distances: { label: string, distance: number }[] = [];

    cropData.forEach((crop) => {
      const distance = calculateDistance(formData, crop);
      distances.push({ label: crop.label, distance });
      
      if (distance < minDistance) {
        minDistance = distance;
        closestCrop = crop;
      }
    });

    // Calculate confidence score (inverse of normalized distance)
    // Lower distance = higher confidence
    const maxDistance = Math.max(...distances.map(d => d.distance));
    const normalizedConfidence = 100 - (minDistance / maxDistance * 100);
    
    return { crop: closestCrop, confidence: Math.round(normalizedConfidence) };
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const result = findClosestCrop();
      if (result && result.crop) {
        setResult(result.crop.label);
        setConfidence(result.confidence);
      } else {
        setResult(null);
        setConfidence(null);
      }
      setLoading(false);
    }, 1000);
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
      muskmelon: '🍈'
    };

    return emojiMap[cropName.toLowerCase()] || '🌱';
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-white shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
            <Sprout className="h-6 w-6" />
            Smart Crop Recommendation
          </CardTitle>
          <CardDescription>
            Enter soil and environmental parameters to get a crop recommendation
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {dataLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading crop data...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="N">Nitrogen (N) - {formData.N} kg/ha</Label>
                  <Slider 
                    id="N"
                    min={0} 
                    max={140} 
                    step={1}
                    value={[formData.N]} 
                    onValueChange={(value) => handleSliderChange('N', value)} 
                    className="py-4"
                  />
                  <Input
                    id="N-input"
                    name="N"
                    type="number"
                    value={formData.N}
                    onChange={handleInputChange}
                    min={0}
                    max={140}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="P">Phosphorous (P) - {formData.P} kg/ha</Label>
                  <Slider 
                    id="P"
                    min={0} 
                    max={140} 
                    step={1}
                    value={[formData.P]} 
                    onValueChange={(value) => handleSliderChange('P', value)} 
                    className="py-4"
                  />
                  <Input
                    id="P-input"
                    name="P"
                    type="number"
                    value={formData.P}
                    onChange={handleInputChange}
                    min={0}
                    max={140}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="K">Potassium (K) - {formData.K} kg/ha</Label>
                  <Slider 
                    id="K"
                    min={0} 
                    max={140} 
                    step={1}
                    value={[formData.K]} 
                    onValueChange={(value) => handleSliderChange('K', value)} 
                    className="py-4"
                  />
                  <Input
                    id="K-input"
                    name="K"
                    type="number"
                    value={formData.K}
                    onChange={handleInputChange}
                    min={0}
                    max={140}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ph">pH Level - {formData.ph}</Label>
                  <Slider 
                    id="ph"
                    min={0} 
                    max={14} 
                    step={0.1}
                    value={[formData.ph]} 
                    onValueChange={(value) => handleSliderChange('ph', value)} 
                    className="py-4"
                  />
                  <Input
                    id="ph-input"
                    name="ph"
                    type="number"
                    value={formData.ph}
                    onChange={handleInputChange}
                    min={0}
                    max={14}
                    step={0.1}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C) - {formData.temperature}°C</Label>
                  <Slider 
                    id="temperature"
                    min={0} 
                    max={50} 
                    step={0.1}
                    value={[formData.temperature]} 
                    onValueChange={(value) => handleSliderChange('temperature', value)} 
                    className="py-4"
                  />
                  <Input
                    id="temperature-input"
                    name="temperature"
                    type="number"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    min={0}
                    max={50}
                    step={0.1}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="humidity">Humidity (%) - {formData.humidity}%</Label>
                  <Slider 
                    id="humidity"
                    min={0} 
                    max={100} 
                    step={1}
                    value={[formData.humidity]} 
                    onValueChange={(value) => handleSliderChange('humidity', value)} 
                    className="py-4"
                  />
                  <Input
                    id="humidity-input"
                    name="humidity"
                    type="number"
                    value={formData.humidity}
                    onChange={handleInputChange}
                    min={0}
                    max={100}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rainfall">Rainfall (mm) - {formData.rainfall} mm</Label>
                  <Slider 
                    id="rainfall"
                    min={0} 
                    max={300} 
                    step={1}
                    value={[formData.rainfall]} 
                    onValueChange={(value) => handleSliderChange('rainfall', value)} 
                    className="py-4"
                  />
                  <Input
                    id="rainfall-input"
                    name="rainfall"
                    type="number"
                    value={formData.rainfall}
                    onChange={handleInputChange}
                    min={0}
                    max={300}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Get Recommendation'
                  )}
                </Button>
              </div>
            </form>
          )}

          {result && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <h3 className="text-xl font-bold text-green-800 mb-2 flex items-center">
                <span className="text-3xl mr-2">{getCropEmoji(result)}</span>
                Recommended Crop: <span className="ml-2 text-green-600 capitalize">{result}</span>
              </h3>
              {confidence !== null && (
                <div className="mt-2">
                  <p className="text-gray-600">Confidence: {confidence}%</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${confidence}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <p className="mt-4 text-gray-700">
                Based on the soil and environmental parameters you provided, we recommend growing <strong className="capitalize">{result}</strong>. 
                This crop is well-suited for the conditions you described and has a high likelihood of successful cultivation.
              </p>
              <div className="mt-4 p-4 bg-white/50 rounded-lg border border-green-100">
                <h4 className="font-medium text-green-800 mb-2">Growing Tips:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Ensure proper irrigation based on the rainfall in your area</li>
                  <li>Monitor soil pH regularly and adjust if needed</li>
                  <li>Apply fertilizers according to the recommended N-P-K ratio</li>
                  <li>Consider crop rotation to maintain soil health</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 text-sm text-gray-500">
          This recommendation is based on historical crop data and environmental parameters. 
          For best results, consult with a local agricultural expert.
        </CardFooter>
      </Card>
    </div>
  );
};

export default SmartCropRecommendation;
