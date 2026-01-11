'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import SpotifyPlayer from './sp-player';

export default function Footer() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const swedishTime = now.toLocaleTimeString('sv-SE', {
        timeZone: 'Europe/Stockholm',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setTime(swedishTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className='w-full flex flex-col items-center gap-8 mt-16'>
      <SpotifyPlayer />

      <div className='flex items-center gap-8 text-[16px] text-gray-500 cursor-default'>
        <span>{time}</span>
        <span>Gothenburg, SE</span>
        <motion.a
          href='mailto:eliasenglesson00@gmail.com'
          className='flex items-center gap-1 hover:text-blue-600 transition-colors'
          whileHover='hover'
        >
          Email
          <motion.span
            variants={{
              hover: { x: 6 },
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 12,
            }}
          >
            <ArrowRight className='w-4.5 h-4.5' />
          </motion.span>
        </motion.a>
      </div>
    </footer>
  );
}
