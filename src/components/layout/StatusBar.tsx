import { cn } from '@/lib/utils';

export function StatusBar() {
  return (
    <div className="flex h-8 items-center justify-between border-t border-border bg-background px-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className={cn('inline-block h-2 w-2 rounded-full bg-positive')} />
          Data Current
        </span>
        <span className="text-border">|</span>
        <span>0 Alerts</span>
      </div>
      <span>NorthStar</span>
    </div>
  );
}
