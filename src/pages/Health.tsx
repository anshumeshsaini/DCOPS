import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { generateHealthData } from '@/lib/api/city-data';
import { DELHI_ZONES } from '@/types/city';
import { cn } from '@/lib/utils';
import { getSourceBadge } from '@/lib/data-sources';
import { 
  Heart, 
  Bed, 
  Ambulance, 
  Phone, 
  Clock, 
  AlertTriangle,
  Activity
} from 'lucide-react';

const HealthPage = () => {
  const { data: healthData, isLoading } = useQuery({
    queryKey: ['health-data'],
    queryFn: generateHealthData,
    refetchInterval: 60000,
  });

  const badge = getSourceBadge('MODEL');

  const getZoneName = (zoneId: string) => {
    return DELHI_ZONES.find(z => z.id === zoneId)?.name || zoneId;
  };

  if (isLoading || !healthData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading health data...</div>
        </div>
      </MainLayout>
    );
  }

  const totalBeds = healthData.reduce((sum, d) => sum + d.hospitalBeds, 0);
  const totalOccupied = healthData.reduce((sum, d) => sum + d.bedsOccupied, 0);
  const totalAmbulances = healthData.reduce((sum, d) => sum + d.ambulances, 0);
  const avgResponseTime = Math.round(healthData.reduce((sum, d) => sum + d.avgResponseTime, 0) / healthData.length);
  const totalEmergencyCalls = healthData.reduce((sum, d) => sum + d.emergencyCalls, 0);
  const occupancyRate = Math.round((totalOccupied / totalBeds) * 100);

  const criticalZones = healthData.filter(d => (d.bedsOccupied / d.hospitalBeds) > 0.85);

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Health & Emergency Services</h2>
          <p className="text-sm text-muted-foreground">
            Hospital capacity, ambulance metrics, emergency response • Model based on NHM data
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
            <Bed className="h-4 w-4" />
            <span className="text-xs">Total Beds</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{totalBeds.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">Government hospitals</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Activity className="h-4 w-4" />
            <span className="text-xs">Occupancy Rate</span>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            occupancyRate <= 75 ? 'text-success' : occupancyRate <= 85 ? 'text-warning' : 'text-destructive'
          )}>
            {occupancyRate}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">{totalBeds - totalOccupied} beds available</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Ambulance className="h-4 w-4" />
            <span className="text-xs">Ambulances</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{totalAmbulances}</div>
          <div className="text-xs text-muted-foreground mt-1">CATS + Private</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Avg Response</span>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            avgResponseTime <= 10 ? 'text-success' : avgResponseTime <= 15 ? 'text-warning' : 'text-destructive'
          )}>
            {avgResponseTime} min
          </div>
          <div className="text-xs text-muted-foreground mt-1">Emergency response</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Phone className="h-4 w-4" />
            <span className="text-xs">Emergency Calls</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{totalEmergencyCalls}</div>
          <div className="text-xs text-muted-foreground mt-1">Last hour (modeled)</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Zone-wise Details */}
        <div className="col-span-8">
          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Zone-wise Health Infrastructure</h3>
            </div>
            <div className="module-content">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Zone</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Beds</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Occupied</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Occupancy</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Ambulances</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Response Time</th>
                  </tr>
                </thead>
                <tbody>
                  {healthData.map(zone => {
                    const occupancy = Math.round((zone.bedsOccupied / zone.hospitalBeds) * 100);
                    return (
                      <tr key={zone.zone} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-2 text-foreground">{getZoneName(zone.zone)}</td>
                        <td className="py-2 text-right text-muted-foreground">{zone.hospitalBeds.toLocaleString()}</td>
                        <td className="py-2 text-right text-muted-foreground">{zone.bedsOccupied.toLocaleString()}</td>
                        <td className="py-2 text-right">
                          <span className={cn(
                            "font-medium",
                            occupancy <= 75 ? 'text-success' : occupancy <= 85 ? 'text-warning' : 'text-destructive'
                          )}>
                            {occupancy}%
                          </span>
                        </td>
                        <td className="py-2 text-right text-muted-foreground">{zone.ambulances}</td>
                        <td className="py-2 text-right">
                          <span className={cn(
                            "font-medium",
                            zone.avgResponseTime <= 10 ? 'text-success' : zone.avgResponseTime <= 15 ? 'text-warning' : 'text-destructive'
                          )}>
                            {zone.avgResponseTime} min
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Alerts & Critical Zones */}
        <div className="col-span-4 space-y-4">
          {criticalZones.length > 0 && (
            <div className="module-section">
              <div className="module-header">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <h3 className="text-sm font-medium text-foreground">High Occupancy Zones</h3>
                </div>
              </div>
              <div className="module-content space-y-2">
                {criticalZones.map(zone => (
                  <div key={zone.zone} className="flex items-center justify-between p-2 bg-warning/10 rounded">
                    <span className="text-sm text-foreground">{getZoneName(zone.zone)}</span>
                    <span className="text-sm font-medium text-warning">
                      {Math.round((zone.bedsOccupied / zone.hospitalBeds) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Major Hospitals</h3>
            </div>
            <div className="module-content space-y-2">
              {[
                { name: 'AIIMS', zone: 'South Delhi', beds: 2500 },
                { name: 'Safdarjung', zone: 'New Delhi', beds: 1800 },
                { name: 'LNJP', zone: 'Central Delhi', beds: 1500 },
                { name: 'GTB Hospital', zone: 'East Delhi', beds: 1200 },
                { name: 'RML Hospital', zone: 'New Delhi', beds: 1100 },
              ].map(hospital => (
                <div key={hospital.name} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-foreground">{hospital.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{hospital.zone}</span>
                  </div>
                  <span className="text-muted-foreground">{hospital.beds} beds</span>
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
                Base data: National Health Mission, Delhi State Health Mission.
                Bed count: ~50,000 government hospital beds in NCT Delhi.
                Response times modeled on CATS (Centralized Accident & Trauma Services) averages.
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
              Model-derived (NHM baseline data)
            </span>
          </div>
          <span>Last updated: {new Date().toLocaleString('en-IN')}</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default HealthPage;
