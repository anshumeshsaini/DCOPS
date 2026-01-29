import { AirQualityData, getAQICategory, DELHI_ZONES } from '@/types/city';
import { cn } from '@/lib/utils';
import { getSourceBadge } from '@/lib/data-sources';

interface AirQualityTableProps {
  data: AirQualityData[];
  isLoading?: boolean;
}

export function AirQualityTable({ data, isLoading }: AirQualityTableProps) {
  const getZoneName = (zoneId: string) => {
    return DELHI_ZONES.find(z => z.id === zoneId)?.name || zoneId;
  };

  const sortedData = [...data].sort((a, b) => b.aqi - a.aqi);
  const badge = getSourceBadge('REAL');

  if (isLoading) {
    return (
      <div className="module-section">
        <div className="module-header">
          <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        </div>
        <div className="module-content">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="module-section">
        <div className="module-header">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">Air Quality by Zone</h3>
            <span className={cn("text-xs px-1.5 py-0.5 rounded", badge.color)}>
              {badge.label}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Source: Open-Meteo</span>
        </div>
        <div className="module-content">
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Loading air quality data...</p>
            <p className="text-xs mt-1">Fetching from Open-Meteo API</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="module-section">
      <div className="module-header">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Air Quality by Zone</h3>
          <span className={cn("text-xs px-1.5 py-0.5 rounded", badge.color)}>
            {badge.label}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          Open-Meteo API • Updated hourly
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>AQI</th>
              <th>PM2.5</th>
              <th>PM10</th>
              <th>NO₂</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => {
              const category = getAQICategory(item.aqi);
              return (
                <tr key={item.zone}>
                  <td className="font-medium text-foreground">{getZoneName(item.zone)}</td>
                  <td className={cn(
                    "font-semibold",
                    category.color === 'success' && 'text-success',
                    category.color === 'warning' && 'text-warning',
                    category.color === 'destructive' && 'text-destructive'
                  )}>
                    {item.aqi}
                  </td>
                  <td>{item.pm25} µg/m³</td>
                  <td>{item.pm10} µg/m³</td>
                  <td>{item.no2} µg/m³</td>
                  <td>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded",
                      category.color === 'success' && 'bg-success/10 text-success',
                      category.color === 'warning' && 'bg-warning/10 text-warning',
                      category.color === 'destructive' && 'bg-destructive/10 text-destructive'
                    )}>
                      {category.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
