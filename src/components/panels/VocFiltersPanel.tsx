import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { VocFilters } from '@/components/layout/RightPanel';

interface VocFiltersPanelProps {
  filters: VocFilters;
  onFilterChange: (filters: VocFilters) => void;
}

const FILTER_OPTIONS = {
  region: ['All Regions', 'US', 'UK', 'Germany', 'INTL Markets', 'AU/NZ'],
  surveyGroup: ['All', 'VOC ASAT', 'VOC CSAT', 'VOC NPS'],
  score: ['All', 'Very Negative', 'Negative', 'Neutral', 'Positive', 'Very Positive'],
} as const;

const FILTER_LABELS: Record<keyof VocFilters, string> = {
  region: 'Region',
  surveyGroup: 'Survey Group',
  score: 'Score',
};

export function VocFiltersPanel({ filters, onFilterChange }: VocFiltersPanelProps) {
  const update = (key: keyof VocFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col gap-5 p-4">
      <p className="text-xs text-muted-foreground">
        Filter verbatim feedback by region, survey group, or satisfaction score.
      </p>

      {(Object.keys(FILTER_OPTIONS) as (keyof VocFilters)[]).map((key) => (
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
