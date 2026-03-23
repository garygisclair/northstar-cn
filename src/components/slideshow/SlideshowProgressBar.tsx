import { useSlideshowContext } from './SlideshowContext';

export function SlideshowProgressBar() {
  const { state } = useSlideshowContext();

  if (!state.playing) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-muted">
      <div
        className="h-full bg-foreground transition-[width] duration-[50ms] linear"
        style={{ width: `${state.progress}%` }}
      />
    </div>
  );
}
