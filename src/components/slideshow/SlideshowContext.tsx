import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Page } from '@/types';

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
  setSlidePages: (pages: Page[]) => void;
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

export function SlideshowProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [slidePages, setSlidePages] = useState<Page[]>([]);
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
  const slidePagesRef = useRef(slidePages);
  const currentPageIndexRef = useRef(currentPageIndex);
  const currentTabIndexRef = useRef(currentTabIndex);

  useEffect(() => { tabDurationRef.current = tabDuration; }, [tabDuration]);
  useEffect(() => { slideDurationRef.current = slideDuration; }, [slideDuration]);
  useEffect(() => { slidePagesRef.current = slidePages; }, [slidePages]);
  useEffect(() => { currentPageIndexRef.current = currentPageIndex; }, [currentPageIndex]);
  useEffect(() => { currentTabIndexRef.current = currentTabIndex; }, [currentTabIndex]);

  const getTabsForPage = useCallback((pIdx: number) => {
    const pages = slidePagesRef.current;
    if (pIdx < 0 || pIdx >= pages.length) return [];
    return pages[pIdx].tabs;
  }, []);

  const goToPageTab = useCallback((pIdx: number, tIdx: number) => {
    const pages = slidePagesRef.current;
    if (pages.length === 0) return;
    const safeP = pIdx % pages.length;
    const tabs = getTabsForPage(safeP);
    const safeT = tabs.length > 0 ? tIdx % tabs.length : 0;

    setCurrentPageIndex(safeP);
    setCurrentTabIndex(safeT);
    setActiveTabOverride(tabs[safeT]?.id ?? null);
    setProgress(0);
    startTimeRef.current = Date.now();
    navigate(`/p/${pages[safeP].id}`);
  }, [navigate, getTabsForPage]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = Date.now();
    setProgress(0);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pages = slidePagesRef.current;
      const pIdx = currentPageIndexRef.current;
      const currentTabs = pIdx < pages.length ? pages[pIdx].tabs : [];
      const isSingleTab = currentTabs.length <= 1;
      const durationMs = (isSingleTab ? slideDurationRef.current : tabDurationRef.current) * 1000;
      const pct = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(pct);

      if (elapsed >= durationMs) {
        const tIdx = currentTabIndexRef.current;
        const nextTab = tIdx + 1;

        if (nextTab < currentTabs.length) {
          setCurrentTabIndex(nextTab);
          currentTabIndexRef.current = nextTab;
          setActiveTabOverride(currentTabs[nextTab].id);
          setProgress(0);
          startTimeRef.current = Date.now();
        } else {
          const newPIdx = (pIdx + 1) % pages.length;
          const newTabs = pages[newPIdx].tabs;
          setCurrentPageIndex(newPIdx);
          currentPageIndexRef.current = newPIdx;
          setCurrentTabIndex(0);
          currentTabIndexRef.current = 0;
          setActiveTabOverride(newTabs[0]?.id ?? null);
          setProgress(0);
          startTimeRef.current = Date.now();
          navigate(`/p/${pages[newPIdx].id}`);
        }
      }
    }, TICK_INTERVAL);
  }, [navigate, getTabsForPage]);

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
      if (slidePages.length === 0) return;
      setPlaying(true);
      goToPageTab(0, 0);
      startTimer();
    }
  }, [playing, slidePages, goToPageTab, startTimer, stopTimer]);

  const stop = useCallback(() => {
    stopTimer();
    setPlaying(false);
    setProgress(0);
    setActiveTabOverride(null);
  }, [stopTimer]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && playing) stop();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [playing, stop]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const state: SlideshowState = {
    playing,
    progress,
    currentPageIndex,
    currentTabIndex,
    totalSlides: slidePages.length,
  };

  const pageIds = slidePages.map(p => p.id);

  return (
    <SlideshowCtx.Provider value={{ state, pageIds, setSlidePages, activeTabOverride, tabDuration, setTabDuration, slideDuration, setSlideDuration, toggle, stop }}>
      {children}
    </SlideshowCtx.Provider>
  );
}
