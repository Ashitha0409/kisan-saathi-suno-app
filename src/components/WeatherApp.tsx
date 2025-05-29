import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from 'lucide-react';

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
  name: string;
}

interface ForecastData {
  list: Array<{
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
    dt_txt: string;
  }>;
  city: {
    name: string;
  };
}

export function WeatherApp() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Using a different API key that should work
  const apiKey = '1c9770dfaf3b327dd03510a4c07b7f2d';

  const getWeatherData = async (city: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Failed to fetch current weather data');
      }

      const currentData = await currentResponse.json();
      console.log('Current weather data:', currentData);
      setWeatherData(currentData);

      // Get 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }

      const forecastData = await forecastResponse.json();
      console.log('Forecast data:', forecastData);
      setForecastData(forecastData);
    } catch (err) {
      setError('Error fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      getWeatherData(city);
    }
  };

  const weatherIcon = (description: string) => {
    switch (description.toLowerCase()) {
      case 'clear sky':
        return '☀️';
      case 'few clouds':
      case 'scattered clouds':
      case 'broken clouds':
        return '☁️';
      case 'rain':
      case 'light rain':
      case 'moderate rain':
        return '🌧️';
      default:
        return '☁️';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Weather Forecast</h2>
        <p className="text-gray-600">Check weather for yesterday, today, and tomorrow</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>

      {weatherData && forecastData && forecastData.list && forecastData.list.length > 0 && (
        <div className="grid gap-6">
          {/* Yesterday's Weather */}
          <Card>
            <CardHeader>
              <CardTitle>Yesterday</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="text-5xl mb-2">
                {weatherIcon(forecastData.list[0].weather[0].description)}
              </div>
              <div className="text-4xl font-bold">
                {Math.round(forecastData.list[0].main.temp)}°C
              </div>
              <div className="text-gray-600">{forecastData.list[0].weather[0].description}</div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Humidity</div>
                  <div className="font-semibold">
                    {forecastData.list[0].main.humidity}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Wind</div>
                  <div className="font-semibold">
                    {Math.round(forecastData.list[0].wind.speed)} km/h
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Weather */}
          <Card>
            <CardHeader>
              <CardTitle>Today</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="text-5xl mb-2">
                {weatherIcon(weatherData.weather[0].description)}
              </div>
              <div className="text-4xl font-bold">
                {Math.round(weatherData.main.temp)}°C
              </div>
              <div className="text-gray-600">{weatherData.weather[0].description}</div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Humidity</div>
                  <div className="font-semibold">{weatherData.main.humidity}%</div>
                </div>
                <div>
                  <div className="text-gray-500">Wind</div>
                  <div className="font-semibold">
                    {Math.round(weatherData.wind.speed)} km/h
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tomorrow's Weather */}
          <Card>
            <CardHeader>
              <CardTitle>Tomorrow</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="text-5xl mb-2">
                {weatherIcon(forecastData.list[8].weather[0].description)}
              </div>
              <div className="text-4xl font-bold">
                {Math.round(forecastData.list[8].main.temp)}°C
              </div>
              <div className="text-gray-600">{forecastData.list[8].weather[0].description}</div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Humidity</div>
                  <div className="font-semibold">
                    {forecastData.list[8].main.humidity}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Wind</div>
                  <div className="font-semibold">
                    {Math.round(forecastData.list[8].wind.speed)} km/h
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
