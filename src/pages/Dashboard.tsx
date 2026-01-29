import { useQuery } from '@tanstack/react-query';
import { 
  getDashboardKPIs, 
  calculateCityHealthIndex, 
  generateTrafficData, 
  generatePowerData, 
  generateWaterData 
} from '@/lib/api/city-data';
import { fetchDelhiAirQuality, fetchDelhiWeather, getWeatherDescription } from '@/lib/api/open-meteo';
import { MainLayout } from '@/components/layout/MainLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { CityHealthGauge } from '@/components/dashboard/CityHealthGauge';
import { AirQualityTable } from '@/components/dashboard/AirQualityTable';
import { TrafficOverview } from '@/components/dashboard/TrafficOverview';
import { PowerStatus } from '@/components/dashboard/PowerStatus';
import { WaterStatus } from '@/components/dashboard/WaterStatus';
import { DelhiMap } from '@/components/dashboard/DelhiMap';
import { DataSourcesPanel } from '@/components/dashboard/DataSourcesPanel';
import { RefreshCw, Thermometer, Wind, Info } from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const [showSources, setShowSources] = useState(false);

  // Fetch all data from real APIs
  const { data: kpis, isLoading: kpisLoading, refetch: refetchKPIs } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: getDashboardKPIs,
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const { data: cityHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['city-health'],
    queryFn: calculateCityHealthIndex,
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const { data: airQuality, isLoading: aqLoading } = useQuery({
    queryKey: ['air-quality'],
    queryFn: fetchDelhiAirQuality,
    refetchInterval: 300000,
    staleTime: 120000,
  });

  const { data: weather } = useQuery({
    queryKey: ['weather'],
    queryFn: fetchDelhiWeather,
    refetchInterval: 600000,
    staleTime: 300000,
  });

  const { data: trafficData } = useQuery({
    queryKey: ['traffic'],
    queryFn: generateTrafficData,
    refetchInterval: 60000,
  });

  const { data: powerData } = useQuery({
    queryKey: ['power'],
    queryFn: generatePowerData,
    refetchInterval: 60000,
  });

  const { data: waterData } = useQuery({
    queryKey: ['water'],
    queryFn: generateWaterData,
    refetchInterval: 60000,
  });

  const handleRefresh = () => {
    refetchKPIs();
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">City Overview</h2>
          <p className="text-sm text-muted-foreground">
            Real-time monitoring • Free public APIs • No authentication required
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Weather Widget */}
          {weather && (
            <div className="flex items-center gap-3 px-3 py-1.5 bg-muted/50 rounded border border-border">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{Math.round(weather.temperature_2m)}°C</span>
              <span className="text-xs text-muted-foreground">{getWeatherDescription(weather.weather_code)}</span>
              <Wind className="h-3.5 w-3.5 text-muted-foreground ml-2" />
              <span className="text-xs text-muted-foreground">{Math.round(weather.wind_speed_10m)} km/h</span>
            </div>
          )}
          <button 
            onClick={() => setShowSources(!showSources)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded hover:bg-muted transition-colors"
          >
            <Info className="h-3.5 w-3.5" />
            Sources
          </button>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded hover:bg-muted transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Data Sources Panel (collapsible) */}
      {showSources && (
        <div className="mb-6">
          <DataSourcesPanel />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {kpisLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="kpi-card animate-pulse">
              <div className="h-4 bg-muted rounded w-24 mb-2" />
              <div className="h-8 bg-muted rounded w-16" />
            </div>
          ))
        ) : (
          kpis?.map(kpi => <KPICard key={kpi.id} kpi={kpi} />)
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - City Health & Map */}
        <div className="col-span-3 space-y-4">
          {healthLoading ? (
            <div className="module-section">
              <div className="module-header">
                <div className="h-4 bg-muted rounded w-32 animate-pulse" />
              </div>
              <div className="module-content animate-pulse">
                <div className="h-24 bg-muted rounded" />
              </div>
            </div>
          ) : cityHealth && (
            <CityHealthGauge data={cityHealth} />
          )}
          
          <DelhiMap airQualityData={airQuality} />
        </div>

        {/* Center Column - Air Quality & Traffic */}
        <div className="col-span-5 space-y-4">
          <AirQualityTable data={airQuality || []} isLoading={aqLoading} />
          {trafficData && <TrafficOverview data={trafficData} />}
        </div>

        {/* Right Column - Power & Water */}
        <div className="col-span-4 space-y-4">
          {powerData && <PowerStatus data={powerData} />}
          {waterData && <WaterStatus data={waterData} />}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 bg-success rounded-full animate-pulse" />
              Live: AQI, Weather
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 bg-warning rounded-full" />
              Model: Traffic, Power, Water
            </span>
          </div>
          <span>Last updated: {new Date().toLocaleString('en-IN')}</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
