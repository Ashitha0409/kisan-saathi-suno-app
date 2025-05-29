
import React, { useState } from 'react';
import Header from '@/components/Header';
import FeatureCard from '@/components/FeatureCard';
import CropRecommendation from '@/components/CropRecommendation';
import WeatherDashboard from '@/components/WeatherDashboard';
import Chatbot from '@/components/Chatbot';
import MarketPrices from '@/components/MarketPrices';
import { 
  Sprout, 
  Cloud, 
  MessageSquare, 
  BookOpen, 
  Search,
  Youtube
} from 'lucide-react';

type ActiveComponent = 'home' | 'crop-recommendation' | 'weather' | 'chatbot' | 'market-prices' | 'crop-management' | 'disease-detection' | 'tutorials';

const Index = () => {
  const [activeComponent, setActiveComponent] = useState<ActiveComponent>('home');

  const features = [
    {
      icon: Sprout,
      title: "Crop Recommendation",
      description: "Get AI-powered crop suggestions based on your soil, climate, and location for maximum yield.",
      gradient: "from-green-400 to-green-600",
      component: 'crop-recommendation' as ActiveComponent
    },
    {
      icon: Search,
      title: "Crop Management",
      description: "Track your crops from planting to harvest with smart scheduling and reminders.",
      gradient: "from-blue-400 to-blue-600",
      component: 'crop-management' as ActiveComponent
    },
    {
      icon: Search,
      title: "Disease Detection",
      description: "Upload crop images to identify diseases and get treatment recommendations instantly.",
      gradient: "from-red-400 to-red-600",
      component: 'disease-detection' as ActiveComponent
    },
    {
      icon: MessageSquare,
      title: "Farming Assistant",
      description: "Get instant answers to your farming questions from our AI-powered chatbot.",
      gradient: "from-purple-400 to-purple-600",
      component: 'chatbot' as ActiveComponent
    },
    {
      icon: Youtube,
      title: "Farming Tutorials",
      description: "Learn modern farming techniques through curated video tutorials and guides.",
      gradient: "from-orange-400 to-orange-600",
      component: 'tutorials' as ActiveComponent
    },
    {
      icon: Cloud,
      title: "Weather Dashboard",
      description: "Plan your farming activities with accurate weather forecasts and farming advisories.",
      gradient: "from-cyan-400 to-cyan-600",
      component: 'weather' as ActiveComponent
    },
    {
      icon: Search,
      title: "Market Prices",
      description: "Check live vegetable and crop prices from major markets to plan your sales.",
      gradient: "from-yellow-400 to-yellow-600",
      component: 'market-prices' as ActiveComponent
    },
    {
      icon: BookOpen,
      title: "Government Schemes",
      description: "Access information about agricultural schemes, subsidies, and government benefits.",
      gradient: "from-indigo-400 to-indigo-600",
      component: 'home' as ActiveComponent
    }
  ];

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'crop-recommendation':
        return <CropRecommendation />;
      case 'weather':
        return <WeatherDashboard />;
      case 'chatbot':
        return <Chatbot />;
      case 'market-prices':
        return <MarketPrices />;
      case 'crop-management':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Crop Management</h2>
            <p className="text-gray-600 mb-8">Track your crops from planting to harvest</p>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg">
              <p className="text-lg text-gray-700">Coming Soon! This feature will help you manage your crop schedules, track growth stages, and set reminders for important farming activities.</p>
            </div>
          </div>
        );
      case 'disease-detection':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Disease Detection</h2>
            <p className="text-gray-600 mb-8">Upload crop images for instant disease identification</p>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-lg">
              <p className="text-lg text-gray-700">Coming Soon! Upload photos of your crops to get instant disease identification and treatment recommendations.</p>
            </div>
          </div>
        );
      case 'tutorials':
        return (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Farming Tutorials</h2>
            <p className="text-gray-600 mb-8">Learn modern farming techniques</p>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-8 rounded-lg">
              <p className="text-lg text-gray-700">Coming Soon! Access curated video tutorials, farming guides, and educational content to improve your farming techniques.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Your Complete <span className="text-green-600">Farming Companion</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Empowering farmers with AI-driven insights, real-time weather updates, market prices, 
                and expert guidance to maximize crop yield and profitability.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  gradient={feature.gradient}
                  onClick={() => setActiveComponent(feature.component)}
                />
              ))}
            </div>

            <div className="mt-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Start Your Smart Farming Journey Today</h3>
              <p className="text-green-100 mb-6">
                Join thousands of farmers who are already using Kisan Saathi to improve their farming practices.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-white/20 px-4 py-2 rounded-lg">✅ Free to Use</div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">🌱 AI-Powered</div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">📱 Mobile Friendly</div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">🇮🇳 Made for India</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <Header />
      
      {activeComponent !== 'home' && (
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => setActiveComponent('home')}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      )}
      
      {renderActiveComponent()}
    </div>
  );
};

export default Index;
