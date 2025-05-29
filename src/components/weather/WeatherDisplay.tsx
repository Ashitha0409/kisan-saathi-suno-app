import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Umbrella, 
  MapPin, 
  Calendar, 
  Clock 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherData } from "@/types/weather";
import { getWeatherBackgroundClass } from "@/lib/weatherUtils";

interface WeatherDisplayProps {
  weatherData: WeatherData;
}

export function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  const {
    name,
    sys,
    main,
    weather,
    wind,
    rain,
    dt,
  } = weatherData;

  const date = new Date(dt * 1000);
  const formattedDate = format(date, "EEEE, MMMM do, yyyy");
  const formattedTime = format(date, "h:mm a");
  const weatherCondition = weather[0].main.toLowerCase();
  const backgroundClass = getWeatherBackgroundClass(weatherCondition);
  
  return (
    <motion.div
      className={`rounded-lg overflow-hidden ${backgroundClass}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-background/80 backdrop-blur-sm border-none">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {name}, {sys.country}
              </CardTitle>
              <div className="text-sm text-muted-foreground mt-1 flex items-center gap-4">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formattedDate}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formattedTime}
                </span>
              </div>
            </div>
            <div className="text-right">
              <img 
                src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`} 
                alt={weather[0].description}
                className="w-16 h-16 inline-block"
              />
              <div className="text-sm capitalize">{weather[0].description}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center">
                <Thermometer className="h-8 w-8 mr-3 text-orange-500" />
                <div>
                  <div className="text-4xl font-bold">{Math.round(main.temp)}°C</div>
                  <div className="text-sm text-muted-foreground">
                    Feels like {Math.round(main.feels_like)}°C
                  </div>
                </div>
              </div>
              
              <div className="text-sm flex items-center">
                <span className="text-muted-foreground mr-2">Min/Max:</span>
                <span>{Math.round(main.temp_min)}°C / {Math.round(main.temp_max)}°C</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <div className="text-sm text-muted-foreground mb-1 flex items-center">
                  <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                  Humidity
                </div>
                <div className="font-medium">{main.humidity}%</div>
              </div>
              
              <div className="flex flex-col">
                <div className="text-sm text-muted-foreground mb-1 flex items-center">
                  <Wind className="h-4 w-4 mr-1 text-cyan-500" />
                  Wind
                </div>
                <div className="font-medium">{Math.round(wind.speed)} km/h</div>
              </div>
              
              {rain && rain["1h"] && (
                <div className="flex flex-col">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center">
                    <Umbrella className="h-4 w-4 mr-1 text-indigo-500" />
                    Rainfall (1h)
                  </div>
                  <div className="font-medium">{rain["1h"]} mm</div>
                </div>
              )}
              
              <div className="flex flex-col">
                <div className="text-sm text-muted-foreground mb-1">Pressure</div>
                <div className="font-medium">{main.pressure} hPa</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
