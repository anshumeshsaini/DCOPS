import { WaterData, DELHI_ZONES } from '@/types/city';
import { cn } from '@/lib/utils';
import { Droplets } from 'lucide-react';
import { getSourceBadge } from '@/lib/data-sources';

interface WaterStatusProps {
  data: WaterData[];
}

export function WaterStatus({ data }: WaterStatusProps) {
  const totalSupply = data.reduce((sum, d) => sum + d.supply, 0);
  const totalDemand = data.reduce((sum, d) => sum + d.demand, 0);
  const totalLeakages = data.reduce((sum, d) => sum + d.leakages, 0);
  const avgReservoir = Math.round(data.reduce((sum, d) => sum + d.reservoirLevel, 0) / data.length);
  const supplyRatio = Math.round((totalSupply / totalDemand) * 100);

  const getZoneName = (zoneId: string) => {
    return DELHI_ZONES.find(z => z.id === zoneId)?.name || zoneId;
  };

  const badge = getSourceBadge('HYBRID');

  return (
    <div className="module-section">
      <div className="module-header">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Water Supply</h3>
          <span className={cn("text-xs px-1.5 py-0.5 rounded", badge.color)}>
            {badge.label}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">DJB base data</span>
      </div>
      <div className="module-content">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">{totalSupply}</div>
            <div className="text-xs text-muted-foreground">Supply (MGD)</div>
          </div>
          <div className="text-center">
            <div className={cn(
              "text-lg font-semibold",
              supplyRatio >= 85 ? 'text-success' : supplyRatio >= 70 ? 'text-warning' : 'text-destructive'
            )}>
              {supplyRatio}%
            </div>
            <div className="text-xs text-muted-foreground">Coverage</div>
          </div>
          <div className="text-center">
            <div className={cn(
              "text-lg font-semibold",
              avgReservoir >= 70 ? 'text-success' : avgReservoir >= 50 ? 'text-warning' : 'text-destructive'
            )}>
              {avgReservoir}%
            </div>
            <div className="text-xs text-muted-foreground">Reservoir</div>
          </div>
          <div className="text-center">
            <div className={cn(
              "text-lg font-semibold",
              totalLeakages <= 20 ? 'text-success' : totalLeakages <= 40 ? 'text-warning' : 'text-destructive'
            )}>
              {totalLeakages}
            </div>
            <div className="text-xs text-muted-foreground">Leakages</div>
          </div>
        </div>

        {/* Zone List */}
        <div className="space-y-2">
          {data.slice(0, 5).map(zone => {
            const ratio = Math.round((zone.supply / zone.demand) * 100);
            return (
              <div key={zone.zone} className="flex items-center gap-3">
                <Droplets className={cn(
                  "h-3.5 w-3.5",
                  ratio >= 85 ? 'text-info' : ratio >= 70 ? 'text-warning' : 'text-destructive'
                )} />
                <span className="text-xs text-muted-foreground w-28 truncate">
                  {getZoneName(zone.zone)}
                </span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full",
                      ratio >= 85 ? 'bg-info' : ratio >= 70 ? 'bg-warning' : 'bg-destructive'
                    )}
                    style={{ width: `${Math.min(100, ratio)}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-10 text-right">{ratio}%</span>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-border/50 mt-3">
          <p className="text-xs text-muted-foreground">
            Base: ~900 MGD supply vs ~1200 MGD demand. CWC & DJB data.
          </p>
        </div>
      </div>
    </div>
  );
}
