/**
 * Returns a Tailwind CSS background class based on the weather condition
 */
export function getWeatherBackgroundClass(condition: string): string {
  switch (condition) {
    case 'clear':
      return 'bg-gradient-to-br from-blue-400 to-blue-200';
    case 'clouds':
      return 'bg-gradient-to-br from-gray-300 to-gray-100';
    case 'rain':
    case 'drizzle':
      return 'bg-gradient-to-br from-blue-700 to-blue-500';
    case 'thunderstorm':
      return 'bg-gradient-to-br from-gray-800 to-gray-600';
    case 'snow':
      return 'bg-gradient-to-br from-blue-100 to-gray-100';
    case 'mist':
    case 'fog':
    case 'haze':
      return 'bg-gradient-to-br from-gray-400 to-gray-200';
    default:
      return 'bg-gradient-to-br from-blue-300 to-blue-100';
  }
}

/**
 * Formats temperature to a readable string
 */
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

/**
 * Formats wind speed to a readable string
 */
export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} km/h`;
}

/**
 * Formats humidity to a readable string
 */
export function formatHumidity(humidity: number): string {
  return `${humidity}%`;
}

/**
 * Formats rainfall to a readable string
 */
export function formatRainfall(rain: number | undefined): string {
  if (!rain) return 'None';
  return `${rain} mm`;
}
