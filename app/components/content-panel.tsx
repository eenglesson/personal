'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef,
  useId,
} from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { usePanelRegistry } from './panel-context';
import { Drawer } from 'vaul';
import { useIsPageReady } from './hydration-gate';

interface ContentPanelProps {
  slug: string;
  trigger: ReactNode;
  title: string;
  children: ReactNode;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatches = () => setMatches(media.matches);
    updateMatches();

    media.addEventListener('change', updateMatches);
    return () => media.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}

export default function ContentPanel({
  slug,
  trigger,
  title,
  children,
}: ContentPanelProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const triggerRef = useRef<HTMLDivElement>(null);
  const instanceId = useId();
  const { register, unregister, isFirst } = usePanelRegistry();

  const isOpen = searchParams.get('panel') === slug;
  const shouldRenderPanel = isOpen && isFirst(slug, instanceId);

  // Register this instance when panel opens
  useEffect(() => {
    if (isOpen) {
      register(slug, instanceId);
      return () => unregister(slug, instanceId);
    }
  }, [isOpen, slug, instanceId, register, unregister]);

  const setIsOpen = useCallback(
    (open: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      if (open) {
        params.set('panel', slug);
      } else {
        params.delete('panel');
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname, slug]
  );

  // Lock body scroll when panel is open (desktop only - Vaul handles mobile)
  useEffect(() => {
    if (isOpen && isDesktop) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, isDesktop]);

  const isHydrated = isDesktop !== null;
  const showDesktop = isDesktop === true;
  const isPageReady = useIsPageReady();

  return (
    <>
      <div ref={triggerRef} onClick={() => setIsOpen(true)}>
        {trigger}
      </div>

      {/* Desktop: Custom motion panel */}
      {isPageReady && isHydrated && showDesktop && (
        <AnimatePresence>
          {shouldRenderPanel && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className='fixed inset-0 z-50 bg-background/70'
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{
                  y: 0,
                  transition: { type: 'spring', duration: 0.6, bounce: 0.17 },
                }}
                exit={{
                  y: '100%',
                  filter: 'drop-shadow(0 0px 0px rgba(0,0,0,0))',
                  transition: { type: 'spring', duration: 0.6 },
                }}
                className='fixed -bottom-16 top-6 lg:top-8 left-0 right-0 md:left-8 md:right-8 lg:left-16 lg:right-16 z-50 bg-background rounded-t-2xl overflow-hidden lg:max-w-6xl lg:mx-auto drop-shadow-[0_-2px_12px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_-0px_30px_rgba(0,0,0,0.8)]'
              >
                <div className='relative h-full flex flex-col'>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label='Close'
                    className='absolute right-6 top-6 p-3 bg-muted hover:scale-107 duration-200 rounded-full '
                  >
                    <X className='size-7' strokeWidth={1.5} />
                  </button>

                  <div className='flex-1 overflow-y-auto px-4 pb-56 pt-32 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                    <div className='max-w-[540px] mx-auto'>{children}</div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Mobile: Vaul Drawer */}
      {isPageReady && isDesktop === false && (
        <Drawer.Root
          open={shouldRenderPanel}
          onOpenChange={(open) => setIsOpen(open)}
        >
          <Drawer.Portal>
            <Drawer.Overlay className='fixed inset-0 z-50 bg-background/80' />
            <Drawer.Content className='fixed inset-x-0 -bottom-16 top-8 z-50 bg-background rounded-t-2xl overflow-hidden drop-shadow-[0_-8px_12px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_-4px_12px_rgba(0,0,0,0.5)] outline-none focus:outline-none'>
              <Drawer.Title className='sr-only'>{title}</Drawer.Title>
              <div className='h-full flex flex-col'>
                <div className='flex justify-center pt-3 pb-3'>
                  <Drawer.Handle className='w-10 h-1 bg-muted-foreground/30 rounded-full' />
                </div>
                <div className='flex-1 overflow-y-auto px-4 pt-12 pb-56 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                  <div className='max-w-screen-sm mx-auto'>{children}</div>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
    </>
  );
}
