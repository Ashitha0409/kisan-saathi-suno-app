import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Add custom styles for Google Translate widget
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-gadget {
        font-family: inherit !important;
        font-size: 0.875rem !important;
        color: #4b5563 !important;
      }
      
      .goog-te-gadget-simple {
        border: 1px solid #e5e7eb !important;
        border-radius: 0.375rem !important;
        padding: 0.5rem !important;
        width: 100% !important;
        background-color: #f9fafb !important;
      }
      
      .goog-te-menu-value {
        color: #4b5563 !important;
        text-decoration: none !important;
      }
      
      .goog-te-menu-value span {
        text-decoration: none !important;
      }
      
      .goog-te-menu-value span:hover {
        text-decoration: none !important;
      }
      
      .goog-te-banner-frame {
        display: none !important;
      }
      
      body {
        top: 0 !important;
      }

      /* Fix for the Google Translate dropdown */
      .goog-te-menu2 {
        max-width: none !important;
        overflow: visible !important;
      }
    `;
    document.head.appendChild(style);

    // Reinitialize Google Translate if needed
    if (window.googleTranslateElementInit) {
      window.googleTranslateElementInit();
    }

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Force Google Translate to initialize after component mounts
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div 
      ref={ref}
      className="fixed top-4 left-4 z-50"
    >
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-green-500 shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe className="h-4 w-4" />
        <span className="inline">Translate</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-4 w-64"
          >
            <div className="text-sm text-gray-600 mb-2 font-medium">Select Language:</div>
            <div id="google_translate_element" className="goog-te-gadget w-full"></div>
            
            {/* Direct language selection links as fallback */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Quick Select:</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                    if (select) {
                      select.value = '';
                      select.dispatchEvent(new Event('change'));
                    }
                  }}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  English
                </button>
                <button 
                  onClick={() => {
                    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                    if (select) {
                      select.value = 'hi';
                      select.dispatchEvent(new Event('change'));
                    }
                  }}
                  className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                >
                  हिन्दी (Hindi)
                </button>
                <button 
                  onClick={() => {
                    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
                    if (select) {
                      select.value = 'kn';
                      select.dispatchEvent(new Event('change'));
                    }
                  }}
                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  ಕನ್ನಡ (Kannada)
                </button>
              </div>
            </div>
            
            {/* Custom styling for Google Translate widget is added via useEffect */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
