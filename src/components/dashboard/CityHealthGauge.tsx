import { CityHealthIndex } from '@/types/city';
import { cn } from '@/lib/utils';

interface CityHealthGaugeProps {
  data: CityHealthIndex;
}

export function CityHealthGauge({ data }: CityHealthGaugeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 70) return 'bg-success';
    if (score >= 50) return 'bg-warning';
    return 'bg-destructive';
  };

  const components = [
    { key: 'environment', label: 'Environment' },
    { key: 'infrastructure', label: 'Infrastructure' },
    { key: 'safety', label: 'Safety' },
    { key: 'health', label: 'Health' },
    { key: 'governance', label: 'Governance' },
  ] as const;

  return (
    <div className="module-section">
      <div className="module-header">
        <h3 className="text-sm font-medium text-foreground">City Health Index</h3>
        <span className="text-xs text-muted-foreground">
          Updated {data.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div className="module-content">
        {/* Overall Score */}
        <div className="text-center mb-6">
          <div className={cn("text-5xl font-bold", getScoreColor(data.overall))}>
            {data.overall}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Overall Score</div>
        </div>

        {/* Component Scores */}
        <div className="space-y-3">
          {components.map(({ key, label }) => {
            const score = data.components[key];
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-24">{label}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all", getScoreBackground(score))}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className={cn("text-xs font-medium w-8 text-right", getScoreColor(score))}>
                  {score}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
