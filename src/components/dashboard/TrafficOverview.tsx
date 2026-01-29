import { TrafficData, DELHI_ZONES } from '@/types/city';
import { cn } from '@/lib/utils';
import { getSourceBadge } from '@/lib/data-sources';

interface TrafficOverviewProps {
  data: TrafficData[];
}

export function TrafficOverview({ data }: TrafficOverviewProps) {
  const getZoneName = (zoneId: string) => {
    return DELHI_ZONES.find(z => z.id === zoneId)?.name || zoneId;
  };

  const getCongestionColor = (index: number) => {
    if (index <= 40) return 'bg-success';
    if (index <= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const sortedData = [...data].sort((a, b) => b.congestionIndex - a.congestionIndex);
  const avgCongestion = Math.round(data.reduce((sum, d) => sum + d.congestionIndex, 0) / data.length);
  const totalIncidents = data.reduce((sum, d) => sum + d.incidents, 0);

  const badge = getSourceBadge('MODEL');

  return (
    <div className="module-section">
      <div className="module-header">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Traffic Overview</h3>
          <span className={cn("text-xs px-1.5 py-0.5 rounded", badge.color)}>
            {badge.label}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Avg: <strong className="text-foreground">{avgCongestion}%</strong></span>
          <span>Incidents: <strong className="text-foreground">{totalIncidents}</strong></span>
        </div>
      </div>
      <div className="module-content space-y-2">
        {sortedData.slice(0, 6).map((item) => (
          <div key={item.zone} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-28 truncate">
              {getZoneName(item.zone)}
            </span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all", getCongestionColor(item.congestionIndex))}
                style={{ width: `${item.congestionIndex}%` }}
              />
            </div>
            <span className="text-xs font-medium w-12 text-right">
              {item.congestionIndex}%
            </span>
            <span className="text-xs text-muted-foreground w-16 text-right">
              {item.avgSpeed} km/h
            </span>
          </div>
        ))}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Derived from time-of-day patterns, zone density, and historical data. 
            Peak hours: 8-10 AM, 5-8 PM.
          </p>
        </div>
      </div>
    </div>
  );
}
