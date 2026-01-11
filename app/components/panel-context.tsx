'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PanelRegistry {
  register: (slug: string, id: string) => void;
  unregister: (slug: string, id: string) => void;
  isFirst: (slug: string, id: string) => boolean;
}

const PanelContext = createContext<PanelRegistry | null>(null);

export function PanelProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<Map<string, string>>(new Map());

  const register = useCallback((slug: string, id: string) => {
    setRegistry(prev => {
      if (!prev.has(slug)) {
        const next = new Map(prev);
        next.set(slug, id);
        return next;
      }
      return prev;
    });
  }, []);

  const unregister = useCallback((slug: string, id: string) => {
    setRegistry(prev => {
      if (prev.get(slug) === id) {
        const next = new Map(prev);
        next.delete(slug);
        return next;
      }
      return prev;
    });
  }, []);

  const isFirst = useCallback((slug: string, id: string) => {
    return registry.get(slug) === id || !registry.has(slug);
  }, [registry]);

  return (
    <PanelContext.Provider value={{ register, unregister, isFirst }}>
      {children}
    </PanelContext.Provider>
  );
}

export function usePanelRegistry() {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanelRegistry must be used within PanelProvider');
  }
  return context;
}
