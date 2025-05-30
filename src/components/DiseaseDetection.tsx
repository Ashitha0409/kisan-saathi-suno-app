"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, Leaf, Search, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DiseaseResult {
  disease: string;
  treatment: string;
  symptoms: string;
}

// Common symptoms with more detailed information
const commonSymptoms = [
  {
    id: "leaf-spots",
    title: "Leaf Spots",
    symptoms: "Yellowing leaves with black spots",
    details: "Circular or irregular dark spots on leaves, often with yellow borders",
    affects: "Leaves",
    icon: "🍂",
  },
  {
    id: "powdery-mildew",
    title: "Powdery Mildew",
    symptoms: "White powdery coating on leaves",
    details: "White, powdery fungal growth covering leaf surfaces",
    affects: "Leaves, stems",
    icon: "❄️",
  },
  {
    id: "wilting",
    title: "Plant Wilting",
    symptoms: "Wilting leaves and stems",
    details: "Plant becoming limp and drooping despite adequate water",
    affects: "Whole plant",
    icon: "🥀",
  },
  {
    id: "rust",
    title: "Rust Disease",
    symptoms: "Brown rust-like spots on leaves",
    details: "Rusty-brown or orange spots that can be rubbed off",
    affects: "Leaves",
    icon: "🟤",
  },
  {
    id: "mosaic",
    title: "Mosaic Virus",
    symptoms: "Mosaic pattern on leaves",
    details: "Mottled pattern of light and dark green on leaves",
    affects: "Leaves",
    icon: "🌿",
  },
  {
    id: "root-rot",
    title: "Root Rot",
    symptoms: "Rotting roots and stem base",
    details: "Brown, soft, decaying roots with foul smell",
    affects: "Roots, stem base",
    icon: "🌱",
  }
];

export default function DiseaseDetection() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [mode, setMode] = useState<"common" | "custom">("common");

  const handleSubmit = async () => {
    if (!symptoms.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomSelect = (id: string) => {
    const selected = commonSymptoms.find(s => s.id === id);
    if (selected) {
      setSelectedSymptom(id);
      setSymptoms(selected.symptoms);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <Leaf className="h-8 w-8 text-green-600" />
        <h1 className="text-3xl font-bold">Disease Detection</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Mode Selection */}
        <Card>
          <CardContent className="p-6">
            <RadioGroup
              defaultValue="common"
              onValueChange={(value) => setMode(value as "common" | "custom")}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="common" id="common" />
                <Label htmlFor="common" className="font-medium">Common Symptoms</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="font-medium">Custom Description</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {mode === "common" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonSymptoms.map((symptom) => (
              <Card 
                key={symptom.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedSymptom === symptom.id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => handleSymptomSelect(symptom.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{symptom.icon}</span>
                    <h3 className="font-semibold">{symptom.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{symptom.details}</p>
                  <div className="text-xs text-gray-500">
                    Affects: {symptom.affects}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-gray-500" />
                <h3 className="font-semibold">Custom Symptom Description</h3>
              </div>
              <Textarea
                placeholder="Describe the symptoms you observe in detail... (e.g., yellow spots on leaves, wilting stems)"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="mb-4"
                rows={4}
              />
            </CardContent>
          </Card>
        )}

        <Button 
          onClick={handleSubmit}
          disabled={loading || !symptoms.trim()} 
          className="w-full py-6 text-lg"
        >
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {loading ? "Analyzing Symptoms..." : "Detect Disease"}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="grid gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Detected Disease
                </h3>
                <p className="text-green-700 text-lg">{result.disease}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  Treatment Plan
                </h3>
                <p className="text-blue-700 whitespace-pre-line">{result.treatment}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
