import { MainLayout } from '@/components/layout/MainLayout';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Construction className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          {description}
        </p>
        <div className="mt-6 p-4 bg-muted/50 rounded border border-border max-w-md">
          <p className="text-xs text-muted-foreground text-center">
            This module requires additional data sources and integrations. 
            The infrastructure is ready for implementation.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
