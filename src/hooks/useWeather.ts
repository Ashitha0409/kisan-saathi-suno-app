import { useQuery } from "@tanstack/react-query";
import { WeatherData } from "@/types/weather";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

/**
 * Custom hook to fetch weather data from OpenWeatherMap API
 */
export function useWeather(location: string) {
  return useQuery<WeatherData, Error>({
    queryKey: ["weather", location],
    queryFn: async () => {
      if (!location) {
        throw new Error("Please enter a location");
      }

      const params = new URLSearchParams({
        q: location,
        appid: API_KEY,
        units: "metric", // Use Celsius
      });

      const response = await fetch(`${BASE_URL}?${params}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Location not found. Please check the city name or pincode and try again.");
        }
        throw new Error("Failed to fetch weather data. Please try again later.");
      }
      
      return response.json();
    },
    enabled: !!location, // Only run the query if location is provided
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
