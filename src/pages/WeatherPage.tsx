
import React from 'react';
import Header from '@/components/Header';
import WeatherDashboard from '@/components/WeatherDashboard';
import { Link } from 'react-router-dom';

const WeatherPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <Header />
      <div className="container mx-auto px-4 py-4">
        <Link
          to="/"
          className="text-green-600 hover:text-green-700 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
      <WeatherDashboard />
    </div>
  );
};

export default WeatherPage;
