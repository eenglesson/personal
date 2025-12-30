'use client';
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  motion,
} from 'motion/react';
import { useState, useEffect } from 'react';

const paragraphs = [
  'Currently developing AI applications at Ericsson and making it beautiful',
  'Previously studied frontend development',
  'Before that I was working in different fields as salesperson and industrial worker',
  'I have been lucky to find my passion for AI development',
];

const entranceVariants = {
  hidden: {
    opacity: 0,
    filter: 'blur(0px)',
    y: 8,
  },
  visible: (index: number) => ({
    opacity: index === 0 ? 1 : 0.3,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      opacity: {
        type: 'spring' as const,
        bounce: 0,
        duration: 3,
        delay: 0.4 + index * 0.1,
      },
      y: {
        type: 'spring' as const,
        bounce: 0,
        duration: 1.0,
        delay: 0.4 + index * 0.1,
      },
      filter: {
        type: 'spring' as const,
        bounce: 0,
        duration: 1.0,
        delay: 0.4 + index * 0.1,
      },
    },
  }),
};

interface WorkExperienceProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export default function WorkExperience({ containerRef }: WorkExperienceProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const activeIndexFloat = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0, paragraphs.length]
  );

  useMotionValueEvent(activeIndexFloat, 'change', (latest) => {
    const clamped = Math.max(
      0,
      Math.min(paragraphs.length - 1, Math.floor(latest))
    );
    setActiveIndex(clamped);
  });

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimatedIn(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className='text-xl flex flex-col gap-6 lg:gap-8'>
      {paragraphs.map((text, index) => (
        <motion.p
          key={index}
          variants={hasAnimatedIn ? undefined : entranceVariants}
          custom={index} // Just pass index, variant handles everything
          initial={hasAnimatedIn ? undefined : 'hidden'}
          animate={
            hasAnimatedIn
              ? { opacity: index === activeIndex ? 1 : 0.3 }
              : 'visible'
          }
          transition={
            hasAnimatedIn
              ? { type: 'spring', stiffness: 100, damping: 20 }
              : undefined
          }
          className='text-foreground'
        >
          {text}
        </motion.p>
      ))}
    </section>
  );
}
