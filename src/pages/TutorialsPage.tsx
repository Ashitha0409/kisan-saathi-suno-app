import React, { useEffect, useState, useRef } from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';

// Declare global WebkitSpeechRecognition types
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    channelTitle: string;
  };
}

const CATEGORIES = [
  'All Categories',
  'Soil Preparation',
  'Irrigation Techniques',
  'Organic Farming',
  'Pest Control',
  'Crop Management',
  'Harvesting Tips',
] as const;

const LANGUAGES = [
  { code: 'en', name: 'English', relevanceLanguage: 'en', searchPrefix: '' },
  { code: 'hi', name: 'Hindi', relevanceLanguage: 'hi', searchPrefix: 'hindi' },
  { code: 'kn', name: 'Kannada', relevanceLanguage: 'kn', searchPrefix: 'ಕನ್ನಡ' },
] as const;

const TutorialsPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState('real farming techniques');
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>('All Categories');
  const [selectedLanguage, setSelectedLanguage] = useState<typeof LANGUAGES[number]>(LANGUAGES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const API_KEY = 'AIzaSyDrkw80w7aFErB8F2oPZpoHaU_UY1X30eU';

  const fetchVideos = async (query: string, category: string, language: typeof LANGUAGES[number]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let finalQuery = '';
      
      if (language.searchPrefix) {
        finalQuery += `${language.searchPrefix} `;
      }
      
      finalQuery += query;
      
      if (category !== 'All Categories') {
        finalQuery += ` ${category}`;
      }
      
      finalQuery += ' -minecraft -game -gaming';

      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(finalQuery)}&type=video&maxResults=10&key=${API_KEY}&relevanceLanguage=${language.relevanceLanguage}&regionCode=IN&videoCaption=any&hl=${language.code}`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      setVideos(data.items || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to load videos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Voice search is not supported in your browser. Please use Chrome.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = selectedLanguage.code === 'kn' ? 'kn-IN' : 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      setError('Error occurred in voice recognition. Please try again.');
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      if (searchInputRef.current) {
        searchInputRef.current.value = transcript;
      }
      setSearchQuery(transcript + ' farming techniques');
    };

    recognition.start();
  };

  useEffect(() => {
    fetchVideos(searchQuery, selectedCategory, selectedLanguage);
  }, [searchQuery, selectedCategory, selectedLanguage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchInput = (e.target as HTMLFormElement).search.value.trim();
    if (searchInput) {
      setSearchQuery(searchInput + ' farming techniques');
    }
  };

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
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 max-w-xl mx-auto">
              <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 focus-within:border-green-500 bg-white">
                <input
                  ref={searchInputRef}
                  type="text"
                  name="search"
                  placeholder="Search farming tutorials (e.g., rice farming, vermicompost)..."
                  className="flex-1 outline-none bg-transparent"
                  defaultValue={searchQuery.replace(' farming techniques', '')}
                />
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  disabled={isLoading || isListening}
                  className={`p-2 rounded-full transition-colors ${
                    isListening 
                      ? 'bg-red-100 text-red-600 animate-pulse' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Voice search"
                >
                  {isListening ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5M12 19H8.5a3.5 3.5 0 100 7h7a3.5 3.5 0 100-7H12zm0-14a3 3 0 110 6 3 3 0 010-6z" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={isLoading || isListening}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Search'
                )}
              </button>
            </div>

            <div className="flex gap-4 justify-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as typeof CATEGORIES[number])}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
                disabled={isLoading}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedLanguage.code}
                onChange={(e) => {
                  const lang = LANGUAGES.find(l => l.code === e.target.value);
                  if (lang) setSelectedLanguage(lang);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
                disabled={isLoading}
              >
                {LANGUAGES.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        {error && (
          <div className="text-red-600 mb-4 p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Farming Tutorials</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg text-gray-600">Loading videos...</span>
                </div>
              </div>
            ) : videos.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-600">
                No videos found. Try a different search term or language.
              </div>
            ) : (
              videos.map((video) => (
                <a
                  key={video.id.videoId}
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                      {video.snippet.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {video.snippet.channelTitle}
                    </p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;
