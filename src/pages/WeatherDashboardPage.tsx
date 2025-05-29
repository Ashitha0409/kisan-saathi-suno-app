import { WeatherDashboard } from "@/components/weather/WeatherDashboard";

export default function WeatherDashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Weather Dashboard</h1>
      <WeatherDashboard />
    </div>
  );
}
