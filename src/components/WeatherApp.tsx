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

  // OpenWeatherMap API key
  const apiKey = '22a9831f6513d7cbe2fa1148144d41c5';

  const getWeatherData = async (city: string) => {
    try {
      setLoading(true);
      setError(null);

      // Format city name to handle spaces and special characters
      const formattedCity = encodeURIComponent(city.trim());

      // Get current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${formattedCity}&appid=${apiKey}&units=metric`
      );
      
      if (!currentResponse.ok) {
        const errorData = await currentResponse.json();
        throw new Error(errorData.message || 'City not found. Please check the city name and try again.');
      }

      const currentData = await currentResponse.json();
      setWeatherData(currentData);

      // Get 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${formattedCity}&appid=${apiKey}&units=metric`
      );
      
      if (!forecastResponse.ok) {
        const errorData = await forecastResponse.json();
        throw new Error(errorData.message || 'Failed to fetch forecast data');
      }

      const forecastData = await forecastResponse.json();
      setForecastData(forecastData);
    } catch (err) {
      console.error('Weather API Error:', err);
      setError(err instanceof Error ? err.message : 'Error fetching weather data. Please try again.');
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

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name (e.g., London, Mumbai, New York)"
              className="flex-1 p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          </form>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              {error}
            </div>
          )}

          {weatherData && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-4">{weatherData.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-4xl font-bold">{Math.round(weatherData.main.temp)}°C</p>
                    <p className="text-gray-600">{weatherData.weather[0].description}</p>
                  </div>
                  <div>
                    <img
                      src={getWeatherIcon(weatherData.weather[0].icon)}
                      alt={weatherData.weather[0].description}
                      className="w-20 h-20"
                    />
                  </div>
                  <div className="col-span-2">
                    <p>Humidity: {weatherData.main.humidity}%</p>
                    <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                  </div>
                </div>
              </div>

              {forecastData && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {forecastData.list
                      .filter((item, index) => index % 8 === 0)
                      .map((item, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                          <p className="font-semibold">
                            {new Date(item.dt_txt).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <img
                            src={getWeatherIcon(item.weather[0].icon)}
                            alt={item.weather[0].description}
                            className="w-12 h-12 mx-auto"
                          />
                          <p className="text-lg font-bold">{Math.round(item.main.temp)}°C</p>
                          <p className="text-sm text-gray-600">{item.weather[0].description}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default WeatherApp;
