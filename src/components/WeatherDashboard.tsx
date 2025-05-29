
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Search, 
  Loader2, 
  RefreshCw, 
  Thermometer, 
  Droplets, 
  Wind, 
  Umbrella, 
  MapPin, 
  Calendar, 
  Clock,
  AlertCircle
} from 'lucide-react';

// Weather data interface
interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  rain?: {
    "1h"?: number;
    "3h"?: number;
  };
  dt: number;
}

const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // API key from environment variables
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Function to fetch weather data
  const fetchWeatherData = async () => {
    if (!city.trim()) {
      setError('Please enter a city name or pincode');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Location not found. Please check the city name or pincode.');
        }
        throw new Error('Failed to fetch weather data. Please try again.');
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh weather data
  const handleRefresh = () => {
    if (weatherData) {
      fetchWeatherData();
    }
  };

  // Function to handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData();
  };

  // Function to get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <CloudRain className="h-16 w-16 text-blue-200" />;
    } else if (conditionLower.includes('cloud')) {
      return <Cloud className="h-16 w-16 text-blue-200" />;
    } else {
      return <Sun className="h-16 w-16 text-yellow-200" />;
    }
  };

  // Function to get background class based on weather condition
  const getWeatherBackgroundClass = (condition: string): string => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear')) {
      return 'from-blue-400 to-blue-600';
    } else if (conditionLower.includes('cloud')) {
      return 'from-gray-400 to-gray-600';
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return 'from-blue-600 to-blue-800';
    } else if (conditionLower.includes('thunderstorm')) {
      return 'from-gray-700 to-gray-900';
    } else if (conditionLower.includes('snow')) {
      return 'from-blue-100 to-blue-300';
    } else {
      return 'from-blue-500 to-blue-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Weather Dashboard</h2>
        <p className="text-gray-600">Plan your farming activities with accurate weather forecasts</p>
      </div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6 border shadow-md">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Enter city name or pincode..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Card className="bg-destructive/10 border-destructive">
            <CardContent className="pt-6 flex items-center">
              <AlertCircle className="h-5 w-5 text-destructive mr-2" />
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center my-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {/* Weather Data Display */}
      {weatherData && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Refresh Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Current Weather */}
          <Card className={`bg-gradient-to-br ${getWeatherBackgroundClass(weatherData.weather[0].main)} text-white border-0`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {weatherData.name}, {weatherData.sys.country}
                </div>
                <div className="text-sm flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(weatherData.dt * 1000), 'EEEE, MMM d, yyyy')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {getWeatherIcon(weatherData.weather[0].main)}
                  <div className="ml-4">
                    <div className="text-4xl font-bold">{Math.round(weatherData.main.temp)}°C</div>
                    <div className="text-white/80 capitalize">{weatherData.weather[0].description}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white/80">Feels like</div>
                  <div className="text-2xl font-semibold">{Math.round(weatherData.main.feels_like)}°C</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col items-center p-3 bg-white/10 rounded-lg">
                  <Droplets className="h-6 w-6 mb-2" />
                  <div className="text-white/80">Humidity</div>
                  <div className="font-semibold">{weatherData.main.humidity}%</div>
                </div>
                <div className="flex flex-col items-center p-3 bg-white/10 rounded-lg">
                  <Wind className="h-6 w-6 mb-2" />
                  <div className="text-white/80">Wind</div>
                  <div className="font-semibold">{Math.round(weatherData.wind.speed)} km/h</div>
                </div>
                <div className="flex flex-col items-center p-3 bg-white/10 rounded-lg">
                  <Thermometer className="h-6 w-6 mb-2" />
                  <div className="text-white/80">Min/Max</div>
                  <div className="font-semibold">{Math.round(weatherData.main.temp_min)}° / {Math.round(weatherData.main.temp_max)}°</div>
                </div>
              </div>

              {weatherData.rain && weatherData.rain["1h"] && (
                <div className="flex items-center p-3 bg-white/10 rounded-lg">
                  <Umbrella className="h-6 w-6 mr-3" />
                  <div>
                    <div className="text-white/80">Rainfall (1h)</div>
                    <div className="font-semibold">{weatherData.rain["1h"]} mm</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weather Advisory */}
          <Card className="border-0 bg-gradient-to-r from-green-50 to-yellow-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Weather Advisory</h3>
              <div className="text-gray-700">
                {weatherData.weather[0].main.toLowerCase().includes('rain') ? (
                  <p className="mb-2">☔ <strong>Advisory:</strong> Rain detected. Consider postponing outdoor activities like spraying pesticides or fertilizers.</p>
                ) : weatherData.weather[0].main.toLowerCase().includes('clear') ? (
                  <p className="mb-2">☀️ <strong>Advisory:</strong> Clear weather is good for harvesting and field work. Ensure proper hydration for crops if temperatures are high.</p>
                ) : weatherData.weather[0].main.toLowerCase().includes('cloud') ? (
                  <p className="mb-2">☁️ <strong>Advisory:</strong> Cloudy conditions are good for transplanting and field preparation activities.</p>
                ) : (
                  <p className="mb-2">🌱 <strong>Advisory:</strong> Monitor weather conditions closely for any changes that might affect your farming activities.</p>
                )}
                <p className="text-xs text-gray-500 mt-4">Last updated: {format(new Date(weatherData.dt * 1000), 'h:mm a')}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default WeatherDashboard;
