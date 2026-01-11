'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';

const HydrationContext = createContext(false);

export const useIsPageReady = () => useContext(HydrationContext);

export default function HydrationGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fadeOut, setFadeOut] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      // Wait a frame so the overlay is painted first, then fade out
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFadeOut(true);
        });
      });
      // Mark as ready after fade completes
      setTimeout(() => setIsReady(true), 150);
    }
  }, []);

  return (
    <HydrationContext.Provider value={isReady}>
      {/* Overlay that fades out */}
      <div
        className={`fixed inset-0 z-[9999] bg-background pointer-events-none transition-opacity duration-300 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {children}
    </HydrationContext.Provider>
  );
}
