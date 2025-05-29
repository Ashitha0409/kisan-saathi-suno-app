
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import FeatureCard from '@/components/FeatureCard';
import { 
  Sprout, 
  Cloud, 
  MessageSquare, 
  BookOpen, 
  Search,
  Youtube
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const Index = () => {
  const features = [
    {
      icon: Sprout,
      title: "Crop Recommendation",
      description: "Get AI-powered crop suggestions based on your soil, climate, and location for maximum yield.",
      gradient: "from-green-400 to-green-600",
      route: '/crop-recommendation'
    },
    {
      icon: Search,
      title: "Crop Management",
      description: "Track your crops from planting to harvest with smart scheduling and reminders.",
      gradient: "from-blue-400 to-blue-600",
      route: '/crop-management'
    },
    {
      icon: Search,
      title: "Disease Detection",
      description: "Upload crop images to identify diseases and get treatment recommendations instantly.",
      gradient: "from-red-400 to-red-600",
      route: '/disease-detection'
    },
    {
      icon: MessageSquare,
      title: "Farming Assistant",
      description: "Get instant answers to your farming questions from our AI-powered chatbot.",
      gradient: "from-purple-400 to-purple-600",
      route: '/chatbot'
    },
    {
      icon: Youtube,
      title: "Farming Tutorials",
      description: "Learn modern farming techniques through curated video tutorials and guides.",
      gradient: "from-orange-400 to-orange-600",
      route: '/tutorials'
    },
    {
      icon: Cloud,
      title: "Weather Dashboard",
      description: "Plan your farming activities with accurate weather forecasts and farming advisories.",
      gradient: "from-cyan-400 to-cyan-600",
      route: '/weather'
    },
    {
      icon: Search,
      title: "Market Prices",
      description: "Check live vegetable and crop prices from major markets to plan your sales.",
      gradient: "from-yellow-400 to-yellow-600",
      route: '/market-prices'
    },
    {
      icon: BookOpen,
      title: "Government Schemes",
      description: "Access information about agricultural schemes, subsidies, and government benefits.",
      gradient: "from-indigo-400 to-indigo-600",
      route: '/government-schemes'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <Header />
      
      {/* Login Button */}
      <div className="container mx-auto px-4 py-4 flex justify-end">
        <Link to="/login">
          <Button className="bg-green-600 hover:bg-green-700">
            Login
          </Button>
        </Link>
      </div>
      
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
            <Link key={index} to={feature.route}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
              />
            </Link>
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
    </div>
  );
};

export default Index;
