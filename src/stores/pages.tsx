import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { PAGES as SEED_PAGES } from '@/data/pages';
import type { Page } from '@/types';

export interface Section {
  id: string;
  label: string;
}

const DEFAULT_SECTIONS: Section[] = [
  { id: 'curated', label: 'Curated' },
  { id: 'certified', label: 'Certified' },
  { id: 'mine', label: 'My Pages' },
];

interface PagesContextValue {
  pages: Page[];
  sections: Section[];
  getPage: (id: string) => Page | undefined;
  createPage: (title: string, category: string, sectionId: string) => string;
  createSection: (label: string) => string;
  /** Remove a custom section, moving its pages to 'mine' */
  removeSection: (sectionId: string) => void;
  groupPages: (name: string, pageIds: string[]) => void;
  ungroupPage: (pageId: string) => void;
}

const PagesContext = createContext<PagesContextValue | null>(null);

export function PagesProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<Page[]>(() => [...SEED_PAGES]);
  const [sections, setSections] = useState<Section[]>(() => [...DEFAULT_SECTIONS]);

  const getPage = useCallback(
    (id: string) => pages.find(p => p.id === id),
    [pages],
  );

  const createPage = useCallback((title: string, category: string, sectionId: string) => {
    const id = `page-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const newPage: Page = {
      id,
      title,
      category,
      tags: [sectionId],
      tabs: [{ id: 'default', label: 'Overview', cards: [] }],
      dateCreated: today,
      dateModified: today,
    };
    setPages(prev => [...prev, newPage]);
    return id;
  }, []);

  const createSection = useCallback((label: string) => {
    const id = `section-${Date.now()}`;
    setSections(prev => [...prev, { id, label }]);
    return id;
  }, []);

  const PROTECTED_SECTIONS = ['curated', 'certified', 'mine'];

  const removeSection = useCallback((sectionId: string) => {
    if (PROTECTED_SECTIONS.includes(sectionId)) return;
    setSections(prev => prev.filter(s => s.id !== sectionId));
    // Move pages from removed section to 'mine'
    setPages(prev => prev.map(p =>
      p.tags.includes(sectionId)
        ? { ...p, tags: p.tags.map(t => t === sectionId ? 'mine' : t) }
        : p
    ));
  }, []);

  const groupPages = useCallback((name: string, pageIds: string[]) => {
    setPages(prev => {
      const toGroup = prev.filter(p => pageIds.includes(p.id));
      if (toGroup.length < 2) return prev;

      const tabs = toGroup.flatMap(p =>
        p.tabs.length === 1
          ? [{ ...p.tabs[0], id: p.id, label: p.title }]
          : p.tabs,
      );

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
    <PagesContext.Provider value={{ pages, sections, getPage, createPage, createSection, removeSection, groupPages, ungroupPage }}>
      {children}
    </PagesContext.Provider>
  );
}

export function usePages() {
  const ctx = useContext(PagesContext);
  if (!ctx) throw new Error('usePages must be used within PagesProvider');
  return ctx;
}
