import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { PAGES as SEED_PAGES } from '@/data/pages';
import type { Page } from '@/types';

interface PagesContextValue {
  pages: Page[];
  getPage: (id: string) => Page | undefined;
  /** Merge multiple single-tab pages into one grouped page */
  groupPages: (name: string, pageIds: string[]) => void;
  /** Split a grouped page back into individual single-tab pages */
  ungroupPage: (pageId: string) => void;
}

const PagesContext = createContext<PagesContextValue | null>(null);

export function PagesProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<Page[]>(() => [...SEED_PAGES]);

  const getPage = useCallback(
    (id: string) => pages.find(p => p.id === id),
    [pages],
  );

  const groupPages = useCallback((name: string, pageIds: string[]) => {
    setPages(prev => {
      const toGroup = prev.filter(p => pageIds.includes(p.id));
      if (toGroup.length < 2) return prev;

      // Build tabs from each source page (use page title as tab label for single-tab pages)
      const tabs = toGroup.flatMap(p =>
        p.tabs.length === 1
          ? [{ ...p.tabs[0], id: p.id, label: p.title }]
          : p.tabs,
      );

      // Inherit tags and category from first selected page
      const first = toGroup[0];
      const grouped: Page = {
        id: `group-${Date.now()}`,
        title: name,
        subtitle: `${toGroup.length} pages grouped`,
        category: first.category,
        tags: first.tags,
        tabs,
        dataAsOf: first.dataAsOf,
        dateCreated: new Date().toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0],
      };

      // Remove source pages, insert grouped page at the position of the first source
      const firstIdx = prev.findIndex(p => p.id === toGroup[0].id);
      const remaining = prev.filter(p => !pageIds.includes(p.id));
      remaining.splice(firstIdx, 0, grouped);
      return remaining;
    });
  }, []);

  const ungroupPage = useCallback((pageId: string) => {
    setPages(prev => {
      const page = prev.find(p => p.id === pageId);
      if (!page || page.tabs.length <= 1) return prev;

      // Split each tab back into an individual page
      const singles: Page[] = page.tabs.map(tab => ({
        id: tab.id,
        title: tab.label,
        category: page.category,
        tags: page.tags,
        tabs: [tab],
        dataAsOf: page.dataAsOf,
        dateCreated: page.dateCreated,
        dateModified: page.dateModified,
      }));

      const idx = prev.findIndex(p => p.id === pageId);
      const result = [...prev];
      result.splice(idx, 1, ...singles);
      return result;
    });
  }, []);

  return (
    <PagesContext.Provider value={{ pages, getPage, groupPages, ungroupPage }}>
      {children}
    </PagesContext.Provider>
  );
}

export function usePages() {
  const ctx = useContext(PagesContext);
  if (!ctx) throw new Error('usePages must be used within PagesProvider');
  return ctx;
}
