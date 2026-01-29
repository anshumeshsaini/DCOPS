import { useQuery } from '@tanstack/react-query';
import { fetchDelhiAirQuality, fetchDelhiWeather, getWeatherDescription } from '@/lib/api/open-meteo';
import { MainLayout } from '@/components/layout/MainLayout';
import { AirQualityTable } from '@/components/dashboard/AirQualityTable';
import { DELHI_ZONES, getAQICategory } from '@/types/city';
import { cn } from '@/lib/utils';
import { Wind, AlertTriangle, Info, Thermometer, Droplets } from 'lucide-react';

const AirQualityPage = () => {
  const { data: airQuality, isLoading, error, refetch } = useQuery({
    queryKey: ['air-quality-detailed'],
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

  const avgAQI = airQuality && airQuality.length > 0
    ? Math.round(airQuality.reduce((sum, d) => sum + d.aqi, 0) / airQuality.length)
    : 0;

  const category = getAQICategory(avgAQI);
  const criticalZones = airQuality?.filter(d => d.aqi > 200) || [];

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Air Quality Monitoring</h2>
        <p className="text-sm text-muted-foreground">
          Real-time air quality data from Open-Meteo API • No API key required
        </p>
      </div>

      {/* Weather Context */}
      {weather && (
        <div className="bg-muted/30 border border-border rounded-md p-4 mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              <div>
                <div className="text-lg font-semibold">{Math.round(weather.temperature_2m)}°C</div>
                <div className="text-xs text-muted-foreground">Temperature</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-info" />
              <div>
                <div className="text-lg font-semibold">{weather.relative_humidity_2m}%</div>
                <div className="text-xs text-muted-foreground">Humidity</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-lg font-semibold">{Math.round(weather.wind_speed_10m)} km/h</div>
                <div className="text-xs text-muted-foreground">Wind Speed</div>
              </div>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              {getWeatherDescription(weather.weather_code)} • Updated {new Date(weather.time).toLocaleTimeString('en-IN')}
            </div>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase">City Average AQI</span>
          </div>
          {isLoading ? (
            <div className="h-8 bg-muted rounded w-16 animate-pulse" />
          ) : avgAQI > 0 ? (
            <>
              <div className={cn(
                "text-3xl font-bold",
                category.color === 'success' && 'text-success',
                category.color === 'warning' && 'text-warning',
                category.color === 'destructive' && 'text-destructive'
              )}>
                {avgAQI}
              </div>
              <div className={cn(
                "text-sm mt-1",
                category.color === 'success' && 'text-success',
                category.color === 'warning' && 'text-warning',
                category.color === 'destructive' && 'text-destructive'
              )}>
                {category.label}
              </div>
            </>
          ) : (
            <div className="text-muted-foreground text-sm">Loading...</div>
          )}
        </div>

        <div className="kpi-card">
          <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Zones Monitored</div>
          <div className="text-3xl font-bold text-foreground">{airQuality?.length || 0}</div>
          <div className="text-sm text-muted-foreground mt-1">Active stations</div>
        </div>

        <div className="kpi-card">
          <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Critical Zones</div>
          <div className={cn(
            "text-3xl font-bold",
            criticalZones.length > 0 ? 'text-destructive' : 'text-success'
          )}>
            {criticalZones.length}
          </div>
          <div className="text-sm text-muted-foreground mt-1">AQI &gt; 200</div>
        </div>

        <div className="kpi-card">
          <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Data Source</div>
          <div className="text-lg font-semibold text-foreground">Open-Meteo</div>
          <div className="text-sm text-success mt-1">Free API • Live</div>
        </div>
      </div>

      {/* Alert Banner */}
      {criticalZones.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-destructive">Health Advisory</h4>
              <p className="text-sm text-foreground mt-1">
                {criticalZones.length} zone(s) reporting poor air quality (AQI &gt; 200). 
                Sensitive groups should limit outdoor activities in: {' '}
                {criticalZones.map(z => DELHI_ZONES.find(dz => dz.id === z.zone)?.name).join(', ')}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <AirQualityTable data={airQuality || []} isLoading={isLoading} />
        </div>

        <div className="col-span-4">
          {/* AQI Scale Reference */}
          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">AQI Scale</h3>
            </div>
            <div className="module-content space-y-2">
              {[
                { range: '0-50', label: 'Good', color: 'bg-success', desc: 'Minimal impact' },
                { range: '51-100', label: 'Satisfactory', color: 'bg-success', desc: 'Minor breathing discomfort' },
                { range: '101-200', label: 'Moderate', color: 'bg-warning', desc: 'Breathing discomfort' },
                { range: '201-300', label: 'Poor', color: 'bg-warning', desc: 'Discomfort on prolonged exposure' },
                { range: '301-400', label: 'Very Poor', color: 'bg-destructive', desc: 'Respiratory illness' },
                { range: '401-500', label: 'Severe', color: 'bg-destructive', desc: 'Affects healthy people' },
              ].map(item => (
                <div key={item.range} className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded", item.color)} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.range}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="module-section mt-4">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">About Data</h3>
            </div>
            <div className="module-content">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="mb-2">
                    Data sourced from <strong>Open-Meteo</strong>, a free public API 
                    providing weather and air quality data worldwide.
                  </p>
                  <p className="mb-2">
                    <strong>No API key required</strong> - Open-Meteo is completely free 
                    for non-commercial use with CORS support.
                  </p>
                  <p>
                    AQI calculated using US EPA PM2.5 breakpoints. Data refreshes 
                    every 5 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <button 
            onClick={() => refetch()}
            className="w-full mt-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded hover:bg-muted transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AirQualityPage;
