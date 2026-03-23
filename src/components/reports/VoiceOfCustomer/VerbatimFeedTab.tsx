import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getVerbatimCards, getSentimentDistribution, SENTIMENT_COLORS, SENTIMENT_LABELS, type VerbatimCard, type Sentiment } from './mockData';

// --- Sentiment dot ---

function SentimentDot({ sentiment, size = 'md' }: { sentiment: Sentiment; size?: 'sm' | 'md' }) {
  const px = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5';
  return (
    <span
      className={cn('inline-block rounded-full shrink-0', px)}
      style={{ backgroundColor: SENTIMENT_COLORS[sentiment] }}
      title={SENTIMENT_LABELS[sentiment]}
    />
  );
}

// --- Verbatim card (KPI card layout) ---

function VerbatimCardComponent({ card }: { card: VerbatimCard }) {
  return (
    <div className="rounded border bg-card p-5 shadow-sm flex flex-col">
      {/* Header: topic + sentiment dot */}
      <div className="flex items-start gap-3 mb-2">
        <SentimentDot sentiment={card.sentiment} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-tight">{card.topic}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-muted-foreground">{card.date}</span>
            <span className="text-[10px] text-muted-foreground">·</span>
            <span className="text-[10px] text-muted-foreground">{card.surveyGroup}</span>
            <span className="text-[10px] text-muted-foreground">·</span>
            <span className="text-[10px] text-muted-foreground">{card.region}</span>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0">
          <span
            className="text-lg font-bold tabular-nums leading-none"
            style={{ color: SENTIMENT_COLORS[card.sentiment] }}
          >
            {card.score}
          </span>
          <span className="text-[8px] text-muted-foreground uppercase tracking-wider mt-0.5">Score</span>
        </div>
      </div>

      {/* Verbatim text */}
      <p className="text-xs text-muted-foreground leading-relaxed flex-1">
        "{card.verbatim}"
      </p>

      {/* Sentiment label */}
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/40">
        <SentimentDot sentiment={card.sentiment} size="sm" />
        <span className="text-[10px] text-muted-foreground">{SENTIMENT_LABELS[card.sentiment]}</span>
      </div>
    </div>
  );
}

// --- Sentiment legend ---

function SentimentLegend() {
  const levels: Sentiment[] = ['very-negative', 'negative', 'neutral', 'positive', 'very-positive'];
  return (
    <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
      {levels.map((s) => (
        <span key={s} className="flex items-center gap-1.5">
          <SentimentDot sentiment={s} size="sm" />
          {SENTIMENT_LABELS[s]}
        </span>
      ))}
    </div>
  );
}

// --- Main ---

export default function VerbatimFeedTab({ region, surveyGroup, score }: { region: string; surveyGroup: string; score: string }) {
  const cards = getVerbatimCards(region, surveyGroup, score);
  const distribution = getSentimentDistribution(region, surveyGroup);
  const totalResponses = distribution.reduce((s, d) => s + d.count, 0);

  const dataAsOf = 'Mar 16, 2026';

  return (
    <>
      {/* ── SENTIMENT KPI STRIP ──────────────────────── */}
      <div className="flex gap-4 flex-wrap mb-5">
        {/* Total card */}
        <div className="flex-1 min-w-[130px] rounded border bg-card p-4 shadow-sm">
          <p className="text-[11px] text-muted-foreground leading-4">Total Responses</p>
          <p className="text-[10px] text-muted-foreground leading-4">{dataAsOf} · {region}</p>
          <p className="text-2xl font-bold tracking-tight mt-1">{totalResponses.toLocaleString()}</p>
          {(() => {
            const totalPrior = distribution.reduce((s, d) => s + d.priorCount, 0);
            const totalDelta = totalResponses - totalPrior;
            const positive = totalDelta >= 0;
            return (
              <div className="flex items-center gap-1.5 mt-1">
                {positive ? <TrendingUp className="h-4 w-4 text-positive" /> : <TrendingDown className="h-4 w-4 text-negative" />}
                <span className={cn('text-sm tabular-nums', positive ? 'text-positive' : 'text-negative')}>
                  {totalDelta > 0 ? '+' : ''}{totalDelta}
                </span>
                <span className="text-[10px] text-muted-foreground">vs prior month</span>
              </div>
            );
          })()}
        </div>

        {/* Per-sentiment cards */}
        {distribution.map((d) => {
          // For negative sentiments, fewer is good (positive). For positive sentiments, more is good.
          const isNegativeSentiment = d.sentiment === 'very-negative' || d.sentiment === 'negative';
          const trendPositive = isNegativeSentiment ? d.delta <= 0 : d.delta >= 0;

          return (
            <div key={d.sentiment} className="flex-1 min-w-[130px] rounded border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-1.5">
                <SentimentDot sentiment={d.sentiment} size="sm" />
                <p className="text-[11px] text-muted-foreground leading-4">{d.label}</p>
              </div>
              <p className="text-2xl font-bold tracking-tight mt-1">{d.count.toLocaleString()}</p>
              <div className="flex items-center gap-1.5 mt-1">
                {trendPositive ? <TrendingUp className="h-4 w-4 text-positive" /> : <TrendingDown className="h-4 w-4 text-negative" />}
                <span className={cn('text-sm tabular-nums', trendPositive ? 'text-positive' : 'text-negative')}>
                  {d.delta > 0 ? '+' : ''}{d.delta}
                </span>
                <span className="text-[10px] text-muted-foreground">vs prior</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] text-muted-foreground">{dataAsOf} · {region} · {surveyGroup} · {cards.length} verbatims</p>
        </div>
        <SentimentLegend />
      </div>

      {/* Card grid — 3 columns like home KPI cards */}
      {cards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((card) => (
            <VerbatimCardComponent key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 rounded border border-dashed bg-card text-muted-foreground">
          No responses match the current filters
        </div>
      )}
    </>
  );
}
