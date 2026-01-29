import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AirQualityPage from "./pages/AirQuality";
import TrafficPage from "./pages/Traffic";
import PowerPage from "./pages/Power";
import WaterPage from "./pages/Water";
import CitizenPage from "./pages/Citizen";
import CityModelPage from "./pages/CityModel";
import HealthPage from "./pages/Health";
import SafetyPage from "./pages/Safety";
import GovernancePage from "./pages/Governance";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/air-quality" element={<AirQualityPage />} />
          <Route path="/traffic" element={<TrafficPage />} />
          <Route path="/power" element={<PowerPage />} />
          <Route path="/water" element={<WaterPage />} />
          <Route path="/citizen" element={<CitizenPage />} />
          <Route path="/city-model" element={<CityModelPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/safety" element={<SafetyPage />} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
