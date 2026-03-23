import { useParams } from 'react-router-dom';
import { Bell, Megaphone, BookOpen } from 'lucide-react';

const subPages: Record<string, { title: string; subtitle: string; icon: typeof Bell; emptyMessage: string }> = {
  alerts: {
    title: 'Alerts',
    subtitle: 'Threshold and metric alerts',
    icon: Bell,
    emptyMessage: 'No alerts at this time.',
  },
  announcements: {
    title: 'Announcements',
    subtitle: 'Platform announcements',
    icon: Megaphone,
    emptyMessage: 'No announcements at this time.',
  },
  articles: {
    title: 'Articles',
    subtitle: 'Knowledge base articles',
    icon: BookOpen,
    emptyMessage: 'No articles at this time.',
  },
};

export function AlertsView() {
  const { subPage } = useParams();
  const page = subPages[subPage ?? 'alerts'] ?? subPages.alerts;
  const Icon = page.icon;

  return (
    <div className="flex h-full flex-col animate-fade-in">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold">{page.title}</h1>
          <p className="text-sm text-muted-foreground">{page.subtitle}</p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Icon className="mx-auto mb-3 h-10 w-10 opacity-30" />
          <p className="text-sm">{page.emptyMessage}</p>
        </div>
      </div>
    </div>
  );
}
