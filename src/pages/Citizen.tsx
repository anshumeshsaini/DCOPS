import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { DELHI_ZONES } from '@/types/city';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Plus
} from 'lucide-react';

interface CitizenReport {
  id: string;
  category: 'infrastructure' | 'safety' | 'sanitation' | 'water' | 'power' | 'other';
  description: string;
  zone: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  department: string;
}

// Sample reports data
const sampleReports: CitizenReport[] = [
  {
    id: '1',
    category: 'infrastructure',
    description: 'Large pothole on main road causing traffic issues',
    zone: 'south',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    department: 'PWD',
  },
  {
    id: '2',
    category: 'water',
    description: 'Water pipeline leakage near residential colony',
    zone: 'west',
    status: 'pending',
    priority: 'high',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    department: 'DJB',
  },
  {
    id: '3',
    category: 'power',
    description: 'Frequent power cuts in the area',
    zone: 'east',
    status: 'in-progress',
    priority: 'medium',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    department: 'BSES',
  },
  {
    id: '4',
    category: 'sanitation',
    description: 'Garbage not collected for 3 days',
    zone: 'north',
    status: 'resolved',
    priority: 'medium',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    department: 'MCD',
  },
  {
    id: '5',
    category: 'safety',
    description: 'Street lights not working on main road',
    zone: 'central',
    status: 'pending',
    priority: 'high',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    department: 'MCD',
  },
  {
    id: '6',
    category: 'infrastructure',
    description: 'Broken footpath tiles causing hazard',
    zone: 'southwest',
    status: 'pending',
    priority: 'low',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    department: 'PWD',
  },
];

const CitizenPage = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterZone, setFilterZone] = useState<string>('all');

  const getZoneName = (zoneId: string) => {
    return DELHI_ZONES.find(z => z.id === zoneId)?.name || zoneId;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      infrastructure: '🏗️',
      safety: '🛡️',
      sanitation: '🗑️',
      water: '💧',
      power: '⚡',
      other: '📋',
    };
    return icons[category] || '📋';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-warning/10 text-warning',
      'in-progress': 'bg-info/10 text-info',
      resolved: 'bg-success/10 text-success',
    };
    return colors[status as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-muted-foreground',
      medium: 'text-warning',
      high: 'text-destructive',
    };
    return colors[priority as keyof typeof colors] || 'text-muted-foreground';
  };

  const filteredReports = sampleReports.filter(report => {
    if (filterStatus !== 'all' && report.status !== filterStatus) return false;
    if (filterZone !== 'all' && report.zone !== filterZone) return false;
    return true;
  });

  const pendingCount = sampleReports.filter(r => r.status === 'pending').length;
  const inProgressCount = sampleReports.filter(r => r.status === 'in-progress').length;
  const resolvedCount = sampleReports.filter(r => r.status === 'resolved').length;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Citizen Reports</h2>
        <p className="text-sm text-muted-foreground">
          Public issue reporting and tracking system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase">Total Reports</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{sampleReports.length}</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            <span className="text-xs font-medium text-muted-foreground uppercase">Pending</span>
          </div>
          <div className="text-3xl font-bold text-warning">{pendingCount}</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-info" />
            <span className="text-xs font-medium text-muted-foreground uppercase">In Progress</span>
          </div>
          <div className="text-3xl font-bold text-info">{inProgressCount}</div>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-xs font-medium text-muted-foreground uppercase">Resolved</span>
          </div>
          <div className="text-3xl font-bold text-success">{resolvedCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-border rounded px-2 py-1 bg-background"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select 
          value={filterZone}
          onChange={(e) => setFilterZone(e.target.value)}
          className="text-sm border border-border rounded px-2 py-1 bg-background"
        >
          <option value="all">All Zones</option>
          {DELHI_ZONES.map(zone => (
            <option key={zone.id} value={zone.id}>{zone.name}</option>
          ))}
        </select>
      </div>

      {/* Reports List */}
      <div className="module-section">
        <div className="module-header">
          <h3 className="text-sm font-medium text-foreground">Recent Reports</h3>
          <span className="text-xs text-muted-foreground">{filteredReports.length} reports</span>
        </div>
        <div className="divide-y divide-border">
          {filteredReports.map(report => (
            <div key={report.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <span className="text-xl">{getCategoryIcon(report.category)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{report.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {getZoneName(report.zone)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(report.createdAt)}
                        </span>
                        <span>Dept: {report.department}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs font-medium",
                        getPriorityColor(report.priority)
                      )}>
                        {report.priority.toUpperCase()}
                      </span>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded capitalize",
                        getStatusColor(report.status)
                      )}>
                        {report.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-6 p-4 bg-muted/50 rounded border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> This is a demonstration of the citizen reporting module. 
          In production, this would integrate with the Delhi government's grievance 
          redressal system (PGMS) and allow real citizen submissions.
        </p>
      </div>
    </MainLayout>
  );
};

export default CitizenPage;
