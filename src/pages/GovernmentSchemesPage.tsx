import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2 } from 'lucide-react';
import schemesData from '@/data/schemes.json';

interface Scheme {
  id: number;
  name: string;
  department: string;
  category: string;
  emoji: string;
  eligibility: string;
  benefits: string;
  applicationDeadline: string;
  hindiSummary: string;
}

const GovernmentSchemesPage = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [speaking, setSpeaking] = useState<number | null>(null);

  useEffect(() => {
    // Load schemes from the JSON data
    setSchemes(schemesData.schemes);
  }, []);

  const speakHindi = (text: string, schemeId: number) => {
    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9; // Slightly slower rate for better comprehension

    // Set the speaking state to show the active scheme
    setSpeaking(schemeId);

    // Add event listener for when speech ends
    utterance.onend = () => {
      setSpeaking(null);
    };

    // Speak the text
    window.speechSynthesis.speak(utterance);
  };

  // Get category color based on the scheme category
  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      agriculture: 'bg-green-100 text-green-800',
      insurance: 'bg-blue-100 text-blue-800',
      finance: 'bg-yellow-100 text-yellow-800',
      organic: 'bg-emerald-100 text-emerald-800',
      sustainability: 'bg-teal-100 text-teal-800',
      irrigation: 'bg-cyan-100 text-cyan-800',
      technology: 'bg-purple-100 text-purple-800'
    };

    return categoryColors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="text-green-600 hover:text-green-700 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-green-800 mb-4">Government Schemes for Farmers</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore various government schemes designed to support farmers across India. 
            Click on the speaker icon to hear the summary in Hindi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <Card 
              key={scheme.id} 
              className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden="true">{scheme.emoji}</span>
                    <CardTitle className="text-xl font-bold">{scheme.name}</CardTitle>
                  </div>
                  <Badge className={getCategoryColor(scheme.category)}>
                    {scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">{scheme.department}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800">Eligibility</h3>
                  <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Benefits</h3>
                  <p className="text-sm text-gray-600">{scheme.benefits}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Application Deadline</h3>
                  <p className="text-sm text-gray-600">{scheme.applicationDeadline}</p>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <h3 className="font-medium text-gray-800">हिंदी में सारांश</h3>
                  <p className="text-sm text-gray-600 mt-1">{scheme.hindiSummary}</p>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`flex items-center gap-2 ${speaking === scheme.id ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
                  onClick={() => speakHindi(scheme.hindiSummary, scheme.id)}
                  disabled={speaking !== null && speaking !== scheme.id}
                >
                  <Volume2 className="h-4 w-4" />
                  {speaking === scheme.id ? 'Speaking...' : 'Listen in Hindi'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GovernmentSchemesPage;
