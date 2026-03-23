import { useState } from 'react';
import { Send } from 'lucide-react';

export function AskPanel() {
  const [query, setQuery] = useState('');

  return (
    <div className="flex h-full flex-col">
      {/* Message area */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="text-4xl mb-3">&#10024;</div>
          <h3 className="text-sm font-medium mb-1">Ask NorthStar</h3>
          <p className="text-xs text-muted-foreground max-w-[240px]">
            Ask questions about your data, find metrics, or get insights.
          </p>
        </div>
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
