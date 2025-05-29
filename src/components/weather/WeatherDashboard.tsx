import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWeather } from "@/hooks/useWeather";
import { WeatherDisplay } from "./WeatherDisplay";

export function WeatherDashboard() {
  const [city, setCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, error, refetch } = useWeather(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(city);
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Search Location</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Enter city name or pincode..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {isLoading && (
        <div className="flex justify-center my-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {isError && (
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">
              {error instanceof Error 
                ? error.message 
                : "Failed to fetch weather data. Please try again."}
            </p>
          </CardContent>
        </Card>
      )}

      {data && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <WeatherDisplay weatherData={data} />
        </motion.div>
      )}
    </div>
  );
}
