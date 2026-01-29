import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { generateSafetyData } from '@/lib/api/city-data';
import { DELHI_ZONES } from '@/types/city';
import { cn } from '@/lib/utils';
import { getSourceBadge } from '@/lib/data-sources';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  Users, 
  MapPin,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

const SafetyPage = () => {
  const { data: safetyData, isLoading } = useQuery({
    queryKey: ['safety-data'],
    queryFn: generateSafetyData,
    refetchInterval: 60000,
  });

  const badge = getSourceBadge('MODEL');

  const getZoneName = (zoneId: string) => {
    return DELHI_ZONES.find(z => z.id === zoneId)?.name || zoneId;
  };

  if (isLoading || !safetyData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading safety data...</div>
        </div>
      </MainLayout>
    );
  }

  const avgCrimeIndex = Math.round(safetyData.reduce((sum, d) => sum + d.crimeIndex, 0) / safetyData.length);
  const totalIncidents = safetyData.reduce((sum, d) => sum + d.incidents, 0);
  const totalPatrols = safetyData.reduce((sum, d) => sum + d.patrolUnits, 0);
  const avgResponseTime = Math.round(safetyData.reduce((sum, d) => sum + d.responseTime, 0) / safetyData.length);
  const highRiskZones = safetyData.filter(d => d.riskLevel === 'high');

  const hour = new Date().getHours();
  const isNightTime = hour >= 20 || hour <= 6;

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Safety & Incident Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Crime density, patrol units, response metrics • Model based on NCRB data
          </p>
        </div>
        <span className={cn("text-xs px-2 py-1 rounded", badge.color)}>
          {badge.label}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="kpi-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Safety Index</span>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            avgCrimeIndex <= 40 ? 'text-success' : avgCrimeIndex <= 55 ? 'text-warning' : 'text-destructive'
          )}>
            {100 - avgCrimeIndex}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Higher is better</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs">Active Incidents</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{totalIncidents}</div>
          <div className="text-xs text-muted-foreground mt-1">Current hour (modeled)</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            <span className="text-xs">Patrol Units</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{totalPatrols}</div>
          <div className="text-xs text-muted-foreground mt-1">Active deployment</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Avg Response</span>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            avgResponseTime <= 8 ? 'text-success' : avgResponseTime <= 12 ? 'text-warning' : 'text-destructive'
          )}>
            {avgResponseTime} min
          </div>
          <div className="text-xs text-muted-foreground mt-1">PCR response time</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MapPin className="h-4 w-4" />
            <span className="text-xs">High Risk Zones</span>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            highRiskZones.length <= 2 ? 'text-success' : highRiskZones.length <= 4 ? 'text-warning' : 'text-destructive'
          )}>
            {highRiskZones.length}
          </div>
          <div className="text-xs text-muted-foreground mt-1">of 11 zones</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Zone-wise Risk Assessment */}
        <div className="col-span-8">
          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Zone-wise Risk Assessment</h3>
              {isNightTime && (
                <span className="text-xs px-2 py-0.5 bg-warning/10 text-warning rounded">
                  Night hours (elevated risk period)
                </span>
              )}
            </div>
            <div className="module-content">
              <div className="space-y-3">
                {safetyData
                  .sort((a, b) => b.crimeIndex - a.crimeIndex)
                  .map(zone => (
                    <div key={zone.zone} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-32 truncate">
                        {getZoneName(zone.zone)}
                      </span>
                      <div className="flex-1">
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all",
                              zone.riskLevel === 'low' ? 'bg-success' : 
                              zone.riskLevel === 'medium' ? 'bg-warning' : 'bg-destructive'
                            )}
                            style={{ width: `${zone.crimeIndex}%` }}
                          />
                        </div>
                      </div>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded capitalize w-16 text-center",
                        zone.riskLevel === 'low' ? 'bg-success/10 text-success' : 
                        zone.riskLevel === 'medium' ? 'bg-warning/10 text-warning' : 
                        'bg-destructive/10 text-destructive'
                      )}>
                        {zone.riskLevel}
                      </span>
                      <span className="text-sm font-medium w-16 text-right">
                        {zone.patrolUnits} units
                      </span>
                      <span className="text-sm text-muted-foreground w-16 text-right">
                        {zone.responseTime} min
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Time of Day Analysis */}
          <div className="module-section mt-4">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Risk by Time of Day</h3>
            </div>
            <div className="module-content">
              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 bg-success/10 rounded border border-success/20">
                  <div className="text-xs text-muted-foreground mb-1">Morning (6 AM - 12 PM)</div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-success" />
                    <span className="text-lg font-bold text-success">Low</span>
                  </div>
                </div>
                <div className="p-3 bg-success/10 rounded border border-success/20">
                  <div className="text-xs text-muted-foreground mb-1">Afternoon (12 PM - 5 PM)</div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-success" />
                    <span className="text-lg font-bold text-success">Low</span>
                  </div>
                </div>
                <div className="p-3 bg-warning/10 rounded border border-warning/20">
                  <div className="text-xs text-muted-foreground mb-1">Evening (5 PM - 8 PM)</div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-warning" />
                    <span className="text-lg font-bold text-warning">Medium</span>
                  </div>
                </div>
                <div className="p-3 bg-destructive/10 rounded border border-destructive/20">
                  <div className="text-xs text-muted-foreground mb-1">Night (8 PM - 6 AM)</div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-destructive" />
                    <span className="text-lg font-bold text-destructive">High</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-4">
          {highRiskZones.length > 0 && (
            <div className="module-section">
              <div className="module-header">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <h3 className="text-sm font-medium text-foreground">High Risk Zones</h3>
                </div>
              </div>
              <div className="module-content space-y-2">
                {highRiskZones.map(zone => (
                  <div key={zone.zone} className="p-3 bg-destructive/10 rounded border border-destructive/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{getZoneName(zone.zone)}</span>
                      <span className="text-xs text-destructive">{zone.incidents} incidents</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {zone.patrolUnits} patrol units • {zone.responseTime} min response
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Crime Categories (NCRB)</h3>
            </div>
            <div className="module-content space-y-2">
              {[
                { type: 'Theft', share: 35 },
                { type: 'Burglary', share: 18 },
                { type: 'Motor Vehicle', share: 22 },
                { type: 'Assault', share: 12 },
                { type: 'Others', share: 13 },
              ].map(crime => (
                <div key={crime.type} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24">{crime.type}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary/60 rounded-full"
                      style={{ width: `${crime.share}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8 text-right">{crime.share}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Data Sources</h3>
            </div>
            <div className="module-content">
              <p className="text-xs text-muted-foreground">
                Base data: NCRB (National Crime Records Bureau) district-wise statistics.
                Delhi Police public reports. Risk scores modeled on historical patterns, 
                time-of-day, and population density.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 bg-warning rounded-full" />
              Model-derived (NCRB + Delhi Police data)
            </span>
          </div>
          <span>Last updated: {new Date().toLocaleString('en-IN')}</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default SafetyPage;
