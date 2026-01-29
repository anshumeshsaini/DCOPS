import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Car,
  Zap,
  Droplets,
  Wind,
  Heart,
  Shield,
  Building2,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'City Model', href: '/city-model', icon: Map },
  { name: 'Traffic', href: '/traffic', icon: Car },
  { name: 'Power & Energy', href: '/power', icon: Zap },
  { name: 'Water', href: '/water', icon: Droplets },
  { name: 'Air Quality', href: '/air-quality', icon: Wind },
  { name: 'Health', href: '/health', icon: Heart },
  { name: 'Safety', href: '/safety', icon: Shield },
  { name: 'Governance', href: '/governance', icon: Building2 },
  { name: 'Citizen Reports', href: '/citizen', icon: MessageSquare },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-200",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">DC</span>
            </div>
            <span className="font-semibold text-sm text-sidebar-foreground">DCOP</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded hover:bg-sidebar-accent text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-sidebar-border">
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors",
            location.pathname === '/settings'
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}
