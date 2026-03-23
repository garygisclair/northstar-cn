/**
 * Mock data for Voice of the Customer report.
 * Seeded deterministic random for filter-responsive data.
 */

// ─── Seeded random ────────────────────────────────────────────────────────────

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seeded(seed: number, key: string): number {
  const combined = hashSeed(`${seed}-${key}`);
  return (combined % 10000) / 10000;
}

function filterSeed(region: string, surveyGroup: string, score: string): number {
  return hashSeed(`${region}|${surveyGroup}|${score}`);
}

// ─── Sentiment ────────────────────────────────────────────────────────────────

export type Sentiment = 'very-negative' | 'negative' | 'neutral' | 'positive' | 'very-positive';

export const SENTIMENT_COLORS: Record<Sentiment, string> = {
  'very-negative': '#E62048',
  'negative': '#F28FA3',
  'neutral': '#BFE4C7',
  'positive': '#93D1A1',
  'very-positive': '#28A443',
};

export const SENTIMENT_LABELS: Record<Sentiment, string> = {
  'very-negative': 'Very Dissatisfied',
  'negative': 'Dissatisfied',
  'neutral': 'Neutral',
  'positive': 'Satisfied',
  'very-positive': 'Very Satisfied',
};

function scoreToSentiment(score: number): Sentiment {
  if (score <= 2) return 'very-negative';
  if (score <= 4) return 'negative';
  if (score <= 6) return 'neutral';
  if (score <= 8) return 'positive';
  return 'very-positive';
}

// ─── Verbatim data ────────────────────────────────────────────────────────────

export interface VerbatimCard {
  id: string;
  topic: string;
  verbatim: string;
  score: number;
  sentiment: Sentiment;
  date: string;
  surveyGroup: string;
  region: string;
}

interface VerbatimDef {
  topic: string;
  verbatim: string;
  baseScore: number;
  surveyGroup: string;
}

const VERBATIM_POOL: VerbatimDef[] = [
  // Very negative (1-2)
  {
    topic: 'Buyer Protection Case',
    verbatim: 'Please review my chat transcript. The rep was beyond unhelpful. The rep wasn\'t responding to my messages, didn\'t ask me to hold during this time, nothing. I had to check in to make sure she was still there. I spent a lot of time explaining my situation and she kept responding with the same thing.',
    baseScore: 1,
    surveyGroup: 'VOC ASAT',
  },
  {
    topic: 'Buyer Protection Appeal SNAD',
    verbatim: 'Come up with a solution that would be fair to both parties. I just want a fair transaction. Either I am given my refund, or the shoes are returned to me. Currently approving the fact that I am left empty handed after paying without fail the price asked.',
    baseScore: 2,
    surveyGroup: 'VOC ASAT',
  },
  {
    topic: 'Account Restriction',
    verbatim: 'My account was restricted without any warning or explanation. I have been a seller for 12 years with perfect feedback. No one can tell me why or how to fix it. I have spent over 6 hours on the phone this week alone.',
    baseScore: 1,
    surveyGroup: 'VOC ASAT',
  },
  {
    topic: 'Shipping & Delivery',
    verbatim: 'Package was marked as delivered but never arrived. Filed a claim and was told to wait 3 more business days. It has now been 2 weeks and still no resolution. This is unacceptable for a premium seller account.',
    baseScore: 2,
    surveyGroup: 'VOC CSAT',
  },
  // Negative (3-4)
  {
    topic: 'Fees - CCR',
    verbatim: 'The fee structure keeps changing and it\'s getting harder to maintain margins. I understand the need for revenue but some transparency about upcoming changes would be appreciated.',
    baseScore: 3,
    surveyGroup: 'VOC ASAT',
  },
  {
    topic: 'Returns',
    verbatim: 'I requested to speak to a supervisor or was not able to do so. The return process took much longer than expected and I felt like my concerns were not being heard.',
    baseScore: 4,
    surveyGroup: 'VOC CSAT',
  },
  {
    topic: 'Search & Discovery',
    verbatim: 'Search results don\'t seem relevant anymore. I used to find exactly what I needed in the first few results. Now I have to scroll through pages of sponsored listings to find what I\'m looking for.',
    baseScore: 3,
    surveyGroup: 'VOC NPS',
  },
  {
    topic: 'Checkout Experience',
    verbatim: 'The checkout process has too many steps. I had items in my cart and by the time I finished entering payment details, two of them were already sold. Very frustrating.',
    baseScore: 4,
    surveyGroup: 'VOC CSAT',
  },
  // Neutral (5-6)
  {
    topic: 'Cancel Order',
    verbatim: 'Patience. The process worked but took longer than I expected. Would be nice to have a clearer timeline for when cancellations are processed.',
    baseScore: 5,
    surveyGroup: 'VOC ASAT',
  },
  {
    topic: 'Listing Tools',
    verbatim: 'The bulk listing tool is functional but could use some quality-of-life improvements. Auto-fill for common categories would save a lot of time for high-volume sellers.',
    baseScore: 6,
    surveyGroup: 'VOC CSAT',
  },
  {
    topic: 'Mobile App',
    verbatim: 'The app works fine for browsing but the selling experience on mobile still needs work. Photo upload is slow and the description editor is limited compared to desktop.',
    baseScore: 5,
    surveyGroup: 'VOC NPS',
  },
  // Positive (7-8)
  {
    topic: 'Contact Trading Partner - CCR',
    verbatim: 'Rep seemed to provide information he was trained on thoroughly. Should revise policies for new customers learning to use the interface. Thank you, the employee provided adequate information.',
    baseScore: 7,
    surveyGroup: 'VOC ASAT',
  },
  {
    topic: 'Buyer Protection Escalate INR',
    verbatim: 'How fast she resolved my problem. I was impressed with the speed and professionalism. The whole process took less than 10 minutes and my refund was processed immediately.',
    baseScore: 8,
    surveyGroup: 'VOC ASAT',
  },
  {
    topic: 'Seller Hub',
    verbatim: 'The new Seller Hub dashboard gives me a much better overview of my business performance. Being able to see all my metrics in one place has made daily management much easier.',
    baseScore: 7,
    surveyGroup: 'VOC CSAT',
  },
  {
    topic: 'Promoted Listings',
    verbatim: 'The promoted listings analytics have improved significantly. I can now see exactly which keywords are driving traffic and adjust my ad spend accordingly. Good ROI.',
    baseScore: 8,
    surveyGroup: 'VOC NPS',
  },
  // Very positive (9-10)
  {
    topic: 'Defect Appeal',
    verbatim: 'Appreciation of honest sellers that try to do the right thing. Having the ability to assess a situation and realize when exceptions to warranted are warranted. The team was fair and thorough.',
    baseScore: 9,
    surveyGroup: 'VOC ASAT',
  },
  {
    topic: 'Customer Support',
    verbatim: 'Absolutely outstanding service. The representative went above and beyond to help me resolve a complex issue with an international shipment. This is why I\'ve been a loyal customer for 15 years.',
    baseScore: 10,
    surveyGroup: 'VOC CSAT',
  },
  {
    topic: 'Buyer Experience',
    verbatim: 'Best online shopping experience I\'ve had. Found exactly what I was looking for at a great price, seller shipped same day, and the item arrived in perfect condition. Will definitely shop here again.',
    baseScore: 9,
    surveyGroup: 'VOC NPS',
  },
  {
    topic: 'Seller Onboarding',
    verbatim: 'The onboarding process for new sellers has improved dramatically. The step-by-step guide and video tutorials made it easy to get my first listing up within an hour. Great first impression.',
    baseScore: 10,
    surveyGroup: 'VOC CSAT',
  },
  // Additional variety
  {
    topic: 'Payment Processing',
    verbatim: 'Managed payments work smoothly now. Direct deposit is fast and reliable. The only improvement I\'d suggest is more detailed transaction-level reporting for tax purposes.',
    baseScore: 7,
    surveyGroup: 'VOC ASAT',
  },
  {
    topic: 'Buyer Protection Escalate INR',
    verbatim: 'He was very nice, but he just opened cases, and didn\'t answered my question, and nothing was solved. I expected more from the escalation process.',
    baseScore: 4,
    surveyGroup: 'VOC ASAT',
  },
  {
    topic: 'Pricing & Value',
    verbatim: 'The marketplace still offers the best selection for collectibles and hard-to-find items. Prices are competitive and the buyer protection gives me confidence to purchase from unknown sellers.',
    baseScore: 8,
    surveyGroup: 'VOC NPS',
  },
  {
    topic: 'Authenticity Guarantee',
    verbatim: 'The authenticity guarantee program is a game changer for luxury items. Knowing that every item over $100 is verified gives me peace of mind. This is exactly what the platform needed.',
    baseScore: 9,
    surveyGroup: 'VOC CSAT',
  },
  {
    topic: 'Shipping Labels',
    verbatim: 'Printing shipping labels used to be straightforward. Now I need to go through 4 different screens and the label format keeps changing. Please simplify this workflow.',
    baseScore: 3,
    surveyGroup: 'VOC ASAT',
  },
  {
    topic: 'Resolution Center',
    verbatim: 'The resolution center needs a major overhaul. Cases take too long to resolve and the automated responses don\'t address the actual issues. I shouldn\'t have to explain my problem 5 times.',
    baseScore: 2,
    surveyGroup: 'VOC CSAT',
  },
];

const REGIONS = ['US', 'UK', 'Germany', 'INTL Markets', 'AU/NZ'];
const DATES = [
  'Mar 15, 2026', 'Mar 14, 2026', 'Mar 13, 2026', 'Mar 12, 2026', 'Mar 11, 2026',
  'Mar 10, 2026', 'Mar 9, 2026', 'Mar 8, 2026', 'Mar 7, 2026', 'Mar 6, 2026',
  'Mar 5, 2026', 'Mar 4, 2026', 'Mar 3, 2026', 'Mar 2, 2026', 'Mar 1, 2026',
];

export function getVerbatimCards(region: string, surveyGroup: string, score: string): VerbatimCard[] {
  const seed = filterSeed(region, surveyGroup, score);

  // Generate cards from the pool, assigning region/date based on seed
  const cards: VerbatimCard[] = VERBATIM_POOL.map((def, i) => {
    const r = seeded(seed, `region-${i}`);
    const d = seeded(seed, `date-${i}`);
    const scoreVariance = Math.round((seeded(seed, `score-${i}`) - 0.5) * 2);
    const finalScore = Math.max(1, Math.min(10, def.baseScore + scoreVariance));
    const assignedRegion = REGIONS[Math.floor(r * REGIONS.length)];
    const assignedDate = DATES[Math.floor(d * DATES.length)];

    return {
      id: `v-${i}`,
      topic: def.topic,
      verbatim: def.verbatim,
      score: finalScore,
      sentiment: scoreToSentiment(finalScore),
      date: assignedDate,
      surveyGroup: def.surveyGroup,
      region: assignedRegion,
    };
  });

  // Filter by region
  let filtered = cards;
  if (region !== 'All Regions') {
    filtered = filtered.filter((c) => c.region === region);
  }

  // Filter by survey group
  if (surveyGroup !== 'All') {
    filtered = filtered.filter((c) => c.surveyGroup === surveyGroup);
  }

  // Filter by score
  if (score !== 'All') {
    const sentiment = score.toLowerCase().replace(/ /g, '-') as Sentiment;
    filtered = filtered.filter((c) => c.sentiment === sentiment);
  }

  // Sort by date descending, then by score ascending (worst first)
  filtered.sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return a.score - b.score;
  });

  return filtered;
}

// ─── Sentiment distribution KPIs ──────────────────────────────────────────────

export const SENTIMENT_ORDER: Sentiment[] = ['very-negative', 'negative', 'neutral', 'positive', 'very-positive'];

export interface SentimentKpi {
  sentiment: Sentiment;
  label: string;
  count: number;
  priorCount: number;
  delta: number;
}

export function getSentimentDistribution(region: string, surveyGroup: string): SentimentKpi[] {
  const seed = hashSeed(`${region}|${surveyGroup}|dist`);

  const baseCounts: Record<Sentiment, number> = {
    'very-negative': 84,
    'negative': 126,
    'neutral': 210,
    'positive': 342,
    'very-positive': 238,
  };

  return SENTIMENT_ORDER.map((s) => {
    const base = baseCounts[s];
    const r = seeded(seed, `dist-${s}`);
    const count = Math.round(base * (1 + (r - 0.5) * 0.3));
    const priorR = seeded(seed, `prior-${s}`);
    const priorCount = Math.round(base * (1 + (priorR - 0.5) * 0.3) * (1 + (seeded(seed, `drift-${s}`) - 0.5) * 0.15));
    const delta = count - priorCount;

    return {
      sentiment: s,
      label: SENTIMENT_LABELS[s],
      count,
      priorCount,
      delta,
    };
  });
}
