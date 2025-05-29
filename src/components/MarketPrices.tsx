
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

const MarketPrices = () => {
  const priceData = [
    { crop: 'Tomato', price: '₹25', unit: 'per kg', change: '+5%', trending: 'up' },
    { crop: 'Onion', price: '₹30', unit: 'per kg', change: '-2%', trending: 'down' },
    { crop: 'Potato', price: '₹20', unit: 'per kg', change: '+3%', trending: 'up' },
    { crop: 'Rice', price: '₹45', unit: 'per kg', change: '0%', trending: 'stable' },
    { crop: 'Wheat', price: '₹25', unit: 'per kg', change: '+1%', trending: 'up' },
    { crop: 'Carrot', price: '₹35', unit: 'per kg', change: '-1%', trending: 'down' },
    { crop: 'Cabbage', price: '₹15', unit: 'per kg', change: '+2%', trending: 'up' },
    { crop: 'Cauliflower', price: '₹40', unit: 'per kg', change: '+4%', trending: 'up' },
  ];

  const getTrendColor = (trending: string) => {
    switch (trending) {
      case 'up': return 'bg-green-100 text-green-800';
      case 'down': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trending: string) => {
    switch (trending) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Market Prices</h2>
        <p className="text-gray-600">Live vegetable and crop prices from major markets</p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6 border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for crops, vegetables..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Price Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {priceData.map((item, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{item.crop}</h3>
                <span className="text-2xl">{getTrendIcon(item.trending)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">
                  {item.price}
                  <span className="text-sm text-gray-500 font-normal ml-1">{item.unit}</span>
                </div>
                
                <Badge className={getTrendColor(item.trending)}>
                  {item.change} vs yesterday
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Info */}
      <Card className="mt-8 border-0 bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Market Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">📈 Top Gainers</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Tomato (+5%)</li>
                <li>Cauliflower (+4%)</li>
                <li>Potato (+3%)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">📉 Top Decliners</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Onion (-2%)</li>
                <li>Carrot (-1%)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">🏪 Market Status</h4>
              <p className="text-sm text-gray-600">
                Prices updated: Today 2:00 PM<br/>
                Next update: 6:00 PM<br/>
                Markets: Open
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketPrices;
