'use client';
import { TextEffect } from '@/components/motion-primitives/text-effect';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRef } from 'react';
import { flushSync } from 'react-dom';

const entranceVariants = {
  hidden: {
    opacity: 0,
    filter: 'blur(0px)',
    y: 8,
  },
  visible: (delay: number) => ({
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      opacity: { type: 'spring' as const, bounce: 0, duration: 1.4, delay },
      y: { type: 'spring' as const, bounce: 0, duration: 1.0, delay },
      filter: { type: 'spring' as const, bounce: 0, duration: 1.0, delay },
    },
  }),
};

export default function Header() {
  const { setTheme, resolvedTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleTheme = async () => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

    // Fallback if View Transitions API not supported
    if (
      !buttonRef.current ||
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setTheme(newTheme);
      return;
    }

    // Wait for the transition to be ready
    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    }).ready;

    // Get button position for circle origin
    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    // Calculate radius needed to cover entire screen
    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    // Animate the circle clip-path
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  };

  return (
    <header className='mb-8 flex items-center text-xl relative z-10'>
      <div className='w-full flex flex-col gap-1'>
        <aside className='flex justify-between items-center'>
          <motion.div
            variants={entranceVariants}
            custom={0.3}
            initial='hidden'
            animate='visible'
          >
            <Link href='/' className='font-normal text-blue-600'>
              Elias Englesson
            </Link>
          </motion.div>

          <motion.div
            variants={entranceVariants}
            custom={0.3}
            initial='hidden'
            animate='visible'
          >
            <motion.button
              ref={buttonRef}
              onClick={toggleTheme}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
              className='relative h-4 w-4 rounded-full dark:bg-white bg-black cursor-pointer'
              aria-label='Toggle theme'
            />
          </motion.div>
        </aside>

        <TextEffect
          as='p'
          preset='fade'
          per='char'
          className='text-lg'
          delay={1.1}
        >
          AI Developer
        </TextEffect>
      </div>
    </header>
  );
}
