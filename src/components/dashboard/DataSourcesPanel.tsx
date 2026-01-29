import { DATA_SOURCES, getSourceBadge } from '@/lib/data-sources';
import { cn } from '@/lib/utils';
import { ExternalLink, Database, Info } from 'lucide-react';

export function DataSourcesPanel() {
  const sources = Object.values(DATA_SOURCES);

  return (
    <div className="module-section">
      <div className="module-header">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Data Sources</h3>
        </div>
        <span className="text-xs text-muted-foreground">Transparency Report</span>
      </div>
      <div className="module-content space-y-3">
        {sources.map(source => {
          const badge = getSourceBadge(source.type);
          return (
            <div key={source.id} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{source.name}</span>
                  <span className={cn("text-xs px-1.5 py-0.5 rounded", badge.color)}>
                    {badge.label}
                  </span>
                </div>
                {source.url && (
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-1">{source.description}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Update: {source.updateFrequency}</span>
              </div>
              {source.notes && (
                <div className="flex items-start gap-1.5 mt-1.5 text-xs text-muted-foreground bg-muted/30 p-1.5 rounded">
                  <Info className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>{source.notes}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
