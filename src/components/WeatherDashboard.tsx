
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Loader2 } from 'lucide-react';

interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getWeatherData = async (lat: number, lon: number) => {
    try {
      const apiKey = '22a9831f6513d7cbe2fa1148144d41c5';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setWeatherData(data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching weather data');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setError('Geolocation error: ' + error.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  const weatherIcon = () => {
    switch (weatherData.weather[0].description.toLowerCase()) {
      case 'clear sky':
        return <Sun className="h-16 w-16 text-yellow-400" />;
      case 'few clouds':
      case 'scattered clouds':
      case 'broken clouds':
        return <Cloud className="h-16 w-16 text-gray-400" />;
      case 'rain':
      case 'light rain':
      case 'moderate rain':
        return <CloudRain className="h-16 w-16 text-blue-400" />;
      default:
        return <Cloud className="h-16 w-16 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Current Weather</h2>
        <p className="text-gray-600">Your location's current weather conditions</p>
      </div>

      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-center text-xl">Weather Details</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center">
            {weatherIcon()}
          </div>
          <div>
            <div className="text-4xl font-bold">{Math.round(weatherData.main.temp)}°C</div>
            <div className="text-blue-100">{weatherData.weather[0].description}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-blue-200">Humidity</div>
              <div className="font-semibold">{weatherData.main.humidity}%</div>
            </div>
            <div>
              <div className="text-blue-200">Wind</div>
              <div className="font-semibold">{Math.round(weatherData.wind.speed)} km/h</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherDashboard;
