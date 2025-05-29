
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun } from 'lucide-react';

const WeatherDashboard = () => {
  const weatherData = {
    current: {
      temp: 28,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12
    },
    forecast: [
      { day: 'Today', temp: '28°/22°', condition: 'Partly Cloudy', icon: Cloud },
      { day: 'Tomorrow', temp: '25°/20°', condition: 'Rainy', icon: CloudRain },
      { day: 'Day 3', temp: '30°/24°', condition: 'Sunny', icon: Sun },
      { day: 'Day 4', temp: '27°/21°', condition: 'Cloudy', icon: Cloud },
    ]
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Weather Dashboard</h2>
        <p className="text-gray-600">Plan your farming activities with accurate weather forecasts</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Weather */}
        <Card className="lg:col-span-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-center text-xl">Current Weather</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex justify-center">
              <Cloud className="h-16 w-16 text-blue-200" />
            </div>
            <div>
              <div className="text-4xl font-bold">{weatherData.current.temp}°C</div>
              <div className="text-blue-100">{weatherData.current.condition}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-blue-200">Humidity</div>
                <div className="font-semibold">{weatherData.current.humidity}%</div>
              </div>
              <div>
                <div className="text-blue-200">Wind</div>
                <div className="font-semibold">{weatherData.current.windSpeed} km/h</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4-Day Forecast */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>4-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-800 mb-2">{day.day}</div>
                  <div className="flex justify-center mb-2">
                    <day.icon className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="text-sm font-semibold text-gray-700">{day.temp}</div>
                  <div className="text-xs text-gray-500">{day.condition}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Farming Advisory */}
      <Card className="mt-6 border-0 bg-gradient-to-r from-green-50 to-yellow-50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Farming Advisory</h3>
          <div className="text-gray-700">
            <p className="mb-2">🌱 <strong>Today:</strong> Good conditions for planting. Soil moisture is adequate.</p>
            <p className="mb-2">☔ <strong>Tomorrow:</strong> Rain expected. Postpone pesticide application.</p>
            <p>🌾 <strong>This Week:</strong> Ideal time for harvesting mature crops before rain.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherDashboard;
