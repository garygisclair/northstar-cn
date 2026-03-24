interface PeriodData {
  date: string;
  segments: Record<string, number>;
}

interface MigrationSlopegraphProps {
  periods: PeriodData[];
}

const SEGMENTS = [
  { key: 'High Value' },
  { key: 'Medium Value' },
  { key: 'Low Value' },
  { key: 'Churned' },
];

function formatM(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}b`;
  return `${v.toFixed(1)}m`;
}

function pctChange(first: number, last: number): string {
  const delta = ((last - first) / first) * 100;
  return `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`;
}

function pctColor(first: number, last: number): string {
  const delta = last - first;
  if (delta === 0) return 'text-muted-foreground';
  return delta < 0 ? 'text-negative' : 'text-positive';
}

function MiniBarChart({ values, dates }: { values: number[]; dates: string[] }) {
  const w = 300;
  const h = 100;
  const padL = 6;
  const padR = 6;
  const padT = 14;
  const padB = 16;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const yMax = maxVal + range * 0.1;
  const yMin = minVal - range * 0.1;
  const yRange = yMax - yMin;

  const barCount = values.length;
  const gap = 4;
  const barW = (chartW - gap * (barCount - 1)) / barCount;

  const toY = (v: number) => padT + chartH - ((v - yMin) / yRange) * chartH;
  const baseline = toY(values[0]);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full flex-1 min-h-0" preserveAspectRatio="xMidYMid meet">
      <line
        x1={padL} x2={w - padR}
        y1={baseline} y2={baseline}
        className="stroke-muted-foreground/30" strokeWidth={1} strokeDasharray="4,3"
      />

      {values.map((v, i) => {
        const x = padL + i * (barW + gap);
        const y = toY(v);
        const barH = Math.max(chartH - (y - padT), 1);
        const isGrowth = v >= values[0];

        return (
          <g key={i}>
            <rect
              x={x} y={y} width={barW} height={barH}
              className={isGrowth ? 'fill-foreground' : 'fill-foreground/60'}
            />
            <text
              x={x + barW / 2} y={y - 4}
              textAnchor="middle"
              className="text-[7px] fill-muted-foreground tabular-nums"
            >
              {formatM(v)}
            </text>
          </g>
        );
      })}

      <text x={padL} y={h - 2} textAnchor="start" className="text-[7px] fill-muted-foreground/50">
        {dates[0]}
      </text>
      <text x={w - padR} y={h - 2} textAnchor="end" className="text-[7px] fill-muted-foreground/50">
        {dates[dates.length - 1]}
      </text>
    </svg>
  );
}

export default function MigrationSlopegraph({ periods }: MigrationSlopegraphProps) {
  const dates = periods.map((p) => p.date);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {SEGMENTS.map(({ key }) => {
        const values = periods.map((p) => p.segments[key] ?? 0);
        const first = values[0];
        const last = values[values.length - 1];
        const periodTotals = periods.map((p) =>
          SEGMENTS.reduce((s, seg) => s + (p.segments[seg.key] ?? 0), 0)
        );
        const lastShare = ((last / periodTotals[periodTotals.length - 1]) * 100).toFixed(1);

        return (
          <div key={key} className="rounded border bg-card p-4 shadow-sm flex flex-col">
            <p className="text-sm font-bold">{key}</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-lg font-bold tabular-nums">{formatM(last)}</span>
              <span className="text-[10px] text-muted-foreground tabular-nums">{lastShare}% share</span>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className={`text-xs tabular-nums ${pctColor(first, last)}`}>
                {pctChange(first, last)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                vs {dates[0]}
              </span>
            </div>
            <MiniBarChart values={values} dates={dates} />
          </div>
        );
      })}
    </div>
  );
}
