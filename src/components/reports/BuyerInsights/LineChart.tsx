import { useId } from 'react';

interface LineChartProps {
  values: (number | null)[];
  months: string[];
  label: string;
  compact?: boolean;
  target?: number | null;
  targetLabel?: string;
}

function fmtVal(t: number): string {
  if (Math.abs(t) >= 1000) return `${(t / 1000).toFixed(0)}m`;
  if (t % 1 === 0) return `${t}`;
  return t.toFixed(1);
}

export default function LineChart({ values, months, label, compact = false, target = null, targetLabel = 'Prior Year' }: LineChartProps) {
  const clipId = useId();
  const w = 300;
  const h = compact ? 110 : 200;
  const padL = compact ? 6 : 10;
  const padR = compact ? 6 : 10;
  const padT = compact ? 14 : 18;
  const padB = compact ? 16 : 24;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  const valid = values.map((v, i) => (v !== null ? { x: i, y: v } : null)).filter(Boolean) as { x: number; y: number }[];
  if (valid.length < 2) {
    return (
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">{label}</p>
        <p className="text-xs text-muted-foreground">No data</p>
      </div>
    );
  }

  let minY = Math.min(...valid.map((p) => p.y));
  let maxY = Math.max(...valid.map((p) => p.y));
  if (target !== null && target !== undefined) {
    if (target < minY) minY = target;
    if (target > maxY) maxY = target;
  }
  const rangeY = maxY - minY || 1;

  const toX = (i: number) => padL + (i / (values.length - 1)) * chartW;
  const toY = (v: number) => padT + chartH - ((v - minY) / rangeY) * chartH;

  let path = '';
  for (const p of valid) {
    const px = toX(p.x);
    const py = toY(p.y);
    path += path ? ` L${px},${py}` : `M${px},${py}`;
  }

  const first = valid[0];
  const last = valid[valid.length - 1];

  const hasZero = minY < 0 && maxY > 0;
  const fontSize = compact ? 7 : 9;

  const yTicks = [
    { val: minY, y: toY(minY) },
    { val: maxY, y: toY(maxY) },
  ];

  return (
    <div className={compact ? 'flex flex-col flex-1 min-h-0' : ''}>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1 shrink-0">{label}</p>
      <svg viewBox={`0 0 ${w} ${h}`} className={compact ? 'w-full flex-1 min-h-0' : 'w-full'} preserveAspectRatio="xMidYMid meet" aria-hidden>

        {hasZero && (
          <line x1={padL} x2={w - padR} y1={toY(0)} y2={toY(0)}
            className="stroke-muted-foreground/15" strokeWidth={0.5} strokeDasharray="3,3" />
        )}

        {target !== null && target !== undefined && (
          <g>
            <line x1={padL} x2={w - padR} y1={toY(target)} y2={toY(target)}
              className="stroke-muted-foreground/40" strokeWidth={1} strokeDasharray="4,3" />
            <text x={w - padR} y={toY(target) - 4} textAnchor="end" fontSize={fontSize}
              className="fill-muted-foreground/50" fontFamily="inherit">
              {targetLabel} {fmtVal(target)}
            </text>
          </g>
        )}

        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={padL - 3} x2={padL} y1={t.y} y2={t.y}
              className="stroke-muted-foreground/30" strokeWidth={0.5} />
            <text x={padL - 5} y={t.y + 3} textAnchor="end" fontSize={fontSize}
              className="fill-muted-foreground/50" fontFamily="inherit">
              {fmtVal(t.val)}
            </text>
          </g>
        ))}

        {target !== null && target !== undefined ? (
          <>
            <defs>
              <clipPath id={`${clipId}-above`}>
                <rect x={0} y={0} width={w} height={toY(target)} />
              </clipPath>
              <clipPath id={`${clipId}-below`}>
                <rect x={0} y={toY(target)} width={w} height={h - toY(target)} />
              </clipPath>
            </defs>
            <path d={path} fill="none" className="stroke-foreground" strokeWidth={1.5}
              strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#${clipId}-above)`} />
            <path d={path} fill="none" className="stroke-negative" strokeWidth={1.5}
              strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#${clipId}-below)`} />
          </>
        ) : (
          <path d={path} fill="none" className="stroke-foreground" strokeWidth={1.5}
            strokeLinecap="round" strokeLinejoin="round" />
        )}

        <text x={toX(first.x)} y={toY(first.y) - 5} textAnchor="start" fontSize={fontSize}
          className="fill-muted-foreground" fontFamily="inherit">
          {fmtVal(first.y)}
        </text>
        <text x={toX(last.x)} y={toY(last.y) - 5} textAnchor="end" fontSize={fontSize}
          className={last.y < (target ?? 0) ? 'fill-negative' : 'fill-foreground'} fontFamily="inherit" fontWeight={500}>
          {fmtVal(last.y)}
        </text>

        <circle cx={toX(last.x)} cy={toY(last.y)} r={compact ? 2.5 : 3}
          className={last.y < (target ?? 0) ? 'fill-negative' : 'fill-foreground'} />

        <text x={padL} y={h - 2} textAnchor="start" fontSize={fontSize}
          className="fill-muted-foreground/50" fontFamily="inherit">
          {months[0]}
        </text>
        <text x={w - padR} y={h - 2} textAnchor="end" fontSize={fontSize}
          className="fill-muted-foreground/50" fontFamily="inherit">
          {months[months.length - 1]}
        </text>

      </svg>
    </div>
  );
}
