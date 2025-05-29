import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define global types
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}

// Languages supported by the app
const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' }
];

// Translation data (simplified example)
const translations: Record<string, Record<string, string>> = {
  en: {
    'app.title': 'Kisan Saathi',
    'app.subtitle': 'Your Farming Companion',
    'language.select': 'Select Language',
    'button.translate': 'Translate'
  },
  hi: {
    'app.title': 'किसान साथी',
    'app.subtitle': 'आपका कृषि साथी',
    'language.select': 'भाषा चुनें',
    'button.translate': 'अनुवाद'
  },
  kn: {
    'app.title': 'ಕಿಸಾನ್ ಸಾಥಿ',
    'app.subtitle': 'ನಿಮ್ಮ ಕೃಷಿ ಸಂಗಾತಿ',
    'language.select': 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'button.translate': 'ಅನುವಾದಿಸು'
  }
};

// Create a language context with proper types
type LanguageContextType = {
  language: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
};

export const LanguageContext = React.createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string): string => ''
});

// Language provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language
export const useLanguage = () => {
  return React.useContext(LanguageContext);
};

// Function to translate the entire page using Google Translate API
const translatePage = (targetLang: string) => {
  // Skip if already in English (default language)
  if (targetLang === 'en') {
    // Reset to original content if we have a reference
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('lang', 'en');
    
    // If Google Translate has been loaded, try to reset to English
    const iframe = document.querySelector('iframe.goog-te-banner-frame') as HTMLIFrameElement;
    if (iframe) {
      const resetLink = iframe.contentDocument?.querySelector('.goog-te-banner-frame a.goog-te-menu-value span:first-child');
      if (resetLink) {
        (resetLink as HTMLElement).click();
      }
    }
    return;
  }

  // Set the html lang attribute
  const htmlElement = document.documentElement;
  htmlElement.setAttribute('lang', targetLang);

  // Check if Google Translate script is already loaded
  if (document.querySelector('script[src*="translate.google.com/translate_a/element.js"]')) {
    // Script already exists, just trigger the translation
    if (typeof window.googleTranslateElementInit === 'function') {
      window.googleTranslateElementInit();
    }
    return;
  }

  // Use Google Translate API directly
  const script = document.createElement('script');
  script.src = `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
  script.async = true;
  
  // Define the initialization function
  window.googleTranslateElementInit = function() {
    // Use type assertion to avoid TypeScript errors
    const google = (window as any).google;
    if (google && google.translate) {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,kn',
        autoDisplay: false,
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
      
      // Trigger translation to the target language
      setTimeout(() => {
        const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = targetLang;
          selectElement.dispatchEvent(new Event('change'));
        }
      }, 1000);
    }
  };
  
  // Add the script to the page
  document.head.appendChild(script);
};

const CustomLanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();

  // Initialize Google Translate element
  useEffect(() => {
    // Create a hidden div for Google Translate
    const translateDiv = document.createElement('div');
    translateDiv.id = 'google_translate_element';
    translateDiv.style.display = 'none';
    document.body.appendChild(translateDiv);

    return () => {
      if (translateDiv && translateDiv.parentNode) {
        translateDiv.parentNode.removeChild(translateDiv);
      }
    };
  }, []);

  // Apply translation when language changes
  useEffect(() => {
    translatePage(language);
  }, [language]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get the background color based on language
  const getLanguageColor = (code: string) => {
    switch (code) {
      case 'en': return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'hi': return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
      case 'kn': return 'bg-green-100 text-green-700 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  return (
    <div 
      ref={ref}
      className="fixed bottom-4 left-4 z-50"
    >
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-green-500 shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-4 w-4" />
        <span className="inline">{t('button.translate')}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg p-4 w-48"
          >
            <div className="text-sm text-gray-600 mb-2 font-medium">{t('language.select')}:</div>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-2 text-sm rounded flex items-center justify-between bg-blue-100 text-blue-700 hover:bg-blue-200 ${language === 'en' ? 'ring-2 ring-offset-1 ring-green-500' : ''}`}
              >
                <span>English</span>
              </button>
              <button 
                onClick={() => setLanguage('hi')}
                className={`px-3 py-2 text-sm rounded flex items-center justify-between bg-orange-100 text-orange-700 hover:bg-orange-200 ${language === 'hi' ? 'ring-2 ring-offset-1 ring-green-500' : ''}`}
              >
                <span>हिन्दी (Hindi)</span>
              </button>
              <button 
                onClick={() => setLanguage('kn')}
                className={`px-3 py-2 text-sm rounded flex items-center justify-between bg-green-100 text-green-700 hover:bg-green-200 ${language === 'kn' ? 'ring-2 ring-offset-1 ring-green-500' : ''}`}
              >
                <span>ಕನ್ನಡ (Kannada)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomLanguageSelector;
