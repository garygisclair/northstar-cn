import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  typing?: boolean;
}

const DEMO_PROMPT = 'I want to add KPIs that align with my focused category side of the business.';

export function AskPanel({ onDemoComplete }: { onDemoComplete?: () => void }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [demoRan, setDemoRan] = useState(false);
  const [isTypingPrompt, setIsTypingPrompt] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Start the demo: type out the prefilled prompt character by character
  const startDemo = () => {
    if (demoRan || isTypingPrompt) return;
    setIsTypingPrompt(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setQuery(DEMO_PROMPT.slice(0, i));
      if (i >= DEMO_PROMPT.length) {
        clearInterval(interval);
        // Small pause then "send"
        setTimeout(() => submitDemo(), 400);
      }
    }, 25);
  };

  const submitDemo = () => {
    setDemoRan(true);
    setIsTypingPrompt(false);

    // Add user message
    setMessages([{ role: 'user', text: DEMO_PROMPT }]);
    setQuery('');

    // Bot typing indicator
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: '', typing: true }]);
    }, 600);

    // Bot reply
    setTimeout(() => {
      setMessages([
        { role: 'user', text: DEMO_PROMPT },
        {
          role: 'assistant',
          text: "Great choice! I've added three KPIs for your top focus categories — Sneakers, Handbags, and Watches. They're now visible on your dashboard.",
        },
      ]);
      // Trigger the KPI cards on HomePage
      onDemoComplete?.();
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
            {!demoRan && (
              <button
                onClick={startDemo}
                className="rounded-md border border-input px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
              >
                Try: &quot;Add focus category KPIs&quot;
              </button>
            )}
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
