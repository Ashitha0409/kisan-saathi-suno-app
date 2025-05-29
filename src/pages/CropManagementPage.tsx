
import React, { useState, useRef, useEffect } from 'react';
import cropsData from '@/data/crops.json';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Plus, Leaf, Database, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SmartCropRecommendation from '@/components/SmartCropRecommendation';
import LocationBasedCropRecommendation from '@/components/LocationBasedCropRecommendation';

// Extract the crops array from the imported data
const cropsDataArray = cropsData.crops;

// Start with empty crops array
const initialCrops: Crop[] = [];

interface Fertilizer {
  name: string;
  units: string;
}

interface Pest {
  name: string;
  severity: string;
}

interface Weather {
  temperature: string;
  rainfall: string;
  soil: string;
}

interface Crop {
  id: number;
  name: string;
  scientificName: string;
  sowingTime: string;
  idealSeason: string;
  fertilizers: {
    organic: Fertilizer[];
    inorganic: Fertilizer[];
  };
  pestsDiseases: Pest[];
  weather: Weather;
  growthDuration: string;
  yieldRange: string;
  image: string;
  tipsHindi: string;
}

const CropManagementPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [crops, setCrops] = useState<Crop[]>(initialCrops);
  const nextId = useRef(initialCrops.length + 1);
  const [newCrop, setNewCrop] = useState<Crop>({
    id: nextId.current,
    name: '',
    scientificName: '',
    sowingTime: '',
    idealSeason: '',
    fertilizers: {
      organic: [{ name: '', units: '' }],
      inorganic: [{ name: '', units: '' }]
    },
    pestsDiseases: [{ name: '', severity: '' }],
    weather: {
      temperature: '',
      rainfall: '',
      soil: ''
    },
    growthDuration: '',
    yieldRange: '',
    image: '',
    tipsHindi: ''
  });

  // Create a map of crop names to their full data
  const cropDataMap = cropsDataArray.reduce((acc, crop) => {
    acc[crop.name.toLowerCase()] = crop;
    return acc;
  }, {} as Record<string, Crop>);

  const handleCropNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const lowerName = name.toLowerCase();
    const matchingCrop = cropDataMap[lowerName];
    
    if (matchingCrop) {
      setNewCrop({
        id: nextId.current,
        name: matchingCrop.name,
        scientificName: matchingCrop.scientificName,
        sowingTime: matchingCrop.sowingTime,
        idealSeason: matchingCrop.idealSeason,
        fertilizers: matchingCrop.fertilizers,
        pestsDiseases: matchingCrop.pestsDiseases,
        weather: matchingCrop.weather,
        growthDuration: matchingCrop.growthDuration,
        yieldRange: matchingCrop.yieldRange,
        image: matchingCrop.image,
        tipsHindi: matchingCrop.tipsHindi
      });
    } else {
      setNewCrop(prev => ({
        ...prev,
        name: name,
        scientificName: ''
      }));
    }
  };

  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop.name.trim()) return;

    setCrops(prev => [...prev, newCrop]);
    setIsDialogOpen(false);
    nextId.current++;
    setNewCrop({
      id: nextId.current,
      name: '',
      scientificName: '',
      sowingTime: '',
      idealSeason: '',
      fertilizers: {
        organic: [{ name: '', units: '' }],
        inorganic: [{ name: '', units: '' }]
      },
      pestsDiseases: [{ name: '', severity: '' }],
      weather: {
        temperature: '',
        rainfall: '',
        soil: ''
      },
      growthDuration: '',
      yieldRange: '',
      image: '',
      tipsHindi: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <Link to="/" className="text-green-600 hover:text-green-700 font-medium">
          ← Back to Home
        </Link>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">Crop Management</h1>
          <Button onClick={() => setIsDialogOpen(true)}>Add New Crop</Button>
        </div>
        
        <Tabs defaultValue="crops" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="crops" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              My Crops
            </TabsTrigger>
            <TabsTrigger value="recommendation" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              Smart Crop Recommendation
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location-based Recommendation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="crops">
            {crops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <Card key={crop.id} className="bg-white shadow-lg">
                <CardHeader className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">{crop.name}</CardTitle>
                    <span className="text-sm text-gray-500">{crop.scientificName}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Sowing Time & Season</h3>
                      <p className="text-sm text-gray-500">
                        {crop.sowingTime} ({crop.idealSeason})
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Fertilizers</h3>
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm font-medium text-green-600">Organic</h4>
                          <ul className="list-disc list-inside text-sm text-gray-500">
                            {crop.fertilizers.organic.map((fertilizer, index) => (
                              <li key={index}>{fertilizer.name} ({fertilizer.units})</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-600">Inorganic</h4>
                          <ul className="list-disc list-inside text-sm text-gray-500">
                            {crop.fertilizers.inorganic.map((fertilizer, index) => (
                              <li key={index}>{fertilizer.name} ({fertilizer.units})</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Pests & Diseases</h3>
                      <ul className="list-disc list-inside text-sm text-gray-500">
                        {crop.pestsDiseases.map((pest, index) => (
                          <li key={index}>{pest.name} ({pest.severity})</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium">Weather Conditions</h3>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          Temperature: {crop.weather.temperature}
                        </p>
                        <p className="text-sm text-gray-500">
                          Rainfall: {crop.weather.rainfall}
                        </p>
                        <p className="text-sm text-gray-500">
                          Soil Type: {crop.weather.soil}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Growth Duration</h3>
                      <p className="text-sm text-gray-500">{crop.growthDuration}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Yield Range</h3>
                      <p className="text-sm text-gray-500">{crop.yieldRange}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No crops added yet</p>
            <p className="text-sm text-gray-400">Click the "Add New Crop" button to get started</p>
          </div>
        )}
          </TabsContent>
          
          <TabsContent value="recommendation">
            <SmartCropRecommendation />
          </TabsContent>
          
          <TabsContent value="location">
            <LocationBasedCropRecommendation />
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Crop</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCrop} className="space-y-4">
            <div>
              <Label htmlFor="name">Crop Name</Label>
              <Input
                id="name"
                value={newCrop.name}
                onChange={handleCropNameChange}
                placeholder="Enter crop name"
              />
            </div>
            {/* Add more form fields for other crop properties */}
            <div className="flex justify-end">
              <Button type="submit" onClick={handleAddCrop} disabled={!newCrop.name.trim()}>
                Add Crop
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CropManagementPage;
