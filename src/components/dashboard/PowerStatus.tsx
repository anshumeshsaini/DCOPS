import { PowerData, DELHI_ZONES } from '@/types/city';
import { cn } from '@/lib/utils';
import { Zap, AlertTriangle } from 'lucide-react';
import { getSourceBadge } from '@/lib/data-sources';

interface PowerStatusProps {
  data: PowerData[];
}

export function PowerStatus({ data }: PowerStatusProps) {
  const totalDemand = data.reduce((sum, d) => sum + d.demand, 0);
  const totalSupply = data.reduce((sum, d) => sum + d.supply, 0);
  const totalOutages = data.reduce((sum, d) => sum + d.outages, 0);
  const avgRenewable = Math.round(data.reduce((sum, d) => sum + d.renewablePercent, 0) / data.length);
  const supplyRatio = Math.round((totalSupply / totalDemand) * 100);

  const getZoneName = (zoneId: string) => {
    return DELHI_ZONES.find(z => z.id === zoneId)?.name || zoneId;
  };

  const deficitZones = data.filter(d => d.supply < d.demand).sort((a, b) => 
    (a.supply / a.demand) - (b.supply / b.demand)
  );

  const badge = getSourceBadge('HYBRID');

  return (
    <div className="module-section">
      <div className="module-header">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Power & Energy</h3>
          <span className={cn("text-xs px-1.5 py-0.5 rounded", badge.color)}>
            {badge.label}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">POSOCO base data</span>
      </div>
      <div className="module-content">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">{totalDemand.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Demand (MW)</div>
          </div>
          <div className="text-center">
            <div className={cn(
              "text-lg font-semibold",
              supplyRatio >= 98 ? 'text-success' : supplyRatio >= 95 ? 'text-warning' : 'text-destructive'
            )}>
              {supplyRatio}%
            </div>
            <div className="text-xs text-muted-foreground">Supply Ratio</div>
          </div>
          <div className="text-center">
            <div className={cn(
              "text-lg font-semibold",
              totalOutages <= 5 ? 'text-success' : totalOutages <= 15 ? 'text-warning' : 'text-destructive'
            )}>
              {totalOutages}
            </div>
            <div className="text-xs text-muted-foreground">Outages</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-success">{avgRenewable}%</div>
            <div className="text-xs text-muted-foreground">Renewable</div>
          </div>
        </div>

        {/* Deficit Zones Alert */}
        {deficitZones.length > 0 && (
          <div className="bg-warning/10 border border-warning/20 rounded p-3 mb-4">
            <div className="flex items-center gap-2 text-warning text-sm font-medium mb-2">
              <AlertTriangle className="h-4 w-4" />
              Supply Deficit Zones
            </div>
            <div className="space-y-1">
              {deficitZones.slice(0, 3).map(zone => (
                <div key={zone.zone} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{getZoneName(zone.zone)}</span>
                  <span className="text-warning font-medium">
                    {zone.demand - zone.supply} MW deficit
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Zone Grid */}
        <div className="grid grid-cols-2 gap-2">
          {data.slice(0, 6).map(zone => (
            <div key={zone.zone} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
              <Zap className={cn(
                "h-3.5 w-3.5",
                zone.supply >= zone.demand ? 'text-success' : 'text-warning'
              )} />
              <span className="text-xs text-muted-foreground flex-1 truncate">
                {getZoneName(zone.zone)}
              </span>
              <span className="text-xs font-medium">{zone.demand} MW</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-border/50 mt-3">
          <p className="text-xs text-muted-foreground">
            Base: Delhi peak ~7500 MW. Zone split via population weighting.
          </p>
        </div>
      </div>
    </div>
  );
}
