import { KPIData, getStatusColor } from '@/types/city';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  kpi: KPIData;
}

export function KPICard({ kpi }: KPICardProps) {
  const statusColor = getStatusColor(kpi.status);
  
  const TrendIcon = kpi.trend === 'up' 
    ? TrendingUp 
    : kpi.trend === 'down' 
      ? TrendingDown 
      : Minus;

  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {kpi.label}
        </span>
        {kpi.trend && (
          <TrendIcon className={cn(
            "h-3.5 w-3.5",
            kpi.trend === 'up' && kpi.status === 'critical' ? 'text-destructive' : '',
            kpi.trend === 'down' && kpi.status === 'good' ? 'text-success' : '',
            kpi.trend === 'stable' ? 'text-muted-foreground' : ''
          )} />
        )}
      </div>
      
      <div className="flex items-baseline gap-1.5">
        <span className={cn("text-2xl font-semibold", statusColor)}>
          {kpi.value}
        </span>
        {kpi.unit && (
          <span className="text-sm text-muted-foreground">{kpi.unit}</span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded",
          kpi.status === 'good' && 'bg-success/10 text-success',
          kpi.status === 'warning' && 'bg-warning/10 text-warning',
          kpi.status === 'critical' && 'bg-destructive/10 text-destructive'
        )}>
          {kpi.status === 'good' ? 'Normal' : kpi.status === 'warning' ? 'Attention' : 'Critical'}
        </span>
        {kpi.source && (
          <span className="text-xs text-muted-foreground">{kpi.source}</span>
        )}
      </div>
    </div>
  );
}
