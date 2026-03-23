import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGES } from '@/data/pages';

interface SlideshowState {
  playing: boolean;
  progress: number;
  currentPageIndex: number;
  currentTabIndex: number;
  totalSlides: number;
}

interface SlideshowContextValue {
  state: SlideshowState;
  pageIds: string[];
  setPageIds: (ids: string[]) => void;
  activeTabOverride: string | null;
  tabDuration: number;
  setTabDuration: (seconds: number) => void;
  slideDuration: number;
  setSlideDuration: (seconds: number) => void;
  toggle: () => void;
  stop: () => void;
}

const SlideshowCtx = createContext<SlideshowContextValue | null>(null);

export function useSlideshowContext() {
  const ctx = useContext(SlideshowCtx);
  if (!ctx) throw new Error('useSlideshowContext must be used inside SlideshowProvider');
  return ctx;
}

const DEFAULT_TAB_DURATION = 10;
const DEFAULT_SLIDE_DURATION = 30;
const TICK_INTERVAL = 50;

function getTabsForPage(pageId: string) {
  const page = PAGES.find(p => p.id === pageId);
  return page ? page.tabs : [];
}

export function SlideshowProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [pageIds, setPageIds] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tabDuration, setTabDuration] = useState(DEFAULT_TAB_DURATION);
  const [slideDuration, setSlideDuration] = useState(DEFAULT_SLIDE_DURATION);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [activeTabOverride, setActiveTabOverride] = useState<string | null>(null);

  const tabDurationRef = useRef(tabDuration);
  const slideDurationRef = useRef(slideDuration);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const pageIdsRef = useRef(pageIds);
  const currentPageIndexRef = useRef(currentPageIndex);
  const currentTabIndexRef = useRef(currentTabIndex);

  useEffect(() => { tabDurationRef.current = tabDuration; }, [tabDuration]);
  useEffect(() => { slideDurationRef.current = slideDuration; }, [slideDuration]);
  useEffect(() => { pageIdsRef.current = pageIds; }, [pageIds]);
  useEffect(() => { currentPageIndexRef.current = currentPageIndex; }, [currentPageIndex]);
  useEffect(() => { currentTabIndexRef.current = currentTabIndex; }, [currentTabIndex]);

  const goToPageTab = useCallback((pIdx: number, tIdx: number) => {
    const ids = pageIdsRef.current;
    if (ids.length === 0) return;
    const safeP = pIdx % ids.length;
    const pageId = ids[safeP];
    const tabs = getTabsForPage(pageId);
    const safeT = tabs.length > 0 ? tIdx % tabs.length : 0;

    setCurrentPageIndex(safeP);
    setCurrentTabIndex(safeT);
    setActiveTabOverride(tabs[safeT]?.id ?? null);
    setProgress(0);
    startTimeRef.current = Date.now();
    navigate(`/p/${pageId}`);
  }, [navigate]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = Date.now();
    setProgress(0);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const ids = pageIdsRef.current;
      const pIdx = currentPageIndexRef.current;
      const currentPageId = ids.length > 0 ? ids[pIdx % ids.length] : '';
      const currentTabs = currentPageId ? getTabsForPage(currentPageId) : [];
      const isSingleTab = currentTabs.length <= 1;
      const durationMs = (isSingleTab ? slideDurationRef.current : tabDurationRef.current) * 1000;
      const pct = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(pct);

      if (elapsed >= durationMs) {
        const tIdx = currentTabIndexRef.current;
        const nextTab = tIdx + 1;

        if (nextTab < currentTabs.length) {
          // Advance to next tab in same page
          setCurrentTabIndex(nextTab);
          currentTabIndexRef.current = nextTab;
          setActiveTabOverride(currentTabs[nextTab].id);
          setProgress(0);
          startTimeRef.current = Date.now();
        } else {
          // Advance to next page, first tab
          const newPIdx = (pIdx + 1) % ids.length;
          const newPageId = ids[newPIdx];
          const newTabs = getTabsForPage(newPageId);
          setCurrentPageIndex(newPIdx);
          currentPageIndexRef.current = newPIdx;
          setCurrentTabIndex(0);
          currentTabIndexRef.current = 0;
          setActiveTabOverride(newTabs[0]?.id ?? null);
          setProgress(0);
          startTimeRef.current = Date.now();
          navigate(`/p/${newPageId}`);
        }
      }
    }, TICK_INTERVAL);
  }, [navigate]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const toggle = useCallback(() => {
    if (playing) {
      stopTimer();
      setPlaying(false);
      setProgress(0);
      setActiveTabOverride(null);
    } else {
      if (pageIds.length === 0) return;
      setPlaying(true);
      goToPageTab(0, 0);
      startTimer();
    }
  }, [playing, pageIds, goToPageTab, startTimer, stopTimer]);

  const stop = useCallback(() => {
    stopTimer();
    setPlaying(false);
    setProgress(0);
    setActiveTabOverride(null);
  }, [stopTimer]);

  // ESC key stops slideshow
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && playing) stop();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [playing, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const state: SlideshowState = {
    playing,
    progress,
    currentPageIndex,
    currentTabIndex,
    totalSlides: pageIds.length,
  };

  return (
    <SlideshowCtx.Provider value={{ state, pageIds, setPageIds, activeTabOverride, tabDuration, setTabDuration, slideDuration, setSlideDuration, toggle, stop }}>
      {children}
    </SlideshowCtx.Provider>
  );
}
