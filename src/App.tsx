
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CropRecommendationPage from "./pages/CropRecommendationPage";
import WeatherPage from "./pages/WeatherPage";
import ChatbotPage from "./pages/ChatbotPage";
import MarketPricesPage from "./pages/MarketPricesPage";
import CropManagementPage from "./pages/CropManagementPage";
import DiseaseDetectionPage from "./pages/DiseaseDetectionPage";
import TutorialsPage from "./pages/TutorialsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/market-prices" element={<MarketPricesPage />} />
          <Route path="/crop-management" element={<CropManagementPage />} />
          <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
