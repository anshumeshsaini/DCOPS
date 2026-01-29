import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { simulateScenario, generateTrafficData, generatePowerData, generateWaterData } from '@/lib/api/city-data';
import { ScenarioParameters, DELHI_ZONES } from '@/types/city';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { 
  Activity, 
  CloudRain, 
  Car, 
  Zap, 
  Thermometer, 
  AlertTriangle,
  CheckCircle,
  MapPin
} from 'lucide-react';

const CityModel = () => {
  const [params, setParams] = useState<ScenarioParameters>({
    rainfallIncrease: 0,
    trafficSurge: 0,
    powerDemandSpike: 0,
    temperatureChange: 0,
    eventType: 'none',
  });

  const { data: impact, refetch } = useQuery({
    queryKey: ['scenario-impact', params],
    queryFn: () => simulateScenario(params),
    staleTime: 0,
  });

  const { data: currentTraffic } = useQuery({
    queryKey: ['current-traffic'],
    queryFn: generateTrafficData,
  });

  const { data: currentPower } = useQuery({
    queryKey: ['current-power'],
    queryFn: generatePowerData,
  });

  const { data: currentWater } = useQuery({
    queryKey: ['current-water'],
    queryFn: generateWaterData,
  });

  const getRiskColor = (value: number, thresholds: [number, number] = [40, 70]) => {
    if (value <= thresholds[0]) return 'text-success';
    if (value <= thresholds[1]) return 'text-warning';
    return 'text-destructive';
  };

  const getRiskBg = (value: number, thresholds: [number, number] = [40, 70]) => {
    if (value <= thresholds[0]) return 'bg-success/10 border-success/20';
    if (value <= thresholds[1]) return 'bg-warning/10 border-warning/20';
    return 'bg-destructive/10 border-destructive/20';
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Digital City Model</h2>
        <p className="text-sm text-muted-foreground">
          Scenario simulation and impact analysis • Deterministic calculations based on Delhi baselines
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Scenario Controls */}
        <div className="col-span-4 space-y-4">
          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Scenario Parameters</h3>
            </div>
            <div className="module-content space-y-6">
              {/* Rainfall */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CloudRain className="h-4 w-4 text-info" />
                    <span className="text-sm text-muted-foreground">Rainfall Increase</span>
                  </div>
                  <span className="text-sm font-medium">+{params.rainfallIncrease}%</span>
                </div>
                <Slider
                  value={[params.rainfallIncrease]}
                  onValueChange={([v]) => setParams(p => ({ ...p, rainfallIncrease: v }))}
                  max={100}
                  step={5}
                />
              </div>

              {/* Traffic Surge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-warning" />
                    <span className="text-sm text-muted-foreground">Traffic Surge</span>
                  </div>
                  <span className="text-sm font-medium">+{params.trafficSurge}%</span>
                </div>
                <Slider
                  value={[params.trafficSurge]}
                  onValueChange={([v]) => setParams(p => ({ ...p, trafficSurge: v }))}
                  max={100}
                  step={5}
                />
              </div>

              {/* Power Demand */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-muted-foreground">Power Demand Spike</span>
                  </div>
                  <span className="text-sm font-medium">+{params.powerDemandSpike}%</span>
                </div>
                <Slider
                  value={[params.powerDemandSpike]}
                  onValueChange={([v]) => setParams(p => ({ ...p, powerDemandSpike: v }))}
                  max={50}
                  step={5}
                />
              </div>

              {/* Temperature Change */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Temperature Change</span>
                  </div>
                  <span className="text-sm font-medium">{params.temperatureChange > 0 ? '+' : ''}{params.temperatureChange}°C</span>
                </div>
                <Slider
                  value={[params.temperatureChange + 10]}
                  onValueChange={([v]) => setParams(p => ({ ...p, temperatureChange: v - 10 }))}
                  max={20}
                  step={1}
                />
              </div>

              {/* Event Type */}
              <div>
                <span className="text-sm text-muted-foreground block mb-2">Event Type</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['none', 'festival', 'emergency', 'strike'] as const).map(event => (
                    <button
                      key={event}
                      onClick={() => setParams(p => ({ ...p, eventType: event }))}
                      className={cn(
                        "px-3 py-2 text-xs rounded border transition-colors capitalize",
                        params.eventType === event
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                      )}
                    >
                      {event}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Current State */}
          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Current State</h3>
            </div>
            <div className="module-content space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Traffic Congestion</span>
                <span className="font-medium">
                  {currentTraffic ? Math.round(currentTraffic.reduce((s, t) => s + t.congestionIndex, 0) / currentTraffic.length) : 0}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Power Demand</span>
                <span className="font-medium">
                  {currentPower ? currentPower.reduce((s, p) => s + p.demand, 0).toLocaleString() : 0} MW
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Water Supply Ratio</span>
                <span className="font-medium">
                  {currentWater ? Math.round(
                    (currentWater.reduce((s, w) => s + w.supply, 0) / 
                     currentWater.reduce((s, w) => s + w.demand, 0)) * 100
                  ) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Impact Analysis */}
        <div className="col-span-5 space-y-4">
          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Impact Analysis</h3>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="module-content">
              {impact ? (
                <div className="grid grid-cols-2 gap-4">
                  {/* Flood Risk */}
                  <div className={cn("p-4 rounded-lg border", getRiskBg(impact.floodRisk))}>
                    <div className="flex items-center gap-2 mb-2">
                      <CloudRain className={cn("h-5 w-5", getRiskColor(impact.floodRisk))} />
                      <span className="text-sm font-medium">Flood Risk</span>
                    </div>
                    <div className={cn("text-3xl font-bold", getRiskColor(impact.floodRisk))}>
                      {impact.floodRisk}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {impact.floodRisk > 50 ? 'High risk in low-lying areas' : 'Within normal range'}
                    </div>
                  </div>

                  {/* Traffic Delay */}
                  <div className={cn("p-4 rounded-lg border", getRiskBg(impact.trafficDelayPercent, [50, 70]))}>
                    <div className="flex items-center gap-2 mb-2">
                      <Car className={cn("h-5 w-5", getRiskColor(impact.trafficDelayPercent, [50, 70]))} />
                      <span className="text-sm font-medium">Traffic Delay</span>
                    </div>
                    <div className={cn("text-3xl font-bold", getRiskColor(impact.trafficDelayPercent, [50, 70]))}>
                      {impact.trafficDelayPercent}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Average congestion index
                    </div>
                  </div>

                  {/* Power Shortfall */}
                  <div className={cn("p-4 rounded-lg border", getRiskBg(impact.powerShortfall / 10, [20, 50]))}>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className={cn("h-5 w-5", getRiskColor(impact.powerShortfall / 10, [20, 50]))} />
                      <span className="text-sm font-medium">Power Shortfall</span>
                    </div>
                    <div className={cn("text-3xl font-bold", getRiskColor(impact.powerShortfall / 10, [20, 50]))}>
                      {impact.powerShortfall} MW
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {impact.powerShortfall > 300 ? 'Load shedding required' : 'Grid stable'}
                    </div>
                  </div>

                  {/* Water Stress */}
                  <div className={cn("p-4 rounded-lg border", getRiskBg(impact.waterStressIndex, [40, 60]))}>
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className={cn("h-5 w-5", getRiskColor(impact.waterStressIndex, [40, 60]))} />
                      <span className="text-sm font-medium">Water Stress</span>
                    </div>
                    <div className={cn("text-3xl font-bold", getRiskColor(impact.waterStressIndex, [40, 60]))}>
                      {impact.waterStressIndex}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Supply-demand gap index
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Adjust parameters to see impact analysis
                </div>
              )}
            </div>
          </div>

          {/* Affected Zones */}
          {impact && impact.affectedZones.length > 0 && (
            <div className="module-section">
              <div className="module-header">
                <h3 className="text-sm font-medium text-foreground">Affected Zones</h3>
                <MapPin className="h-4 w-4 text-destructive" />
              </div>
              <div className="module-content">
                <div className="flex flex-wrap gap-2">
                  {impact.affectedZones.map(zoneId => {
                    const zone = DELHI_ZONES.find(z => z.id === zoneId);
                    return (
                      <span
                        key={zoneId}
                        className="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded border border-destructive/20"
                      >
                        {zone?.name || zoneId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Zone Comparison */}
          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Zone-wise Current Status</h3>
            </div>
            <div className="module-content">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {DELHI_ZONES.slice(0, 8).map(zone => {
                  const traffic = currentTraffic?.find(t => t.zone === zone.id);
                  const power = currentPower?.find(p => p.zone === zone.id);
                  const isAffected = impact?.affectedZones.includes(zone.id);
                  
                  return (
                    <div 
                      key={zone.id} 
                      className={cn(
                        "flex items-center justify-between p-2 rounded text-sm",
                        isAffected ? "bg-destructive/5" : "bg-muted/30"
                      )}
                    >
                      <span className="text-muted-foreground w-32 truncate">{zone.name}</span>
                      <div className="flex items-center gap-4 text-xs">
                        <span>Traffic: <strong>{traffic?.congestionIndex || 0}%</strong></span>
                        <span>Power: <strong>{power?.demand || 0} MW</strong></span>
                        {isAffected && <AlertTriangle className="h-3 w-3 text-destructive" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Recommendations */}
        <div className="col-span-3">
          <div className="module-section h-full">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Recommendations</h3>
            </div>
            <div className="module-content">
              {impact && impact.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {impact.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  <p>No immediate actions required.</p>
                  <p className="mt-2">Adjust scenario parameters to see recommendations for different situations.</p>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-border/50">
                <h4 className="text-xs font-medium text-foreground mb-2">Model Information</h4>
                <p className="text-xs text-muted-foreground">
                  Calculations based on Delhi baseline data: 7500 MW peak power, 900 MGD water supply, 
                  11 municipal zones. Flood risk uses 100mm/day threshold.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Digital City Model v1.0 • Deterministic simulation engine</span>
          <span>Last calculation: {new Date().toLocaleString('en-IN')}</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default CityModel;
