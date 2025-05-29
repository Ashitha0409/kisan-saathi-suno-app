import React, { useState } from 'react';
import { Card } from '@/components/ui/card';

interface FormData {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

const API_URL = 'http://127.0.0.1:8000';

export default function CropRecommendation() {
  const [formData, setFormData] = useState<FormData>({
    N: 0,
    P: 0,
    K: 0,
    temperature: 0,
    humidity: 0,
    ph: 0,
    rainfall: 0
  });
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction('');

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get prediction');
      }

      const data = await response.json();
      setPrediction(data.recommended_crop);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Crop Recommendation</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nitrogen (N)</label>
              <input
                type="number"
                name="N"
                value={formData.N}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phosphorus (P)</label>
              <input
                type="number"
                name="P"
                value={formData.P}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Potassium (K)</label>
              <input
                type="number"
                name="K"
                value={formData.K}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Temperature (°C)</label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Humidity (%)</label>
              <input
                type="number"
                name="humidity"
                value={formData.humidity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
                max="100"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">pH</label>
              <input
                type="number"
                name="ph"
                value={formData.ph}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
                max="14"
                step="0.1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rainfall (mm)</label>
              <input
                type="number"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {prediction && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
            <h2 className="font-bold">Recommended Crop:</h2>
            <p className="text-lg">{prediction}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
