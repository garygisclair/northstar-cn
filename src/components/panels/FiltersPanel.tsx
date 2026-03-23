import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { KpiFilters } from '@/components/layout/RightPanel';

interface FiltersPanelProps {
  filters: KpiFilters;
  onFilterChange: (filters: KpiFilters) => void;
}

const FILTER_OPTIONS = {
  timeframe: ['Daily', 'Weekly', 'Monthly', 'Quarterly'],
  platform: ['All Platforms', 'Desktop', 'Mobile Web', 'Mobile App'],
  region: ['Marketplace', 'On-Platform', 'US', 'UK', 'Germany', 'INTL Markets', 'Australia', 'ROW'],
} as const;

const FILTER_LABELS: Record<keyof KpiFilters, string> = {
  timeframe: 'Timeframe',
  platform: 'Platform',
  region: 'Region',
};

export function FiltersPanel({ filters, onFilterChange }: FiltersPanelProps) {
  const update = (key: keyof KpiFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <p className="text-xs text-muted-foreground">
        Filter KPI cards by timeframe, date, platform, or region.
      </p>

      {(Object.keys(FILTER_OPTIONS) as (keyof KpiFilters)[]).map((key) => (
        <div key={key} className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
            {FILTER_LABELS[key]}
          </label>
          <Select value={filters[key]} onValueChange={(v) => v && update(key, v)}>
            <SelectTrigger size="sm" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS[key].map((opt) => (
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
