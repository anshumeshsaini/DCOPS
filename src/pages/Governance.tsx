import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';
import { 
  Building2, 
  Users, 
  FileText, 
  Shield, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const GovernancePage = () => {
  // Department performance data (model-derived from public reports)
  const departments = [
    { name: 'Delhi Jal Board', code: 'DJB', complaints: 1245, resolved: 1089, pending: 156, slaCompliance: 87 },
    { name: 'BSES Rajdhani', code: 'BSES-R', complaints: 892, resolved: 801, pending: 91, slaCompliance: 90 },
    { name: 'BSES Yamuna', code: 'BSES-Y', complaints: 756, resolved: 680, pending: 76, slaCompliance: 90 },
    { name: 'MCD North', code: 'MCD-N', complaints: 543, resolved: 421, pending: 122, slaCompliance: 78 },
    { name: 'MCD South', code: 'MCD-S', complaints: 612, resolved: 489, pending: 123, slaCompliance: 80 },
    { name: 'MCD East', code: 'MCD-E', complaints: 478, resolved: 398, pending: 80, slaCompliance: 83 },
    { name: 'Delhi Police', code: 'DPOL', complaints: 2145, resolved: 1931, pending: 214, slaCompliance: 90 },
    { name: 'PWD', code: 'PWD', complaints: 345, resolved: 276, pending: 69, slaCompliance: 80 },
  ];

  // System access logs (simulated)
  const auditLogs = [
    { time: '09:45', user: 'Admin-Central', action: 'Dashboard accessed', type: 'access' },
    { time: '09:32', user: 'DJB-Ops', action: 'Water data exported', type: 'export' },
    { time: '09:15', user: 'Traffic-Control', action: 'Signal timing updated', type: 'update' },
    { time: '08:58', user: 'Power-Ops', action: 'Load shedding scheduled', type: 'action' },
    { time: '08:45', user: 'Admin-Central', action: 'User role modified', type: 'admin' },
  ];

  const totalComplaints = departments.reduce((sum, d) => sum + d.complaints, 0);
  const totalResolved = departments.reduce((sum, d) => sum + d.resolved, 0);
  const avgSla = Math.round(departments.reduce((sum, d) => sum + d.slaCompliance, 0) / departments.length);

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Governance & Administration</h2>
          <p className="text-sm text-muted-foreground">
            Department performance, access control, audit logs
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="kpi-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileText className="h-4 w-4" />
            <span className="text-xs">Total Complaints</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{totalComplaints.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">This month</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs">Resolved</span>
          </div>
          <div className="text-2xl font-bold text-success">{totalResolved.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {Math.round((totalResolved / totalComplaints) * 100)}% resolution rate
          </div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Avg SLA Compliance</span>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            avgSla >= 85 ? 'text-success' : avgSla >= 75 ? 'text-warning' : 'text-destructive'
          )}>
            {avgSla}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">Across all departments</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Building2 className="h-4 w-4" />
            <span className="text-xs">Active Departments</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{departments.length}</div>
          <div className="text-xs text-muted-foreground mt-1">Connected to DCOP</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Department Performance */}
        <div className="col-span-8">
          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Department Performance</h3>
            </div>
            <div className="module-content">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Department</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Complaints</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Resolved</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Pending</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">SLA</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept.code} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2">
                        <span className="text-foreground">{dept.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">({dept.code})</span>
                      </td>
                      <td className="py-2 text-right text-muted-foreground">{dept.complaints}</td>
                      <td className="py-2 text-right text-success">{dept.resolved}</td>
                      <td className="py-2 text-right">
                        <span className={cn(
                          dept.pending > 100 ? 'text-warning' : 'text-muted-foreground'
                        )}>
                          {dept.pending}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <span className={cn(
                          "font-medium",
                          dept.slaCompliance >= 85 ? 'text-success' : 
                          dept.slaCompliance >= 75 ? 'text-warning' : 'text-destructive'
                        )}>
                          {dept.slaCompliance}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Access Control */}
          <div className="module-section mt-4">
            <div className="module-header">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-foreground">Role-Based Access Control</h3>
              </div>
            </div>
            <div className="module-content">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Admin</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Full system access</li>
                    <li>• User management</li>
                    <li>• Data override authority</li>
                    <li>• Audit log access</li>
                  </ul>
                </div>
                <div className="p-3 bg-muted/50 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-info" />
                    <span className="text-sm font-medium">Department</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Department data access</li>
                    <li>• Complaint management</li>
                    <li>• Status updates</li>
                    <li>• Report generation</li>
                  </ul>
                </div>
                <div className="p-3 bg-muted/50 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Viewer</span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Dashboard view only</li>
                    <li>• Public data access</li>
                    <li>• No edit permissions</li>
                    <li>• Export restrictions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Audit & Stats */}
        <div className="col-span-4 space-y-4">
          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">System Audit Log</h3>
            </div>
            <div className="module-content space-y-2">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-xs text-muted-foreground w-12">{log.time}</span>
                  <div className="flex-1">
                    <span className="text-foreground">{log.user}</span>
                    <span className="text-muted-foreground"> — {log.action}</span>
                  </div>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    log.type === 'admin' ? 'bg-destructive/10 text-destructive' :
                    log.type === 'action' ? 'bg-warning/10 text-warning' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {log.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">System Status</h3>
            </div>
            <div className="module-content space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Health</span>
                <span className="flex items-center gap-1 text-success text-sm">
                  <CheckCircle className="h-3 w-3" /> Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Data Sync</span>
                <span className="flex items-center gap-1 text-success text-sm">
                  <CheckCircle className="h-3 w-3" /> Live
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Connected Users</span>
                <span className="text-sm text-foreground">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Data Sources</span>
                <span className="text-sm text-foreground">5 active</span>
              </div>
            </div>
          </div>

          <div className="module-section">
            <div className="module-header">
              <h3 className="text-sm font-medium text-foreground">Monthly Trends</h3>
            </div>
            <div className="module-content space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Complaints</span>
                <span className="flex items-center gap-1 text-destructive">
                  <TrendingUp className="h-3 w-3" /> +12%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Resolution Rate</span>
                <span className="flex items-center gap-1 text-success">
                  <TrendingUp className="h-3 w-3" /> +3%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">SLA Compliance</span>
                <span className="flex items-center gap-1 text-success">
                  <TrendingUp className="h-3 w-3" /> +5%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Governance Module v1.0 • Role-based access control enabled</span>
          <span>Last sync: {new Date().toLocaleString('en-IN')}</span>
        </div>
      </div>
    </MainLayout>
  );
};

export default GovernancePage;
