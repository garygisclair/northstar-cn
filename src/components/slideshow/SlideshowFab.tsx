import { useState } from 'react';
import { Play, Pause, Settings, HelpCircle, X, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSlideshowContext } from './SlideshowContext';

function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { tabDuration, setTabDuration, slideDuration, setSlideDuration } = useSlideshowContext();
  const [tabInput, setTabInput] = useState(String(tabDuration));
  const [slideInput, setSlideInput] = useState(String(slideDuration));

  if (!open) return null;

  const handleSave = () => {
    const parsedTab = parseInt(tabInput, 10);
    if (!isNaN(parsedTab) && parsedTab >= 3 && parsedTab <= 120) {
      setTabDuration(parsedTab);
    }
    const parsedSlide = parseInt(slideInput, 10);
    if (!isNaN(parsedSlide) && parsedSlide >= 5 && parsedSlide <= 120) {
      setSlideDuration(parsedSlide);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative z-50 w-full max-w-sm rounded-lg border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h2 className="text-sm font-bold">Slideshow Settings</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Seconds per tab
              </label>
              <input
                type="number"
                min={3}
                max={120}
                value={tabInput}
                onChange={(e) => setTabInput(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring tabular-nums"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                For pages with multiple tabs. Each tab displays for this many seconds.
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Seconds per single-tab page
              </label>
              <input
                type="number"
                min={5}
                max={120}
                value={slideInput}
                onChange={(e) => setSlideInput(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring tabular-nums"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                For pages with only one tab. The page displays for this many seconds.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative z-50 w-full max-w-md rounded-lg border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h2 className="text-sm font-bold">About Slideshow</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">What is Slideshow?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Slideshow automatically cycles through your saved pages, advancing through each tab on a timer. It's designed for always-on displays, team standups, or hands-free monitoring of key dashboards.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">How are pages selected?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The slideshow plays through every page in your <Bookmark className="inline h-3 w-3 fill-current -mt-0.5" /> <strong>Saved</strong> list, in the order they appear in the sidebar. To change which pages are included, bookmark or unbookmark pages using the save icon on any page header.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Timing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pages with multiple tabs advance per tab (default: 10 seconds each). Single-tab pages display longer (default: 30 seconds). You can customize these durations using the settings gear that appears on hover.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Controls</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Press <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono">Esc</kbd> at any time to stop the slideshow, or click the pause button.
              </p>
            </div>
          </div>
          <div className="flex justify-end border-t px-5 py-3">
            <button
              onClick={onClose}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SlideshowFab() {
  const { state, toggle } = useSlideshowContext();
  const [hover, setHover] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <div
        className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-2"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Help button — appears on hover */}
        <button
          onClick={() => setShowHelp(true)}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full bg-foreground/80 text-background shadow-md transition-all cursor-pointer',
            hover ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none',
          )}
        >
          <HelpCircle size={16} />
        </button>

        {/* Settings button — appears on hover */}
        <button
          onClick={() => setShowSettings(true)}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full bg-foreground/80 text-background shadow-md transition-all cursor-pointer',
            hover ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none',
          )}
        >
          <Settings size={16} />
        </button>

        {/* Play/Pause FAB */}
        <button
          onClick={toggle}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg hover:bg-foreground/90 transition-colors cursor-pointer"
        >
          {state.playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>

        {/* Tooltip */}
        {hover && !showSettings && !showHelp && (
          <div className="absolute bottom-full right-0 mb-2">
            <div className="rounded-md bg-foreground px-2.5 py-1 text-xs text-background whitespace-nowrap shadow">
              {state.playing ? 'Stop slideshow' : 'Start slideshow'}
            </div>
          </div>
        )}
      </div>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
}
