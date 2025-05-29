
import React from 'react';
import { Cloud, Menu, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from './CustomLanguageSelector';

const Header = () => {
  const { t } = useLanguage();
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Sun className="h-8 w-8 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('app.title')}</h1>
              <p className="text-green-100 text-sm">{t('app.subtitle')}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
            <Cloud className="h-5 w-5" />
            <span className="text-sm">Weather: 28°C, Sunny</span>
          </div>
          <Button variant="ghost" className="md:hidden text-white hover:bg-white/20">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
