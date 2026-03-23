import { useState } from 'react';
import { SlaModal, getOverallSlaStatus } from '@/components/SlaModal';

function statusColor(status: string) {
  switch (status) {
    case 'complete': return 'bg-positive';
    case 'in-progress': return 'bg-blue-500';
    case 'delayed': return 'bg-amber-500';
    case 'do-not-use': return 'bg-negative';
    default: return 'bg-positive';
  }
}

export function StatusBar() {
  const [slaOpen, setSlaOpen] = useState(false);

  const now = new Date();
  const formatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ', '
    + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const overall = getOverallSlaStatus();

  return (
    <>
      <div className="flex h-8 items-center justify-between border-t border-border bg-background px-4 text-xs text-muted-foreground">
        <button
          onClick={() => setSlaOpen(true)}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
        >
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${statusColor(overall)}`} />
          Data as of {formatted}
        </button>
        <span>NorthStar</span>
      </div>
      <SlaModal open={slaOpen} onOpenChange={setSlaOpen} dataAsOf={formatted} />
    </>
  );
}
