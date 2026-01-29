import { Clock, Bell, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">
          Delhi City Operations Platform
        </h1>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
          Beta
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Live Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="font-mono">
            {currentTime.toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit',
              hour12: false 
            })}
          </span>
          <span className="text-xs">IST</span>
        </div>

        {/* Date */}
        <div className="text-sm text-muted-foreground">
          {currentTime.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-sm">
            <div className="font-medium text-foreground">Admin</div>
            <div className="text-xs text-muted-foreground">Control Room</div>
          </div>
        </div>
      </div>
    </header>
  );
}
