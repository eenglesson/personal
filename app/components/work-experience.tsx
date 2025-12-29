'use client';
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  motion,
} from 'motion/react';
import { useState } from 'react';

const paragraphs = [
  'Currently developing AI applications at Ericsson and making it beautiful',
  'Previously studied frontend development',
  'Before that I was working in different fields as salesperson and industrial worker',
  'I have been lucky to find my passion for AI development',
];

interface WorkExperienceProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export default function WorkExperience({ containerRef }: WorkExperienceProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'], // Track from top of aside at viewport top, to bottom of aside at viewport top
  });

  const activeIndexFloat = useTransform(
    scrollYProgress,
    [0, 0.3], // All paragraphs cycle through in first 40% of scroll
    [0, paragraphs.length]
  );

  useMotionValueEvent(activeIndexFloat, 'change', (latest) => {
    const clamped = Math.max(
      0,
      Math.min(paragraphs.length - 1, Math.floor(latest))
    );
    setActiveIndex(clamped);
  });

  return (
    <section className='text-xl lg:text-2xl flex flex-col gap-8'>
      {paragraphs.map((text, index) => (
        <motion.p
          key={index}
          animate={{
            opacity: index === activeIndex ? 1 : 0.3,
          }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className='text-foreground'
        >
          {text}
        </motion.p>
      ))}
    </section>
  );
}
