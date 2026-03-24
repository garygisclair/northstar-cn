import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface BuyerFilters {
  timeframe: string;
  timeMeasure: string;
  region: string;
  format: string;
}

export const DEFAULT_BUYER_FILTERS: BuyerFilters = {
  timeframe: 'T12M',
  timeMeasure: 'Calendar',
  region: 'On-Platform',
  format: 'YoY',
};

interface BuyerFiltersPanelProps {
  filters: BuyerFilters;
  onFilterChange: (filters: BuyerFilters) => void;
  activeTab?: string;
}

const SUMMARY_FILTERS = {
  timeframe: { label: 'Timeframe', options: ['T12M', 'T6M', 'T3M'] },
} as const;

const KEY_METRICS_FILTERS = {
  timeMeasure: { label: 'Time Measure', options: ['Calendar', 'Retail'] },
  region: { label: 'Region', options: ['Marketplace', 'On-Platform', 'US', 'UK', 'Germany', 'INTL Markets', 'AUZ', 'CEM', 'EU Sited', 'ROW', 'CBT', 'Off-Platform', 'Qoo10'] },
  format: { label: 'Format', options: ['YoY', 'Actual'] },
} as const;

const SEGMENTATION_FILTERS = {
  region: { label: 'Region', options: ['On-Platform', 'US', 'UK', 'Germany', 'INTL Markets', 'AUZ', 'CEM', 'EU Sited', 'ROW', 'CBT'] },
  timeframe: { label: 'Timeframe', options: ['T12M', 'T6M', 'T3M'] },
} as const;

const ACTIVE_BUYERS_FILTERS = {
  region: { label: 'Region', options: ['On-Platform', 'US', 'UK', 'Germany', 'INTL Markets', 'AUZ', 'CEM', 'EU Sited', 'ROW', 'CBT'] },
  timeframe: { label: 'Timeframe', options: ['T12M', 'T6M', 'T3M'] },
} as const;

const FILTER_DESCRIPTIONS: Record<string, string> = {
  summary: 'Filter buyer insights by timeframe.',
  'key-metrics': 'Filter key buyer metrics by time measure, region, and display format.',
  segmentation: 'Filter buyer segmentation by region and timeframe.',
  'active-buyers': 'Filter active buyers by region and timeframe.',
  churned: 'Filter churned buyer metrics by region and timeframe.',
};

export function BuyerFiltersPanel({ filters, onFilterChange, activeTab }: BuyerFiltersPanelProps) {
  const update = (key: keyof BuyerFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  // Show different filters based on which tab is active
  const filterDefs = activeTab === 'key-metrics'
    ? KEY_METRICS_FILTERS
    : activeTab === 'segmentation'
    ? SEGMENTATION_FILTERS
    : activeTab === 'active-buyers' || activeTab === 'churned'
    ? ACTIVE_BUYERS_FILTERS
    : SUMMARY_FILTERS;

  return (
    <div className="flex flex-col gap-5 p-4">
      <p className="text-xs text-muted-foreground">
        {FILTER_DESCRIPTIONS[activeTab ?? 'summary'] ?? FILTER_DESCRIPTIONS.summary}
      </p>

      {Object.entries(filterDefs).map(([key, def]) => (
        <div key={key} className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            {def.label}
          </label>
          <Select
            value={filters[key as keyof BuyerFilters]}
            onValueChange={(v) => v && update(key as keyof BuyerFilters, v)}
          >
            <SelectTrigger size="sm" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(def.options as readonly string[]).map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
