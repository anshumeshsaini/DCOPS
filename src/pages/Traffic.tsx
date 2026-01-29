import { useQuery } from '@tanstack/react-query';
import { generateTrafficData } from '@/lib/api/city-data';
import { MainLayout } from '@/components/layout/MainLayout';
import { DELHI_ZONES } from '@/types/city';
import { cn } from '@/lib/utils';
import { Car, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

const TrafficPage = () => {
  const { data: trafficData, isLoading } = useQuery({
    queryKey: ['traffic-detailed'],
    queryFn: generateTrafficData,
    refetchInterval: 60000,
  });

  const avgCongestion = trafficData 
    ? Math.round(trafficData.reduce((sum, d) => sum + d.congestionIndex, 0) / trafficData.length)
    : 0;

  const totalIncidents = trafficData?.reduce((sum, d) => sum + d.incidents, 0) || 0;
  const avgSpeed = trafficData
    ? Math.round(trafficData.reduce((sum, d) => sum + d.avgSpeed, 0) / trafficData.length)
    : 0;

  const getZoneName = (zoneId: string) => {
    return DELHI_ZONES.find(z => z.id === zoneId)?.name || zoneId;
  };

  const getCongestionStatus = (index: number) => {
    if (index <= 40) return { label: 'Light', color: 'text-success', bg: 'bg-success' };
    if (index <= 60) return { label: 'Moderate', color: 'text-warning', bg: 'bg-warning' };
    return { label: 'Heavy', color: 'text-destructive', bg: 'bg-destructive' };
  };

  const sortedData = trafficData ? [...trafficData].sort((a, b) => b.congestionIndex - a.congestionIndex) : [];
  const hour = new Date().getHours();
  const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20);

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Traffic & Transport</h2>
        <p className="text-sm text-muted-foreground">
          Zone-wise traffic congestion and incident monitoring
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase">Avg Congestion</span>
          </div>
          <div className={cn(
            "text-3xl font-bold",
            getCongestionStatus(avgCongestion).color
          )}>
            {avgCongestion}%
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {getCongestionStatus(avgCongestion).label} traffic
          </div>
        </div>

        <div className="kpi-card">
          <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Avg Speed</div>
          <div className="text-3xl font-bold text-foreground">{avgSpeed}</div>
          <div className="text-sm text-muted-foreground mt-1">km/h citywide</div>
        </div>

        <div className="kpi-card">
          <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Active Incidents</div>
          <div className={cn(
            "text-3xl font-bold",
            totalIncidents <= 10 ? 'text-success' : totalIncidents <= 20 ? 'text-warning' : 'text-destructive'
          )}>
            {totalIncidents}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Reported today</div>
        </div>

        <div className="kpi-card">
          <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Traffic Mode</div>
          <div className={cn(
            "text-lg font-bold",
            isPeakHour ? 'text-warning' : 'text-success'
          )}>
            {isPeakHour ? 'Peak Hour' : 'Off-Peak'}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Current: {hour}:00
          </div>
        </div>

        <div className="kpi-card">
          <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Zones Monitored</div>
          <div className="text-3xl font-bold text-foreground">{trafficData?.length || 0}</div>
          <div className="text-sm text-muted-foreground mt-1">Active zones</div>
        </div>
      </div>

      {/* Peak Hour Alert */}
      {isPeakHour && (
        <div className="bg-warning/10 border border-warning/20 rounded-md p-4 mb-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-warning">Peak Hour Traffic</h4>
              <p className="text-sm text-foreground mt-1">
                Currently experiencing peak hour traffic conditions. Expect 40-60% higher congestion 
                in central and commercial zones.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Zone Table */}
        <div className="col-span-8">
          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Zone-wise Traffic Status</h3>
              <span className="text-xs text-muted-foreground">Sorted by congestion</span>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Zone</th>
                    <th>Congestion</th>
                    <th>Avg Speed</th>
                    <th>Incidents</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map(item => {
                    const status = getCongestionStatus(item.congestionIndex);
                    return (
                      <tr key={item.zone}>
                        <td className="font-medium text-foreground">
                          {getZoneName(item.zone)}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={cn("h-full rounded-full", status.bg)}
                                style={{ width: `${item.congestionIndex}%` }}
                              />
                            </div>
                            <span className={cn("text-sm font-medium", status.color)}>
                              {item.congestionIndex}%
                            </span>
                          </div>
                        </td>
                        <td>{item.avgSpeed} km/h</td>
                        <td>
                          {item.incidents > 0 ? (
                            <span className="text-destructive font-medium">{item.incidents}</span>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </td>
                        <td>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded",
                            status.color === 'text-success' && 'bg-success/10 text-success',
                            status.color === 'text-warning' && 'bg-warning/10 text-warning',
                            status.color === 'text-destructive' && 'bg-destructive/10 text-destructive'
                          )}>
                            {status.label}
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

        {/* Sidebar */}
        <div className="col-span-4 space-y-4">
          {/* Top Congested */}
          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Most Congested</h3>
            </div>
            <div className="module-content space-y-3">
              {sortedData.slice(0, 5).map((item, idx) => (
                <div key={item.zone} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-4">{idx + 1}</span>
                  <span className="text-sm flex-1">{getZoneName(item.zone)}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    getCongestionStatus(item.congestionIndex).color
                  )}>
                    {item.congestionIndex}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Pattern Info */}
          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Traffic Patterns</h3>
            </div>
            <div className="module-content">
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Morning Peak</span>
                  <span className="font-medium text-foreground">08:00 - 10:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Evening Peak</span>
                  <span className="font-medium text-foreground">17:00 - 20:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Off-Peak</span>
                  <span className="font-medium text-foreground">11:00 - 16:00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Night</span>
                  <span className="font-medium text-foreground">22:00 - 06:00</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Traffic data is calculated based on time-of-day patterns and 
                  zone characteristics. Real-time data would require traffic API integration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TrafficPage;
