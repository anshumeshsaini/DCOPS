import { useEffect, useRef, useState } from 'react';
import { DELHI_ZONES, DelhiZone } from '@/types/city';
import { cn } from '@/lib/utils';

interface ZoneMapProps {
  highlightedZone?: string;
  onZoneClick?: (zone: DelhiZone) => void;
  zoneData?: Record<string, { value: number; status: 'good' | 'warning' | 'critical' }>;
}

export function ZoneMap({ highlightedZone, onZoneClick, zoneData }: ZoneMapProps) {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  
  // Simplified Delhi zone positions for the map (relative positioning)
  const zonePositions: Record<string, { x: number; y: number; width: number; height: number }> = {
    northwest: { x: 10, y: 5, width: 35, height: 25 },
    north: { x: 45, y: 5, width: 25, height: 20 },
    northeast: { x: 70, y: 10, width: 25, height: 25 },
    west: { x: 5, y: 30, width: 25, height: 30 },
    central: { x: 35, y: 30, width: 20, height: 20 },
    east: { x: 60, y: 25, width: 25, height: 25 },
    shahdara: { x: 75, y: 35, width: 20, height: 20 },
    newdelhi: { x: 30, y: 50, width: 20, height: 15 },
    southwest: { x: 5, y: 55, width: 30, height: 35 },
    south: { x: 35, y: 65, width: 25, height: 30 },
    southeast: { x: 60, y: 55, width: 25, height: 30 },
  };

  const getZoneColor = (zoneId: string) => {
    const data = zoneData?.[zoneId];
    if (!data) return 'fill-muted stroke-border';
    
    const statusColors = {
      good: 'fill-success/20 stroke-success',
      warning: 'fill-warning/20 stroke-warning',
      critical: 'fill-destructive/20 stroke-destructive',
    };
    return statusColors[data.status];
  };

  return (
    <div className="module-section">
      <div className="module-header">
        <h3 className="text-sm font-medium text-foreground">Delhi Zone Map</h3>
        <span className="text-xs text-muted-foreground">Click zone for details</span>
      </div>
      <div className="module-content">
        <div className="relative aspect-[4/3] bg-background rounded border border-border">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Zones */}
            {DELHI_ZONES.map(zone => {
              const pos = zonePositions[zone.id];
              if (!pos) return null;
              
              const isHighlighted = highlightedZone === zone.id;
              const isHovered = hoveredZone === zone.id;
              
              return (
                <g key={zone.id}>
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width={pos.width}
                    height={pos.height}
                    rx={2}
                    className={cn(
                      "transition-all cursor-pointer stroke-[0.5]",
                      getZoneColor(zone.id),
                      (isHighlighted || isHovered) && "stroke-primary stroke-[1.5]"
                    )}
                    onMouseEnter={() => setHoveredZone(zone.id)}
                    onMouseLeave={() => setHoveredZone(null)}
                    onClick={() => onZoneClick?.(zone)}
                  />
                  <text
                    x={pos.x + pos.width / 2}
                    y={pos.y + pos.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-[3px] fill-muted-foreground pointer-events-none font-medium"
                  >
                    {zone.code}
                  </text>
                  {zoneData?.[zone.id] && (
                    <text
                      x={pos.x + pos.width / 2}
                      y={pos.y + pos.height / 2 + 5}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={cn(
                        "text-[2.5px] pointer-events-none font-bold",
                        zoneData[zone.id].status === 'good' && 'fill-success',
                        zoneData[zone.id].status === 'warning' && 'fill-warning',
                        zoneData[zone.id].status === 'critical' && 'fill-destructive'
                      )}
                    >
                      {zoneData[zone.id].value}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          
          {/* Hover tooltip */}
          {hoveredZone && (
            <div className="absolute bottom-2 left-2 bg-card border border-border rounded px-2 py-1 text-xs shadow-sm">
              {DELHI_ZONES.find(z => z.id === hoveredZone)?.name}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-success/20 border border-success" />
            <span className="text-xs text-muted-foreground">Good</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-warning/20 border border-warning" />
            <span className="text-xs text-muted-foreground">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-destructive/20 border border-destructive" />
            <span className="text-xs text-muted-foreground">Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}
