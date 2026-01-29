import { MainLayout } from '@/components/layout/MainLayout';
import { DATA_SOURCES } from '@/lib/data-sources';
import { cn } from '@/lib/utils';
import { 
  Settings as SettingsIcon, 
  Database, 
  RefreshCw, 
  Globe,
  CheckCircle,
  AlertCircle,
  Clock,
  Info
} from 'lucide-react';

const SettingsPage = () => {
  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">
          System configuration, data sources, and platform settings
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Data Sources */}
        <div className="col-span-8 space-y-4">
          <div className="module-section">
            <div className="module-header">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-foreground">Data Sources</h3>
              </div>
            </div>
            <div className="module-content">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Source</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Type</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Modules</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">API Key</th>
                    <th className="text-center py-2 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {DATA_SOURCES.map(source => (
                    <tr key={source.id} className="border-b border-border/50">
                      <td className="py-3">
                        <div>
                          <span className="text-foreground">{source.name}</span>
                          {source.url && (
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block text-xs text-info hover:underline"
                            >
                              {source.url}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded",
                          source.type === 'REAL' ? 'bg-success/10 text-success' :
                          source.type === 'MODEL' ? 'bg-warning/10 text-warning' :
                          'bg-info/10 text-info'
                        )}>
                          {source.type}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">
                        {source.modules.join(', ')}
                      </td>
                      <td className="py-3 text-center">
                        <span className={cn(
                          "text-xs",
                          source.requiresKey ? 'text-destructive' : 'text-success'
                        )}>
                          {source.requiresKey ? 'Required' : 'None'}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="flex items-center justify-center gap-1 text-success">
                          <CheckCircle className="h-3 w-3" />
                          <span className="text-xs">Active</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Refresh Intervals */}
          <div className="module-section">
            <div className="module-header">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-foreground">Data Refresh Intervals</h3>
              </div>
            </div>
            <div className="module-content">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { module: 'Air Quality', interval: '5 min', source: 'Open-Meteo' },
                  { module: 'Weather', interval: '10 min', source: 'Open-Meteo' },
                  { module: 'Traffic', interval: '1 min', source: 'Model' },
                  { module: 'Power', interval: '1 min', source: 'Model' },
                  { module: 'Water', interval: '1 min', source: 'Model' },
                  { module: 'Health', interval: '1 min', source: 'Model' },
                ].map(item => (
                  <div key={item.module} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                    <div>
                      <span className="text-sm text-foreground">{item.module}</span>
                      <span className="block text-xs text-muted-foreground">{item.source}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {item.interval}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="module-section">
            <div className="module-header">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-foreground">API Endpoints</h3>
              </div>
            </div>
            <div className="module-content space-y-2">
              {[
                { name: 'Open-Meteo Weather', url: 'https://api.open-meteo.com/v1/forecast', status: 'operational' },
                { name: 'Open-Meteo Air Quality', url: 'https://air-quality-api.open-meteo.com/v1/air-quality', status: 'operational' },
                { name: 'OpenStreetMap Tiles', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', status: 'operational' },
              ].map(endpoint => (
                <div key={endpoint.name} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div>
                    <span className="text-sm text-foreground">{endpoint.name}</span>
                    <span className="block text-xs text-muted-foreground font-mono">{endpoint.url}</span>
                  </div>
                  <span className="flex items-center gap-1 text-success text-xs">
                    <CheckCircle className="h-3 w-3" />
                    Operational
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-4">
          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Platform Info</h3>
            </div>
            <div className="module-content space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Version</span>
                <span className="text-foreground">1.0.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Environment</span>
                <span className="text-foreground">Production</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Zones Covered</span>
                <span className="text-foreground">11 (NCT Delhi)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data Policy</span>
                <span className="text-foreground">Free APIs Only</span>
              </div>
            </div>
          </div>

          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Data Transparency</h3>
            </div>
            <div className="module-content">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="h-2 w-2 mt-1.5 bg-success rounded-full flex-shrink-0" />
                  <div>
                    <span className="text-foreground">REAL</span>
                    <span className="text-muted-foreground"> — Live data from public APIs</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="h-2 w-2 mt-1.5 bg-warning rounded-full flex-shrink-0" />
                  <div>
                    <span className="text-foreground">MODEL</span>
                    <span className="text-muted-foreground"> — Calculated using transparent logic</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="h-2 w-2 mt-1.5 bg-info rounded-full flex-shrink-0" />
                  <div>
                    <span className="text-foreground">HYBRID</span>
                    <span className="text-muted-foreground"> — Real base + modeled distribution</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="module-section">
            <div className="module-header">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-info" />
                <h3 className="text-sm font-medium text-foreground">About DCOP</h3>
              </div>
            </div>
            <div className="module-content">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Delhi City Operations Platform (DCOP) is a government-grade command center 
                for monitoring and analyzing city operations. Built using only free, public 
                APIs and open datasets to ensure transparency and accessibility.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                All metrics are either sourced from real APIs (Open-Meteo, OpenStreetMap) 
                or derived using deterministic models based on official Delhi government 
                baseline data (POSOCO, DJB, NCRB, NHM).
              </p>
            </div>
          </div>

          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Baseline Data</h3>
            </div>
            <div className="module-content space-y-2 text-xs text-muted-foreground">
              <div>• Power: Delhi peak ~7,500 MW (POSOCO)</div>
              <div>• Water: ~900 MGD supply vs 1,200 MGD demand (DJB)</div>
              <div>• Hospitals: ~50,000 govt beds (NHM)</div>
              <div>• Zones: 11 municipal zones (MCD)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>DCOP Settings • All configurations are read-only in this version</span>
          <span>Build: 2026-01-28</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
