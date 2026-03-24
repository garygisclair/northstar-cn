import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  typing?: boolean;
}

const DEMO_PROMPT_KPI = 'I want to add KPIs that align with my focused category side of the business.';
const DEMO_PROMPT_BUYER = 'Show me a summary of buyer activity across all regions.';

export function AskPanel({ onDemoComplete, onBuyerDemoComplete }: { onDemoComplete?: () => void; onBuyerDemoComplete?: () => void }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [kpiDemoRan, setKpiDemoRan] = useState(false);
  const [isTypingPrompt, setIsTypingPrompt] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Generic demo runner
  const runDemo = (prompt: string, reply: string, callback?: () => void, lockAfter = true) => {
    if (isRunning || isTypingPrompt) return;
    setIsRunning(true);
    setIsTypingPrompt(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setQuery(prompt.slice(0, i));
      if (i >= prompt.length) {
        clearInterval(interval);
        setTimeout(() => submitDemo(prompt, reply, callback, lockAfter), 400);
      }
    }, 25);
  };

  const submitDemo = (prompt: string, reply: string, callback?: () => void, lockAfter = true) => {
    if (lockAfter) setKpiDemoRan(true);
    setIsTypingPrompt(false);

    setMessages([{ role: 'user', text: prompt }]);
    setQuery('');

    // Bot typing indicator
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: '', typing: true }]);
    }, 600);

    // Bot reply
    setTimeout(() => {
      setMessages([
        { role: 'user', text: prompt },
        { role: 'assistant', text: reply },
      ]);
      setIsRunning(false);
      callback?.();
    }, 2000);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* Message area */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3">&#10024;</div>
            <h3 className="text-sm font-medium mb-1">Ask NorthStar</h3>
            <p className="text-xs text-muted-foreground max-w-[240px] mb-4">
              Ask questions about your data, find metrics, or get insights.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => runDemo(
                  DEMO_PROMPT_BUYER,
                  "I've built your Buyer Insights Summary — it shows marketplace totals, regional breakdowns, and trend charts across all regions. Click any row in the table to drill into that region's trends.",
                  onBuyerDemoComplete,
                  false,
                )}
                className="rounded-md border border-input px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
              >
                Try: &quot;Buyer activity across regions&quot;
              </button>
              {!kpiDemoRan && (
                <button
                  onClick={() => runDemo(
                    DEMO_PROMPT_KPI,
                    "Great choice! I've added three KPIs for your top focus categories — Sneakers, Handbags, and Watches. They're now visible on your dashboard.",
                    onDemoComplete,
                  )}
                  className="rounded-md border border-input px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                >
                  Try: &quot;Add focus category KPIs&quot;
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.role === 'assistant' && (
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="size-3.5" />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm max-w-[85%]',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-accent-foreground',
                  )}
                >
                  {msg.typing ? (
                    <span className="inline-flex gap-1">
                      <span className="size-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="size-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="size-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  ) : (
                    msg.text
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <User className="size-3.5" />
                  </div>
                )}
              </div>
            ))}
            {/* Always show buyer demo button after messages */}
            {!isRunning && (
              <div className="flex justify-center mt-3">
                <button
                  onClick={() => runDemo(
                    DEMO_PROMPT_BUYER,
                    "I've built your Buyer Insights Summary — it shows marketplace totals, regional breakdowns, and trend charts across all regions. Click any row in the table to drill into that region's trends.",
                    onBuyerDemoComplete,
                    false,
                  )}
                  className="rounded-md border border-input px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                >
                  Try: &quot;Buyer activity across regions&quot;
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            readOnly={isTypingPrompt}
            onKeyDown={e => {
              if (e.key === 'Enter' && query.trim()) {
                setQuery('');
              }
            }}
          />
          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => {
              if (query.trim()) setQuery('');
            }}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
