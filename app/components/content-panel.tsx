'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReactNode, useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface ContentPanelProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export default function ContentPanel({
  trigger,
  title,
  children,
}: ContentPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  // Lock body scroll when desktop panel is open
  useEffect(() => {
    if (isOpen && isDesktop) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, isDesktop]);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>

      {/* Desktop: Custom overlay */}
      {isDesktop && (
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className='fixed inset-0 z-50 bg-background/50'
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className='fixed inset-x-0 bottom-0 top-8 md:top-6 z-50 bg-background rounded-t-2xl overflow-hidden max-w-6xl mx-auto left-0 right-0 drop-shadow-[0_-20px_32px_rgba(0,0,0,0.5)]'
              >
                <div className='h-full flex flex-col'>
                  <header className='flex items-center justify-end pr-8 w-full pt-8'>
                    <button
                      onClick={() => setIsOpen(false)}
                      className='p-3 bg-muted hover:scale-107 duration-200 rounded-full'
                    >
                      <X className='size-7' strokeWidth={1.5} />
                    </button>
                  </header>
                  <div className='flex-1 overflow-y-auto px-4 pb-8 pt-6'>
                    <div className='max-w-screen-sm mx-auto'>{children}</div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Mobile: Drawer with drag */}
      {!isDesktop && (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className='h-screen max-h-screen rounded-none'>
            <DrawerHeader className='flex flex-row items-center justify-center max-w-screen-sm mx-auto w-full'>
              <DrawerTitle className='text-2xl'>{title}</DrawerTitle>
            </DrawerHeader>
            <div className='flex-1 overflow-y-auto px-4 pb-8'>
              <div className='max-w-screen-sm mx-auto'>{children}</div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
