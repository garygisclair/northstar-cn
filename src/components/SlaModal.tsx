import { useState } from 'react';
import { Check, Loader, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

export type Status = 'complete' | 'in-progress' | 'delayed' | 'do-not-use';

interface DataLoad {
  name: string;
  status: Status;
  reportSle: string;
  touchTime: string;
}

interface Dataset {
  name: string;
  status: Status;
  loads: DataLoad[];
  notes: string;
}

const DATASETS: Dataset[] = [
  {
    name: 'Active Buyers',
    status: 'complete',
    loads: [
      { name: 'Active Buyer Daily', status: 'complete', reportSle: 'Daily - 6:00 AM CT', touchTime: 'Daily - 5:42 AM CT' },
      { name: 'Active Buyer Weekly', status: 'complete', reportSle: 'Weekly - Sunday Midnight CT', touchTime: 'Weekly - Sunday 01:12 CT' },
    ],
    notes: 'Active buyer counts by region, platform type, and buyer segment. Includes On-Platform (US, UK, Germany, INTL Markets, ROW) and Off-Platform (DPG, Qoo10). Cut by Device, Vertical, Buyer Type, and Price Tranche.',
  },
  {
    name: 'Buyer Retention',
    status: 'complete',
    loads: [
      { name: 'Retention Monthly', status: 'complete', reportSle: 'Monthly - 1st 8:00 AM CT', touchTime: 'Mar 1, 2026 7:48 AM CT' },
      { name: 'Churn Weekly', status: 'complete', reportSle: 'Weekly - Monday 6:00 AM CT', touchTime: 'Monday 5:51 AM CT' },
    ],
    notes: 'Retained and churned buyer cohort analysis. Measures new-to-retained conversion, reactivation rates, and gross churn by region. Used in the Gross Churned tab.',
  },
  {
    name: 'Buyer Segmentation',
    status: 'delayed',
    loads: [
      { name: 'Value Tier Daily', status: 'complete', reportSle: 'Daily - 7:00 AM CT', touchTime: 'Daily - 6:53 AM CT' },
      { name: 'Segment Rollup Weekly', status: 'delayed', reportSle: 'Weekly - Monday 10:00 AM CT', touchTime: 'Pending...' },
    ],
    notes: 'Buyer value segmentation tiers (High, Medium, Low, New). Weekly rollup aggregates purchase frequency, average order value, and lifetime value per segment. Delay due to upstream purchase history reprocessing.',
  },
  {
    name: 'Traffic Attribution',
    status: 'in-progress',
    loads: [
      { name: 'Traffic Source Daily', status: 'in-progress', reportSle: 'Daily - 9:00 AM CT', touchTime: 'Processing...' },
    ],
    notes: 'Buyer acquisition attributed by traffic source (SEO, Direct, Paid Search, Display, ePN). Powers the Customer Traffic Source dimension filter on the Active Buyers tab. Not available for off-platform buyers.',
  },
  {
    name: 'Cross-Border Buyers',
    status: 'complete',
    loads: [
      { name: 'CBT Buyer Daily', status: 'complete', reportSle: 'Daily - 7:30 AM CT', touchTime: 'Daily - 7:18 AM CT' },
    ],
    notes: 'Cross-border transaction buyer counts. Tracks buyers purchasing from sellers in different regions. Feeds the CBT row in the Marketplace Summary table and INTL Markets sub-region breakdown.',
  },
];

function StatusIcon({ status, size = 14 }: { status: Status; size?: number }) {
  switch (status) {
    case 'complete':
      return <Check className="text-positive" style={{ width: size, height: size }} />;
    case 'in-progress':
      return <Loader className="text-blue-500 dark:text-blue-400 animate-spin" style={{ width: size, height: size }} />;
    case 'delayed':
      return <AlertTriangle className="text-amber-500 dark:text-amber-400" style={{ width: size, height: size }} />;
    case 'do-not-use':
      return <XCircle className="text-negative" style={{ width: size, height: size }} />;
  }
}

const STATUS_PRIORITY: Status[] = ['do-not-use', 'delayed', 'in-progress', 'complete'];

export function getOverallSlaStatus(): Status {
  for (const s of STATUS_PRIORITY) {
    if (DATASETS.some((ds) => ds.status === s)) return s;
  }
  return 'complete';
}

interface SlaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataAsOf: string;
}

export function SlaModal({ open, onOpenChange, dataAsOf }: SlaModalProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = DATASETS[selectedIdx];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <div>
            <DialogTitle className="text-sm font-bold">Data SLA Status</DialogTitle>
            <p className="text-[11px] text-muted-foreground mt-0.5">Data as of {dataAsOf}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-5 py-2 border-b text-[11px] text-muted-foreground">
          <span className="font-medium">Legend</span>
          <span className="flex items-center gap-1"><StatusIcon status="complete" size={12} /> Complete</span>
          <span className="flex items-center gap-1"><StatusIcon status="in-progress" size={12} /> In Progress</span>
          <span className="flex items-center gap-1"><StatusIcon status="delayed" size={12} /> Delayed</span>
          <span className="flex items-center gap-1"><StatusIcon status="do-not-use" size={12} /> Do Not Use</span>
        </div>

        {/* Body: dataset sidebar + detail panel */}
        <div className="flex min-h-0 overflow-hidden" style={{ height: '50vh' }}>
          {/* Dataset list */}
          <div className="w-[200px] shrink-0 border-r overflow-y-auto">
            <p className="px-4 py-2.5 text-xs font-bold text-muted-foreground border-b">Datasets</p>
            {DATASETS.map((ds, i) => (
              <button
                key={ds.name}
                onClick={() => setSelectedIdx(i)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition-colors cursor-pointer border-b border-border/50',
                  i === selectedIdx ? 'bg-accent font-medium' : 'hover:bg-accent/50',
                )}
              >
                <span className="truncate">{ds.name}</span>
                <StatusIcon status={ds.status} size={14} />
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* SLA table */}
            <table className="w-full text-xs border-collapse mb-6">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Data Load</th>
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">Report SLE</th>
                  <th className="text-left py-2 font-medium text-muted-foreground">Touch Time</th>
                </tr>
              </thead>
              <tbody>
                {selected.loads.map((load) => (
                  <tr key={load.name} className="border-b border-border/50">
                    <td className="py-2.5 pr-4 font-medium">{load.name}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <StatusIcon status={load.status} size={12} />
                        {load.reportSle}
                      </span>
                    </td>
                    <td className="py-2.5 text-muted-foreground tabular-nums">{load.touchTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Notes */}
            <div>
              <p className="text-xs font-bold mb-1.5">Notes:</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{selected.notes}</p>
            </div>

            {/* Confidentiality */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-[10px] font-bold text-muted-foreground">Confidential</p>
              <p className="text-[10px] text-muted-foreground/70 mt-1 leading-relaxed">
                This data is intended for internal use only. Do not share SLA details or data freshness information externally without prior authorization.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
