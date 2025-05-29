
import React from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';

const TutorialsPage = () => {
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
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Farming Tutorials</h2>
        <p className="text-gray-600 mb-8">Learn modern farming techniques</p>
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-8 rounded-lg">
          <p className="text-lg text-gray-700">Coming Soon! Access curated video tutorials, farming guides, and educational content to improve your farming techniques.</p>
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;
